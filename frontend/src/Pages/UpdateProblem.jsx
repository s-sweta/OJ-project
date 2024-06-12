import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../CSS/updateProblem.css';

const UpdateProblem = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get problem ID from URL params

  // State for form values
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [sampleInput, setSampleInput] = useState("");
  const [sampleOutput, setSampleOutput] = useState("");
  const [constraints, setConstraints] = useState("");
  const [inputFormat, setInputFormat] = useState("");
  const [outputFormat, setOutputFormat] = useState("");
  
  // State for test cases
  const [testCases, setTestCases] = useState([{ input: '', expectedOutput: '' }]);

  // Effect to fetch problem details on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/problems/${id}`, {
          withCredentials: true,
        });
        const { title, description, difficulty, sampleInput, sampleOutput, constraints, inputFormat, outputFormat, testCases } = response.data;
        
        setTitle(title);
        setDescription(description);
        setDifficulty(difficulty);
        setSampleInput(sampleInput);
        setSampleOutput(sampleOutput);
        setConstraints(constraints);
        setInputFormat(inputFormat);
        setOutputFormat(outputFormat);
        setTestCases(testCases || [{ input: '', expectedOutput: '' }]); // Initialize test cases, or set empty array if not provided
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    };
    fetchData();
  }, [id]); // Dependency array to re-run effect when ID changes

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProblem = { title, description, difficulty, sampleInput, sampleOutput, constraints, inputFormat, outputFormat, testCases };
    try {
      // Send PUT request to update problem
      await axios.put(`http://localhost:5000/problems/${id}`, updatedProblem, {
        withCredentials: true, // Include cookies in request
      });
      console.log("Problem Successfully Updated");
      navigate("/problems"); // Navigate to problem list after successful update
    } catch (error) {
      console.error("Error updating problem:", error);
    }
  };

  // Function to handle changes in test case input fields
  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...testCases];
    updatedTestCases[index][field] = value;
    setTestCases(updatedTestCases);
  };

  // Function to add new test case
  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '' }]);
  };

  return (
    <div className="update-form-container">
      <h2>Update Problem</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="title">
            Title:
          </label>
          <input
            className="form-input"
            type="text"
            name="title"
            value={title}
            placeholder="Enter Update Title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="description">
            Description:
          </label>
          <textarea
            className="form-input"
            name="description"
            value={description}
            placeholder="Enter update description"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="difficulty">
            Difficulty:
          </label>
          <select
            className="form-select"
            name="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="">Select difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="sampleInput">
            Sample Input:
          </label>
          <textarea
            className="form-input"
            name="sampleInput"
            value={sampleInput}
            placeholder="Enter sample input"
            onChange={(e) => setSampleInput(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="sampleOutput">
            Sample Output:
          </label>
          <textarea
            className="form-input"
            name="sampleOutput"
            value={sampleOutput}
            placeholder="Enter sample output"
            onChange={(e) => setSampleOutput(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="constraints">
            Constraints:
          </label>
          <textarea
            className="form-input"
            name="constraints"
            value={constraints}
            placeholder="Enter constraints"
            onChange={(e) => setConstraints(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="inputFormat">
            Input Format:
          </label>
          <textarea
            className="form-input"
            name="inputFormat"
            value={inputFormat}
            placeholder="Enter input format"
            onChange={(e) => setInputFormat(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="outputFormat">
            Output Format:
          </label>
          <textarea
            className="form-input"
            name="outputFormat"
            value={outputFormat}
            placeholder="Enter output format"
            onChange={(e) => setOutputFormat(e.target.value)}
          />
        </div>
        <div className="test-cases">
          {testCases.map((testCase, index) => (
            <div key={index} className="test-case">
              <textarea
                value={testCase.input}
                onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                placeholder="Test Case Input"
              />
              <textarea
                value={testCase.expectedOutput}
                onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                placeholder="Expected Output"
              />
            </div>
          ))}
          <button className='test-case-button' type="button" onClick={handleAddTestCase}>Add Test Case</button>
        </div>

        
        <button className="submit-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default UpdateProblem;
