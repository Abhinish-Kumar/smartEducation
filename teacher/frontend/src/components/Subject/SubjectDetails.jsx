import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import "./SubjectDetail.css"

function SubjectDetailsPage() {
  const { subjectId } = useParams();
  const location = useLocation();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [index, setIndex] = useState(null);

  useEffect(() => {
    // Get the index from location state
    if (location.state && location.state.index !== undefined) {
      setIndex(location.state.index + 1); // Adding 1 to make it 1-based
    }

    const fetchSubjectDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3300/teacher/subjectList/${subjectId}`, {
          method: 'GET',
          credentials: 'include',
        });

        const result = await response.json();
        console.log(result)

        if (response.ok) {
          setSubject(result.data);
        } else {
          setError(result.error || 'Failed to fetch subject details');
        }
      } catch (err) {
        setError(err.message || 'Server error while fetching subject details');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectDetails();
  }, [subjectId, location.state]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div className="loading-message">Loading subject details...</div>;
  }

  return (
    <div className="subject-details-page">
            // Add this to your SubjectDetailsPage component
<Link 
  to={`/subject/${subjectId}/create-mcq`} 
  state={{ subjectId }}
  className="create-assignment-btn"
>
  Create MCQ Assignment
</Link>
      <button onClick={handleBack} className="back-button">
        Back to Subjects
      </button>

      {error && <div className="error-message">{error}</div>}

      {subject && (
        <div className="subject-details">
          {index && <p className="subject-index">Subject #{index}</p>}
          <h1>{subject[index-1].name}</h1>
          <p>Subject ID: {subject[index-1].subjectId}</p>
          <h2>Students</h2>
          <ul>
            {subject[index-1].students.map(student => (
              <li key={student._id}>{student[0].name}</li>
            ))}
          </ul>
          <h2>Assignments</h2>
          <ul>
            {subject[index-1].assignments.map(assignment => (
              <li key={assignment._id}>{assignment.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SubjectDetailsPage;