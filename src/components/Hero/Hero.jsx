import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import styles from './Hero.module.css';

// Simple animated shapes as placeholder for Lottie
const FloatingShapes = () => (
  <div className={styles.shapes}>
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className={styles.shape}
        style={{
          width: Math.random() * 100 + 50,
          height: Math.random() * 100 + 50,
          left: `${Math.random() * 80 + 10}%`,
          top: `${Math.random() * 80 + 10}%`,
        }}
        animate={{
          y: [0, -30, 0],
          rotate: [0, 180, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: Math.random() * 5 + 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
);

const Hero = () => {
  const titleWords = ['Crafting', 'Motion', 'That', 'Moves', 'People'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.01, -0.05, 0.95],
      },
    },
  };

  const scrollToPortfolio = () => {
    const element = document.querySelector('#portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.hero}>
      <FloatingShapes />

      <div className={styles.gradientOrb1} />
      <div className={styles.gradientOrb2} />

      <div className={`container ${styles.container}`}>
        <motion.div
          className={styles.content}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            className={styles.tagline}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Motion Designer & Animator
          </motion.p>

          <h1 className={styles.title}>
            {titleWords.map((word, index) => (
              <motion.span
                key={index}
                className={styles.word}
                variants={wordVariants}
              >
                {word}
                {index === 1 && <span className={styles.highlight}></span>}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className={styles.description}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            Specializing in Lottie animations for apps and captivating
            marketing videos that bring brands to life.
          </motion.p>

          <motion.div
            className={styles.cta}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.button
              className={styles.primaryBtn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToPortfolio}
            >
              View My Work
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </motion.button>
            <motion.a
              href="#contact"
              className={styles.secondaryBtn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get in Touch
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.visual}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className={styles.videoWrapper}>
            <div className={styles.videoPlaceholder}>
              <motion.div
                className={styles.playButton}
                whileHover={{ scale: 1.1 }}
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(99, 102, 241, 0.4)',
                    '0 0 0 20px rgba(99, 102, 241, 0)',
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </motion.div>
              <span>Showreel Coming Soon</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={scrollToPortfolio}
      >
        <span>Scroll</span>
        <motion.div
          className={styles.scrollLine}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
};

export default Hero;
