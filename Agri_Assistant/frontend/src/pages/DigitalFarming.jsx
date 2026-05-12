import React from 'react';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';
import BackButton from '../components/BackButton';
import './DigitalFarming.css';

const DigitalFarming = () => {
  return (
    <motion.div
      className="digital-farming-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <BackButton />

      <div className="digital-farm-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img
          src="/image/digital_farming_logo.jpeg"
          alt="Digital Agriculture Logo"
          style={{ width: '150px', height: '150px', objectFit: 'contain', borderRadius: '20px', marginBottom: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
        />
        <h2><i className="fas fa-drone" style={{ marginRight: '10px' }}></i> Digital Farming & Advanced Machinery</h2>
        <p>Explore the future of agriculture with high-tech Drones and RBD Machine Tools.</p>
      </div>

      {/* Drones Section */}
      <div className="section-title">
        <h3>🚁 Agricultural Drones & Applications</h3>
        <p>Modern farming uses UAVs (Unmanned Aerial Vehicles) to drastically improve crop yield and save time.</p>
      </div>
      <div className="digital-content">
        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
          <motion.div className="tech-card" whileHover={{ scale: 1.05 }}>
            <i className="fas fa-helicopter tech-icon"></i>
            <h3>Crop Spraying Drones</h3>
            <p>Equipped with large tanks, these drones autonomously spray fertilizers and pesticides evenly across the field. They save up to 30% of chemicals and prevent human exposure to toxins.</p>
          </motion.div>
        </Tilt>

        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
          <motion.div className="tech-card" whileHover={{ scale: 1.05 }}>
            <i className="fas fa-camera tech-icon"></i>
            <h3>Multispectral Imaging Drones</h3>
            <p>Using advanced cameras (NDVI), these drones capture light beyond human vision to detect crop stress, diseases, and nutrient deficiencies long before they ruin the yield.</p>
          </motion.div>
        </Tilt>

        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
          <motion.div className="tech-card" whileHover={{ scale: 1.05 }}>
            <i className="fas fa-seedling tech-icon"></i>
            <h3>Seeding & Planting Drones</h3>
            <p>Capable of shooting seed pods directly into the soil. They are highly efficient for large-scale reforestation and aerial seeding in difficult terrains.</p>
          </motion.div>
        </Tilt>
      </div>

      {/* RBD Company Information Section */}
      <div className="section-title" style={{ marginTop: '50px' }}>
        <h3>🏭 RBD Machine Tools Pvt. Ltd.</h3>
        <p>Your Trusted Partner in Agricultural Mechanization</p>
      </div>
      <div className="company-info-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
          <img
            src="https://ui-avatars.com/api/?name=RBD&background=2a5298&color=fff&size=80&rounded=true&font-size=0.4"
            alt="RBD Logo"
            style={{ border: '3px solid #e8f5e9', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
          />
          <h4 style={{ color: '#2a5298', fontSize: '1.5rem', margin: 0 }}>RBD Machine Tools</h4>
        </div>
        <div className="company-info-text">
          <p>
            <strong>RBD Machine Tools Private Limited</strong> is a premier Indian manufacturer, supplier, and distributor of a wide range of agricultural machinery and equipment. Based in Rajasthan and Gujarat, the company aims to empower farmers by providing cost-effective, highly efficient, and durable mechanized solutions.
          </p>
          <p>
            Their tools are specifically designed to suit Indian farming conditions, helping farmers reduce manual labor costs, save time, and ultimately increase overall agricultural output. They pride themselves on robust after-sales support and 24/7 technical assistance.
          </p>
        </div>
      </div>

      {/* RBD Tools Section */}
      <div className="section-title" style={{ marginTop: '50px' }}>
        <h3>🚜 RBD Machines & Agricultural Tools</h3>
        <p>Explore the extensive product catalog provided by RBD Machine Tools.</p>
      </div>
      <div className="digital-content tools-grid">
        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
          <motion.div className="tech-card tool-card" whileHover={{ scale: 1.02 }}>
            <i className="fas fa-tractor tech-icon"></i>
            <h3>Power Tillers & Weeders</h3>
            <p>Compact and fuel-efficient machines perfect for land preparation, tilling, and weeding in both dry and wet fields.</p>
          </motion.div>
        </Tilt>

        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
          <motion.div className="tech-card tool-card" whileHover={{ scale: 1.02 }}>
            <i className="fas fa-leaf tech-icon"></i>
            <h3>Brush Cutters</h3>
            <p>Heavy-duty, shoulder-mounted cutters used to clear weeds, small bushes, and harvest crops like wheat and paddy efficiently.</p>
          </motion.div>
        </Tilt>

        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
          <motion.div className="tech-card tool-card" whileHover={{ scale: 1.02 }}>
            <i className="fas fa-cog tech-icon"></i>
            <h3>Rotavators</h3>
            <p>Tractor-mounted implements used to prepare the seedbed quickly by churning and aerating the soil.</p>
          </motion.div>
        </Tilt>

        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
          <motion.div className="tech-card tool-card" whileHover={{ scale: 1.02 }}>
            <i className="fas fa-water tech-icon"></i>
            <h3>Water Pumps</h3>
            <p>Reliable and high-capacity petrol/diesel water pumps designed for continuous irrigation across large farm plots.</p>
          </motion.div>
        </Tilt>

        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
          <motion.div className="tech-card tool-card" whileHover={{ scale: 1.02 }}>
            <i className="fas fa-spray-can tech-icon"></i>
            <h3>Crop Sprayers</h3>
            <p>Manual, battery-operated, and engine-driven knapsack sprayers for precise application of pesticides and liquid fertilizers.</p>
          </motion.div>
        </Tilt>

        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
          <motion.div className="tech-card tool-card" whileHover={{ scale: 1.02 }}>
            <i className="fas fa-hammer tech-icon"></i>
            <h3>Earth Augers</h3>
            <p>Automated drilling tools designed to dig holes in the ground for planting trees, erecting fences, quickly and without manual labor.</p>
          </motion.div>
        </Tilt>

        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
          <motion.div className="tech-card tool-card" whileHover={{ scale: 1.02 }}>
            <i className="fas fa-tree tech-icon"></i>
            <h3>Chaff & Wood Cutters</h3>
            <p>Processing machines used to chop fodder and prepare high-quality feed for cattle, ensuring no wastage.</p>
          </motion.div>
        </Tilt>
      </div>

    </motion.div>
  );
};

export default DigitalFarming;
