import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../components/BackButton';
import './GovtSchemes.css';

const centralSchemes = [
  {
    id: 'pm-kisan',
    title: 'PM-KISAN (Kisan Samman Nidhi)',
    icon: 'fas fa-rupee-sign',
    desc: 'Income support of ₹6,000 per year (paid in 3 equal installments) to eligible landholding farmer families.',
    details: 'The Pradhan Mantri Kisan Samman Nidhi guarantees direct income support to supplement the financial needs of farmers in procuring various inputs to ensure proper crop health and appropriate yields, commensurate with the anticipated farm income at the end of each crop cycle.',
    process: [
      "Contact your local Patwari / Revenue Officer / Nodal Officer (PM-Kisan).",
      "Submit Aadhaar Card, landholding papers, and active bank account details.",
      "Alternatively, register online through the 'Farmers Corner' on pmkisan.gov.in.",
      "Approval is done at the State Government level before installment release."
    ],
    links: [
      { text: 'Access Official Portal', url: 'https://pmkisan.gov.in', type: 'primary' }
    ]
  },
  {
    id: 'pmfby',
    title: 'PMFBY (Fasal Bima Yojana)',
    icon: 'fas fa-umbrella',
    desc: 'Crop insurance scheme protecting farmers against crop loss due to calamities, pests, or diseases.',
    details: 'Pradhan Mantri Fasal Bima Yojana integrates multiple stakeholders on a single IT platform to ensure better administration, coordination, and transparency for disseminating crop insurance to farmers at highly subsidized premium rates.',
    process: [
      "Open an account in any nationalized bank or rural co-operative bank.",
      "Provide Aadhar card, land documents (Khasra/Khatauni), and sowing certificate or self-declaration.",
      "Submit the application within the cutoff date announced for Kharif/Rabi seasons.",
      "Damage must be reported within 72 hours via the Crop Insurance App or toll-free number."
    ],
    links: [
      { text: 'Access Official Portal', url: 'https://pmfby.gov.in', type: 'primary' }
    ]
  },
  {
    id: 'shc',
    title: 'Soil Health Card Scheme',
    icon: 'fas fa-seedling',
    desc: 'Soil testing and nutrient status reports with fertilizer recommendations.',
    details: 'Provides farmers with a Soil Health Card that contains the status of their soil with respect to 12 parameters, along with recommendations for appropriate dosage of nutrients and fertilizers required to improve soil health and fertility.',
    process: [
      "Soil samples are collected by trained personnel from your village or block.",
      "Testing is conducted at designated mobile or static soil testing laboratories.",
      "The result and specific fertilizer recommendations are printed on a physical card.",
      "You can also download your digital card from the official portal."
    ],
    links: [
      { text: 'Access Official Portal', url: 'https://soilhealth.dac.gov.in', type: 'primary' }
    ]
  },
  {
    id: 'kcc',
    title: 'Kisan Credit Card (KCC)',
    icon: 'fas fa-credit-card',
    desc: 'Short-term credit to farmers for cultivation at concessional interest rates.',
    details: 'Aims to provide adequate and timely credit support from the banking system via a single window with flexible and simplified procedures to the farmers for their cultivation and other needs.',
    process: [
      "Download the KCC application form from PM-KISAN or related banking portals.",
      "Submit the filled form with ID proof, address proof, and land holding details to your nearest bank branch.",
      "The bank inspects the documents and approves a credit limit based on crop area and scale of finance.",
      "A passbook/credit card is issued to the farmer."
    ],
    links: [
      { text: 'Schemes Portal', url: 'https://www.myscheme.gov.in/schemes/kcc', type: 'primary' }
    ]
  },
  {
    id: 'enam',
    title: 'e-NAM (Agriculture Market)',
    icon: 'fas fa-shopping-cart',
    desc: 'Online trading platform helping farmers get transparent prices in regulated mandis.',
    details: 'National Agriculture Market (eNAM) is a pan-India electronic trading portal which networks the existing APMC mandis to create a unified national market for agricultural commodities.',
    process: [
      "Register on the e-NAM portal or mobile app with your basic details.",
      "Bring your produce to the nearest e-NAM enabled APMC mandi.",
      "Produce is assayed (quality tested) and lot details are uploaded.",
      "Traders bid online across India. Highest bid is offered to the farmer for approval.",
      "Payment is credited directly to your registered bank account."
    ],
    links: [
      { text: 'Access Official Portal', url: 'https://www.enam.gov.in', type: 'primary' }
    ]
  },
  {
    id: 'pmksy',
    title: 'PMKSY (Krishi Sinchai Yojana)',
    icon: 'fas fa-water',
    desc: 'Focus on expansion of irrigation, water use efficiency ("more crop per drop").',
    details: 'Formulated with the vision of extending the coverage of irrigation and improving water use efficiency in a focused manner with end to end solution on source creation, distribution, management, field application and extension activities.',
    process: [
      "Submit an application to the district agriculture or horticulture officer.",
      "Provide Aadhaar, land records, and details of existing irrigation source.",
      "A field verification is conducted by the department.",
      "Subsidy is released directly to the approved vendor after installation of micro-irrigation systems."
    ],
    links: [
      { text: 'Access Official Portal', url: 'https://pmksy.gov.in', type: 'primary' }
    ]
  },
  {
    id: 'pkvy',
    title: 'PKVY (Organic Farming)',
    icon: 'fas fa-leaf',
    desc: 'Promotes organic farming through cluster approach and Participatory Guarantee System.',
    details: 'Encourages farmers to adopt eco-friendly concept of cultivation and reduce their dependence on fertilizers and agricultural chemicals to improve yields while maintaining soil health.',
    process: [
      "Form a cluster of 50 or more farmers having 50 acres of land.",
      "Register the cluster with the State Agriculture Department connecting to PKVY.",
      "Undergo training and transition to organic farming practices.",
      "Receive financial assistance for organic inputs, certification, and marketing directly to the cluster account."
    ],
    links: [
      { text: 'Access Official Portal', url: 'https://pgsindia-ncof.gov.in/pkvy/index.aspx', type: 'primary' }
    ]
  },
  {
    id: 'aif',
    title: 'Agri Infrastructure Fund',
    icon: 'fas fa-industry',
    desc: 'Credit support for investment in post-harvest management and value addition.',
    details: 'Financing facility for investment in viable projects for post-harvest management Infrastructure and community farming assets through interest subvention and financial support.',
    process: [
      "Register on the official AIF portal as a farmer, FPO, or agri-entrepreneur.",
      "Submit a Detailed Project Report (DPR) for your post-harvest facility (e.g. cold storage).",
      "Apply for loan directly through listed participating banks via the portal.",
      "Upon approval, receive 3% interest subvention and credit guarantee."
    ],
    links: [
      { text: 'AIF Portal', url: 'https://agriinfra.dac.gov.in/', type: 'primary' }
    ]
  }
];

