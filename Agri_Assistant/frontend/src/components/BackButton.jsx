import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './BackButton.css';

const BackButton = ({ to = '/dashboard', onClick }) => {
  const navigate = useNavigate();

  return (
    <motion.button 
      className="floating-back-btn" 
      onClick={() => {
          if (onClick) onClick();
          else navigate(to);
      }}
      whileHover={{ scale: 1.05, x: -5 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <i className="fas fa-arrow-left"></i>
    </motion.button>
  );
};

export default BackButton;
