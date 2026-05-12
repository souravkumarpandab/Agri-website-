import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', type: 'success' });

  const showAlert = (message, type = 'success') => {
    setAlertInfo({ show: true, message, type });
    setTimeout(() => setAlertInfo({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/forgot-password`, { email });
      showAlert(response.data.message || "OTP sent successfully!", 'success');
      setOtpSent(true);
    } catch (error) {
      if (!error.response) return showAlert("Network Error.", 'error');
      showAlert(error.response?.data?.message || "Failed to send reset link. Try again.", 'error');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/reset-password`, {
        email, otp, newPassword
      });
      showAlert(response.data.message || "Password Reset Successful!", 'success');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      if (!error.response) return showAlert("Network Error.", 'error');
      showAlert(error.response?.data?.message || "Failed to reset password. Invalid OTP.", 'error');
    }
  };

  return (
    <div className="login-page">
      {alertInfo.show && <div className={`custom-alert ${alertInfo.type}`}>{alertInfo.message}</div>}

      <div className="brand-logo">
        <i className="fas fa-seedling"></i> AgriSahayak
      </div>

      <Link to="/login" className="back-home" title="Back to Login"><i className="fas fa-arrow-left"></i></Link>

      <div className="container single-panel-container">
        <div className="form-container">
          {!otpSent ? (
            <form onSubmit={handleRequestOTP}>
              <h1>Reset Password</h1>
              <p style={{ color: '#555', marginBottom: '20px' }}>Enter your registered email address to receive a recovery OTP.</p>

              <div className="input-group">
                <input type="email" placeholder="Recovery Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                <i className="fas fa-envelope icon-left"></i>
              </div>

              <button className="btn-glow" type="submit">Send OTP</button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <h1>Enter OTP</h1>
              <p style={{ color: '#555', marginBottom: '20px' }}>Reset your account password.</p>

              <div className="input-group">
                <input type="text" placeholder="Enter 6-digit OTP" maxLength={6} required value={otp} onChange={(e) => setOtp(e.target.value)} />
                <i className="fas fa-key icon-left"></i>
              </div>

              <div className="input-group">
                <input type="password" placeholder="New Password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <i className="fas fa-lock icon-left"></i>
              </div>

              <button className="btn-glow" type="submit">Update Password</button>
              <p className="switch-text" style={{marginTop: '10px'}}><span onClick={() => { setOtpSent(false); setOtp(''); }}>Resend OTP</span></p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
