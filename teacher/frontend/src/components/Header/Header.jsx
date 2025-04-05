import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaChalkboardTeacher, 
  FaSignInAlt, 
  FaUserPlus, 
  FaUser, 
  FaBook, 
  FaList, 
  FaSignOutAlt,
  FaGraduationCap
} from 'react-icons/fa';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token'); // Adjust based on your auth system

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="header-container">
      <div className="header-brand" onClick={() => navigate('/')}>
        <FaChalkboardTeacher className="header-icon" />
        <h1>Teacher Portal</h1>
      </div>
      
      <nav className="header-nav">
        <ul className="nav-links">
          {/* Always visible routes */}
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
              end
            >
              <FaHome /> Home
            </NavLink>
          </li>
          
          {/* Conditional routes based on auth status */}
          {isLoggedIn ? (
            <>
              <li>
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <FaUser /> Profile
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/subject" 
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <FaBook /> Create Subject
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/subjectList" 
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <FaList /> My Subjects
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/subjects" 
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <FaGraduationCap /> Subject Details
                </NavLink>
              </li>
              <li>
                <button onClick={handleLogout} className="nav-button">
                  <FaSignOutAlt /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink 
                  to="/register" 
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <FaUserPlus /> Register
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/login" 
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <FaSignInAlt /> Login
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/generateassignment" 
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                   generateAssignmet
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;