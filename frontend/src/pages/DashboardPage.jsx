import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { motion } from 'framer-motion';
import { Calendar, Video, CheckCircle, RotateCw, Search, Plus, Play, ExternalLink } from 'lucide-react';

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

    if (!course) return <div className="page-wrapper" style={{textAlign: 'center', marginTop: '100px', fontSize: '2rem'}}>INITIALIZING SYSTEMS...</div>;

    const filteredTopics = topics.filter(t => 
        (phaseFilter === 'All' || t.phase === phaseFilter) && 
        (t.title.toLowerCase().includes(search.toLowerCase()) || (t.concepts && t.concepts.toLowerCase().includes(search.toLowerCase())))
    );

    const totalProblems = topics.reduce((acc, t) => acc + (t.problems ? t.problems.length : 0), 0);
    const solvedProblems = topics.reduce((acc, t) => acc + (t.problems ? t.problems.filter(p => p.solved).length : 0), 0);
    const progressPercent = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;
    
    const daysDone = topics.filter(t => t.dayDone).length;
    const lecturesDone = topics.filter(t => t.lectureDone).length;
    const revisionsDone = 0;

    const StatCard = ({ label, value, icon, color }) => (
        <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            className="glass-panel bento-item"
            style={{ borderTop: `2px solid ${color}` }}
        >
            <div style={{ color, marginBottom: '10px', filter: `drop-shadow(0 0 10px ${color})` }}>{icon}</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', marginBottom: '5px', textShadow: `0 0 15px ${color}` }}>{value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', letterSpacing: '2px', fontWeight: 800 }}>{label}</div>
        </motion.div>
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } }
    };

    return (
        <div className="page-wrapper" style={{ maxWidth: '1400px' }}>
            <div className="cyber-orb orb-1"></div>
            <div className="cyber-orb orb-2"></div>
            
            <motion.h1 
                initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
                className="text-gradient-accent" 
                style={{ fontSize: '3rem', marginBottom: '30px', textTransform: 'uppercase' }}
            >
                {course.title} // COMMAND CENTER
            </motion.h1>

            {/* Top Stats - BENTO GRID */}
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="bento-grid">
                <StatCard label="SYSTEM DAYS" value={daysDone} icon={<Calendar size={32} />} color="var(--accent-primary)" />
                <StatCard label="DATA STREAMS" value={lecturesDone} icon={<Video size={32} />} color="var(--accent-secondary)" />
                <StatCard label="MODULES SECURED" value={solvedProblems} icon={<CheckCircle size={32} />} color="var(--success)" />
                <StatCard label="REBOOT CYCLES" value={revisionsDone} icon={<RotateCw size={32} />} color="var(--warning)" />
            </motion.div>

            {/* Overall Progress */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="glass-panel" style={{ padding: '30px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '2px' }}>CORE DIRECTIVE PROGRESS</span>
                    <span className="text-gradient-accent" style={{ fontSize: '1.5rem' }}>{progressPercent}%</span>
                </div>
                <div style={{ width: '100%', height: '12px', background: 'rgba(0,0,0,0.5)', borderRadius: '10px', overflow: 'hidden', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)' }}>
                    <motion.div 
                        initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-secondary), var(--accent-primary))', boxShadow: '0 0 20px var(--accent-primary)' }}
                    ></motion.div>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '15px', fontWeight: 600 }}>{solvedProblems} / {totalProblems} MODULES ENCRYPTED</div>
            </motion.div>

            {/* Filters */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '15px', top: '15px', color: 'var(--accent-primary)' }} size={20} />
                        <input 
                            type="text" 
                            className="glass-input" 
                            placeholder="SCAN DIRECTORIES..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ paddingLeft: '45px', width: '320px', borderRadius: '12px' }}
                        />
                    </div>
                    {['All Days', 'Phase 1', 'Phase 2', 'Phase 3', 'Phase 4'].map((phase, idx) => {
                        const phaseCode = phase === 'All Days' ? 'All' : 'P' + idx;
                        const isActive = phaseFilter === phaseCode;
                        return (
                            <button 
                                key={phase}
                                className={`glass-button ${isActive ? '' : 'secondary'}`}
                                onClick={() => setPhaseFilter(phaseCode)}
                                style={{ padding: '12px 24px', borderRadius: '12px' }}
                            >
                                {phase}
                            </button>
                        );
                    })}
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button className="glass-button secondary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> INITIALIZE TOPIC
                    </button>
                    <button className="glass-button" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Play size={18} /> PLAYLIST STREAM
                    </button>
                </div>
            </div>

            {/* Topics Grid */}
            <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '30px' }}>
                {filteredTopics.map((topic, index) => {
                    const probCount = topic.problems ? topic.problems.length : 0;
                    const solvedCount = topic.problems ? topic.problems.filter(p => p.solved).length : 0;
                    const easyCount = topic.problems ? topic.problems.filter(p => p.difficulty === 'Easy').length : 0;
                    const medCount = topic.problems ? topic.problems.filter(p => p.difficulty === 'Medium').length : 0;
                    const hardCount = topic.problems ? topic.problems.filter(p => p.difficulty === 'Hard').length : 0;
                    const topicProgress = probCount > 0 ? Math.round((solvedCount / probCount) * 100) : 0;
                    const conceptsList = topic.concepts ? topic.concepts.split(',').map(c => c.trim()) : [];
                    
                    return (
                        <motion.div variants={itemVariants} key={topic.id} className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
                                <div style={{ background: 'rgba(0, 240, 255, 0.1)', color: 'var(--accent-primary)', width: '45px', height: '45px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem', marginRight: '15px', border: '1px solid rgba(0,240,255,0.3)', boxShadow: '0 0 15px rgba(0,240,255,0.2)' }}>
                                    {index + 1}
                                </div>
                                <h3 style={{ fontSize: '1.4rem', margin: 0, flex: 1, textTransform: 'uppercase', letterSpacing: '1px' }}>{topic.title}</h3>
                                <span style={{ background: 'rgba(188, 19, 254, 0.15)', color: 'var(--accent-secondary)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 900, border: '1px solid rgba(188,19,254,0.3)', boxShadow: '0 0 10px rgba(188,19,254,0.3)' }}>{topic.phase}</span>
                            </div>
                            
                            <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 900, letterSpacing: '2px', marginBottom: '12px' }}>DETECTED CONCEPTS</div>
                            <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '25px', minHeight: '60px' }}>
                                {conceptsList.map((concept, i) => (
                                    <li key={i} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                                        <div style={{ width: '6px', height: '6px', background: 'var(--accent-secondary)', borderRadius: '50%', boxShadow: '0 0 5px var(--accent-secondary)' }}></div> {concept}
                                    </li>
                                ))}
                            </ul>

                            <button className="glass-button secondary" style={{ alignSelf: 'flex-start', padding: '8px 18px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '30px' }}>
                                <Video size={16} color="var(--info)" /> ATTACH DATA STREAM
                            </button>
                            
                            <div style={{ marginTop: 'auto' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px', fontWeight: 800 }}>
                                    <span>{solvedCount}/{probCount} SECURED</span>
                                    <span style={{ color: 'var(--accent-primary)', textShadow: '0 0 10px var(--accent-primary)' }}>{topicProgress}%</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.5)', borderRadius: '3px', overflow: 'hidden', marginBottom: '15px' }}>
                                    <div style={{ height: '100%', width: `${topicProgress}%`, background: 'var(--accent-primary)', boxShadow: '0 0 10px var(--accent-primary)' }}></div>
                                </div>
                                <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', fontWeight: 800 }}>
                                    <span style={{ color: 'var(--success)' }}>E:{easyCount}</span>
                                    <span style={{ color: 'var(--warning)' }}>M:{medCount}</span>
                                    <span style={{ color: 'var(--danger)' }}>H:{hardCount}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', paddingTop: '25px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ display: 'flex', gap: '25px', fontSize: '0.85rem' }}>
                                    <label className="modern-checkbox">
                                        <input type="checkbox" checked={topic.lectureDone} onChange={() => toggleTopicProgress(topic.id, 'lectureDone', topic.lectureDone)} />
                                        <div className="checkmark"></div> LECTURE
                                    </label>
                                    <label className="modern-checkbox">
                                        <input type="checkbox" checked={topic.practiceDone} onChange={() => toggleTopicProgress(topic.id, 'practiceDone', topic.practiceDone)} />
                                        <div className="checkmark"></div> PRAC
                                    </label>
                                    <label className="modern-checkbox">
                                        <input type="checkbox" checked={topic.dayDone} onChange={() => toggleTopicProgress(topic.id, 'dayDone', topic.dayDone)} />
                                        <div className="checkmark"></div> DAY
                                    </label>
                                </div>
                                <button 
                                    className="glass-button" 
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 18px', fontSize: '0.85rem' }}
                                    onClick={() => navigate(`/topics/${topic.id}/problems`)}
                                >
                                    ACCESS <ExternalLink size={16} />
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {showModal && (
                <div className="modal-overlay">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel modal-content" style={{ background: 'rgba(10,10,15,0.95)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--accent-primary)', fontWeight: 900, textTransform: 'uppercase' }}>Initialize New Protocol</h2>
                            <button className="modal-close" style={{ position: 'static' }} onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleCreateTopic}>
                            <div className="form-group">
                                <label>PROTOCOL DESIGNATION *</label>
                                <input type="text" className="glass-input" required value={newTopic.title} onChange={e => setNewTopic({...newTopic, title: e.target.value})} placeholder="e.g. Arrays Basics" />
                            </div>
                            <div className="form-group">
                                <label>PHASE DIRECTIVE</label>
                                <select className="glass-input" value={newTopic.phase} onChange={e => setNewTopic({...newTopic, phase: e.target.value})} style={{ appearance: 'none' }}>
                                    <option value="P1">P1 - CORE</option>
                                    <option value="P2">P2 - ADVANCED</option>
                                    <option value="P3">P3 - EXPERT</option>
                                    <option value="P4">P4 - MASTER</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>DETECTED CONCEPTS</label>
                                <input type="text" className="glass-input" value={newTopic.concepts} onChange={e => setNewTopic({...newTopic, concepts: e.target.value})} placeholder="Array Traversal, Prefix Sum" />
                            </div>
                            <div className="form-group">
                                <label>DATA STREAM URL</label>
                                <input type="text" className="glass-input" value={newTopic.lectureUrl} onChange={e => setNewTopic({...newTopic, lectureUrl: e.target.value})} placeholder="https://..." />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '35px' }}>
                                <button type="button" className="glass-button secondary" onClick={() => setShowModal(false)}>ABORT</button>
                                <button type="submit" className="glass-button">INITIALIZE</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
