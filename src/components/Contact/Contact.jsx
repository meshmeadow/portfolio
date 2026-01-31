import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../common/SectionTitle';
import MagneticButton from '../common/MagneticButton';
import styles from './Contact.module.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });

    setTimeout(() => setSubmitted(false), 5000);
  };

  const socialLinks = [
    { name: 'Dribbble', url: 'https://dribbble.com', icon: '🏀' },
    { name: 'Behance', url: 'https://behance.net', icon: '🎨' },
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: '💼' },
    { name: 'Twitter', url: 'https://twitter.com', icon: '🐦' },
  ];

  return (
    <section id="contact" className={styles.contact}>
      <div className="container">
        <SectionTitle subtitle="Get in Touch">
          Let's Create Something Amazing
        </SectionTitle>

        <div className={styles.grid}>
          <motion.div
            className={styles.info}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className={styles.infoTitle}>
              Have a project in mind?
            </h3>
            <p className={styles.infoText}>
              I'm always excited to work on new projects that push creative
              boundaries. Whether you need Lottie animations for your app,
              a captivating marketing video, or anything in between — let's
              talk!
            </p>

            <div className={styles.contactDetails}>
              <motion.a
                href="mailto:hello@motiondesigner.com"
                className={styles.email}
                whileHover={{ x: 5 }}
              >
                <span className={styles.icon}>✉️</span>
                hello@motiondesigner.com
              </motion.a>
              <motion.span
                className={styles.location}
                whileHover={{ x: 5 }}
              >
                <span className={styles.icon}>📍</span>
                San Francisco, CA
              </motion.span>
            </div>

            <div className={styles.socials}>
              <h4>Follow my work</h4>
              <div className={styles.socialLinks}>
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4, scale: 1.05 }}
                  >
                    <span className={styles.socialIcon}>{link.icon}</span>
                    {link.name}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.form
            className={styles.form}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Tell me about your project..."
                rows="5"
              />
            </div>

            <MagneticButton
              type="submit"
              className={`${styles.submitBtn} ${submitted ? styles.success : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className={styles.loading}>Sending...</span>
              ) : submitted ? (
                <span>Message Sent! ✓</span>
              ) : (
                <>
                  Send Message
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </>
              )}
            </MagneticButton>
          </motion.form>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className="container">
          <p>© 2024 Motion Designer. Crafted with passion.</p>
        </div>
      </footer>
    </section>
  );
};

export default Contact;
