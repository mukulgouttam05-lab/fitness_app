import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  getCurrentUser, 
  getWorkouts, 
  getJoinedChallenges, 
  getChallenges, 
  getLeaderboard,
  getNutritionLogs 
} from '../utils/storage';
import { 
  Dumbbell, 
  Flame, 
  Target, 
  Trophy, 
  PlusCircle, 
  Award,
  ChevronRight
} from 'lucide-react';

export default function Dashboard({ user }) {
  const [workouts] = useState(() => getWorkouts());
  const [joinedChallenges] = useState(() => getJoinedChallenges());
  const [leaderboard] = useState(() => getLeaderboard());
  const [nutrition] = useState(() => getNutritionLogs());

  if (!user) {
    return <div className="text-center text-muted" style={{ padding: '80px' }}>Loading session data...</div>;
  }

  // --- STATS COMPUTATIONS ---
  // Workouts logged this week
  const today = new Date();
  const pastWeekWorkouts = workouts.filter(w => {
    const wDate = new Date(w.date);
    const diffTime = Math.abs(today - wDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });

  // Nutrition today
  const todayStr = today.toISOString().split('T')[0];
  const todayMeals = nutrition.filter(n => n.date === todayStr);
  const dailyCalories = todayMeals.reduce((sum, m) => sum + m.calories, 0);

  // Leaderboard position
  const rankEntry = leaderboard.find(l => l.username.toLowerCase() === user.username.toLowerCase());
  const rankStr = rankEntry ? `#${rankEntry.rank}` : '--';
  const badgeStr = rankEntry ? rankEntry.badge : 'Rookie';

  // Active challenges detail fetch
  const allChallenges = getChallenges();
  const activeChallengesDetail = allChallenges.filter(c => joinedChallenges.includes(c.id));

  // XP Progress Calculation
  const xp = user.xp || 100;
  const currentLevel = Math.floor(xp / 500) + 1;
  const xpInCurrentLevel = xp % 500;
  const progressPercent = Math.min(100, Math.max(0, (xpInCurrentLevel / 500) * 100));

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Welcome banner segment */}
      <div className="flex justify-between align-center wrap gap-2">
        <div>
          <h1 style={{ fontSize: '2rem' }}>Welcome Back, <span className="text-gradient">{user.username}</span>!</h1>
          <p className="text-secondary text-sm">Here is a summary of your fitness progress and community activity.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/workouts/add" className="btn btn-primary btn-sm flex align-center gap-1">
            <PlusCircle size={16} />
            <span>Log Exercise</span>
          </Link>
          <Link to="/nutrition" className="btn btn-secondary btn-sm">
            Log Meal
          </Link>
        </div>
      </div>

      {/* Statistics Cards Row */}
      <div className="grid grid-4 gap-2" id="stats-row">
        
        {/* Card 1: Workouts */}
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary)' }}>
            <Dumbbell size={22} />
          </div>
          <div>
            <div className="text-xs text-muted">Workouts (7d)</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{pastWeekWorkouts.length}</h3>
          </div>
        </div>

        {/* Card 2: Calorie intake */}
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--secondary-glow)', color: 'var(--secondary)' }}>
            <Flame size={22} />
          </div>
          <div>
            <div className="text-xs text-muted">Calories Today</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              {dailyCalories} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {user.dailyCalorieTarget} kcal</span>
            </h3>
          </div>
        </div>

        {/* Card 3: Active Challenges */}
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
            <Target size={22} />
          </div>
          <div>
            <div className="text-xs text-muted">Challenges Active</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{joinedChallenges.length}</h3>
          </div>
        </div>

        {/* Card 4: Rank position */}
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)' }}>
            <Trophy size={22} />
          </div>
          <div>
            <div className="text-xs text-muted">Leaderboard Rank</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{rankStr}</h3>
          </div>
        </div>

      </div>

      {/* Main grids split */}
      <div className="grid grid-3 gap-3" style={{ gridTemplateColumns: '2fr 1fr' }} id="dashboard-splits">
        
        {/* Left Side: Recent activities + active challenges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Recent workouts feed */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.15rem' }}>Recent Activity Logs</h3>
              <Link to="/workouts" className="text-xs text-gradient font-semibold flex align-center gap-1">
                <span>View All</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {workouts.slice(0, 3).length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {workouts.slice(0, 3).map((w, index) => (
                  <div 
                    key={w.id} 
                    className="flex align-center justify-between"
                    style={{
                      padding: '16px 24px',
                      borderBottom: index === 2 ? 'none' : '1px solid var(--border-color)'
                    }}
                  >
                    <div className="flex align-center gap-2">
                      <div style={{
                        padding: '8px',
                        backgroundColor: 'var(--bg-tertiary)',
                        borderRadius: 'var(--border-radius-sm)',
                        color: 'var(--primary)'
                      }}>
                        <Dumbbell size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{w.name}</div>
                        <div className="text-xs text-muted">{w.date} • {w.category}</div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div className="text-sm font-bold" style={{ color: 'var(--primary)' }}>{w.caloriesBurned} kcal</div>
                      <div className="text-xs text-muted">{w.duration} mins</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted" style={{ padding: '40px' }}>
                <span>No workouts logged yet.</span>
              </div>
            )}
          </div>

          {/* Joined Active challenges progress list */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '20px' }}>My Active Challenges</h3>
            
            {activeChallengesDetail.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {activeChallengesDetail.map((c) => {
                  // Fetch checklist cache
                  const cacheKey = `fc_challengeProgress_${c.id}`;
                  const cache = localStorage.getItem(cacheKey);
                  const checkedDays = cache ? JSON.parse(cache).filter(Boolean).length : 0;
                  const challengePercent = Math.min(100, Math.round((checkedDays / c.durationDays) * 100));

                  return (
                    <div key={c.id} style={{
                      backgroundColor: 'var(--bg-secondary)',
                      padding: '16px',
                      borderRadius: 'var(--border-radius)',
                      border: '1px solid var(--border-color)'
                    }}>
                      <div className="flex justify-between align-center" style={{ marginBottom: '8px' }}>
                        <Link to={`/challenges/${c.id}`} style={{ fontWeight: 600, fontSize: '0.95rem' }} className="nav-link">
                          {c.title}
                        </Link>
                        <span className="text-xs text-muted">{checkedDays} / {c.durationDays} days completed</span>
                      </div>
                      
                      <div className="progress-container" style={{ height: '6px' }}>
                        <div className="progress-bar" style={{ width: `${challengePercent}%`, backgroundColor: 'var(--secondary)' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-muted" style={{ padding: '24px' }}>
                <span className="text-xs">No active challenges. Visit the <Link to="/challenges" style={{ color: 'var(--primary)', fontWeight: 600 }}>Challenges Catalogue</Link> to enroll.</span>
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Gamer level card & quick logs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Gamer Profile level badge */}
          <div className="card text-center" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            background: 'linear-gradient(180deg, var(--bg-card), var(--primary-glow))'
          }}>
            <Award size={44} style={{ color: 'var(--primary)' }} />
            
            <div>
              <div className="text-xs text-muted" style={{ fontWeight: 600, textTransform: 'uppercase' }}>Current Title</div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>{badgeStr}</h3>
            </div>

            <div style={{ width: '100%' }}>
              <div className="flex justify-between align-center text-xs" style={{ marginBottom: '4px' }}>
                <span>Level {currentLevel}</span>
                <span className="text-muted">{xp} XP</span>
              </div>
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progressPercent}%`, backgroundColor: 'var(--primary)' }} />
              </div>
            </div>

            <Link to="/profile" className="btn btn-secondary btn-sm btn-full">
              Edit My Profile Metrics
            </Link>
          </div>

          {/* Quick analysis suggestion widget */}
          <div className="card" style={{ borderStyle: 'dotted' }}>
            <h4 style={{ color: 'var(--secondary)', marginBottom: '8px' }}>Active Tips</h4>
            <p className="text-xs text-secondary" style={{ lineHeight: '1.5' }}>
              Want to increase your score? Joining new challenges rewards you with <span style={{ color: 'var(--primary)', fontWeight: 600 }}>+200 XP</span>. Logging training logs rewards <span style={{ color: 'var(--primary)', fontWeight: 600 }}>+100 XP</span>.
            </p>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          #dashboard-splits {
            grid-template-columns: 1fr !important;
          }
          #stats-row {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 576px) {
          #stats-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
}
