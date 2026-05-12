const fs = require('fs');

let c = fs.readFileSync('frontend/src/pages/Dashboard.jsx', 'utf8');

if (!c.includes('BarChart')) {
   c = c.replace(/import \{ LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer \} from 'recharts';/,
   `import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';`);
}

if (!c.includes('SoilMoisture: 45')) {
  c = c.replace(/\{ time: '10:00', Wheat: 2300, Rice: 2100 \},/, `{ time: '10:00', Wheat: 2300, Rice: 2100, Maize: 1500, Cotton: 6000, Sugarcane: 300, Potato: 800, SoilMoisture: 45 },`)
       .replace(/\{ time: '10:05', Wheat: 2310, Rice: 2120 \},/, `{ time: '10:05', Wheat: 2310, Rice: 2120, Maize: 1520, Cotton: 6050, Sugarcane: 305, Potato: 810, SoilMoisture: 44 },`)
       .replace(/\{ time: '10:10', Wheat: 2280, Rice: 2090 \},/, `{ time: '10:10', Wheat: 2280, Rice: 2090, Maize: 1490, Cotton: 5980, Sugarcane: 298, Potato: 790, SoilMoisture: 42 },`)
       .replace(/\{ time: '10:15', Wheat: 2350, Rice: 2150 \},/, `{ time: '10:15', Wheat: 2350, Rice: 2150, Maize: 1550, Cotton: 6100, Sugarcane: 310, Potato: 820, SoilMoisture: 40 },`)
       .replace(/\{ time: '10:20', Wheat: 2340, Rice: 2130 \},/, `{ time: '10:20', Wheat: 2340, Rice: 2130, Maize: 1540, Cotton: 6080, Sugarcane: 308, Potato: 815, SoilMoisture: 45 },`);

  c = c.replace(/Rice: lastPoint\.Rice \+ \(Math\.floor\(Math\.random\(\) \* 30\) - 15\),/,
  `Rice: lastPoint.Rice + (Math.floor(Math.random() * 30) - 15),\n           Maize: lastPoint.Maize + (Math.floor(Math.random() * 30) - 15),\n           Cotton: lastPoint.Cotton + (Math.floor(Math.random() * 100) - 50),\n           Sugarcane: lastPoint.Sugarcane + (Math.floor(Math.random() * 10) - 5),\n           Potato: lastPoint.Potato + (Math.floor(Math.random() * 20) - 10),\n           SoilMoisture: Math.max(10, Math.min(100, lastPoint.SoilMoisture + (Math.floor(Math.random() * 6) - 3))),`);
}

if (c.includes('<i className="fas fa-map-marker-alt"></i> {weatherData.location}')) {
  c = c.replace(/<i className="fas fa-map-marker-alt"><\/i> \{weatherData\.location\}/,
  `<i className="fas fa-map-marker-alt"></i> Current Location: {weatherData.location}\n                           </div>\n                           <button className="action-btn" onClick={() => window.open(\`https://weather.com/weather/today/l/\${weatherData.location}\`, 'WeatherPopup', 'width=800,height=600')} style={{ marginTop: '10px', fontSize: '0.82rem', padding: '6px 12px' }}>\n                             <i className="fas fa-external-link-alt"></i> Detailed Weather\n                           </button>`);
}

if (!c.includes('<option value="Maize">')) {
   c = c.replace(/<option value="Rice">Rice Market<\/option>/,
   `<option value="Rice">Rice Market</option>\n                              <option value="Maize">Maize Market</option>\n                              <option value="Cotton">Cotton Market</option>\n                              <option value="Sugarcane">Sugarcane Market</option>\n                              <option value="Potato">Potato Market</option>`);

   c = c.replace(/\{mandiCrop === 'Rice' && <Line type="monotone" dataKey="Rice" stroke="#10B981" strokeWidth=\{3\} dot=\{\{r: 3, fill: '#10B981'\}\} animationDuration=\{500\} \/>\}/,
   `{mandiCrop === 'Rice' && <Line type="monotone" dataKey="Rice" stroke="#10B981" strokeWidth={3} dot={{r: 3, fill: '#10B981'}} animationDuration={500} />}\n                                {mandiCrop === 'Maize' && <Line type="monotone" dataKey="Maize" stroke="#F59E0B" strokeWidth={3} dot={{r: 3, fill: '#F59E0B'}} animationDuration={500} />}\n                                {mandiCrop === 'Cotton' && <Line type="monotone" dataKey="Cotton" stroke="#EC4899" strokeWidth={3} dot={{r: 3, fill: '#EC4899'}} animationDuration={500} />}\n                                {mandiCrop === 'Sugarcane' && <Line type="monotone" dataKey="Sugarcane" stroke="#8B5CF6" strokeWidth={3} dot={{r: 3, fill: '#8B5CF6'}} animationDuration={500} />}\n                                {mandiCrop === 'Potato' && <Line type="monotone" dataKey="Potato" stroke="#64748B" strokeWidth={3} dot={{r: 3, fill: '#64748B'}} animationDuration={500} />}`);

   c = c.replace(/<\/LineChart>\s*<\/ResponsiveContainer>\s*<\/div>\s*<\/div>/,
   `</LineChart>\n                        </ResponsiveContainer>\n                     </div>\n                  </div>\n                  <div className="dash-card" style={{ marginTop: '25px' }}>\n                     <div className="chart-header">\n                        <div>\n                           <h3><i className="fas fa-water" style={{color: '#60A5FA'}}></i> Live Soil Moisture Analytics</h3>\n                        </div>\n                     </div>\n                     <div style={{ height: '180px', width: '100%', marginTop: '15px' }}>\n                        <ResponsiveContainer width="100%" height="100%">\n                            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>\n                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />\n                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 12}} dy={10} />\n                                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 12}} domain={[0, 100]} />\n                                <Tooltip contentStyle={{ backgroundColor: 'var(--sidebar-bg)', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />\n                                <Bar dataKey="SoilMoisture" fill="#3B82F6" radius={[4, 4, 0, 0]} animationDuration={500} />\n                            </BarChart>\n                        </ResponsiveContainer>\n                     </div>\n                  </div>`);
}

fs.writeFileSync('frontend/src/pages/Dashboard.jsx', c);
console.log('Success replacing Dashboard.jsx content.');
