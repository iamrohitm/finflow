import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import '../styles/Home.css';

const Home = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="home-loading">Loading...</div>;
  }

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-hero">
          <h1 className="home-title">FinFlow</h1>
          <p className="home-subtitle">Master Your Money, Flow Your Dreams</p>
          <p className="home-description">
            Take control of your finances with smart tracking, insightful analytics, and effortless expense management.
          </p>
        </div>

        <div className="home-features">
          <div className="feature-card">
            <span className="feature-icon">📊</span>
            <h3>Smart Analytics</h3>
            <p>Visualize your spending patterns and income trends with beautiful charts</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">💰</span>
            <h3>Easy Tracking</h3>
            <p>Add transactions in seconds with our intuitive modal interface</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📱</span>
            <h3>Mobile Friendly</h3>
            <p>Manage your finances on the go with our responsive design</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🔒</span>
            <h3>Secure</h3>
            <p>Your data is protected with Firebase authentication and encryption</p>
          </div>
        </div>

        <div className="home-cta">
          <button 
            className="cta-button primary"
            onClick={() => navigate('/signup')}
          >
            Get Started
          </button>
          <button 
            className="cta-button secondary"
            onClick={() => navigate('/signin')}
          >
            Sign In
          </button>
        </div>

        <div className="home-footer">
          <p>Simple. Secure. Smart.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
