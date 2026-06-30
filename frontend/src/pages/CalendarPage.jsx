import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { ArrowLeft, Clock, AlertCircle } from 'lucide-react';

const CalendarPage = () => {
    const [dueRevisions, setDueRevisions] = useState([]);
    const [upcomingRevisions, setUpcomingRevisions] = useState([]);
    const navigate = useNavigate();

    const fetchCalendarData = async () => {
        try {
            const dueRes = await api.get('/revisions/due');
            setDueRevisions(dueRes.data);
            
            const upcomingRes = await api.get('/revisions/upcoming');
            setUpcomingRevisions(upcomingRes.data);
        } catch (error) {
            console.error("Failed to load calendar data", error);
        }
    };

    useEffect(() => {
        fetchCalendarData();
    }, []);

    const RevisionCard = ({ rev, isDue }) => {
        const dueDateFormatted = new Date(rev.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        return (
            <div 
                className="hover-card"
                style={{ 
                    padding: '20px', 
                    borderBottom: '1px solid rgba(255,255,255,0.05)', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                    background: 'transparent'
                }}
                onClick={() => navigate(`/problems/${rev.problem.id}/revision`)}
            >
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>
                        {rev.problem.name}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{rev.problem.topic?.title || 'General'}</span>
                        <span>•</span>
                        <span>Day {rev.intervalDays}</span>
                        <span>•</span>
                        <span style={{ color: isDue ? 'var(--danger)' : 'var(--text-secondary)' }}>Due {dueDateFormatted}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="page-wrapper animate-fade-in" style={{ maxWidth: '900px', padding: '20px 40px' }}>
            
            {/* Top Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', marginBottom: '40px', color: 'var(--text-primary)', fontWeight: '600' }} onClick={() => navigate(-1)}>
                <ArrowLeft size={20} />
                <span style={{ fontSize: '1.2rem' }}>Revision Calendar</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                
                {/* Due Today Section */}
                <div className="glass-panel" style={{ padding: '0', background: '#111827', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <div style={{ padding: '25px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                            <AlertCircle size={20} /> Due Today & Overdue
                        </h2>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{dueRevisions.length}</span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {dueRevisions.length === 0 ? (
                            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>No revisions due today. Great job!</div>
                        ) : (
                            dueRevisions.map(rev => <RevisionCard key={rev.id} rev={rev} isDue={true} />)
                        )}
                    </div>
                </div>

                {/* Upcoming Section */}
                <div className="glass-panel" style={{ padding: '0', background: '#111827', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <div style={{ padding: '25px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                            <Clock size={20} /> Upcoming (7 Days)
                        </h2>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{upcomingRevisions.length}</span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {upcomingRevisions.length === 0 ? (
                            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>No upcoming revisions for the next 7 days.</div>
                        ) : (
                            upcomingRevisions.map(rev => <RevisionCard key={rev.id} rev={rev} isDue={false} />)
                        )}
                    </div>
                </div>

            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .hover-card:hover { background: rgba(255,255,255,0.02) !important; }
            `}} />
        </div>
    );
};

export default CalendarPage;
