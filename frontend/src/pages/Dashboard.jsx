import React, { useState, useEffect } from 'react';
// import axios from 'react-serif';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [courses, setCourses] = useState([]);
    const [newCourseName, setNewCourseName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }
        try {
            const response = await axios.get('http://localhost:8080/api/courses/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCourses(response.data);
        } catch (error) {
            if (error.response && error.response.status === 403) {
                alert("Session expired. Please login again.");
                handleLogout();
            }
        }
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        if (!newCourseName.trim()) return;

        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:8080/api/courses/add',
                { name: newCourseName },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewCourseName('');
            fetchCourses();
        } catch (error) {
            console.error("Course add karne me error:", error);
            alert("Course save nahi hua!");
        }
    };

    // 🚀 NAYA FUNCTION: Course ko Revised mark karne ke liye (PUT Request)
    const handleRevise = async (courseId) => {
        alert("Button clicked! ID is: " + courseId); // 🚀 Ye pop-up aana chahiye
        console.log("Revising course with ID:", courseId);
        const token = localStorage.getItem('token');
        try {
            // Backend ko PUT request bhej rahe hain specific course ID ke sath
            await axios.put(`http://localhost:8080/api/courses/${courseId}/revise`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Success hone par list ko refresh karo taaki nayi dates calculate hokar dikhein
            fetchCourses();
        } catch (error) {
            console.error("Revision update karne me error:", error);
            alert("Revision update nahi ho paya!");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>My DSA Tracker 🚀</h2>
                <button onClick={handleLogout} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Logout
                </button>
            </div>
            <hr />

            <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                <h3>Add New Topic/Course</h3>
                <form onSubmit={handleAddCourse} style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="e.g. Sliding Window - Spark 5.0"
                        value={newCourseName}
                        onChange={(e) => setNewCourseName(e.target.value)}
                        required
                        style={{ padding: '8px', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Add to Tracker
                    </button>
                </form>
            </div>

            <h3>Your Courses:</h3>
            {courses.length === 0 ? (
                <p>Abhi tak koi DSA topic add nahi kiya hai. Upar form se add karein!</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {courses.map((course) => (
                        // Dhyan rakhna ki database se aane wali unique key 'id' ya 'courseId' jo bhi ho wahi use ho
                        <li key={course.id} style={{ padding: '15px', border: '1px solid #ccc', margin: '10px 0', borderRadius: '5px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <strong>{course.name}</strong>
                                {/* Agar tumhare backend me nextRevisionDate variable hai toh usko yahan display kar sakte ho */}
                                {course.nextRevisionDate && <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#666' }}>Next Revision: {new Date(course.nextRevisionDate).toLocaleDateString()}</p>}
                            </div>

                            {/* 🚀 NAYA BUTTON: Click karte hi ID pass hogi */}
                            <button
                                onClick={() => handleRevise(course.id)}
                                style={{ padding: '6px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                Mark as Revised
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Dashboard;