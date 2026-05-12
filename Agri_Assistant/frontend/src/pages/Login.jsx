import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', type: 'success' });
  const [regFullName, setRegFullName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');
  const [loginMobile, setLoginMobile] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Password visibility states
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegConfirmPass, setShowRegConfirmPass] = useState(false);
  const [showLoginPass, setShowLoginPass] = useState(false);

  const showAlert = (message, type = 'success') => {
    setAlertInfo({ show: true, message, type });
    setTimeout(() => {
      setAlertInfo({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginMobile || !loginPass) return showAlert("Please enter your mobile number and password.", 'error');
    
    try {
      const response = await axios.post('${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:5000"}`}/api/auth/login', {
        mobile: loginMobile,
        password: loginPass
      });
      
      const { _id, name, mobile, token } = response.data;
      const loggedUser = { _id, name, mobile };
      login(loggedUser, token);
      showAlert("Login successful!", 'success');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
       showAlert(error.response?.data?.message || "Invalid Mobile Number or Password", 'error');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (regPass !== regConfirmPass) {
      showAlert("Passwords do not match!", 'error');
      return;
    }

    try {
      const response = await axios.post('${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:5000"}`}/api/auth/register', {
        name: regFullName,
        mobile: regMobile,
        email: regEmail,
        password: regPass
      });
      
      const { _id, name, mobile, token } = response.data;
      const loggedUser = { _id, name, mobile };
      login(loggedUser, token);
      
      showAlert("Registration successful! Redirecting to Dashboard...", 'success');
      
      setRegFullName('');
      setRegMobile('');
      setRegEmail('');
      setRegPass('');
      setRegConfirmPass('');

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      if (!error.response) {
        showAlert("Network Error: Could not connect to backend. Is the server running?", 'error');
      } else {
        showAlert(error.response.data?.message || "Registration failed. Try again.", 'error');
      }
    }
  };

  return (
    <div className="login-page">
      {alertInfo.show && (
        <div className={`custom-alert ${alertInfo.type}`}>
          {alertInfo.message}
        </div>
      )}

      <div className="brand-logo">
        <i className="fas fa-seedling"></i> AgriSahayak
      </div>

      <Link to="/" className="back-home" title="Back to Home"><i className="fas fa-arrow-left"></i></Link>

      <div className="container single-panel-container">
        {isLoginMode ? (
          <div className="form-container">
            <form onSubmit={handleLogin}>
              <h1>Welcome Back</h1>
              <p style={{ color: '#aaa', margin: '5px 0 20px', fontSize: '0.9rem' }}>Log in below with your credentials.</p>

              <div className="input-group">
                <input type="tel" placeholder="Mobile Number" required value={loginMobile} onChange={(e) => setLoginMobile(e.target.value)} />
                <i className="fas fa-phone icon-left"></i>
              </div>

              <div className="input-group">
                <input type={showLoginPass ? "text" : "password"} placeholder="Password" required value={loginPass} onChange={(e) => setLoginPass(e.target.value)} />
                <i className={`fas ${showLoginPass ? 'fa-eye-slash' : 'fa-eye'} toggle-password`} onClick={() => setShowLoginPass(!showLoginPass)}></i>
              </div>

              <div style={{ textAlign: 'right', width: '100%', marginBottom: '15px' }}>
                 <Link to="/forgot-password" style={{ color: 'var(--primary-color)', fontSize: '0.85rem', textDecoration: 'none' }}>Forgot Password?</Link>
              </div>
              
              <button className="btn-glow" type="submit">Sign In</button>
              
              <p className="switch-text" style={{marginTop: '20px'}}>Don't have an account? <span onClick={() => setIsLoginMode(false)}>Sign Up</span></p>
            </form>
          </div>
        ) : (
          <div className="form-container">
            <form onSubmit={handleRegister}>
              <h1>Create Account</h1>

              <div className="input-group">
                <input type="text" placeholder="Full Name" required value={regFullName} onChange={(e) => setRegFullName(e.target.value)} />
                <i className="fas fa-id-card icon-left"></i>
              </div>

              <div className="input-group">
                <input type="tel" placeholder="Mobile Number" required value={regMobile} onChange={(e) => setRegMobile(e.target.value)} />
                <i className="fas fa-phone icon-left"></i>
              </div>

              <div className="input-group">
                <input type="email" placeholder="Email Address" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
                <i className="fas fa-envelope icon-left"></i>
              </div>

              <div className="input-group">
                <input type={showRegPass ? "text" : "password"} placeholder="Password" required value={regPass} onChange={(e) => setRegPass(e.target.value)} />
                <i className={`fas ${showRegPass ? 'fa-eye-slash' : 'fa-eye'} toggle-password`} onClick={() => setShowRegPass(!showRegPass)}></i>
              </div>

              <div className="input-group">
                <input type={showRegConfirmPass ? "text" : "password"} placeholder="Confirm Password" required value={regConfirmPass} onChange={(e) => setRegConfirmPass(e.target.value)} />
                <i className={`fas ${showRegConfirmPass ? 'fa-eye-slash' : 'fa-eye'} toggle-password`} onClick={() => setShowRegConfirmPass(!showRegConfirmPass)}></i>
              </div>

              <button className="btn-glow" type="submit">Register</button>
              <p className="switch-text">Already have an account? <span onClick={() => setIsLoginMode(true)}>Sign In</span></p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
