import { useEffect, useRef, useState, useCallback } from "react";
import { PHOTO_1, PHOTO_2, PHOTO_3 } from "./data/photos";

export default function App() {
  const canvasRef = useRef(null);
  const [activePhoto, setActivePhoto] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const dark = {
    bg: "#0a0a0a",
    bg2: "#111014",
    card: "#160e14",
    text: "#e5e0e3",
    muted: "#9ca3af",
    faint: "#6b7280",
    border: "#2a1224",
    border2: "#4b1535",
    nav: "rgba(10,10,10,.92)",
    tldot: "#0a0a0a",
    langbg: "linear-gradient(135deg,#1a0520,#0a0a0a)",
    footer: "#050505",
  };

  const light = {
    bg: "#fdf8fc",
    bg2: "#fff0f8",
    card: "#fff",
    text: "#1a0a14",
    muted: "#5a4050",
    faint: "#9c7a8c",
    border: "#f0d0e0",
    border2: "#ec4899",
    nav: "rgba(253,248,252,.95)",
    tldot: "#fdf8fc",
    langbg: "linear-gradient(135deg,#fce7f3,#fdf8fc)",
    footer: "#2a0a1a",
  };

  const t = isDark ? dark : light;

  // ── Glitter ──
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H, particles = [], animId;
    const COLORS = ["rgba(244,114,182,", "rgba(236,72,153,", "rgba(249,168,212,", "rgba(255,255,255,", "rgba(219,39,119,", "rgba(251,207,232,"];
    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    class Particle {
      constructor() { this.reset(true); }
      reset(init) {
        this.x = Math.random() * W;
        this.y = init ? Math.random() * H : Math.random() * H;
        this.size = Math.random() * 2.0 + 0.3;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.alpha = Math.random() * 0.7 + 0.1;
        this.alphaDir = (Math.random() - 0.5) * 0.012;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = (Math.random() - 0.5) * 0.04;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha += this.alphaDir;
        this.angle += this.angleSpeed;
        if (this.alpha <= 0.05 || this.alpha >= 0.9) this.alphaDir *= -1;
        if (this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) this.reset(false);
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color + this.alpha + ")";
        ctx.beginPath();
        const s = this.size;
        ctx.moveTo(0, -s * 2.2);
        ctx.lineTo(s * .5, -s * .5);
        ctx.lineTo(s * 2.2, 0);
        ctx.lineTo(s * .5, s * .5);
        ctx.lineTo(0, s * 2.2);
        ctx.lineTo(-s * .5, s * .5);
        ctx.lineTo(-s * 2.2, 0);
        ctx.lineTo(-s * .5, -s * .5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }
    for (let i = 0; i < 260; i++) particles.push(new Particle());
    function animate() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      animId = requestAnimationFrame(animate);
    }
    animate();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // ── Scroll reveal ──
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -20px 0px" });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // ── Nav scroll — accounts for fixed nav height ──
  const scrollTo = useCallback((id) => {
    setMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const navH = document.querySelector("nav")?.offsetHeight || 70;
      const top = el.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: "smooth" });
    }, 50);
  }, []);

  const photos = [
    { src: PHOTO_1, alt: "Rooftop sunset over the city" },
    { src: PHOTO_2, alt: "Dramatic fiery sky over Tirana" },
    { src: PHOTO_3, alt: "Golden sunset at the beach" },
  ];

  const navLinks = [
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "work", label: "Work" },
    { id: "contact", label: "Contact" },
  ];

  const workSamples = [
    {
      tag: "EXECUTIVE SUPPORT",
      title: "CEO Weekly Schedule",
      desc: "A structured 5-day executive calendar managing cross-timezone meetings, buffer blocks...",
      link: "https://drive.google.com/file/d/1szQGvqLM2nxLCQlI-_iVbmSvDXyqHNrR/view?usp=sharing"
    },
    {
      tag: "COMMUNICATION",
      title: "Professional Email Templates",
      desc: "Three polished email templates covering client meeting confirmations, student inquiries...",
      link: "https://drive.google.com/file/d/1hQY6OBnKyZaqdcwHrQCPfUSjsOuM3fsx/view?usp=sharing"
    },
    {
      tag: "SOCIAL MEDIA",
      title: "2-Week Content Plan",
      desc: "A full content calendar across Instagram, TikTok, and Facebook — with captions...",
      link: "https://drive.google.com/file/d/1v8UttQunHEyNQqyPNvmiuY47w5am64iS/view?usp=sharing"
    },
    {
      tag: "ADMISSIONS",
      title: "Student Onboarding Pack",
      desc: "An end-to-end admissions template covering student profiling, programme recommendations...",
      link: "https://drive.google.com/file/d/1ANfHgbtWoTEy4IhQ7Nsq9EWZ-wsrUsm3/view?usp=sharing"
    }
  ];

  const experienceData = [
    {
      period: "2024 – Jan 2026",
      role: "Executive Assistant",
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
      bullets: [
        "Grew overall brand presence across Instagram, TikTok, and Facebook by 100% through multimedia content strategy",
        "Maintained a 100% response rate to all incoming client direct messages and digital inquiries",
        "Analyzed platform engagement metrics weekly, resulting in a 70% increase in audience engagement"
      ]
    },
    {
      period: "2023 – 2024",
      role: "Intern",
      bullets: [
        "Supported daily office operations and assisted team members with administrative and data entry tasks, processing up to 20 files daily",
        "Contributed to departmental projects through background research and organizing shared digital resources",
        "Welcomed visitors and directed inquiries to the appropriate personnel, ensuring excellent initial touchpoints"
      ]
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: auto; } /* we handle smooth scroll manually */
        body { overflow-x: hidden; font-family: 'DM Sans', sans-serif; font-weight: 300; background: ${t.bg}; color: ${t.text}; transition: background-color 0.4s ease, color 0.4s ease; }
        .serif { font-family: 'Cormorant Garamond', serif; }
        .grad-text { background: linear-gradient(135deg, #f9a8d4, #ec4899, #db2777); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity .7s ease, transform .7s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }

        /* NAV links */
        .nav-link { background: none; border: none; cursor: pointer; transition: color .2s; text-decoration: none; font-size: .78rem; letter-spacing: .14em; text-transform: uppercase; font-family: inherit; font-weight: inherit; }
        .nav-link:hover { color: #f472b6 !important; }

        /* Hamburger */
        .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 4px; }
        .hamburger span { display: block; width: 22px; height: 2px; background: #9ca3af; transition: all 0.3s; }

        /* Theme toggle */
        .theme-btn { cursor: pointer; background: none; border: 1px solid ${t.border}; border-radius: 4px; padding: 6px 12px; font-family: inherit; font-size: 0.85rem; transition: border-color 0.25s, color 0.25s; }
        .theme-btn:hover { border-color: #f472b6; color: #f472b6; }

        /* Mobile full-screen menu */
        .mobile-menu {
          display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          z-index: 200; flex-direction: column; align-items: center; justify-content: center; gap: 2.5rem;
          backdrop-filter: blur(14px);
        }
        .mobile-menu.open { display: flex; }
        .mobile-close { position: absolute; top: 1.5rem; right: 1.5rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; }
        .mobile-nav-btn { background: none; border: none; cursor: pointer; font-size: 2rem; font-family: 'Cormorant Garamond', serif; font-weight: 300; letter-spacing: .08em; transition: color .25s; }
        .mobile-nav-btn:hover { color: #f472b6 !important; }

        /* Skills */
        .skill-pill { transition: border-color .25s, color .25s, box-shadow .25s; }
        .skill-pill:hover { border-color: #f472b6 !important; color: #f472b6 !important; box-shadow: 0 0 12px rgba(244, 114, 182, 0.15); }

        /* Edu cards */
        .edu-card { transition: border-color .25s, transform .25s, box-shadow .25s; position: relative; overflow: hidden; }
        .edu-card::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #ec4899, #f9a8d4); transform: scaleX(0); transform-origin: left; transition: transform .35s ease; }
        .edu-card:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(236, 72, 153, .12); }
        .edu-card:hover::after { transform: scaleX(1); }

        /* Work cards */
        .work-card { transition: border-color .25s, transform .25s, box-shadow .25s; position: relative; overflow: hidden; }
        .work-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #ec4899, #f9a8d4); transform: scaleX(0); transform-origin: left; transition: transform .35s ease; }
        .work-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(236, 72, 153, .15); }
        .work-card:hover::before { transform: scaleX(1); }

        /* Photos */
        .photo-card { aspect-ratio: 1/1; overflow: hidden; border-radius: 4px; cursor: pointer; transition: transform .3s ease, box-shadow .3s ease; }
        .photo-card:hover { transform: scale(1.03); box-shadow: 0 0 30px rgba(244, 114, 182, .25); }
        .photo-card img { width: 100%; height: 100%; object-fit: cover; display: block; }

        /* Lightbox */
        .lightbox { position: fixed; inset: 0; background: rgba(0, 0, 0, .93); z-index: 999; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .lightbox img { max-width: 90vw; max-height: 90vh; border-radius: 4px; }

        /* Timeline */
        .tl-item { position: relative; padding-left: 2.5rem; padding-bottom: 3.5rem; }

        /* Animations */
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 24px rgba(236, 72, 153, .35); } 50% { box-shadow: 0 0 40px rgba(236, 72, 153, .6); } }
        .hero-name { animation: fadeUp .9s .1s ease both; }
        .hero-eye { animation: fadeUp .9s .0s ease both; }
        .hero-tag { animation: fadeUp .9s .2s ease both; }
        .hero-cta { animation: fadeUp .9s .3s ease both; }
        .scroll-hint { animation: fadeUp 1s .6s ease both; }
        .btn-glow { animation: pulseGlow 3s ease-in-out infinite; }

        /* Responsive */
        @media (max-width: 1024px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .photos-grid { grid-template-columns: 1fr 1fr !important; }
          .sec-pad { padding: 5rem 3.5rem !important; }
          .lang-wrap { padding: 4rem 3.5rem !important; }
          .foot-inner { padding: 1.5rem 3.5rem !important; }
        }
        @media (max-width: 768px) {
          .hamburger { display: flex !important; }
          .desktop-links { display: none !important; }
          .desktop-theme { display: none !important; }
          .nav-wrap { padding: 1rem 1.4rem !important; }
          .hero-inner { padding: 2rem 1.4rem 5rem !important; }
          .sec-pad { padding: 4rem 1.4rem !important; }
          .lang-wrap { padding: 3.5rem 1.4rem !important; flex-direction: column !important; align-items: flex-start !important; }
          .foot-inner { padding: 1.4rem !important; flex-direction: column !important; gap: .5rem !important; text-align: center !important; }
          .photos-grid { grid-template-columns: 1fr !important; }
          .edu-grid { grid-template-columns: 1fr !important; }
          .hero-h1 { font-size: clamp(2.8rem, 11vw, 4.5rem) !important; }
          .scroll-hint { left: 1.4rem !important; }
        }
        @media (max-width: 480px) {
          .sec-pad { padding: 3rem 1.1rem !important; }
          .hero-inner { padding: 1.5rem 1.1rem 4rem !important; }
        }
      `}</style>

      {/* Glitter */}
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: isDark ? 0.55 : 0.22 }} />

      {/* Lightbox */}
      {activePhoto && (
        <div className="lightbox" onClick={() => setActivePhoto(null)}>
          <img src={activePhoto} alt="Full size" />
        </div>
      )}

      {/* ── MOBILE MENU ── */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}
        style={{ background: isDark ? "rgba(10,10,10,.97)" : "rgba(253,248,252,.98)" }}>
        <button className="mobile-close" onClick={() => setMenuOpen(false)}
          style={{ color: t.muted }}>✕</button>
        {/* Theme toggle inside mobile menu too */}
        <button className="theme-btn" onClick={() => setIsDark(p => !p)}
          style={{ color: t.muted, borderColor: t.border, marginBottom: "1rem" }}>
          {isDark ? "Light mode" : "Dark mode"}
        </button>
        {navLinks.map(({ id, label }) => (
          <button key={id} className="mobile-nav-btn"
            style={{ color: t.text }}
            onClick={() => scrollTo(id)}>
            {label}
          </button>
        ))}
      </div>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: t.nav, backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${t.border}`
      }}>
        <div className="nav-wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 4rem", maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
          <button onClick={() => scrollTo("hero")} className="serif"
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.4rem", fontWeight: 300, letterSpacing: ".08em", color: "#f472b6", textDecoration: "none" }}>
            T. Adegoke
          </button>
          <ul className="desktop-links" style={{ display: "flex", gap: "2.5rem", listStyle: "none", alignItems: "center" }}>
            {navLinks.map(({ id, label }) => (
              <li key={id}>
                <button className="nav-link" onClick={() => scrollTo(id)}
                  style={{ color: t.muted }}>
                  {label}
                </button>
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button className="theme-btn desktop-theme" onClick={() => setIsDark(p => !p)}
              style={{ color: t.muted, borderColor: t.border }}>
              {isDark ? "☀️" : "🌙"}
            </button>
            <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <span style={{ background: t.muted }} />
              <span style={{ background: t.muted }} />
              <span style={{ background: t.muted }} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden", zIndex: 2, paddingTop: "5rem",
        background: isDark ? "#0a0a0a" : "linear-gradient(160deg,#fdf8fc,#fff0f8)"
      }}>
        <div className="hero-inner" style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "6rem", position: "relative", zIndex: 2, maxWidth: "750px", width: "100%" }}>
          <p className="hero-eye" style={{ fontSize: ".72rem", letterSpacing: ".22em", textTransform: "uppercase", color: "#f472b6", marginBottom: "1.8rem" }}>Executive Assistant</p>
          <h1 className="hero-name hero-h1 serif" style={{ lineHeight: 1.05, color: t.text }}>
            Tolulade<br /><em className="grad-text">Adegoke</em>
          </h1>
          <p className="hero-tag" style={{ marginTop: "2rem", fontSize: "1.05rem", lineHeight: 1.75, color: t.muted, maxWidth: "420px" }}>
            Bridging communication, building connections, and keeping organisations moving — with precision and warmth.
          </p>
          <div className="hero-cta" style={{ marginTop: "3rem", display: "flex", gap: "1.2rem", alignItems: "center", flexWrap: "wrap" }}>
            <button onClick={() => scrollTo("contact")} className="btn-glow"
              style={{ background: "linear-gradient(135deg,#ec4899,#db2777)", color: "#fff", padding: ".85rem 2.2rem", borderRadius: "2px", fontSize: ".78rem", letterSpacing: ".14em", textTransform: "uppercase", border: "none", cursor: "pointer" }}>
              Get in Touch
            </button>
            <button onClick={() => scrollTo("experience")}
              style={{ fontSize: ".78rem", letterSpacing: ".14em", textTransform: "uppercase", color: t.muted, background: "none", border: "none", borderBottom: `1px solid ${t.border}`, paddingBottom: "2px", cursor: "pointer" }}>
              View Experience
            </button>
          </div>
          <div className="scroll-hint" style={{ position: "absolute", bottom: "2.5rem", left: "6rem", display: "flex", alignItems: "center", gap: ".8rem", fontSize: ".72rem", letterSpacing: ".14em", textTransform: "uppercase", color: t.faint }}>
            <span style={{ width: "40px", height: "1px", background: "#f472b6", display: "inline-block" }} />
            Scroll to explore
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="sec-pad" style={{ padding: "7rem 6rem", background: t.bg }}>
        <p className="reveal" style={{ fontSize: ".7rem", letterSpacing: ".22em", textTransform: "uppercase", color: "#f472b6", marginBottom: "1rem" }}>Who I Am</p>
        <h2 className="reveal serif" style={{ color: t.text }}>
          Organised. Adaptable.<br /><em className="grad-text">People-first.</em>
        </h2>
        <div className="reveal" style={{ width: "48px", height: "1px", background: "linear-gradient(90deg,#ec4899,transparent)", margin: "2rem 0" }} />
        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "start", marginTop: "3.5rem" }}>
          <div className="reveal">
            {[
              "I'm a highly organised and versatile professional with a strong background in executive administration, client relations, and digital content management. I actively use AI tools to streamline workflows, enhance productivity, and deliver smarter results faster.",
              "My experience spans education, healthcare, and creative fields, making me a versatile asset to any team. I thrive in fast-paced environments where detail, discretion, and warm communication matter most.",
              "Currently pursuing a BSc. in Nursing at Western Balkans University, I bring both professional polish and genuine curiosity to everything I do."
            ].map((para, i) => (
              <p key={i} style={{ fontSize: "1rem", lineHeight: 1.85, color: t.muted, marginBottom: "1.2rem" }}>
                {para}
              </p>
            ))}
          </div>
          <div className="reveal">
            <p className="serif" style={{ fontSize: "1.5rem", fontWeight: 400, marginBottom: "1.5rem", color: t.text }}>Core Skills</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".9rem" }}>
              {[
                "Team Coordination", "Team Leading", "Client Relations", "Calendar Management",
                "AI-Powered Workflows", "CRM & Databases", "Public Speaking", "Content Creation",
                "Video Editing", "Conflict Resolution"
              ].map(skill => (
                <div key={skill} className="skill-pill" style={{ padding: ".65rem 1.1rem", border: `1px solid ${t.border}`, borderRadius: "2px", fontSize: ".8rem", color: t.muted, background: t.card }}>
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="sec-pad" style={{ padding: "7rem 6rem", background: t.bg2 }}>
        <p className="reveal" style={{ fontSize: ".7rem", letterSpacing: ".22em", textTransform: "uppercase", color: "#f472b6", marginBottom: "1rem" }}>Career Journey</p>
        <h2 className="reveal serif" style={{ color: t.text }}>
          Where I've<br /><em className="grad-text">Made an Impact</em>
        </h2>
        <div className="reveal" style={{ width: "48px", height: "1px", background: "linear-gradient(90deg,#ec4899,transparent)", margin: "2rem 0" }} />
        <div style={{ marginTop: "3.5rem", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "1px", background: "linear-gradient(to bottom,#ec4899,transparent)" }} />
          {experienceData.map(({ period, role, bullets }) => (
            <div key={role} className="reveal tl-item" style={{ paddingLeft: "2.5rem", paddingBottom: "3.5rem" }}>
              <div style={{ position: "absolute", left: "-4px", top: "6px", width: "9px", height: "9px", borderRadius: "50%", background: "#f472b6", border: `2px solid ${t.tldot}`, boxSizing: "border-box" }} />
              <p style={{ fontSize: ".72rem", letterSpacing: ".14em", textTransform: "uppercase", color: "#f472b6", marginBottom: ".6rem" }}>{period}</p>
              <p className="serif" style={{ fontSize: "1.5rem", fontWeight: 400, color: t.text, marginBottom: ".25rem" }}>{role}</p>
              <p style={{ fontSize: ".82rem", letterSpacing: ".08em", textTransform: "uppercase", color: t.faint, marginBottom: "1.2rem" }}>WhiteRock Educational Services</p>
              <ul style={{ listStyle: "none" }}>
                {bullets.map(b => (
                  <li key={b} style={{ fontSize: ".92rem", lineHeight: 1.75, color: t.muted, paddingLeft: "1.2rem", position: "relative", marginBottom: ".4rem" }}>
                    <span style={{ position: "absolute", left: 0, color: "#f472b6", fontSize: ".8rem" }}>—</span>{b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section id="education" className="sec-pad" style={{ padding: "7rem 6rem", background: t.bg }}>
        <p className="reveal" style={{ fontSize: ".7rem", letterSpacing: ".22em", textTransform: "uppercase", color: "#f472b6", marginBottom: "1rem" }}>Academic Background</p>
        <h2 className="reveal serif" style={{ color: t.text }}>
          Learning &amp;<br /><em className="grad-text">Growing</em>
        </h2>
        <div className="reveal" style={{ width: "48px", height: "1px", background: "linear-gradient(90deg,#ec4899,transparent)", margin: "2rem 0" }} />
        <div className="edu-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "2rem", marginTop: "3.5rem" }}>
          {[
            { school: "Western Balkans University", degree: "BSc. in Nursing", year: "2025 – Ongoing" },
            { school: "Online Business School", degree: "Level 5 Diploma — Health & Social Care", year: "2024 – Ongoing" },
            { school: "Yaba College of Technology", degree: "OND — Mass Communication", year: "2022 – 2024" },
            { school: "Bammy College", degree: "O'Level", year: "2020" },
          ].map(({ school, degree, year }) => (
            <div key={school} className="reveal edu-card" style={{ padding: "2rem", border: `1px solid ${t.border}`, background: t.card, borderRadius: "2px" }}>
              <p className="edu-school" style={{ fontSize: ".82rem", letterSpacing: ".08em", textTransform: "uppercase", color: "#f472b6", marginBottom: ".3rem" }}>{school}</p>
              <h3 className="serif edu-degree" style={{ margin: 0 }}>{degree}</h3>
              <p className="edu-year" style={{ marginTop: "0.4rem", fontSize: ".78rem", color: t.faint }}>{year}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WORK SAMPLES ── */}
      <section id="work" className="sec-pad" style={{ padding: "7rem 6rem", background: t.bg }}>
        <p className="reveal" style={{ fontSize: ".7rem", letterSpacing: ".22em", textTransform: "uppercase", color: "#f472b6", marginBottom: "1rem" }}>Speaks for Itself</p>
        <h2 className="reveal serif" style={{ color: t.text }}>
          The Work<br /><em className="grad-text">Speaks for Itself</em>
        </h2>
        <div className="reveal" style={{ width: "48px", height: "1px", background: "linear-gradient(90deg,#ec4899,transparent)", margin: "2rem 0" }} />
        <div className="reveal" style={{ background: t.card, border: `1px solid ${t.border}`, padding: "20px", borderRadius: "8px", marginBottom: "32px" }}>
          <p style={{ fontSize: ".78rem", lineHeight: 1.75, color: t.muted }}>
            <span style={{ color: "#f472b6", fontWeight: 500 }}>Confidentiality Notice — </span>
            All documents below are mock samples created for portfolio purposes only. Names, details and data have been anonymized or modified to protect operational privacy.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: "24px" }}>
          {workSamples.map(({ tag, title, desc, link }) => (
            <div key={title} className="reveal work-card" style={{ background: t.card, border: `1px solid ${t.border}`, padding: "24px", borderRadius: "12px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "280px" }}>
              <div>
                <span style={{ backgroundColor: isDark ? "rgba(236,72,153,0.1)" : "rgba(236,72,153,0.06)", color: "#f472b6", padding: "4px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "bold" }}>{tag}</span>
                <h3 className="serif" style={{ fontSize: "1.35rem", marginTop: "12px", marginBottom: "8px", color: t.text }}>{title}</h3>
                <p style={{ fontSize: ".88rem", lineHeight: 1.8, color: t.muted, marginBottom: "1.5rem" }}>{desc}</p>
              </div>
              <a href={link} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: ".78rem", letterSpacing: ".12em", textTransform: "uppercase", color: "#f472b6", textDecoration: "none", fontWeight: "bold" }}>
                View Sample ↗
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── PHOTOS ── */}
      <section id="photos" className="sec-pad" style={{ padding: "7rem 6rem", background: t.bg2 }}>
        <p className="reveal" style={{ fontSize: ".7rem", letterSpacing: ".22em", textTransform: "uppercase", color: "#f472b6", marginBottom: "1rem" }}>In My Spare Time</p>
        <h2 className="reveal serif" style={{ color: t.text }}>
          Chasing <em className="grad-text">Beautiful Moments</em>
        </h2>
        <div className="reveal" style={{ width: "48px", height: "1px", background: "linear-gradient(90deg,#ec4899,transparent)", margin: "2rem 0" }} />
        <p className="reveal" style={{ fontSize: "1rem", lineHeight: 1.85, color: t.muted, maxWidth: "520px", marginBottom: "3rem" }}>
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

      {/* ── LANGUAGES ── */}
      <div className="lang-wrap" style={{ padding: "5rem 6rem", background: t.langbg, position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "3rem", borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}` }}>
        <div>
          <p style={{ fontSize: ".7rem", letterSpacing: ".22em", textTransform: "uppercase", color: "#f472b6", marginBottom: "1rem" }}>Communication</p>
          <h2 className="serif" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 300, color: t.text, margin: 0 }}>
            Speaking the<br /><em className="grad-text">right language</em>
          </h2>
        </div>
        <div style={{ display: "flex", gap: "3rem" }}>
          {[
            { lang: "English", level: "Fluent" },
            { lang: "Albanian", level: "Proficient" }
          ].map(({ lang, level }) => (
            <div key={lang} style={{ textAlign: "center" }}>
              <span className="serif" style={{ fontSize: "2rem", fontWeight: 300, color: t.text, display: "block" }}>{lang}</span>
              <span style={{ fontSize: ".72rem", letterSpacing: ".16em", textTransform: "uppercase", color: "#f472b6" }}>{level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CONTACT ── */}
      <section id="contact" className="sec-pad" style={{ padding: "7rem 6rem", background: t.bg, textAlign: "center" }}>
        <p className="reveal" style={{ fontSize: ".7rem", letterSpacing: ".22em", textTransform: "uppercase", color: "#f472b6", marginBottom: "1rem" }}>Get In Touch</p>
        <h2 className="reveal serif" style={{ color: t.text }}>
          Let's <em className="grad-text">Connect</em>
        </h2>
        <div className="reveal" style={{ width: "48px", height: "1px", background: "linear-gradient(90deg,#ec4899,transparent)", margin: "2rem auto" }} />
        <p className="reveal" style={{ color: t.faint, maxWidth: "440px", margin: "0 auto", lineHeight: 1.8, fontSize: ".95rem" }}>
          Whether you have an opportunity, a question, or just want to say hello — my inbox is open.
        </p>
        <a href="mailto:ladeadegoke16@gmail.com" className="reveal serif grad-text"
          style={{ display: "inline-block", marginTop: "2.5rem", fontSize: "clamp(1.5rem,3vw,2.5rem)", fontWeight: 300, textDecoration: "none", borderBottom: "1px solid #4b1535", paddingBottom: "3px" }}>
          ladeadegoke16@gmail.com
        </a>
        <div className="reveal" style={{ marginTop: "2.5rem", fontSize: ".82rem", letterSpacing: ".1em", color: t.faint, display: "flex", justifyContent: "center", gap: "2.5rem", flexWrap: "wrap" }}>
          <span>📞 +355 68 832 5692</span>
          <span>References available on request</span>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: t.footer, borderTop: `1px solid ${t.border}`, position: "relative", zIndex: 2 }}>
        <div className="foot-inner" style={{ padding: "2rem 6rem", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: ".75rem", letterSpacing: ".1em" }}>
          <div>© 2026 <span style={{ color: "#f472b6" }}>Tolulade Adegoke</span> — Tirana, Albania</div>
          <div style={{ color: isDark ? "#4b5563" : "#9c7a8c" }}>Built with care &amp; intention</div>
        </div>
      </footer>
    </>
  );
}
