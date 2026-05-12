import React, { createContext, useState, useContext, useEffect } from 'react';

const translations = {
  en: {
    nav_home: "Home",
    nav_about: "About Us",
    nav_services: "Services",
    nav_login: "Login / Register",
    hero_title: "Smart Farming for a <br />Better Future",
    hero_desc: "Your digital agriculture assistant. Get AI-driven crop advice, disease detection, real-time market insights, and government scheme recommendations in one place.",
    hero_btn: "Get Started Now",
    about_small: "Who We Are",
    about_title: "Revolutionizing Agriculture with AI & Data",
    about_p1: "Agriculture is the heartbeat of our world, yet farmers face unprecedented climate and market challenges. AgriSmart bridges the gap between ancestral farming wisdom and next-generation technology, empowering you with hyper-local satellite data and predictive Artificial Intelligence.",
    about_p2: "From real-time disease detection and precise fertilizer optimization to live Mandi rates and climate forecasting, AgriSmart is your ultimate 24/7 digital companion. We are on a mission to maximize your yields, minimize costs, and secure a prosperous future for every farming community.",
    service_title: "Our Key Services",
    card1_title: "Crop Recommendation",
    card1_desc: "AI suggestions based on soil health card data, local rainfall patterns, and temperature.",
    card2_title: "Fertilizer Calculator",
    card2_desc: "Calculate precise NPK requirements for your specific crop to save costs and improve soil.",
    card3_title: "Pest & Disease Detection",
    card3_desc: "Simply upload a photo of an affected leaf. Our AI will identify the disease and suggest remedies.",
    card4_title: "Weather Alerts",
    card4_desc: "Hyper-local weather forecasts, storm warnings, and irrigation advisories.",
    card5_title: "Govt. Schemes",
    card5_desc: "Discover eligibility for PM-Kisan Samman Nidhi, PMFBY insurance, and KCC loans.",
    card6_title: "Market (Mandi) Prices",
    card6_desc: "Live price updates from nearby APMC markets to help you sell at the right time.",
    card7_title: "Digital Farming Guide",
    card7_desc: "Learn about precision agriculture, drone usage for spraying, and IoT soil sensors.",
    card8_title: "Natural Farming Tips",
    card8_desc: "Guidance on organic composting, Jeevamrutham, and reducing chemical dependency.",
    card9_title: "AI Chatbot Assistant",
    card9_desc: "Have a question? Chat with our multilingual assistant anytime for instant advice.",
    chat_header: "AgriSahayak Assistant",
    chat_welcome: "Namaste! I am AgriSmart. Ask me about crops, weather, or market prices.",
    chat_placeholder: "Type your query here..."
  },
  hi: {
    nav_home: "होम",
    nav_about: "हमारे बारे में",
    nav_services: "सेवाएं",
    nav_login: "लॉगिन / रजिस्टर",
    hero_title: "स्मार्ट खेती, <br />बेहतर भविष्य",
    hero_desc: "आपका डिजिटल कृषि सहायक। फसल सलाह, रोग पहचान, मंडी भाव और सरकारी योजनाओं की जानकारी एक ही जगह पर प्राप्त करें।",
    hero_btn: "अभी शुरू करें",
    about_small: "हम कौन हैं",
    about_title: "एआई और डेटा के साथ कृषि में क्रांति",
    about_p1: "कृषि हमारी दुनिया की धड़कन है, फिर भी किसानों को अभूतपूर्व जलवायु और बाजार की चुनौतियों का सामना करना पड़ता है। एग्रीस्मार्ट (AgriSmart) पारंपरिक कृषि ज्ञान और अगली पीढ़ी की तकनीक के बीच एक पुल बनाता है, जो आपको हाइपर-लोकल सैटेलाइट डेटा और एआई के साथ सशक्त बनाता है।",
    about_p2: "रीयल-टाइम रोग पहचान और सटीक उर्वरक प्रबंधन से लेकर लाइव मंडी भाव और मौसम पूर्वानुमान तक, एग्रीस्मार्ट आपका 24/7 डिजिटल साथी है। हमारा मिशन आपकी उपज को अधिकतम करना, लागत को कम करना और हर किसान के लिए एक समृद्ध भविष्य सुनिश्चित करना है।",
    service_title: "हमारी प्रमुख सेवाएं",
    card1_title: "फसल सलाह",
    card1_desc: "मिट्टी स्वास्थ्य कार्ड, बारिश और तापमान के आधार पर एआई सुझाव।",
    card2_title: "उर्वरक कैलकुलेटर",
    card2_desc: "लागत बचाने और मिट्टी सुधारने के लिए सही एनपीके (NPK) मात्रा की गणना करें।",
    card3_title: "कीट और रोग पहचान",
    card3_desc: "पत्ती की फोटो अपलोड करें। हमारा एआई बीमारी की पहचान करेगा और उपाय बताएगा।",
    card4_title: "मौसम चेतावनी",
    card4_desc: "स्थानीय मौसम पूर्वानुमान, तूफान की चेतावनी और सिंचाई सलाह।",
    card5_title: "सरकारी योजनाएं",
    card5_desc: "पीएम-किसान, फसल बीमा और केसीसी (KCC) ऋण के लिए पात्रता जांचें।",
    card6_title: "मंडी भाव",
    card6_desc: "सही समय पर बेचने के लिए नजदीकी मंडियों से लाइव भाव अपडेट।",
    card7_title: "डिजिटल खेती गाइड",
    card7_desc: "सटीक खेती, ड्रोन के उपयोग और मिट्टी सेंसर के बारे में जानें।",
    card8_title: "प्राकृतिक खेती",
    card8_desc: "जैविक खाद, जीवामृत और रसायनों को कम करने पर मार्गदर्शन।",
    card9_title: "एआई चैटबॉट",
    card9_desc: "कोई सवाल है? हमारे सहायक से किसी भी समय सलाह लें।",
    chat_header: "कृषि सहायक",
    chat_welcome: "नमस्ते! मैं एग्री सहायक हूँ। मुझसे फसल, मौसम या मंडी भाव के बारे में पूछें।",
    chat_placeholder: "अपना सवाल यहाँ लिखें..."
  },
  or: {
    nav_home: "ମୂଳ ପୃଷ୍ଠା",
    nav_about: "ଆମ ବିଷୟରେ",
    nav_services: "ସେବା",
    nav_login: "ଲଗ୍ ଇନ୍ / ପଞ୍ଜିକରଣ",
    hero_title: "ସ୍ମାର୍ଟ ଚାଷ,<br />ଉନ୍ନତ ଭବିଷ୍ୟତ",
    hero_desc: "ଆପଣଙ୍କର ଡିଜିଟାଲ୍ କୃଷି ସହଯୋଗୀ | ଫସଲ ପରାମର୍ଶ, ରୋଗ ଚିହ୍ନଟ, ମଣ୍ଡି ଦର ଏବଂ ସରକାରୀ ଯୋଜନା ବିଷୟରେ ଜାଣନ୍ତୁ |",
    hero_btn: "ଏବେ ଆରମ୍ଭ କରନ୍ତୁ",
    about_small: "ଆମ ବିଷୟରେ ଜାଣନ୍ତୁ",
    about_title: "AI ଏବଂ ଡାଟା ସହିତ କୃଷି କ୍ଷେତ୍ରରେ ବିପ୍ଳବ",
    about_p1: "କୃଷି ହେଉଛି ଆମ ଦୁନିଆର ହୃଦସ୍ପନ୍ଦନ, ତଥାପି କୃଷକମାନେ ଅନେକ ଜଳବାୟୁ ଏବଂ ବଜାର ଆହ୍ୱାନର ସମ୍ମୁଖୀନ ହେଉଛନ୍ତି | ଆପଣଙ୍କୁ ହାଇପର-ଲୋକାଲ୍ ସାଟେଲାଇଟ୍ ଡାଟା ଏବଂ AI ସହିତ ସଶକ୍ତ କରିବା ପାଇଁ ଏଗ୍ରିସ୍ମାର୍ଟ (AgriSmart) ପାରମ୍ପାରିକ କୃଷି ଜ୍ଞାନ ଏବଂ ଆଧୁନିକ ଜ୍ଞାନକୌଶଳକୁ ଏକତ୍ର କରିଥାଏ |",
    about_p2: "ରୋଗ ଚିହ୍ନଟ, ସଠିକ୍ ସାର ପରିଚାଳନା ଠାରୁ ଆରମ୍ଭ କରି ଲାଇଭ୍ ମଣ୍ଡି ଦର ଏବଂ ପାଣିପାଗ ପୂର୍ବାନୁମାନ ପର୍ଯ୍ୟନ୍ତ, ଏଗ୍ରିସ୍ମାର୍ଟ ହେଉଛି ଆପଣଙ୍କର 24/7 ଡିଜିଟାଲ୍ ସାଥୀ | ଆମର ଲକ୍ଷ୍ୟ ହେଉଛି ଆପଣଙ୍କର ଅମଳ ବୃଦ୍ଧି କରିବା, ଖର୍ଚ୍ଚ କମାଇବା ଏବଂ ପ୍ରତ୍ୟେକ କୃଷକଙ୍କ ପାଇଁ ଏକ ଉଜ୍ଜ୍ୱଳ ଭବିଷ୍ୟତ ସୁନିଶ୍ଚିତ କରିବା |",
    service_title: "ଆମର ମୁଖ୍ୟ ସେବା",
    card1_title: "ଫସଲ ପରାମର୍ଶ",
    card1_desc: "ମୃତ୍ତିକା ସ୍ୱାସ୍ଥ୍ୟ କାର୍ଡ, ବର୍ଷା ଏବଂ ତାପମାତ୍ରା ଉପରେ ଆଧାରିତ AI ପରାମର୍ଶ |",
    card2_title: "ସାର କାଲକୁଲେଟର",
    card2_desc: "ଖର୍ଚ୍ଚ ବଞ୍ଚାଇବା ଏବଂ ମାଟିର ଉନ୍ନତି ପାଇଁ ସଠିକ୍ NPK ଆବଶ୍ୟକତା ଗଣନା କରନ୍ତୁ |",
    card3_title: "ରୋଗ ଚିହ୍ନଟ",
    card3_desc: "ପତ୍ରର ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ | ଆମର AI ରୋଗ ଚିହ୍ନଟ କରିବ ଏବଂ ପ୍ରତିକାର ପରାମର୍ଶ ଦେବ |",
    card4_title: "ପାଣିପାଗ ସୂଚନା",
    card4_desc: "ସ୍ଥାନୀୟ ପାଣିପାଗ ପୂର୍ବାନୁମାନ, ଝଡ ଚେତାବନୀ ଏବଂ ଜଳସେଚନ ପରାମର୍ଶ |",
    card5_title: "ସରକାରୀ ଯୋଜନା",
    card5_desc: "PM- କିଷାନ, ଫସଲ ବୀମା ଏବଂ KCC ଋଣ ପାଇଁ ଯୋଗ୍ୟତା ଜାଣନ୍ତୁ |",
    card6_title: "ମଣ୍ଡି ଦର",
    card6_desc: "ସଠିକ୍ ସମୟରେ ବିକ୍ରୟ କରିବାରେ ସାହାଯ୍ୟ କରିବାକୁ ନିକଟସ୍ଥ ମଣ୍ଡିରୁ ଲାଇଭ୍ ମୂଲ୍ୟ ଅପଡେଟ୍ |",
    card7_title: "ଡିଜିଟାଲ୍ ଚାଷ ଗାଇଡ୍",
    card7_desc: "ସଠିକ୍ କୃଷି, ଡ୍ରୋନ୍ ବ୍ୟବହାର ଏବଂ ମାଟି ସେନ୍ସର ବିଷୟରେ ଜାଣନ୍ତୁ |",
    card8_title: "ପ୍ରାକୃତିକ ଚାଷ",
    card8_desc: "ଜୈବିକ ସାର, ଜୀବାମୃତ ଏବଂ ରାସାୟନିକ ପଦାର୍ଥ ହ୍ରାସ ଉପରେ ମାର୍ଗଦର୍ଶନ |",
    card9_title: "AI ଚାଟବୋଟ୍",
    card9_desc: "କୌଣସି ପ୍ରଶ୍ନ ଅଛି କି? ଯେକୌଣସି ସମୟରେ ଆମର ସହକାରୀଙ୍କ ସହିତ ଚାଟ୍ କରନ୍ତୁ |",
    chat_header: "କୃଷି ସହଯୋଗୀ",
    chat_welcome: "ନମସ୍କାର! ମୁଁ ଏଗ୍ରି ସହାୟକ | ମୋତେ ଫସଲ, ପାଣିପାଗ କିମ୍ବା ବଜାର ମୂଲ୍ୟ ବିଷୟରେ ପଚାରନ୍ତୁ |",
    chat_placeholder: "ଆପଣଙ୍କର ପ୍ରଶ୍ନ ଏଠାରେ ଲେଖନ୍ତୁ..."
  }
};

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('app_language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('app_language', language);
  }, [language]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  const t = (key) => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    return translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
