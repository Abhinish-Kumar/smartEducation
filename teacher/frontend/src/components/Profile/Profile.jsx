import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaSchool, FaChalkboardTeacher, FaSignOutAlt, FaEdit, FaBook } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  // Styles
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      padding: '2rem',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '600px',
      padding: '2rem',
      transition: 'all 0.3s ease',
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    avatar: {
      width: '100px',
      height: '100px',
      margin: '0 auto 1rem',
      backgroundColor: '#e9f0ff',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#3a7bd5',
    },
    actions: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      marginTop: '1.5rem',
    },
    button: (bgColor, textColor, hoverBg, hoverText) => ({
      padding: '0.6rem 1.2rem',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.2s ease',
      backgroundColor: bgColor,
      color: textColor,
      '&:hover': {
        backgroundColor: hoverBg,
        color: hoverText || textColor,
      },
    }),
    details: {
      marginBottom: '2rem',
    },
    field: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
      color: '#495057',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #ced4da',
      borderRadius: '6px',
      fontSize: '1rem',
      transition: 'border-color 0.2s ease',
      '&:focus': {
        outline: 'none',
        borderColor: '#3a7bd5',
        boxShadow: '0 0 0 3px rgba(58, 123, 213, 0.1)',
      },
    },
    saveActions: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '2rem',
    },
    footer: {
      textAlign: 'center',
      marginTop: '2rem',
      color: '#6c757d',
      fontSize: '0.9rem',
    },
    errorMessage: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '1rem',
      borderRadius: '6px',
      marginBottom: '1.5rem',
      textAlign: 'center',
    },
    loading: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
    },
    spinner: {
      width: '50px',
      height: '50px',
      border: '5px solid #f3f3f3',
      borderTop: '5px solid #3a7bd5',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '1rem',
    },
    errorContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '2rem',
    },
    subjectButton: {
      margin: '1rem 0',
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check if we have user data from navigation state
        if (location.state?.user) {
          setUser(location.state.user);
          setEditData(location.state.user);
          setIsLoading(false);
          return;
        }

        // If not, fetch from API
        const response = await fetch('http://localhost:3300/profile', {
          credentials: 'include' // Important for cookies
        });

        if (response.status === 401) {
          // Unauthorized - redirect to login
          navigate('/teacher/login');
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch profile data');
        }

        setUser(data.user);
        setEditData(data.user);
      } catch (err) {
        setError(err.message || 'Error loading profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [location, navigate]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3300/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setUser(data.user);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError(err.message || 'Error updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3300/teacher/logout', {
        method: 'POST',
        credentials: 'include'
      });
      navigate('/teacher/login');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to logout');
    }
  };

  const handleCreateSubject = () => {
    navigate('/subject');
  };

  if (isLoading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.errorContainer}>
        <p>{error || 'No user data available'}</p>
        <button 
          onClick={() => navigate('/teacher/login')}
          style={styles.button('#3a7bd5', 'white', '#2c5fb3')}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <motion.div
        style={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={styles.header}>
          <div style={styles.avatar}>
            <FaChalkboardTeacher size={60} />
          </div>
          <h2>Teacher Profile</h2>
          <div style={styles.subjectButton}>
            <button 
              onClick={handleCreateSubject}
              style={styles.button('#6c757d', 'white', '#5a6268')}
            >
              <FaBook /> Create Subject
            </button>
          </div>
          <div style={styles.actions}>
            <button
              onClick={() => setIsEditing(!isEditing)}
              style={styles.button('#3a7bd5', 'white', '#2c5fb3')}
            >
              <FaEdit /> {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            <button
              onClick={handleLogout}
              style={{
                ...styles.button('#f8f9fa', '#dc3545', '#dc3545', 'white'),
                border: '1px solid #dc3545'
              }}
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {error && (
          <motion.div
            style={styles.errorMessage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        <div style={styles.details}>
          <div style={styles.field}>
            <label style={styles.label}>
              <FaUser /> Username
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editData.name || ''}
                onChange={handleEditChange}
                style={styles.input}
              />
            ) : (
              <p>{user.name}</p>
            )}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              <FaEnvelope /> Email
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={editData.email || ''}
                onChange={handleEditChange}
                style={styles.input}
              />
            ) : (
              <p>{user.email || 'Not provided'}</p>
            )}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              <FaSchool /> Institution
            </label>
            {isEditing ? (
              <input
                type="text"
                name="institution"
                value={editData.institution || ''}
                onChange={handleEditChange}
                style={styles.input}
              />
            ) : (
              <p>{user.institution || 'Not specified'}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <div style={styles.saveActions}>
            <button
              onClick={handleSave}
              disabled={isLoading}
              style={styles.button('#28a745', 'white', '#218838')}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}

        <div style={styles.footer}>
          <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;