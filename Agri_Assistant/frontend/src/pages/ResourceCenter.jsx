import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../components/BackButton';
import './ExtraPages.css';

const ResourceCenter = () => {
  const [activeTab, setActiveTab] = useState('blog');
  const [activeModal, setActiveModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [aiSearchMode, setAiSearchMode] = useState(false);

  const handleDownload = (filename) => {
    alert(`Downloading ${filename}... (Simulated)`);
  };

  const handleAction = (actionName) => {
    alert(`${actionName} action simulated successfully!`);
  }

  // Dummy Data
  const blogs = [
    { id: 'b1', title: "Best Practices for Organic Wheat Farming", author: "Rajesh K.", date: "May 2, 2026", category: "Organic", views: 1204, likes: 342, comments: 45 },
    { id: 'b2', title: "Drone spraying vs Manual spraying: Cost Analysis", author: "AgriSahayak Team", date: "April 28, 2026", category: "Technology", views: 890, likes: 210, comments: 18 },
    { id: 'b3', title: "Understanding Soil pH and Crop Yield", author: "Dr. Sunita Sharma", date: "April 15, 2026", category: "Soil Science", views: 3400, likes: 980, comments: 112 },
  ];

  const papers = [
    { id: 'p1', title: "AI in Modern Agriculture: Predictive Yield Models", author: "John Doe, Jane Smith", year: 2025, citations: 45, topic: "AI" },
    { id: 'p2', title: "Impact of Climate Change on Northern Indian Wheat", author: "Dr. A. Kumar", year: 2024, citations: 120, topic: "Climate" },
    { id: 'p3', title: "Precision Farming: A Comprehensive Case Study", author: "AgriResearch Institute", year: 2026, citations: 12, topic: "Technology" },
  ];

  const aiSynonyms = {
    "drone": ["uav", "technology", "spraying", "aerial", "robot", "automation"],
    "weather": ["climate", "rain", "temperature", "forecast", "monsoon"],
    "soil": ["ph", "fertility", "earth", "ground", "nutrient"],
    "ai": ["artificial intelligence", "machine learning", "predictive", "technology", "smart"],
    "wheat": ["crop", "farming", "grain", "harvest", "agriculture"],
    "organic": ["natural", "compost", "chemical-free", "sustainable"]
  };

  const getSearchTerms = (query) => {
    if (!query) return [];
    const base = query.toLowerCase().split(' ').filter(Boolean);
    if (!aiSearchMode) return base;
    
    let terms = [...base];
    base.forEach(word => {
      Object.entries(aiSynonyms).forEach(([key, syns]) => {
        if (key.includes(word) || syns.some(s => s.includes(word))) {
           terms.push(key, ...syns);
        }
      });
    });
    return [...new Set(terms)];
  };

  const searchTerms = getSearchTerms(searchQuery);
  const matchesSearch = (text) => {
    if (searchTerms.length === 0) return true;
    const lowerText = text.toLowerCase();
    return searchTerms.some(term => lowerText.includes(term));
  };

  const filteredBlogs = blogs.filter(b => 
    (activeCategory === 'All' || b.category === activeCategory) && 
    matchesSearch(b.title + " " + b.category + " " + b.author)
  );

  const filteredPapers = papers.filter(p => 
    (activeCategory === 'All' || p.topic === activeCategory) && 
    matchesSearch(p.title + " " + p.author + " " + p.topic)
  );

  return (
    <motion.div 
      className="extra-page-container flex-layout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <BackButton to="/" />
      
      {/* SIDEBAR NAVIGATION */}
      <div className="resource-sidebar">
        <h2><i className="fas fa-layer-group"></i> Resources</h2>
        <ul className="sidebar-menu">
          <li className={activeTab === 'blog' ? 'active' : ''} onClick={() => {setActiveTab('blog'); setSearchQuery(''); setActiveCategory('All');}}>
            <i className="fas fa-blog"></i> Blog & Updates
          </li>
          <li className={activeTab === 'papers' ? 'active' : ''} onClick={() => {setActiveTab('papers'); setSearchQuery(''); setActiveCategory('All');}}>
            <i className="fas fa-file-pdf"></i> Research Papers
          </li>
          <li className={activeTab === 'guide' ? 'active' : ''} onClick={() => setActiveTab('guide')}>
            <i className="fas fa-book-open"></i> User Guide
          </li>
          <li className={activeTab === 'app' ? 'active' : ''} onClick={() => setActiveTab('app')}>
            <i className="fas fa-mobile-alt"></i> App Download
          </li>
        </ul>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="resource-main-content">
        
        {/* BLOG SECTION */}
        {activeTab === 'blog' && (
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="content-section">
            <div className="section-header-row">
              <h1>Knowledge Blog</h1>
              <div className="search-bar" style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingRight: '5px' }}>
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Search articles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', outline: 'none' }} />
                <button 
                  onClick={() => setAiSearchMode(!aiSearchMode)} 
                  style={{ background: aiSearchMode ? 'linear-gradient(45deg, #10B981, #3B82F6)' : 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '20px', color: 'white', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px', transition: '0.3s', whiteSpace: 'nowrap' }}
                  title="Enable AI Semantic Searching"
                >
                  <i className="fas fa-sparkles"></i> {aiSearchMode ? "AI Active" : "AI Filter"}
                </button>
              </div>
            </div>
            <div className="category-pills">
              {['All', 'Organic', 'Technology', 'Soil Science'].map(cat => (
                <button key={cat} className={activeCategory === cat ? 'active' : ''} onClick={() => setActiveCategory(cat)}>{cat}</button>
              ))}
            </div>
            
            <div className="advanced-grid">
              {filteredBlogs.map(blog => (
                <div key={blog.id} className="advanced-card">
                  <div className="card-tag">{blog.category}</div>
                  <h3>{blog.title}</h3>
                  <div className="card-author-row">
                    <span><i className="fas fa-user-circle"></i> {blog.author}</span>
                    <span><i className="fas fa-calendar-alt"></i> {blog.date}</span>
                  </div>
                  <div className="card-stats">
                    <span title="Views"><i className="fas fa-eye"></i> {blog.views}</span>
                    <span title="Likes"><i className="fas fa-heart"></i> {blog.likes}</span>
                    <span title="Comments"><i className="fas fa-comment"></i> {blog.comments}</span>
                  </div>
                  <div className="card-actions">
                    <button className="primary-btn" onClick={() => setActiveModal('blogText')}>Read Full</button>
                    <button className="icon-btn" onClick={() => handleAction('Share to Social Media')} title="Share"><i className="fas fa-share-alt"></i></button>
                  </div>
                </div>
              ))}
              {filteredBlogs.length === 0 && <p style={{color: 'var(--text-secondary)'}}>No articles found.</p>}
            </div>
          </motion.div>
        )}

        {/* RESEARCH PAPERS SECTION */}
        {activeTab === 'papers' && (
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="content-section">
            <div className="section-header-row">
              <h1>Academic Research</h1>
              <div className="search-bar" style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingRight: '5px' }}>
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Search papers, authors..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', outline: 'none' }} />
                <button 
                  onClick={() => setAiSearchMode(!aiSearchMode)} 
                  style={{ background: aiSearchMode ? 'linear-gradient(45deg, #10B981, #3B82F6)' : 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '20px', color: 'white', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px', transition: '0.3s', whiteSpace: 'nowrap' }}
                  title="Enable AI Semantic Searching"
                >
                  <i className="fas fa-sparkles"></i> {aiSearchMode ? "AI Active" : "AI Filter"}
                </button>
              </div>
            </div>
            <div className="category-pills">
              {['All', 'AI', 'Climate', 'Technology'].map(cat => (
                <button key={cat} className={activeCategory === cat ? 'active' : ''} onClick={() => setActiveCategory(cat)}>{cat}</button>
              ))}
            </div>

            <div className="paper-list">
              {filteredPapers.map(paper => (
                <div key={paper.id} className="paper-list-item">
                  <div className="paper-info">
                    <h3>{paper.title}</h3>
                    <p className="paper-authors">{paper.author} ({paper.year})</p>
                    <div className="paper-meta">
                      <span className="tag">{paper.topic}</span>
                      <span><i className="fas fa-quote-right"></i> {paper.citations} Citations</span>
                    </div>
                  </div>
                  <div className="paper-actions">
                    <button className="icon-btn bookmark-btn" onClick={() => handleAction('Bookmark Paper')} title="Save for later"><i className="far fa-bookmark"></i></button>
                    <button className="icon-btn" onClick={() => setActiveModal('previewPdf')} title="Preview"><i className="fas fa-eye"></i></button>
                    <button className="primary-btn" onClick={() => handleDownload(`${paper.title}.pdf`)}><i className="fas fa-download"></i> Download</button>
                  </div>
                </div>
              ))}
              {filteredPapers.length === 0 && <p style={{color: 'var(--text-secondary)'}}>No papers found.</p>}
            </div>
          </motion.div>
        )}

        {/* USER GUIDE SECTION */}
        {activeTab === 'guide' && (
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="content-section">
            <div className="section-header-row">
              <h1>System User Guide</h1>
              <button className="outline-btn"><i className="fas fa-language"></i> Translate</button>
            </div>
            
            <div className="guide-layout">
              <div className="guide-content-area">
                <h2>1. Getting Started with AgriSahayak</h2>
                <p>Welcome! This guide will walk you through the core features of the platform.</p>
                
                <div className="video-placeholder">
                  <i className="fab fa-youtube"></i>
                  <span>Play Video Tutorial (05:30)</span>
                </div>

                <h3>Step 1: Dashboard Overview</h3>
                <p>The dashboard is your central hub. Here you can view live Mandy prices, local weather updates, and access all AI tools.</p>
                <div className="screenshot-placeholder">
                  <i className="fas fa-image"></i> Screenshot: Dashboard View
                </div>

                <h3>Step 2: Crop Recommendation</h3>
                <p>Navigate to the Crop Recommendation tab. Enter your soil's Nitrogen (N), Phosphorus (P), Potassium (K), and pH levels. The AI will instantly process this data and suggest the best crops for your field.</p>
                
                <hr style={{ borderColor: 'rgba(16, 185, 129, 0.2)', margin: '30px 0' }}/>
                
                <div className="faq-box">
                  <h4><i className="fas fa-question-circle"></i> FAQ: Can I use this on mobile?</h4>
                  <p>Yes! The website is fully responsive, and a dedicated mobile app is launching soon.</p>
                </div>
              </div>
              
              <div className="guide-toc">
                <h4>Table of Contents</h4>
                <ul>
                  <li className="active">1. Getting Started</li>
                  <li>2. Dashboard Overview</li>
                  <li>3. Crop Recommendation</li>
                  <li>4. Disease Detection</li>
                  <li>5. Account Settings</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* APP DOWNLOAD SECTION */}
        {activeTab === 'app' && (
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="content-section">
            <div className="section-header-row">
              <h1>Mobile Application</h1>
            </div>
            <div className="app-download-hero">
              <div className="app-text">
                <h2>Farming Intelligence in Your Pocket</h2>
                <p>Take AgriSahayak anywhere you go. Access real-time alerts, snap photos for offline disease detection, and connect with the community directly from your mobile device.</p>
                <ul className="app-features-list">
                  <li><i className="fas fa-check-circle"></i> Offline Mode</li>
                  <li><i className="fas fa-check-circle"></i> Push Notifications</li>
                  <li><i className="fas fa-check-circle"></i> GPS Location tracking</li>
                </ul>
                <div className="app-buttons" style={{marginTop: '30px'}}>
                  <button className="app-store-btn" onClick={() => handleAction('App Store Request')}><i className="fab fa-apple"></i> App Store</button>
                  <button className="play-store-btn" onClick={() => handleAction('Play Store Request')}><i className="fab fa-google-play"></i> Google Play</button>
                </div>
              </div>
              <div className="app-qr">
                <div className="qr-box">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://agrisahayak.com/app" alt="QR Code" />
                  <span>Scan to Download</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {activeModal === 'blogText' && (
          <div className="modal-overlay">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="modal-content large-modal">
              <button className="close-modal" onClick={() => setActiveModal(null)}>&times;</button>
              <h2 style={{color: 'var(--accent-green)', marginBottom: '20px'}}>Sample Article Content</h2>
              <p style={{lineHeight: '1.8', color: 'var(--text-primary)'}}>Organic farming begins with excellent soil preparation. By utilizing natural composts and practicing crop rotation, farmers can maintain soil fertility without the need for harsh chemicals. In this guide, we dive deep into the specific nitrogen requirements for wheat and how organic matter can fulfill them over a three-year cycle...</p>
              
              <div className="modal-footer-actions">
                <button className="outline-btn" onClick={() => handleAction('Like')}><i className="far fa-heart"></i> Like</button>
                <button className="outline-btn" onClick={() => handleAction('Comment')}><i className="far fa-comment"></i> Comment</button>
                <button className="primary-btn" onClick={() => handleAction('Share')}><i className="fas fa-share"></i> Share</button>
              </div>
            </motion.div>
          </div>
        )}

        {activeModal === 'previewPdf' && (
          <div className="modal-overlay">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="modal-content large-modal">
              <button className="close-modal" onClick={() => setActiveModal(null)}>&times;</button>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{color: 'var(--accent-green)', margin: 0}}>Document Preview</h2>
                <button className="primary-btn" onClick={() => handleDownload('Paper_Preview.pdf')}><i className="fas fa-download"></i></button>
              </div>
              <div className="pdf-viewer-placeholder">
                <i className="fas fa-file-pdf" style={{fontSize: '4rem', color: '#EF4444', marginBottom: '15px'}}></i>
                <p>PDF Viewer Component (Simulated)</p>
                <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>In production, a react-pdf viewer would mount here.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ResourceCenter;
