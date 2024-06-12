
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../CSS/Navbar.css';

export default function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLogged, setIsLogged] = useState(false);
    const {  logout } = useAuth();

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

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/problems">Problem List</Link>
            {isLogged ? (
                <>
                    <Link to="/dashboard"><span>{user?.name}</span></Link>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to="/register">Register</Link>
                    <Link to="/login">Login</Link>
                </>
            )}
        </nav>
    );
}
