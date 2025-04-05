import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiMail, FiBook, FiCalendar, FiAward } from 'react-icons/fi';
import { motion } from 'framer-motion';

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('enrolled');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:3300/student/profile', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          navigate('/login');
          return;
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid response format');
        }

        const data = await response.json();
        
        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to fetch profile');
        }

        setProfileData(data.data);
        
        // Fetch available subjects
        const subjectsResponse = await fetch('http://localhost:3300/students/all', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (subjectsResponse.ok) {
          const subjectsData = await subjectsResponse.json();
          setAvailableSubjects(subjectsData.data || []);
        }
      } catch (err) {
        setError(err.message || 'Error fetching profile');
        if (err.message.includes('Unauthorized') || err.message.includes('Not authenticated')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, enrollmentStatus]);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3300/student/logout', {
        method: 'POST',
        credentials: 'include',
      });
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Logout failed. Please try again.');
    }
  };

  const handleEnroll = async (subjectId) => {
    try {
      setEnrollmentStatus('enrolling');
      const response = await fetch('http://localhost:3300/student/enroll', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subjectId }),
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Enrollment failed');
      }

      setEnrollmentStatus('success');
      // Refresh profile data to show newly enrolled subject
      const profileResponse = await fetch('http://localhost:3300/student/profile', {
        method: 'GET',
        credentials: 'include',
      });
      const profileData = await profileResponse.json();
      setProfileData(profileData.data);
      
      // Reset status after 3 seconds
      setTimeout(() => setEnrollmentStatus(null), 3000);
    } catch (err) {
      setEnrollmentStatus('error');
      setError(err.message || 'Error enrolling in subject');
      setTimeout(() => setEnrollmentStatus(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="profile-error"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <p>⚠️ {error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </motion.div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-empty">
        <p>No profile data found</p>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header-container">
        <h1 className="profile-header">Student Dashboard</h1>
        <button className="profile-logout" onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </div>
      
      <motion.div 
        className="profile-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="profile-avatar">
          {profileData.name.charAt(0).toUpperCase()}
        </div>
        
        <div className="profile-details">
          <div className="profile-field">
            <span className="profile-label"><FiUser /> Name:</span>
            <span className="profile-value">{profileData.name}</span>
          </div>
          
          <div className="profile-field">
            <span className="profile-label"><FiMail /> Email:</span>
            <span className="profile-value">{profileData.email}</span>
          </div>
          
          <div className="profile-field">
            <span className="profile-label"><FiAward /> Registration ID:</span>
            <span className="profile-value">{profileData.regId}</span>
          </div>
          
          <div className="profile-field">
            <span className="profile-label"><FiCalendar /> Joined:</span>
            <span className="profile-value">
              {new Date(profileData.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Subjects Section with Tabs */}
      <div className="subjects-section">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'enrolled' ? 'active' : ''}`}
            onClick={() => setActiveTab('enrolled')}
          >
            <FiBook /> Your Subjects
          </button>
          <button 
            className={`tab ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            <FiBook /> Available Subjects
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'enrolled' ? (
            <>
              <h2>Your Subjects</h2>
              {profileData.enrolledSubjects && profileData.enrolledSubjects.length > 0 ? (
                <div className="subject-grid">
                  {profileData.enrolledSubjects.map(subject => (
                    <motion.div 
                      key={subject._id} 
                      className="subject-card"
                      whileHover={{ y: -5 }}
                    >
                      <h3>{subject.name}</h3>
                      <p className="subject-id">ID: {subject.subjectId}</p>
                      <p className="subject-teacher">Teacher: {subject.teacher}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>You're not enrolled in any subjects yet.</p>
                </div>
              )}
            </>
          ) : (
            <>
              <h2>Available Subjects</h2>
              {availableSubjects.length > 0 ? (
                <div className="subject-grid">
                  {availableSubjects.map(subject => (
                    <motion.div 
                      key={subject._id} 
                      className="subject-card"
                      whileHover={{ y: -5 }}
                    >
                      <h3>{subject.name}</h3>
                      <p className="subject-id">ID: {subject.subjectId}</p>
                      <p className="subject-teacher">Teacher: {subject.teacher}</p>
                      <button 
                        onClick={() => handleEnroll(subject._id)}
                        disabled={enrollmentStatus === 'enrolling'}
                        className="enroll-button"
                      >
                        {enrollmentStatus === 'enrolling' ? 'Enrolling...' : 'Enroll Now'}
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No subjects available for enrollment.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Status notifications */}
      {enrollmentStatus === 'success' && (
        <motion.div 
          className="notification success"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
        >
          Enrollment successful!
        </motion.div>
      )}
      {enrollmentStatus === 'error' && (
        <motion.div 
          className="notification error"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
        >
          Enrollment failed. Please try again.
        </motion.div>
      )}
    </div>
  );
}

export default Profile;