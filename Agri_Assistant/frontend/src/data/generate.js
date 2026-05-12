const fs = require('fs');
const path = require('path');

const dir = path.join('d:', '4th year', 'Agri_Assistant', 'Agri_Assistant', 'frontend', 'src', 'data');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const firstNames = ['Ramesh', 'Amit', 'Sunita', 'Vikram', 'Rajesh', 'Pooja', 'Suresh', 'Anil', 'Meena', 'Kavita', 'Deepak', 'Manoj', 'Sanjay', 'Geeta', 'Kamal', 'Rahul', 'Nisha', 'Arjun', 'Neha', 'Vikas'];
const lastNames = ['Patel', 'Singh', 'Devi', 'Yadav', 'Sharma', 'Kumar', 'Gupta', 'Verma', 'Chauhan', 'Reddy', 'Rao', 'Das', 'Joshi', 'Mishra', 'Pandey'];
const states = ['Gujarat', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Maharashtra', 'Madhya Pradesh', 'Rajasthan', 'Bihar', 'Karnataka', 'Andhra Pradesh', 'Tamil Nadu', 'Telangana', 'West Bengal', 'Odisha', 'Chhattisgarh'];

const templates = [
  "AgriSmart's disease detection saved my entire {crop} crop this year. I uploaded a photo, got the right remedy, and stopped the spread instantly!",
  "The real-time Mandi prices are a game changer. I waited two days based on the prediction and sold my yield at a {percent}% higher profit.",
  "I never knew how much fertilizer I was wasting until I used the NPK calculator. It improved my soil health and cut my costs by {percent}%.",
  "The drone service booking helped me spray my {acres}-acre farm in hours instead of days. So efficient and cost-effective!",
  "Thanks to the AI crop recommendation, I switched to {crop} and saw a {percent}% increase in my overall revenue.",
  "The weather alerts warned me about unseasonal rain 3 days in advance. I managed to protect my {crop} harvest just in time.",
  "Using the government scheme finder, I finally got the subsidy for my new equipment. The process was explained so clearly.",
  "AgriSmart is like having an expert agronomist in my pocket. The tips on organic farming helped me transition my {acres}-acre plot successfully.",
  "I was struggling with a pest infestation, but the image scanner identified it as {pest} and gave me the exact organic pesticide to use.",
  "By following the smart irrigation schedule, I saved over {percent}% water this season while maintaining healthy {crop} growth."
];

const crops = ['wheat', 'rice', 'cotton', 'soybean', 'sugarcane', 'maize', 'mustard', 'potato', 'tomato', 'onion'];
const pests = ['aphids', 'whiteflies', 'stem borers', 'leaf miners', 'spider mites', 'thrips'];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const testimonials = [];

for (let i = 0; i < 100; i++) {
  const template = getRandom(templates);
  let text = template
    .replace('{crop}', getRandom(crops))
    .replace('{percent}', getRandomInt(15, 50))
    .replace('{acres}', getRandomInt(5, 50))
    .replace('{pest}', getRandom(pests));
    
  const author = '- ' + getRandom(firstNames) + ' ' + getRandom(lastNames) + ', ' + getRandom(states);
  testimonials.push({ text, author });
}

const fileContent = 'export const testimonials = ' + JSON.stringify(testimonials, null, 2) + ';';
fs.writeFileSync(path.join(dir, 'testimonialsData.js'), fileContent);
console.log('Successfully generated testimonialsData.js');
