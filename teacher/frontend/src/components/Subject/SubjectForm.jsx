import React, { useState, useEffect } from 'react';

const SubjectForm = ({ onSubmit, editingSubject, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    subjectId: ''
  });

  useEffect(() => {
    if (editingSubject) {
      setFormData({
        name: editingSubject.name,
        subjectId: editingSubject.subjectId
      });
    }
  }, [editingSubject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">
          {editingSubject ? 'Edit Subject' : 'Create New Subject'}
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Subject Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="subjectId" className="form-label">Subject ID</label>
            <input
              type="text"
              className="form-control"
              id="subjectId"
              name="subjectId"
              value={formData.subjectId}
              onChange={handleChange}
              required
            />
          </div>
          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-primary">
              {editingSubject ? 'Update' : 'Create'}
            </button>
            {editingSubject && (
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectForm;