import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './App.css'

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/run', {
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
    <div>
      <h1>Code Runner</h1>
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
  );
}
export default App;
// ReactDOM.render(<App />, document.getElementById('root'));