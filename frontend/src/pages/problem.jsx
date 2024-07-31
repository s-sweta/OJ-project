// ProblemPage Component
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom"; // Import useLocation to get state
import Select from 'react-select';
import '../CSS/problem.css';
import Editor from "@monaco-editor/react";

const ProblemPage = () => {
    const { id: problemId } = useParams();
    const location = useLocation(); // Retrieve state from navigation

    const [user, setUser] = useState(null);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('cpp');
    const [userTheme, setUserTheme] = useState("vs-dark");
    const [fontSize, setFontSize] = useState(20);
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [verdict, setVerdict] = useState('');
    const [isSolved, setIsSolved] = useState(false); 
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [sampleInput, setSampleInput] = useState('');
    const [sampleOutput, setSampleOutput] = useState('');
    const [constraints, setConstraints] = useState('');
    const [inputFormat, setInputFormat] = useState('');
    const [outputFormat, setOutputFormat] = useState('');
    const [testcases, setTestcases] = useState([]); 

    const options = { fontSize: fontSize };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/loggedIn', { withCredentials: true });
                setUser(response.data.user);
            } catch (error) {
                console.error('Error getting user:', error);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/problems/${problemId}`, { withCredentials: true });
                const { title, description, difficulty, sampleInput, sampleOutput, constraints, inputFormat, outputFormat, testCases } = response.data;
                setTitle(title);
                setDescription(description);
                setDifficulty(difficulty);
                setSampleInput(sampleInput);
                setSampleOutput(sampleOutput);
                setConstraints(constraints);
                setInputFormat(inputFormat);
                setOutputFormat(outputFormat);
                setTestcases(testCases); // Set combined test cases
            } catch (error) {
                console.error("Error fetching problem:", error);
            }
        };
        fetchData();

        // Set the initial code and language from the location state if available
        if (location.state) {
            setCode(location.state.code || '');
            setLanguage(location.state.language || 'cpp');
        }
    }, [problemId, location.state]);

    const handleRun = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_CODE_URL}/run`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ language, code, input }),
            });
            const data = await response.json();
            if (data.success) {
                setOutput(data.output);
                setError('');
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleCodeSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError("Please log in to submit your code.");
            return;
        }
    
        let verdict = "Runtime Error"; 
        let isSolved = false; 
    
        try {
            const response = await fetch(`${import.meta.env.VITE_CODE_URL}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ language, code, testcases }),
            });
            const data = await response.json();
            if (data.success) {
                verdict = data.output;
                isSolved = verdict === 'Accepted';
                setVerdict(verdict);
                setError('');
                setIsSolved(isSolved);
            } else {
                verdict = data.message;
                setVerdict(verdict);
                setError(verdict);
                setIsSolved(false);
            }
        } catch (error) {
            verdict = "Runtime Error";
            setVerdict(verdict);
            setError(error.message);
            setIsSolved(false);
        }
    
        try {
            await axios.post(`/submit/${problemId}/${user.id}`, {
                language,
                code,
                verdict,
                isSolved
            }, { withCredentials: true });
        } catch (submitError) {
            console.error('Error submitting solution:', submitError);
        }
    };
    
    const languages = [
        { value: "c", label: "C" },
        { value: "cpp", label: "C++" },
        { value: "py", label: "Python" },
    ];

    const themes = [
        { value: "vs-dark", label: "Dark" },
        { value: "light", label: "Light" },
    ];

    return (
        <div className="problem-page">
            <div className="problem-details">
                <h2>{title}</h2>
                <p><b>Description: </b><br />{description}</p>
                <p><b>Difficulty: </b><br />{difficulty}</p>
                <p><b>Sample Input: </b><br />{sampleInput}</p>
                <p><b>Sample Output: </b><br />{sampleOutput}</p>
                <p><b>Constraints: </b><br />{constraints}</p>
                <p><b>Input Format: </b><br />{inputFormat}</p>
                <p><b>Output Format: </b><br />{outputFormat}</p>
            </div>
            <div className="code-compiler">
                <div className="theme-language-selector">
                    <Select
                        options={languages}
                        value={languages.find((lang) => lang.value === language)}
                        onChange={(e) => setLanguage(e.value)}
                        placeholder="Select Language"
                    />
                    <Select
                        options={themes}
                        value={themes.find((theme) => theme.value === userTheme)}
                        onChange={(e) => setUserTheme(e.value)}
                        placeholder="Select Theme"
                    />
                    <label>Font Size</label>
                    <input
                        type="range"
                        min="16"
                        max="30"
                        value={fontSize}
                        step="1"
                        onChange={(e) => { setFontSize(e.target.value) }}
                    />
                </div>
                <div className="editor">
                    <div className="right-container">
                        <Editor
                            options={options}
                            height="60vh"
                            width="100%"
                            theme={userTheme}
                            language={language}
                            defaultLanguage="cpp"
                            value={code} // Set the editor's value to the initial code
                            onChange={(value) => { setCode(value) }}
                        />
                        <button className="run-btn" onClick={handleRun}>Run</button>
                        <button className="run-btn" onClick={handleCodeSubmit}>Submit Code</button>
                        {verdict && (
                            <div className="verdict-box">
                                <h4>Verdict:</h4>
                                <pre className={`${verdict.toLowerCase()}`}>{verdict}</pre>
                            </div>
                        )}
                        <div className="input-output-container">
                            <div className="input-box">
                                <h4>Input:</h4>
                                <textarea id="code-inp" onChange={(e) => setInput(e.target.value)}></textarea>
                            </div>
                            <div className="output-box">
                                <h4>Output:</h4>
                                <pre>{output}</pre>
                                {error && <div className="error-message">{error}</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default ProblemPage;
