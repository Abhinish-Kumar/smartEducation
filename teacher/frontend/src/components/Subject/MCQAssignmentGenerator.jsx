import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './MCQAssignmentGenerator.css';

function MCQAssignmentGenerator() {
  const { subjectId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correctOption: 0,
    marks: 1
  });
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const handleCorrectOptionChange = (index) => {
    setCurrentQuestion({ ...currentQuestion, correctOption: index });
  };

  const addQuestion = () => {
    if (!currentQuestion.text.trim()) {
      alert('Question text cannot be empty');
      return;
    }
    
    if (currentQuestion.options.some(opt => !opt.trim())) {
      alert('All options must be filled');
      return;
    }

    setQuestions([...questions, currentQuestion]);
    setCurrentQuestion({
      text: '',
      options: ['', '', '', ''],
      correctOption: 0,
      marks: 1
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const submitAssignment = () => {
    if (!assignmentTitle.trim()) {
      alert('Assignment title cannot be empty');
      return;
    }

    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    const assignment = {
      subjectId,
      title: assignmentTitle,
      dueDate,
      questions,
      type: 'MCQ'
    };

    console.log('Assignment to be submitted:', assignment);
    // Here you would typically send this to your backend API
    // Example:

    fetch('http://localhost:3300/teacher/createAssignment', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assignment),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Assignment created:', data);
      // Redirect or show success message
    });

    alert('Assignment created successfully! Check console for details.');
  };

  return (
    <div className="mcq-generator-container">
      <h2>Create MCQ Assignment</h2>
      
      <div className="assignment-meta">
        <div className="form-group">
          <label>Assignment Title:</label>
          <input
            type="text"
            value={assignmentTitle}
            onChange={(e) => setAssignmentTitle(e.target.value)}
            placeholder="Enter assignment title"
          />
        </div>
        
        <div className="form-group">
          <label>Due Date:</label>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <div className="question-form">
        <h3>Add New Question</h3>
        
        <div className="form-group">
          <label>Question Text:</label>
          <textarea
            value={currentQuestion.text}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
            placeholder="Enter the question"
            rows={3}
          />
        </div>
        
        <div className="form-group">
          <label>Options:</label>
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="option-input">
              <input
                type="radio"
                name="correctOption"
                checked={currentQuestion.correctOption === index}
                onChange={() => handleCorrectOptionChange(index)}
              />
              <input
                type="text"
                value={currentQuestion.options[index]}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
              />
            </div>
          ))}
        </div>
        
        <div className="form-group">
          <label>Marks:</label>
          <input
            type="number"
            min="1"
            value={currentQuestion.marks}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, marks: parseInt(e.target.value) || 1 })}
          />
        </div>
        
        <button onClick={addQuestion} className="add-question-btn">
          Add Question
        </button>
      </div>

      <div className="questions-list">
        <h3>Questions ({questions.length})</h3>
        {questions.length === 0 ? (
          <p>No questions added yet</p>
        ) : (
          <ul>
            {questions.map((q, qIndex) => (
              <li key={qIndex} className="question-item">
                <div className="question-header">
                  <span>Q{qIndex + 1}: {q.text}</span>
                  <button onClick={() => removeQuestion(qIndex)} className="remove-btn">
                    Remove
                  </button>
                </div>
                <ul className="options-list">
                  {q.options.map((opt, optIndex) => (
                    <li key={optIndex} className={q.correctOption === optIndex ? 'correct-option' : ''}>
                      {optIndex + 1}. {opt} {q.correctOption === optIndex && '(Correct)'}
                    </li>
                  ))}
                </ul>
                <div className="question-meta">Marks: {q.marks}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button 
        onClick={submitAssignment} 
        className="submit-assignment-btn"
        disabled={questions.length === 0 || !assignmentTitle.trim()}
      >
        Create Assignment
      </button>
    </div>
  );
}

export default MCQAssignmentGenerator;