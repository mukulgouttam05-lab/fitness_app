import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../utils/storage';
import { LogIn, KeyRound, Mail, AlertTriangle, ArrowRight } from 'lucide-react';

export default function Login({ onUserUpdate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Find redirect route path or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all credentials fields.');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate small latency to showcase dynamic loading states
    setTimeout(() => {
      try {
        loginUser(email, password);
        setLoading(false);
        if (onUserUpdate) onUserUpdate();
        navigate(from, { replace: true });
      } catch (err) {
        setLoading(false);
        setError(err.message || 'Verification failed.');
      }
    }, 600);
  };

  const handleDemoFill = () => {
    setEmail('demo@fitness.com');
    setPassword('password123');
    setError('');
  };

  return (
    <div className="container animate-fade flex align-center justify-center" style={{ minHeight: 'calc(100vh - 140px)', padding: '40px 24px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '32px' }}>
        
        {/* Title */}
        <div className="text-center" style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Welcome Back</h1>
          <p className="text-secondary text-sm">Enter details to access your custom fitness logs.</p>
        </div>

        {error && (
          <div className="alert alert-error animate-fade" style={{ padding: '10px 14px', fontSize: '0.85rem' }}>
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} noValidate>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="form-input"
                placeholder="name@university.edu"
                style={{ paddingLeft: '44px' }}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="form-input"
                placeholder="••••••••"
                style={{ paddingLeft: '44px' }}
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full flex align-center justify-center gap-1" style={{ marginTop: '24px' }} disabled={loading}>
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn size={18} />
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login Box */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--border-radius)',
          border: '1px dashed var(--border-color)',
          textAlign: 'center'
        }}>
          <div className="text-xs text-muted" style={{ marginBottom: '8px', fontWeight: 600 }}>ACADEMIC EVALUATION ACCOUNTS</div>
          <button 
            type="button" 
            onClick={handleDemoFill}
            className="btn btn-secondary btn-sm btn-full flex align-center justify-center gap-1"
            style={{ fontSize: '0.8rem', backgroundColor: 'var(--bg-tertiary)' }}
          >
            <span>Auto-fill Demo Credentials</span>
            <ArrowRight size={12} />
          </button>
          <div className="text-xs text-muted" style={{ marginTop: '6px', fontSize: '0.7rem' }}>
            demo@fitness.com / password123
          </div>
        </div>

        <div className="text-center text-sm text-secondary" style={{ marginTop: '24px' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register Now</Link>
        </div>

      </div>
    </div>
  );
}
