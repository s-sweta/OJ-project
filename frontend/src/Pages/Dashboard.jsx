import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faUser, faSignOutAlt, faTrophy } from '@fortawesome/free-solid-svg-icons';
import '../CSS/dashboard.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/loggedIn', { withCredentials: true })
      .then(response => {
        if (response.data.success) {
          setUser(response.data.user);
          setIsLogged(true);
        } else {
          setIsLogged(false);
        }
      })
      .catch(error => {
        console.error('Error getting user:', error);
        setIsLogged(false);
      });
  }, []);

  useEffect(() => {
    if (user && user.id) {
      fetchSubmissions();
      fetchSolvedProblems();
    }
  }, [user]);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/submit/${user.id}`, {}, { withCredentials: true });
      if (response.data.success) {
        setSubmissions(response.data.submissions);
      } else {
        console.error('Failed to fetch submissions');
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const fetchSolvedProblems = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/submit/problem/${user.id}`, { withCredentials: true });
      if (response.data.success) {
        setSolvedProblems(response.data.solvedProblems);
      } else {
        console.error('Failed to fetch solved problems');
      }
    } catch (error) {
      console.error('Error fetching solved problems:', error);
    }
  };

  const logout = () => {
    axios.get('http://localhost:5000/logout', { withCredentials: true })
      .then(response => {
        setUser(null);
        setIsLogged(false);
        navigate("/");
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  };

  return (
    <>
      {isLogged ? (
        <div className="container">
          <div className="header">
            <Link to="/addProblem" className="add-problem-link">
              <FontAwesomeIcon icon={faPlusCircle} /> Add Problem
            </Link>
            <h1>Dashboard</h1>
            <button className="logout-link" onClick={logout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </button>
          </div>
          <div className="user-info">
            <FontAwesomeIcon icon={faUser} className="user-icon" />
            <h2>{user.name}</h2>
            <h3>@{user.username}</h3>
          </div>
          <div className="solved-problems">
            <h3><FontAwesomeIcon icon={faTrophy} /> Solved Problems</h3>
            <ul>
              {solvedProblems.length > 0 ? (
                solvedProblems.map((problem, index) => (
                  <li key={index}>
                    <b>{problem.title}</b> 
                    <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
                    <button
                      className="view-button"
                      onClick={() => navigate(`/problem/${problem.problemId}`, {
                        state: {
                          language: problem.latestSubmission.language,
                          code: problem.latestSubmission.code,
                        }
                      })}
                    >
                      View
                    </button>
                  </li>
                ))
              ) : (
                <p className="no-data">No solved problems yet.</p>
              )}
            </ul>
          </div>
          <div className="submissions">
            <h3>All Submissions</h3>
            <ul>
              {submissions.length > 0 ? (
                submissions.map((submission, index) => (
                  <li key={index}>
                    <b>{submission.problemId.title}</b>  <span className={`verdict ${submission.verdict.toLowerCase()}`}>{submission.verdict}</span>
                    <button
                      className="view-button"
                      onClick={() => navigate(`/problem/${submission.problemId._id}`, {
                        state: {
                          language: submission.language,
                          code: submission.code,
                        }
                      })}
                    >
                      View
                    </button>
                  </li>
                ))
              ) : (
                <p className="no-data">No submissions yet.</p>
              )}
            </ul>
          </div>
        </div>
      ) : (
        <Link to="/login" className="login-link">Login</Link>
      )}
    </>
  );
}
