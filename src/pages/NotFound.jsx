import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container animate-fade flex align-center justify-center" style={{ minHeight: 'calc(100vh - 140px)', padding: '40px 24px' }}>
      <div className="card text-center" style={{ maxWidth: '480px', padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--error)'
        }}>
          <ShieldAlert size={36} />
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>404 Error</h1>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Lost in the Gym?</h2>
        
        <p className="text-muted text-sm" style={{ lineHeight: '1.6' }}>
          The workout routine or page you are looking for has been moved, deleted, or doesn't exist. Let's redirect you back to active tracking.
        </p>

        <Link to="/" className="btn btn-primary flex align-center gap-1" style={{ marginTop: '12px' }}>
          <ArrowLeft size={16} />
          <span>Back to Safety</span>
        </Link>
      </div>
    </div>
  );
}
