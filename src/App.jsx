import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Layouts & Guards
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Protected pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Workouts from './pages/Workouts';
import AddWorkout from './pages/AddWorkout';
import WorkoutHistory from './pages/WorkoutHistory';
import Challenges from './pages/Challenges';
import ChallengeDetails from './pages/ChallengeDetails';
import Leaderboard from './pages/Leaderboard';
import Gallery from './pages/Gallery';
import Nutrition from './pages/Nutrition';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

// Helper storage functions
import { getTheme, toggleTheme, getCurrentUser } from './utils/storage';

// Local layout helper for Dashboard views
function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => getTheme());
  const [user, setUser] = useState(() => getCurrentUser());
  const location = useLocation();

  useEffect(() => {
    // Sync body class with active theme state
    document.body.className = `${theme}-theme`;
  }, [theme]);

  const handleThemeToggle = () => {
    const nextTheme = toggleTheme();
    setTheme(nextTheme);
  };

  const handleUserUpdate = () => {
    setUser(getCurrentUser());
  };

  // Scroll window to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app-layout">
      {/* Header Navbar */}
      <Navbar onThemeToggle={handleThemeToggle} currentTheme={theme} user={user} onUserUpdate={handleUserUpdate} />

      {/* Main Pages router mapping */}
      <main className="app-main">
        <Routes>
          {/* Public Views */}
          <Route path="/" element={<Home user={user} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login onUserUpdate={handleUserUpdate} />} />
          <Route path="/register" element={<Register onUserUpdate={handleUserUpdate} />} />

          {/* Protected Dashboard Views */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard user={user} onUserUpdate={handleUserUpdate} />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Profile onUserUpdate={handleUserUpdate} />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/workouts" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Workouts onUserUpdate={handleUserUpdate} />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/workouts/add" element={
            <ProtectedRoute>
              <DashboardLayout>
                <AddWorkout onUserUpdate={handleUserUpdate} />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/workouts/history" element={
            <ProtectedRoute>
              <DashboardLayout>
                <WorkoutHistory onUserUpdate={handleUserUpdate} />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/nutrition" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Nutrition onUserUpdate={handleUserUpdate} />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/challenges" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Challenges onUserUpdate={handleUserUpdate} />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/challenges/:id" element={
            <ProtectedRoute>
              <DashboardLayout>
                <ChallengeDetails onUserUpdate={handleUserUpdate} />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/leaderboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Leaderboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/gallery" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Gallery onUserUpdate={handleUserUpdate} />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/analytics" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Analytics />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Settings onThemeToggle={handleThemeToggle} currentTheme={theme} onUserUpdate={handleUserUpdate} />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* 404 View */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
