import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Footer.css';

const Footer = () => {
  const [showAppModal, setShowAppModal] = useState(false);
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section about">
          <div className="logo" style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', color: 'white', fontSize: '2.5rem', fontWeight: 600 }}>
            <i className="fas fa-seedling"></i>&nbsp;AgriSahayak
          </div>
          <p>AgriSahayak: Empowering agricultural communities with intelligent technology.</p>
          <p style={{ marginTop: '20px', fontSize: '1.15rem', color: '#94a3b8' }}>&copy; {new Date().getFullYear()} AgriSahayak. All Rights Reserved.</p>
        </div>

        <div className="footer-section links">
          <h3>QUICK LINKS</h3>
          <ul>
            <li><a href="/#comprehensive-features">Features</a></li>
            <li><a href="/#about">Our Mission</a></li>
            <li><a href="/#stats">Research</a></li>
            <li><Link to="/dashboard">Market Insights</Link></li>
          </ul>
        </div>

        <div className="footer-section services">
          <h3>SUPPORT</h3>
          <ul>
            <li><Link to="/help-support">Help Center</Link></li>
            <li><Link to="/help-support">FAQs</Link></li>
            <li><Link to="/help-support">Raise a Ticket</Link></li>
            <li><Link to="/community">Community</Link></li>
          </ul>
        </div>

        <div className="footer-section resources">
          <h3>RESOURCES</h3>
          <ul>
            <li><Link to="/community">Blog</Link></li>
            <li><Link to="/resources">Research Papers</Link></li>
            <li><Link to="/resources">User Guide</Link></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setShowAppModal(true); }}>App Download</a></li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h3>CONTACT & COMPANY</h3>
          <ul>
            <li style={{ alignItems: 'flex-start' }}><i className="fas fa-envelope" style={{ marginTop: '4px' }}></i> Customer Support: <br />souravkumarpandab1437@gmail.com</li>
            <li><i className="fas fa-phone"></i> Helpline: +91 9040573208</li>
            <li style={{ alignItems: 'flex-start' }}><i className="fas fa-map-marker-alt" style={{ marginTop: '4px' }}></i> Location: Keshari Nagar, Bhubaneswar, India 751001</li>
          </ul>
          <div className="socials" style={{ marginTop: '15px' }}>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-facebook-f"></i></a>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAppModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, backdropFilter: 'blur(5px)' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }} 
              style={{ background: 'linear-gradient(135deg, #051A11 0%, #0a110c 100%)', border: '1px solid #10B981', padding: '40px', borderRadius: '20px', maxWidth: '500px', width: '90%', position: 'relative', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
            >
              <button onClick={() => setShowAppModal(false)} style={{ position: 'absolute', top: '15px', right: '20px', background: 'transparent', border: 'none', color: '#EF4444', fontSize: '2rem', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e)=>e.target.style.transform='scale(1.1)'} onMouseLeave={(e)=>e.target.style.transform='scale(1)'}>&times;</button>
              
              <h2 style={{ color: '#10B981', fontSize: '2rem', marginBottom: '10px' }}><i className="fas fa-mobile-alt"></i> Mobile App</h2>
              <p style={{ color: '#cbd5e1', lineHeight: '1.6', marginBottom: '25px', fontSize: '1rem' }}>Take AgriSahayak anywhere. Get instant offline crop diagnosis, live Mandi alerts, and drone booking right from your phone.</p>
              
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                <div style={{ background: 'white', padding: '15px', borderRadius: '15px', display: 'inline-block' }}>
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://agrisahayak.com/download" alt="Download QR" style={{ display: 'block', width: '130px', height: '130px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button style={{ background: '#333', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => { alert('Subscribed to iOS updates!'); setShowAppModal(false); }}>
                  <i className="fab fa-apple" style={{ fontSize: '1.3rem' }}></i> App Store
                </button>
                <button style={{ background: '#0F3323', color: 'white', border: '1px solid #10B981', padding: '12px 25px', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => { alert('Subscribed to Android updates!'); setShowAppModal(false); }}>
                  <i className="fab fa-google-play" style={{ fontSize: '1.3rem', color: '#10B981' }}></i> Google Play
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
