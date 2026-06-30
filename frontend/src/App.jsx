import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import CoursesPage from './pages/CoursesPage';
import DashboardPage from './pages/DashboardPage';
import ProblemsDashboardPage from './pages/ProblemsDashboardPage';
import RevisionDashboardPage from './pages/RevisionDashboardPage';
import CalendarPage from './pages/CalendarPage';

const PrivateRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/courses" element={<PrivateRoute><CoursesPage /></PrivateRoute>} />
            <Route path="/courses/:courseId/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/topics/:topicId/problems" element={<PrivateRoute><ProblemsDashboardPage /></PrivateRoute>} />
            <Route path="/problems/:problemId/revision" element={<PrivateRoute><RevisionDashboardPage /></PrivateRoute>} />
            <Route path="/calendar" element={<PrivateRoute><CalendarPage /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/courses" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;