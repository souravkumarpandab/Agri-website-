import React from 'react';
import './DroneStore.css';

const DroneStore = () => {
  const drones = [
    {
      id: 1,
      name: 'DJI Mavic 3M',
      category: 'Multispectral Scanning',
      price: '₹2,45,000',
      rating: 4.8,
      reviews: 124,
      image: 'https://images.unsplash.com/photo-1586771107445-d3af105ea4b5?q=80&w=800&auto=format&fit=crop',
      features: ['RGB Camera', 'Multispectral Camera', 'RTK Centimeter-Level Positioning', 'Omnidirectional Obstacle Sensing'],
      desc: 'Perfect for precision agriculture, crop health monitoring, and advanced aerial surveying.',
      status: 'In Stock'
    },
    {
      id: 2,
      name: 'DJI Agras T40',
      category: 'Heavy Payload Sprayer',
      price: '₹8,50,000',
      rating: 4.9,
      reviews: 89,
      image: 'https://media.istockphoto.com/id/1149026410/photo/smart-agriculture-concept-agronomist-using-drone-for-monitoring.jpg?s=612x612&w=0&k=20&c=L_Y6-tP5u7QhX20Yw_hD66rIrtC-38AihK8g56h8qLg=',
      features: ['40L Spraying Payload', '50kg Spreading Payload', 'Coaxial Twin Rotor', 'Active Phased Array Radar'],
      desc: 'The ultimate flagship agricultural drone built for massive scale spraying and spreading operations.',
      status: 'In Stock'
    },
    {
      id: 3,
      name: 'XAG P100 Pro',
      category: 'Autonomous Farm Drone',
      price: '₹7,20,000',
      rating: 4.7,
      reviews: 56,
      image: 'https://media.istockphoto.com/id/1283681729/photo/drone-aerial-view-of-green-agricultural-field.jpg?s=612x612&w=0&k=20&c=iL77vW5-wTfV5j-iL6W3d8V8zL-zN9T75Z58_sM8S8M=',
      features: ['50L Max Payload', 'Rotary Atomization', 'AI Prescription Map', 'Swarm Control'],
      desc: 'Fully autonomous flight with AI-driven operations for high-efficiency farm management.',
      status: 'Few Left'
    },
    {
      id: 4,
      name: 'Parrot Bluegrass',
      category: 'Crop Analysis',
      price: '₹3,10,000',
      rating: 4.5,
      reviews: 42,
      image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=800&auto=format&fit=crop',
      features: ['Parrot Sequoia Sensor', 'Front Full HD Camera', 'Automatic Flight Plan', 'Pix4Dfields Software Included'],
      desc: 'Multipurpose quadcopter designed specifically for agricultural crop mapping and analysis.',
      status: 'Out of Stock'
    },
    {
      id: 5,
      name: 'Autel Robotics EVO II Dual 640T',
      category: 'Thermal & NDVI Analysis',
      price: '₹4,85,000',
      rating: 4.6,
      reviews: 67,
      image: 'https://images.unsplash.com/photo-1579820010410-c10411aaaa88?q=80&w=800&auto=format&fit=crop',
      features: ['High-Res Thermal Imaging', 'Visual Camera Array', '38 Minutes Flight Time', 'Advanced Obstacle Avoidance'],
      desc: 'Ideal for water stress analysis and detecting irrigation issues using integrated thermal mapping overlays.',
      status: 'In Stock'
    },
    {
      id: 6,
      name: 'Yuneec H520E RTK',
      category: 'Commercial Surveying',
      price: '₹3,50,000',
      rating: 4.4,
      reviews: 45,
      image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=800&auto=format&fit=crop',
      features: ['Hexacopter Design', 'Real-Time Kinematic', 'Interchangeable Payload', 'Wind Resistant'],
      desc: 'Highly stable platform providing centimeter-grade precision for creating robust 3D topographic farm maps.',
      status: 'In Stock'
    },
    {
      id: 7,
      name: 'DJI Phantom 4 RTK',
      category: 'Entry-Level Mapping',
      price: '₹2,20,000',
      rating: 4.8,
      reviews: 210,
      image: 'https://images.unsplash.com/photo-1507580461462-2ca8b1dd368a?q=80&w=800&auto=format&fit=crop',
      features: ['1-inch CMOS Sensor', 'TimeSync Integration', 'D-RTK 2 Station', 'OcuSync Transmission'],
      desc: 'A reliable workhorse for routine crop scouting, aerial photogrammetry, and field boundary mapping.',
      status: 'Few Left'
    },
    {
      id: 8,
      name: 'AgEagle eBee Ag',
      category: 'Fixed-Wing Mapping',
      price: '₹6,15,000',
      rating: 4.9,
      reviews: 34,
      image: 'https://images.unsplash.com/photo-1524143980838-898495dd1d3a?q=80&w=800&auto=format&fit=crop',
      features: ['55 Minutes Flight Time', 'Covers 160 Hectares', 'Duet M Sensor', 'Fixed-Wing Efficiency'],
      desc: 'Premium fixed-wing agricultural drone built to survey massive continuous acreages in a single flight.',
      status: 'In Stock'
    }
  ];

  return (
    <div className="drone-store-container">
      <div className="store-header">
        <h2><i className="fas fa-shopping-bag"></i> AgriSahayak Drone Marketplace</h2>
        <p>Procure industrial-grade agricultural drones specialized for crop analysis and spraying.</p>
      </div>

      <div className="drone-grid">
        {drones.map(drone => (
          <div className="drone-card" key={drone.id}>
            <div className="drone-image-wrapper">
              <img src={drone.image} alt={drone.name} className="drone-image" />
              <span className={`status-badge ${drone.status === 'In Stock' ? 'stock-in' : drone.status === 'Few Left' ? 'stock-few' : 'stock-out'}`}>
                {drone.status}
              </span>
            </div>
            
            <div className="drone-details">
              <div className="drone-category">{drone.category}</div>
              <h3 className="drone-title">{drone.name}</h3>
              
              <div className="drone-rating">
                <i className="fas fa-star"></i> {drone.rating} <span>({drone.reviews} reviews)</span>
              </div>
              
              <p className="drone-desc">{drone.desc}</p>
              
              <ul className="drone-features">
                {drone.features.map((feat, idx) => (
                  <li key={idx}><i className="fas fa-check-circle"></i> {feat}</li>
                ))}
              </ul>
              
              <div className="drone-footer">
                <div className="drone-price">{drone.price}</div>
                <button 
                  className={`buy-btn ${drone.status === 'Out of Stock' ? 'disabled' : ''}`}
                  disabled={drone.status === 'Out of Stock'}
                  onClick={() => alert(`Added ${drone.name} to your Cart!`)}
                >
                  <i className="fas fa-shopping-cart"></i> {drone.status === 'Out of Stock' ? 'Sold Out' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DroneStore;
