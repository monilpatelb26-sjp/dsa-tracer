import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Mail, Lock, AlertCircle } from 'lucide-react';

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, position: 'relative', overflow: 'hidden' }}>
            <div className="cyber-orb orb-1"></div>
            <div className="cyber-orb orb-2"></div>
            <div className="auth-aura"></div>
            
            <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="glass-panel" 
                style={{ padding: '50px 40px', width: '100%', maxWidth: '440px', zIndex: 1 }}
            >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <motion.div 
                        initial={{ rotate: -180, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ duration: 0.8, type: 'spring' }}
                        style={{ background: 'var(--accent-glow-blue)', padding: '20px', borderRadius: '50%', boxShadow: '0 0 30px var(--accent-glow-blue)' }}
                    >
                        {isLogin ? <LogIn size={40} color="var(--accent-primary)" /> : <UserPlus size={40} color="var(--accent-secondary)" />}
                    </motion.div>
                </div>
                
                <h2 className={isLogin ? "text-gradient-accent" : "text-gradient"} style={{ textAlign: 'center', marginBottom: '35px', fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>
                    {isLogin ? 'SYSTEM LOGIN' : 'INITIALIZE USER'}
                </h2>
                
                {error && (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ color: 'var(--danger)', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 0, 85, 0.1)', padding: '12px 15px', borderRadius: '10px', border: '1px solid rgba(255, 0, 85, 0.3)', fontSize: '0.9rem', fontWeight: 600 }}>
                        <AlertCircle size={18} /> {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ position: 'relative' }}>
                        <label>Email Identification</label>
                        <div style={{ position: 'relative' }}>
                            <Mail style={{ position: 'absolute', top: '15px', left: '15px', color: 'var(--text-secondary)' }} size={20} />
                            <input 
                                type="email" 
                                className="glass-input" 
                                style={{ paddingLeft: '45px' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="sys.admin@cyber.net"
                            />
                        </div>
                    </div>
                    
                    <div className="form-group" style={{ position: 'relative' }}>
                        <label>Security Key</label>
                        <div style={{ position: 'relative' }}>
                            <Lock style={{ position: 'absolute', top: '15px', left: '15px', color: 'var(--text-secondary)' }} size={20} />
                            <input 
                                type="password" 
                                className="glass-input" 
                                style={{ paddingLeft: '45px' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••••••"
                            />
                        </div>
                    </div>

                    {!isLogin && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="form-group" style={{ position: 'relative' }}>
                            <label>Confirm Security Key</label>
                            <div style={{ position: 'relative' }}>
                                <Lock style={{ position: 'absolute', top: '15px', left: '15px', color: 'var(--text-secondary)' }} size={20} />
                                <input 
                                    type="password" 
                                    className="glass-input" 
                                    style={{ paddingLeft: '45px' }}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    placeholder="••••••••••••"
                                />
                            </div>
                        </motion.div>
                    )}
                    
                    <motion.button 
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit" 
                        className="glass-button" 
                        style={{ width: '100%', marginTop: '20px', padding: '16px', fontSize: '1.1rem' }}
                    >
                        {isLogin ? 'AUTHENTICATE' : 'ESTABLISH LINK'}
                    </motion.button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '30px', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
                    {isLogin ? "No access token? " : "Already established? "}
                    <span 
                        style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }} 
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                    >
                        {isLogin ? 'Initialize' : 'Authenticate'}
                    </span>
                </p>
            </motion.div>
        </div>
    );
};

export default AuthPage;