import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initLocalStorage } from '../utils/storage';
import { Settings as SettingsIcon, RotateCcw, ShieldAlert, Trash2, Eye, Moon, Bell } from 'lucide-react';

export default function Settings({ onThemeToggle, currentTheme, onUserUpdate }) {
  const [notifications, setNotifications] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all project data to defaults? This will erase custom workouts, nutrition logs, progress photos, and restore the initial seeding.")) {
      initLocalStorage(true); // force reset
      setSuccess('Application data has been successfully reset!');
      if (onUserUpdate) onUserUpdate();
      setTimeout(() => {
        setSuccess('');
      }, 1000);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("CRITICAL WARNING: Are you sure you want to delete your account? This action is permanent and all progress, gallery uploads, and logged workouts will be destroyed.")) {
      // Get all users
      const users = JSON.parse(localStorage.getItem('fc_users') || '[]');
      const currentUser = JSON.parse(localStorage.getItem('fc_currentUser'));
      
      if (currentUser) {
        // Filter out current user
        const updatedUsers = users.filter(u => u.id !== currentUser.id);
        localStorage.setItem('fc_users', JSON.stringify(updatedUsers));
        
        // Remove username from leaderboard
        const leaderboard = JSON.parse(localStorage.getItem('fc_leaderboard') || '[]');
        const updatedLeaderboard = leaderboard.filter(l => l.username !== currentUser.username);
        localStorage.setItem('fc_leaderboard', JSON.stringify(updatedLeaderboard));
      }

      // Logout and re-seed defaults
      localStorage.removeItem('fc_currentUser');
      initLocalStorage();
      alert('Your account has been deleted.');
      if (onUserUpdate) onUserUpdate();
      navigate('/');
    }
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ marginBottom: '8px' }}>System Settings</h1>
        <p className="text-secondary">Customize app preferences, visual modes, and manage your local storage storage cache.</p>
      </div>

      {success && (
        <div className="alert alert-success animate-fade">
          <RotateCcw size={18} />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-2 gap-3">
        {/* Left Side: General preferences */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Preference Cards */}
          <div className="card">
            <h3 className="flex align-center gap-1" style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
              <SettingsIcon size={18} style={{ color: 'var(--primary)' }} />
              <span>Preferences</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Notification toggle */}
              <div className="flex align-center justify-between">
                <div className="flex align-center gap-2">
                  <Bell size={18} style={{ color: 'var(--secondary)' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Push Notifications</div>
                    <div className="text-xs text-muted">Receive reminders to log daily workouts and foods.</div>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications} 
                  onChange={() => setNotifications(!notifications)}
                  style={{
                    width: '40px',
                    height: '20px',
                    accentColor: 'var(--primary)',
                    cursor: 'pointer'
                  }}
                />
              </div>

              {/* Privacy toggle */}
              <div className="flex align-center justify-between">
                <div className="flex align-center gap-2">
                  <Eye size={18} style={{ color: 'var(--success)' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Private Profile</div>
                    <div className="text-xs text-muted">Hide your statistics from public leaderboard logs.</div>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={isPrivate} 
                  onChange={() => setIsPrivate(!isPrivate)}
                  style={{
                    width: '40px',
                    height: '20px',
                    accentColor: 'var(--primary)',
                    cursor: 'pointer'
                  }}
                />
              </div>

              {/* Theme toggle segment */}
              <div className="flex align-center justify-between">
                <div className="flex align-center gap-2">
                  <Moon size={18} style={{ color: 'var(--warning)' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Color Theme</div>
                    <div className="text-xs text-muted">Toggle between dark carbon or crisp light themes.</div>
                  </div>
                </div>
                <button onClick={onThemeToggle} className="btn btn-secondary btn-sm" style={{ textTransform: 'capitalize' }}>
                  {currentTheme} Mode
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Account Recovery & Management */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Data controls */}
          <div className="card">
            <h3 className="flex align-center gap-1" style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--warning)' }}>
              <RotateCcw size={18} />
              <span>Database Management</span>
            </h3>
            <p className="text-sm text-secondary" style={{ marginBottom: '20px', lineHeight: '1.6' }}>
              Resetting deletes your current profile records and uploads, seeding standard preset values for immediate project demonstrations.
            </p>
            <button onClick={handleResetData} className="btn btn-outline btn-full" style={{ borderColor: 'var(--warning)', color: 'var(--warning)' }}>
              Reset Application Cache
            </button>
          </div>

          {/* Critical zone */}
          <div className="card" style={{ borderColor: 'var(--error)' }}>
            <h3 className="flex align-center gap-1" style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--error)' }}>
              <ShieldAlert size={18} />
              <span>Danger Zone</span>
            </h3>
            <p className="text-sm text-secondary" style={{ marginBottom: '20px', lineHeight: '1.6' }}>
              Deleting your account cleans your profile records from local storage. This is irreversible.
            </p>
            <button onClick={handleDeleteAccount} className="btn btn-danger btn-full flex align-center justify-center gap-1">
              <Trash2 size={16} />
              <span>Delete My Account</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
