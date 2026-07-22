import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../utils/storage';
import { Dumbbell, Menu, X, LogOut, User, Award, Home, Info, Mail } from 'lucide-react';

export default function Navbar({ onThemeToggle, currentTheme, user, onUserUpdate }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    onUserUpdate();
    setMobileOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: currentTheme === 'dark' ? 'rgba(17, 24, 39, 0.85)' : 'rgba(255, 255, 255, 0.85)',
      borderBottom: '1px solid var(--border-color)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
        padding: '0 24px'
      }}>
        {/* Logo */}
        <Link to="/" className="flex align-center gap-1" style={{ fontWeight: 800, fontSize: '1.4rem' }}>
          <Dumbbell style={{ color: 'var(--primary)', transform: 'rotate(-45deg)' }} size={28} />
          <span>FLEX<span style={{ color: 'var(--primary)' }}>SQUAD</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className="nav-desktop-links">
          <Link to="/" style={{ color: isActive('/') ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: 500 }} className="nav-link">
            Home
          </Link>
          <Link to="/about" style={{ color: isActive('/about') ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: 500 }} className="nav-link">
            About
          </Link>
          <Link to="/contact" style={{ color: isActive('/contact') ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: 500 }} className="nav-link">
            Contact
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" style={{
                color: isActive('/dashboard') ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 500
              }} className="nav-link">
                Dashboard
              </Link>
              
              {/* User XP Badge */}
              <div className="flex align-center gap-1" style={{
                backgroundColor: 'var(--bg-tertiary)',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                border: '1px solid var(--border-color)'
              }}>
                <Award size={14} style={{ color: 'var(--primary)' }} />
                <span>Level {Math.floor((user.xp || 100) / 500) + 1}</span>
              </div>

              {/* Profile Shortcut */}
              <Link to="/profile" className="flex align-center gap-1 nav-profile" style={{
                color: 'var(--text-primary)',
                fontWeight: 500
              }}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--primary)'
                  }} />
                ) : (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-color)'
                  }}>
                    <User size={16} />
                  </div>
                )}
                <span style={{ fontSize: '0.9rem' }}>{user.username}</span>
              </Link>

              <button onClick={handleLogout} className="btn btn-secondary btn-sm flex align-center gap-1">
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button 
            onClick={onThemeToggle} 
            className="btn btn-secondary btn-sm"
            style={{ padding: '8px', minWidth: 'auto', borderRadius: '50%' }}
            title={`Switch to ${currentTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {currentTheme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button className="nav-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle Navigation">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div style={{
          position: 'fixed',
          top: '70px',
          left: 0,
          right: 0,
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          zIndex: 49,
          animation: 'fadeIn 0.2s ease'
        }}>
          <Link to="/" onClick={() => setMobileOpen(false)} style={{
            color: isActive('/') ? 'var(--primary)' : 'var(--text-primary)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Home size={18} /> Home
          </Link>
          <Link to="/about" onClick={() => setMobileOpen(false)} style={{
            color: isActive('/about') ? 'var(--primary)' : 'var(--text-primary)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Info size={18} /> About
          </Link>
          <Link to="/contact" onClick={() => setMobileOpen(false)} style={{
            color: isActive('/contact') ? 'var(--primary)' : 'var(--text-primary)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Mail size={18} /> Contact
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} style={{
                color: isActive('/dashboard') ? 'var(--primary)' : 'var(--text-primary)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Dumbbell size={18} /> Dashboard
              </Link>

              <Link to="/profile" onClick={() => setMobileOpen(false)} style={{
                color: isActive('/profile') ? 'var(--primary)' : 'var(--text-primary)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <User size={18} /> My Profile (Level {Math.floor((user.xp || 100) / 500) + 1})
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                <button onClick={onThemeToggle} className="btn btn-secondary btn-sm" style={{ width: '48%' }}>
                  {currentTheme === 'dark' ? '☀️ Light' : '🌙 Dark'} Mode
                </button>
                <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ width: '48%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-secondary btn-full">Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="btn btn-primary btn-full">Register</Link>
            </div>
          )}
        </div>
      )}

      {/* Standard CSS injection for hiding items */}
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop-links {
            display: none !important;
          }
        }
        .nav-link {
          transition: color var(--transition-fast) !important;
        }
        .nav-link:hover {
          color: var(--primary) !important;
        }
      `}</style>
    </nav>
  );
}
