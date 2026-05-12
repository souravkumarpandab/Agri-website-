import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import './FertilizerCalculator.css';

const cropNutrients = {
  Rice: { N: 120, P: 60, K: 40 },
  Wheat: { N: 120, P: 60, K: 40 },
  Maize: { N: 120, P: 60, K: 40 },
  Sugarcane: { N: 250, P: 100, K: 100 },
  Cotton: { N: 120, P: 60, K: 60 },
  Potato: { N: 120, P: 80, K: 100 },
  Onion: { N: 100, P: 50, K: 50 },
  Tomato: { N: 100, P: 50, K: 50 }
};

const FertilizerCalculator = () => {
  const [crop, setCrop] = useState('Rice');
  const [unit, setUnit] = useState('Hectare');
  const [area, setArea] = useState(1);
  const [showReference, setShowReference] = useState(false);

  const getMultiplier = () => {
    if (unit === 'Hectare') return 1;
    if (unit === 'Acre') return 0.404686;
    if (unit === 'Bigha') return 0.25;
    return 1;
  };

  const currentNutrients = cropNutrients[crop];
  const multiplier = getMultiplier() * (area || 0);

  const reqN = (currentNutrients.N * multiplier).toFixed(1);
  const reqP = (currentNutrients.P * multiplier).toFixed(1);
  const reqK = (currentNutrients.K * multiplier).toFixed(1);

  // Calculations for DAP, Urea, MOP
  const dapNeeded = (reqP / 0.46).toFixed(1);
  const nFromDap = (dapNeeded * 0.18).toFixed(1);
  const remainingN = Math.max(0, reqN - nFromDap);
  const ureaNeeded = (remainingN / 0.46).toFixed(1);
  const mopNeeded = (reqK / 0.60).toFixed(1);

  return (
    <div className="fc-page">
      <BackButton />
      
      <div className="fc-header">
        <div className="fc-logo-title">
          <i className="fas fa-layer-group"></i>
          <span>AgriSahayak</span>
        </div>
        <h1>Fertilizer Calculator</h1>
      </div>

      <div className="fc-container">
        {/* INPUT FIELD PARAMETERS */}
        <div className="fc-section">
          <h3 className="fc-section-title">INPUT FIELD PARAMETERS</h3>
          
          <div className="fc-input-group">
            <label>Select Crop</label>
            <div className="fc-select-wrapper">
              <select value={crop} onChange={(e) => setCrop(e.target.value)}>
                {Object.keys(cropNutrients).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <i className="fas fa-chevron-down fc-select-icon"></i>
            </div>
          </div>

          <div className="fc-row">
            <div className="fc-input-group">
              <label>Select Area Unit</label>
              <div className="fc-select-wrapper">
                <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                  <option value="Hectare">Hectare</option>
                  <option value="Acre">Acre</option>
                  <option value="Bigha">Bigha</option>
                </select>
                <i className="fas fa-chevron-down fc-select-icon"></i>
              </div>
            </div>
            <div className="fc-input-group">
              <label>Area</label>
              <input 
                type="number" 
                value={area} 
                onChange={(e) => setArea(parseFloat(e.target.value) || '')} 
                min="0.1" 
                step="0.1" 
              />
            </div>
          </div>
        </div>

        <hr className="fc-divider" />

        {/* NUTRIENT REQUIREMENT */}
        <div className="fc-section">
          <h3 className="fc-section-title">NUTRIENT REQUIREMENT (kg/{unit})</h3>
          <div className="fc-nutrients-row">
            <div className="fc-nutrient">
              <span className="fc-label">N (Nitrogen):</span>
              <span className="fc-value">{reqN}kg</span>
            </div>
            <div className="fc-nutrient">
              <span className="fc-label">P₂O₅ (Phosphorus):</span>
              <span className="fc-value">{reqP}kg</span>
            </div>
            <div className="fc-nutrient">
              <span className="fc-label">K₂O (Potash):</span>
              <span className="fc-value">{reqK}kg</span>
            </div>
          </div>
        </div>

        <hr className="fc-divider" />

        {/* SELECT FERTILIZERS */}
        <div className="fc-section">
          <h3 className="fc-section-title">SELECT FERTILIZERS</h3>
          <div className="fc-fertilizer-cards">
            <div className="fc-fert-card selected">
              <div className="fc-fert-icon urea">
                 <i className="fas fa-sack-xmark"></i>
              </div>
              <span className="fc-fert-name">Urea</span>
              <span className="fc-fert-npk">N-P-K [46, 0, 0]</span>
              <div className="fc-check-badge"><i className="fas fa-check"></i></div>
            </div>
            <div className="fc-fert-card selected">
              <div className="fc-fert-icon dap">
                 <i className="fas fa-sack-dollar"></i>
              </div>
              <span className="fc-fert-name">DAP</span>
              <span className="fc-fert-npk">N-P-K [18, 46, 0]</span>
              <div className="fc-check-badge"><i className="fas fa-check"></i></div>
            </div>
            <div className="fc-fert-card selected">
              <div className="fc-fert-icon mop">
                 <i className="fas fa-box-open"></i>
              </div>
              <span className="fc-fert-name">MOP</span>
              <span className="fc-fert-npk">N-P-K [0, 0, 60]</span>
              <div className="fc-check-badge"><i className="fas fa-check"></i></div>
            </div>
          </div>

          <div className="fc-combination">
            <span>Combination 1</span>
            <div className="fc-radio-group">
               <label className="fc-radio">
                 <input type="radio" name="combo" checked readOnly />
                 <span className="fc-radio-custom"></span>
                 DAP, Urea & MOP
               </label>
            </div>
          </div>
        </div>

        <hr className="fc-divider" />

        {/* CALCULATED REQUIREMENTS */}
        <div className="fc-section fc-results">
          <h3 className="fc-section-title">CALCULATED REQUIREMENTS ({area} {unit})</h3>
          
          <div className="fc-calc-step">
            <div className="fc-step-left">
              <span>STEP A:</span>
              <span>P₂O₅</span>
              <span className="fc-subtext">(DAP Calc)</span>
            </div>
            <div className="fc-step-formula">
              <div className="fc-bag n-bag">DAP</div>
              <span className="fc-math">→</span>
              <div className="fc-circle p-circle">P₂O₅</div>
              <span className="fc-math">+</span>
              <div className="fc-circle n-circle">N</div>
            </div>
          </div>
          
          <div className="fc-calc-result-box">
             <div className="fc-result-main">[ {dapNeeded} kg DAP ]</div>
             <div className="fc-result-sub">[Note: Also provides {nFromDap}kg Nitrogen]</div>
          </div>

          <div className="fc-calc-step" style={{marginTop: '25px'}}>
            <div className="fc-step-left">
              <span>STEP B:</span>
              <span>N</span>
              <span className="fc-subtext">(Urea Calc)</span>
            </div>
            <div className="fc-step-formula">
              <div className="fc-bag u-bag">Urea</div>
              <span className="fc-math">→</span>
              <div className="fc-circle n-circle">N</div>
            </div>
          </div>
          <div className="fc-calc-result-box">
             <div className="fc-result-main">[ {ureaNeeded} kg Urea ]</div>
             <div className="fc-result-sub">[Note: Fulfills remaining Nitrogen requirement]</div>
          </div>

          <div className="fc-calc-step" style={{marginTop: '25px'}}>
            <div className="fc-step-left">
              <span>STEP C:</span>
              <span>K₂O</span>
              <span className="fc-subtext">(MOP Calc)</span>
            </div>
            <div className="fc-step-formula">
              <div className="fc-bag m-bag">MOP</div>
              <span className="fc-math">→</span>
              <div className="fc-circle k-circle">K₂O</div>
            </div>
          </div>
          <div className="fc-calc-result-box" style={{marginBottom: '20px'}}>
             <div className="fc-result-main">[ {mopNeeded} kg MOP ]</div>
          </div>

          <div className="fc-accordion" onClick={() => setShowReference(!showReference)}>
            <span>Reference & Formula</span>
            <i className={`fas fa-chevron-${showReference ? 'up' : 'down'}`}></i>
          </div>
          
          {showReference && (
            <div className="fc-reference-content">
              <h4>Fertilizer Nutrient Content:</h4>
              <ul>
                <li><strong>Urea:</strong> 46% Nitrogen (N)</li>
                <li><strong>DAP:</strong> 18% Nitrogen (N), 46% Phosphorus (P₂O₅)</li>
                <li><strong>MOP:</strong> 60% Potassium (K₂O)</li>
              </ul>
              
              <h4>Calculation Formulas:</h4>
              <ol>
                <li><strong>DAP Required:</strong> Required P₂O₅ ÷ 0.46</li>
                <li><strong>N provided by DAP:</strong> DAP Required × 0.18</li>
                <li><strong>Remaining N Required:</strong> Total Required N - N provided by DAP</li>
                <li><strong>Urea Required:</strong> Remaining N Required ÷ 0.46</li>
                <li><strong>MOP Required:</strong> Required K₂O ÷ 0.60</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FertilizerCalculator;
