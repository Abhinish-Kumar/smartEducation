// import { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { FaUser, FaEnvelope, FaSchool, FaChalkboardTeacher, FaSignOutAlt, FaEdit } from 'react-icons/fa';
// import { motion } from 'framer-motion';
// import './Profile.css';

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [isEditing, setIsEditing] = useState(false);
//   const [editData, setEditData] = useState({});
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Fetch user data on component mount
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         // Check if we have user data from navigation state
//         if (location.state?.user) {
//           setUser(location.state.user);
//           setEditData(location.state.user);
//           setIsLoading(false);
//           return;
//         }

//         // If not, fetch from API
//         const response = await fetch('http://localhost:3300/profile', {
//           credentials: 'include' // Important for cookies
//         });

//         const data = await response.json();

//         if (!response.ok) {
//           throw new Error(data.message || 'Failed to fetch profile data');
//         }

//         setUser(data.user);
//         setEditData(data.user);
//       } catch (err) {
//         setError(err.message || 'Error loading profile');
//         navigate('/teacher/login'); // Redirect to login if unauthorized
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [location, navigate]);

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSave = async () => {
//     try {
//       setIsLoading(true);
//       const response = await fetch('http://localhost:3300/profile', {
//         method: 'PUT',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(editData)
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to update profile');
//       }

//       setUser(data.user);
//       setIsEditing(false);
//     } catch (err) {
//       setError(err.message || 'Error updating profile');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await fetch('http://localhost:3300/teacher/logout', {
//         method: 'POST',
//         credentials: 'include'
//       });
//       navigate('/teacher/login');
//     } catch (err) {
//       console.error('Logout error:', err);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="profile-loading">
//         <div className="spinner"></div>
//         <p>Loading profile...</p>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="profile-error">
//         <p>{error || 'No user data available'}</p>
//         <button onClick={() => navigate('/login')}>Return to Login</button>
//       </div>
//     );
//   }

//   return (
//     <div className="profile-container">
//       <motion.div
//         className="profile-card"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div className="profile-header">
//           <div className="profile-avatar">
//             <FaChalkboardTeacher size={60} />
//           </div>
//           <h2>Teacher Profile</h2>
//           <div className="profile-actions">
//             <button
//               onClick={() => setIsEditing(!isEditing)}
//               className="edit-button"
//             >
//               <FaEdit /> {isEditing ? 'Cancel' : 'Edit Profile'}
//             </button>
//             <button
//               onClick={handleLogout}
//               className="logout-button"
//             >
//               <FaSignOutAlt /> Logout
//             </button>
//           </div>
//         </div>

//         {error && (
//           <motion.div
//             className="profile-error-message"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//           >
//             {error}
//           </motion.div>
//         )}

//         <div className="profile-details">
//           <div className="profile-field">
//             <label>
//               <FaUser /> Username
//             </label>
//             {isEditing ? (
//               <input
//                 type="text"
//                 name="name"
//                 value={editData.name || ''}
//                 onChange={handleEditChange}
//               />
//             ) : (
//               <p>{user.name}</p>
//             )}
//           </div>

//           <div className="profile-field">
//             <label>
//               <FaEnvelope /> Email
//             </label>
//             {isEditing ? (
//               <input
//                 type="email"
//                 name="email"
//                 value={editData.email || ''}
//                 onChange={handleEditChange}
//               />
//             ) : (
//               <p>{user.email || 'Not provided'}</p>
//             )}
//           </div>

//           <div className="profile-field">
//             <label>
//               <FaSchool /> Institution
//             </label>
//             {isEditing ? (
//               <input
//                 type="text"
//                 name="institution"
//                 value={editData.institution || ''}
//                 onChange={handleEditChange}
//               />
//             ) : (
//               <p>{user.institution || 'Not specified'}</p>
//             )}
//           </div>

//           {/* Add more fields as needed */}
//         </div>

//         {isEditing && (
//           <div className="profile-save-actions">
//             <button
//               onClick={handleSave}
//               disabled={isLoading}
//               className="save-button"
//             >
//               {isLoading ? 'Saving...' : 'Save Changes'}
//             </button>
//           </div>
//         )}

//         <div className="profile-footer">
//           <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Profile;
