import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import AnimatedRoutes from './components/AnimatedRoutes';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import ParticlesBackground from './components/ParticlesBackground';
import './index.css';

const Layout = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="app-container">
      {!isDashboard && <ParticlesBackground />}
      {!isDashboard && <Navbar />}
      <AnimatedRoutes />
      <Chatbot />
      {!isDashboard && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Layout />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
