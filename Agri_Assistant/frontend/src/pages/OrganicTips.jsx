import React from 'react';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';
import BackButton from '../components/BackButton';
import './OrganicTips.css';

const OrganicTips = () => {
  return (
    <motion.div 
      className="organic-tips-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <BackButton />
      
      <div className="organic-header">
        <h2>🌱 Organic & Traditional Farming Guidance</h2>
        <p>Sustainable, historical, and scientifically-proven practices for healthier crops and a better environment.</p>
      </div>

      <div className="section-title">
        <h3>🏛️ Traditional (Old) Farming Techniques</h3>
        <p>Time-tested methods our ancestors used to naturally preserve soil fertility without synthetic chemicals.</p>
      </div>

      <div className="tips-container">
        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
          <motion.div className="tip-card" whileHover={{ y: -5 }}>
          <h3>Crop Rotation</h3>
          <p>Avoid planting the same crop in the same soil year after year. Rotating crops (like legumes after cereals) naturally restores nitrogen in the soil, disrupts disease cycles, and prevents pest buildup.</p>
        </motion.div>
        </Tilt>

        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
          <motion.div className="tip-card" whileHover={{ y: -5 }}>
          <h3>Mixed Cropping (Polycropping)</h3>
          <p>Planting two or more crops simultaneously in the same field. If one crop fails due to pests or weather, the other survives. It mimics natural ecosystems, confusing pests and optimizing space.</p>
        </motion.div>
        </Tilt>

        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
          <motion.div className="tip-card" whileHover={{ y: -5 }}>
          <h3>Jeevamrutha & Cow Dung Fertilizers</h3>
          <p>An ancient Indian recipe blending cow dung, cow urine, jaggery, flour, and soil. This potent mixture multiplies beneficial soil microbes exponentially, turning barren land into highly fertile soil.</p>
        </motion.div>
        </Tilt>

        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
          <motion.div className="tip-card" whileHover={{ y: -5 }}>
          <h3>Contour Plowing</h3>
          <p>Plowing across the slope of the land rather than up and down. This creates natural barriers that prevent soil erosion and help the earth absorb rainwater, a vital technique in hilly terrains.</p>
        </motion.div>
        </Tilt>
      </div>

      <div className="section-title" style={{ marginTop: '50px' }}>
        <h3>🔬 Modern Organic Farming Techniques</h3>
        <p>Certified, safe approaches integrating ecological balances with advanced natural scientific understanding.</p>
      </div>

      <div className="tips-container">
        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
          <motion.div className="tip-card modern-card" whileHover={{ y: -5 }}>
          <h3>Vermicomposting</h3>
          <p>Utilizing specific species of earthworms to quickly break down organic farm waste into vermicast. This rich, dark compost is highly nutrient-dense and remarkably improves plant root growth.</p>
        </motion.div>
        </Tilt>

        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
          <motion.div className="tip-card modern-card" whileHover={{ y: -5 }}>
          <h3>Biological Pest Control</h3>
          <p>Instead of chemical sprays, beneficial insects (like ladybugs or parasitic wasps) are introduced to eat harmful pests. Natural bio-pesticides like Neem oil or Panchagavya are also used safely.</p>
        </motion.div>
        </Tilt>

        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
          <motion.div className="tip-card modern-card" whileHover={{ y: -5 }}>
          <h3>Green Manuring & Cover Crops</h3>
          <p>Planting fast-growing plants (like clover or alfalfa) in the off-season. Before the next main crop is planted, these are plowed directly into the soil to add immense organic matter and nitrogen.</p>
        </motion.div>
        </Tilt>

        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
          <motion.div className="tip-card modern-card" whileHover={{ y: -5 }}>
          <h3>Mulching</h3>
          <p>Covering the topsoil with a layer of organic material like straw, dry leaves, or bark. It drastically reduces water evaporation, suppresses weed growth, and regulates soil temperature.</p>
        </motion.div>
        </Tilt>
        
        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
          <motion.div className="tip-card modern-card" whileHover={{ y: -5 }}>
          <h3>Trap Cropping</h3>
          <p>Planting a decoy crop specifically to attract pests away from the main cash crop. Once the pests infest the trap crop, it is naturally treated or removed, leaving the primary yield completely safe.</p>
        </motion.div>
        </Tilt>
      </div>

    </motion.div>
  );
};

export default OrganicTips;
