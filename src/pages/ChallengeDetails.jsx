import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getChallenges, getJoinedChallenges, leaveChallenge } from '../utils/storage';
import { Clock, Users, Award, ShieldAlert, ArrowLeft, Target } from 'lucide-react';

export default function ChallengeDetails({ onUserUpdate }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [challenge] = useState(() => {
    const challenges = getChallenges();
    return challenges.find(c => c.id === id) || null;
  });

  const [isJoined] = useState(() => {
    const joined = getJoinedChallenges();
    return joined.includes(id);
  });

  const [checklist, setChecklist] = useState(() => {
    if (!challenge) return [];
    const totalDays = challenge.durationDays;
    const cacheKey = `fc_challengeProgress_${id}`;
    const cachedProgress = localStorage.getItem(cacheKey);

    if (cachedProgress) {
      const progressArray = JSON.parse(cachedProgress);
      if (progressArray.length === totalDays) {
        return progressArray;
      }
    }
    return Array(totalDays).fill(false);
  });

  const [completedDaysCount, setCompletedDaysCount] = useState(() => checklist.filter(Boolean).length);

  const handleCheck = (index) => {
    const updated = [...checklist];
    updated[index] = !updated[index];
    setChecklist(updated);

    const count = updated.filter(Boolean).length;
    setCompletedDaysCount(count);

    // Save to local storage
    localStorage.setItem(`fc_challengeProgress_${id}`, JSON.stringify(updated));
  };

  const handleLeave = () => {
    if (window.confirm("Are you sure you want to leave this challenge? Your checklist progress will be deleted.")) {
      leaveChallenge(id);
      if (onUserUpdate) onUserUpdate();
      localStorage.removeItem(`fc_challengeProgress_${id}`);
      navigate('/challenges');
    }
  };

  if (!challenge) {
    return <div className="text-center text-muted" style={{ padding: '80px' }}>Loading challenge...</div>;
  }

  const progressPercent = Math.round((completedDaysCount / challenge.durationDays) * 100);

  return (
    <div className="container animate-fade" style={{ padding: '24px 0', maxWidth: '800px' }}>
      
      {/* Back to Challenges */}
      <Link to="/challenges" className="flex align-center gap-1 text-sm text-secondary nav-link" style={{ marginBottom: '24px', width: 'fit-content' }}>
        <ArrowLeft size={16} />
        <span>Back to Challenges</span>
      </Link>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Core Header Card */}
        <div className="card">
          <div className="flex justify-between align-center" style={{ marginBottom: '16px' }}>
            <span className="badge badge-primary">{challenge.category}</span>
            <span className="badge badge-secondary">{challenge.difficulty}</span>
          </div>

          <h1 style={{ fontSize: '2rem', marginBottom: '12px' }}>{challenge.title}</h1>
          <p className="text-secondary" style={{ lineHeight: '1.6', marginBottom: '24px' }}>
            {challenge.description}
          </p>

          <div style={{ display: 'flex', gap: '32px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <div className="flex align-center gap-1 text-sm">
              <Clock size={16} style={{ color: 'var(--primary)' }} />
              <div>
                <span className="text-muted block text-xs">Duration</span>
                <strong>{challenge.durationDays} Days</strong>
              </div>
            </div>

            <div className="flex align-center gap-1 text-sm">
              <Users size={16} style={{ color: 'var(--secondary)' }} />
              <div>
                <span className="text-muted block text-xs">Class Competitors</span>
                <strong>{challenge.participants} Members</strong>
              </div>
            </div>

            <div className="flex align-center gap-1 text-sm">
              <Award size={16} style={{ color: 'var(--success)' }} />
              <div>
                <span className="text-muted block text-xs">XP reward</span>
                <strong>+{challenge.xpReward} XP</strong>
              </div>
            </div>
          </div>
        </div>

        {isJoined ? (
          <>
            {/* Checklist progress tracker card */}
            <div className="card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>My Active Progress</h3>
              
              {/* Progress Bar details */}
              <div style={{ marginBottom: '24px' }}>
                <div className="flex justify-between align-center text-sm" style={{ marginBottom: '8px' }}>
                  <span>Completed <strong>{completedDaysCount}</strong> of <strong>{challenge.durationDays}</strong> days</span>
                  <strong style={{ color: 'var(--primary)' }}>{progressPercent}%</strong>
                </div>
                <div className="progress-container" style={{ height: '12px' }}>
                  <div className="progress-bar" style={{ width: `${progressPercent}%`, backgroundColor: 'var(--primary)' }} />
                </div>
              </div>

              {/* Milestones status */}
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: '16px',
                borderRadius: 'var(--border-radius)',
                border: '1px solid var(--border-color)',
                marginBottom: '28px'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--secondary)', marginBottom: '12px' }}>MILESTONES UNLOCKED</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {challenge.milestones.map((m, index) => {
                    const unlocked = completedDaysCount >= m.day;
                    return (
                      <div key={index} className="flex align-center justify-between text-xs">
                        <span style={{ color: unlocked ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: unlocked ? 600 : 400 }}>
                          Day {m.day}: {m.label}
                        </span>
                        <span className={`badge ${unlocked ? 'badge-success' : 'badge-secondary'}`}>
                          {unlocked ? 'Unlocked' : 'Locked'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Checklist checklist */}
              <h4 style={{ fontSize: '1rem', marginBottom: '12px' }}>Checklist Log</h4>
              <p className="text-xs text-muted" style={{ marginBottom: '16px' }}>
                Mark checkbox each day you successfully comply with the challenge rules.
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '12px'
              }}>
                {checklist.map((checked, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleCheck(idx)}
                    className="btn btn-secondary text-sm flex align-center justify-center gap-1"
                    style={{
                      padding: '12px 8px',
                      backgroundColor: checked ? 'var(--primary-glow)' : 'var(--bg-secondary)',
                      borderColor: checked ? 'var(--primary)' : 'var(--border-color)',
                      color: checked ? 'var(--primary)' : 'var(--text-secondary)',
                      borderRadius: 'var(--border-radius-sm)',
                      fontWeight: checked ? 600 : 400
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={checked} 
                      readOnly 
                      style={{ cursor: 'pointer', accentColor: 'var(--primary)' }} 
                    />
                    <span>Day {idx + 1}</span>
                  </button>
                ))}
              </div>

              {/* Action leave challenge */}
              <div style={{ display: 'flex', justifycontent: 'flex-end', marginTop: '32px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <button onClick={handleLeave} className="btn btn-secondary btn-sm" style={{ color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                  Leave Challenge & Discard Progress
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="card text-center" style={{ padding: '40px' }}>
            <ShieldAlert size={32} style={{ color: 'var(--warning)', marginBottom: '12px' }} />
            <h3 style={{ marginBottom: '8px' }}>Challenge Locked</h3>
            <p className="text-sm text-secondary" style={{ marginBottom: '20px' }}>
              You must join this community challenge to unlock your progress checklist and log days.
            </p>
            <Link to="/challenges" className="btn btn-primary btn-sm">
              Back to Challenges catalog
            </Link>
          </div>
        )}

        {/* Rules Card */}
        <div className="card">
          <h3 className="flex align-center gap-1" style={{ fontSize: '1.2rem', marginBottom: '16px' }}>
            <Target size={18} style={{ color: 'var(--primary)' }} />
            <span>Challenge Guidelines</span>
          </h3>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }} className="text-sm text-secondary">
            {challenge.rules.map((rule, idx) => (
              <li key={idx} style={{ lineHeight: '1.6' }}>{rule}</li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
