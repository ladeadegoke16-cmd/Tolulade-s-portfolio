import { useEffect, useRef, useState } from "react";

// SVG Sunset placeholders
const photographyImages = [
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><defs><linearGradient id='g1' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23FF1493'/><stop offset='50%' stop-color='%23FF69B4'/><stop offset='100%' stop-color='%231A0010'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g1)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='white'>Sunset Gradient View I</text></svg>",
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><defs><linearGradient id='g2' x1='100%' y1='0%' x2='0%' y2='100%'><stop offset='0%' stop-color='%23800080'/><stop offset='60%' stop-color='%23FF69B4'/><stop offset='100%' stop-color='%23000000'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g2)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='white'>Sunset Gradient View II</text></svg>",
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><defs><linearGradient id='g3' x1='0%' y1='100%' x2='100%' y2='0%'><stop offset='0%' stop-color='%23FF69B4'/><stop offset='40%' stop-color='%23FF4500'/><stop offset='100%' stop-color='%23111111'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g3)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='white'>Sunset Gradient View III</text></svg>"
];

export default function App() {
  const canvasRef = useRef(null);
  const [activePhoto, setActivePhoto] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Theme state
  const [theme, setTheme] = useState("dark");
  
  // AI Showcase state (supports 3 tabs now)
  const [activeAiTab, setActiveAiTab] = useState("email");
  const [demoStep, setDemoStep] = useState(0);
  
  // Experience timeline active tab
  const [activeExpIndex, setActiveExpIndex] = useState(0);
  
  // Contact Form state
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Auto-play / Cycle through steps of the active AI workflow demo
  useEffect(() => {
    setDemoStep(0);
    const interval = setInterval(() => {
      setDemoStep((prev) => (prev < 3 ? prev + 1 : 0));
    }, 3500); // Transitions step every 3.5 seconds
    return () => clearInterval(interval);
  }, [activeAiTab]);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  // Sparkle canvas background (high-performance canvas alternative to 260 absolute divs)
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H, particles = [], animId;
    const COLORS = ["rgba(244,114,182,","rgba(236,72,153,","rgba(249,168,212,","rgba(255,255,255,","rgba(219,39,119,","rgba(251,207,232,"];
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener("resize", resize);
    class Particle {
      constructor() { this.reset(true); }
      reset(init) {
        this.x = Math.random()*W; this.y = init ? Math.random()*H : Math.random()*H;
        this.size = Math.random()*2.2+0.5;
        this.color = COLORS[Math.floor(Math.random()*COLORS.length)];
        this.alpha = Math.random()*0.7+0.2; this.alphaDir = (Math.random()-0.5)*0.012;
        this.vx = (Math.random()-0.5)*0.25; this.vy = (Math.random()-0.5)*0.25;
        this.angle = Math.random()*Math.PI*2; this.angleSpeed = (Math.random()-0.5)*0.04;
      }
      update() {
        this.x+=this.vx; this.y+=this.vy; this.alpha+=this.alphaDir; this.angle+=this.angleSpeed;
        if(this.alpha<=0.05||this.alpha>=0.9) this.alphaDir*=-1;
        if(this.x<-10||this.x>W+10||this.y<-10||this.y>H+10) this.reset(false);
      }
      draw() {
        ctx.save(); ctx.translate(this.x,this.y); ctx.rotate(this.angle);
        ctx.fillStyle=this.color+this.alpha+")"; ctx.beginPath();
        const s=this.size;
        ctx.moveTo(0,-s*2.2);ctx.lineTo(s*.5,-s*.5);ctx.lineTo(s*2.2,0);ctx.lineTo(s*.5,s*.5);
        ctx.lineTo(0,s*2.2);ctx.lineTo(-s*.5,s*.5);ctx.lineTo(-s*2.2,0);ctx.lineTo(-s*.5,-s*.5);
        ctx.closePath(); ctx.fill(); ctx.restore();
      }
    }
    for(let i=0;i<260;i++) particles.push(new Particle());
    function animate() { ctx.clearRect(0,0,W,H); particles.forEach(p=>{p.update();p.draw();}); animId=requestAnimationFrame(animate); }
    animate();
    return () => { window.removeEventListener("resize",resize); cancelAnimationFrame(animId); };
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting){e.target.classList.add("visible");obs.unobserve(e.target);} });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const navLinks = ["about", "experience", "showcase", "education", "photography", "languages", "contact"];

  // Data Definitions for AI Terminal Live Simulations
  const aiDemos = {
    email: {
      title: "Email Triage",
      subtitle: "CLIENT RELATIONS & COMMUNICATION",
      description: "Drafts highly polished, context-aware professional updates and organizes incoming stakeholder inquiries, ensuring critical operational messages are addressed promptly.",
      steps: [
        { label: "📥 Incoming Raw Data", content: "User Prompt: \"Review the pending client queries, draft professional updates matching the company tone, and flag items needing instant review.\"" },
        { label: "🔍 AI Triage Scanning", content: "Analyzing unread operational messages... Categorizing by urgency... Extracting action items..." },
        { label: "🤖 Execution Phase", content: "Drafted context-aware follow-ups using executive tone matching. Flagged high-priority items." },
        { label: "✅ Workflow Complete", content: "Status: 100% of inbox triaged. Drafts saved. Escalated items pushed to primary notification channel." }
      ]
    },
    calendar: {
      title: "Calendar Sync",
      subtitle: "SCHEDULING & AUTOMATION",
      description: "Autonomously schedules meetings across multiple time zones, coordinates overlapping requests, and creates necessary buffers to maximize CEO productivity.",
      steps: [
        { label: "📥 System Trigger", content: "System Action: \"Calendar conflict resolved. Adjusted June 15 meeting to 4 PM CET, sent update notifications and brief prep documents.\"" },
        { label: "🔍 Friction Analysis", content: "Detecting multi-timezone conflicts for upcoming European execution window. Overlap found at 14:00 CET." },
        { label: "🤖 AI Optimization", content: "Recalculating availability arrays... Applying mandatory 15-minute operational buffers between calls..." },
        { label: "✅ Workflow Complete", content: "Status: Rescheduled to 16:00 CET. Calendar sync locked. Briefing files packed and dispatched successfully." }
      ]
    },
    summaries: {
      title: "Summaries",
      subtitle: "EXECUTIVE OPERATIONS",
      description: "Processes detailed meeting transcripts to extract core action items, assign deadlines, and compile executive summaries for distribution.",
      steps: [
        { label: "📥 Raw Audio Transcript Input", content: "Parsing 45-minute strategic whiteboard audio recording... Mapping vocal profiles..." },
        { label: "🔍 Extraction Logic Running", content: "Identifying deliverables, dates, and ownership milestones... Stripping out conversational noise..." },
        { label: "🤖 Live AI Output Generated", content: "AI Output: \"Summary: WhiteRock Board Update. Action Items: 1. Tolulade to finalize partner reports (June 18) 2. Support team to...\"" },
        { label: "✅ Operational Sync Dispatched", content: "Status: Clean executive summaries structured. Action logs pushed directly to cross-functional trackers." }
      ]
    }
  };

  const clinicalSkills = [
    { icon: "🩺", title: "Observation & Vitals", desc: "Trained in measuring patient vital signs accurately and maintaining detailed clinical logs." },
    { icon: "❤️", title: "Basic Life Support (BLS)", desc: "Instructed in CPR, first aid procedures, and responding swiftly to emergency situations." },
    { icon: "📋", title: "Health Records & Databases", desc: "Adhering strictly to confidentiality standards while managing patient records and databases." },
    { icon: "🤝", title: "Empathy & Communication", desc: "Providing warm, clear patient support and clinical empathy to reassure individuals under care." }
  ];

  const experienceData = [
    {
      period: "2024 – Jan 2026",
      role: "Executive Assistant",
      company: "WhiteRock — Tirana, Albania",
      bullets: [
        "Architected and managed high-priority workflows for C-suite infrastructure, ensuring zero overlap across multiple time zones.",
        "Deployed automated data processing protocols, lowering scheduling friction by 40% and freeing up core weekly strategic hours.",
        "Managed multi-stakeholder operations with explicit emphasis on timeline validation and target achievement."
      ]
    },
    {
      period: "2024 – Jan 2026",
      role: "Lead Admissions Counselor",
      company: "WhiteRock — Tirana, Albania",
      bullets: [
        "Coordinate processing channels for over 50+ students, stabilizing high-volume inbound operational records.",
        "Achieved a 90% success rate across cross-departmental placement targets by building specialized assessment strategies.",
        "Drove a 100% brand growth metric across digital channels while boosting target account conversion variables."
      ]
    },
    {
      period: "2024 – Jan 2026",
      role: "Social Media Manager",
      company: "WhiteRock — Tirana, Albania",
      bullets: [
        "Generated a 70% engagement increase across target distributions via deep data analytics and trend evaluation maps.",
        "Standardized content pipeline schedules to optimize automated publication grids across key audience touchpoints."
      ]
    }
  ];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.subject.trim()) errors.subject = "Subject is required";
    if (!formData.message.trim()) errors.message = "Message is required";
    return errors;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormLoading(true);
    setTimeout(() => {
      setFormLoading(false);
      setFormSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  return (
    <>
      {activePhoto && (
        <div className="lightbox" onClick={() => setActivePhoto(null)}>
          <img src={activePhoto} alt="Full size" />
        </div>
      )}

      {/* MOBILE MENU */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <button onClick={() => setMenuOpen(false)} style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", color: "var(--text-secondary)", fontSize: "1.5rem", cursor: "pointer" }}>✕</button>
        {navLinks.map(s => (
          <a key={s} href={`#${s === "showcase" ? "projects" : s}`} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
            {s === "showcase" ? "Projects" : s.charAt(0).toUpperCase() + s.slice(1)}
          </a>
        ))}
      </div>

      {/* NAV */}
      <nav>
        <div className="nav-inner">
          <a href="#hero" className="serif nav-brand">T. Adegoke</a>
          <ul className="desktop-nav">
            {navLinks.map(s => (
              <li key={s}>
                <a href={`#${s === "showcase" ? "projects" : s}`} className="nav-link">
                  {s === "showcase" ? "Projects" : s}
                </a>
              </li>
            ))}
            <li>
              <button 
                className="theme-toggle" 
                onClick={() => setTheme(prev => prev === "dark" ? "light" : "dark")}
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
            </li>
          </ul>
          <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" className="hero-section">
        <div className="hero-pad">
          <h1 className="hero-name hero-name-size serif">Tolulade Adegoke</h1>
          <p className="hero-eyebrow" style={{ marginTop: "10px", marginBottom: "30px" }}>Executive Assistant</p>
          <div className="hero-cta">
            <a href="#projects" className="btn-primary">📂 View My Work</a>
            <a href="#contact" className="btn-secondary">✉️ Contact Me</a>
          </div>
          <div className="scroll-hint">
            <span className="scroll-line" />
            Scroll to explore
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section-pad about-section">
        <p className="reveal section-eyebrow">Who I Am</p>
        <h2 className="reveal serif section-title">About Me</h2>
        <div className="reveal section-divider" />
        <div className="about-grid">
          <div className="reveal about-text">
            <p>
              Based in Tirana, Albania, I operate as a strategic partner to high-level executives. By integrating advanced technology and modern methodologies, I design and maintain highly scalable workflows that optimize time allocation, minimize friction, and let leaders focus entirely on organizational growth.
            </p>
            <p>
              My approach fuses classic operational excellence with modern efficiency. My work includes building complex cross-timezone configurations, processing large-scale operational records, and crafting AI systems to translate speech-to-text audio inputs directly into organized target deadlines.
            </p>
          </div>
          <div className="reveal">
            <h3 className="serif skills-title">Core Skills</h3>
            <div className="skills-grid">
              {["Team Coordination", "Team Leading", "Client Relations", "Calendar Management", "AI-Powered Workflows", "CRM & Databases", "Public Speaking", "Content Creation", "Video Editing", "Conflict Resolution"].map(skill => (
                <div key={skill} className="skill-pill">{skill}</div>
              ))}
            </div>
          </div>
        </div>

        {/* CLINICAL NURSING SKILLS */}
        <div className="reveal" style={{ marginTop: "6rem" }}>
          <p className="section-eyebrow">Healthcare &amp; Care Training</p>
          <h2 className="serif section-title">Clinical &amp; <em className="grad-text">Care Skills</em></h2>
          <div className="section-divider" />
          <div className="clinical-grid">
            {clinicalSkills.map((skill, index) => (
              <div key={index} className="clinical-card">
                <div className="clinical-icon">{skill.icon}</div>
                <h3 className="clinical-title">{skill.title}</h3>
                <p className="clinical-desc">{skill.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="section-pad experience-section">
        <p className="reveal section-eyebrow">Career Journey</p>
        <h2 className="reveal serif section-title">Professional Experience</h2>
        <div className="reveal section-divider" />
        
        <div className="reveal timeline-container">
          {/* Timeline navigation tabs */}
          <div className="timeline-nav">
            {experienceData.map((item, idx) => (
              <button 
                key={idx} 
                className={`timeline-tab-btn ${activeExpIndex === idx ? "active" : ""}`}
                onClick={() => setActiveExpIndex(idx)}
              >
                <span className="timeline-tab-period">{item.period}</span>
                <span className="timeline-tab-role">{item.role}</span>
              </button>
            ))}
          </div>
          
          {/* Active timeline content */}
          <div className="timeline-content-panel">
            <span className="timeline-panel-period">{experienceData[activeExpIndex].period}</span>
            <h3 className="timeline-panel-role">{experienceData[activeExpIndex].role}</h3>
            <p className="timeline-panel-company">{experienceData[activeExpIndex].company}</p>
            <ul className="timeline-panel-list">
              {experienceData[activeExpIndex].bullets.map((b, idx) => (
                <li key={idx} className="timeline-panel-item">{b}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CASE STUDIES & PROJECT PORTFOLIOS */}
      <section id="projects" className="section-pad about-section">
        <p className="reveal section-eyebrow">Interactive Showcase</p>
        <h2 className="reveal serif section-title">Case Studies &amp; <em className="grad-text">Demos</em></h2>
        <div className="reveal section-divider" />
        <p className="reveal" style={{ color: "var(--text-secondary)", marginBottom: "30px", fontSize: "1.05rem", maxWidth: "600px" }}>
          Interact with the live simulator dashboard to see AI automations play out, or browse the verified external project folders.
        </p>

        {/* Live Simulated AI Terminal */}
        <div className="reveal ai-showcase-container">
          <div className="ai-sidebar">
            <button className={`ai-tab-btn ${activeAiTab === "email" ? "active" : ""}`} onClick={() => setActiveAiTab("email")}>
              <span className="ai-tab-title">Email Triage</span>
              <span className="ai-tab-subtitle">COMMUNICATION</span>
            </button>
            <button className={`ai-tab-btn ${activeAiTab === "calendar" ? "active" : ""}`} onClick={() => setActiveAiTab("calendar")}>
              <span className="ai-tab-title">Calendar Sync</span>
              <span className="ai-tab-subtitle">SCHEDULING</span>
            </button>
            <button className={`ai-tab-btn ${activeAiTab === "summaries" ? "active" : ""}`} onClick={() => setActiveAiTab("summaries")}>
              <span className="ai-tab-title">Summaries</span>
              <span className="ai-tab-subtitle">OPERATIONS</span>
            </button>
          </div>
          <div className="ai-content">
            <span className="ai-detail-tag">{aiDemos[activeAiTab].subtitle}</span>
            <h3 className="ai-detail-title">{aiDemos[activeAiTab].title}</h3>
            <p className="ai-detail-desc">{aiDemos[activeAiTab].description}</p>
            
            {/* Live Terminal Log Sandbox */}
            <div className="ai-mockup-box" style={{ marginTop: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", borderBottom: "1px solid var(--border-color)", paddingBottom: "6px" }}>
                <strong style={{ color: "var(--accent-color)" }}>Live Simulator Log</strong>
                <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Auto-playing...</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {aiDemos[activeAiTab].steps.map((step, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      transition: "opacity 0.4s ease, color 0.4s ease",
                      opacity: idx <= demoStep ? 1 : 0.25,
                      color: idx === demoStep ? "var(--text-light)" : "var(--text-secondary)"
                    }}
                  >
                    <strong style={{ color: idx === demoStep ? "var(--accent-color)" : "var(--text-muted)" }}>
                      {step.label}:
                    </strong>{" "}
                    {step.content}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Confidentiality Notice */}
        <div className="reveal" style={{
          borderLeft: "4px solid var(--accent-color)",
          backgroundColor: "var(--bg-card)",
          padding: "20px",
          borderRadius: "4px",
          marginTop: "3rem",
          marginBottom: "3rem"
        }}>
          <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: "1.6", color: "var(--text-primary)" }}>
            ⚠️ <strong>Confidentiality Notice:</strong> All projects displayed inside the external repositories are mock or real-life scenario-based case studies created strictly for portfolio demonstration purposes only. No real executive data, client files, or confidential corporate records are included.
          </p>
        </div>

        {/* External Drive Folders Grid */}
        <div className="reveal edu-grid-resp">
          <div className="edu-card">
            <span className="edu-school" style={{ backgroundColor: "rgba(236,72,153,0.1)", padding: "4px 8px", borderRadius: "12px", fontSize: "0.7rem" }}>AI WORKFLOWS</span>
            <h3 className="serif edu-degree" style={{ marginTop: "1rem" }}>Inbox Architecture</h3>
            <p className="edu-year" style={{ marginTop: "0.5rem", lineHeight: "1.5" }}>Contains structured triage models, quick response matrices, and systemized priority configurations for handling massive inbox volumes.</p>
            <a href="YOUR_GOOGLE_DRIVE_FOLDER_LINK_HERE" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "1.2rem", color: "var(--accent-color)", textDecoration: "none", fontWeight: "500" }}>View Project Files ↗</a>
          </div>

          <div className="edu-card">
            <span className="edu-school" style={{ backgroundColor: "rgba(236,72,153,0.1)", padding: "4px 8px", borderRadius: "12px", fontSize: "0.7rem" }}>SCHEDULING</span>
            <h3 className="serif edu-degree" style={{ marginTop: "1rem" }}>Calendar Optimization</h3>
            <p className="edu-year" style={{ marginTop: "0.5rem", lineHeight: "1.5" }}>Contains live multi-timezone tracking samples, buffer parameters, and automated conflict-resolution mapping variables.</p>
            <a href="YOUR_GOOGLE_DRIVE_FOLDER_LINK_HERE" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "1.2rem", color: "var(--accent-color)", textDecoration: "none", fontWeight: "500" }}>View Project Files ↗</a>
          </div>

          <div className="edu-card">
            <span className="edu-school" style={{ backgroundColor: "rgba(236,72,153,0.1)", padding: "4px 8px", borderRadius: "12px", fontSize: "0.7rem" }}>OPERATIONS</span>
            <h3 className="serif edu-degree" style={{ marginTop: "1rem" }}>Summaries &amp; Extractions</h3>
            <p className="edu-year" style={{ marginTop: "0.5rem", lineHeight: "1.5" }}>Contains anonymized transcripts, AI extraction scripts, action log distributions, and cross-functional task deadlines.</p>
            <a href="YOUR_GOOGLE_DRIVE_FOLDER_LINK_HERE" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "1.2rem", color: "var(--accent-color)", textDecoration: "none", fontWeight: "500" }}>View Project Files ↗</a>
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education" className="section-pad about-section">
        <p className="reveal section-eyebrow">Academic Background</p>
        <h2 className="reveal serif section-title">Education &amp; Training</h2>
        <div className="reveal section-divider" />
        <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: "32px", marginTop: "3.5rem" }}>
          <div style={{ borderLeft: "2px solid var(--accent-color)", paddingLeft: "1.5rem" }}>
            <h3 className="serif edu-degree" style={{ margin: 0 }}>BSc. Nursing</h3>
            <span className="edu-school" style={{ fontSize: "0.9rem", display: "inline-block", marginTop: "0.2rem" }}>Western Balkans University | 2025 – Ongoing</span>
            <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem", fontSize: "0.95rem", lineHeight: "1.6" }}>Developing structured, clinical assessment techniques and administrative healthcare system foundations.</p>
          </div>

          <div style={{ borderLeft: "2px solid var(--border-color)", paddingLeft: "1.5rem" }}>
            <h3 className="serif edu-degree" style={{ margin: 0 }}>Health &amp; Social Care Diploma</h3>
            <span className="edu-school" style={{ fontSize: "0.9rem", display: "inline-block", marginTop: "0.2rem" }}>Online Business School (OBS) | 2024 – Ongoing</span>
            <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem", fontSize: "0.95rem", lineHeight: "1.6" }}>Focused on modern care execution standards and structural facility admin parameters.</p>
          </div>
        </div>
      </section>

      {/* PHOTOGRAPHY */}
      <section id="photography" className="section-pad photos-section">
        <p className="reveal section-eyebrow">In My Spare Time</p>
        <h2 className="reveal serif section-title">Photography Portfolio</h2>
        <div className="reveal section-divider" />
        <p className="reveal" style={{ fontSize: "1rem", lineHeight: "1.85", color: "var(--text-secondary)", maxWidth: "520px", marginBottom: "3rem" }}>
          Captured views and environmental landscapes.
        </p>
        <div className="reveal photos-grid">
          {photographyImages.map((imgSrc, index) => (
            <div key={index} className="photo-card" onClick={() => setActivePhoto(imgSrc)}>
              <img src={imgSrc} alt={`Sunset ${index + 1}`} />
            </div>
          ))}
        </div>
      </section>

      {/* LANGUAGES */}
      <div className="lang-section">
        <div className="reveal">
          <p className="section-eyebrow">Communication</p>
          <h2 className="serif section-title">Languages</h2>
        </div>
        <div className="reveal lang-list">
          {[
            { lang: "English", level: "Native / Fluent Coordination Capacity" },
            { lang: "Yoruba", level: "Native Proficiency" }
          ].map(({ lang, level }) => (
            <div key={lang} className="lang-item" style={{ textAlign: "left" }}>
              <span className="serif lang-name" style={{ display: "inline" }}>{lang}</span>
              <span className="lang-level" style={{ display: "block", marginTop: "0.3rem" }}>{level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CONTACT */}
      <section id="contact" className="section-pad contact-section">
        <p className="reveal section-eyebrow">Get In Touch</p>
        <h2 className="reveal serif section-title">Let's Build Together</h2>
        <div className="reveal section-divider" />
        
        <div className="contact-container">
          <div className="reveal contact-info">
            <p className="contact-info-desc">
              Available for corporate partnerships, pipeline architectural consultations, and elite administrative management contracts globally.
            </p>
            <a href="mailto:ladeadegoke16@gmail.com" className="serif grad-text contact-email-link">
              ladeadegoke16@gmail.com
            </a>
            <div className="contact-details" style={{ marginTop: "1rem" }}>
              <span>📞 +355 68 832 5692</span>
              <span>📍 Tirana, Albania</span>
              <span>References available on request</span>
            </div>
          </div>
          
          <div className="reveal contact-form-box">
            {formSubmitted ? (
              <div className="form-success-message">
                <span className="success-icon">✉️</span>
                <h3 className="success-title">Message Sent!</h3>
                <p className="success-desc">Thank you for reaching out, Tolulade will get back to you shortly.</p>
                <button className="btn-primary" style={{ marginTop: "1.5rem" }} onClick={() => setFormSubmitted(false)}>
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    className="form-input" 
                    value={formData.name} 
                    onChange={handleFormChange}
                    placeholder="John Doe"
                  />
                  {formErrors.name && <span className="form-error">{formErrors.name}</span>}
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    className="form-input" 
                    value={formData.email} 
                    onChange={handleFormChange}
                    placeholder="john@example.com"
                  />
                  {formErrors.email && <span className="form-error">{formErrors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="subject">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    className="form-input" 
                    value={formData.subject} 
                    onChange={handleFormChange}
                    placeholder="Job Opportunity / Inquiry"
                  />
                  {formErrors.subject && <span className="form-error">{formErrors.subject}</span>}
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="message">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    className="form-textarea" 
                    value={formData.message} 
                    onChange={handleFormChange}
                    placeholder="Hi Tolulade, I would love to talk about..."
                  />
                  {formErrors.message && <span className="form-error">{formErrors.message}</span>}
                </div>
                
                <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={formLoading}>
                  {formLoading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div>&copy; {new Date().getFullYear()} Tolulade Adegoke. All operational structures secured. Built via AI-Powered Workflows.</div>
          <div>Built with care &amp; intention</div>
        </div>
      </footer>
    </>
  );
}
