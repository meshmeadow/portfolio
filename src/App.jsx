import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import CLOUDS from 'vanta/dist/vanta.clouds.min';
import Particles from './Particles';
import SwiperCardsSlider from './components/SwiperCardsSlider/SwiperCardsSlider';
import { projects, featuredProject, skills, tools } from './data/projects';
import './App.css';

// Context-aware Arrowhead Cursor - Dreamy Pastel Theme
const CustomCursor = ({ isLoading = false }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [cursorState, setCursorState] = useState('default'); // default, clickable, text, grab, grabbing, loading

  // Detect what element is under the cursor
  const detectCursorState = (e) => {
    const target = e.target;
    const clickable = target.closest('button, a, [role="button"], .project-grid-card, .swiper-slide, .nav-link, .social-link, .skill-bubble, .stat-item, .tool-pill');
    const textInput = target.closest('input, textarea');
    const draggable = target.closest('.swiper-coverflow');

    if (textInput) return 'text';
    if (draggable && e.buttons === 1) return 'grabbing';
    if (draggable) return 'grab';
    if (clickable) return 'clickable';
    return 'default';
  };

  useEffect(() => {
    if ('ontouchstart' in window) return;

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      setCursorState(detectCursorState(e));
    };

    const handleMouseDown = (e) => {
      if (e.target.closest('.swiper-coverflow')) {
        setCursorState('grabbing');
      }
    };

    const handleMouseUp = () => {
      setCursorState(prev => prev === 'grabbing' ? 'grab' : prev);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  // Override with loading state from props
  const activeState = isLoading ? 'loading' : cursorState;

  if ('ontouchstart' in window || !isVisible) return null;

  // Cursor variants for different states
  const cursorVariants = {
    default: { scale: 1 },
    clickable: { scale: 1.2 },
    text: { scale: 1, scaleX: 0.5 },
    grab: { scale: 1.1 },
    grabbing: { scale: 0.9 },
    loading: { scale: 1 },
  };

  // Single consistent pink color for all states
  const colors = { primary: '#FF6B9D', secondary: '#D63384', glow: 'rgba(255, 107, 157, 0.5)' };

  return (
    <div className="custom-cursor-container">
      {/* Cursor glow/aura */}
      <motion.div
        className="cursor-aura"
        animate={{
          x: mousePosition.x - 30,
          y: mousePosition.y - 30,
          scale: activeState === 'clickable' ? 1.5 : activeState === 'loading' ? [1, 1.3, 1] : 1,
          opacity: activeState === 'clickable' ? 0.6 : 0.3,
        }}
        transition={{
          x: { type: 'spring', stiffness: 150, damping: 15 },
          y: { type: 'spring', stiffness: 150, damping: 15 },
          scale: activeState === 'loading'
            ? { duration: 1, repeat: Infinity, ease: 'easeInOut' }
            : { type: 'spring', stiffness: 300, damping: 20 },
        }}
        style={{ background: colors.glow }}
      />

      {/* Main Chunky Arrow Cursor */}
      <motion.div
        className={`custom-cursor cursor-${activeState}`}
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          ...cursorVariants[activeState],
          rotate: activeState === 'loading' ? 360 : 0,
        }}
        transition={{
          x: { type: 'spring', stiffness: 500, damping: 28 },
          y: { type: 'spring', stiffness: 500, damping: 28 },
          scale: { type: 'spring', stiffness: 400, damping: 25 },
          rotate: activeState === 'loading'
            ? { duration: 1.5, repeat: Infinity, ease: 'linear' }
            : { type: 'spring', stiffness: 300, damping: 20 },
        }}
      >
        <svg width="56" height="64" viewBox="0 0 28 32" fill="none">
          <defs>
            <linearGradient id={`arrowGradient-${activeState}`} x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor={colors.primary} />
              <stop offset="40%" stopColor={colors.primary} />
              <stop offset="100%" stopColor={colors.secondary} />
            </linearGradient>
          </defs>
          {/* Main arrow body */}
          <path
            d="M3 4L3 23L8 18L12 27L16 25L11 17L20 17L3 4Z"
            fill={`url(#arrowGradient-${activeState})`}
            stroke="#1a1a2e"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Light edge highlight (top-left) */}
          <path
            d="M4 6L4 20"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Shine highlights */}
          <path
            d="M6 10L6 15"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle
            cx="8"
            cy="17"
            r="1.5"
            fill="rgba(255,255,255,0.6)"
          />
        </svg>

        {/* Loading dots */}
        {activeState === 'loading' && (
          <div className="cursor-loading-dots">
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Text cursor beam */}
      {activeState === 'text' && (
        <motion.div
          className="cursor-text-beam"
          initial={{ scaleY: 0 }}
          animate={{
            x: mousePosition.x - 1,
            y: mousePosition.y - 10,
            scaleY: 1,
            opacity: [1, 0.5, 1],
          }}
          transition={{
            x: { type: 'spring', stiffness: 500, damping: 28 },
            y: { type: 'spring', stiffness: 500, damping: 28 },
            opacity: { duration: 0.8, repeat: Infinity },
          }}
        />
      )}
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
  const [checkerOpacity, setCheckerOpacity] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const [selectedProject, setSelectedProject] = useState(null);
  const [isTextAnimating, setIsTextAnimating] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Cycling words for the hero
  const cyclingWords = [
    'thoughtfully',
    'obsessively',
    "'cause why not",
    'sipping my iced coffee?',
  ];

  // Modal expansion state
  const [cardRect, setCardRect] = useState(null);

  // Form submission states
  const [formState, setFormState] = useState('idle'); // idle, sending, success, error
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // Active section tracking for nav
  const [activeSection, setActiveSection] = useState('');
  const sectionRefs = useRef({});

  // Handle hero text hover - complete animation even if cursor leaves
  const handleTextHover = () => {
    if (!isTextAnimating) {
      setIsTextAnimating(true);
      // Animation duration: 0.8s base + (18 letters * 0.05s delay) = ~1.7s total
      setTimeout(() => setIsTextAnimating(false), 1700);
    }
  };

  // Handle project card click - open modal
  const handleProjectClick = (project) => {
    // Center position for modal expansion
    setCardRect({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      width: 400,
      height: 300,
    });
    setSelectedProject(project);
  };

  // Handle form submission with states
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formState === 'sending') return;

    setFormState('sending');

    // Simulate API call - replace with actual submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setFormState('success');
      // Reset after showing success
      setTimeout(() => {
        setFormState('idle');
        setFormData({ name: '', email: '', message: '' });
      }, 3000);
    } catch (error) {
      setFormState('error');
      setTimeout(() => setFormState('idle'), 3000);
    }
  };

  // Cycle through words
  useEffect(() => {
    const wordInterval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % cyclingWords.length);
    }, 3000); // Change word every 3 seconds

    return () => clearInterval(wordInterval);
  }, []);

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['work', 'about', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            return;
          }
        }
      }
      // If at top, no section is active
      if (window.scrollY < window.innerHeight * 0.5) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Hero zoom IN effect - scroll-based transforms
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 2.5]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12, 0.18], [1, 1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -100]);

  // Smooth spring versions for the hero zoom
  const smoothHeroScale = useSpring(heroScale, { stiffness: 80, damping: 25 });
  const smoothHeroOpacity = useSpring(heroOpacity, { stiffness: 100, damping: 30 });
  const smoothHeroY = useSpring(heroY, { stiffness: 80, damping: 25 });

  // Work section zoom OUT effect - starts zoomed in, scales down to normal
  const workScale = useTransform(scrollYProgress, [0.12, 0.25], [2.5, 1]);
  const workOpacity = useTransform(scrollYProgress, [0.12, 0.2], [0, 1]);

  // Smooth spring versions for work zoom
  const smoothWorkScale = useSpring(workScale, { stiffness: 80, damping: 25 });
  const smoothWorkOpacity = useSpring(workOpacity, { stiffness: 100, damping: 30 });

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

      // Fade out checker pattern as scroll increases (visible at top, fades toward bottom)
      const checkerFade = Math.max(0, 1 - progress * 2);
      setCheckerOpacity(checkerFade);
    });

    return () => unsubscribe();
  }, [vantaEffect, scrollYProgress]);

  return (
    <div className="app" ref={containerRef}>
      {/* Star Cursor */}
      <CustomCursor isLoading={formState === 'sending'} />

      {/* Vanta Clouds Background */}
      <div ref={vantaRef} className="vanta-clouds-background" />

      {/* Pink Background Below Clouds */}
      <div className="pink-background" />

      {/* Soft Checkerboard Grid Overlay - Sky Section Only */}
      <div className="sky-grid-overlay" style={{ opacity: checkerOpacity }}>
        <div className="checker-column-up"></div>
        <div className="checker-column-down"></div>
      </div>

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
        <span className="nav-logo">
          meshmeadow
        </span>

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
          {['Work', 'About', 'Contact'].map((item, i) => {
            const isActive = activeSection === item.toLowerCase();
            return (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                whileHover={{ scale: 1.1, y: -3 }}
                onClick={() => setMenuOpen(false)}
                animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {item}
                {/* Active indicator dot that animates in */}
                <motion.span
                  className="nav-active-indicator"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                />
              </motion.a>
            );
          })}
        </div>
      </motion.nav>

      {/* Main Content - Continuous Scroll */}
      <div className="scroll-content">

        {/* Hero Section - Wrapper for scroll zoom journey */}
        <div className="hero-section">
          {/* Hero Area - Scroll Zoom Effect */}
          <motion.div
            className="hero-area"
            style={{
              scale: smoothHeroScale,
              opacity: smoothHeroOpacity,
              y: smoothHeroY,
            }}
          >
          <motion.h1
            className={`hero-title bounce-text ${isTextAnimating ? 'animating' : ''}`}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            onMouseEnter={handleTextHover}
          >
            <div className="text-stars">
              {[...Array(4)].map((_, i) => (
                <span key={i} className="text-star">·</span>
              ))}
            </div>
            {'making things move'.split(' ').map((word, wordIndex) => {
              const letterOffset = 'making things move'.split(' ').slice(0, wordIndex).join(' ').length + wordIndex;
              return (
                <span key={wordIndex} className="bounce-word">
                  {word.split('').map((letter, i) => (
                    <span
                      key={i}
                      className="bounce-letter"
                      style={{ animationDelay: `${(letterOffset + i) * 0.05}s` }}
                    >
                      {letter}
                    </span>
                  ))}
                </span>
              );
            })}
            <span className="cycling-word-container">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={currentWordIndex}
                          className="thoughtfully-text"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                        >
                          {cyclingWords[currentWordIndex]}
                        </motion.span>
                      </AnimatePresence>
                    </span>
          </motion.h1>


          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <motion.button
              className="cta-button primary"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 107, 157, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              <span>see my work</span>
            </motion.button>
          </motion.div>
        </motion.div>
        </div> {/* End hero-section */}

        {/* Work Section - Featured Card Stack + Project Grid */}
        <motion.div
          className="work-area"
          id="work"
          style={{
            scale: smoothWorkScale,
            opacity: smoothWorkOpacity,
          }}
        >
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-emoji">🎬</span>
            <h2 className="section-title">the good stuff</h2>
            <p className="section-desc">campaigns that made people stop scrolling</p>
          </motion.div>

          {/* Featured Project - Swiper 3D Card Stack showing multiple animations */}
          <motion.div
            className="featured-project-section"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SwiperCardsSlider project={featuredProject} />
          </motion.div>

          {/* Other Projects - Grid Layout (hidden when empty) */}
          {projects.length > 1 && (
            <motion.div
              className="other-projects"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="other-projects-title">more stuff</h3>
              <div className="projects-grid">
                {projects.slice(1).map((project, index) => (
                  <motion.div
                    key={project.id}
                    className="project-grid-card"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{
                      y: -8,
                      boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                    }}
                    onClick={() => handleProjectClick(project)}
                  >
                    <div className="grid-card-image">
                      <img src={project.thumbnail} alt={project.title} />
                      <span className="grid-card-category">
                        {project.category === 'lottie' ? 'Lottie' : 'Video'}
                      </span>
                    </div>
                    <div className="grid-card-content">
                      <h4>{project.title}</h4>
                      <p>{project.client} &bull; {project.year}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Colorful Stats Banner */}
        <motion.div
          className="stats-banner"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {[
            { number: '4', label: 'years of wiggles', emoji: '✨', color: '#FF6B9D' },
            { number: '1st', label: 'motion hire @ bistro', emoji: '🏆', color: '#A855F7' },
            { number: '0→1', label: 'brand motion built', emoji: '🚀', color: '#3B82F6' },
            { number: '∞', label: 'cups of chai', emoji: '☕', color: '#10B981' },
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
              <h2>the person behind the pixels 👋</h2>
              <p className="highlight">
                engineer by degree, animator by obsession.
              </p>
              <p>
                walked out of IIT Guwahati and straight into making things wiggle for a living.
                currently the motion wizard at Bistro by Blinkit — where I built the entire visual
                language from zero. every loader, every campaign, every delightful little bounce.
              </p>
              <p>
                if it moves on your screen and makes you smile, that's the goal.
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
            <h3>🛠️ what i play with</h3>
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
              <h2>let's make something move</h2>
              <p>got a wild idea? a boring brief that needs life? let's talk.</p>
            </div>

            <form className="contact-form" onSubmit={handleFormSubmit}>
              <div className="form-row">
                <motion.div className="input-wrapper">
                  <motion.input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    whileFocus={{ scale: 1.02, boxShadow: '0 10px 30px rgba(168, 85, 247, 0.3)' }}
                    disabled={formState === 'sending'}
                    required
                  />
                  {formData.name && (
                    <motion.span
                      className="input-valid-check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.div>
                <motion.div className="input-wrapper">
                  <motion.input
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    whileFocus={{ scale: 1.02, boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)' }}
                    disabled={formState === 'sending'}
                    required
                  />
                  {formData.email && formData.email.includes('@') && (
                    <motion.span
                      className="input-valid-check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.div>
              </div>
              <motion.div className="input-wrapper textarea-wrapper">
                <motion.textarea
                  placeholder="Tell me about your project..."
                  rows="5"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  whileFocus={{ scale: 1.02, boxShadow: '0 10px 30px rgba(255, 107, 157, 0.3)' }}
                  disabled={formState === 'sending'}
                  required
                />
              </motion.div>

              {/* Submit button with state-based animations */}
              <motion.button
                type="submit"
                className={`submit-button submit-${formState}`}
                disabled={formState === 'sending' || formState === 'success'}
                whileHover={formState === 'idle' ? { scale: 1.05, boxShadow: '0 20px 40px rgba(255, 107, 157, 0.4)' } : {}}
                whileTap={formState === 'idle' ? { scale: 0.95 } : {}}
                animate={
                  formState === 'sending' ? { scale: [1, 0.98, 1] } :
                  formState === 'success' ? { scale: [1, 1.1, 1] } :
                  formState === 'error' ? { x: [0, -10, 10, -10, 10, 0] } : {}
                }
                transition={
                  formState === 'sending' ? { duration: 1.5, repeat: Infinity } :
                  formState === 'success' ? { duration: 0.5 } :
                  formState === 'error' ? { duration: 0.5 } : {}
                }
              >
                <AnimatePresence mode="wait">
                  {formState === 'idle' && (
                    <motion.span
                      key="idle"
                      className="button-content"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span>Send Message</span>
                      <span className="button-icon">🚀</span>
                    </motion.span>
                  )}
                  {formState === 'sending' && (
                    <motion.span
                      key="sending"
                      className="button-content"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span>Sending</span>
                      <motion.span
                        className="button-icon"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        ✨
                      </motion.span>
                    </motion.span>
                  )}
                  {formState === 'success' && (
                    <motion.span
                      key="success"
                      className="button-content"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    >
                      <span>Message Sent!</span>
                      <motion.span
                        className="button-icon"
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.3, 1] }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      >
                        ✓
                      </motion.span>
                    </motion.span>
                  )}
                  {formState === 'error' && (
                    <motion.span
                      key="error"
                      className="button-content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <span>Try Again</span>
                      <span className="button-icon">↻</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Success message that appears below */}
              <AnimatePresence>
                {formState === 'success' && (
                  <motion.p
                    className="form-success-message"
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    Thanks for reaching out! I'll get back to you soon. ✨
                  </motion.p>
                )}
              </AnimatePresence>
            </form>

            <div className="social-links">
              {[
                { name: 'LinkedIn', emoji: '💼', color: '#0A66C2', url: 'https://www.linkedin.com/in/shalmaligaikwad/' },
                { name: 'Instagram', emoji: '📸', color: '#E4405F', url: 'https://www.instagram.com/meshmeadow/' },
                { name: 'YouTube', emoji: '🎬', color: '#FF0000', url: 'https://www.youtube.com/@meshmeadow' },
                { name: 'ArtStation', emoji: '🎨', color: '#13AFF0', url: 'https://www.artstation.com/meshmeadow' },
              ].map((social, i) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
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
            <p>made with too much chai and not enough sleep</p>
            <p className="footer-copyright">© 2026 meshmeadow</p>
          </motion.div>
        </footer>
      </div>

      {/* Project Modal with Spatial Expansion */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => {
              setSelectedProject(null);
              setCardRect(null);
            }}
          >
            <motion.div
              className="modal-content"
              initial={{
                opacity: 0,
                scale: cardRect ? 0.5 : 0.8,
                y: cardRect ? cardRect.y - window.innerHeight / 2 : 100,
                x: cardRect ? cardRect.x - window.innerWidth / 2 : 0,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                x: 0,
              }}
              exit={{
                opacity: 0,
                scale: cardRect ? 0.5 : 0.8,
                y: cardRect ? cardRect.y - window.innerHeight / 2 : 100,
                x: cardRect ? cardRect.x - window.innerWidth / 2 : 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                className="modal-close"
                onClick={() => {
                  setSelectedProject(null);
                  setCardRect(null);
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 500 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>

              {/* Image reveals first */}
              <motion.div
                className="modal-image-wrapper"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <img src={selectedProject.thumbnail} alt={selectedProject.title} />
              </motion.div>

              {/* Content choreographed entrance */}
              <div className="modal-info">
                {/* Title enters first */}
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4, ease: [0, 0, 0.2, 1] }}
                >
                  {selectedProject.title}
                </motion.h3>

                {/* Meta enters second */}
                <motion.p
                  className="modal-meta"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4, ease: [0, 0, 0.2, 1] }}
                >
                  {selectedProject.client} • {selectedProject.year}
                </motion.p>

                {/* Description enters third */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.4, ease: [0, 0, 0.2, 1] }}
                >
                  {selectedProject.description}
                </motion.p>

                {/* Tags stagger in */}
                <motion.div
                  className="modal-tags"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                >
                  {selectedProject.tags.map((tag, i) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8, x: -10 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      transition={{
                        delay: 0.5 + i * 0.08,
                        type: 'spring',
                        stiffness: 500,
                        damping: 25
                      }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
