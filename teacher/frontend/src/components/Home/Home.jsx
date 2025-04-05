import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="home-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      <motion.div className="content-wrapper" variants={itemVariants}>
        <motion.h1 
          className="title"
          whileHover={{ scale: 1.02 }}
        >
          Welcome to the <span className="highlight">Teacher Portal</span>
        </motion.h1>
        
        <motion.p className="subtitle" variants={itemVariants}>
          Manage your classes, students, and assignments all in one place
        </motion.p>
        
        <motion.div className="button-group" variants={itemVariants}>
          <motion.button
            className="home-button register-button"
            onClick={() => navigate('/register')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
            <span className="button-icon">→</span>
          </motion.button>
          
          <motion.button
            className="home-button login-button"
            onClick={() => navigate('/login')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign In
            <span className="button-icon">↗</span>
          </motion.button>
        </motion.div>
        
        <motion.div className="features-grid" variants={itemVariants}>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Grade Tracking</h3>
            <p>Easily manage and analyze student performance</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Schedule</h3>
            <p>Organize your classes and deadlines</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Communication</h3>
            <p>Connect with students and parents</p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Home;