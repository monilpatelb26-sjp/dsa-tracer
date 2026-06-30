import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { ArrowLeft, ExternalLink, CheckCircle2, RotateCcw } from 'lucide-react';

const RevisionDashboardPage = () => {
    const { problemId } = useParams();
    const navigate = useNavigate();
    const [revisions, setRevisions] = useState([]);
    const [note, setNote] = useState({ content: '' });
    const [problemDetails, setProblemDetails] = useState(null);

    const fetchData = async () => {
        try {
            const revRes = await api.get(`/revisions/problem/${problemId}`);
            setRevisions(revRes.data);
            
            if (revRes.data.length > 0) {
                setProblemDetails(revRes.data[0].problem);
            }
            
            const noteRes = await api.get(`/notes/problem/${problemId}`);
            if(noteRes.data) {
                setNote(noteRes.data);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [problemId]);

    const handleSaveNote = async () => {
        try {
            await api.post(`/notes/problem/${problemId}`, { content: note.content });
            alert("Note saved successfully!");
        } catch (error) {
            console.error("Failed to save note", error);
        }
    };

    const handleMarkDone = async (revId) => {
        try {
            await api.put(`/revisions/${revId}/done`);
            fetchData();
        } catch (error) {
            console.error("Failed to mark done", error);
        }
    };

    if (!problemDetails) {
        return (
            <div className="page-wrapper animate-fade-in" style={{ maxWidth: '1000px' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Loading...</h2>
            </div>
        );
    }

    const doneCount = revisions.filter(r => r.status === 'Done').length;

    return (
        <div className="page-wrapper animate-fade-in" style={{ maxWidth: '1000px', padding: '20px 40px' }}>
            
            {/* Top Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', marginBottom: '30px', color: 'var(--text-primary)', fontWeight: '600' }} onClick={() => navigate(-1)}>
                <ArrowLeft size={20} />
                <span style={{ fontSize: '1.2rem' }}>{problemDetails.name}</span>
            </div>

            {/* Header Card */}
            <div className="glass-panel" style={{ padding: '30px', marginBottom: '40px', background: '#111827', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '700', margin: '0 0 15px 0', color: 'var(--text-primary)' }}>{problemDetails.name}</h1>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
                            {problemDetails.leetcodeNumber && (
                                <span className="badge lc">
                                    LC #{problemDetails.leetcodeNumber}
                                </span>
                            )}
                            <span className={`badge ${problemDetails.difficulty.toLowerCase()}`}>
                                {problemDetails.difficulty}
                            </span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginLeft: '10px' }}>
                                {problemDetails.topic?.title}
                            </span>
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Solved on {problemDetails.solveDate || 'Unknown'}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <a href={problemDetails.leetcodeUrl} target="_blank" rel="noreferrer" className="glass-button secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-primary)' }}>
                            <ExternalLink size={16} /> Open LeetCode
                        </a>
                        <div className="glass-button" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.3)', pointerEvents: 'none' }}>
                            <CheckCircle2 size={16} /> Solved ✓
                        </div>
                    </div>
                </div>
            </div>

            {/* Spaced Repetition Schedule Grid */}
            <div className="glass-panel" style={{ padding: '30px', marginBottom: '40px', background: '#111827', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
                        <RotateCcw size={20} color="var(--accent-primary)" /> Spaced Repetition Schedule
                    </h3>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{doneCount}/{revisions.length}</span> done
                    </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px' }}>
                    {revisions.map(rev => {
                        const isDone = rev.status === 'Done';
                        
                        return (
                            <div 
                                key={rev.id} 
                                onClick={() => !isDone && handleMarkDone(rev.id)}
                                style={{ 
                                    padding: '20px 10px', 
                                    textAlign: 'center',
                                    background: isDone ? 'rgba(16, 185, 129, 0.05)' : '#0F172A', 
                                    border: isDone ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    cursor: isDone ? 'default' : 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                className={!isDone ? 'hover-card' : ''}
                            >
                                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '5px' }}>D{rev.intervalDays}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                                    {new Date(rev.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                                <div style={{ 
                                    fontSize: '0.9rem', 
                                    fontWeight: '600', 
                                    color: isDone ? 'var(--success)' : 'var(--text-secondary)' 
                                }}>
                                    {isDone ? 'Done' : 'Pending'}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Notes Section */}
            <div className="glass-panel" style={{ padding: '30px', marginBottom: '40px', background: '#111827', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px', color: 'var(--text-primary)' }}>
                    Notes
                </h3>
                <div style={{ background: '#0F172A', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <textarea 
                        style={{ 
                            width: '100%', minHeight: '200px', resize: 'vertical', padding: '20px',
                            background: 'transparent', border: 'none', color: 'var(--text-primary)', 
                            fontFamily: 'var(--font-family)', fontSize: '0.95rem', outline: 'none' 
                        }}
                        placeholder="Write your notes here...&#10;&#10;• Key observations&#10;• Approach / Algorithm"
                        value={note.content}
                        onChange={(e) => setNote({...note, content: e.target.value})}
                    ></textarea>
                </div>
                <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                    <button className="glass-button" style={{ background: 'var(--accent-primary)', color: '#000', fontWeight: '600', padding: '8px 20px', borderRadius: '8px' }} onClick={handleSaveNote}>
                        Save Note
                    </button>
                    <button className="glass-button secondary" style={{ color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '8px 20px', borderRadius: '8px' }} onClick={() => setNote({content: ''})}>
                        Clear Note
                    </button>
                </div>
            </div>

            {/* Revision History List */}
            <div className="glass-panel" style={{ padding: '30px', background: '#111827', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '25px', color: 'var(--text-primary)' }}>
                    Revision History
                </h3>
                <div>
                    {revisions.map((rev, idx) => {
                        const isDone = rev.status === 'Done';
                        const dueDateFormatted = new Date(rev.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                        
                        return (
                            <div key={rev.id} style={{ 
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                                padding: '16px 0', borderBottom: idx < revisions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' 
                            }}>
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--text-secondary)', width: '50px' }}>Day {rev.intervalDays}</span>
                                    <span style={{ color: isDone ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Due {dueDateFormatted}</span>
                                </div>
                                <div>
                                    <span className={`badge ${isDone ? 'done' : 'pending'}`}>
                                        {isDone ? 'Done' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .hover-card:hover { border-color: var(--accent-primary) !important; background: rgba(16, 185, 129, 0.02) !important; }
            `}} />
        </div>
    );
};

export default RevisionDashboardPage;
