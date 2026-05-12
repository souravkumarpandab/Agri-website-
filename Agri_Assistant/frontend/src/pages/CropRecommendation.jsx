import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import BackButton from '../components/BackButton';
import './CropRecommendation.css';

const CropRecommendation = () => {
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
    season: 'Kharif',
    soilType: 'Loamy',
    farmingTechnique: 'Traditional'
  });
  const [recommendedCrop, setRecommendedCrop] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const recommendCrop = async () => {
    const { nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall, season, soilType, farmingTechnique } = formData;
    
    if (!nitrogen || !phosphorus || !potassium || !temperature || !humidity || !ph || !rainfall) {
      alert("Please fill all fields!");
      return;
    }

    setIsLoading(true);
    setRecommendedCrop(null);

    try {
      const response = await axios.post('${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:5000"}`}/api/recommend-crop', {
        N: parseFloat(nitrogen),
        P: parseFloat(phosphorus),
        K: parseFloat(potassium),
        temperature: parseFloat(temperature),
        humidity: parseFloat(humidity),
        ph: parseFloat(ph),
        rainfall: parseFloat(rainfall),
        season: season,
        soilType: soilType,
        farmingTechnique: farmingTechnique
      });
      
      setRecommendedCrop(response.data.prediction);
    } catch (error) {
      console.error(error);
      alert("Error generating recommendation. Ensure backend model is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="crop-page">
      <BackButton />
      <div className="header-banner" style={{ backgroundImage: "url('/image/crop_bg.png')", backgroundSize: "cover", backgroundPosition: "center", color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>🌾 AgriSahayak - Crop Recommendation</div>

      <div className="container">
        <h2>Enter Soil & Weather Details</h2>

        <div className="form-grid">
          <div className="form-group">
            <label>Soil Nitrogen (N)</label>
            <input type="number" name="nitrogen" placeholder="Example: 90" value={formData.nitrogen} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Soil Phosphorus (P)</label>
            <input type="number" name="phosphorus" placeholder="Example: 40" value={formData.phosphorus} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Soil Potassium (K)</label>
            <input type="number" name="potassium" placeholder="Example: 40" value={formData.potassium} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Temperature (°C)</label>
            <input type="number" name="temperature" placeholder="Example: 26" value={formData.temperature} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Humidity (%)</label>
            <input type="number" name="humidity" placeholder="Example: 80" value={formData.humidity} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Soil pH</label>
            <input type="number" step="0.1" name="ph" placeholder="Example: 6.5" value={formData.ph} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Rainfall (mm)</label>
            <input type="number" name="rainfall" placeholder="Example: 200" value={formData.rainfall} onChange={handleChange} />
          </div>
        </div>

        <h3 style={{ marginTop: '20px', marginBottom: '15px', color: 'var(--accent)', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
          <i className="fas fa-leaf"></i> Cultivation Preferences
        </h3>

        <div className="form-grid">
          <div className="form-group">
            <label>Farming Season</label>
            <select name="season" value={formData.season} onChange={handleChange} className="glass-select">
              <option value="Kharif">Kharif (Monsoon)</option>
              <option value="Rabi">Rabi (Winter)</option>
              <option value="Zaid">Zaid (Summer)</option>
              <option value="Year-Round">Year-Round</option>
            </select>
          </div>

          <div className="form-group">
            <label>Soil Type</label>
            <select name="soilType" value={formData.soilType} onChange={handleChange} className="glass-select">
              <option value="Loamy">Loamy</option>
              <option value="Clay">Clay</option>
              <option value="Sandy">Sandy</option>
              <option value="Black">Black Soil (Regur)</option>
              <option value="Red">Red Soil</option>
              <option value="Alluvial">Alluvial</option>
              <option value="Laterite">Laterite</option>
            </select>
          </div>

          <div className="form-group">
            <label>Farming Technique</label>
            <select name="farmingTechnique" value={formData.farmingTechnique} onChange={handleChange} className="glass-select">
              <option value="Traditional">Traditional</option>
              <option value="Organic">Organic Farming</option>
              <option value="Greenhouse">Greenhouse / Polyhouse</option>
              <option value="Hydroponic">Hydroponic</option>
              <option value="Precision">Precision Farming</option>
            </select>
          </div>
        </div>

        <button className="submit-btn" onClick={recommendCrop} disabled={isLoading}>
          {isLoading ? <><i className="fas fa-spinner fa-spin"></i> AI Analyzing Soil...</> : <><i className="fas fa-magic"></i> Recommend Crop</>}
        </button>

        {recommendedCrop && (
          <div className="result-box">
            <h3><i className="fas fa-robot"></i> AI Recommendation</h3>
            <div className="markdown-body" style={{ fontSize: '1.05rem', lineHeight: '1.6', color: '#e2e8f0', marginTop: '10px' }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{recommendedCrop}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropRecommendation;
