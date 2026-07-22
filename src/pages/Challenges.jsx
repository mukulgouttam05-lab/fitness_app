import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getChallenges, getJoinedChallenges, joinChallenge, leaveChallenge } from '../utils/storage';
import { Clock, Users, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Challenges({ onUserUpdate }) {
  const [challenges, setChallenges] = useState(() => getChallenges());
  const [joinedIds, setJoinedIds] = useState(() => getJoinedChallenges());
  const [activeTab, setActiveTab] = useState('All'); // 'All' or 'Active'
  const [successMsg, setSuccessMsg] = useState('');

  const handleJoin = (id) => {
    joinChallenge(id);
    if (onUserUpdate) onUserUpdate();
    setJoinedIds(getJoinedChallenges());
    setChallenges(getChallenges()); // refresh participant count
    setSuccessMsg('You joined the challenge! +200 XP rewarded.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleLeave = (id) => {
    if (window.confirm("Are you sure you want to leave this challenge? You will lose 200 XP from your leaderboard ranking.")) {
      leaveChallenge(id);
      if (onUserUpdate) onUserUpdate();
      setJoinedIds(getJoinedChallenges());
      setChallenges(getChallenges()); // refresh participant count
      setSuccessMsg('You left the challenge. 200 XP deducted.');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  // Filtering
  const displayedChallenges = challenges.filter(c => {
    if (activeTab === 'Active') {
      return joinedIds.includes(c.id);
    }
    return true;
  });

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <div className="flex justify-between align-center wrap gap-2">
        <div>
          <h1 style={{ marginBottom: '8px' }}>Community Challenges</h1>
          <p className="text-secondary">Join structured training routines alongside other squad members to earn rewards.</p>
        </div>
      </div>

      {successMsg && (
        <div className="alert alert-success animate-fade">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tab Filter bar */}
      <div className="card" style={{ padding: '12px 24px' }}>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('All')}
            className={`btn btn-sm ${activeTab === 'All' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All Challenges ({challenges.length})
          </button>
          <button 
            onClick={() => setActiveTab('Active')}
            className={`btn btn-sm ${activeTab === 'Active' ? 'btn-primary' : 'btn-secondary'}`}
          >
            My Active Challenges ({joinedIds.length})
          </button>
        </div>
      </div>

      {/* Grid of Challenges */}
      {displayedChallenges.length > 0 ? (
        <div className="grid grid-2 gap-3">
          {displayedChallenges.map((c) => {
            const isJoined = joinedIds.includes(c.id);
            return (
              <div key={c.id} className="card card-interactive flex flex-col justify-between" style={{ minHeight: '300px' }}>
                <div>
                  
                  {/* Header badges */}
                  <div className="flex justify-between align-center" style={{ marginBottom: '16px' }}>
                    <span className="badge badge-primary">{c.category}</span>
                    <span className={`badge ${
                      c.difficulty === 'Beginner' ? 'badge-success' : 
                      c.difficulty === 'Intermediate' ? 'badge-warning' : 'badge-error'
                    }`}>
                      {c.difficulty}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', marginBottom: '10px' }}>{c.title}</h3>
                  <p className="text-secondary text-sm" style={{ lineHeight: '1.6', marginBottom: '20px' }}>
                    {c.description}
                  </p>

                  {/* Core details */}
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                    <div className="flex align-center gap-1 text-xs text-secondary">
                      <Clock size={14} />
                      <span>{c.durationDays} Days</span>
                    </div>

                    <div className="flex align-center gap-1 text-xs text-secondary">
                      <Users size={14} />
                      <span>{c.participants} active members</span>
                    </div>

                    <div className="flex align-center gap-1 text-xs text-secondary">
                      <Award size={14} style={{ color: 'var(--primary)' }} />
                      <span>+{c.xpReward} XP</span>
                    </div>
                  </div>

                </div>

                {/* Actions row */}
                <div className="flex justify-between align-center" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  {isJoined ? (
                    <>
                      <div className="flex align-center gap-1 text-success text-sm font-semibold">
                        <ShieldCheck size={16} />
                        <span>Active Challenge</span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleLeave(c.id)} 
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                        >
                          Leave
                        </button>
                        <Link to={`/challenges/${c.id}`} className="btn btn-primary btn-sm">
                          Track Progress
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-muted">Earn reward XP upon sign up</span>
                      <button onClick={() => handleJoin(c.id)} className="btn btn-primary btn-sm">
                        Join Challenge
                      </button>
                    </>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="card text-center" style={{ padding: '60px 24px' }}>
          <Clock size={40} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
          <h3>No Challenges Found</h3>
          <p className="text-secondary text-sm">
            {activeTab === 'Active' ? 'You have not joined any community active challenges yet.' : 'There are no challenges matching criteria.'}
          </p>
        </div>
      )}

    </div>
  );
}
