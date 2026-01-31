import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import SectionTitle from '../common/SectionTitle';
import { skills, tools } from '../../data/projects';
import styles from './About.module.css';

const About = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="about" className={styles.about} ref={sectionRef}>
      <motion.div
        className={styles.parallaxBg}
        style={{ y }}
      />

      <div className="container">
        <SectionTitle subtitle="About Me">
          The Person Behind The Pixels
        </SectionTitle>

        <div className={styles.grid}>
          <motion.div
            className={styles.bio}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className={styles.imageWrapper}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.imagePlaceholder}>
                <motion.div
                  animate={{
                    background: [
                      'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      'linear-gradient(135deg, #8b5cf6, #d946ef)',
                      'linear-gradient(135deg, #d946ef, #6366f1)',
                      'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    ],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4rem',
                  }}
                >
                  👨‍🎨
                </motion.div>
              </div>
              <div className={styles.imageGlow} />
            </motion.div>

            <div className={styles.bioText}>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Hi! I'm a motion designer with 5+ years of experience creating
                animations that tell stories and enhance user experiences. I
                specialize in Lottie animations for mobile apps and marketing
                videos that capture attention.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                I believe great motion design is invisible — it guides users,
                communicates emotion, and makes interfaces feel alive without
                getting in the way. Every animation should serve a purpose.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                When I'm not animating, you'll find me exploring new tools,
                contributing to open-source Lottie libraries, or teaching
                motion design workshops.
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            className={styles.skillsSection}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className={styles.skillsTitle}>Skills & Tools</h3>

            <motion.div
              className={styles.skillBars}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  className={styles.skillBar}
                  variants={itemVariants}
                >
                  <div className={styles.skillInfo}>
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className={styles.skillTrack}>
                    <motion.div
                      className={styles.skillProgress}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className={styles.toolsGrid}>
              <h4 className={styles.toolsTitle}>Tools I Use</h4>
              <motion.div
                className={styles.tools}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {tools.map((tool) => (
                  <motion.span
                    key={tool}
                    className={styles.tool}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    {tool}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
