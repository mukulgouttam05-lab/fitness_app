import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getWorkouts, deleteWorkout } from '../utils/storage';
import { Clock, Flame, Dumbbell, Trash2, Edit2, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

export default function WorkoutHistory({ onUserUpdate }) {
  const [workouts, setWorkouts] = useState(() => getWorkouts());
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this workout history log? This reduces your total logged sessions count.")) {
      deleteWorkout(id);
      if (onUserUpdate) onUserUpdate();
      setWorkouts(getWorkouts());
      setSuccess('Workout log successfully removed.');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleEdit = (id) => {
    navigate(`/workouts/add?edit=${id}`);
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  // Metrics calculations
  const totalWorkouts = workouts.length;
  const totalDuration = workouts.reduce((sum, w) => sum + (parseInt(w.duration) || 0), 0);
  const totalCalories = workouts.reduce((sum, w) => sum + (parseInt(w.caloriesBurned) || 0), 0);

  // Sorting
  const sortedWorkouts = [...workouts].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'duration' || sortField === 'caloriesBurned') {
      aVal = parseInt(aVal) || 0;
      bVal = parseInt(bVal) || 0;
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <div className="flex justify-between align-center wrap gap-2">
        <div>
          <h1 style={{ marginBottom: '8px' }}>Workout History</h1>
          <p className="text-secondary">Review your historical logs and aggregate exercises metrics.</p>
        </div>
        <Link to="/workouts" className="btn btn-secondary btn-sm">
          View Cards Grid
        </Link>
      </div>

      {success && (
        <div className="alert alert-success animate-fade">
          <ShieldCheck size={18} />
          <span>{success}</span>
        </div>
      )}

      {/* Stats Widgets */}
      <div className="grid grid-3 gap-3">
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary)' }}>
            <Dumbbell size={20} />
          </div>
          <div>
            <div className="text-xs text-muted">Total Sessions</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{totalWorkouts}</h3>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--secondary-glow)', color: 'var(--secondary)' }}>
            <Clock size={20} />
          </div>
          <div>
            <div className="text-xs text-muted">Total Time Spent</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
            </h3>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
            <Flame size={20} />
          </div>
          <div>
            <div className="text-xs text-muted">Total Calories Burned</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{totalCalories} kcal</h3>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {sortedWorkouts.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('date')}>
                    <span className="flex align-center gap-1">
                      <span>Date</span>
                      {sortField === 'date' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                    </span>
                  </th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>
                    <span className="flex align-center gap-1">
                      <span>Workout Name</span>
                      {sortField === 'name' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                    </span>
                  </th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('category')}>
                    <span className="flex align-center gap-1">
                      <span>Category</span>
                      {sortField === 'category' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                    </span>
                  </th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('duration')}>
                    <span className="flex align-center gap-1">
                      <span>Duration</span>
                      {sortField === 'duration' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                    </span>
                  </th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('caloriesBurned')}>
                    <span className="flex align-center gap-1">
                      <span>Calories</span>
                      {sortField === 'caloriesBurned' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                    </span>
                  </th>
                  <th>Intensity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedWorkouts.map((w) => (
                  <tr key={w.id}>
                    <td className="text-sm font-semibold">{w.date}</td>
                    <td className="text-sm">{w.name}</td>
                    <td>
                      <span className={`badge ${
                        w.category === 'Strength' ? 'badge-primary' : 
                        w.category === 'Cardio' ? 'badge-secondary' : 'badge-success'
                      }`}>
                        {w.category}
                      </span>
                    </td>
                    <td className="text-sm font-semibold">{w.duration} min</td>
                    <td className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>{w.caloriesBurned} kcal</td>
                    <td>
                      <span className={`badge ${
                        w.intensity === 'High' ? 'badge-error' : 
                        w.intensity === 'Medium' ? 'badge-warning' : 'badge-success'
                      }`}>
                        {w.intensity}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEdit(w.id)} 
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '6px' }}
                          title="Edit Workout"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button 
                          onClick={() => handleDelete(w.id)} 
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '6px', color: 'var(--error)' }}
                          title="Delete Workout"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-secondary" style={{ padding: '60px 24px' }}>
            <Trash2 size={40} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
            <h3>No Workout History Found</h3>
            <p className="text-sm text-muted">Erase filter queries or log sessions to start building history charts.</p>
          </div>
        )}
      </div>

    </div>
  );
}
