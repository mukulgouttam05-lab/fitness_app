import { Link } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '40px 24px',
      color: 'var(--text-secondary)'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '32px',
        marginBottom: '32px'
      }}>
        {/* About segment */}
        <div>
          <Link to="/" className="flex align-center gap-1" style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '16px' }}>
            <Dumbbell style={{ color: 'var(--primary)', transform: 'rotate(-45deg)' }} size={20} />
            <span>FLEX<span style={{ color: 'var(--primary)' }}>SQUAD</span></span>
          </Link>
          <p className="text-sm" style={{ lineHeight: '1.6' }}>
            A comprehensive web application designed to challenge, track, and inspire college students on their fitness journeys. Build habits, conquer milestones, and rank high.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1rem' }}>Project Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }} className="footer-links">
            <li><Link to="/">Home Landing</Link></li>
            <li><Link to="/about">About FlexSquad</Link></li>
            <li><Link to="/contact">Contact Support</Link></li>
          </ul>
        </div>

        {/* Feature Highlights */}
        <div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1rem' }}>Key Modules</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }} className="footer-links">
            <li>Workout Logger</li>
            <li>Nutrition Calorie Tracker</li>
            <li>Interactive Leaderboards</li>
            <li>Before / After Progress Gallery</li>
          </ul>
        </div>

        {/* Quote */}
        <div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1rem' }}>Daily Motivation</h4>
          <p className="text-sm" style={{ fontStyle: 'italic', lineHeight: '1.6' }}>
            "No citizen has a right to be an amateur in the matter of physical training. It is a shame for a man to grow old without seeing the beauty and strength of which his body is capable."
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)', marginTop: '8px', textAlign: 'right' }}>— Socrates</p>
        </div>
      </div>

      <div className="container" style={{
        borderTop: '1px solid var(--border-color)',
        paddingTop: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        fontSize: '0.85rem'
      }}>
        <span>&copy; {new Date().getFullYear()} FlexSquad Fitness Challenge Community. All rights reserved.</span>
        <div style={{ display: 'flex', gap: '16px' }} className="footer-links">
          <span>College Web Engineering Capstone Project</span>
        </div>
      </div>

      <style>{`
        .footer-links a {
          transition: color 0.15s ease;
        }
        .footer-links a:hover {
          color: var(--primary);
        }
      `}</style>
    </footer>
  );
}
