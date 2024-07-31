import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faUser, faSignOutAlt, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import '../CSS/dashboard.css';

// Register components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/loggedIn', { withCredentials: true })
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
      fetchAnalytics();
    }
  }, [user]);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.post(`/submit/${user.id}`, {}, { withCredentials: true });
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
      const response = await axios.get(`/submit/problem/${user.id}`, { withCredentials: true });
      if (response.data.success) {
        setSolvedProblems(response.data.solvedProblems);
      } else {
        console.error('Failed to fetch solved problems');
      }
    } catch (error) {
      console.error('Error fetching solved problems:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`/submit/analytics/${user.id}`, { withCredentials: true });
      if (response.data.success) {
        setAnalytics(response.data.analytics);
      } else {
        console.error('Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const logout = () => {
    axios.get('/logout', { withCredentials: true })
      .then(response => {
        setUser(null);
        setIsLogged(false);
        navigate("/");
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  };

  // Bar chart data for solved problems by difficulty
  const barChartData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        label: 'Solved Problems',
        data: [analytics.easy || 0, analytics.medium || 0, analytics.hard || 0],
        backgroundColor: ['#5CB85C', '#F0AD4E', '#D9534F'],
        borderColor: ['#5CB85C', '#F0AD4E', '#D9534F'], 
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Solved Problems by Difficulty',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0, 
        },
      },
    },
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

          <div className="analytics">
            <h3>Analytics</h3>
            <p>Total Solved Problems: {analytics.totalSolved}</p>
            <Bar data={barChartData} options={barChartOptions} />
          </div>

          <div className="solved-problems">
            <h3><FontAwesomeIcon icon={faTrophy} /> Solved Problems</h3>
            <ul>
              {solvedProblems.length > 0 ? (
                solvedProblems.map((problem, index) => (
                  <li key={index}>
                    <b>{problem.title}</b> 
                    <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
                    <span className="submission-date">{new Date(problem.latestSubmission.submissionDateTime).toLocaleString()}</span>
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
                    <b>{submission.problemId.title}</b>  
                    <span className={`verdict ${submission.verdict.toLowerCase()}`}>{submission.verdict}</span>
                    <span className="submission-date">{new Date(submission.submissionDateTime).toLocaleString()}</span>
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
