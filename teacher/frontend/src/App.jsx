import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TeacherRegister from "./components/Register/TeacherRegister";
import Login from "./components/Login/Login";
import Profile from "./components/Profile/Profile";
import Subject from './components/Subject/Subject';
import SubjectList from './components/Subject/SubjectList';
import SubjectDetailsPage from './components/Subject/SubjectDetails';
import Home from './components/Home/Home';
import Header from './components/Header/Header'; // Import the Header component
import MCQAssignmentGenerator from './components/Subject/MCQAssignmentGenerator';
import Deepseek from './components/Deepseek/Deepseek';


function App() {
  return (
    <Router>
      <Header /> {/* Add the Header here */}
      <Routes>
        <Route path='/register' element={<TeacherRegister />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/subject" element={<Subject />} />
        <Route path="/subjectList" element={<SubjectList />} />
        <Route path="/subjects/:subjectId" element={<SubjectDetailsPage />} />
<Route path="/subject/:subjectId/create-mcq" element={<MCQAssignmentGenerator />} />
<Route path="/generateassignment" element={<Deepseek />} />
{/* <Route path="/assignment" element={<MCQAssignmentViewer />} /> */}
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;