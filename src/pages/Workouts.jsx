import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getWorkouts, deleteWorkout } from '../utils/storage';
import { Dumbbell, PlusCircle, Calendar, Clock, Flame, Search, Trash2, Edit2, ShieldAlert } from 'lucide-react';

export default function Workouts({ onUserUpdate }) {
  const [workouts, setWorkouts] = useState(() => getWorkouts());
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this workout log? This will deduct 100 XP from your leaderboard ranking.")) {
      setLoading(true);
      deleteWorkout(id);
      if (onUserUpdate) onUserUpdate();
      setTimeout(() => {
        setWorkouts(getWorkouts());
        setLoading(false);
        setSuccess('Workout log successfully deleted.');
        setTimeout(() => setSuccess(''), 3000);
      }, 300);
    }
  };

  const handleEdit = (id) => {
    navigate(`/workouts/add?edit=${id}`);
  };

  // Filter & Search logic
  const filteredWorkouts = workouts.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(search.toLowerCase()) || 
                          (w.notes && w.notes.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || w.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Page Header */}
      <div className="flex justify-between align-center wrap gap-2">
        <div>
          <h1 style={{ marginBottom: '8px' }}>My Workouts</h1>
          <p className="text-secondary">Track your physical exercises, durations, and calorie expenditures.</p>
        </div>
        <Link to="/workouts/add" className="btn btn-primary flex align-center gap-1">
          <PlusCircle size={18} />
          <span>Log Workout</span>
        </Link>
      </div>

      {success && (
        <div className="alert alert-success animate-fade">
          <ShieldAlert size={18} />
          <span>{success}</span>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="card" style={{ padding: '16px 24px' }}>
        <div className="flex justify-between align-center wrap gap-2">
          
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or notes..."
              className="form-input"
              style={{ paddingLeft: '38px', paddingRight: '12px' }}
            />
          </div>

          {/* Category Filters */}
          <div className="flex gap-1">
            {['All', 'Strength', 'Cardio', 'Flexibility'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`btn btn-sm ${categoryFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Workouts Grid */}
      {loading ? (
        <div className="text-center text-muted" style={{ padding: '40px' }}>Updating records...</div>
      ) : filteredWorkouts.length > 0 ? (
        <div className="grid grid-3 gap-3">
          {filteredWorkouts.map((w) => (
            <div key={w.id} className="card card-interactive flex flex-col justify-between" style={{ minHeight: '260px' }}>
              <div>
                
                {/* Header */}
                <div className="flex justify-between align-center" style={{ marginBottom: '12px' }}>
                  <span className={`badge ${
                    w.category === 'Strength' ? 'badge-primary' : 
                    w.category === 'Cardio' ? 'badge-secondary' : 'badge-success'
                  }`}>
                    {w.category}
                  </span>
                  <span className={`badge ${
                    w.intensity === 'High' ? 'badge-error' :
                    w.intensity === 'Medium' ? 'badge-warning' : 'badge-success'
                  }`} style={{ opacity: 0.85 }}>
                    {w.intensity} Intensity
                  </span>
                </div>

                {/* Workout Title */}
                <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>{w.name}</h3>

                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  <div className="flex align-center gap-1 text-xs text-secondary">
                    <Calendar size={12} />
                    <span>{w.date}</span>
                  </div>
                  <div className="flex align-center gap-1 text-xs text-secondary">
                    <Clock size={12} />
                    <span>{w.duration} minutes</span>
                  </div>
                  <div className="flex align-center gap-1 text-xs text-secondary">
                    <Flame size={12} style={{ color: 'var(--primary)' }} />
                    <span>{w.caloriesBurned} kcal burned</span>
                  </div>
                </div>

                {/* Notes */}
                {w.notes && (
                  <p className="text-xs text-muted" style={{
                    lineHeight: '1.5',
                    padding: '8px 12px',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--border-radius-sm)',
                    border: '1px solid var(--border-color)',
                    marginBottom: '16px',
                    fontStyle: 'italic'
                  }}>
                    "{w.notes}"
                  </p>
                )}

              </div>

              {/* Action Buttons */}
              <div className="flex gap-2" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '12px' }}>
                <button 
                  onClick={() => handleEdit(w.id)} 
                  className="btn btn-secondary btn-sm flex align-center justify-center gap-1"
                  style={{ flex: 1 }}
                >
                  <Edit2 size={12} />
                  <span>Edit</span>
                </button>
                <button 
                  onClick={() => handleDelete(w.id)} 
                  className="btn btn-secondary btn-sm flex align-center justify-center gap-1"
                  style={{ flex: 1, borderColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--error)' }}
                >
                  <Trash2 size={12} />
                  <span>Delete</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center" style={{ padding: '60px 24px' }}>
          <Dumbbell size={40} style={{ color: 'var(--text-muted)', marginBottom: '16px', transform: 'rotate(-45deg)' }} />
          <h3 style={{ marginBottom: '8px' }}>No Workouts Logged</h3>
          <p className="text-secondary text-sm" style={{ maxWidth: '380px', margin: '0 auto 20px auto' }}>
            Get started by logging your physical training sessions to earn XP and level up.
          </p>
          <Link to="/workouts/add" className="btn btn-primary btn-sm">
            <span>Log Your First Workout</span>
          </Link>
        </div>
      )}

    </div>
  );
}
