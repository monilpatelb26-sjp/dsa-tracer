import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { FileText, ExternalLink, Trash2, Check, RotateCcw } from 'lucide-react';

const ProblemsDashboardPage = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [problems, setProblems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newProblem, setNewProblem] = useState({ name: '', leetcodeNumber: '', difficulty: 'Medium', leetcodeUrl: '' });
    const [filter, setFilter] = useState('All');

    const fetchProblems = async () => {
        try {
            const res = await api.get(`/problems/topic/${topicId}`);
            setProblems(res.data);
        } catch (error) {
            console.error("Failed to load problems", error);
        }
    };

    useEffect(() => {
        fetchProblems();
    }, [topicId]);

    const handleCreateProblem = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/problems/topic/${topicId}`, newProblem);
            setShowModal(false);
            setNewProblem({ name: '', leetcodeNumber: '', difficulty: 'Medium', leetcodeUrl: '' });
            fetchProblems();
        } catch (error) {
            console.error("Failed to create problem", error);
        }
    };

    const handleSolveProblem = async (problemId, currentSolved) => {
        if(currentSolved) return;
        try {
            await api.put(`/problems/${problemId}/solve`);
            fetchProblems();
        } catch (error) {
            console.error("Failed to solve problem", error);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('Are you sure you want to delete this problem?')) {
            try {
                await api.delete(`/problems/${id}`);
                fetchProblems();
            } catch (error) {
                console.error("Delete failed", error);
            }
        }
    };

    const filteredProblems = problems.filter(p => {
        if (filter === 'All') return true;
        if (filter === 'Unsolved') return !p.solved;
        return p.difficulty === filter;
    });

    return (
        <div className="page-wrapper animate-fade-in" style={{ maxWidth: '1200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Problems Dashboard</h1>
                <button className="glass-button secondary" style={{ padding: '8px 16px', borderRadius: '6px' }} onClick={() => navigate(-1)}>← Back</button>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
                {['All', 'Easy', 'Medium', 'Hard', 'Unsolved'].map(f => (
                    <button 
                        key={f}
                        className="glass-button secondary"
                        style={{ 
                            background: filter === f ? 'var(--bg-card)' : 'transparent',
                            color: filter === f ? 'var(--text-primary)' : 'var(--text-secondary)',
                            border: filter === f ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                            padding: '8px 16px',
                            boxShadow: 'none',
                            fontSize: '0.9rem',
                            borderRadius: '20px'
                        }}
                        onClick={() => setFilter(f)}
                    >
                        {f}
                    </button>
                ))}
                <button className="glass-button" onClick={() => setShowModal(true)} style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)' }}>+ Add Problem</button>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto', padding: 0, borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <th style={{ padding: '20px', color: '#64748B', fontSize: '0.8rem', fontWeight: '600', width: '60px' }}>#</th>
                            <th style={{ padding: '20px', color: '#64748B', fontSize: '0.8rem', fontWeight: '600', width: '100px' }}>LC</th>
                            <th style={{ padding: '20px', color: '#64748B', fontSize: '0.8rem', fontWeight: '600' }}>Problem</th>
                            <th style={{ padding: '20px', color: '#64748B', fontSize: '0.8rem', fontWeight: '600', width: '150px' }}>Difficulty</th>
                            <th style={{ padding: '20px', color: '#64748B', fontSize: '0.8rem', fontWeight: '600', width: '100px', textAlign: 'center' }}>Solved</th>
                            <th style={{ padding: '20px', color: '#64748B', fontSize: '0.8rem', fontWeight: '600', width: '150px' }}>Revisions</th>
                            <th style={{ padding: '20px', color: '#64748B', fontSize: '0.8rem', fontWeight: '600', width: '160px', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProblems.map((problem, idx) => (
                            <tr key={problem.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.3s' }} className="hover-row">
                                <td style={{ padding: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    {String(idx + 1).padStart(2, '0')}
                                </td>
                                <td style={{ padding: '20px' }}>
                                    {problem.leetcodeNumber && <span className="badge lc">#{problem.leetcodeNumber}</span>}
                                </td>
                                <td style={{ padding: '20px', fontWeight: '600', color: 'var(--text-primary)' }}>
                                    {problem.name}
                                </td>
                                <td style={{ padding: '20px' }}>
                                    <span className={`badge ${problem.difficulty.toLowerCase()}`}>
                                        {problem.difficulty}
                                    </span>
                                </td>
                                <td style={{ padding: '20px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <div 
                                            className={`custom-checkbox ${problem.solved ? 'checked' : ''}`}
                                            onClick={() => handleSolveProblem(problem.id, problem.solved)}
                                        >
                                            {problem.solved && <Check size={14} strokeWidth={3} />}
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <RotateCcw size={16} /> 
                                    {problem.solved ? '1/12' : '0/12'}
                                </td>
                                <td style={{ padding: '20px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', color: 'var(--text-secondary)' }}>
                                        <FileText size={18} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="action-icon" onClick={() => navigate(`/problems/${problem.id}/revision`)} />
                                        <a href={problem.leetcodeUrl} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>
                                            <ExternalLink size={18} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="action-icon" />
                                        </a>
                                        <Trash2 size={18} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="action-icon hover-danger" onClick={() => handleDelete(problem.id)} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredProblems.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>No problems found. Start by adding one!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="glass-panel modal-content">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 'bold' }}>Add Problem</h2>
                            <button className="modal-close" style={{ position: 'static' }} onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleCreateProblem}>
                            <div className="form-group">
                                <label>PROBLEM NAME *</label>
                                <input type="text" className="glass-input" required value={newProblem.name} onChange={e => setNewProblem({...newProblem, name: e.target.value})} placeholder="e.g. Valid Parentheses" />
                            </div>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>LEETCODE NUMBER</label>
                                    <input type="text" className="glass-input" value={newProblem.leetcodeNumber} onChange={e => setNewProblem({...newProblem, leetcodeNumber: e.target.value})} placeholder="20" />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>DIFFICULTY</label>
                                    <select className="glass-input" value={newProblem.difficulty} onChange={e => setNewProblem({...newProblem, difficulty: e.target.value})}>
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>LEETCODE URL</label>
                                <input type="url" className="glass-input" required value={newProblem.leetcodeUrl} onChange={e => setNewProblem({...newProblem, leetcodeUrl: e.target.value})} placeholder="https://leetcode.com/problems/..." />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
                                <button type="button" className="glass-button secondary" onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none' }}>Cancel</button>
                                <button type="submit" className="glass-button" style={{ background: 'var(--text-primary)', color: '#000', fontWeight: 'bold' }}>Add Problem</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            <style dangerouslySetInnerHTML={{__html: `
                .hover-row:hover { background: rgba(255,255,255,0.015) !important; }
                .action-icon:hover { color: var(--text-primary); }
                .hover-danger:hover { color: var(--danger); }
            `}} />
        </div>
    );
};

export default ProblemsDashboardPage;

