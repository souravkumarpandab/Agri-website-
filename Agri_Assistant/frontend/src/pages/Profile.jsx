import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, token, login } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    mobile: '',
    age: '',
    qualification: '',
    farmingType: '',
    finance: ''
  });
  
  const [photoBlob, setPhotoBlob] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [progress, setProgress] = useState(-1);
  const [result, setResult] = useState(null);
  
  const [weatherData, setWeatherData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      alert("Please login first to view your profile.");
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:5000"}`}/api/auth/profile', config);
        if (res.data) {
          setFormData(prev => ({
            ...prev,
            name: res.data.name || res.data.fullName || '',
            address: res.data.address || '',
            mobile: res.data.mobile || '',
            age: res.data.age || '',
            qualification: res.data.qualification || '',
            farmingType: res.data.farmingType || '',
            finance: res.data.finance || ''
          }));
          setResult(res.data);
          login(res.data, token); // Sync newly fetched Full data into global user context
        }
      } catch (err) {
        console.error("Could not fetch profile", err);
      }
    };
    
    if (token) fetchProfile();
    
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(async (pos) => {
         const { latitude, longitude } = pos.coords;
         try {
           const geoRes = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
           const city = geoRes.data.city || geoRes.data.locality || geoRes.data.principalSubdivision || "Unknown Location";
           
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
         } catch(e) {
           console.error(e);
         }
       }, (err) => console.log(err));
    }
  }, [user, token, navigate]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === 'mobile' && value.length > 10) return;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoBlob(file);
      setPhotoUrl(URL.createObjectURL(file));
    }
  };

  const submitDetails = async () => {
    let base64Photo = '';
    if (photoBlob) {
       const reader = new FileReader();
       reader.readAsDataURL(photoBlob);
       await new Promise(resolve => reader.onload = resolve);
       base64Photo = reader.result;
    }

    setProgress(0);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.put('${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:5000"}`}/api/auth/profile', {
        name: formData.name,
        mobile: formData.mobile,
        address: formData.address,
        age: formData.age === '' ? undefined : formData.age,
        qualification: formData.qualification,
        farmingType: formData.farmingType,
        finance: formData.finance,
        ...(base64Photo && { photo: base64Photo })
      }, config);
      
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 20;
        setProgress(currentProgress);
        
        if (currentProgress >= 100) {
          clearInterval(interval);
          setResult(res.data);
          login(res.data, res.data.token); // Sync the freshly saved data into the global 'user' object immediately
          alert("Profile updated successfully!");
          setProgress(-1);
          setIsEditModalOpen(false);
        }
      }, 50);
    } catch (err) {
      console.error(err);
      alert("Failed to save profile.");
      setProgress(-1);
    }
  };

  const profileImageUrl = photoUrl || user?.photo || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=10B981&color=fff&size=150`;
  const farmerID = user?._id ? `AS${user._id.substring(user._id.length - 4).toUpperCase()}` : `AS5409`;

  return (
    <div className="profile-page-dark">
      <div className="p-container-dark">
        {/* Banner and Header Overlay */}
        <div className="p-hero-banner-dark">
          <div className="p-overlay-stripe-dark">
             <div className="p-avatar-container-dark">
                <img src={profileImageUrl} alt="Profile" className="p-avatar-img-dark" />
             </div>
             <div className="p-user-info-dark">
                <h2>Full Name: <span>{user?.name || user?.fullName || 'Guest User'}</span></h2>
                <div style={{display:'flex', flexDirection:'column', gap:'5px', marginTop:'5px'}}>
                   <div className="p-info-line-dark">Farmer ID: <span>{farmerID}</span></div>
                   <div className="p-info-line-dark">Email: <span>{user?.email || 'N/A'}</span></div>
                </div>
             </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="p-stats-row-dark">
           <div className="p-stat-item-dark">
             <i className="fas fa-map-marked-alt"></i>
             <div>
                <small>Total Land Area:</small>
                <strong>{formData.finance === 'Stable' ? '2.5 Acres' : formData.finance === 'Good' ? '5.2 Acres' : formData.finance === 'Very Good' ? '10+ Acres' : 'Pending Update'}</strong>
             </div>
           </div>
           <div className="p-stat-item-dark">
             <i className="fas fa-wheat-awn"></i>
             <div>
                <small>Primary Crop:</small>
                <strong>{formData.farmingType || 'Not Set'}</strong>
             </div>
           </div>
           <div className="p-stat-item-dark">
             <i className="fas fa-chart-pie"></i>
             <div>
                <small>Agri-Score:</small>
                <strong>88/100 (Top 10% in Region)</strong>
             </div>
           </div>
        </div>

        {/* Two Column Layout */}
        <div className="p-main-content-dark">
          
          {/* Left Data Read-Only Column */}
          <div className="p-form-column-dark">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                <h3 style={{ margin: 0, fontSize: '1.6rem', color: '#ecfdf5' }}>
                  <i className="fas fa-user-check" style={{color: '#10B981', marginRight: '10px'}}></i> Profile Details
                </h3>
                <button onClick={() => setIsEditModalOpen(true)} className="p-action-btn">
                   <i className="fas fa-edit"></i> Edit Profile
                </button>
             </div>
             
             <div className="p-detail-grid">
                <div className="p-detail-card">
                   <small>Address / Location</small>
                   <div>{user?.address || 'Not Provided'}</div>
                </div>
                <div className="p-detail-card">
                   <small>Registered Mobile Number</small>
                   <div>{user?.mobile || 'Not Provided'}</div>
                </div>
                <div className="p-detail-card">
                   <small>Farmer Age</small>
                   <div>{user?.age ? `${user.age} Years` : 'Not Provided'}</div>
                </div>
                <div className="p-detail-card">
                   <small>Educational Qualification</small>
                   <div>{user?.qualification || 'Not Provided'}</div>
                </div>
                <div className="p-detail-card">
                   <small>Preferred Type of Farming</small>
                   <div>{user?.farmingType || 'Not Provided'}</div>
                </div>
                <div className="p-detail-card">
                   <small>Estimated Financial Condition</small>
                   <div>{user?.finance || 'Not Provided'}</div>
                </div>
             </div>
             
             <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '15px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <h4 style={{ color: '#ecfdf5', marginTop: 0, marginBottom: '10px', fontSize: '1.1rem' }}>
                  <i className="fas fa-shield-alt" style={{color:'#10B981', marginRight: '8px'}}></i> Identity Verification
                </h4>
                <p style={{ fontSize: '0.9rem', color: '#a7f3d0', margin: 0 }}>
                  This profile details dashboard ensures your personalized tools (e.g., market rate intelligence and localized weather warnings) are accurately fetched based strictly on your identity base. To alter your visual identity, simply open the Edit Profile popup and submit a new profile photograph.
                </p>
             </div>
          </div>

          {/* Right Sidebar Informational Column */}
          <div className="p-sidebar-column-dark">
             
             <div className="p-side-card-dark" style={{borderLeftColor: '#F59E0B'}}>
                <h4><i className="fas fa-bell" style={{color:'#F59E0B'}}></i> Smart Notifications</h4>
                <div className="p-notification-box-dark">
                   <strong><i className="fas fa-exclamation-triangle" style={{color:'#FDE68A'}}></i> High Humidity Alert:</strong> Sector 2 Area. Advise checking for fungal growth.
                </div>
             </div>

             {weatherData && (
                <div className="dash-card weather-advanced" style={{ background: '#1B2E24', color: '#E2E8F0', padding: '20px', borderRadius: '15px', marginBottom: '20px' }}>
                   <h3 style={{ fontSize: '0.9rem', color: '#94A3B8', margin: '0 0 15px 0', fontWeight: '500' }}>
                      <i className="fas fa-cloud-sun" style={{color: '#10B981', marginRight: '8px'}}></i> Local Weather & Air Quality
                   </h3>
                   
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                         <div style={{ fontSize: '3.5rem', fontWeight: 'bold', lineHeight: '1', margin: 0, color: 'white' }}>
                            {weatherData.temp}°C
                         </div>
                         <div style={{ margin: '5px 0 10px 0', fontSize: '0.9rem', color: '#94A3B8' }}>{weatherData.condition}</div>
                         <div style={{ color: '#94A3B8', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <i className="fas fa-map-marker-alt"></i> {weatherData.location}
                         </div>
                      </div>
                      <img src={weatherData.iconClass} alt="weather icon" style={{ width: '85px', height: '85px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }} />
                   </div>

                   <div style={{ marginTop: '25px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.75rem', fontWeight: 500, color: '#94A3B8' }}>
                         <span><i className="fas fa-tint" style={{ color: '#3B82F6', marginRight: '5px' }}></i> Humidity</span>
                         <span>{weatherData.humidity}%</span>
                      </div>
                      <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                         <div style={{ width: `${weatherData.humidity}%`, height: '100%', background: '#3B82F6', borderRadius: '10px' }}></div>
                      </div>
                   </div>

                   <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.15)', padding: '15px 10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      {(weatherData.forecast || []).map((day, index) => (
                          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                             <div style={{ fontSize: '0.65rem', color: '#94A3B8', marginBottom: '5px' }}>{day.day}</div>
                             <img src={day.iconCode} alt="forecast" style={{ width: '35px', height: '35px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }} />
                             <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginTop: '5px' }}>{day.temp}°</div>
                          </div>
                      ))}
                   </div>

                   <div style={{ marginTop: '25px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                      <h3 style={{ fontSize: '0.85rem', color: 'white', margin: '0 0 15px 0', display: 'flex', alignItems: 'center' }}>
                         <i className="fas fa-thermometer-half" style={{color: '#F97316', marginRight: '8px'}}></i> Specific Crop Soil Heat Index
                      </h3>

                      {[
                        { label: "Current", icon: "fas fa-thermometer-empty", color: "#F97316", value: 25, unit: "%" },
                        { label: "Wind Speed", icon: "fas fa-wind", color: "#CBD5E1", value: Math.min((weatherData.wind || 12)*2, 100), displayVal: `${weatherData.wind || 12} km/h` },
                        { label: "Air Quality (AQI)", icon: "fas fa-leaf", color: "#10B981", value: weatherData.aqi || 45, displayVal: `${weatherData.aqi || 45} (Good)` }
                      ].map((item, i) => (
                         <div key={i} style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.7rem', color: '#94A3B8' }}>
                               <span><i className={item.icon} style={{ color: item.color, marginRight: '5px', width: '12px', textAlign: 'center' }}></i> {item.label}</span>
                               <span>{item.displayVal || `${item.value}${item.unit}`}</span>
                            </div>
                            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                               <div style={{ width: `${item.value}%`, height: '100%', background: item.color, borderRadius: '10px' }}></div>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             )}

             <div className="p-side-card-dark" style={{borderLeftColor: '#10B981'}}>
                <h4><i className="fas fa-microscope" style={{color:'#10B981'}}></i> Diagnostic History</h4>
                <ul className="p-list-items-dark">
                   <li>Rice Leaf Blast <span>Resolved</span></li>
                   <li>Healthy Scans <span>Past 30 Days</span></li>
                </ul>
             </div>

             <div className="p-side-card-dark" style={{borderLeftColor: '#8B5CF6'}}>
                <h4><i className="fas fa-money-bill-wave" style={{color:'#8B5CF6'}}></i> Market Prices</h4>
                <ul className="p-list-items-dark">
                   <li>Rice ₹2300/qtl <span>Stable</span></li>
                   <li>Wheat ₹2100/qtl <span style={{color:'#EF4444'}}>Down 2%</span></li>
                </ul>
             </div>

          </div>
        </div>
      </div>

      {/* EDIT PROFILE POPUP MODAL */}
      {isEditModalOpen && (
        <div className="p-modal-overlay">
          <div className="p-modal-content">
             <div className="p-modal-header">
                <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#ecfdf5' }}>
                  <i className="fas fa-user-edit" style={{color: '#10B981', marginRight: '10px'}}></i>
                  Update Details
                </h3>
                <i className="fas fa-times p-modal-close" onClick={() => setIsEditModalOpen(false)}></i>
             </div>

             <div className="p-modal-body">
                <div className="p-input-group-dark">
                   <label>Full Name</label>
                   <input type="text" id="name" placeholder="Name" value={formData.name} onChange={handleInputChange} />
                </div>
                <div className="p-input-group-dark">
                   <label>Address</label>
                   <input type="text" id="address" placeholder="Address" value={formData.address} onChange={handleInputChange} />
                </div>
                <div className="p-input-group-dark">
                   <label>Registered Mobile Number</label>
                   <input type="number" id="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleInputChange} />
                </div>
                <div className="p-input-group-dark">
                   <label>Age</label>
                   <input type="number" id="age" placeholder="Age" value={formData.age} onChange={handleInputChange} />
                </div>
                <div className="p-input-group-dark">
                   <label>Highest Qualification</label>
                   <select id="qualification" value={formData.qualification} onChange={handleInputChange}>
                     <option value="">Select Qualification</option>
                     <option value="10th">10th</option>
                     <option value="12th">12th</option>
                     <option value="Graduate">Graduate</option>
                     <option value="Post Graduate">Post Graduate</option>
                   </select>
                </div>
                <div className="p-input-group-dark">
                   <label>Dominant Farming Method</label>
                   <select id="farmingType" value={formData.farmingType} onChange={handleInputChange}>
                     <option value="">Type of Farming</option>
                     <option value="Organic">Organic</option>
                     <option value="Natural">Natural</option>
                     <option value="Chemical">Chemical</option>
                   </select>
                </div>
                <div className="p-input-group-dark">
                   <label>Estimated Financial Condition</label>
                   <select id="finance" value={formData.finance} onChange={handleInputChange}>
                     <option value="">Financial Condition</option>
                     <option value="Poor">Poor</option>
                     <option value="Stable">Stable</option>
                     <option value="Good">Good</option>
                     <option value="Very Good">Very Good</option>
                   </select>
                </div>
                
                <div className="p-input-group-dark">
                   <label>Profile Identity Picture (Optional)</label>
                   <div className="p-file-group-dark" style={{ marginTop: '0' }}>
                      <input type="file" id="photoInput" accept="image/*" onChange={handleFileChange} />
                   </div>
                </div>

                <div style={{ marginTop: '30px' }}>
                   <button className="p-save-btn-dark" onClick={submitDetails} disabled={progress >= 0}>
                      {progress >= 0 ? `Saving... ${progress}%` : "Save Profile Changes"}
                   </button>
                   
                   {progress >= 0 && (
                      <div style={{width:'100%', height:'8px', background:'rgba(255,255,255,0.1)', marginTop:'15px', borderRadius:'10px'}}>
                         <div style={{height:'100%', background:'#10B981', width:`${progress}%`, borderRadius:'10px', transition:'width 0.1s'}}></div>
                      </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
