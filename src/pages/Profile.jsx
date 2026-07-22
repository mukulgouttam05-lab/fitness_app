import { useState } from 'react';
import { getCurrentUser, updateProfile } from '../utils/storage';
import { User, Award, Camera, CheckCircle2 } from 'lucide-react';

export default function Profile({ onUserUpdate }) {
  const user = getCurrentUser();

  const [formData, setFormData] = useState({
    username: user?.username || '',
    age: user?.age || '',
    weight: user?.weight || '',
    height: user?.height || '',
    dailyCalorieTarget: user?.dailyCalorieTarget || ''
  });

  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});

  // XP Progress Calculation
  const xp = user?.xp || 100;
  const currentLevel = Math.floor(xp / 500) + 1;
  const xpInCurrentLevel = xp % 500;
  const progressPercent = Math.min(100, Math.max(0, (xpInCurrentLevel / 500) * 100));

  const validate = () => {
    const tempErrors = {};
    if (!formData.username.trim()) tempErrors.username = 'Username is required.';
    if (!formData.age || isNaN(formData.age) || parseInt(formData.age) <= 0) {
      tempErrors.age = 'Invalid age.';
    }
    if (!formData.weight || isNaN(formData.weight) || parseFloat(formData.weight) <= 0) {
      tempErrors.weight = 'Invalid weight.';
    }
    if (!formData.height || isNaN(formData.height) || parseFloat(formData.height) <= 0) {
      tempErrors.height = 'Invalid height.';
    }
    if (!formData.dailyCalorieTarget || isNaN(formData.dailyCalorieTarget) || parseInt(formData.dailyCalorieTarget) < 500) {
      tempErrors.dailyCalorieTarget = 'Goal must be at least 500 kcal.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Profile Image Upload - Convert to Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) { // limit to 1MB
        alert('Image must be smaller than 1MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setAvatar(base64String);
        updateProfile({ avatar: base64String });
        if (onUserUpdate) onUserUpdate();
        setSuccess('Avatar picture updated successfully!');
        setTimeout(() => setSuccess(''), 4000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        updateProfile({
          username: formData.username.trim(),
          age: parseInt(formData.age),
          weight: parseFloat(formData.weight),
          height: parseFloat(formData.height),
          dailyCalorieTarget: parseInt(formData.dailyCalorieTarget)
        });
        setSuccess('Profile updated successfully!');
        if (onUserUpdate) onUserUpdate();
        setTimeout(() => {
          setSuccess('');
        }, 800);
      } catch (err) {
        setErrors({ general: err.message });
      }
    }
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ marginBottom: '8px' }}>User Profile</h1>
        <p className="text-secondary">Configure your daily targets, stats, and personalized avatar.</p>
      </div>

      {success && (
        <div className="alert alert-success animate-fade">
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-3 gap-3" style={{ gridTemplateColumns: '1fr 2fr' }} id="profile-split">
        {/* Left Side: Avatar Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            
            {/* Avatar upload layout */}
            <div style={{ position: 'relative', width: '120px', height: '120px' }}>
              {avatar ? (
                <img 
                  src={avatar} 
                  alt={user?.username} 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }} 
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-muted)'
                }}>
                  <User size={48} />
                </div>
              )}

              {/* Camera Trigger */}
              <label 
                htmlFor="avatar-upload" 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'var(--primary)',
                  color: '#000',
                  padding: '8px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Upload Profile Picture"
              >
                <Camera size={16} />
                <input 
                  type="file" 
                  id="avatar-upload" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  style={{ display: 'none' }} 
                />
              </label>
            </div>

            <div>
              <h2 style={{ fontSize: '1.4rem' }}>{user?.username}</h2>
              <div className="text-sm text-muted">{user?.email}</div>
            </div>

            {/* Level Badge Card */}
            <div style={{
              width: '100%',
              backgroundColor: 'var(--bg-secondary)',
              padding: '16px',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--border-color)'
            }}>
              <div className="flex align-center justify-between" style={{ marginBottom: '8px' }}>
                <span className="flex align-center gap-1 text-sm font-semibold">
                  <Award size={16} style={{ color: 'var(--primary)' }} />
                  <span>Level {currentLevel}</span>
                </span>
                <span className="text-xs text-muted">{xp} / {currentLevel * 500} XP</span>
              </div>
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progressPercent}%`, backgroundColor: 'var(--primary)' }} />
              </div>
              <div className="text-xs text-muted text-center" style={{ marginTop: '8px' }}>
                {500 - xpInCurrentLevel} XP left to level {currentLevel + 1}!
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Edit Form Card */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>Edit Account details</h3>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-input"
              />
              {errors.username && <div className="form-error">{errors.username}</div>}
            </div>

            <div className="grid grid-3 gap-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }} id="form-grid-three">
              <div className="form-group">
                <label className="form-label">Age (years)</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="form-input"
                />
                {errors.age && <div className="form-error">{errors.age}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="form-input"
                />
                {errors.weight && <div className="form-error">{errors.weight}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="form-input"
                />
                {errors.height && <div className="form-error">{errors.height}</div>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Daily Calorie Target (kcal)</label>
              <input
                type="number"
                name="dailyCalorieTarget"
                value={formData.dailyCalorieTarget}
                onChange={handleChange}
                className="form-input"
              />
              {errors.dailyCalorieTarget && <div className="form-error">{errors.dailyCalorieTarget}</div>}
            </div>

            {errors.general && (
              <div className="form-error" style={{ marginBottom: '16px' }}>{errors.general}</div>
            )}

            <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '16px' }}>
              Save Profile changes
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #profile-split {
            grid-template-columns: 1fr !important;
          }
          #form-grid-three {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
