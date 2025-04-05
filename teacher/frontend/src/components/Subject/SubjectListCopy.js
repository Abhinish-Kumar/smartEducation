import React, { useState, useEffect } from "react";

function SubjectList() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Fetch all subjects for the teacher
  const fetchSubjects = async () => {
    try {
      const response = await fetch(
        "http://localhost:3300/teacher/subjectList",
        {
          method: "GET",
          credentials: "include", // Include cookies for authentication
        }
      );

      const result = await response.json();
      console.log(result.data[0]);

      if (response.ok) {
        setSubjects(result.data);
      } else {
        setError(result.error || "Failed to fetch subjects");
      }
    } catch (err) {
      setError(err.message || "Server error while fetching subjects");
    } finally {
      setLoading(false);
    }
  };

  // Fetch a specific subject by ID
  const fetchSubjectById = async (id) => {
    try {
      console.log(id);
      const response = await fetch(
        `http://localhost:3300/teacher/subjectList/${id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (response.ok) {
        setSelectedSubject(result.data);
      } else {
        setError(result.error || "Failed to fetch subject details");
      }
    } catch (err) {
      setError(err.message || "Server error while fetching subject details");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  if (loading) {
    return <div className="loading-message">Loading subjects...</div>;
  }

  return (
    <div className="subject-list-container">
      <h1 className="subject-list-header">Your Subjects</h1>

      {error && <div className="error-message">{error}</div>}

      {subjects.length === 0 && !error && (
        <div className="no-subjects-message">
          You haven't created any subjects yet.
        </div>
      )}

      <div className="subject-list">
        {subjects.map((subject) => (
          <div
            key={subject._id}
            className="subject-card"
            onClick={() => fetchSubjectById(subject._id)}
          >
            <h3>{subject.name}</h3>
            <p>ID: {subject.subjectId}</p>
            <p>Students: {subject.students.length}</p>
            <p>Assignments: {subject.assignments.length}</p>
          </div>
        ))}
      </div>

      {selectedSubject && (
        <div className="subject-details-modal">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setSelectedSubject(null)}
            >
              &times;
            </button>

            <h2>{selectedSubject[0].name}</h2>
            <p>
              <strong>Subject ID:</strong> {selectedSubject[0].subjectId}
            </p>
            <p>
              <strong>Teacher:</strong> {selectedSubject[0].teacher}
            </p>

            <div className="students-section">
              <h3>Students</h3>
              {selectedSubject[0].students.length > 0 ? (
                <ul>
                  {selectedSubject[0].students.map((student, index) => (
                    <li key={index}>{student}</li>
                  ))}
                </ul>
              ) : (
                <p>No students enrolled yet.</p>
              )}
            </div>

            <div className="assignments-section">
              <h3>Assignments</h3>
              {selectedSubject[0].assignments.length > 0 ? (
                <ul>
                  {selectedSubject[0].assignments.map((assignment, index) => (
                    <li key={index}>
                      {assignment.title} - Due: {assignment.dueDate}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No assignments created yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubjectList;