const stateSchemes = [
  {
    id: 'mh', title: 'Maharashtra', icon: 'fas fa-map-marker-alt',
    desc: 'Mahatma Jyotirao Phule Shetkari Karjmukti (Loan Waiver), Bhavantar Mukt Yojana.',
    process: [
      "Identify your eligibility via the respective state's Aaple Sarkar portal.",
      "For loan waivers, lists are generally drawn from bank data covering crop loans.",
      "Biometric authentication may be required at Maha-e-Seva Kendras or CSCs.",
      "Follow updates via the local District Collectorate or agriculture department."
    ]
  },
  {
    id: 'up', title: 'Uttar Pradesh', icon: 'fas fa-map-marker-alt',
    desc: 'UP Kisan Kalyan Mission, Mukhyamantri Krishak Durghatna Kalyan Yojana.',
    process: [
      "Register at the UP Agriculture Portal (upagripardarshi.gov.in).",
      "Upload Khatauni (land record), Aadhaar, and bank passbook.",
      "For accident insurance, claims must be routed through the tehsil office within the stipulated time.",
      "Input subsidies are sent directly via DBT to the linked bank account."
    ]
  },
  {
    id: 'mp', title: 'Madhya Pradesh', icon: 'fas fa-map-marker-alt',
    desc: 'Mukhyamantri Kisan Kalyan Yojana (₹4000/year to PM-KISAN beneficiaries).',
    process: [
      "Must be an existing PM-KISAN beneficiary registered in Madhya Pradesh.",
      "Patwari/Revenue officer verifies the list of eligible farmers.",
      "Verification lists are submitted to the MP SAARA portal.",
      "Two installments of ₹2000 are deposited directly into the beneficiary's PM-KISAN linked account."
    ]
  },
  {
    id: 'other', title: 'Other States', icon: 'fas fa-search-location',
    desc: 'Search for exclusive government subsidies and schemes in your specific state.',
    process: [
      "States such as West Bengal (Krishak Bandhu), Odisha (KALIA), and Telangana (Rythu Bandhu) manage their own exclusive welfare schemes.",
      "Look for direct cash transfers, input subsidies, or free electricity options.",
      "Applications are usually processed locally at village panchayat offices, CSCs (Common Service Centers), or state agriculture department websites.",
    ]
  }
];

