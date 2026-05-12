import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';
import './ExtraPages.css';

const HelpSupport = () => {
  const [activeTab, setActiveTab] = useState('faq');

  const faqs = [
    { q: "How do I use the Crop Recommendation tool?", a: "Navigate to the Dashboard and click on 'Crop Recommendation'. Enter your soil NPK values and get AI-driven suggestions." },
    { q: "Is the Mandi Prices data real-time?", a: "Yes, our Mandi prices are updated dynamically based on real-time market integrations and your location." },
    { q: "How can I contact an agricultural expert?", a: "You can raise a support ticket here or use the AI Assistant for immediate guidance." },
  ];

  return (
    <motion.div 
      className="extra-page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <BackButton to="/" />
      
      <div className="extra-header">
        <h1>Help & Support Center</h1>
        <p>We are here to assist you with all your farming and app-related queries.</p>
      </div>

      <div className="extra-content">
        <div className="tabs">
          <button className={activeTab === 'faq' ? 'active' : ''} onClick={() => setActiveTab('faq')}>FAQs</button>
          <button className={activeTab === 'ticket' ? 'active' : ''} onClick={() => setActiveTab('ticket')}>Raise a Ticket</button>
        </div>

        {activeTab === 'faq' && (
          <div className="tab-content faq-section">
            <h2>Frequently Asked Questions</h2>
            {faqs.map((faq, idx) => (
              <div key={idx} className="faq-card">
                <h4>{faq.q}</h4>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ticket' && (
          <div className="tab-content ticket-section">
            <h2>Submit a Support Request</h2>
            <form onSubmit={(e) => { e.preventDefault(); alert('Ticket submitted successfully! Our team will contact you soon.'); }}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" placeholder="Enter your full name" required />
              </div>
              <div className="form-group">
                <label>Issue Topic</label>
                <select required>
                  <option value="">Select Topic...</option>
                  <option>App Functionality</option>
                  <option>Farming Advice</option>
                  <option>Account Issues</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="4" placeholder="Describe your issue in detail..." required></textarea>
              </div>
              <button type="submit" className="submit-btn">Submit Ticket</button>
            </form>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default HelpSupport;
