import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Profile from './components/Profile/Profile';
import Home from './components/Home/Home';




function App() {
  return (
    <Router>
      
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/" element={<Home/>} />
      </Routes>
    </Router>
  );
}

export default App;