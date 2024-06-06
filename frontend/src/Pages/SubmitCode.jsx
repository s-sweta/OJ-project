import React, { useState } from 'react';
import axios from 'axios';

const SubmitCode = ({ match }) => {
  const { userId, problemId } = match.params;
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`/submit/${userId}/${problemId}`, { language, code });
      console.log(response.data);
      // Handle success
    } catch (error) {
      setError(error.response.data.error);
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Submit Code</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="language">Select Language:</label>
          <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>
        <div>
          <label htmlFor="code">Enter Your Code:</label>
          <textarea id="code" rows="10" cols="50" value={code} onChange={(e) => setCode(e.target.value)}></textarea>
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit" disabled={loading}>Submit</button>
      </form>
    </div>
  );
};

export default SubmitCode;
