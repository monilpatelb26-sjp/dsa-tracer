import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    
    const { login, register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await login(email, password);
                navigate('/courses');
            } else {
                if (password !== confirmPassword) {
                    setError('Passwords do not match');
                    return;
                }
                await register(email, password);
                setIsLogin(true);
                setError('Registration successful, please login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, position: 'relative' }}>
            <div className="auth-aura"></div>
            <div className="glass-panel animate-fade-in" style={{ padding: '45px', width: '100%', maxWidth: '420px', zIndex: 1 }}>
                <h2 className="text-gradient" style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                
                {error && <div style={{ color: 'var(--danger)', marginBottom: '20px', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.9rem', fontWeight: 500 }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            className="glass-input" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            className="glass-input" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input 
                                type="password" 
                                className="glass-input" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <button type="submit" className="glass-button" style={{ width: '100%', marginTop: '10px' }}>
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)' }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span 
                        style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 'bold' }} 
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;