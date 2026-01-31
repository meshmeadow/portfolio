import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { projects, skills, tools } from './data/projects';
import './App.css';

// Custom Star Cursor with Stardust Trail
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
              <stop offset="0%" stopColor="#FF6B9D" />
              <stop offset="50%" stopColor="#FF8EC7" />
              <stop offset="100%" stopColor="#FFB6D9" />
            </linearGradient>
            <filter id="starGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path
            d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z"
            fill="url(#starGradient)"
            filter="url(#starGlow)"
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

// 3D Disney/Pixar Style Clouds
const Clouds3D = () => {
  const { scrollYProgress } = useScroll();

  // Generate random cloud configurations
  const cloudConfigs = [
    { id: 1, x: '5%', y: '8%', scale: 1.2, speed: 0.3, rotation: -5 },
    { id: 2, x: '25%', y: '15%', scale: 0.8, speed: 0.5, rotation: 3 },
    { id: 3, x: '60%', y: '5%', scale: 1.4, speed: 0.2, rotation: -2 },
    { id: 4, x: '80%', y: '20%', scale: 0.9, speed: 0.4, rotation: 5 },
    { id: 5, x: '15%', y: '35%', scale: 1.1, speed: 0.35, rotation: -3 },
    { id: 6, x: '45%', y: '25%', scale: 1.3, speed: 0.25, rotation: 2 },
    { id: 7, x: '70%', y: '40%', scale: 0.7, speed: 0.45, rotation: -4 },
    { id: 8, x: '90%', y: '10%', scale: 1.0, speed: 0.3, rotation: 1 },
    { id: 9, x: '35%', y: '45%', scale: 0.85, speed: 0.4, rotation: -1 },
    { id: 10, x: '55%', y: '50%', scale: 0.75, speed: 0.5, rotation: 4 },
  ];

  return (
    <div className="clouds-3d-container">
      {cloudConfigs.map((config) => {
        const yOffset = useTransform(scrollYProgress, [0, 1], [0, 100 * config.speed]);

        return (
          <motion.div
            key={config.id}
            className="cloud-3d"
            style={{
              left: config.x,
              top: config.y,
              scale: config.scale,
              y: yOffset,
              rotate: config.rotation,
            }}
          >
            <div className="cloud-3d-body">
              <div className="cloud-puff cloud-puff-1"></div>
              <div className="cloud-puff cloud-puff-2"></div>
              <div className="cloud-puff cloud-puff-3"></div>
              <div className="cloud-puff cloud-puff-4"></div>
              <div className="cloud-puff cloud-puff-5"></div>
              <div className="cloud-base"></div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// 3D Aesthetic Sun
const Sun3D = () => {
  const { scrollYProgress } = useScroll();
  const sunY = useTransform(scrollYProgress, [0, 0.5, 1], ['5vh', '30vh', '60vh']);
  const sunScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1.2, 1.5]);

  // Sun color transitions from bright yellow (sunrise) to orange/red (sunset)
  const sunColor1 = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    ['#FFE873', '#FFD700', '#FF8C42', '#FF6B35']
  );
  const sunColor2 = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    ['#FFF9C4', '#FFEB3B', '#FF7043', '#FF5722']
  );
  const glowColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['rgba(255, 236, 179, 0.6)', 'rgba(255, 183, 77, 0.5)', 'rgba(255, 87, 34, 0.4)']
  );

  return (
    <motion.div
      className="sun-3d"
      style={{ y: sunY, scale: sunScale }}
    >
      <motion.div
        className="sun-glow-outer"
        style={{ background: glowColor }}
      />
      <motion.div className="sun-glow-middle" />
      <motion.div className="sun-body">
        <div className="sun-surface">
          <div className="sun-highlight"></div>
          <div className="sun-highlight-2"></div>
        </div>
      </motion.div>

      {/* Sun rays */}
      <div className="sun-rays-container">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="sun-ray-3d"
            style={{ transform: `rotate(${i * 30}deg)` }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </div>
    </motion.div>
  );
};

// Stars for sunset/night sky
const Stars = () => {
  const { scrollYProgress } = useScroll();
  const starsOpacity = useTransform(scrollYProgress, [0.5, 0.7, 1], [0, 0.5, 1]);

  const starPositions = [
    { x: '10%', y: '15%', size: 2, delay: 0 },
    { x: '20%', y: '8%', size: 3, delay: 0.5 },
    { x: '35%', y: '20%', size: 2, delay: 1 },
    { x: '45%', y: '5%', size: 4, delay: 0.3 },
    { x: '55%', y: '18%', size: 2, delay: 0.8 },
    { x: '65%', y: '10%', size: 3, delay: 0.2 },
    { x: '75%', y: '22%', size: 2, delay: 0.6 },
    { x: '85%', y: '12%', size: 3, delay: 0.4 },
    { x: '92%', y: '25%', size: 2, delay: 0.9 },
    { x: '8%', y: '30%', size: 2, delay: 1.1 },
    { x: '28%', y: '35%', size: 3, delay: 0.7 },
    { x: '50%', y: '28%', size: 4, delay: 0.1 },
    { x: '72%', y: '32%', size: 2, delay: 1.2 },
    { x: '88%', y: '38%', size: 3, delay: 0.5 },
    { x: '15%', y: '45%', size: 2, delay: 0.9 },
    { x: '40%', y: '42%', size: 3, delay: 0.3 },
    { x: '60%', y: '48%', size: 2, delay: 0.7 },
    { x: '82%', y: '45%', size: 4, delay: 0.2 },
    { x: '5%', y: '55%', size: 2, delay: 1.0 },
    { x: '30%', y: '58%', size: 3, delay: 0.4 },
    { x: '95%', y: '52%', size: 2, delay: 0.6 },
  ];

  return (
    <motion.div className="stars-container" style={{ opacity: starsOpacity }}>
      {starPositions.map((star, i) => (
        <motion.div
          key={i}
          className="star"
          style={{
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2 + Math.random(),
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}
    </motion.div>
  );
};

// Floating elements (reduced, no birds/butterflies)
const FloatingElements = () => {
  const elements = ['🎨', '✨', '🎬', '💫', '🌟'];

  return (
    <div className="floating-elements">
      {elements.map((emoji, i) => (
        <motion.div
          key={i}
          className="floating-element"
          style={{
            left: `${10 + (i * 18)}%`,
            top: `${20 + (i * 12)}%`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + (i * 0.5),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
};

function App() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const [selectedProject, setSelectedProject] = useState(null);

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Parallax values
  const y1 = useTransform(smoothProgress, [0, 1], [0, -500]);

  return (
    <div className="app" ref={containerRef}>
      {/* Star Cursor */}
      <StarCursor />

      {/* Dynamic Sky Background */}
      <motion.div
        className="sky-background"
        style={{
          background: useTransform(
            scrollYProgress,
            [0, 0.3, 0.6, 1],
            [
              'linear-gradient(180deg, #87CEEB 0%, #B0E2FF 30%, #E0F4FF 60%, #FFF8E7 100%)',
              'linear-gradient(180deg, #7EC8E3 0%, #98D1F5 30%, #FFE4B5 60%, #FFDAB9 100%)',
              'linear-gradient(180deg, #FF9A56 0%, #FF7F50 30%, #FF6347 60%, #DC143C 100%)',
              'linear-gradient(180deg, #2C1654 0%, #4A1942 30%, #6B2D5C 50%, #1a1a2e 100%)'
            ]
          )
        }}
      >
        <Sun3D />
        <Clouds3D />
        <Stars />
        <FloatingElements />
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        className="progress-bar"
        style={{ scaleX: smoothProgress }}
      />

      {/* Floating Navigation */}
      <motion.nav
        className="floating-nav"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: 'spring' }}
      >
        <motion.span
          className="nav-logo"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          ✨ motion.
        </motion.span>
        <div className="nav-links">
          {['Work', 'About', 'Contact'].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="nav-link"
              whileHover={{ scale: 1.1, y: -3 }}
              style={{
                background: `linear-gradient(135deg, ${['#FF6B9D', '#A855F7', '#3B82F6'][i]}, ${['#FF9F43', '#3B82F6', '#10B981'][i]})`,
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
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            🎬 Motion Designer & Animator
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span className="title-line">Bringing</span>
            <span className="title-line gradient-text">Ideas to Life</span>
            <span className="title-line">Through Motion</span>
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

        {/* Decorative Divider */}
        <div className="wave-divider">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,60 C300,120 600,0 900,60 C1050,90 1150,30 1200,60 L1200,120 L0,120 Z" fill="rgba(255,255,255,0.3)" />
            <path d="M0,80 C300,140 600,20 900,80 C1050,110 1150,50 1200,80 L1200,120 L0,120 Z" fill="rgba(255,255,255,0.5)" />
          </svg>
        </div>

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
            <p className="footer-copyright">© 2024 Motion Designer</p>
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
