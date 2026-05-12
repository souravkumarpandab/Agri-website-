import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, formattedSessionTime } = useAuth();

  // Retain legacy check for fallback syncing
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated);
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,hi,bn,te,mr,ta,ur,gu,kn,ml,pa,as,or',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
      }
    };

    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else {
      // If script already exists but component re-mounted, initialize manually
      if (window.googleTranslateElementInit) {
        window.googleTranslateElementInit();
      }
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav>
      <div className="logo">
        <i className="fas fa-seedling"></i>&nbsp;AgriSahayak
      </div>

      {/* Hamburger Icon for Mobile */}
      <div className="mobile-menu-icon" onClick={toggleMenu}>
        <i className={isOpen ? "fas fa-times" : "fas fa-bars"}></i>
      </div>

      <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
        <li><a style={{cursor: 'pointer'}} onClick={() => { setIsOpen(false); const el = document.getElementById('home'); if(el) el.scrollIntoView({behavior: 'smooth'}); else navigate('/'); }}>Home</a></li>
        <li><a style={{cursor: 'pointer'}} onClick={() => { setIsOpen(false); const el = document.getElementById('about'); if(el) el.scrollIntoView({behavior: 'smooth'}); else { navigate('/'); setTimeout(()=> document.getElementById('about')?.scrollIntoView({behavior:'smooth'}), 300); } }}>About Us</a></li>
        <li><a style={{cursor: 'pointer'}} onClick={() => { setIsOpen(false); const el = document.getElementById('features'); if(el) el.scrollIntoView({behavior: 'smooth'}); else { navigate('/'); setTimeout(()=> document.getElementById('features')?.scrollIntoView({behavior:'smooth'}), 300); } }}>Services</a></li>
        <li className="translate-container">
          {/* Persistent Global Google Translate Widget */}
          <div id="google_translate_element"></div>
        </li>

        {isLoggedIn ? (
          <>
            {user && (
              <li style={{ display: 'flex', alignItems: 'center', marginRight: '15px', color: '#2e7d32', fontWeight: 'bold', gap: '8px' }}>
                <img 
                  src={user.photo || `https://ui-avatars.com/api/?name=${user.name || 'User'}&background=10B981&color=fff`} 
                  alt="Profile" 
                  style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #10B981' }} 
                />
                <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.85rem' }}>
                  <span>{user.name || 'User'}</span>
                  <span style={{ fontSize: '0.7rem', color: '#666', fontWeight: 'normal' }}><i className="fas fa-clock" style={{fontSize: '0.65rem', marginRight: '4px'}}></i>Session: {formattedSessionTime}</span>
                </div>
              </li>
            )}
            <li><Link to="/dashboard" className="btn-nav" style={{ marginRight: '10px', background: '#10B981', color: 'white', textDecoration: 'none', padding: '8px 15px', borderRadius: '5px' }} onClick={() => setIsOpen(false)}>Dashboard</Link></li>
            <li><button className="btn-nav" style={{ background: '#d32f2f', border: 'none', cursor: 'pointer', padding: '8px 15px', borderRadius: '5px', color: 'white' }} onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <li><Link to="/login" className="btn-nav" onClick={() => setIsOpen(false)}>Login / Register</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
