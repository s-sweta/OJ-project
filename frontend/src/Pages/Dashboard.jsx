import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom'
import '../CSS/dashboard.css'


export default function Dashboard() {
  const [user, setUser] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:5000/loggedIn')
    .then(response => {
      setUser(response.data)
    })
    .catch(error => {
      console.error('Error getting user:', error)
    });
  }, [])
    
  return (
    <div className='container'>
      <h1>Dashboard</h1>
      <h2>{user.name}</h2>
      <h3>{user.username}</h3>
      <h3>Solved Problems</h3>
      <ul>
        {user.solvedQuestions}
      </ul>
      <Link to = '/addProblem'>Add Problem </Link>
    </div>
  );
}
