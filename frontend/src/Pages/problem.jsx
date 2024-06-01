import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ProblemPage = () => {
    const { id } = useParams(); 

    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('cpp');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState('');

    
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
    }, [id]); 


    const handleCodeChange = (e) => {
        setCode(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch('http://localhost:5000/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language, code }),
          });
          const data = await response.json();
          setOutput(data.output);
          setError('');
        } catch (error) {
          setError(error.message);
        }
      };

    return (
        <div className="problem-page">
            <div className="problem-details">
                <h2>{title}</h2>
                <p>Description: {description}</p>
                <p>Difficulty: {difficulty}</p>
            </div>
            <div>
                <form onSubmit={handleSubmit}>
                    <label>
                    Language:
                        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                    </select>
                    </label>
                    <br />
                    <textarea value={code} onChange={(e) => setCode(e.target.value)} />
                    <br />
                    <button type="submit">Run</button>
                </form>
                <div>
                    {output && <pre>{output}</pre>}
                    {error && <div style={{ color: 'ed' }}>{error}</div>}
                </div>
            </div>
        </div>
    );
}

export default ProblemPage;
