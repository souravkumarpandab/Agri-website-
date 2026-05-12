import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

import Home from '../pages/Home';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import Dashboard from '../pages/Dashboard';
import CropRecommendation from '../pages/CropRecommendation';
import Weather from '../pages/Weather';
import MarketPrices from '../pages/MarketPrices';
import GovtSchemes from '../pages/GovtSchemes';
import Profile from '../pages/Profile';
import FertilizerCalculator from '../pages/FertilizerCalculator';
import DigitalFarming from '../pages/DigitalFarming';
import OrganicTips from '../pages/OrganicTips';
import AIAssistant from '../pages/AIAssistant';
import HelpSupport from '../pages/HelpSupport';
import CommunityHub from '../pages/CommunityHub';
import ResourceCenter from '../pages/ResourceCenter';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/crop-recommendation" element={<ProtectedRoute><CropRecommendation /></ProtectedRoute>} />
        <Route path="/weather" element={<ProtectedRoute><Weather /></ProtectedRoute>} />
        <Route path="/market-prices" element={<ProtectedRoute><MarketPrices /></ProtectedRoute>} />
        <Route path="/govt-schemes" element={<ProtectedRoute><GovtSchemes /></ProtectedRoute>} />
        <Route path="/my-profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/fertilizer" element={<ProtectedRoute><FertilizerCalculator /></ProtectedRoute>} />
        <Route path="/digital-farming" element={<ProtectedRoute><DigitalFarming /></ProtectedRoute>} />
        <Route path="/organic-tips" element={<ProtectedRoute><OrganicTips /></ProtectedRoute>} />
        <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
        <Route path="/help-support" element={<HelpSupport />} />
        <Route path="/community" element={<CommunityHub />} />
        <Route path="/resources" element={<ResourceCenter />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
