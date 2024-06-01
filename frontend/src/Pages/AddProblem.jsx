import React, { useState } from 'react';
import axios from 'axios';
import '../CSS/addProblem.css'

const AddProblem = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        difficulty: '',
        input: '',
        output: '',
        testcases: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/problems', formData);
            console.log('Problem successfully added:', response.data);
            // Display success message or redirect to problem list
        } catch (error) {
            console.error('Error adding problem:', error);
            // Display error message to user
        }
    };

    return (
        <div className='add-problem-container'>
            <h2>Add New Problem</h2>
            <form onSubmit={handleSubmit}>
                <label>Title:</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} />

                <label>Description:</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange}></textarea>

                <label>Difficulty:</label>
                <select name="difficulty" value={formData.difficulty} onChange={handleInputChange}>
                    <option value="">Select difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>

                <label>Input:</label>
                <textarea name="input" value={formData.input} onChange={handleInputChange}></textarea>

                <label>Output:</label>
                <textarea name="output" value={formData.output} onChange={handleInputChange}></textarea>

                <button type="submit">Submit</button>
            </form>
        </div>

    );
};

export default AddProblem;

