import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { testimonials } from '../data/testimonials';
import './Home.css';

const images = [
  "https://images.unsplash.com/photo-1500937386664-56d1dfef4522?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1530836369250-ef71a3f5e481?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1920&q=80"
];

const Home = () => {
  const { t } = useLanguage();
  const [currentImg, setCurrentImg] = useState(0);
  const [currentTesti, setCurrentTesti] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    }, 5000); // changes image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const testiInterval = setInterval(() => {
      setCurrentTesti((prev) => (prev + 1) % testimonials.length);
    }, 6000); // changes testimonial every 6 seconds
    return () => clearInterval(testiInterval);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" exit="hidden" id="home">
      
      {/* ADVANCED HERO SECTION */}
      <section className="hero-container">
        {/* Background Slider */}
        <AnimatePresence mode="wait">
             <motion.div
               key={currentImg}
               initial={{ opacity: 0, scale: 1.05 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 1.5 }}
               className="hero-bg-layer"
               style={{ backgroundImage: `url(${images[currentImg]})` }}
             />
        </AnimatePresence>
        
        {/* Gradient Overlay for better contrast */}
        <div className="hero-overlay-gradient"></div>

        <div className="hero-content">
          <div className="hero-text-content">
             <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="hero-badge">
                <span className="pulse-dot"></span> Next-Gen Agriculture AI
             </motion.div>
             
             <motion.h1 variants={fadeInUp} initial="hidden" animate="visible" dangerouslySetInnerHTML={{ __html: t('hero_title') }} />
             
             <motion.p variants={fadeInUp} initial="hidden" animate="visible">
                {t('hero_desc')}
             </motion.p>
             
             <motion.div className="hero-buttons" variants={fadeInUp} initial="hidden" animate="visible">
                <Link to="/login" className="hero-btn-primary">
                   {t('hero_btn')} <i className="fas fa-arrow-right" style={{marginLeft: '5px'}}></i>
                </Link>
                <a href="#features" className="hero-btn-secondary">
                   Explore Features
                </a>
             </motion.div>
          </div>

          <motion.div className="hero-visuals" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="floating-card card-1"><i className="fas fa-seedling"></i><h6>Crop Recommendation</h6></div>
            <div className="floating-card card-2"><i className="fas fa-vial"></i><h6>Fertilizer Calculator</h6></div>
            <div className="floating-card card-3"><i className="fas fa-bug"></i><h6>Disease Detection</h6></div>
            <div className="floating-card card-4"><i className="fas fa-cloud-sun-rain"></i><h6>Weather Alerts</h6></div>
            <div className="floating-card card-5"><i className="fas fa-landmark"></i><h6>Govt. Schemes</h6></div>
            <div className="floating-card card-6"><i className="fas fa-chart-line"></i><h6>Mandi Prices</h6></div>
            <div className="floating-card card-7"><i className="fas fa-drone"></i><h6>Digital Farming</h6></div>
            <div className="floating-card card-8"><i className="fas fa-leaf"></i><h6>Organic Tips</h6></div>
          </motion.div>
        </div>
      </section>

      <section className="about" id="about">
        <motion.div 
          className="about-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.div className="about-img" variants={fadeInUp}>
            <img src="/image/agriabout.png" alt="Farmer using tablet technology" />
          </motion.div>
          <motion.div className="about-text" variants={fadeInUp}>
            <span className="section-header">{t('about_small')}</span>
            <h2>{t('about_title')}</h2>
            <p>{t('about_p1')}</p>
            <p>{t('about_p2')}</p>
          </motion.div>
        </motion.div>
      </section>

      <section className="stats" id="stats">
        <div className="stats-container">
          <motion.div className="stat-box" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h3>10k+</h3>
            <p>Happy Farmers</p>
          </motion.div>
          <motion.div className="stat-box" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h3>50+</h3>
            <p>Crop Varieties</p>
          </motion.div>
          <motion.div className="stat-box" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h3>99%</h3>
            <p>AI Accuracy</p>
          </motion.div>
          <motion.div className="stat-box" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h3>24/7</h3>
            <p>Expert Support</p>
          </motion.div>
        </div>
      </section>

      {/* COMPREHENSIVE FEATURE SET */}
      <section className="comprehensive-features" id="comprehensive-features">
        <div className="comp-features-bg"></div>
        <div className="comp-features-content">
          <motion.h2 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={fadeInUp}
          >
            AGRI-ASSIST: COMPREHENSIVE FEATURE SET
          </motion.h2>

          <motion.div 
            className="comp-features-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {/* Card 1 */}
            <motion.div className="comp-card" variants={fadeInUp}>
              <div className="comp-card-header">
                <i className="fas fa-microscope"></i>
                <h4>Pest and Disease Detection</h4>
              </div>
              <div className="comp-card-body">
                <div className="comp-sub-item">
                  <h5>Pest Scanner</h5>
                  <p>- Leaf Spot Detected (75% confidence)</p>
                  <p>- Rust Detected (20% confidence)</p>
                </div>
                <div className="comp-sub-item">
                  <p><strong>Pathogen ID:</strong> "Cercospora"</p>
                  <p>Treatment Recommendation in App</p>
                </div>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div className="comp-card" variants={fadeInUp}>
              <div className="comp-card-header">
                <i className="fas fa-seedling"></i>
                <h4>Dashboard Overview</h4>
              </div>
              <div className="comp-card-body">
                <div className="comp-sub-item">
                  <h5>AI Crop Advice (Diagnosis)</h5>
                  <p><strong>AI Advisor:</strong> Diagnosis of symptoms complete. Early intervention recommended. Detailed plan generated.</p>
                </div>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div className="comp-card" variants={fadeInUp}>
              <div className="comp-card-header">
                <i className="fas fa-flask"></i>
                <h4>Soil Carbon & Nutrient Analysis</h4>
              </div>
              <div className="comp-card-body">
                <div className="comp-sub-item">
                  <h5>Carbon Cycle</h5>
                  <p>C sequestration rate: 0.8 tC/ha/yr.</p>
                  <p>NPK ratio: 13-6-9</p>
                  <p>Humus content: 4.1%</p>
                </div>
                <div className="comp-sub-item">
                  <h5>Carbon Sequestration Credits</h5>
                  <p>Credits: 1.2 tC/ha earned.</p>
                  <p>Sell value: $15.00/credit</p>
                </div>
              </div>
            </motion.div>

            {/* Card 4 */}
            <motion.div className="comp-card" variants={fadeInUp}>
              <div className="comp-card-header">
                <i className="fas fa-vial"></i>
                <h4>Real-time Fertilizer Optimization</h4>
              </div>
              <div className="comp-card-body">
                <div className="comp-sub-item">
                  <p><strong>N-P-K (Ratio) Optimized:</strong> 12-5-9.</p>
                  <p>Micro-nutrient boost active.</p>
                  <p>Apply within 2 hours.</p>
                </div>
              </div>
            </motion.div>

            {/* Card 5 */}
            <motion.div className="comp-card" variants={fadeInUp}>
              <div className="comp-card-header">
                <i className="fas fa-cloud-sun-rain"></i>
                <h4>Advanced Hyper-Local Weather</h4>
              </div>
              <div className="comp-card-body">
                <div className="comp-sub-item">
                  <h5>10-Day Forecast</h5>
                  <p>Stability forecast. High sun index, moderate rain on day 7.</p>
                  <p>Pest risk: Low</p>
                </div>
              </div>
            </motion.div>

            {/* Card 6 */}
            <motion.div className="comp-card" variants={fadeInUp}>
              <div className="comp-card-header">
                <i className="fas fa-robot"></i>
                <h4>AI Chatbot Assistant</h4>
              </div>
              <div className="comp-card-body">
                <div className="comp-sub-item">
                  <p><strong>Chatbot:</strong> "Hello! All systems are green. Would you like to review your new pest prevention plan or check market rates?"</p>
                </div>
              </div>
            </motion.div>

            {/* Card 7 */}
            <motion.div className="comp-card" variants={fadeInUp}>
              <div className="comp-card-header">
                <i className="fas fa-chart-line"></i>
                <h4>Pest & Disease Prediction Models</h4>
              </div>
              <div className="comp-card-body">
                <div className="comp-sub-item">
                  <h5>Predictive Model</h5>
                  <p>Rust alert (70% probability) for neighboring plots in 3 days.</p>
                  <p>Preventative application planned.</p>
                </div>
              </div>
            </motion.div>

            {/* Card 8 */}
            <motion.div className="comp-card" variants={fadeInUp}>
              <div className="comp-card-header">
                <i className="fas fa-landmark"></i>
                <h4>Government Schemes & Grants</h4>
              </div>
              <div className="comp-card-body">
                <div className="comp-sub-item">
                  <h5>Agri-Funds Finder</h5>
                  <p><strong>Grant Status:</strong> Application for NMSA scheme is 80% complete.</p>
                  <p><strong>Action required:</strong> Upload soil health card.</p>
                </div>
                <div className="comp-sub-item">
                  <h5>Digital Market Access</h5>
                  <p>Local market prices: Up 5%.</p>
                  <p>Recommended sell window for Corn confirmed.</p>
                </div>
              </div>
            </motion.div>

            {/* Card 9 */}
            <motion.div className="comp-card" variants={fadeInUp}>
              <div className="comp-card-header">
                <i className="fas fa-coins"></i>
                <h4>Yield and Market Prediction</h4>
              </div>
              <div className="comp-card-body">
                <div className="comp-sub-item">
                  <h5>Harvest Forecast</h5>
                  <p>Est. Yield: 4.2 t/ha</p>
                </div>
                <div className="comp-sub-item">
                  <h5>Unified Digital Farming Records</h5>
                  <p>Records: 100% up-to-date.</p>
                  <p>All soil, treatment, and yield data is synchronized.</p>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      <section className="features" id="features">
        <motion.h2 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }} 
          variants={fadeInUp}
        >
          {t('service_title')}
        </motion.h2>
        
        <motion.div 
          className="feature-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          {[
            { icon: "fa-wheat-awn", title: 'card1_title', desc: 'card1_desc' },
            { icon: "fa-flask-vial", title: 'card2_title', desc: 'card2_desc' },
            { icon: "fa-camera-retro", title: 'card3_title', desc: 'card3_desc' },
            { icon: "fa-cloud-showers-heavy", title: 'card4_title', desc: 'card4_desc' },
            { icon: "fa-hand-holding-dollar", title: 'card5_title', desc: 'card5_desc' },
            { icon: "fa-shop", title: 'card6_title', desc: 'card6_desc' },
            { icon: "fa-drone", title: 'card7_title', desc: 'card7_desc' },
            { icon: "fa-leaf", title: 'card8_title', desc: 'card8_desc' },
            { icon: "fa-robot", title: 'card9_title', desc: 'card9_desc' }
          ].map((card, index) => (
            <motion.div 
              className="feature-card" 
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="icon-box"><i className={`fas ${card.icon}`}></i></div>
              <h3>{t(card.title)}</h3>
              <p>{t(card.desc)}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="how-it-works">
        <div className="how-bg"></div>
        <div className="how-content">
          <motion.h2 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            How AgriSmart Works
          </motion.h2>
          <div className="how-grid">
            <motion.div className="how-step" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="step-number">1</div>
              <h4>Create an Account</h4>
              <p>Sign up and tell us about your farm, crop type, and location to personalize your experience.</p>
            </motion.div>
            <motion.div className="how-step" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="step-number">2</div>
              <h4>Get AI Insights</h4>
              <p>Receive real-time weather alerts, precise fertilizer calculations, and instant disease detection.</p>
            </motion.div>
            <motion.div className="how-step" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="step-number">3</div>
              <h4>Boost Yield & Profit</h4>
              <p>Apply our actionable recommendations to increase your harvest and track live Mandi prices to sell smart.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="testimonials">
        <div className="testi-bg"></div>
        <div className="testi-content">
          <motion.h2 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Success Stories from the Field
          </motion.h2>
          <div className="testi-slider-wrapper" style={{ position: 'relative', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentTesti}
                className="testi-card" 
                initial={{ opacity: 0, x: 50 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                style={{ position: 'absolute', maxWidth: '800px', width: '90%', margin: '0 auto', textAlign: 'center', left: 0, right: 0 }}
              >
                <i className="fas fa-quote-left" style={{ margin: '0 auto 20px', display: 'block', textAlign: 'center' }}></i>
                <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>"{testimonials[currentTesti].text}"</p>
                <h5 style={{ textAlign: 'center' }}>{testimonials[currentTesti].author}</h5>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="testi-dots" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', marginTop: '10px', position: 'relative', zIndex: 2, color: 'var(--accent-green)' }}>
            <i className="fas fa-chevron-left" style={{ cursor: 'pointer', padding: '10px', fontSize: '1.2rem', transition: 'transform 0.2s' }} onMouseEnter={(e)=>e.target.style.transform='scale(1.2)'} onMouseLeave={(e)=>e.target.style.transform='scale(1)'} onClick={() => setCurrentTesti(prev => prev === 0 ? testimonials.length - 1 : prev - 1)}></i>
            
            <i className="fas fa-chevron-right" style={{ cursor: 'pointer', padding: '10px', fontSize: '1.2rem', transition: 'transform 0.2s' }} onMouseEnter={(e)=>e.target.style.transform='scale(1.2)'} onMouseLeave={(e)=>e.target.style.transform='scale(1)'} onClick={() => setCurrentTesti(prev => (prev + 1) % testimonials.length)}></i>
          </div>
        </div>
      </section>

    </motion.div>
  );
};

export default Home;
