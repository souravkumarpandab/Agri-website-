const dns = require('dns');
dns.setDefaultResultOrder('ipv4first'); // Fixes Node.js 'fetch failed' IPv6 DNS resolution issues

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini with the provided API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyDATRnn7ibIS-IfmUvesMQSuhss2J-yh7k");

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const executeWithRetry = async (operation, maxRetries = 2) => {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      attempt++;
      
      const isQuotaError = error.status === 429 || (error.message && (error.message.includes('429') || error.message.includes('Quota')));
      const isNetworkError = error.message && error.message.includes('fetch failed');

      if (isQuotaError) {
         // Fail immediately on quota exhausted so the frontend doesn't timeout waiting for a response
         console.warn(`[AI] API Quota Exhausted. Failing fast to trigger offline fallback.`);
         throw error;
      }

      if (isNetworkError && attempt < maxRetries) {
        let delay = 2000 * attempt; // Short delay for network glitches (2s, 4s)
        console.warn(`[AI] Network fetch failed. Retrying in ${delay / 1000}s... (Attempt ${attempt}/${maxRetries})`);
        await sleep(delay);
      } else {
        throw error;
      }
    }
  }
};

const recommendCrop = async (req, res) => {
  const { N, P, K, temperature, humidity, ph, rainfall, season, soilType, farmingTechnique } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `You are an expert agricultural AI. Based on the following soil and weather conditions, recommend the absolute best crop for the farmer to plant to maximize yield and profitability. Be concise, highly accurate, and structure your response with markdown. Give the primary crop recommendation and 2 alternative options.

Conditions:
- Nitrogen (N): ${N}
- Phosphorus (P): ${P}
- Potassium (K): ${K}
- Temperature: ${temperature}°C
- Humidity: ${humidity}%
- Soil pH: ${ph}
- Rainfall: ${rainfall}mm
- Season: ${season}
- Soil Type: ${soilType}
- Farming Technique: ${farmingTechnique}`;

    const result = await executeWithRetry(() => model.generateContent(prompt));
    const responseText = result.response.text();

    res.status(200).json({
      prediction: responseText
    });
  } catch (error) {
    console.error("Gemini AI Error in recommendCrop:", error?.message || error);
    // Fallback response so the feature still works
    res.status(200).json({ 
      prediction: `### [Offline Mode] Crop Recommendation\n\nBased on the conditions (N:${N}, P:${P}, K:${K}), here are some safe default recommendations:\n\n1. **Wheat / Rice** (depending on season)\n2. **Millets** (drought resistant)\n3. **Legumes** (improves soil health)\n\n*(Note: This is an offline fallback because the AI quota is currently exhausted)*` 
    });
  }
};

const fertilizerAI = async (req, res) => {
  const { crop, area, measure, N, P, K } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `You are an expert agronomist. Calculate the exact recommended amount of fertilizers (Urea for N, DAP for P, MOP for K) needed for the following field. Provide a practical and clear application schedule (e.g., basal dose, vegetative stage, etc.) formatted in markdown.

Field Details:
- Target Crop: ${crop}
- Total Land Area: ${area} ${measure}
- Current Soil Nitrogen (N): ${N}
- Current Soil Phosphorus (P): ${P}
- Current Soil Potassium (K): ${K}`;

    const result = await executeWithRetry(() => model.generateContent(prompt));
    const responseText = result.response.text();

    res.status(200).json({
      recommendation: responseText
    });
  } catch (error) {
    console.error("Gemini AI Error in fertilizerAI:", error?.message || error);
    res.status(200).json({ 
      recommendation: `### [Offline Mode] Fertilizer Recommendation\n\nFor ${crop} over ${area} ${measure}, please follow these standard guidelines:\n\n- **Urea (Nitrogen):** Apply in split doses (Basal, vegetative stage).\n- **DAP (Phosphorus):** Apply full dose as basal application.\n- **MOP (Potassium):** Apply along with DAP during basal dose.\n\n*(Note: This is an offline fallback because the AI quota is currently exhausted)*` 
    });
  }
};

