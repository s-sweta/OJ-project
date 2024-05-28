// ProblemList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from React Router
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

    return (
        <div>
            <h1>Problem List</h1>
            <ul>
                {problems.map(problem => (
                    <li key={problem._id}>
                        <h2>{problem.title}</h2>
                        <p>{problem.description}</p>
                        {/* Use Link component to navigate to edit page */}
                        <Link to={`/problems/${problem._id}`}>Edit</Link>
                        <button>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProblemList;
