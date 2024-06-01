import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProblem = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get problem ID from URL params

  // State for form values
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("");

  // Effect to fetch problem details on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/problems/${id}`, {
          withCredentials: true,
        });
        const { title, description, difficulty } = response.data;
        
        setTitle(title);
        setDescription(description);
        setDifficulty(difficulty);
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    };
    fetchData();
  }, [id]); // Dependency array to re-run effect when ID changes

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProblem = { title, description, difficulty };
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
        <button className="submit-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default UpdateProblem;

