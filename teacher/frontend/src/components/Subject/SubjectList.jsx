import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SubjectList.css';

function SubjectList() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchSubjects = async () => {
    try {
      const response = await fetch('http://localhost:3300/teacher/subjectList', {
        method: 'GET',
        credentials: 'include',
      });

      const result = await response.json();

      if (response.ok) {
        setSubjects(result.data);
      } else {
        setError(result.error || 'Failed to fetch subjects');
      }
    } catch (err) {
      setError(err.message || 'Server error while fetching subjects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSubjectClick = (subjectId, index) => {
    navigate(`/subjects/${subjectId}`, { state: { index } });
  };

  if (loading) {
    return <div className="loading-message">Loading subjects...</div>;
  }

  return (
    <div className="subject-list-container">
      <h1 className="subject-list-header">Your Subjects</h1>

      {error && <div className="error-message">{error}</div>}

      {subjects.length === 0 && !error && (
        <div className="no-subjects-message">You haven't created any subjects yet.</div>
      )}

      <div className="subject-list">
        {subjects.map((subject, index) => (
          <div 
            key={subject._id} 
            className="subject-card"
            onClick={() => handleSubjectClick(subject._id, index)}
          >
            <h3>{subject.name}</h3>
            <p>ID: {subject.subjectId}</p>
            <p>Students: {subject.students.length}</p>
            <p>Assignments: {subject.assignments.length}</p>
            <p>Index: {index + 1}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubjectList;