import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newCourse, setNewCourse] = useState({ name: '', description: '', iconEmoji: '🧠', badge: 'NEW' });
    const navigate = useNavigate();

    const fetchCourses = async () => {
        try {
            const res = await api.get('/courses');
            setCourses(res.data);
        } catch (error) {
            console.error("Failed to fetch courses", error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            await api.post('/courses', newCourse);
            setShowModal(false);
            fetchCourses();
        } catch (error) {
            console.error("Failed to create course", error);
        }
    };

    return (
        <div className="page-wrapper animate-fade-in" style={{ maxWidth: '1000px' }}>
            <div style={{ marginBottom: '40px' }}>
                <span className="badge new" style={{ marginBottom: '15px', display: 'inline-block' }}>📚 LEARNING HUB</span>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px' }}>Choose Your Track</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Select a course to start your structured DSA journey.</p>
                <button className="glass-button secondary" onClick={() => setShowModal(true)} style={{ marginTop: '20px' }}>+ Add Custom Course</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
                {courses.map(course => (
                    <div key={course.id} className="glass-panel" style={{ padding: '30px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                        {course.badge && <span className={`badge ${course.badge.toLowerCase() === 'ongoing' ? 'success' : 'new'}`} style={{ position: 'absolute', top: '30px', right: '30px', background: 'transparent', border: `1px solid ${course.badge.toLowerCase() === 'ongoing' ? 'var(--accent-primary)' : 'var(--info)'}`, color: course.badge.toLowerCase() === 'ongoing' ? 'var(--accent-primary)' : 'var(--info)' }}>{course.badge.toUpperCase()}</span>}
                        <div style={{ fontSize: '2.5rem', marginBottom: '20px', background: 'rgba(255,255,255,0.05)', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
                            {course.iconEmoji || '🧠'}
                        </div>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>{course.name}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', minHeight: '40px' }}>
                            {course.description}
                        </p>
                        
                        <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '30px', flex: 1 }}>
                            <li style={{ marginBottom: '8px' }}>• Structured step-by-step path</li>
                            <li style={{ marginBottom: '8px' }}>• LeetCode problem sets</li>
                            <li style={{ marginBottom: '8px' }}>• Spaced repetition revision</li>
                            <li style={{ marginBottom: '8px' }}>• Notes per problem</li>
                        </ul>

                        <button 
                            className="glass-button" 
                            style={{ width: '100%', background: course.badge?.toLowerCase() === 'ongoing' ? 'var(--accent-primary)' : 'transparent', color: course.badge?.toLowerCase() === 'ongoing' ? '#000' : 'var(--text-primary)', border: course.badge?.toLowerCase() === 'ongoing' ? 'none' : '1px solid var(--border-color)', boxShadow: 'none' }}
                            onClick={() => navigate(`/courses/${course.id}/dashboard`)}
                        >
                            View Course →
                        </button>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="glass-panel modal-content" style={{ background: '#1a1f2e' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Add Custom Course</h2>
                            <button className="modal-close" style={{ position: 'static' }} onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleCreateCourse}>
                            <div className="form-group">
                                <label>COURSE NAME *</label>
                                <input type="text" className="glass-input" required value={newCourse.name} onChange={e => setNewCourse({...newCourse, name: e.target.value})} placeholder="e.g. Master DSA 360" />
                            </div>
                            <div className="form-group">
                                <label>DESCRIPTION</label>
                                <input type="text" className="glass-input" value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} />
                            </div>
                            <div className="form-group" style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <label>ICON EMOJI</label>
                                    <input type="text" className="glass-input" value={newCourse.iconEmoji} onChange={e => setNewCourse({...newCourse, iconEmoji: e.target.value})} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label>BADGE</label>
                                    <input type="text" className="glass-input" value={newCourse.badge} onChange={e => setNewCourse({...newCourse, badge: e.target.value})} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                                <button type="button" className="glass-button secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="glass-button" style={{ background: 'var(--accent-primary)', color: '#000' }}>Add Course</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoursesPage;
