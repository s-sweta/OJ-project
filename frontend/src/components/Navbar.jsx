import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/userContext';
import '../CSS/Navbar.css'

export default function Navbar() {
    const { user, logout } = useUser();

    return (
        <nav>
            <Link to="/">Home</Link>
            {user ? (
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
