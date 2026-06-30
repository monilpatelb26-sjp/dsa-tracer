import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        const id = localStorage.getItem('id');
        if (token && email) {
            setUser({ token, email, id });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/signin', { email, password });
        const { token, id, email: userEmail } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('email', userEmail);
        localStorage.setItem('id', id);
        setUser({ token, email: userEmail, id });
    };

    const register = async (email, password) => {
        await api.post('/auth/signup', { email, password });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('id');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
