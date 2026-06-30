import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    if (!user) return null;

    return (
        <nav className="navbar">
            <Link to="/courses" className="navbar-brand text-gradient-accent">DSAMaster</Link>
            <div className="navbar-links">
                <Link to="/courses" className="glass-button secondary">Courses</Link>
                <Link to="/calendar" className="glass-button secondary">Calendar</Link>
                <button onClick={handleLogout} className="glass-button">Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
