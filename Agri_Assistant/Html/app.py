import os
from dotenv import load_dotenv
load_dotenv()

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
import jwt
import datetime
import tensorflow as tf # We still need this, but we use it lightly
import numpy as np
from PIL import Image
import io
from functools import wraps

try:
    import google.generativeai as genai
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False

app = Flask(__name__)
CORS(app)

# --- DATABASE CONFIG ---
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///agrisahayak.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'agri_super_secret_key_2026'

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# --- MODELS ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    profile = db.relationship('Profile', backref='user', uselist=False)

class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    address = db.Column(db.String(255))
    mobile = db.Column(db.String(15))
    age = db.Column(db.Integer)
    qualification = db.Column(db.String(50))
    farming_type = db.Column(db.String(50))
    finance = db.Column(db.String(50))

# Create tables
with app.app_context():
    db.create_all()

# --- AUTH MIDDLEWARE ---
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
            
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['user_id']).first()
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

# --- AUTH ENDPOINTS ---
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User already exists!'}), 400
        
    new_user = User(full_name=data['fullName'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully!'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not bcrypt.check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Login failed! Check email and password.'}), 401
        
    token = jwt.encode({'user_id': user.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, app.config['SECRET_KEY'], algorithm="HS256")
    
    return jsonify({
        'token': token,
        'user': {'id': user.id, 'fullName': user.full_name, 'email': user.email}
    })

@app.route('/api/profile', methods=['GET', 'POST'])
@token_required
def profile(current_user):
    if request.method == 'POST':
        data = request.get_json()
        prof = Profile.query.filter_by(user_id=current_user.id).first()
        
        if not prof:
            prof = Profile(user_id=current_user.id)
            db.session.add(prof)
            
        prof.address = data.get('address', prof.address)
        prof.mobile = data.get('mobile', prof.mobile)
        prof.age = data.get('age', prof.age)
        prof.qualification = data.get('qualification', prof.qualification)
        prof.farming_type = data.get('farmingType', prof.farming_type)
        prof.finance = data.get('finance', prof.finance)
        
        db.session.commit()
        return jsonify({'message': 'Profile updated successfully!'})
        
    prof = Profile.query.filter_by(user_id=current_user.id).first()
    if not prof:
        return jsonify({})
        
    return jsonify({
        'address': prof.address,
        'mobile': prof.mobile,
        'age': prof.age,
        'qualification': prof.qualification,
        'farmingType': prof.farming_type,
        'finance': prof.finance
    })

# --- 1. LOAD THE TFLITE MODEL (Lightweight) ---
print("⏳ Loading TFLite Model...")
interpreter = tf.lite.Interpreter(model_path="model.tflite")
interpreter.allocate_tensors()

# Get input and output details
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()
print("✅ TFLite Model Loaded!")

# --- 2. CLASS NAMES ---
class_names = [
    'Apple - Apple Scab', 'Apple - Black Rot', 'Apple - Cedar Apple Rust', 'Apple - Healthy',
    'Blueberry - Healthy',
    'Cherry - Powdery Mildew', 'Cherry - Healthy',
    'Corn - Cercospora Leaf Spot (Gray Leaf Spot)', 'Corn - Common Rust', 'Corn - Northern Leaf Blight', 'Corn - Healthy',
    'Grape - Black Rot', 'Grape - Esca (Black Measles)', 'Grape - Leaf Blight', 'Grape - Healthy',
    'Orange - Haunglongbing (Citrus Greening)',
    'Peach - Bacterial Spot', 'Peach - Healthy',
    'Pepper Bell - Bacterial Spot', 'Pepper Bell - Healthy',
    'Potato - Early Blight', 'Potato - Late Blight', 'Potato - Healthy',
    'Raspberry - Healthy',
    'Soybean - Healthy',
    'Squash - Powdery Mildew',
    'Strawberry - Leaf Scorch', 'Strawberry - Healthy',
    'Tomato - Bacterial Spot', 'Tomato - Early Blight', 'Tomato - Late Blight', 'Tomato - Leaf Mold', 
    'Tomato - Septoria Leaf Spot', 'Tomato - Spider Mites', 'Tomato - Target Spot', 
    'Tomato - Yellow Leaf Curl Virus', 'Tomato - Mosaic Virus', 'Tomato - Healthy'
]

def prepare_image(image, target_size):
    if image.mode != "RGB":
        image = image.convert("RGB")
    image = image.resize(target_size)
    image = np.array(image)
    image = np.expand_dims(image, axis=0)
    # TFLite expects float32
    image = image.astype(np.float32) 
    image = image / 255.0  
    return image

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    
    try:
        image = Image.open(io.BytesIO(file.read()))
        # TFLite usually expects 224x224, check your training if it fails
        processed_image = prepare_image(image, target_size=(224, 224))
        
        # --- PREDICTION USING TFLITE ---
        interpreter.set_tensor(input_details[0]['index'], processed_image)
        interpreter.invoke()
        output_data = interpreter.get_tensor(output_details[0]['index'])
        
        prediction = output_data[0]
        index = np.argmax(prediction)
        confidence = float(np.max(prediction)) * 100
        result = class_names[index]
        
        remedy = "Consult a local agriculture expert."
        if "Healthy" in result:
            remedy = "Your plant is healthy! Keep monitoring water and sunlight."
        elif "Bacterial" in result:
            remedy = "Use copper-based bactericides and avoid overhead watering."
        elif "Fungus" in result or "Blight" in result or "Rot" in result:
            remedy = "Apply fungicides like Mancozeb. Remove infected leaves immediately."
        elif "Virus" in result:
            remedy = "No chemical cure. Remove infected plants to prevent spread."

        return jsonify({
            'result': result,
            'confidence': f"{confidence:.2f}%",
            'remedy': remedy
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

import random

def generate_bot_response(user_msg):
    msg = user_msg.lower()
    if 'hello' in msg or 'hi' in msg:
        return "Hello! I am AgriSahayak's assistant. How can I help you with your farming needs today?"
    if 'blight' in msg or 'disease' in msg:
        return "If you suspect a plant disease like blight, remove infected leaves quickly. Applying a fungicide can help. You can also upload a photo on our Disease Detection page for a specific diagnosis!"
    if 'weather' in msg or 'rain' in msg:
        return "Weather affects crops heavily! Make sure to check our Weather page for the latest forecasts. If heavy rain is expected, ensure proper field drainage."
    if 'crop' in msg or 'recommend' in msg:
        return "Not sure what to plant? Use our Crop Recommendation tool! It analyzes soil nutrients and climate to suggest the best crop."
    if 'price' in msg or 'market' in msg:
        return "You can check real-time market prices on our Market dashboard. This helps you sell your yield at the best time."
    if 'loan' in msg or 'scheme' in msg or 'subsidy' in msg:
        return "The government offers various schemes and subsidies for farmers. Check our Government Schemes page for more details, such as PM-Kisan."
    if 'irrigation' in msg or 'water' in msg:
        return "Proper irrigation is key! Drip irrigation saves water and provides steady moisture. Avoid overhead watering if plants are prone to fungal diseases."
    if 'fertilizer' in msg or 'urea' in msg:
        return "Remember to balance your fertilizers (N-P-K). Overusing nitrogen can lead to lush growth but weaker plants susceptible to pests."
    
    responses = [
        "That's an interesting question about farming. Could you provide a bit more detail?",
        "I'm here to help with agricultural advice! You can ask me about crop diseases, weather, or farming tips.",
        "To give you the best advice, could you clarify what type of crop you are working with?",
        "I'm an AI assistant built for AgriSahayak. My knowledge is focused on agriculture and farming best practices!"
    ]
    return random.choice(responses)

# Configure Gemini
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if HAS_GENAI and GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-1.5-flash')
else:
    gemini_model = None

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')
    if not user_message:
        return jsonify({'response': "Please say something!"})
    
    if gemini_model:
        try:
            prompt = f"You are AgriSahayak, an expert agricultural AI assistant in India helping farmers. Keep your answer concise, friendly, and practical: {user_message}"
            response = gemini_model.generate_content(prompt)
            return jsonify({'response': response.text})
        except Exception as e:
            # Fallback
            return jsonify({'response': generate_bot_response(user_message)})
    else:
        # Fallback if no key
        bot_reply = generate_bot_response(user_message)
        return jsonify({'response': bot_reply})

@app.route('/api/recommend-crop', methods=['POST'])
def recommend_crop():
    data = request.get_json()
    
    try:
        # Front-end sends N, P, K, temperature, humidity, ph, rainfall
        N = float(data.get('N', 0))
        P = float(data.get('P', 0))
        K = float(data.get('K', 0))
        T = float(data.get('temperature', 0))
        H = float(data.get('humidity', 0))
        PH = float(data.get('ph', 0))
        R = float(data.get('rainfall', 0))
        
        # New Contextual Parameters
        season = data.get('season', 'Kharif')
        soil_type = data.get('soilType', 'Loamy')
        technique = data.get('farmingTechnique', 'Traditional')

        if gemini_model:
            prompt = (
                f"Act as an expert agronomist in India. A farmer has provided the following soil and weather parameters:\n"
                f"- Nitrogen (N): {N}\n"
                f"- Phosphorus (P): {P}\n"
                f"- Potassium (K): {K}\n"
                f"- Temperature: {T}°C\n"
                f"- Humidity: {H}%\n"
                f"- pH Level: {PH}\n"
                f"- Rainfall: {R} mm\n\n"
                f"**Cultivation Preferences:**\n"
                f"- Season: {season}\n"
                f"- Soil Type: {soil_type}\n"
                f"- Farming Technique: {technique}\n\n"
                f"Based on these specific metrics, recommend the top 2 most suitable crops to plant. "
                f"Provide a brief, encouraging explanation (3-4 sentences) on why these crops are ideal for this precise soil health, climate, season, and chosen farming technique. Keep it professional but easy to read."
            )
            response = gemini_model.generate_content(prompt)
            return jsonify({'prediction': response.text})
            
        else:
            # Fallback algorithm if Gemini key is missing
            crop = "Wheat"
            if 6 <= PH <= 7 and R > 200:
                crop = "Rice"
            elif N > 100 and K > 40:
                crop = "Maize"
            elif T > 28 and H > 70:
                crop = "Sugarcane"
            elif PH < 6:
                crop = "Potato"
            elif R < 150:
                crop = "Millet"

            fallback_text = f"**{crop}** (AI Model Unavailable. This is a basic rule-based suggestion. Please add GEMINI_API_KEY for advanced AI analysis.)"
            return jsonify({'prediction': fallback_text})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/mandi-ai', methods=['POST'])
def mandi_ai():
    data = request.get_json()
    crop = data.get('crop', 'Unknown')
    district = data.get('district', 'Unknown')
    prices = data.get('prices', {})

    if not gemini_model:
        return jsonify({'analysis': "AI Market Analyst is currently unavailable. Please provide a GEMINI_API_KEY for deep market insights."})

    try:
        prompt = (
            f"Act as an expert Indian agricultural market analyst. A farmer in {district}, Odisha is looking to sell their {crop}.\n"
            f"Current Market Data (₹/Quintal):\n"
            f"- Local Odisha Mandi: ₹{prices.get('odAvg')} (Min: {prices.get('odMin')}, Max: {prices.get('odMax')})\n"
            f"- All-India Average: ₹{prices.get('inAvg')}\n"
            f"- International Export: ₹{prices.get('exAvg')}\n\n"
            f"Analyze these prices. Give the farmer actionable advice in exactly 2 short paragraphs: \n"
            f"1. A quick verdict on whether they should sell locally now, wait, or target export/national markets.\n"
            f"2. A brief market trend prediction for {crop} (seasonal pricing, demand)."
        )
        response = gemini_model.generate_content(prompt)
        return jsonify({'analysis': response.text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/fertilizer-ai', methods=['POST'])
def fertilizer_ai():
    data = request.get_json()
    crop = data.get('crop', 'Wheat')
    area = float(data.get('area', 1))
    measure = data.get('measure', 'Acres')
    n = float(data.get('N', 0))
    p = float(data.get('P', 0))
    k = float(data.get('K', 0))

    if not gemini_model:
        return jsonify({'recommendation': "AI Fertilizer Calculator is unavailable. Please input a GEMINI_API_KEY to calculate NPK ratios."})

    try:
        prompt = (
            f"Act as a precise Indian Soil Scientist. A farmer is planting {crop} on {area} {measure} of land.\n"
            f"Their current soil nutrient levels are:\n"
            f"Nitrogen (N): {n}\n"
            f"Phosphorus (P): {p}\n"
            f"Potassium (K): {k}\n\n"
            f"Provide a highly accurate, calculated fertilizer recommendation. \n"
            f"1. Exactly how many KGs (or bags) of Urea, DAP, and MOP are needed for this specific land area?\n"
            f"2. What organic alternatives (like Vermicompost, FYM, Jeevamrutha) can be used to supplement this?\n"
            f"Ensure your response is formatted beautifully with bullet points, focusing entirely on practical amounts to buy and apply."
        )
        response = gemini_model.generate_content(prompt)
        return jsonify({'recommendation': response.text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)