const mandiAI = async (req, res) => {
  const { crop, district, prices } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `You are an agricultural economist advising a farmer. Based on the local and national average prices provided below, give actionable advice on whether the farmer should sell locally now, store their produce, or transport it to a different state. Keep your advice concise, practical, and formatted in markdown.

Details:
- Crop: ${crop}
- Local District: ${district}
- Local Average Price: ₹${prices?.odAvg || 'Unknown'}/Quintal
- National Average Price: ₹${prices?.inAvg || 'Unknown'}/Quintal`;

    const result = await executeWithRetry(() => model.generateContent(prompt));
    const responseText = result.response.text();

    res.status(200).json({
      analysis: responseText
    });
  } catch (error) {
    console.error("Gemini AI Error in mandiAI:", error?.message || error);
    res.status(200).json({ 
      analysis: `### [Offline Mode] Market Analysis\n\n**Crop:** ${crop}\n- **Local Price:** ₹${prices?.odAvg}/Quintal\n- **National Price:** ₹${prices?.inAvg}/Quintal\n\n**Advice:** Compare local and national prices. If national is significantly higher, consider holding or exporting if transport costs permit. Otherwise, sell locally to save on logistics.\n\n*(Note: This is an offline fallback because the AI quota is currently exhausted)*` 
    });
  }
};

const chatAI = async (req, res) => {
  const { message, history } = req.body;
  
  if (!message) {
    return res.status(400).json({ response: "Message is required." });
  }

  try {
    const { HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
    
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ];

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      safetySettings,
      systemInstruction: "Act as an incredibly knowledgeable, friendly, and empathetic human agricultural expert named AgriSahayak. You are talking directly to a farmer or someone interested in agriculture. Speak naturally, conversationally, and warmly—like a real person offering advice over a cup of tea. Avoid sounding like a robotic AI assistant. Provide highly accurate, practical advice regarding crop recommendations, weather queries, market prices, farming techniques, and pest control. Use clear, friendly markdown formatting without overcomplicating things."
    });

    let formattedHistory = [];
    if (history && Array.isArray(history)) {
      let rawHistory = history.map(msg => ({
        role: msg.sender === 'bot' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

      // Gemini history must start with 'user' and strictly alternate
      for (const msg of rawHistory) {
        if (formattedHistory.length === 0) {
          if (msg.role === 'user') formattedHistory.push(msg);
        } else if (formattedHistory[formattedHistory.length - 1].role !== msg.role) {
          formattedHistory.push(msg);
        }
      }

      // Gemini history must end with 'model' before a new 'user' message is sent
      if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === 'user') {
        formattedHistory.pop();
      }
    }

    const chat = model.startChat({
      history: formattedHistory
    });
    
    const result = await executeWithRetry(() => chat.sendMessage(message));
    const responseText = result.response.text();

    res.status(200).json({ response: responseText });
  } catch (error) {
    console.error("Gemini AI Error details:", error?.message || error);
    
    // Fallback offline responses for the chatbot
    const msgLower = message.toLowerCase();
    let fallback = `I'm currently in Offline Mode because my AI connection quota is exhausted (Error: ${error?.message || "Unknown"}). Try asking me about 'wheat', 'rice', 'fertilizer', or 'weather'.`;
    
    if (msgLower.includes('wheat')) fallback = "Wheat requires cool, moist weather to grow and dry, warm weather to ripen. Ideal soil pH is 6.0 - 7.0.";
    else if (msgLower.includes('rice')) fallback = "Rice thrives in hot, humid climates with heavy rainfall. Clay-loam soils are ideal.";
    else if (msgLower.includes('fertilizer')) fallback = "Always test your soil first! A balanced NPK fertilizer is standard. Use our Fertilizer Calculator for exact doses.";
    else if (msgLower.includes('weather')) fallback = "Please check the 'Weather' tab on your dashboard for the most accurate, hyper-local forecast.";
    else if (msgLower.includes('hi') || msgLower.includes('hello')) fallback = "Hello! I am AgriSahayak (Offline Mode). How can I help you?";

    res.status(200).json({ response: `🤖 **[Offline Mode]:** ${fallback}` });
  }
};

module.exports = {
  recommendCrop,
  fertilizerAI,
  mandiAI,
  chatAI
};
