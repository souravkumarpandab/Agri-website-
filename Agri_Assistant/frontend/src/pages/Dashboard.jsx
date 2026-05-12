import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import './Dashboard.css';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
// Import Feature Components
import CropRecommendation from './CropRecommendation';
import FertilizerCalculator from './FertilizerCalculator';
import Weather from './Weather';
import MarketPrices from './MarketPrices';
import GovtSchemes from './GovtSchemes';
import DigitalFarming from './DigitalFarming';
import OrganicTips from './OrganicTips';
import AIAssistant from './AIAssistant';
import DroneStore from './DroneStore';
import Feedback from './Feedback';

const languagesList = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली' },
  { code: 'sd', name: 'Sindhi', native: 'سنڌي' },
  { code: 'gom', name: 'Konkani', native: 'कोंकणी' },
  { code: 'doi', name: 'Dogri', native: 'डोगरी' },
  { code: 'mai', name: 'Maithili', native: 'मैथिली' },
  { code: 'bho', name: 'Bhojpuri', native: 'भोजपुरी' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'zh-CN', name: 'Chinese', native: '中文' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'ko', name: 'Korean', native: '한국어' }
];
const videoPlaylist = [
  { id: "rzaloPUfqwg", title: "Modern Farming Techniques & High Yield Strategies" },
  { id: "EqV-49ZsHzU", title: "Smart Irrigation & Water Management" },
  { id: "G99coOrgGUc", title: "Organic Fertilizer Preparation Guide" },
  { id: "RKeNBZ_vF6k", title: "Pest Management & Disease Control" },
  { id: "_thKqJNJftQ", title: "Greenhouse Farming Masterclass" },
  { id: "A4RM7ve5cso", title: "Expert Fertilizer Mixing & Application Methods" },
  { id: "Qp8klo3-JSI", title: "How to Calculate Right Fertilizer Doses" },
  { id: "-TMiMjUB_I4", title: "NPK Ratio Explained for Maximum Yield" },
  { id: "heTxEsrPVdQ", title: "Advanced Crop Advice & Seasonal Planning" },
  { id: "2clqFFcRjuY", title: "Soil Testing & Nutrient Management Tips" },
  { id: "mkEsLdNKlPM", title: "Crop Rotation Secrets for Healthier Soil" }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token, logout, updateUser } = useAuth();
  const { changeLanguage: setGlobalLanguage } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [weatherData, setWeatherData] = useState({ temp: 28, humidity: 65, wind: 12, condition: 'Sunny', location: 'Fetching...', forecast: [] });
  const [mandiCrop, setMandiCrop] = useState("Wheat");
  
  // Custom Language Selector States
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const [currentLang, setCurrentLang] = useState({ code: 'en', name: 'English', native: 'English' });
  
  const [isFeaturesExpanded, setIsFeaturesExpanded] = useState(false);
  const [userCoords, setUserCoords] = useState({ lat: 28.6139, lon: 77.2090 });
  const [droneFeedIndex, setDroneFeedIndex] = useState(0);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  
  // Generic Modal State
  const [activeModalFeature, setActiveModalFeature] = useState(null);

  // Pest Modal States
  const [isPestModalOpen, setIsPestModalOpen] = useState(false);
  const [pesticideActive, setPesticideActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [showAppModal, setShowAppModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Quick Fertilizer State
  const [fertCrop, setFertCrop] = useState('Wheat');
  const [fertArea, setFertArea] = useState(1);
  const [fertSoil, setFertSoil] = useState('Loamy'); // Default average soil
  
  const cropNutrients = {
    Rice: { N: 120, P: 60, K: 40 },
    Wheat: { N: 120, P: 60, K: 40 },
    Maize: { N: 120, P: 60, K: 40 },
    Sugarcane: { N: 250, P: 100, K: 100 },
    Cotton: { N: 120, P: 60, K: 60 },
    Potato: { N: 120, P: 80, K: 100 },
    Onion: { N: 100, P: 50, K: 50 },
    Tomato: { N: 100, P: 50, K: 50 },
    Soybean: { N: 20, P: 80, K: 40 },
    Mustard: { N: 80, P: 40, K: 40 }
  };
  
  const soilModifiers = {
    Sandy: { N: 1.2, P: 1.1, K: 1.1 }, // Leaches quickly, needs more
    Loamy: { N: 1.0, P: 1.0, K: 1.0 }, // Ideal
    Clayey: { N: 0.9, P: 0.8, K: 0.9 } // Retains nutrients well
  };

  const currentNutrients = cropNutrients[fertCrop] || cropNutrients['Wheat'];
  const soilMod = soilModifiers[fertSoil] || soilModifiers['Loamy'];
  
  const reqN = currentNutrients.N * (fertArea || 0) * soilMod.N;
  const reqP = currentNutrients.P * (fertArea || 0) * soilMod.P;
  const reqK = currentNutrients.K * (fertArea || 0) * soilMod.K;
  
  const dapNeeded = (reqP / 0.46).toFixed(1);
  const ureaNeeded = (Math.max(0, reqN - (dapNeeded * 0.18)) / 0.46).toFixed(1);
  const mopNeeded = (reqK / 0.60).toFixed(1);

  // Profile Edit States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({
    address: user?.address || '',
    farmingType: user?.farmingType || '',
    mobile: user?.mobile || '',
    qualification: user?.qualification || '',
    photo: user?.photo || ''
  });

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProfileForm({ ...editProfileForm, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/profile`, editProfileForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      updateUser(res.data);
      setIsEditingProfile(false);
    } catch (err) {
      console.error('Failed to update profile', err);
      alert('Failed to update profile details.');
    }
  };


  
  // Realtime Live Chart Data
  const [mandiTimeFilter, setMandiTimeFilter] = useState('1W');
  const [chartData, setChartData] = useState([
    { time: '10:00', Wheat: 2300, Rice: 2100, Maize: 1500, Cotton: 6000, Sugarcane: 300, Potato: 800, Tomato: 1200, Onion: 1600, SoilMoisture: 45, YieldEstimate: 42.0 },
    { time: '10:05', Wheat: 2310, Rice: 2120, Maize: 1520, Cotton: 6050, Sugarcane: 305, Potato: 810, Tomato: 1150, Onion: 1620, SoilMoisture: 44, YieldEstimate: 42.5 },
    { time: '10:10', Wheat: 2280, Rice: 2090, Maize: 1490, Cotton: 5980, Sugarcane: 298, Potato: 790, Tomato: 1100, Onion: 1590, SoilMoisture: 42, YieldEstimate: 41.8 },
    { time: '10:15', Wheat: 2350, Rice: 2150, Maize: 1550, Cotton: 6100, Sugarcane: 310, Potato: 820, Tomato: 1180, Onion: 1640, SoilMoisture: 40, YieldEstimate: 41.2 },
    { time: '10:20', Wheat: 2340, Rice: 2130, Maize: 1540, Cotton: 6080, Sugarcane: 308, Potato: 815, Tomato: 1220, Onion: 1610, SoilMoisture: 45, YieldEstimate: 43.1 },
  ]);
  const [yieldChartData, setYieldChartData] = useState([
    { time: 'Mon', YieldEstimate: 41.5 }, { time: 'Tue', YieldEstimate: 42.1 },
    { time: 'Wed', YieldEstimate: 40.8 }, { time: 'Thu', YieldEstimate: 42.5 },
    { time: 'Fri', YieldEstimate: 43.2 }, { time: 'Sat', YieldEstimate: 42.8 },
    { time: 'Sun', YieldEstimate: 41.9 }
  ]);
  const [soilHealth, setSoilHealth] = useState({ N: 85, P: 60, K: 92 });
  const [equipmentStatus, setEquipmentStatus] = useState({ harvester: 'ACTIVE', pump: 'OFFLINE', fan: 'MAINTENANCE' });

  useEffect(() => {
    // If not authenticated, redirect
    if (!user && !localStorage.getItem("token")) {
      navigate('/login');
    }

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    const graphTimer = setInterval(() => {
       setChartData(prevData => {
         const newData = [...prevData];
         if (newData.length > 10) newData.shift();
         
         const lastPoint = newData[newData.length - 1];
         const now = new Date();
         const newTime = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
         
         newData.push({
           time: newTime,
           Wheat: lastPoint.Wheat + (Math.floor(Math.random() * 40) - 20),
           Rice: lastPoint.Rice + (Math.floor(Math.random() * 30) - 15),
           Maize: lastPoint.Maize + (Math.floor(Math.random() * 30) - 15),
           Cotton: lastPoint.Cotton + (Math.floor(Math.random() * 100) - 50),
           Sugarcane: lastPoint.Sugarcane + (Math.floor(Math.random() * 10) - 5),
           Potato: lastPoint.Potato + (Math.floor(Math.random() * 20) - 10),
           Tomato: lastPoint.Tomato + (Math.floor(Math.random() * 40) - 20),
           Onion: lastPoint.Onion + (Math.floor(Math.random() * 30) - 15),
           SoilMoisture: Math.max(10, Math.min(100, lastPoint.SoilMoisture + (Math.floor(Math.random() * 6) - 3))),
           YieldEstimate: parseFloat((Math.max(20, Math.min(80, (lastPoint.YieldEstimate + (Math.random() * 1.5 - 0.75))))).toFixed(2))
         });
         return newData;
       });

       setSoilHealth(prev => ({
         N: Math.max(10, Math.min(100, prev.N + (Math.floor(Math.random() * 5) - 2))),
         P: Math.max(10, Math.min(100, prev.P + (Math.floor(Math.random() * 5) - 2))),
         K: Math.max(10, Math.min(100, prev.K + (Math.floor(Math.random() * 5) - 2)))
       }));

       setEquipmentStatus(prev => {
         const statuses = ['ACTIVE', 'OFFLINE', 'MAINTENANCE'];
         return {
           harvester: Math.random() > 0.95 ? statuses[Math.floor(Math.random() * 3)] : prev.harvester,
           pump: Math.random() > 0.95 ? statuses[Math.floor(Math.random() * 3)] : prev.pump,
           fan: Math.random() > 0.95 ? statuses[Math.floor(Math.random() * 3)] : prev.fan
         };
       });
    }, 4000);

    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(async (pos) => {
         const { latitude, longitude } = pos.coords;
         setUserCoords({ lat: latitude, lon: longitude });
         try {
           // Free robust reverse geocoding API for exact location
           const geoRes = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
           const city = geoRes.data.city || geoRes.data.locality || geoRes.data.principalSubdivision || "Unknown Location";
           
           // Free robust weather API (Open-Meteo)
           const wxRes = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
           
           const current = wxRes.data.current;
           const daily = wxRes.data.daily;
           
           const mapWeatherCode = (code) => {
              if (code === 0) return 'Clear';
              if (code === 1 || code === 2) return 'Partly Cloudy';
              if (code === 3) return 'Overcast';
              if (code >= 45 && code <= 48) return 'Fog';
              if ((code >= 51 && code <= 57) || code === 80 || code === 81 || code === 82) return 'Rain Showers';
              if (code >= 61 && code <= 67) return 'Heavy Rain';
              if (code >= 71 && code <= 77) return 'Snow';
              if (code === 85 || code === 86) return 'Snow Showers';
              if (code >= 95) return 'Thunderstorm';
              return 'Clouds';
           };

           const mapIcon = (condition, isDay) => {
              const d = isDay ? 'd' : 'n';
              if (condition === 'Clear') return `https://openweathermap.org/img/wn/01${d}@4x.png`;
              if (condition === 'Partly Cloudy') return `https://openweathermap.org/img/wn/02${d}@4x.png`;
              if (condition === 'Overcast' || condition === 'Clouds') return `https://openweathermap.org/img/wn/04${d}@4x.png`;
              if (condition === 'Fog') return `https://openweathermap.org/img/wn/50${d}@4x.png`;
              if (condition === 'Rain Showers') return `https://openweathermap.org/img/wn/09${d}@4x.png`;
              if (condition === 'Heavy Rain') return `https://openweathermap.org/img/wn/10${d}@4x.png`;
              if (condition === 'Snow' || condition === 'Snow Showers') return `https://openweathermap.org/img/wn/13${d}@4x.png`;
              if (condition === 'Thunderstorm') return `https://openweathermap.org/img/wn/11${d}@4x.png`;
              return `https://openweathermap.org/img/wn/03${d}@4x.png`;
           };

           const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
           const dailyForecasts = daily.time.slice(0, 5).map((timeStr, index) => {
              const condition = mapWeatherCode(daily.weather_code[index]);
              return {
                 day: index === 0 ? 'Today' : days[new Date(timeStr).getDay()],
                 temp: Math.round(daily.temperature_2m_max[index]),
                 condition: condition,
                 iconCode: mapIcon(condition, true)
              };
           });

           const currentCondition = mapWeatherCode(current.weather_code);

           setWeatherData({
             temp: Math.round(current.temperature_2m),
             humidity: current.relative_humidity_2m,
             wind: Math.round(current.wind_speed_10m),
             aqi: 45, // default static AQI as fallback
             condition: currentCondition,
             iconClass: mapIcon(currentCondition, current.is_day),
             location: city,
             forecast: dailyForecasts
           });
           
           // Construct Weekly Yield Estimate based on weather API
           const baseYield = 40.5;
           const weeklyYield = daily.time.slice(0, 7).map((timeStr, index) => {
              const date = new Date(timeStr);
              const dayStr = days[date.getDay()];
              const tempMax = daily.temperature_2m_max[index];
              const tempImpact = (30 - Math.abs(30 - tempMax)) * 0.15; 
              const estYield = parseFloat((baseYield + tempImpact + (Math.random() * 2 - 1)).toFixed(2));
              return { time: index === 0 ? 'Today' : dayStr, YieldEstimate: estYield };
           });
           setYieldChartData(weeklyYield);
         } catch(e) {
           console.error("Weather fetch error: ", e);
           setWeatherData(prev => ({...prev, location: "Locating Failed"}));
         }
       }, (error) => {
           console.error("Geolocation denied or failed: ", error);
       });
    }

    const droneInterval = setInterval(() => {
        setDroneFeedIndex(prev => (prev + 1) % 4);
    }, 4500);

    // Initialize Google Translate
    const addGoogleTranslateScript = () => {
      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
        
        window.googleTranslateElementInit = () => {
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          }, 'google_translate_element');
        };
      }
    };
    addGoogleTranslateScript();

    return () => { clearInterval(timer); clearInterval(graphTimer); clearInterval(droneInterval); };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formattedDate = currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const formattedTime = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Pest Logic
  const startCamera = async () => {
    setCameraActive(true);
    setImagePreview(null);
    setAnalysisResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera access denied or not available!");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        setImageBlob(blob);
        const url = URL.createObjectURL(blob);
        setImagePreview(url);
        stopCamera();
      }, 'image/png');
    }
  };

  const handleFileUpload = (e) => {
    stopCamera();
    const file = e.target.files[0];
    if (file) {
      setImageBlob(file);
      const reader = new FileReader();
      reader.onload = () => { setImagePreview(reader.result); };
      reader.readAsDataURL(file);
    }
  };

  const resetModal = () => {
    setImageBlob(null);
    setImagePreview(null);
    setAnalysisResult(null);
    stopCamera();
  };

  const analyzeImage = async () => {
    if (!imageBlob) return alert("Select or capture an image first!");
    const formData = new FormData();
    formData.append('file', imageBlob, 'scan.png');
    setAnalysisResult({ loading: true });
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/predict`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                 .catch(() => axios.post('https://agrisahayak-26tf.onrender.com/predict', formData));
      if (res.data.error) setAnalysisResult({ error: res.data.error });
      else setAnalysisResult({ success: true, ...res.data });
    } catch (error) {
      setAnalysisResult({ error: "Failed to connect to AI Server." });
    }
  };

  const features = [
    { title: "Crop Recommendation", icon: "fas fa-seedling", action: () => setActiveModalFeature("Crop Recommendation") },
    { title: "Fertilizer Calculator", icon: "fas fa-flask", action: () => setActiveModalFeature("Fertilizer Calculator") },
    { title: "Pest & Disease", icon: "fas fa-bug", action: () => setIsPestModalOpen(true) }, 
    { title: "Weather Alerts", icon: "fas fa-cloud-sun", action: () => setActiveModalFeature("Weather Alerts") },
    { title: "Mandi Prices", icon: "fas fa-store", action: () => setActiveModalFeature("Mandi Prices") },
    { title: "Govt Schemes", icon: "fas fa-landmark", action: () => setActiveModalFeature("Govt Schemes") },
    { title: "Digital Farming", icon: "fas fa-drone", imageIcon: "/image/digital_farming_logo.jpeg", action: () => setActiveModalFeature("Digital Farming") },
    { title: "Organic Tips", icon: "fas fa-leaf", action: () => setActiveModalFeature("Organic Tips") },
    { title: "AI Chatbot", icon: "fas fa-robot", action: () => setActiveModalFeature("AI Chatbot") },
    { title: "Feedback", icon: "fas fa-comment-dots", action: () => setActiveModalFeature("Feedback") },
  ];

  const renderActiveFeature = () => {
    const closeFeature = () => setActiveModalFeature(null);
    switch (activeModalFeature) {
      case "Crop Recommendation": return <CropRecommendation onBack={closeFeature} />;
      case "Fertilizer Calculator": return <FertilizerCalculator onBack={closeFeature} />;
      case "Weather Alerts": return <Weather onBack={closeFeature} />;
      case "Mandi Prices": return <MarketPrices onBack={closeFeature} />;
      case "Govt Schemes": return <GovtSchemes onBack={closeFeature} />;
      case "Digital Farming": return <DigitalFarming onBack={closeFeature} />;
      case "Organic Tips": return <OrganicTips onBack={closeFeature} />;
      case "AI Chatbot": return <AIAssistant onBack={closeFeature} />;
      case "Drone Store": return <DroneStore onBack={closeFeature} />;
      case "Feedback": return <Feedback onBack={closeFeature} />;
      default: return null;
    }
  };

  const droneDetails = [
    {
      image: "https://images.unsplash.com/photo-1586771107445-d3af105ea4b5?q=80&w=600&auto=format&fit=crop",
      time: "08:15 AM",
      model: "DJI Mavic 3M",
      isSatellite: false,
      telemetry: "Altitude: 45m | Speed: 15km/h",
      desc: "Precision multispectral surveying array. Currently scanning Sector 1 for optimal crop health.",
    },
    {
      image: "https://images.unsplash.com/photo-1625904835711-0eb1e4284cf6?q=80&w=800&auto=format&fit=crop",
      time: "10:30 AM",
      model: "ISRO Cartosat-3 Relay",
      isSatellite: true,
      telemetry: "Orbit Altitude: 509km | Inclination: 97.5°",
      desc: "High-resolution panchromatic satellite topography. Monitoring soil degradation patterns and hydration mapping in Sector 2.",
    },
    {
      image: "https://images.unsplash.com/photo-1563906267088-b029e7101114?q=80&w=800&auto=format&fit=crop",
      time: "11:30 AM",
      model: "DJI Agras T40",
      isSatellite: false,
      telemetry: "Altitude: 12m | Payload: 40L",
      desc: "Heavy-duty agricultural drone applying liquid fertilizer payload uniformly across Sector 3.",
    },
    {
      image: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=800&auto=format&fit=crop",
      time: "02:45 PM",
      model: "Landsat 8 Thermal Sync",
      isSatellite: true,
      telemetry: "Sensor: TIRS | Orbit: 705km",
      desc: "Deep thermal satellite scan capturing heat stress pockets and vegetation canopy temperature across Sector 4.",
    }
  ];

  return (
    <div className="dashboard-page">
      
      {/* SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsSidebarOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1500, backdropFilter: 'blur(3px)' }}
        ></div>
      )}

      {/* SIDEBAR */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="logo" style={{position: 'relative'}}>
          <i className="fas fa-seedling"></i> 
          <span className="logo-text">Agri<span>Sahayak</span></span>
          <i className="fas fa-times" onClick={() => setIsSidebarOpen(false)} style={{position: 'absolute', right: '10px', top: '10px', fontSize: '1.5rem', cursor: 'pointer', color: '#94A3B8'}}></i>
        </div>
        
        <div className="sidebar-category">Main Menu</div>
        <div className={`menu-item ${!activeModalFeature && !isPestModalOpen ? 'active' : ''}`} onClick={() => { setActiveModalFeature(null); setIsPestModalOpen(false); navigate('/dashboard'); }}>
           <i className="fas fa-chart-line"></i> Dashboard
        </div>
        <div className="menu-item" onClick={() => navigate('/')}><i className="fas fa-home"></i> Home Page</div>
        <div className="menu-item" onClick={() => navigate('/my-profile')}><i className="fas fa-user"></i> My Profile</div>
        <div className="menu-item"><i className="fas fa-history"></i> History</div>
        <div className={`menu-item ${activeModalFeature === 'Feedback' ? 'active' : ''}`} onClick={() => { setActiveModalFeature('Feedback'); setIsPestModalOpen(false); }}><i className="fas fa-comment-dots"></i> Feedback</div>
        
        <div className="sidebar-category">Feature Directory</div>
        <div className="menu-item" onClick={() => setIsFeaturesExpanded(!isFeaturesExpanded)} style={{justifyContent: 'space-between'}}>
           <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              <i className="fas fa-list"></i> All Features
           </div>
           <i className={`fas fa-chevron-${isFeaturesExpanded ? 'up' : 'down'}`}></i>
        </div>

        {isFeaturesExpanded && (
           <div className="submenu" style={{ paddingLeft: '15px' }}>
              {features.map((f, i) => (
                 <div key={i} className="menu-item" onClick={f.action} style={{ fontSize: '1.35rem', padding: '8px 12px' }}>
                   {f.imageIcon ? (
                     <img src={f.imageIcon} alt={f.title} style={{ width: '16px', height: '16px', objectFit: 'contain', marginRight: '6px' }} />
                   ) : (
                     <i className={f.icon} style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }}></i>
                   )} 
                   {f.title}
                 </div>
              ))}
           </div>
        )}
        
        <div className="menu-item" onClick={() => window.open('https://enam.gov.in/', '_blank')} style={{marginTop: '5px'}}>
           <i className="fas fa-truck-loading" style={{color:'var(--accent-color)'}}></i> Supply Chain
        </div>
        <div className="menu-item" onClick={() => window.open('https://www.nabard.org/', '_blank')}>
           <i className="fas fa-chart-pie" style={{color:'var(--accent-color)'}}></i> Financial Hub
        </div>
        <div className="menu-item" onClick={() => window.open('https://agricoop.nic.in/', '_blank')}>
           <i className="fas fa-file-alt" style={{color:'var(--accent-color)'}}></i> Field Reports
        </div>
        <div className="menu-item" onClick={() => window.open('https://agmarknet.gov.in/', '_blank')}>
           <i className="fas fa-chart-bar" style={{color:'var(--accent-color)'}}></i> Market Insights
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
          <div className="menu-item" onClick={handleLogout} style={{ color: '#EF4444' }}><i className="fas fa-sign-out-alt"></i> Logout</div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className={`main-content ${isSidebarOpen ? 'blurred' : ''}`}>
        <div className="dashboard-padding">
           
           {/* HEADER TOP */}
           <div className="header-top" style={{marginBottom: '15px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                 <button 
                    onClick={() => setIsSidebarOpen(true)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-green)', fontSize: '2rem', cursor: 'pointer' }}
                 >
                    <i className="fas fa-bars"></i>
                 </button>
                 <h1 className="welcome-text">Welcome Back, {user?.fullName || user?.name || "Guest User"}!</h1>
              </div>
              <div className="header-actions">
                 {/* Hidden Original Google Translate */}
                 <div id="google_translate_element" style={{ position: 'absolute', width: '0px', height: '0px', overflow: 'hidden', opacity: 0 }}></div>
                 
                 {/* Custom Language Dropdown */}
                 <div className="notranslate" style={{ position: 'relative' }}>
                    <div 
                       onClick={() => setShowLangDropdown(!showLangDropdown)}
                       style={{ background: 'var(--card-bg)', border: '1px solid var(--accent-green)', borderRadius: '25px', padding: '10px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.3rem', fontWeight: '500', color: 'white', transition: '0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}
                       onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'}
                       onMouseLeave={(e) => e.currentTarget.style.background = 'var(--card-bg)'}
                    >
                       <i className="fas fa-language" style={{ fontSize: '1.55rem', color: 'var(--accent-green)' }}></i> 
                       <span>{currentLang.native}</span> 
                       <i className={`fas fa-chevron-${showLangDropdown ? 'up' : 'down'}`} style={{ fontSize: '1.15rem', color: '#94A3B8' }}></i>
                    </div>
                    
                    {showLangDropdown && (
                       <div style={{ position: 'absolute', top: '55px', right: 0, width: '280px', background: 'var(--card-bg)', border: '1px solid var(--accent-green)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.6)', zIndex: 5000, overflow: 'hidden' }}>
                          <div style={{ padding: '15px', borderBottom: '1px solid rgba(16,185,129,0.3)', background: 'var(--sidebar-bg)' }}>
                             <div style={{ position: 'relative' }}>
                                <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8', fontSize: '1.25rem' }}></i>
                                <input 
                                   type="text" 
                                   placeholder="Search language..." 
                                   value={langSearch}
                                   onChange={(e) => setLangSearch(e.target.value)}
                                   style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(16,185,129,0.3)', color: 'white', padding: '10px 10px 10px 35px', borderRadius: '8px', outline: 'none', fontSize: '1.25rem' }}
                                   onClick={(e) => e.stopPropagation()}
                                />
                             </div>
                          </div>
                          <div style={{ maxHeight: '350px', overflowY: 'auto' }} className="custom-scrollbar">
                             {languagesList.filter(l => l.name.toLowerCase().includes(langSearch.toLowerCase()) || l.native.toLowerCase().includes(langSearch.toLowerCase())).map(l => (
                                <div 
                                   key={l.code}
                                   onClick={() => {
                                      const select = document.querySelector('.goog-te-combo');
                                      if (select) {
                                          select.value = l.code;
                                          select.dispatchEvent(new Event('change', { bubbles: true }));
                                          setCurrentLang(l);
                                          setGlobalLanguage(l.code);
                                          setShowLangDropdown(false);
                                          setLangSearch('');
                                      } else {
                                          // Fallback if widget hasn't fully rendered its select
                                          document.cookie = `googtrans=/en/${l.code}; path=/`;
                                          document.cookie = `googtrans=/en/${l.code}; path=/; domain=${window.location.hostname}`;
                                          window.location.reload();
                                      }
                                   }}
                                   className="lang-item-hover"
                                   style={{ padding: '12px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.02)', background: currentLang.code === l.code ? 'rgba(16,185,129,0.15)' : 'transparent', transition: '0.2s' }}
                                >
                                   <span style={{ fontWeight: currentLang.code === l.code ? '600' : '400', color: currentLang.code === l.code ? 'var(--accent-green)' : 'white' }}>{l.native}</span>
                                   <span style={{ fontSize: '1.15rem', color: '#94a3b8' }}>{l.name}</span>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}
                 </div>

                 <i className="fas fa-bell" style={{ fontSize: '1.55rem', color: '#94A3B8', cursor: 'pointer', marginLeft: '10px' }}></i>
                 <div className="user-profile" onClick={() => navigate('/my-profile')} style={{cursor: 'pointer'}}>
                    <span style={{ fontWeight: 500, fontSize: '1.3rem' }}>{user?.fullName || user?.name || "Guest User"}</span>
                    <img src={user?.photo || `https://ui-avatars.com/api/?name=${user?.fullName || user?.name || "Guest User"}&background=10B981&color=fff`} alt="User" />
                 </div>
              </div>
           </div>

           {/* TOP SNAPSHOT ROW (Farmer Detail + Quick Squares) */}
           <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
              
              {/* Farmer ID Block */}
              <div className="dash-card" style={{ flex: '1 1 45%', padding: '15px 20px', display: 'flex', gap: '20px', alignItems: 'center', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                 <img 
                    src={user?.photo || `https://ui-avatars.com/api/?name=${user?.fullName || user?.name || "Guest"}&background=10B981&color=fff`} 
                    alt="Profile" 
                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #10B981' }} 
                 />
                 <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 8px 0', color: 'var(--accent-green)', fontSize: '1.35rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <span>Farmer Identification</span>
                       <button onClick={() => setIsEditingProfile(true)} style={{ background: 'transparent', border: 'none', color: '#60A5FA', cursor: 'pointer', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '4px' }} title="Edit Profile"><i className="fas fa-edit"></i> Edit</button>
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '1.17rem', color: 'var(--text-secondary)' }}>
                       <div><i className="fas fa-map-marker-alt" style={{color: '#10B981', width:'15px'}}></i> Area: {user?.address || 'Not specified'}</div>
                       <div><i className="fas fa-seedling" style={{color: '#10B981', width:'15px'}}></i> Farming: {user?.farmingType || 'Not specified'}</div>
                       <div><i className="fas fa-phone" style={{color: '#10B981', width:'15px'}}></i> Contact: {user?.mobile || 'Not specified'}</div>
                       <div><i className="fas fa-graduation-cap" style={{color: '#10B981', width:'15px'}}></i> Qual: {user?.qualification || 'Not specified'}</div>
                    </div>
                 </div>
              </div>

              {/* Quick Feature Squares Block */}
              <div style={{ flex: '1 1 50%', display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px', alignItems: 'center', scrollBehavior: 'smooth' }} className="hide-scrollbar" id="feature-square-scroll">
                 <div onClick={() => document.getElementById('feature-square-scroll').scrollBy({left: -200, behavior: 'smooth'})} style={{ minWidth: '30px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', cursor: 'pointer', zIndex: 10 }}><i className="fas fa-chevron-left" style={{color: '#10B981'}}></i></div>
                 
                 {features.map((f, i) => (
                    <div key={i} onClick={f.action} style={{ minWidth: '100px', flexShrink: 0, height: '90px', background: 'var(--card-bg)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', transition: '0.3s' }} className="hover-lift">
                       {f.imageIcon ? (
                          <img src={f.imageIcon} alt={f.title} style={{ width: '28px', height: '28px', marginBottom: '8px', objectFit: 'contain' }} />
                       ) : (
                          <i className={f.icon} style={{fontSize: '1.75rem', color: 'var(--accent-green)', marginBottom: '8px'}}></i>
                       )}
                       <span style={{fontSize: '1.1rem', textAlign: 'center', color: 'var(--text-primary)', padding: '0 5px'}}>{f.title}</span>
                    </div>
                 ))}
                 
                 <div onClick={() => document.getElementById('feature-square-scroll').scrollBy({left: 200, behavior: 'smooth'})} style={{ minWidth: '30px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', cursor: 'pointer', zIndex: 10 }}><i className="fas fa-chevron-right" style={{color: '#10B981'}}></i></div>
              </div>

           </div>

           {/* DASHBOARD GRID - 3 COLUMNS */}
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              
              {/* LEFT COLUMN */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                 <div className="dash-card weather-advanced" style={{ background: '#1B2E24', color: '#E2E8F0', padding: '20px', borderRadius: '15px' }}>
                    <h3 style={{ fontSize: '1.25rem', color: '#94A3B8', margin: '0 0 15px 0', fontWeight: '500' }}>
                       <i className="fas fa-cloud-sun" style={{color: '#10B981', marginRight: '8px'}}></i> Local Weather & Air Quality
                    </h3>
                    
                    {/* Primary Weather Display */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                       <div>
                          <div style={{ fontSize: '3.85rem', fontWeight: 'bold', lineHeight: '1', margin: 0, color: 'white' }}>
                             {weatherData.temp}°C
                          </div>
                          <div style={{ margin: '5px 0 10px 0', fontSize: '1.25rem', color: '#94A3B8' }}>{weatherData.condition}</div>
                          <div style={{ color: '#94A3B8', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                             <i className="fas fa-map-marker-alt"></i> Current Location: {weatherData.location}
                          </div>
                          <button onClick={() => window.open(`https://weather.com/weather/today/l/${weatherData.location}`, 'WeatherPopup', 'width=800,height=600')} style={{ marginTop: '10px', fontSize: '1.05rem', padding: '6px 15px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#10B981', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                            <i className="fas fa-external-link-square-alt" style={{marginRight: '5px'}}></i> Detailed Window
                          </button>
                       </div>
                       <img src={weatherData.iconClass} alt="weather icon" style={{ width: '85px', height: '85px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }} />
                    </div>

                    {/* Progress Bar 1: Humidity (Top) */}
                    <div style={{ marginTop: '25px' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '1.1rem', fontWeight: 500, color: '#94A3B8' }}>
                          <span><i className="fas fa-tint" style={{ color: '#3B82F6', marginRight: '5px' }}></i> Humidity</span>
                          <span>{weatherData.humidity}%</span>
                       </div>
                       <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                          <div style={{ width: `${weatherData.humidity}%`, height: '100%', background: '#3B82F6', borderRadius: '10px' }}></div>
                       </div>
                    </div>

                    {/* Functional 5 Day Forecast Row */}
                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.15)', padding: '15px 10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                       {(weatherData.forecast && weatherData.forecast.length > 0 ? weatherData.forecast : [
                         {day: "Mon", temp: 28, condition: "Sunny", iconCode: "https://openweathermap.org/img/wn/01d@4x.png"},
                         {day: "Tue", temp: 28, condition: "Sunny", iconCode: "https://openweathermap.org/img/wn/01d@4x.png"},
                         {day: "Wed", temp: 28, condition: "Clouds", iconCode: "https://openweathermap.org/img/wn/03d@4x.png"},
                         {day: "Thu", temp: 30, condition: "Clear", iconCode: "https://openweathermap.org/img/wn/01d@4x.png"},
                         {day: "Fri", temp: 31, condition: "Clear", iconCode: "https://openweathermap.org/img/wn/01d@4x.png"}
                       ]).map((day, index) => (
                           <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div style={{ fontSize: '1.0rem', color: '#94A3B8', marginBottom: '5px' }}>{day.day}</div>
                              <img src={day.iconCode} alt="forecast" style={{ width: '35px', height: '35px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }} />
                              <div style={{ fontSize: '1.15rem', fontWeight: 'bold', marginTop: '5px' }}>{day.temp}°</div>
                           </div>
                       ))}
                    </div>

                    {/* Specific Crop Soil Heat Index Group */}
                    <div style={{ marginTop: '25px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                       <h3 style={{ fontSize: '1.2rem', color: 'white', margin: '0 0 15px 0', display: 'flex', alignItems: 'center' }}>
                          <i className="fas fa-thermometer-half" style={{color: '#F97316', marginRight: '8px'}}></i> Specific Crop Soil Heat Index
                       </h3>

                       {/* Progress Bars */}
                       {[
                         { label: "Current", icon: "fas fa-thermometer-empty", color: "#F97316", value: 25, unit: "%" },
                         { label: "Humidity", icon: "fas fa-tint", color: "#3B82F6", value: weatherData.humidity, unit: "%" },
                         { label: "Wind Speed", icon: "fas fa-wind", color: "#CBD5E1", value: Math.min((weatherData.wind || 12)*2, 100), displayVal: `${weatherData.wind || 12} km/h` },
                         { label: "Air Quality (AQI)", icon: "fas fa-leaf", color: "#10B981", value: weatherData.aqi || 45, displayVal: `${weatherData.aqi || 45} (Good)` }
                       ].map((item, i) => (
                          <div key={i} style={{ marginBottom: '12px' }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '1.05rem', color: '#94A3B8' }}>
                                <span><i className={item.icon} style={{ color: item.color, marginRight: '5px', width: '12px', textAlign: 'center' }}></i> {item.label}</span>
                                <span>{item.displayVal || `${item.value}${item.unit}`}</span>
                             </div>
                             <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                                <div style={{ width: `${item.value}%`, height: '100%', background: item.color, borderRadius: '10px' }}></div>
                             </div>
                          </div>
                       ))}
                    </div>

                    {/* Footer IoT Gateway */}
                    <div style={{ marginTop: '20px', fontSize: '1.05rem', color: '#10B981', display: 'flex', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
                       <i className="fas fa-wifi" style={{marginRight: '5px'}}></i> IoT Gateway: Connected
                    </div>
                 </div>

                 {/* LIVE SOIL REPLACED BY ORGANIC TIPS & WEATHER WARNING */}
                 <div className="dash-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                       <h3 style={{fontSize: '1.35rem', marginBottom: '10px'}}><i className="fas fa-chart-bar" style={{color: '#10B981'}}></i> Weekly Yield Forecast</h3>
                       <div style={{ height: '140px', width: '100%', marginTop: '10px' }}>
                          <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={yieldChartData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 14}} dy={5} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 14}} domain={['dataMin - 1', 'auto']} />
                                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: 'var(--sidebar-bg)', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '1.15rem' }} />
                                <Bar dataKey="YieldEstimate" fill="#10B981" radius={[4, 4, 0, 0]} barSize={15} />
                             </BarChart>
                          </ResponsiveContainer>
                       </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
                       <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <div style={{ color: '#3B82F6', fontSize: '1.15rem', fontWeight: 'bold' }}><i className="fas fa-cloud-showers-heavy"></i> Rain Pre-Warning</div>
                          <div style={{ fontSize: '1.05rem', marginTop: '5px', color: '#93C5FD' }}>
                             {weatherData && weatherData.forecast && weatherData.forecast.some(day => day.condition && (day.condition.toLowerCase().includes('rain') || day.condition.toLowerCase().includes('storm'))) 
                                ? "Rain expected in upcoming days. Delay pesticide application and check drainage." 
                                : "No rain forecasted. Safe window for pesticide application and harvesting."}
                          </div>
                       </div>
                    </div>
                 </div>

              </div>

              {/* CENTER COLUMN */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                 
                 <div className="dash-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px' }}>
                    <div>
                        <h3 style={{marginBottom: '5px', fontSize: '1.25rem'}}><i className="fas fa-clock" style={{color: '#8B5CF6'}}></i> Current Time</h3>
                        <div style={{ fontSize: '2.15rem', fontWeight: 'bold' }}>{formattedTime}</div>
                        <div style={{ fontSize: '1.15rem', color: 'var(--text-secondary)' }}>{formattedDate}</div>
                    </div>
                    {/* Live Google Map Visual snippet */}
                    <div style={{ width: '140px', height: '90px', borderRadius: '8px', border: '1px solid #334155', position: 'relative', overflow: 'hidden' }}>
                       <iframe 
                           width="100%" 
                           height="100%" 
                           style={{border: 0}} 
                           loading="lazy" 
                           referrerPolicy="no-referrer-when-downgrade" 
                           src={`https://maps.google.com/maps?q=${userCoords.lat},${userCoords.lon}&t=k&z=15&output=embed`}
                       ></iframe>
                       <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)', pointerEvents: 'none', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                          <motion.div style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '2px', border: '1px solid var(--accent-green)', whiteSpace: 'nowrap', boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }} animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>{weatherData.location || "Locating..."}</motion.div>
                          <motion.i className="fas fa-map-marker-alt" style={{ color: '#EF4444', fontSize: '28px', filter: 'drop-shadow(0px 3px 4px rgba(0,0,0,0.6))' }} animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} />
                       </div>
                       <div style={{position: 'absolute', bottom: '2px', left: '5px', fontSize: '0.85rem', color: 'white', background: 'rgba(0,0,0,0.5)', padding: '2px 4px', pointerEvents: 'none', borderRadius: '3px'}}>Satellite Maps</div>
                    </div>
                 </div>

                 <div className="dash-card" style={{ flex: 1 }}>
                    <div className="chart-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <h3 style={{fontSize: '1.35rem'}}><i className="fas fa-chart-line" style={{color: '#F59E0B'}}></i> Mandi Prices Graph</h3>
                        <div style={{ display: 'flex', gap: '5px' }}>
                           {['1W', '1M', '6M', '1Y'].map(tf => (
                             <button 
                                key={tf}
                                onClick={() => setMandiTimeFilter(tf)}
                                style={{
                                   background: mandiTimeFilter === tf ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)',
                                   color: mandiTimeFilter === tf ? '#F59E0B' : 'var(--text-secondary)',
                                   border: `1px solid ${mandiTimeFilter === tf ? '#F59E0B' : 'rgba(255,255,255,0.1)'}`,
                                   padding: '2px 8px', borderRadius: '4px', fontSize: '1.0rem', cursor: 'pointer', transition: 'all 0.3s'
                                }}
                             >{tf}</button>
                           ))}
                        </div>
                     </div>
                     <div style={{ height: '280px', width: '100%', marginTop: '10px' }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={10} minHeight={10}>
                            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                  <linearGradient id="colorWheat" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.6}/>
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                  </linearGradient>
                                  <linearGradient id="colorPotato" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.6}/>
                                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                                  </linearGradient>
                                  <linearGradient id="colorRice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.6}/>
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                  </linearGradient>
                                  <linearGradient id="colorTomato" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.5}/>
                                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                                  </linearGradient>
                                  <linearGradient id="colorOnion" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.5}/>
                                    <stop offset="95%" stopColor="#A78BFA" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 14}} dy={5} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 14}} domain={['auto', 'auto']} />
                                <Tooltip 
                                   contentStyle={{ backgroundColor: 'var(--sidebar-bg)', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '1.15rem', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }} 
                                   cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '5 5' }}
                                />
                                <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} iconType="circle" />
                                <Line type="monotone" dataKey="Wheat" stroke="#3B82F6" strokeWidth={3} dot={{r: 0}} activeDot={{r: 5, strokeWidth: 0}} />
                                <Line type="monotone" dataKey="Potato" stroke="#F59E0B" strokeWidth={3} dot={{r: 0}} activeDot={{r: 5, strokeWidth: 0}} />
                                <Line type="monotone" dataKey="Rice" stroke="#10B981" strokeWidth={3} dot={{r: 0}} activeDot={{r: 5, strokeWidth: 0}} />
                                <Line type="monotone" dataKey="Tomato" stroke="#EF4444" strokeWidth={3} dot={{r: 0}} activeDot={{r: 5, strokeWidth: 0}} />
                                <Line type="monotone" dataKey="Onion" stroke="#A78BFA" strokeWidth={3} dot={{r: 0}} activeDot={{r: 5, strokeWidth: 0}} />
                            </LineChart>
                        </ResponsiveContainer>
                     </div>
                 </div>

                 {/* New Functionality: Market AI Recommendations & Compact Spot Prices */}
                 <div className="dash-card" style={{ flex: 1, display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1, borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '15px' }}>
                       <h3 style={{fontSize: '1.35rem', marginBottom: '10px'}}><i className="fas fa-robot" style={{color: '#8B5CF6'}}></i> Market AI Insights</h3>
                       <div className="custom-scrollbar" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '350px', paddingRight: '5px' }}>
                          <motion.div whileHover={{ scale: 1.02 }} style={{ background: 'rgba(16,185,129,0.05)', padding: '6px 8px', borderRadius: '6px', borderLeft: '3px solid #10B981' }}>
                             <strong style={{ color: '#10B981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><i className="fas fa-arrow-trend-up"></i> SELL Wheat:</strong> Prices peaking this week. Liquidate stock.
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.02 }} style={{ background: 'rgba(245,158,11,0.05)', padding: '6px 8px', borderRadius: '6px', borderLeft: '3px solid #F59E0B' }}>
                             <strong style={{ color: '#F59E0B', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><i className="fas fa-pause-circle"></i> HOLD Potato:</strong> Expected to rise 4%. Cold storage advised.
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.02 }} style={{ background: 'rgba(239,68,68,0.05)', padding: '6px 8px', borderRadius: '6px', borderLeft: '3px solid #EF4444' }}>
                             <strong style={{ color: '#EF4444', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><i className="fas fa-arrow-trend-down"></i> AVOID Tomato:</strong> High supply detected locally.
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.02 }} style={{ background: 'rgba(167,139,250,0.05)', padding: '6px 8px', borderRadius: '6px', borderLeft: '3px solid #A78BFA' }}>
                             <strong style={{ color: '#A78BFA', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><i className="fas fa-arrow-trend-up"></i> BUY Onion:</strong> Demand spiking. Bulk purchasing advised.
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.02 }} style={{ background: 'rgba(16,185,129,0.05)', padding: '6px 8px', borderRadius: '6px', borderLeft: '3px solid #10B981' }}>
                             <strong style={{ color: '#10B981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><i className="fas fa-arrow-trend-up"></i> SELL Cabbage:</strong> Optimal pricing reached.
                          </motion.div>
                       </div>
                    </div>
                    
                    <div style={{ flex: 1 }}>
                        <h3 style={{fontSize: '1.35rem', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <span><i className="fas fa-tags" style={{color: '#10B981'}}></i> Spot Prices</span>
                        </h3>
                        <div className="custom-scrollbar" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', overflowY: 'auto', maxHeight: '350px', paddingRight: '5px' }}>
                            {[
                               { name: 'Rice', base: 32, color: '#10B981', trend: 'up' },
                               { name: 'Wheat', base: 28, color: '#3B82F6', trend: 'stable' },
                               { name: 'Dal (Tur)', base: 110, color: '#3B82F6', trend: 'up' },
                               { name: 'Potato (Aloo)', base: 26, color: '#FCD34D', trend: 'stable' },
                               { name: 'Tomato (Tamatar)', base: 42, color: '#EF4444', trend: 'down' },
                               { name: 'Onion (Pyaaz)', base: 35, color: '#A78BFA', trend: 'up' },
                               { name: 'Cabbage (Patta Gobi)', base: 30, color: '#A3E635', trend: 'up' },
                               { name: 'Cauliflower (Phool Gobi)', base: 40, color: '#FBBF24', trend: 'down' },
                               { name: 'Brinjal (Baingan)', base: 35, color: '#818CF8', trend: 'down' },
                               { name: 'Lady Finger (Bhindi)', base: 45, color: '#4ADE80', trend: 'up' },
                               { name: 'Bitter Gourd (Karela)', base: 40, color: '#A3E635', trend: 'up' },
                               { name: 'Bottle Gourd (Lauki)', base: 20, color: '#86EFAC', trend: 'down' },
                               { name: 'Ridge Gourd (Tori)', base: 35, color: '#34D399', trend: 'stable' },
                               { name: 'Sponge Gourd (Nenua)', base: 30, color: '#A3E635', trend: 'down' },
                               { name: 'Pointed Gourd (Parwal)', base: 60, color: '#10B981', trend: 'up' },
                               { name: 'Ivy Gourd (Tindora)', base: 50, color: '#4ADE80', trend: 'stable' },
                               { name: 'Cluster Beans (Gawar)', base: 55, color: '#059669', trend: 'up' },
                               { name: 'French Beans', base: 65, color: '#10B981', trend: 'stable' },
                               { name: 'Green Peas (Matar)', base: 80, color: '#4ADE80', trend: 'up' },
                               { name: 'Carrot (Gajar)', base: 55, color: '#FB923C', trend: 'stable' },
                               { name: 'Radish (Mooli)', base: 25, color: '#F87171', trend: 'down' },
                               { name: 'Beetroot (Chukandar)', base: 50, color: '#F43F5E', trend: 'up' },
                               { name: 'Spinach (Palak)', base: 30, color: '#34D399', trend: 'up' },
                               { name: 'Fenugreek (Methi)', base: 40, color: '#059669', trend: 'down' },
                               { name: 'Mustard Leaves (Sarson)', base: 35, color: '#A3E635', trend: 'stable' },
                               { name: 'Amaranth (Chaulai)', base: 25, color: '#4ADE80', trend: 'up' },
                               { name: 'Colocasia (Arbi)', base: 45, color: '#A78BFA', trend: 'stable' },
                               { name: 'Yam (Suran)', base: 60, color: '#FCD34D', trend: 'up' },
                               { name: 'Pumpkin (Kaddu)', base: 20, color: '#F59E0B', trend: 'down' },
                               { name: 'Ash Gourd (Petha)', base: 25, color: '#86EFAC', trend: 'stable' },
                               { name: 'Capsicum (Shimla Mirch)', base: 50, color: '#10B981', trend: 'stable' },
                               { name: 'Green Chilli (Hari Mirch)', base: 60, color: '#4ADE80', trend: 'up' },
                               { name: 'Garlic (Lahsun)', base: 120, color: '#9CA3AF', trend: 'up' },
                               { name: 'Ginger (Adrak)', base: 150, color: '#FCD34D', trend: 'up' },
                               { name: 'Coriander (Dhania)', base: 100, color: '#059669', trend: 'stable' },
                               { name: 'Mint (Pudina)', base: 10, color: '#059669', trend: 'down' },
                               { name: 'Drumstick (Sahjan)', base: 60, color: '#65A30D', trend: 'stable' },
                               { name: 'Raw Banana', base: 30, color: '#A3E635', trend: 'down' },
                               { name: 'Raw Jackfruit (Kathal)', base: 45, color: '#818CF8', trend: 'up' }
                            ].map((item) => {
                               const locSeed = (weatherData.location || "India").split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                               const timeOffset = new Date().getHours() * 2;
                               const varCost = Math.floor(((locSeed * item.base) + timeOffset) % (item.base * 0.3));
                               const price = item.base + varCost - (item.base * 0.15);
                               const trendIcon = item.trend === 'up' ? 'fa-caret-up' : item.trend === 'down' ? 'fa-caret-down' : 'fa-minus';
                               const trendColor = item.trend === 'up' ? '#10B981' : item.trend === 'down' ? '#EF4444' : '#94A3B8';
                               
                               return (
                                   <motion.div whileHover={{ y: -2, backgroundColor: 'rgba(255,255,255,0.08)' }} key={item.name} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '6px 8px', borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'background 0.3s' }}>
                                       <div style={{ fontSize: '1.0rem', color: 'var(--text-secondary)', marginBottom: '2px', fontWeight: 'bold' }}>{item.name}</div>
                                       <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                          <div style={{ fontSize: '1.35rem', fontWeight: 'bold', color: item.color }}>₹{Math.round(price)}</div>
                                          <i className={`fas ${trendIcon}`} style={{ color: trendColor, fontSize: '1.15rem' }}></i>
                                       </div>
                                   </motion.div>
                               );
                            })}
                        </div>
                    </div>
                 </div>


                 <div style={{ display: 'flex', gap: '20px' }}>
                     <div className="dash-card" style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{fontSize: '1.35rem', marginBottom: '15px', display: 'flex', justifyContent: 'space-between'}}>
                           <span><i className="fas fa-play-circle" style={{color: '#EF4444'}}></i> Agri-Expert Video Tutorials</span>
                           <span style={{ fontSize: '1.0rem', background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>Playlist</span>
                        </h3>
                        
                        <div style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', marginBottom: '15px' }}>
                           <iframe 
                              width="100%" 
                              height="100%" 
                              style={{ minHeight: '220px', border: 'none' }}
                              src={`https://www.youtube.com/embed/${videoPlaylist[activeVideoIndex].id}?autoplay=1&controls=1`}
                              title={videoPlaylist[activeVideoIndex].title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                              allowFullScreen>
                           </iframe>
                        </div>

                        <div style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 'bold', marginBottom: '10px' }}>
                           {videoPlaylist[activeVideoIndex].title}
                        </div>

                        <div className="custom-scrollbar" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                           {videoPlaylist.map((video, idx) => (
                              <div 
                                 key={video.id} 
                                 onClick={() => setActiveVideoIndex(idx)}
                                 style={{ 
                                    minWidth: '140px', 
                                    cursor: 'pointer', 
                                    opacity: activeVideoIndex === idx ? 1 : 0.6,
                                    border: activeVideoIndex === idx ? '2px solid #10B981' : '2px solid transparent',
                                    borderRadius: '8px',
                                    transition: '0.3s',
                                    background: 'rgba(255,255,255,0.05)',
                                    display: 'flex',
                                    flexDirection: 'column'
                                 }}
                              >
                                 <div style={{ width: '100%', height: '80px', background: `url(https://img.youtube.com/vi/${video.id}/mqdefault.jpg) center/cover`, borderTopLeftRadius: '6px', borderTopRightRadius: '6px', position: 'relative' }}>
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                       <i className="fas fa-play" style={{ color: 'white', fontSize: '1.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}></i>
                                    </div>
                                 </div>
                                 <div style={{ padding: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {video.title}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                 </div>
              </div>

              {/* RIGHT COLUMN */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                 
                 <div className="dash-card">
                    <h3 style={{fontSize: '1.35rem', marginBottom: '10px', display: 'flex', justifyContent: 'space-between'}}>
                       <span><i className={droneDetails[droneFeedIndex].isSatellite ? "fas fa-satellite" : "fas fa-satellite-dish"} style={{color: '#10B981'}}></i> {droneDetails[droneFeedIndex].isSatellite ? "Satellite Feed" : "Drone Surveillance"}</span>
                       <span style={{ fontSize: '1.0rem', background: '#EF4444', color: 'white', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{width:'6px',height:'6px',background:'white',borderRadius:'50%'}}></div> LIVE</span>
                    </h3>
                    <div style={{ width: '100%', height: '140px', background: `url(${droneDetails[droneFeedIndex].image}) center/cover`, 
                       borderRadius: '8px', border: '2px solid #334155', position: 'relative', transition: 'background 0.5s ease', marginBottom: '10px' }}>
                       <div style={{position: 'absolute', top: '5px', left: '5px', fontSize: '1.0rem', color: 'white', background: 'rgba(0,0,0,0.6)', padding: '2px 5px', borderRadius: '3px'}}>Sector {droneFeedIndex + 1}</div>
                       <div style={{position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.6)', padding: '3px 6px', borderRadius: '5px', cursor: 'pointer', color: 'white'}}><i className="fas fa-expand"></i></div>
                       <div style={{position: 'absolute', bottom: '5px', left: '5px', fontSize: '1.0rem', color: '#10B981', background: 'rgba(0,0,0,0.7)', padding: '2px 5px', borderRadius: '3px'}}>{droneDetails[droneFeedIndex].telemetry}</div>
                    </div>
                    <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', padding: '10px' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                           <strong style={{ fontSize: '1.2rem', color: 'var(--accent-green)' }}>{droneDetails[droneFeedIndex].model}</strong>
                           <span style={{ fontSize: '1.05rem', color: '#94A3B8', fontWeight: 'bold' }}><i className="fas fa-clock"></i> {droneDetails[droneFeedIndex].time}</span>
                       </div>
                       <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', margin: '0 0 10px 0', lineHeight: '1.4' }}>{droneDetails[droneFeedIndex].desc}</p>
                       <button onClick={() => setActiveModalFeature("Drone Store")} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '1.1rem', padding: '6px 14px', background: '#059669', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }} className="buy-hover">
                          <i className="fas fa-shopping-cart"></i> Enter Drone Store
                       </button>
                    </div>
                 </div>

                 {/* REAL TIME LOCATION SATELLITE MAP */}
                 <div className="dash-card">
                    <h3 style={{fontSize: '1.35rem', marginBottom: '10px', display: 'flex', justifyContent: 'space-between'}}>
                       <span><i className="fas fa-crosshairs" style={{color: '#3B82F6'}}></i> Real-Time Location Mapping</span>
                       <span style={{ fontSize: '1.0rem', background: 'rgba(59,130,246,0.2)', color: '#3B82F6', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(59,130,246,0.3)' }}><i className="fas fa-route"></i> Tracking</span>
                    </h3>
                    <div style={{ width: '100%', height: '160px', borderRadius: '8px', border: '2px solid #334155', position: 'relative', overflow: 'hidden' }}>
                       <iframe 
                           width="100%" 
                           height="100%" 
                           style={{border: 0}} 
                           loading="lazy" 
                           referrerPolicy="no-referrer-when-downgrade" 
                           title="Real-Time Grid"
                           src={`https://maps.google.com/maps?q=${userCoords.lat},${userCoords.lon}&t=k&z=17&output=embed`}
                       ></iframe>
                       <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)', pointerEvents: 'none', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                          <motion.div style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', padding: '4px 8px', borderRadius: '6px', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '4px', border: '1px solid var(--accent-green)', whiteSpace: 'nowrap', boxShadow: '0 4px 6px rgba(0,0,0,0.5)' }} animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>{weatherData.location || "Locating..."}</motion.div>
                          <motion.i className="fas fa-map-marker-alt" style={{ color: '#EF4444', fontSize: '36px', filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.6))' }} animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} />
                       </div>
                       <div style={{position: 'absolute', bottom: '5px', right: '5px', fontSize: '1.0rem', color: 'white', background: 'rgba(239,68,68,0.9)', padding: '3px 8px', borderRadius: '3px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 0 10px rgba(239,68,68,0.5)'}}>
                          <div style={{width:'6px',height:'6px',background:'white',borderRadius:'50%'}}></div>
                          LIVE FEED
                       </div>
                       <div style={{position: 'absolute', top: '5px', left: '5px', fontSize: '1.0rem', color: 'white', background: 'rgba(0,0,0,0.7)', padding: '2px 5px', borderRadius: '3px', fontFamily: 'monospace'}}>
                          LAT: {userCoords.lat.toFixed(4)} | LON: {userCoords.lon.toFixed(4)}
                       </div>
                    </div>
                 </div>

                 <div className="dash-card" style={{ flex: 1, minHeight: '180px', display: 'flex', flexDirection: 'column' }}>
                     <h3 style={{fontSize: '1.35rem', marginBottom: '10px'}}><i className="fas fa-layer-group" style={{color: '#F59E0B'}}></i> Quick Fertilizer Calc</h3>
                     <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>Instant NPK Bag Requirements</div>
                     
                     <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                        <div style={{ flex: 1 }}>
                           <label style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Crop</label>
                           <select value={fertCrop} onChange={(e) => setFertCrop(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0F3323', color: 'white', border: '1px solid #10B981', fontSize: '1.15rem', outline: 'none', cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}>
                              {Object.keys(cropNutrients).map(c => <option key={c} value={c}>{c}</option>)}
                           </select>
                        </div>
                        <div style={{ flex: 1 }}>
                           <label style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Soil Type</label>
                           <select value={fertSoil} onChange={(e) => setFertSoil(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0F3323', color: 'white', border: '1px solid #10B981', fontSize: '1.15rem', outline: 'none', cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}>
                              <option value="Sandy">Sandy (Needs +15%)</option>
                              <option value="Loamy">Loamy (Ideal)</option>
                              <option value="Clayey">Clayey (Retains well)</option>
                           </select>
                        </div>
                        <div style={{ width: '80px' }}>
                           <label style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Area (ha)</label>
                           <input type="number" value={fertArea} onChange={(e) => setFertArea(parseFloat(e.target.value) || '')} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0F3323', color: 'white', border: '1px solid #10B981', fontSize: '1.15rem', outline: 'none' }} />
                        </div>
                     </div>

                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', flex: 1 }}>
                        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '10px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                           <div style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Urea</div>
                           <div style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#10B981' }}>{ureaNeeded}</div>
                           <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>kg</div>
                        </div>
                        <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', padding: '10px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                           <div style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>DAP</div>
                           <div style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#3B82F6' }}>{dapNeeded}</div>
                           <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>kg</div>
                        </div>
                        <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', padding: '10px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                           <div style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>MOP</div>
                           <div style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#F59E0B' }}>{mopNeeded}</div>
                           <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>kg</div>
                        </div>
                     </div>
                     <button onClick={() => setActiveModalFeature("Fertilizer Calculator")} style={{ width: '100%', marginTop: '15px', background: 'transparent', border: '1px solid #F59E0B', color: '#F59E0B', padding: '8px', borderRadius: '8px', fontSize: '1.15rem', cursor: 'pointer', transition: '0.3s' }} onMouseOver={(e) => { e.target.style.background='#F59E0B'; e.target.style.color='#fff'; }} onMouseOut={(e) => { e.target.style.background='transparent'; e.target.style.color='#F59E0B'; }}>
                        <i className="fas fa-external-link-alt"></i> Open Full Calculator
                     </button>
                 </div>

                 <div className="dash-card">
                    <h3 style={{fontSize: '1.35rem', marginBottom: '10px'}}><i className="fas fa-microscope" style={{color: '#10B981'}}></i> AI Crop Diagnosis</h3>
                    <div style={{ border: '2px dashed #334155', borderRadius: '8px', padding: '15px', textAlign: 'center', cursor: 'pointer', marginBottom: '15px' }} onClick={() => setIsPestModalOpen(true)}>
                       <i className="fas fa-upload" style={{color: 'var(--text-secondary)', fontSize: '1.55rem'}}></i>
                       <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginTop: '5px' }}>Upload your photo</div>
                    </div>
                    <div style={{ fontSize: '1.25rem', color: '#cbd5e1', fontWeight: 'bold', marginBottom: '10px' }}>Recent Diagnosis</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', padding: '5px 0', borderBottom: '1px solid #334155' }}>
                       <span style={{ color: '#A7F3D0' }}>Rust Detected (Wheat)</span><span style={{ color: 'var(--text-secondary)' }}>1 hours ago</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', padding: '5px 0' }}>
                       <span style={{ color: '#A7F3D0' }}>Healthy Crop (Rice)</span><span style={{ color: 'var(--text-secondary)' }}>3 hours ago</span>
                    </div>
                 </div>

              </div>
           </div>

        </div>

        {/* FOOTER */}
        <footer className="dashboard-footer">
           <div className="dashboard-footer-col" style={{ paddingRight: '20px' }}>
             <h4 style={{ color: 'var(--accent-green)', marginBottom: '15px', fontSize: '1.55rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-seedling"></i> AgriSahayak
             </h4>
             <p style={{ color: 'var(--text-primary)', fontSize: '1.2rem', lineHeight: '1.5', marginBottom: '15px' }}>
                AgriSahayak: Empowering agricultural communities with intelligent technology.
             </p>
             <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem' }}>&copy; {new Date().getFullYear()} AgriSahayak. All Rights Reserved.</p>
           </div>

           <div className="dashboard-footer-col">
             <h5>Quick Links</h5>
             <ul>
                <li onClick={() => window.location.href = '/#comprehensive-features'}>Features</li>
                <li onClick={() => window.location.href = '/#about'}>Our Mission</li>
                <li onClick={() => window.location.href = '/#stats'}>Research</li>
                <li onClick={() => setActiveModalFeature("Mandi Prices Tracker")}>Market Insights</li>
             </ul>
           </div>

           <div className="dashboard-footer-col">
             <h5>Support</h5>
             <ul>
                <li onClick={() => window.location.href = '/help-support'}>Help Center</li>
                <li onClick={() => window.location.href = '/help-support'}>FAQs</li>
                <li onClick={() => window.location.href = '/help-support'}>Raise a Ticket</li>
                <li onClick={() => window.location.href = '/community'}>Community</li>
             </ul>
           </div>

           <div className="dashboard-footer-col">
             <h5>Resources</h5>
             <ul>
                <li onClick={() => window.location.href = '/community'}>Blog</li>
                <li onClick={() => window.location.href = '/resources'}>Research Papers</li>
                <li onClick={() => window.location.href = '/resources'}>User Guide</li>
                <li onClick={() => setShowAppModal(true)}>App Download</li>
             </ul>
           </div>

           <div className="dashboard-footer-col">
             <h5>Contact & Company</h5>
             <ul>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                   <i className="fas fa-envelope" style={{ marginTop: '3px', color: 'var(--accent-green)' }}></i>
                   <span>Customer Support: <br />souravkumarpandab1437@gmail.com</span>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                   <i className="fas fa-phone" style={{ marginTop: '3px', color: 'var(--accent-green)' }}></i>
                   <span>Helpline: +91 9040573208</span>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                   <i className="fas fa-map-marker-alt" style={{ marginTop: '3px', color: 'var(--accent-green)' }}></i>
                   <span>Location: Keshari Nagar, Bhubaneswar, Odisha – 751001</span>
                </li>
             </ul>
             <div style={{ display: 'flex', gap: '15px', fontSize: '1.55rem', color: 'var(--text-secondary)', marginTop: '20px' }}>
                <i className="fab fa-linkedin" style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e)=>e.target.style.color='var(--accent-green)'} onMouseLeave={(e)=>e.target.style.color='var(--text-secondary)'}></i>
                <i className="fab fa-twitter" style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e)=>e.target.style.color='var(--accent-green)'} onMouseLeave={(e)=>e.target.style.color='var(--text-secondary)'}></i>
                <i className="fab fa-facebook" style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e)=>e.target.style.color='var(--accent-green)'} onMouseLeave={(e)=>e.target.style.color='var(--text-secondary)'}></i>
             </div>
           </div>
        </footer>
      </div>

      {/* PEST MODAL */}
      {isPestModalOpen && (
          <div className="modal-overlay">
              <div className="modal-content">
                  <span className="close-btn" onClick={() => { setIsPestModalOpen(false); resetModal(); }}>&times;</span>
                  <h3 style={{marginBottom: '15px'}}><i className="fas fa-leaf" style={{color: 'var(--accent-green)'}}></i> Plant Disease Detection</h3>
                  <p style={{ marginBottom: '20px', color: 'var(--text-secondary)', fontSize: '1.25rem' }}>Choose a method to scan the leaf.</p>

                  <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '20px' }}>
                      <label className="option-btn" style={{ flex: 1, textAlign: 'center' }}>
                          <i className="fas fa-cloud-upload-alt" style={{ fontSize: '34px', color: 'var(--accent-green)' }}></i>
                          <p style={{ fontSize: '1.25rem', marginTop: '10px', color: 'var(--text-primary)' }}>Upload Image</p>
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
                      </label>
                      <div className="option-btn" onClick={startCamera} style={{ flex: 1, textAlign: 'center' }}>
                          <i className="fas fa-camera" style={{ fontSize: '34px', color: 'var(--accent-green)' }}></i>
                          <p style={{ fontSize: '1.25rem', marginTop: '10px', color: 'var(--text-primary)' }}>Use Camera</p>
                      </div>
                  </div>

                  {cameraActive && (
                      <div style={{ marginBottom: '15px' }}>
                          <video ref={videoRef} id="camera-stream" autoPlay playsInline style={{ width: '100%', borderRadius: '10px', background: '#000' }}></video>
                          <button onClick={capturePhoto} style={{ background: 'var(--accent-color)', color: 'black', padding: '8px 15px', borderRadius: '20px', border: 'none', marginTop: '10px', cursor: 'pointer', fontWeight: 'bold' }}><i className="fas fa-dot-circle"></i> Capture Photo</button>
                      </div>
                  )}

                  <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

                  {imagePreview && (
                      <img src={imagePreview} alt="Preview" style={{ display: 'block', maxWidth: '100%', maxHeight: '250px', margin: '15px auto', borderRadius: '10px', border: '2px solid var(--accent-green)' }} />
                  )}

                  <button className="action-btn" onClick={analyzeImage}>Analyze Disease</button>

                  {analysisResult && (
                      <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                          {analysisResult.loading ? (
                              <p style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>Scanning with AI... (Please wait)</p>
                          ) : analysisResult.error ? (
                              <p style={{ color: '#EF4444', fontWeight: 'bold' }}>Error: {analysisResult.error}</p>
                          ) : (
                              <div style={{ textAlign: 'left', lineHeight: '1.6' }}>
                                  <strong style={{ color: 'var(--accent-green)' }}>Disease:</strong> {analysisResult.result}<br />
                                  <strong style={{ color: 'var(--accent-green)' }}>Confidence:</strong> {analysisResult.confidence}<br />
                                  <strong style={{ color: '#F59E0B' }}>Remedy:</strong> {analysisResult.remedy}
                                  <button onClick={resetModal} style={{ background: '#334155', color: 'white', padding: '8px 20px', border: 'none', borderRadius: '20px', cursor: 'pointer', marginTop: '15px', display: 'block', width: '100%' }}>Scan Another</button>
                              </div>
                          )}
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* GENERIC FEATURE POPUP MODAL */}
      {activeModalFeature && (
          <div className="modal-overlay" style={{ zIndex: 3000 }} onClick={() => setActiveModalFeature(null)}>
              <div 
                  className="modal-content" 
                  onClick={(e) => e.stopPropagation()}
                  style={{ 
                      width: '95%', 
                      maxWidth: activeModalFeature === "AI Chatbot" ? '1050px' : '1200px', 
                      height: activeModalFeature === "AI Chatbot" ? '80vh' : '85vh', 
                      display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', 
                      background: activeModalFeature === "AI Chatbot" ? 'transparent' : 'var(--bg-color)', 
                      border: activeModalFeature === "AI Chatbot" ? 'none' : '2px solid var(--accent-green)' 
                  }}
              >
                  
                  {/* Modal Header */}
                  {activeModalFeature !== "AI Chatbot" && (
                    <div style={{ padding: '15px 25px', background: 'var(--sidebar-bg)', borderBottom: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-green)' }}>
                             <i className={features.find(f => f.title === activeModalFeature)?.icon || "fas fa-layer-group"}></i> 
                             {activeModalFeature}
                        </h3>
                        <button onClick={() => setActiveModalFeature(null)} style={{ background: 'transparent', border: 'none', color: '#EF4444', fontSize: '2.35rem', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
                    </div>
                  )}
                  
                  {/* Generic Integrated Component Body */}
                  <div style={{ 
                      flex: 1, 
                      overflowY: activeModalFeature === "AI Chatbot" ? 'hidden' : 'auto', 
                      padding: activeModalFeature === "AI Chatbot" ? '0' : '20px', 
                      position: 'relative' 
                  }}>
                      {/* We render the raw Component right here inside the dashboard layout context! */}
                      {renderActiveFeature()}
                  </div>

              </div>
          </div>
      )}

      {/* FOOTER APP DOWNLOAD MODAL */}
      <AnimatePresence>
        {showAppModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, backdropFilter: 'blur(5px)' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }} 
              style={{ background: 'linear-gradient(135deg, #051A11 0%, #0a110c 100%)', border: '1px solid #10B981', padding: '40px', borderRadius: '20px', maxWidth: '500px', width: '90%', position: 'relative', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
            >
              <button onClick={() => setShowAppModal(false)} style={{ position: 'absolute', top: '15px', right: '20px', background: 'transparent', border: 'none', color: '#EF4444', fontSize: '2.35rem', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e)=>e.target.style.transform='scale(1.1)'} onMouseLeave={(e)=>e.target.style.transform='scale(1)'}>&times;</button>
              
              <h2 style={{ color: '#10B981', fontSize: '2.35rem', marginBottom: '10px' }}><i className="fas fa-mobile-alt"></i> Mobile App</h2>
              <p style={{ color: '#cbd5e1', lineHeight: '1.6', marginBottom: '25px', fontSize: '1.35rem' }}>Take AgriSahayak anywhere. Get instant offline crop diagnosis, live Mandi alerts, and drone booking right from your phone.</p>
              
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                <div style={{ background: 'white', padding: '15px', borderRadius: '15px', display: 'inline-block' }}>
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://agrisahayak.com/download" alt="Download QR" style={{ display: 'block', width: '130px', height: '130px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button style={{ background: '#333', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '10px', fontSize: '1.45rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => { alert('Subscribed to iOS updates!'); setShowAppModal(false); }}>
                  <i className="fab fa-apple" style={{ fontSize: '1.65rem' }}></i> App Store
                </button>
                <button style={{ background: '#0F3323', color: 'white', border: '1px solid #10B981', padding: '12px 25px', borderRadius: '10px', fontSize: '1.45rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => { alert('Subscribed to Android updates!'); setShowAppModal(false); }}>
                  <i className="fab fa-google-play" style={{ fontSize: '1.65rem', color: '#10B981' }}></i> Google Play
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Profile Edit Modal */}
        {isEditingProfile && (
          <div className="modal-overlay" style={{ zIndex: 4000 }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }} 
              style={{ background: 'var(--bg-color)', border: '1px solid var(--accent-green)', padding: '30px', borderRadius: '15px', maxWidth: '400px', width: '90%', position: 'relative' }}
            >
              <button onClick={() => setIsEditingProfile(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#EF4444', fontSize: '1.85rem', cursor: 'pointer' }}>&times;</button>
              <h2 style={{ color: 'var(--accent-green)', marginBottom: '20px', fontSize: '1.75rem' }}><i className="fas fa-user-edit"></i> Edit Profile</h2>
              
              <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <img src={editProfileForm.photo || `https://ui-avatars.com/api/?name=${user?.name || "User"}&background=10B981&color=fff`} alt="Preview" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #10B981' }} />
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)', fontSize: '1.25rem' }}>Profile Photo</label>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ color: 'white', fontSize: '1.15rem' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)', fontSize: '1.25rem' }}>Area / Address</label>
                  <input type="text" value={editProfileForm.address} onChange={(e) => setEditProfileForm({...editProfileForm, address: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: 'rgba(0,0,0,0.2)', color: 'white' }} placeholder="e.g. Pune, Maharashtra" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)', fontSize: '1.25rem' }}>Farming Type</label>
                  <input type="text" value={editProfileForm.farmingType} onChange={(e) => setEditProfileForm({...editProfileForm, farmingType: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: 'rgba(0,0,0,0.2)', color: 'white' }} placeholder="e.g. Organic, Commercial" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)', fontSize: '1.25rem' }}>Contact Number</label>
                  <input type="text" value={editProfileForm.mobile} onChange={(e) => setEditProfileForm({...editProfileForm, mobile: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)', fontSize: '1.25rem' }}>Qualification</label>
                  <input type="text" value={editProfileForm.qualification} onChange={(e) => setEditProfileForm({...editProfileForm, qualification: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: 'rgba(0,0,0,0.2)', color: 'white' }} placeholder="e.g. B.Sc Agriculture" />
                </div>
                
                <button type="submit" style={{ background: 'var(--accent-green)', color: 'var(--bg-color)', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', fontSize: '1.35rem' }}>Save Changes</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;
