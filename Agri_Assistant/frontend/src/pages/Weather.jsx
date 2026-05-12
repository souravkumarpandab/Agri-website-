import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import './Weather.css';

const Weather = ({ onBack }) => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiSearchMode, setAiSearchMode] = useState(false);

  const aiCityMap = {
     "silicon valley of india": "Bengaluru",
     "pink city": "Jaipur",
     "city of joy": "Kolkata",
     "financial capital": "Mumbai",
     "capital of india": "New Delhi",
     "city of lakes": "Udaipur",
     "manchester of india": "Ahmedabad",
     "city of pearls": "Hyderabad"
  };

  const fetchWeather = async (lat, lon, cityName) => {
      setLoading(true);
      try {
           const wxRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day,apparent_temperature,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
           const data = await wxRes.json();
           const current = data.current;
           const daily = data.daily;

           let iconClass = "fas fa-cloud";
           let bgUrl = "https://images.unsplash.com/photo-1534088568595-a066f410cbda?q=80&w=1920&auto=format&fit=crop"; 

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

           let conditionStr = mapWeatherCode(current.weather_code);
           iconClass = mapIcon(conditionStr, current.is_day);
           
           if (conditionStr === "Clear" || conditionStr === "Partly Cloudy") {
                bgUrl = "https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=1920&auto=format&fit=crop"; 
           } else if (conditionStr === "Rain Showers" || conditionStr === "Heavy Rain") {
                bgUrl = "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1920&auto=format&fit=crop"; 
           } else if (conditionStr === "Snow" || conditionStr === "Snow Showers") {
                bgUrl = "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?q=80&w=1920&auto=format&fit=crop"; 
           } else if (conditionStr === "Thunderstorm") {
                bgUrl = "https://images.unsplash.com/photo-1605727216801-e27ce1d0ce49?q=80&w=1920&auto=format&fit=crop"; 
           } else if (conditionStr === "Fog") {
                bgUrl = "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?q=80&w=1920&auto=format&fit=crop"; 
           } else {
                bgUrl = "https://images.unsplash.com/photo-1534088568595-a066f410cbda?q=80&w=1920&auto=format&fit=crop"; 
           }

           const generateFarmingAdvice = (condition, temp, wind) => {
               if (condition.includes('Rain') || condition.includes('Showers') || condition.includes('Thunderstorm')) return "Postpone pesticide spraying. Good time for indoor equipment maintenance.";
               if (temp > 35) return "High heat stress. Ensure adequate irrigation and shade for sensitive crops.";
               if (temp < 5) return "Frost warning. Protect sensitive plants with covers or row tunnels.";
               if (wind > 20) return "Strong winds. Avoid spraying chemicals and secure loose farming equipment.";
               if (condition === 'Clear' || condition === 'Partly Cloudy') return "Ideal weather for field work, harvesting, and sowing.";
               return "Weather is stable. Proceed with regular farming activities.";
           };

           const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
           const dailyForecasts = daily.time.slice(0, 5).map((timeStr, index) => {
              const cond = mapWeatherCode(daily.weather_code[index]);
              return {
                 day: index === 0 ? 'Today' : days[new Date(timeStr).getDay()],
                 tempMax: Math.round(daily.temperature_2m_max[index]),
                 tempMin: Math.round(daily.temperature_2m_min[index]),
                 condition: cond,
                 iconCode: mapIcon(cond, true)
              };
           });

           setWeatherData({
              name: cityName,
              temp: Math.round(current.temperature_2m),
              feelsLike: Math.round(current.apparent_temperature),
              humidity: current.relative_humidity_2m,
              wind: Math.round(current.wind_speed_10m),
              precipitation: current.precipitation,
              conditionStr,
              iconClass: iconClass,
              bgImage: bgUrl,
              forecast: dailyForecasts,
              advice: generateFarmingAdvice(conditionStr, current.temperature_2m, current.wind_speed_10m)
           });
           setError(false);
      } catch (err) {
           setError(true);
           setWeatherData(null);
      } finally {
           setLoading(false);
      }
  };

  useEffect(() => {
    const fetchFallbackLocation = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data.latitude && data.longitude) {
          const cityName = data.city ? `${data.city}, ${data.country_name}` : (data.country_name || "Unknown Location");
          fetchWeather(data.latitude, data.longitude, cityName);
        } else {
          fetchWeather(28.6139, 77.2090, "New Delhi");
        }
      } catch (e) {
        fetchWeather(28.6139, 77.2090, "New Delhi");
      }
    };

    if (navigator.geolocation) {
       let locationResolved = false;
       
       navigator.geolocation.getCurrentPosition(async (pos) => {
         if (locationResolved) return;
         locationResolved = true;
         const { latitude, longitude } = pos.coords;
         try {
           const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
           const geoData = await geoRes.json();
           const cityName = geoData.city || geoData.locality || geoData.principalSubdivision || "Current Location";
           const displayName = geoData.countryCode ? `${cityName}, ${geoData.countryCode}` : cityName;
           fetchWeather(latitude, longitude, displayName);
         } catch(e) {
           fetchWeather(latitude, longitude, "Current Location");
         }
       }, () => {
          if (!locationResolved) {
             locationResolved = true;
             fetchFallbackLocation();
          }
       }, { timeout: 5000, maximumAge: 0 });

       setTimeout(() => {
          if (!locationResolved) {
             locationResolved = true;
             fetchFallbackLocation();
          }
       }, 5500);

    } else {
       fetchFallbackLocation();
    }
  }, []);

  const checkWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);
    
    let searchCity = city;
    if (aiSearchMode) {
       const query = city.toLowerCase().trim();
       Object.entries(aiCityMap).forEach(([key, val]) => {
          if (query.includes(key)) searchCity = val;
       });
    }

    try {
      const geoRes = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchCity)}&limit=1`);
      const geoData = await geoRes.json();
      
      if (!geoData.features || geoData.features.length === 0) {
         setError(true);
         setWeatherData(null);
         setLoading(false);
         return;
      }
      
      const location = geoData.features[0];
      const { coordinates } = location.geometry; // [longitude, latitude]
      const { name, state, country } = location.properties;
      
      let displayName = name;
      if (state) displayName += `, ${state}`;
      else if (country) displayName += `, ${country}`;
      
      fetchWeather(coordinates[1], coordinates[0], displayName);
      setCity('');
    } catch(err) {
      setError(true);
      setWeatherData(null);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkWeather();
    }
  };

  return (
    <div 
      className="weather-page-container" 
      style={{ '--dynamic-weather-bg': weatherData ? `url(${weatherData.bgImage})` : 'url(https://images.unsplash.com/photo-1534088568595-a066f410cbda?q=80&w=1920&auto=format&fit=crop)' }}
    >
      <BackButton onClick={onBack} />
      <div className="weather-card">
        
        <div className="weather-search" style={{ display: 'flex', gap: '10px' }}>
          <div style={{ display: 'flex', flex: 1, background: 'rgba(255, 255, 255, 0.2)', borderRadius: '30px', padding: '5px' }}>
            <input 
              type="text" 
              placeholder={aiSearchMode ? "Search city or nickname (e.g. Pink City)..." : "Search any global city..."} 
              spellCheck="false" 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{ background: 'transparent', flex: 1, border: 'none', padding: '10px 15px', color: 'white', outline: 'none' }}
            />
            <button 
              onClick={() => setAiSearchMode(!aiSearchMode)} 
              style={{ background: aiSearchMode ? 'linear-gradient(45deg, #10B981, #3B82F6)' : 'transparent', border: aiSearchMode ? 'none' : '1px solid rgba(255,255,255,0.3)', padding: '6px 15px', borderRadius: '20px', color: 'white', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px', transition: '0.3s', whiteSpace: 'nowrap' }}
              title="Enable AI Semantic Searching"
            >
              <i className="fas fa-sparkles"></i> {aiSearchMode ? "AI Active" : "AI Filter"}
            </button>
            <button onClick={checkWeather}>
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>

        {loading && (
          <div style={{ padding: '20px', color: '#ffffff' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
            <p>Fetching weather data...</p>
          </div>
        )}

        {error && !loading && (
          <div className="weather-error">
            <p>Location not found. Please try another city.</p>
          </div>
        )}

        {weatherData && !loading && (
          <>
            <div className="weather-info">
              <img src={weatherData.iconClass} alt="weather condition" style={{ width: '160px', height: '160px', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))', margin: '0 auto', animation: 'floatIcon 3s ease-in-out infinite' }} />
              <h1 className="temp">{weatherData.temp}°C</h1>
              <h2 className="city">{weatherData.name}</h2>
              <p style={{ color: '#ffffff', fontStyle: 'italic', marginBottom: '20px', fontWeight: '500' }}>{weatherData.conditionStr}</p>

              <div className="weather-details">
                <div className="weather-col">
                  <i className="fas fa-temperature-half weather-detail-icon" style={{color: '#ff9800'}}></i>
                  <div>
                    <p className="humidity-value">{weatherData.feelsLike}°C</p>
                    <p style={{ color: '#ffffff' }}>Feels Like</p>
                  </div>
                </div>

                <div className="weather-col">
                  <i className="fas fa-water weather-detail-icon humidity-icon"></i>
                  <div>
                    <p className="humidity-value">{weatherData.humidity}%</p>
                    <p style={{ color: '#ffffff' }}>Humidity</p>
                  </div>
                </div>

                <div className="weather-col">
                  <i className="fas fa-wind weather-detail-icon wind-icon"></i>
                  <div>
                    <p className="wind-value">{weatherData.wind} km/h</p>
                    <p style={{ color: '#ffffff' }}>Wind</p>
                  </div>
                </div>

                <div className="weather-col">
                  <i className="fas fa-cloud-rain weather-detail-icon" style={{color: '#34d399'}}></i>
                  <div>
                    <p className="wind-value">{weatherData.precipitation} mm</p>
                    <p style={{ color: '#ffffff' }}>Rainfall</p>
                  </div>
                </div>
              </div>

              {/* Farming Advice */}
              <div className="farming-advice" style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', borderLeft: '4px solid var(--primary)', textAlign: 'left' }}>
                 <h4 style={{ color: '#ffffff', margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                   <i className="fas fa-leaf" style={{ color: 'var(--primary)' }}></i> Agri-Insight
                 </h4>
                 <p style={{ color: '#ffffff', fontSize: '14px', marginTop: '5px', marginBottom: 0, fontWeight: '500' }}>
                   {weatherData.advice}
                 </p>
              </div>
            </div>

            {/* Added 5 Day Forecast Panel */}
            <div className="forecast-panel">
               {weatherData.forecast.map((day, idx) => (
                  <div key={idx} className="forecast-day">
                     <p className="f-day">{day.day}</p>
                     <img src={day.iconCode} alt="daily forecast" style={{ width: '50px', height: '50px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }} />
                     <p className="f-temp">{day.tempMax}° <span>{day.tempMin}°</span></p>
                  </div>
               ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Weather;
