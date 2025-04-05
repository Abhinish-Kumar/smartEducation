import React, { useState } from 'react';
import axios from 'axios';
import './Deepseek.css'
const Deepseek = () => {
  const [topic, setTopic] = useState('JavaScript');
  const [difficulty, setDifficulty] = useState('easy');
  const [number, setNumber] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assignmentTitle, setAssignmentTitle] = useState('MCQ Quiz');
  const [instructions, setInstructions] = useState('Please answer all questions.');

  const cleanJSONResponse = (jsonString) => {
    // Remove markdown code blocks if present
    let cleaned = jsonString.replace(/```(json)?/g, '').trim();
    
    // Extract JSON from the string if there's extra text
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}') + 1;
    
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      cleaned = cleaned.substring(jsonStart, jsonEnd);
    }
    
    return cleaned;
  };

  const generateQuestions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "deepseek/deepseek-r1:free",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that generates educational multiple choice questions and answers. Return ONLY valid JSON with no additional text or markdown formatting. The JSON should have a 'questions' array containing objects with 'question', 'options', and 'correctAnswer' properties.",
            },
            {
              role: "user",
              content: `Generate ${number} multiple choice questions about ${topic} with ${difficulty} difficulty level. 
                        Return a JSON object with a "questions" array where each object has:
                        - "question" (the question text)
                        - "options" (array of exactly 4 options)
                        - "correctAnswer" (index of correct option, 0-3)
                        ONLY return the JSON object with no additional text or explanation.`,
            },
          ],
          response_format: { type: "json_object" },
        },
        {
          headers: {
            Authorization: `Bearer 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`,
            "Content-Type": "application/json",
            "X-Title": "React Question Generator",
          },
        }
      );

      const rawContent = response.data.choices[0].message.content;
      const cleanedContent = cleanJSONResponse(rawContent);
      const parsedData = JSON.parse(cleanedContent);

      // Validate the response structure
      if (!parsedData.questions || !Array.isArray(parsedData.questions)) {
        throw new Error("Invalid response format: missing questions array");
      }

      setQuestions(parsedData.questions);
      
    } catch (err) {
      const errorMessage = err instanceof SyntaxError 
        ? "Failed to parse questions. The API returned invalid JSON." 
        : err.response?.data?.error?.message || err.message;
      
      setError(errorMessage);
      console.error("Generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadAssignment = () => {
    const assignmentData = {
      title: assignmentTitle,
      instructions: instructions,
      topic: topic,
      difficulty: difficulty,
      date: new Date().toLocaleDateString(),
      questions: questions
    };

    const dataStr = JSON.stringify(assignmentData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const fileName = `${assignmentTitle.replace(/\s+/g, '_')}_${Date.now()}.json`;
    
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', dataUri);
    downloadLink.setAttribute('download', fileName);
    downloadLink.click();
  };

  const printAssignment = () => {
    window.print();
  };

  return (
    <div className="assignment-generator">
      <h1>MCQ Question Generator</h1>
      
      <div className="controls-panel">
        <div className="form-group">
          <label>Assignment Title:</label>
          <input
            type="text"
            value={assignmentTitle}
            onChange={(e) => setAssignmentTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Instructions:</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows="2"
          />
        </div>

        <div className="form-group">
          <label>Topic:</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Difficulty:</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label>Number of Questions:</label>
            <input
              type="number"
              min="1"
              max="20"
              value={number}
              onChange={(e) => setNumber(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
            />
          </div>
        </div>

        <button
          className="generate-btn"
          onClick={generateQuestions}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Questions'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {questions.length > 0 && (
        <div className="assignment-container">
          <div className="assignment-header">
            <h2>{assignmentTitle}</h2>
            <p className="instructions">{instructions}</p>
            <div className="assignment-meta">
              <span><strong>Topic:</strong> {topic}</span>
              <span><strong>Difficulty:</strong> {difficulty}</span>
              <span><strong>Date:</strong> {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="questions-list">
            {questions.map((question, index) => (
              <div key={index} className="question-card">
                <div className="question-header">
                  <span className="question-number">Question {index + 1}</span>
                </div>
                <p className="question-text">{question.question}</p>
                <div className="options-list">
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="option-item">
                      <input
                        type="radio"
                        id={`q${index}-opt${optIndex}`}
                        name={`question-${index}`}
                      />
                      <label htmlFor={`q${index}-opt${optIndex}`}>
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="action-buttons">
            <button className="download-btn" onClick={downloadAssignment}>
              Download Assignment
            </button>
            <button className="print-btn" onClick={printAssignment}>
              Print Assignment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deepseek;