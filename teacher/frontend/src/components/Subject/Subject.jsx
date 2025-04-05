import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Subject.css";

function Subject() {
  const [name, setName] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!name || !subjectId) {
      setError('Subject name and ID are required');
      return;
    }

    try {
      const response = await fetch('http://localhost:3300/teacher/subject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          subjectId,
        }),
        credentials: 'include',
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage('Subject created successfully');
        setName('');
        setSubjectId('');
        setError('');
        // Navigate to subject list after 1.5 seconds
        setTimeout(() => navigate('/subjectList'), 1500);
      } else {
        setError(result.error || 'Failed to create subject');
      }
    } catch (err) {
      setError(err.message || 'Server error while creating subject');
    }
  };

  return (
    <div className="subject-page">
      
      <div className="subject-card">
        <div className="subject-header">
          <h1>Create New Subject</h1>
          <p>Fill in the details below to create a new subject</p>
        </div>

        {/* Display success or error messages */}
        {error && (
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        {successMessage && (
          <div className="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form for creating a subject */}
        <form onSubmit={handleSubmit} className="subject-form">
          <div className="form-group">
            <label htmlFor="subjectName" className="form-label">
              Subject Name
            </label>
            <input
              type="text"
              id="subjectName"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter subject name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="subjectId" className="form-label">
              Subject ID
            </label>
            <input
              type="text"
              id="subjectId"
              className="form-input"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              placeholder="Enter subject ID"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              Create Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Subject;