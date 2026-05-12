import React from 'react';
import { motion } from 'framer-motion';
import BackButton from '../components/BackButton';
import './ExtraPages.css';

const CommunityHub = () => {
  const posts = [
    { title: "Best Practices for Organic Wheat Farming", author: "Rajesh K.", date: "May 2, 2026", type: "Blog", comments: 12 },
    { title: "Has anyone tried the new bio-fertilizer from the Govt Scheme?", author: "Sunil Verma", date: "May 4, 2026", type: "Discussion", comments: 45 },
    { title: "Drone spraying vs Manual spraying: Cost Analysis", author: "AgriSahayak Team", date: "April 28, 2026", type: "Blog", comments: 34 },
  ];

  return (
    <motion.div 
      className="extra-page-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <BackButton to="/" />
      
      <div className="extra-header">
        <h1>Community & Blog</h1>
        <p>Connect with fellow farmers, read expert blogs, and share your experiences.</p>
      </div>

      <div className="extra-content">
        <div className="community-grid">
          {posts.map((post, idx) => (
            <div key={idx} className="community-card">
              <div className="card-badge">{post.type}</div>
              <h3>{post.title}</h3>
              <div className="card-meta">
                <span><i className="fas fa-user"></i> {post.author}</span>
                <span><i className="fas fa-calendar"></i> {post.date}</span>
                <span><i className="fas fa-comments"></i> {post.comments} Comments</span>
              </div>
              <button className="read-more-btn">Read More</button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CommunityHub;
