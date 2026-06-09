import { useEffect, useRef, useState } from "react";
import { PHOTO_1, PHOTO_2, PHOTO_3 } from "./data/photos";

export default function App() {
  const canvasRef = useRef(null);
  const [activePhoto, setActivePhoto] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Theme state
  const [theme, setTheme] = useState("dark");
  
  // AI Showcase state
  const [activeAiTab, setActiveAiTab] = useState("email");
  
  // Experience timeline state
  const [activeExpIndex, setActiveExpIndex] = useState(0);
  
  // Contact Form state
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

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
        this.size = Math.random()*2.0+0.3;
        this.color = COLORS[Math.floor(Math.random()*COLORS.length)];
        this.alpha = Math.random()*0.7+0.1; this.alphaDir = (Math.random()-0.5)*0.012;
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

  const photos = [
    { src: PHOTO_1, alt: "Rooftop sunset over the city" },
    { src: PHOTO_2, alt: "Dramatic fiery sky over Tirana" },
    { src: PHOTO_3, alt: "Golden sunset at the beach" },
  ];

  const navLinks = ["about", "experience", "education", "contact"];

  const aiWorkflows = {
    email: {
      title: "Email Crafting & Triage",
      tag: "Client Relations & Communication",
      desc: "Drafts highly polished, context-aware professional updates and organizes incoming stakeholder inquiries, ensuring critical operational messages are addressed promptly.",
      mockup: "User Prompt: \"Review the pending client queries, draft professional updates matching the company tone, and flag items needing instant review.\""
    },
    calendar: {
      title: "Smart Calendar Optimization",
      tag: "Scheduling & Automation",
      desc: "Autonomously schedules meetings across multiple time zones, coordinates overlapping requests, and creates necessary buffers to maximize CEO productivity.",
      mockup: "System Action: \"Calendar conflict resolved. Adjusted June 15 meeting to 4 PM CET, sent update notifications and brief prep documents.\""
    },
    summarization: {
      title: "Meeting Action Item Extract",
      tag: "Executive Operations",
      desc: "Processes detailed meeting transcripts to extract core action items, assign deadlines, and compile executive summaries for distribution.",
      mockup: "AI Output: \"Summary: WhiteRock Board Update. Action Items: 1. Tolulade to finalize partner reports (June 18) 2. Support team to...\""
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
      company: "WhiteRock Educational Services",
      bullets: [
        "Coordinated professional English-language communications across 10+ international clients and internal teams daily",
        "Provided comprehensive administrative support to the CEO, saving an estimated 2+ hours of operational time weekly",
        "Streamlined calendar management, scheduling an average of 5 high-level weekly meetings across multiple time zones",
        "Served as primary liaison between the CEO and 10 cross-functional internal teams",
        "Drafted, formatted, and proofread high-quality corporate documents, proposals, and presentations",
        "Managed critical external relationships, liaising regularly with corporate clients and service providers"
      ]
    },
    {
      period: "2024 – Jan 2026",
      role: "Admissions Counselor",
      company: "WhiteRock Educational Services",
      bullets: [
        "Conducted structured academic consultations for 50+ prospective students, achieving a 90% enrollment success rate",
        "Guided students through end-to-end application documentation and university enrollment procedures",
        "Increased student enrollment conversion by 15% through personalized academic guidance",
        "Cultivated collaborative communication networks with 4 international institutional partners",
        "Managed proactive follow-up pipelines with 200+ prospective applicants to accelerate decision-making"
      ]
    },
    {
      period: "2024 – Jan 2026",
      role: "Social Media Manager",
      company: "WhiteRock Educational Services",
      bullets: [
        "Grew overall brand presence across Instagram, TikTok, and Facebook by 100% through multimedia content strategy",
        "Maintained a 100% response rate to all incoming client direct messages and digital inquiries",
        "Analyzed platform engagement metrics weekly, resulting in a 70% increase in audience interaction"
      ]
    },
    {
      period: "2023 – 2024",
      role: "Intern",
      company: "WhiteRock Educational Services",
      bullets: [
        "Supported daily office operations and assisted team members with administrative and data entry tasks, processing up to 20 files daily",
        "Contributed to departmental projects through background research and organizing shared digital resources",
        "Welcomed visitors and directed inquiries to the appropriate personnel, ensuring excellent initial touchpoints"
      ]
    },
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
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: "var(--star-canvas-opacity)" }} />

      {activePhoto && (
        <div className="lightbox" onClick={() => setActivePhoto(null)}>
          <img src={activePhoto} alt="Full size" />
        </div>
      )}

      {/* MOBILE MENU */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <button onClick={() => setMenuOpen(false)} style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", color: "var(--text-secondary)", fontSize: "1.5rem", cursor: "pointer" }}>✕</button>
        {navLinks.map(s => (
          <a key={s} href={`#${s}`} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>{s.charAt(0).toUpperCase() + s.slice(1)}</a>
        ))}
      </div>

      {/* NAV */}
      <nav>
        <div className="nav-inner">
          <a href="#hero" className="serif nav-brand">T. Adegoke</a>
          <ul className="desktop-nav">
            {navLinks.map(s => (
              <li key={s}><a href={`#${s}`} className="nav-link">{s}</a></li>
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
          <p className="hero-eyebrow">Executive Assistant</p>
          <h1 className="hero-name hero-name-size serif">
            Tolulade<br /><em className="grad-text">Adegoke</em>
          </h1>
          <p className="hero-tagline">
            Bridging communication, building connections, and keeping organisations moving — with precision and warmth.
          </p>
          <div className="hero-cta">
            <a href="#contact" className="btn-primary">Get in Touch</a>
            <a href="#experience" className="btn-secondary">View Experience</a>
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
        <h2 className="reveal serif section-title">Organised. Adaptable.<br /><em className="grad-text">People-first.</em></h2>
        <div className="reveal section-divider" />
        <div className="about-grid">
          <div className="reveal about-text">
            <p>
              I'm a highly organised and versatile professional with a strong background in executive administration, client relations, and digital content management. I actively use AI tools to streamline workflows, enhance productivity, and deliver smarter results faster.
            </p>
            <p>
              My experience spans education, healthcare, and creative fields, making me a versatile asset to any team. I thrive in fast-paced environments where detail, discretion, and warm communication matter most.
            </p>
            <p>
              Currently pursuing a BSc. in Nursing at Western Balkans University, I bring both professional polish and genuine curiosity to everything I do.
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

        {/* AI WORKFLOWS SHOWCASE */}
        <div className="reveal" style={{ marginTop: "6rem" }}>
          <p className="section-eyebrow">Efficiency & Automation</p>
          <h2 className="serif section-title">AI-Powered <em className="grad-text">Workflows</em></h2>
          <div className="section-divider" />
          <div className="ai-showcase-container">
            <div className="ai-sidebar">
              <button className={`ai-tab-btn ${activeAiTab === "email" ? "active" : ""}`} onClick={() => setActiveAiTab("email")}>
                <span className="ai-tab-title">Email Triage</span>
                <span className="ai-tab-subtitle">Communication</span>
              </button>
              <button className={`ai-tab-btn ${activeAiTab === "calendar" ? "active" : ""}`} onClick={() => setActiveAiTab("calendar")}>
                <span className="ai-tab-title">Calendar Sync</span>
                <span className="ai-tab-subtitle">Scheduling</span>
              </button>
              <button className={`ai-tab-btn ${activeAiTab === "summarization" ? "active" : ""}`} onClick={() => setActiveAiTab("summarization")}>
                <span className="ai-tab-title">Summaries</span>
                <span className="ai-tab-subtitle">Operations</span>
              </button>
            </div>
            <div className="ai-content">
              <span className="ai-detail-tag">{aiWorkflows[activeAiTab].tag}</span>
              <h3 className="ai-detail-title">{aiWorkflows[activeAiTab].title}</h3>
              <p className="ai-detail-desc">{aiWorkflows[activeAiTab].desc}</p>
              <div className="ai-mockup-box">
                <strong>Showcase Demo:</strong><br />
                {aiWorkflows[activeAiTab].mockup}
              </div>
            </div>
          </div>
        </div>

        {/* CLINICAL NURSING SKILLS */}
        <div className="reveal" style={{ marginTop: "6rem" }}>
          <p className="section-eyebrow">Healthcare Training</p>
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
        <h2 className="reveal serif section-title">Where I've<br /><em className="grad-text">Made an Impact</em></h2>
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

      {/* EDUCATION */}
      <section id="education" className="section-pad about-section">
        <p className="reveal section-eyebrow">Academic Background</p>
        <h2 className="reveal serif section-title">Learning &amp;<br /><em className="grad-text">Growing</em></h2>
        <div className="reveal section-divider" />
        <div className="edu-grid-resp">
          {[
            { school: "Western Balkans University", degree: "BSc. in Nursing", year: "2025 – Ongoing" },
            { school: "Online Business School", degree: "Level 5 Diploma — Health & Social Care", year: "2024 – Ongoing" },
            { school: "Yaba College of Technology", degree: "OND — Mass Communication", year: "2022 – 2024" },
            { school: "Bammy College", degree: "O'Level", year: "2020" },
          ].map(({ school, degree, year }) => (
            <div key={school} className="reveal edu-card">
              <p className="edu-school">{school}</p>
              <h3 className="serif edu-degree">{degree}</h3>
              <p className="edu-year">{year}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PHOTOS */}
      <section id="photos" className="section-pad photos-section">
        <p className="reveal section-eyebrow">In My Spare Time</p>
        <h2 className="reveal serif section-title">Chasing <em className="grad-text">Beautiful Moments</em></h2>
        <div className="reveal section-divider" />
        <p className="reveal" style={{ fontSize: "1rem", lineHeight: "1.85", color: "var(--text-secondary)", maxWidth: "520px", marginBottom: "3rem" }}>
          I like to take cheesy pictures of nature and document beautiful moments. Here are some I've captured.
        </p>
        <div className="reveal photos-grid">
          {photos.map(({ src, alt }, i) => (
            <div key={i} className="photo-card" onClick={() => setActivePhoto(src)}>
              <img src={src} alt={alt} />
            </div>
          ))}
        </div>
      </section>

      {/* LANGUAGES */}
      <div className="lang-section">
        <div className="reveal">
          <p className="section-eyebrow">Communication</p>
          <h2 className="serif section-title">Speaking the<br /><em className="grad-text">right language</em></h2>
        </div>
        <div className="reveal lang-list">
          {[{ lang: "English", level: "Fluent" }, { lang: "Albanian", level: "Proficient" }].map(({ lang, level }) => (
            <div key={lang} className="lang-item">
              <span className="serif lang-name">{lang}</span>
              <span className="lang-level">{level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CONTACT */}
      <section id="contact" className="section-pad contact-section">
        <p className="reveal section-eyebrow">Get In Touch</p>
        <h2 className="reveal serif section-title">Let's <em className="grad-text">Connect</em></h2>
        <div className="reveal section-divider" />
        
        <div className="contact-container">
          <div className="reveal contact-info">
            <p className="contact-info-desc">
              Whether you have an opportunity, a question, or just want to say hello — my inbox is open. Feel free to use the form or mail me directly.
            </p>
            <a href="mailto:ladeadegoke16@gmail.com" className="serif grad-text contact-email-link">
              ladeadegoke16@gmail.com
            </a>
            <div className="contact-details">
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
          <div>© 2026 <span style={{ color: "var(--accent-color)" }}>Tolulade Adegoke</span> — Tirana, Albania</div>
          <div>Built with care &amp; intention</div>
        </div>
      </footer>
    </>
  );
}
