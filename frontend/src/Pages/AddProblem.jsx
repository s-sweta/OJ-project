import React, { useState } from 'react';
import axios from 'axios';
import '../CSS/addProblem.css';

const AddProblem = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        difficulty: '',
        sampleInput: '',
        sampleOutput: '',
        testCases: [],
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
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

    const handleTestCaseChange = (index, field, value) => {
        const updatedTestCases = [...formData.testCases];
        updatedTestCases[index][field] = value;
        setFormData({
            ...formData,
            testCases: updatedTestCases,
        });
    };

    const handleAddTestCase = () => {
        setFormData({
            ...formData,
            testCases: [...formData.testCases, { input: '', expectedOutput: '' }],
        });
    };

    return (
        <div className="add-problem-container">
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

                <label>Sample Input:</label>
                <textarea name="sampleInput" value={formData.sampleInput} onChange={handleInputChange}></textarea>

                <label>Sample Output:</label>
                <textarea name="sampleOutput" value={formData.sampleOutput} onChange={handleInputChange}></textarea>

                <div className="test-cases">
                    {formData.testCases.map((testCase, index) => (
                        <div key={index} className="test-case">
                            <input
                                type="text"
                                value={testCase.input}
                                onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                                placeholder="Test Case Input"
                            />
                            <input
                                type="text"
                                value={testCase.expectedOutput}
                                onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                                placeholder="Expected Output"
                            />
                        </div>
                    ))}
                    <button type="button" onClick={handleAddTestCase}>Add Test Case</button>
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default AddProblem;
