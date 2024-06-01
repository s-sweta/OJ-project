import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../CSS/ProblemList.css'; 

const ProblemList = () => {
    const [problems, setProblems] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/problems')
            .then(response => {
                setProblems(response.data);
            })
            .catch(error => {
                console.error('Error fetching problems:', error);
            });
    }, []);

    const handleDelete = async (id) => {
        // Ask the user to confirm the deletion
        const confirmDelete = window.confirm('Are you sure you want to delete this problem?');
        if (!confirmDelete) {
            return; // If user cancels, do nothing
        }

        try {
            await axios.delete(`http://localhost:5000/problems/${id}`);
            // Update state by removing the deleted problem
            setProblems(problems.filter(problem => problem._id !== id));
            console.log('Problem deleted successfully');
        } catch (error) {
            console.error('Error deleting problem:', error);
        }
    };

    return (
        <div className='problem-list'>
            <h1>Problem List</h1>
            <ul className='problem'>
                {problems.map(problem => (
                    <li key={problem._id}>
                        <h2>{problem.title}</h2>
                        
                        <Link to={`/run/${problem._id}`}>Solve</Link>
                        <Link to={`/problems/${problem._id}`}>Edit</Link>
                        <button onClick={() => handleDelete(problem._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProblemList;


