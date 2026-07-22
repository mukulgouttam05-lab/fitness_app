import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { getWorkouts, addWorkout, updateWorkout } from '../utils/storage';
import { ClipboardList, Save, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function AddWorkout({ onUserUpdate }) {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const navigate = useNavigate();

  // Initialize state directly from localStorage if edit mode is active
  const [formData, setFormData] = useState(() => {
    if (editId) {
      const workouts = getWorkouts();
      const existing = workouts.find(w => w.id === editId);
      if (existing) {
        return {
          name: existing.name,
          category: existing.category,
          duration: existing.duration,
          caloriesBurned: existing.caloriesBurned,
          date: existing.date,
          intensity: existing.intensity,
          notes: existing.notes || ''
        };
      }
    }
    return {
      name: '',
      category: 'Strength',
      duration: '',
      caloriesBurned: '',
      date: new Date().toISOString().split('T')[0],
      intensity: 'Medium',
      notes: ''
    };
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Workout name is required.';
    else if (formData.name.length < 3) tempErrors.name = 'Must be at least 3 characters.';

    if (!formData.duration || isNaN(formData.duration) || parseInt(formData.duration) <= 0) {
      tempErrors.duration = 'Duration must be greater than 0.';
    }

    if (!formData.caloriesBurned || isNaN(formData.caloriesBurned) || parseInt(formData.caloriesBurned) <= 0) {
      tempErrors.caloriesBurned = 'Calories must be greater than 0.';
    }

    if (!formData.date) {
      tempErrors.date = 'Date is required.';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    setTimeout(() => {
      if (editId) {
        updateWorkout({
          id: editId,
          ...formData
        });
      } else {
        addWorkout(formData);
        if (onUserUpdate) onUserUpdate();
      }
      setLoading(false);
      navigate('/workouts');
    }, 400);
  };

  return (
    <div className="container animate-fade" style={{ padding: '24px 0', maxWidth: '640px' }}>
      
      {/* Back link */}
      <Link to="/workouts" className="flex align-center gap-1 text-sm text-secondary nav-link" style={{ marginBottom: '24px', width: 'fit-content' }}>
        <ArrowLeft size={16} />
        <span>Back to Workouts</span>
      </Link>

      <div className="card">
        {/* Card Header */}
        <div className="flex align-center gap-2" style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <ClipboardList size={24} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '1.5rem' }}>{editId ? 'Edit Workout Log' : 'Log New Workout'}</h2>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          
          <div className="form-group">
            <label className="form-label">Workout Name / Routine</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Heavy Chest Press, Evening Run"
              className="form-input"
              disabled={loading}
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Exercise Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-input"
                disabled={loading}
              >
                <option value="Strength">Strength</option>
                <option value="Cardio">Cardio</option>
                <option value="Flexibility">Flexibility</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Intensity Level</label>
              <select
                name="intensity"
                value={formData.intensity}
                onChange={handleChange}
                className="form-input"
                disabled={loading}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 45"
                className="form-input"
                disabled={loading}
              />
              {errors.duration && <div className="form-error">{errors.duration}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Calories Burned (kcal)</label>
              <input
                type="number"
                name="caloriesBurned"
                value={formData.caloriesBurned}
                onChange={handleChange}
                placeholder="e.g., 350"
                className="form-input"
                disabled={loading}
              />
              {errors.caloriesBurned && <div className="form-error">{errors.caloriesBurned}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Workout Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
            />
            {errors.date && <div className="form-error">{errors.date}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Workout Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g., Hit 5 sets, set new PR, felt energetic"
              className="form-input"
              rows="4"
              style={{ resize: 'vertical' }}
              disabled={loading}
            />
          </div>

          {!editId && (
            <div className="alert alert-success" style={{ backgroundColor: 'var(--bg-secondary)', borderStyle: 'dashed', padding: '10px 14px', fontSize: '0.8rem', color: 'var(--primary)', borderColor: 'var(--primary-glow)', marginBottom: '20px' }}>
              <AlertTriangle size={14} style={{ color: 'var(--primary)' }} />
              <span>Logging this workout successfully will reward your leaderboard profile +100 XP!</span>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-full flex align-center justify-center gap-1" disabled={loading}>
            <Save size={16} />
            <span>{loading ? 'Saving details...' : editId ? 'Save Changes' : 'Publish Workout'}</span>
          </button>
        </form>
      </div>

    </div>
  );
}
