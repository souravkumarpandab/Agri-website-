import React, { useState } from 'react';
import './Dashboard.css';

const Feedback = ({ onBack }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }

    try {
      const userDataStr = sessionStorage.getItem('agri_user_session');
      let userPhone = '';
      if (userDataStr) {
        userPhone = JSON.parse(userDataStr).phone || '';
      }

      await fetch('${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:5000"}`}/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, feedbackText, userPhone })
      });
      
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }

    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', background: 'rgba(0,0,0,0.2)', padding: '30px', borderRadius: '15px', border: '1px solid rgba(16,185,129,0.2)' }}>
      <div className="feature-content">
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'white' }}>
            <i className="fas fa-check-circle" style={{ fontSize: '4rem', color: '#10B981', marginBottom: '20px' }}></i>
            <h3>Thank You!</h3>
            <p style={{ color: '#94A3B8', marginTop: '10px' }}>Your feedback has been successfully submitted. We appreciate your input to help us improve AgriSahayak.</p>
            <button 
              onClick={onBack}
              style={{ marginTop: '20px', background: '#10B981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '25px', textAlign: 'center' }}>
              <h3 style={{ color: 'white', marginBottom: '15px' }}>How would you rate your experience?</h3>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <i 
                    key={star}
                    className={`fa-star ${star <= (hoverRating || rating) ? 'fas' : 'far'}`}
                    style={{ 
                      fontSize: '2rem', 
                      color: star <= (hoverRating || rating) ? '#F59E0B' : '#94A3B8', 
                      cursor: 'pointer',
                      transition: 'color 0.2s'
                    }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  ></i>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: 'white', marginBottom: '10px', fontWeight: 'bold' }}>Please share your thoughts or suggestions:</label>
              <textarea 
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Tell us what you love or what we could do better..."
                style={{ 
                  width: '100%', 
                  height: '150px', 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(16, 185, 129, 0.3)', 
                  borderRadius: '8px', 
                  padding: '15px', 
                  color: 'white',
                  outline: 'none',
                  resize: 'vertical'
                }}
                required
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              style={{ 
                width: '100%', 
                background: '#10B981', 
                color: 'white', 
                border: 'none', 
                padding: '12px', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                fontWeight: 'bold',
                fontSize: '1rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                transition: 'background 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#10B981'}
            >
              <i className="fas fa-paper-plane"></i> Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Feedback;
