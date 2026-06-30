import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const DashboardPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [topics, setTopics] = useState([]);
    const [search, setSearch] = useState('');
    const [phaseFilter, setPhaseFilter] = useState('All');
    
    const [showModal, setShowModal] = useState(false);
    const [newTopic, setNewTopic] = useState({ title: '', phase: 'P1', concepts: '', lectureUrl: '' });

    const fetchDashboardData = async () => {
        try {
            const courseRes = await api.get(`/courses/${courseId}`);
            setCourse(courseRes.data);
            
            const topicsRes = await api.get(`/topics/course/${courseId}`);
            setTopics(topicsRes.data);
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [courseId]);

    const handleCreateTopic = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/topics/course/${courseId}`, newTopic);
            setShowModal(false);
            setNewTopic({ title: '', phase: 'P1', concepts: '', lectureUrl: '' });
            fetchDashboardData();
        } catch (error) {
            console.error("Failed to create topic", error);
            alert("Error adding topic: " + (error.response?.data?.message || error.message));
        }
    };

    const toggleTopicProgress = async (topicId, field, currentValue) => {
        const topic = topics.find(t => t.id === topicId);
        const updated = { ...topic, [field]: !currentValue };
        try {
            await api.put(`/topics/${topicId}`, updated);
            fetchDashboardData();
        } catch (error) {
            console.error("Failed to update progress", error);
        }
    };

    if (!course) return <div className="page-wrapper">Loading...</div>;

    const filteredTopics = topics.filter(t => 
        (phaseFilter === 'All' || t.phase === phaseFilter) && 
        (t.title.toLowerCase().includes(search.toLowerCase()) || (t.concepts && t.concepts.toLowerCase().includes(search.toLowerCase())))
    );

    const totalProblems = topics.reduce((acc, t) => acc + (t.problems ? t.problems.length : 0), 0);
    const solvedProblems = topics.reduce((acc, t) => acc + (t.problems ? t.problems.filter(p => p.solved).length : 0), 0);
    const progressPercent = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;
    
    const daysDone = topics.filter(t => t.dayDone).length;
    const lecturesDone = topics.filter(t => t.lectureDone).length;
    // Mock revisions done for now, could be fetched from API
    const revisionsDone = 0;

    const StatCard = ({ label, value }) => (
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '5px' }}>{value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>{label}</div>
        </div>
    );

    return (
        <div className="page-wrapper animate-fade-in" style={{ maxWidth: '1200px' }}>
            {/* Top Stats */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <StatCard label="DAYS DONE" value={daysDone} />
                <StatCard label="LECTURES" value={lecturesDone} />
                <StatCard label="SOLVED" value={solvedProblems} />
                <StatCard label="REVISIONS DONE" value={revisionsDone} />
            </div>

            {/* Overall Progress */}
            <div className="glass-panel" style={{ padding: '25px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Overall Progress</span>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{progressPercent}%</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>{solvedProblems} of {totalProblems} problems solved</div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progressPercent}%`, background: 'var(--accent-primary)', transition: 'width 0.5s ease' }}></div>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '15px', top: '10px', color: 'var(--text-secondary)' }}>🔍</span>
                        <input 
                            type="text" 
                            className="glass-input" 
                            placeholder="Search topics, day or problem..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ paddingLeft: '40px', width: '280px', borderRadius: '30px' }}
                        />
                    </div>
                    {['All Days', 'Phase 1', 'Phase 2', 'Phase 3', 'Phase 4'].map((phase, idx) => {
                        const phaseCode = phase === 'All Days' ? 'All' : 'P' + idx;
                        const isActive = phaseFilter === phaseCode;
                        return (
                            <button 
                                key={phase}
                                className="glass-button"
                                style={{ 
                                    background: isActive ? 'var(--accent-primary)' : 'transparent', 
                                    color: isActive ? '#000' : 'var(--text-secondary)',
                                    border: isActive ? 'none' : '1px solid var(--border-color)',
                                    borderRadius: '30px', padding: '8px 20px', boxShadow: 'none'
                                }}
                                onClick={() => setPhaseFilter(phaseCode)}
                            >
                                {phase}
                            </button>
                        );
                    })}
                </div>
                <div>
                    <button className="glass-button secondary" onClick={() => setShowModal(true)} style={{ marginRight: '15px' }}>+ Add Topic</button>
                    <button className="glass-button" style={{ background: '#fff', color: '#000' }}>▶ Full Playlist</button>
                </div>
            </div>

            {/* Topics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                {filteredTopics.map((topic, index) => {
                    const probCount = topic.problems ? topic.problems.length : 0;
                    const solvedCount = topic.problems ? topic.problems.filter(p => p.solved).length : 0;
                    const easyCount = topic.problems ? topic.problems.filter(p => p.difficulty === 'Easy').length : 0;
                    const medCount = topic.problems ? topic.problems.filter(p => p.difficulty === 'Medium').length : 0;
                    const hardCount = topic.problems ? topic.problems.filter(p => p.difficulty === 'Hard').length : 0;
                    const topicProgress = probCount > 0 ? Math.round((solvedCount / probCount) * 100) : 0;

                    const conceptsList = topic.concepts ? topic.concepts.split(',').map(c => c.trim()) : [];
                    
                    return (
                        <div key={topic.id} className="glass-panel" style={{ padding: '25px', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
                                <div style={{ background: 'rgba(0, 223, 162, 0.1)', color: 'var(--accent-primary)', width: '35px', height: '35px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '15px' }}>
                                    {index + 1}
                                </div>
                                <h3 style={{ fontSize: '1.2rem', margin: 0, flex: 1 }}>{topic.title}</h3>
                                <span style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-secondary)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>{topic.phase}</span>
                            </div>
                            
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '10px' }}>CONCEPTS</div>
                            <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', minHeight: '60px' }}>
                                {conceptsList.map((concept, i) => (
                                    <li key={i} style={{ marginBottom: '5px' }}><span style={{ color: 'var(--accent-primary)', marginRight: '8px' }}>›</span> {concept}</li>
                                ))}
                            </ul>

                            <button className="glass-button" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: 'none', alignSelf: 'flex-start', padding: '6px 15px', fontSize: '0.85rem', marginBottom: '25px' }}>
                                ▶ Add Lecture URL
                            </button>
                            
                            <div style={{ marginTop: 'auto' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                    <span>{solvedCount}/{probCount} solved</span>
                                    <span style={{ color: 'var(--accent-primary)' }}>{topicProgress}%</span>
                                </div>
                                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', marginBottom: '10px' }}>
                                    <div style={{ height: '100%', width: `${topicProgress}%`, background: 'var(--accent-primary)' }}></div>
                                </div>
                                <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                    <span style={{ color: 'var(--success)' }}>✓ {easyCount} Easy</span>
                                    <span style={{ color: 'var(--warning)' }}>♦ {medCount} Med</span>
                                    <span style={{ color: 'var(--danger)' }}>★ {hardCount} Hard</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '25px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input type="checkbox" checked={topic.lectureDone} onChange={() => toggleTopicProgress(topic.id, 'lectureDone', topic.lectureDone)} style={{accentColor: 'var(--accent-primary)'}} /> Lecture
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input type="checkbox" checked={topic.practiceDone} onChange={() => toggleTopicProgress(topic.id, 'practiceDone', topic.practiceDone)} style={{accentColor: 'var(--accent-primary)'}} /> Practice
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input type="checkbox" checked={topic.dayDone} onChange={() => toggleTopicProgress(topic.id, 'dayDone', topic.dayDone)} style={{accentColor: 'var(--accent-primary)'}} /> Day ✓
                                    </label>
                                </div>
                                <button 
                                    className="glass-button" 
                                    style={{ background: 'transparent', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', padding: '6px 15px', fontSize: '0.85rem' }}
                                    onClick={() => navigate(`/topics/${topic.id}/problems`)}
                                >
                                    View Problems ({probCount}) →
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="glass-panel modal-content" style={{ background: '#1a1f2e' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Add Topic</h2>
                            <button className="modal-close" style={{ position: 'static' }} onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleCreateTopic}>
                            <div className="form-group">
                                <label>TOPIC TITLE *</label>
                                <input type="text" className="glass-input" required value={newTopic.title} onChange={e => setNewTopic({...newTopic, title: e.target.value})} placeholder="e.g. Arrays Basics" />
                            </div>
                            <div className="form-group">
                                <label>PHASE</label>
                                <select className="glass-input" value={newTopic.phase} onChange={e => setNewTopic({...newTopic, phase: e.target.value})}>
                                    <option value="P1">P1</option>
                                    <option value="P2">P2</option>
                                    <option value="P3">P3</option>
                                    <option value="P4">P4</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>CONCEPTS (comma separated)</label>
                                <input type="text" className="glass-input" value={newTopic.concepts} onChange={e => setNewTopic({...newTopic, concepts: e.target.value})} placeholder="Array Traversal, Prefix Sum" />
                            </div>
                            <div className="form-group">
                                <label>LECTURE URL</label>
                                <input type="text" className="glass-input" value={newTopic.lectureUrl} onChange={e => setNewTopic({...newTopic, lectureUrl: e.target.value})} placeholder="https://..." />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                                <button type="button" className="glass-button secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="glass-button" style={{ background: 'var(--accent-primary)', color: '#000' }}>Add Topic</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
