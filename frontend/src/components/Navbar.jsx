import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate} from 'react-router-dom';
import '../CSS/Navbar.css'

export default function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState([]);
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:5000/loggedIn')
        .then(response => {
          setUser(response.data)
          setIsLogged(true)
        })
        .catch(error => {
          console.error('Error getting user:', error)
          setIsLogged(false)
        });
      }, [])

    const logout = () => {
        axios.get('http://localhost:5000/logout')
        .then(response => {
          setUser([])
          setIsLogged(false)
          navigate("/");
        })
        .catch(error => {
          console.error('Error logging out:', error)
        });
    };

    return (
        <nav>
            <Link to="/">Home</Link>
            {isLogged ? (
                <>
                    <button onClick={logout}>Logout</button>
                    <Link to="/dashboard"><span>{user.name}</span></Link>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            )}
            <Link to="/problems">Problem List</Link>
        </nav>
    );
}