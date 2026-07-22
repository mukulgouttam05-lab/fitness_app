import { useState } from 'react';
import { getLeaderboard, getCurrentUser } from '../utils/storage';
import { Trophy, Search, Award, Dumbbell } from 'lucide-react';

export default function Leaderboard() {
  const [leaderboard] = useState(() => getLeaderboard());
  const [searchQuery, setSearchQuery] = useState('');
  const currentUser = getCurrentUser();

  const filteredRankings = leaderboard.filter(item => 
    item.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ marginBottom: '8px' }}>Community Leaderboard</h1>
        <p className="text-secondary">Compare your stats against classmate competitors and push each other to rank higher.</p>
      </div>

      {/* Podium Cards for Top 3 */}
      {filteredRankings.length >= 3 && searchQuery === '' && (
        <div className="grid grid-3 gap-3" style={{ alignItems: 'end', minHeight: '260px' }} id="podium-grid">
          
          {/* 2nd Place */}
          <div className="card text-center" style={{
            order: 1, 
            padding: '24px 16px', 
            borderColor: 'rgba(6, 182, 212, 0.3)',
            background: 'linear-gradient(180deg, var(--bg-card), rgba(6, 182, 212, 0.05))'
          }}>
            <Award size={32} style={{ color: 'var(--secondary)', marginBottom: '8px' }} />
            <h3 style={{ fontSize: '1.15rem' }}>{leaderboard[1]?.username}</h3>
            <span className="badge badge-secondary" style={{ margin: '8px 0' }}>Rank #2</span>
            <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{leaderboard[1]?.xp} XP</div>
            <div className="text-xs text-muted" style={{ marginTop: '4px' }}>Level {leaderboard[1]?.level} • {leaderboard[1]?.workouts} Workouts</div>
          </div>

          {/* 1st Place */}
          <div className="card text-center" style={{
            order: 2, 
            padding: '36px 16px', 
            borderColor: 'var(--primary)',
            background: 'linear-gradient(180deg, var(--bg-card), var(--primary-glow))',
            transform: 'scale(1.05)',
            boxShadow: '0 10px 25px -5px var(--primary-glow)'
          }}>
            <Trophy size={44} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
            <h3 style={{ fontSize: '1.35rem' }}>{leaderboard[0]?.username}</h3>
            <span className="badge badge-primary" style={{ margin: '8px 0', backgroundColor: 'var(--primary)', color: '#000' }}>Rank #1</span>
            <div className="text-base font-extrabold" style={{ color: 'var(--primary)' }}>{leaderboard[0]?.xp} XP</div>
            <div className="text-xs text-muted" style={{ marginTop: '4px' }}>Level {leaderboard[0]?.level} • {leaderboard[0]?.workouts} Workouts</div>
          </div>

          {/* 3rd Place */}
          <div className="card text-center" style={{
            order: 3, 
            padding: '20px 16px', 
            borderColor: 'rgba(16, 185, 129, 0.3)',
            background: 'linear-gradient(180deg, var(--bg-card), rgba(16, 185, 129, 0.05))'
          }}>
            <Award size={28} style={{ color: 'var(--success)', marginBottom: '8px' }} />
            <h3 style={{ fontSize: '1.1rem' }}>{leaderboard[2]?.username}</h3>
            <span className="badge badge-success" style={{ margin: '8px 0' }}>Rank #3</span>
            <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{leaderboard[2]?.xp} XP</div>
            <div className="text-xs text-muted" style={{ marginTop: '4px' }}>Level {leaderboard[2]?.level} • {leaderboard[2]?.workouts} Workouts</div>
          </div>

        </div>
      )}

      {/* Search ranking field */}
      <div className="card" style={{ padding: '16px 24px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username..."
            className="form-input"
            style={{ paddingLeft: '38px' }}
          />
        </div>
      </div>

      {/* Leaderboard Ranks Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Rank</th>
                <th>Competitor</th>
                <th>Level</th>
                <th>Workouts Logged</th>
                <th>Badge Achieved</th>
                <th style={{ textAlign: 'right' }}>Total XP</th>
              </tr>
            </thead>
            <tbody>
              {filteredRankings.length > 0 ? (
                filteredRankings.map((item) => {
                  const isSelf = currentUser && item.username.toLowerCase() === currentUser.username.toLowerCase();
                  return (
                    <tr 
                      key={item.username} 
                      style={{
                        backgroundColor: isSelf ? 'rgba(163, 230, 53, 0.08)' : 'transparent',
                        borderLeft: isSelf ? '4px solid var(--primary)' : 'none'
                      }}
                    >
                      <td style={{ fontWeight: 800 }} className="text-sm">
                        {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`}
                      </td>
                      <td className="text-sm font-semibold">
                        <span className="flex align-center gap-1">
                          <span>{item.username}</span>
                          {isSelf && <span className="badge badge-success text-xs" style={{ padding: '1px 6px' }}>Me</span>}
                        </span>
                      </td>
                      <td className="text-sm font-semibold">Level {item.level}</td>
                      <td>
                        <span className="flex align-center gap-1 text-xs">
                          <Dumbbell size={12} />
                          <span>{item.workouts} sessions</span>
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          item.badge === 'Iron Warrior' ? 'badge-primary' : 
                          item.badge === 'Gym Legend' ? 'badge-warning' : 
                          item.badge === 'Workout Warrior' ? 'badge-secondary' : 'badge-success'
                        }`}>
                          {item.badge}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--primary)' }} className="text-sm">
                        {item.xp} XP
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted" style={{ padding: '40px' }}>
                    No members match search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #podium-grid {
            grid-template-columns: 1fr !important;
            align-items: stretch !important;
          }
          #podium-grid > div {
            order: unset !important;
            transform: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>

    </div>
  );
}
