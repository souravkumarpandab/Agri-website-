import sys
import json
import numpy as np
import tensorflow as tf
import io

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

def prepare_image(image, target_size):
    if image.mode != "RGB":
        image = image.convert("RGB")
    image = image.resize(target_size)
    image = np.array(image)
    image = np.expand_dims(image, axis=0)
    image = image.astype(np.float32) 
    image = image / 255.0  
    return image

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

if __name__ == "__main__":
    try:
        if not HAS_PIL:
            raise Exception("Python PIL library (Pillow) is not installed.")

        if len(sys.argv) < 3:
            raise Exception("Missing arguments. Usage: python predict_image.py <image_path> <model_path>")
            
        img_path = sys.argv[1]
        model_path = sys.argv[2]
        
        # Suppress TensorFlow logging to avoid messing up JSON output
        import os
        os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
        
        interpreter = tf.lite.Interpreter(model_path=model_path)
        interpreter.allocate_tensors()
        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()
        
        image = Image.open(img_path)
        processed_image = prepare_image(image, target_size=(224, 224))
        
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

        # Emit output exactly as expected by JSON parser
        print(json.dumps({
            'result': result,
            'confidence': f"{confidence:.2f}%",
            'remedy': remedy
        }))
    except Exception as e:
        print(json.dumps({'error': str(e)}))