const GovtSchemes = () => {
  const [activeModalId, setActiveModalId] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    visible: { opacity: 1, scale: 1, y: 0 }
  };

  const openModal = (id) => {
    setActiveModalId(id);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveModalId(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <motion.div 
      className="govt-schemes-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <BackButton />
      
      <div className="page-header">
        <h1>Government Schemes</h1>
        <div className="subtitle">Explore Central & State agricultural initiatives</div>
      </div>

      <main className="container">
        <div className="intro">
          <p>
            Welcome to the comprehensive repository of Indian agricultural schemes. We've consolidated the most critical 
            state and central initiatives to help you secure financial support, insurance, and equipment subsidies.
          </p>
          <p className="small tag-line">
            <i className="fas fa-info-circle"></i> Click any scheme card to instantly view its detailed application process.
          </p>
        </div>

        <h2 className="section-title"><i className="fas fa-landmark"></i> Major Central Schemes</h2>
        <motion.div 
          className="schemes-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {centralSchemes.map((scheme) => (
            <motion.div 
              key={scheme.id} 
              className="scheme-card popup-trigger" 
              variants={itemVariants} 
              whileHover={{ scale: 1.04, y: -5 }}
              onClick={() => openModal(scheme.id)}
            >
              <div className="card-icon-wrapper">
                <i className={scheme.icon}></i>
              </div>
              <div className="card-content">
                <h3>{scheme.title}</h3>
                <p className="brief-desc">{scheme.desc}</p>
                <button className="read-more-btn">View Application Process <i className="fas fa-arrow-right"></i></button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <h2 className="section-title" style={{ marginTop: '40px' }}><i className="fas fa-map"></i> State-Level Programs</h2>
        <motion.div 
          className="state-list schemes-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {stateSchemes.map((state) => (
            <motion.div 
              key={state.id} 
              className="state-card popup-trigger"
              variants={itemVariants}
              whileHover={{ scale: 1.04, y: -5 }}
              onClick={() => openModal(state.id)}
            >
               <div className="card-icon-wrapper state-icon">
                <i className={state.icon}></i>
              </div>
              <div className="card-content">
                <h3>{state.title}</h3>
                <p className="brief-desc">{state.desc}</p>
                 <button className="read-more-btn">View State Process <i className="fas fa-arrow-right"></i></button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* PRE-RENDERED MODAL POPUPS (Single Page Experience)
          By keeping all modals in the DOM permanently, Google Translate translates them successfully, 
          and they remain translated when opened, bypassing React's recreation-in-English problem. */}
      {/* Overlay Background */}
      <div 
        className="scheme-modal-overlay"
        style={{ 
          opacity: activeModalId ? 1 : 0, 
          pointerEvents: activeModalId ? 'auto' : 'none',
          transition: 'opacity 0.4s ease'
        }}
        onClick={closeModal}
      >
        {/* Render ALL Central Scheme Modals (Hidden via CSS if not active) */}
        {centralSchemes.map((scheme) => (
            <div 
              key={`modal-${scheme.id}`}
              className="scheme-modal-content"
              style={{ 
                display: activeModalId === scheme.id ? 'block' : 'none',
                transform: activeModalId === scheme.id ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(50px)',
                opacity: activeModalId === scheme.id ? 1 : 0,
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
              onClick={(e) => e.stopPropagation()} 
            >
              <button className="close-modal-btn" onClick={closeModal}><i className="fas fa-times"></i></button>
              
              <div className="modal-header">
                <div className="modal-icon"><i className={scheme.icon}></i></div>
                <h2>{scheme.title}</h2>
              </div>

              <div className="modal-body">
                <div className="highlight-box">
                  <strong>Overview:</strong> {scheme.desc}
                </div>
                
                <h4 className="details-header">Application Process & Eligibility</h4>
                <div className="long-details">
                  {scheme.details && <p style={{marginBottom: "20px"}}>{scheme.details}</p>}
                  <ul className="process-list">
                     {scheme.process.map((step, idx) => (
                       <li key={idx}><i className="fas fa-check-circle" style={{color: "#2e7d32", marginRight: "8px"}}></i> {step}</li>
                     ))}
                  </ul>
                </div>
                
                {scheme.links && (
                    <div className="modal-actions">
                      <p style={{marginBottom: "5px", color: "#666", fontSize: "0.9rem", width: "100%"}}>For final submissions, visit the official portal:</p>
                      {scheme.links.map((link, idx) => (
                        <a 
                          key={idx} 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={`btn btn-${link.type}`}
                        >
                          {link.text} <i className="fas fa-external-link-alt"></i>
                        </a>
                      ))}
                    </div>
                )}
              </div>
            </div>
        ))}

        {/* Render ALL State Scheme Modals (Hidden via CSS if not active) */}
        {stateSchemes.map((state) => (
            <div 
              key={`modal-${state.id}`}
              className="scheme-modal-content"
              style={{ 
                display: activeModalId === state.id ? 'block' : 'none',
                transform: activeModalId === state.id ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(50px)',
                opacity: activeModalId === state.id ? 1 : 0,
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
              onClick={(e) => e.stopPropagation()} 
            >
              <button className="close-modal-btn" onClick={closeModal}><i className="fas fa-times"></i></button>
              
              <div className="modal-header">
                <div className="modal-icon"><i className={state.icon}></i></div>
                <h2>{state.title}</h2>
              </div>

              <div className="modal-body">
                <div className="highlight-box">
                  <strong>Overview:</strong> {state.desc}
                </div>
                
                <h4 className="details-header">State Initiatives</h4>
                <div className="long-details">
                  <p style={{marginBottom: "20px"}}>
                    State governments constantly update their localized subsidies, loan waivers, and equipment distribution programs. 
                    Follow the state process to secure your funds for <strong>{state.title}</strong> targeting the agricultural sector.
                  </p>
                  <ul className="process-list">
                     {state.process.map((step, idx) => (
                       <li key={idx}><i className="fas fa-check-circle" style={{color: "#e65100", marginRight: "8px"}}></i> {step}</li>
                     ))}
                  </ul>
                </div>
                
                <div className="modal-actions">
                   <p style={{marginBottom: "5px", color: "#666", fontSize: "0.9rem", width: "100%"}}>Find the official regional portal dynamically:</p>
                   <a 
                      href={`https://www.google.com/search?q=${state.query}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-primary"
                    >
                      Search Official State Portals <i className="fas fa-search"></i>
                    </a>
                </div>
              </div>
            </div>
        ))}
      </div>

    </motion.div>
  );
};

export default GovtSchemes;
