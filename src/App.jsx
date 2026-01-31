import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import CLOUDS from 'vanta/dist/vanta.clouds.min';
import Particles from './Particles';
import { projects, skills, tools } from './data/projects';
import './App.css';

// Custom Star Cursor with Stardust Trail - Dreamy Pastel Theme
const StarCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if ('ontouchstart' in window) return;

    const handleMouseMove = (e) => {
      const newPos = { x: e.clientX, y: e.clientY, id: Date.now() };
      setMousePosition(newPos);
      setIsVisible(true);

      setTrail(prev => {
        const updated = [...prev, { ...newPos, opacity: 1, scale: 1 }];
        return updated.slice(-20);
      });
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  // Fade out trail particles
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail(prev =>
        prev
          .map(p => ({ ...p, opacity: p.opacity - 0.08, scale: p.scale - 0.05 }))
          .filter(p => p.opacity > 0)
      );
    }, 30);
    return () => clearInterval(interval);
  }, []);

  if ('ontouchstart' in window || !isVisible) return null;

  return (
    <div className="star-cursor-container">
      {/* Stardust Trail */}
      {trail.map((particle, i) => (
        <div
          key={particle.id + i}
          className="stardust-particle"
          style={{
            left: particle.x,
            top: particle.y,
            opacity: particle.opacity,
            transform: `translate(-50%, -50%) scale(${particle.scale})`,
          }}
        >
          ✦
        </div>
      ))}

      {/* Main Star Cursor */}
      <motion.div
        className="star-cursor"
        animate={{
          x: mousePosition.x - 15,
          y: mousePosition.y - 15,
          rotate: [0, 15, -15, 0],
        }}
        transition={{
          x: { type: 'spring', stiffness: 500, damping: 28 },
          y: { type: 'spring', stiffness: 500, damping: 28 },
          rotate: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
        }}
      >
        <svg viewBox="0 0 24 24" width="30" height="30">
          <defs>
            <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFB6D9" />
              <stop offset="50%" stopColor="#FFC4E1" />
              <stop offset="100%" stopColor="#E8B4D9" />
            </linearGradient>
          </defs>
          <path
            d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z"
            fill="url(#starGradient)"
            stroke="#ffffff"
            strokeWidth="0.8"
          />
        </svg>
        <div className="cursor-sparkles">
          {[...Array(4)].map((_, i) => (
            <motion.span
              key={i}
              className="sparkle"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.25,
              }}
              style={{
                top: `${['-10px', '50%', '110%', '50%'][i]}`,
                left: `${['50%', '110%', '50%', '-10px'][i]}`,
              }}
            >
              ✧
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Helper function to interpolate between two hex colors
const lerpColor = (color1, color2, t) => {
  const r1 = (color1 >> 16) & 0xff;
  const g1 = (color1 >> 8) & 0xff;
  const b1 = color1 & 0xff;

  const r2 = (color2 >> 16) & 0xff;
  const g2 = (color2 >> 8) & 0xff;
  const b2 = color2 & 0xff;

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  return (r << 16) | (g << 8) | b;
};

// Sunrise and Sunset color configurations
const sunriseColors = {
  backgroundColor: 0x89f0d1,
  skyColor: 0x0dbff7,
  cloudColor: 0xdbadde,
  cloudShadowColor: 0x631f82,
  sunColor: 0xff9919,
  sunGlareColor: 0xffb632,
  sunlightColor: 0xfff231,
};

const sunsetColors = {
  backgroundColor: 0x89f0d1,
  skyColor: 0x0a13aa,
  cloudColor: 0xcd78d7,
  cloudShadowColor: 0x2e24f2,
  sunColor: 0xffffff,
  sunGlareColor: 0xfcfcfc,
  sunlightColor: 0xfcfcfc,
};

function App() {
  const containerRef = useRef(null);
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [particlesOpacity, setParticlesOpacity] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const [selectedProject, setSelectedProject] = useState(null);

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Parallax values
  const y1 = useTransform(smoothProgress, [0, 1], [0, -500]);

  // Initialize Vanta clouds effect with sunrise colors
  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      setVantaEffect(
        CLOUDS({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          speed: 1.0,
          ...sunriseColors,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  // Update Vanta colors and particles opacity based on scroll position
  useEffect(() => {
    if (!vantaEffect) return;

    const unsubscribe = scrollYProgress.on('change', (progress) => {
      // Smooth transition from sunrise (0) to sunset (1)
      const t = progress;

      vantaEffect.setOptions({
        backgroundColor: lerpColor(sunriseColors.backgroundColor, sunsetColors.backgroundColor, t),
        skyColor: lerpColor(sunriseColors.skyColor, sunsetColors.skyColor, t),
        cloudColor: lerpColor(sunriseColors.cloudColor, sunsetColors.cloudColor, t),
        cloudShadowColor: lerpColor(sunriseColors.cloudShadowColor, sunsetColors.cloudShadowColor, t),
        sunColor: lerpColor(sunriseColors.sunColor, sunsetColors.sunColor, t),
        sunGlareColor: lerpColor(sunriseColors.sunGlareColor, sunsetColors.sunGlareColor, t),
        sunlightColor: lerpColor(sunriseColors.sunlightColor, sunsetColors.sunlightColor, t),
      });

      // Fade in particles after 50% scroll (sunset mode)
      const particlesFade = Math.max(0, (progress - 0.5) * 2);
      setParticlesOpacity(particlesFade);
    });

    return () => unsubscribe();
  }, [vantaEffect, scrollYProgress]);

  return (
    <div className="app" ref={containerRef}>
      {/* Star Cursor */}
      <StarCursor />

      {/* Vanta Clouds Background */}
      <div ref={vantaRef} className="vanta-clouds-background" />

      {/* Sunset Stars Particles - only visible in sunset mode, positioned in sky area */}
      <div
        className="particles-container"
        style={{ opacity: particlesOpacity }}
      >
        <Particles
          particleColors={["#f28fff", "#ffffff", "#c9a0ff"]}
          particleCount={800}
          particleSpread={18}
          speed={0.3}
          particleBaseSize={150}
          moveParticlesOnHover
          alphaParticles
          disableRotation={false}
        />
      </div>

      {/* Progress Bar */}
      <motion.div
        className="progress-bar"
        style={{ scaleX: smoothProgress }}
      />

      {/* Floating Navigation */}
      <motion.nav
        className={`floating-nav ${menuOpen ? 'menu-open' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: 'spring' }}
      >
        <motion.span
          className="nav-logo"
          whileHover={{ scale: 1.08 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          meshmeadow
        </motion.span>

        {/* Hamburger Button */}
        <button
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <div className={`nav-links ${menuOpen ? 'show' : ''}`}>
          {['Work', 'About', 'Contact'].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="nav-link"
              whileHover={{ scale: 1.1, y: -3 }}
              onClick={() => setMenuOpen(false)}
              style={{
                background: 'linear-gradient(135deg, #F889BC, #F70CB4)',
              }}
            >
              {item}
            </motion.a>
          ))}
        </div>
      </motion.nav>

      {/* Main Content - Continuous Scroll */}
      <div className="scroll-content">

        {/* Hero Area */}
        <motion.div
          className="hero-area"
          style={{ y: y1 }}
        >
          <motion.h1
            className="hero-title bounce-text"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="text-stars">
              {[...Array(4)].map((_, i) => (
                <span key={i} className="text-star">·</span>
              ))}
            </div>
            {'making things move'.split('').map((letter, i) => (
              <span
                key={i}
                className="bounce-letter"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Crafting Lottie animations & marketing videos that make brands unforgettable
          </motion.p>

          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <motion.button
              className="cta-button primary"
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 107, 157, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              <span>See My Work</span>
              <span className="button-emoji">🚀</span>
            </motion.button>
            <motion.button
              className="cta-button secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Say Hello</span>
              <span className="button-emoji">👋</span>
            </motion.button>
          </motion.div>

          <motion.div
            className="scroll-hint"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span>Scroll to explore</span>
            <span className="scroll-arrow">↓</span>
          </motion.div>
        </motion.div>

        {/* Work Section - Flowing Cards */}
        <div className="work-area" id="work">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-emoji">🎨</span>
            <h2 className="section-title">Creative Work</h2>
            <p className="section-desc">A collection of motion magic</p>
          </motion.div>

          <div className="projects-flow">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className={`project-card card-${index % 3}`}
                initial={{ opacity: 0, y: 100, rotate: index % 2 === 0 ? -5 : 5 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.03,
                  rotate: index % 2 === 0 ? 2 : -2,
                  boxShadow: '0 30px 60px rgba(0,0,0,0.2)',
                }}
                onClick={() => setSelectedProject(project)}
                style={{
                  marginLeft: index % 2 === 0 ? '5%' : '15%',
                  marginRight: index % 2 === 0 ? '15%' : '5%',
                }}
              >
                <div className="card-image">
                  <img src={project.thumbnail} alt={project.title} />
                  <div className="card-overlay">
                    <span className="view-text">View Project ✨</span>
                  </div>
                  <span className="card-category">
                    {project.category === 'lottie' ? '🎭 Lottie' : '🎬 Video'}
                  </span>
                </div>
                <div className="card-content">
                  <h3>{project.title}</h3>
                  <p>{project.client} • {project.year}</p>
                  <div className="card-tags">
                    {project.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Colorful Stats Banner */}
        <motion.div
          className="stats-banner"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {[
            { number: '50+', label: 'Projects', emoji: '🎨', color: '#FF6B9D' },
            { number: '30+', label: 'Happy Clients', emoji: '😊', color: '#A855F7' },
            { number: '5+', label: 'Years Experience', emoji: '⭐', color: '#3B82F6' },
            { number: '∞', label: 'Creativity', emoji: '✨', color: '#10B981' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="stat-item"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring' }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              style={{ background: `linear-gradient(135deg, ${stat.color}22, ${stat.color}44)` }}
            >
              <span className="stat-emoji">{stat.emoji}</span>
              <span className="stat-number" style={{ color: stat.color }}>{stat.number}</span>
              <span className="stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* About Area */}
        <div className="about-area" id="about">
          <motion.div
            className="about-card"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="about-image">
              <motion.div
                className="avatar-circle"
                animate={{
                  background: [
                    'linear-gradient(135deg, #FF6B9D, #A855F7)',
                    'linear-gradient(135deg, #A855F7, #3B82F6)',
                    'linear-gradient(135deg, #3B82F6, #10B981)',
                    'linear-gradient(135deg, #10B981, #FBBF24)',
                    'linear-gradient(135deg, #FBBF24, #FF6B9D)',
                  ]
                }}
                transition={{ duration: 10, repeat: Infinity }}
              >
                <span>👨‍🎨</span>
              </motion.div>
              <div className="avatar-decoration">
                {['🎨', '✨', '🎬', '💫'].map((emoji, i) => (
                  <motion.span
                    key={i}
                    className="deco-emoji"
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                    style={{
                      position: 'absolute',
                      top: `${20 + (i * 20)}%`,
                      left: i % 2 === 0 ? '-20px' : 'auto',
                      right: i % 2 === 0 ? 'auto' : '-20px',
                    }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </div>
            </div>
            <div className="about-text">
              <h2>Hey there! 👋</h2>
              <p className="highlight">
                I'm a motion designer who believes animations should spark joy and tell stories.
              </p>
              <p>
                With 5+ years of experience, I specialize in creating Lottie animations
                that make apps feel alive and marketing videos that capture hearts.
              </p>
              <p>
                When I'm not animating, you'll find me chasing sunsets,
                experimenting with new tools, or teaching motion design workshops.
              </p>
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            className="skills-cloud"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3>🛠️ My Toolkit</h3>
            <div className="skills-bubbles">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  className="skill-bubble"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: 'spring' }}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  style={{
                    background: `linear-gradient(135deg, ${
                      ['#FF6B9D', '#A855F7', '#3B82F6', '#10B981', '#FBBF24', '#F97316'][i]
                    }, ${
                      ['#FF9F43', '#3B82F6', '#10B981', '#FBBF24', '#F97316', '#FF6B9D'][i]
                    })`,
                    width: `${60 + (skill.level * 0.5)}px`,
                    height: `${60 + (skill.level * 0.5)}px`,
                  }}
                >
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-level">{skill.level}%</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tools */}
          <motion.div
            className="tools-row"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {tools.map((tool, i) => (
              <motion.span
                key={tool}
                className="tool-pill"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                {tool}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Contact Area */}
        <div className="contact-area" id="contact">
          <motion.div
            className="contact-card"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="contact-header">
              <motion.span
                className="contact-emoji"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💌
              </motion.span>
              <h2>Let's Create Magic Together!</h2>
              <p>Got a project in mind? I'd love to hear about it.</p>
            </div>

            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-row">
                <motion.input
                  type="text"
                  placeholder="Your Name ✨"
                  whileFocus={{ scale: 1.02, boxShadow: '0 10px 30px rgba(168, 85, 247, 0.3)' }}
                />
                <motion.input
                  type="email"
                  placeholder="Your Email 📧"
                  whileFocus={{ scale: 1.02, boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)' }}
                />
              </div>
              <motion.textarea
                placeholder="Tell me about your project... 🎨"
                rows="5"
                whileFocus={{ scale: 1.02, boxShadow: '0 10px 30px rgba(255, 107, 157, 0.3)' }}
              />
              <motion.button
                type="submit"
                className="submit-button"
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 107, 157, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Send Message</span>
                <span className="button-icon">🚀</span>
              </motion.button>
            </form>

            <div className="social-links">
              {[
                { name: 'Dribbble', emoji: '🏀', color: '#EA4C89' },
                { name: 'Behance', emoji: '🎨', color: '#1769FF' },
                { name: 'LinkedIn', emoji: '💼', color: '#0A66C2' },
                { name: 'Twitter', emoji: '🐦', color: '#1DA1F2' },
              ].map((social, i) => (
                <motion.a
                  key={social.name}
                  href="#"
                  className="social-link"
                  whileHover={{ scale: 1.1, y: -5 }}
                  style={{ background: `${social.color}22`, borderColor: social.color }}
                >
                  <span>{social.emoji}</span>
                  <span>{social.name}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p>Made with 💖 and lots of ☕</p>
            <p className="footer-copyright">© 2026 Motion Designer</p>
          </motion.div>
        </footer>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 100 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelectedProject(null)}>✕</button>
              <img src={selectedProject.thumbnail} alt={selectedProject.title} />
              <div className="modal-info">
                <h3>{selectedProject.title}</h3>
                <p className="modal-meta">{selectedProject.client} • {selectedProject.year}</p>
                <p>{selectedProject.description}</p>
                <div className="modal-tags">
                  {selectedProject.tags.map(tag => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
