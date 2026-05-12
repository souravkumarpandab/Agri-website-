import json
import random
import os

first_names = ['Ramesh', 'Amit', 'Sunita', 'Vikram', 'Rajesh', 'Anita', 'Harish', 'Manoj', 'Lakshmi', 'Suresh', 'Kavita', 'Dilip', 'Geeta', 'Anil', 'Pooja', 'Prakash', 'Meena', 'Raju', 'Kiran', 'Sanjay', 'Aruna', 'Vijay', 'Neha', 'Gopal', 'Radha', 'Dinesh', 'Savita', 'Ashok', 'Manju', 'Mukesh', 'Rekha', 'Pramod', 'Seema', 'Santosh', 'Asha']
last_names = ['Patel', 'Singh', 'Devi', 'Yadav', 'Kumar', 'Rao', 'Tiwari', 'N.', 'Sharma', 'Gupta', 'Mishra', 'Reddy', 'Chauhan', 'Das', 'Joshi', 'Verma', 'Shah', 'Nair', 'Pillai', 'Gowda', 'Bhatt', 'Kapoor', 'Choudhury', 'Jain', 'Thakur']
states = ['Gujarat', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Maharashtra', 'Bihar', 'Karnataka', 'Rajasthan', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana', 'West Bengal', 'Odisha', 'Kerala', 'Assam', 'Chhattisgarh', 'Jharkhand', 'Himachal Pradesh', 'Uttarakhand']
features = ['disease detection', 'Mandi prices tracker', 'NPK calculator', 'drone service booking', 'weather forecasting', 'government schemes finder', 'soil analysis', 'organic farming tips', 'pest scanner', 'crop recommendation AI']
crops = ['wheat', 'rice', 'maize', 'cotton', 'sugarcane', 'soybean', 'mustard', 'groundnut', 'bajra', 'jowar', 'tomato', 'potato', 'onion', 'chickpea', 'sunflower']
benefits = [
    'saved my entire {crop} crop this year.',
    'helped me sell my {crop} yield at a 20% higher profit.',
    'cut my fertilizer costs by half while boosting my {crop} yield.',
    'sprayed my 10-acre {crop} farm in hours instead of days.',
    'prevented a massive loss by alerting me before an unseasonal storm hit my {crop}.',
    'helped me secure a subsidy that I used to improve my {crop} farm.',
    'showed me my soil lacked Potassium; fixing this doubled my {crop} harvest.',
    'allowed me to transition my {crop} farm to 100% organic without losing yield.',
    'identified a rare pest on my {crop} leaves and suggested the perfect bio-pesticide.',
    'told me to switch to {crop} based on my soil, and it was the most profitable decision ever.'
]

testimonials = []

# Ensure the original 9 are at the top to preserve quality
originals = [
  {
    "text": "AgriSmart's disease detection saved my entire wheat crop this year. I uploaded a photo, got the right remedy, and stopped the spread instantly!",
    "author": "- Ramesh Patel, Gujarat"
  },
  {
    "text": "The real-time Mandi prices are a game changer. I waited two days based on the prediction and sold my yield at a 15% higher profit.",
    "author": "- Amit Singh, Punjab"
  },
  {
    "text": "I never knew how much fertilizer I was wasting until I used the NPK calculator. It improved my soil health and cut my costs by half.",
    "author": "- Sunita Devi, Haryana"
  },
  {
    "text": "The drone service booking helped me spray my 10-acre farm in hours instead of days. So efficient and cost-effective!",
    "author": "- Vikram Yadav, Uttar Pradesh"
  },
  {
    "text": "The AI weather forecasting accurately predicted an unseasonal frost. I adjusted my irrigation in time, preventing a massive loss. This app is a lifesaver!",
    "author": "- Rajesh Kumar, Madhya Pradesh"
  },
  {
    "text": "I used the Government Schemes finder and finally secured a subsidy for my solar water pump. The guidance was completely seamless.",
    "author": "- Anita Rao, Maharashtra"
  },
  {
    "text": "Connecting directly with real-time market data removed the middlemen's advantage. My income has increased by almost 30% this season.",
    "author": "- Harish Patel, Gujarat"
  },
  {
    "text": "The soil analysis feature is brilliant. After adjusting my Nitrogen levels exactly as suggested, my maize yield was the highest I've seen in a decade.",
    "author": "- Manoj Tiwari, Bihar"
  },
  {
    "text": "AgriSahayak's organic farming tips helped me transition smoothly away from chemicals. The community forum gave me answers exactly when I needed them.",
    "author": "- Lakshmi N., Karnataka"
  }
]

testimonials.extend(originals)

for i in range(100):
    name = random.choice(first_names) + ' ' + random.choice(last_names)
    state = random.choice(states)
    feature = random.choice(features)
    crop = random.choice(crops)
    benefit = random.choice(benefits).format(crop=crop)
    
    intros = [
        f"AgriSmart's {feature} {benefit}",
        f"I never knew how helpful the {feature} could be until it {benefit}",
        f"Thanks to the {feature}, I {benefit} Highly recommended!",
        f"Using the {feature} was a game changer. It {benefit}",
        f"The {feature} is brilliant. It {benefit}"
    ]
    
    text = random.choice(intros)
    author = f"- {name}, {state}"
    testimonials.append({'text': text, 'author': author})

os.makedirs('frontend/src/data', exist_ok=True)
js_content = 'export const testimonials = ' + json.dumps(testimonials, indent=2) + ';'
with open('frontend/src/data/testimonials.js', 'w', encoding='utf-8') as f:
    f.write(js_content)
