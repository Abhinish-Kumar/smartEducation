import { useNavigate } from 'react-router-dom';
import './Home.css'; // Optional for styling

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome to the Student Portal</h1>
      <div className="button-group">
        <button 
          className="home-button register-button" 
          onClick={() => navigate('/register')}
        >
          Register
        </button>
        <button 
          className="home-button login-button" 
          onClick={() => navigate('/login')}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Home;