import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../utils/storage';
import { UserPlus, User, Mail, Lock, Calculator, AlertTriangle } from 'lucide-react';

export default function Register({ onUserUpdate }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    age: '',
    weight: '',
    height: '',
    calorieTarget: ''
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const tempErrors = {};
    if (!formData.username.trim()) tempErrors.username = 'Username is required.';
    else if (formData.username.length < 3) tempErrors.username = 'Username must be at least 3 characters.';

    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      tempErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters.';
    }

    if (formData.age && (isNaN(formData.age) || parseInt(formData.age) <= 0)) {
      tempErrors.age = 'Must be a valid age.';
    }
    
    if (formData.weight && (isNaN(formData.weight) || parseFloat(formData.weight) <= 0)) {
      tempErrors.weight = 'Must be a valid weight.';
    }

    if (formData.height && (isNaN(formData.height) || parseFloat(formData.height) <= 0)) {
      tempErrors.height = 'Must be a valid height.';
    }

    if (formData.calorieTarget && (isNaN(formData.calorieTarget) || parseInt(formData.calorieTarget) < 500)) {
      tempErrors.calorieTarget = 'Must be at least 500 kcal.';
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

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setGeneralError('');

    setTimeout(() => {
      try {
        registerUser(
          formData.username.trim(),
          formData.email.trim(),
          formData.password,
          formData.age,
          formData.weight,
          formData.height,
          formData.calorieTarget
        );
        setLoading(false);
        if (onUserUpdate) onUserUpdate();
        navigate('/dashboard');
      } catch (err) {
        setLoading(false);
        setGeneralError(err.message || 'Registration failed.');
      }
    }, 600);
  };

  return (
    <div className="container animate-fade flex align-center justify-center" style={{ padding: '60px 24px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '520px', padding: '32px' }}>
        
        {/* Title */}
        <div className="text-center" style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Create Account</h1>
          <p className="text-secondary text-sm">Join the FlexSquad fitness community today.</p>
        </div>

        {generalError && (
          <div className="alert alert-error animate-fade" style={{ padding: '10px 14px', fontSize: '0.85rem' }}>
            <AlertTriangle size={16} />
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleRegister} noValidate>
          
          <div className="form-group">
            <label className="form-label">Username</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., Shredder22"
                style={{ paddingLeft: '44px' }}
                disabled={loading}
              />
            </div>
            {errors.username && <div className="form-error">{errors.username}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="name@university.edu"
                style={{ paddingLeft: '44px' }}
                disabled={loading}
              />
            </div>
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="•••••••• (Min. 6 characters)"
                style={{ paddingLeft: '44px' }}
                disabled={loading}
              />
            </div>
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          {/* Fitness characteristics */}
          <div style={{
            padding: '16px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--border-color)',
            marginBottom: '20px'
          }}>
            <div className="flex align-center gap-1" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '12px' }}>
              <Calculator size={14} />
              <span>FITNESS CONFIGURATION (OPTIONAL)</span>
            </div>

            <div className="grid grid-3 gap-1" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., 20"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  disabled={loading}
                />
                {errors.age && <div className="form-error" style={{ fontSize: '0.7rem' }}>{errors.age}</div>}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., 70"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  disabled={loading}
                />
                {errors.weight && <div className="form-error" style={{ fontSize: '0.7rem' }}>{errors.weight}</div>}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., 175"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  disabled={loading}
                />
                {errors.height && <div className="form-error" style={{ fontSize: '0.7rem' }}>{errors.height}</div>}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '12px', marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Daily Calorie Goal (kcal)</label>
              <input
                type="number"
                name="calorieTarget"
                value={formData.calorieTarget}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., 2200"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                disabled={loading}
              />
              {errors.calorieTarget && <div className="form-error" style={{ fontSize: '0.7rem' }}>{errors.calorieTarget}</div>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full flex align-center justify-center gap-1" disabled={loading}>
            {loading ? (
              <span>Creating Profile...</span>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-secondary" style={{ marginTop: '24px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login here</Link>
        </div>

      </div>
    </div>
  );
}
