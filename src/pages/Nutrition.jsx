import { useState } from 'react';
import { getNutritionLogs, addNutritionMeal, deleteNutritionMeal, getCurrentUser } from '../utils/storage';
import { Apple, Plus, Trash2, ShieldCheck, Flame, Scale } from 'lucide-react';

export default function Nutrition({ onUserUpdate }) {
  const [logs, setLogs] = useState(() => getNutritionLogs());
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState('');

  const user = getCurrentUser();
  const calorieGoal = user?.dailyCalorieTarget || 2000;

  // Macro standard targets
  const proteinGoal = 150; // g
  const carbsGoal = 250; // g
  const fatGoal = 70; // g

  const [mealType, setMealType] = useState('Breakfast');
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const today = new Date().toISOString().split('T')[0];

  // Filter logs for today
  const todayLogs = logs.filter(l => l.date === today);

  // Totals logged today
  const totalCalories = todayLogs.reduce((sum, l) => sum + (parseInt(l.calories) || 0), 0);
  const totalProtein = todayLogs.reduce((sum, l) => sum + (parseInt(l.protein) || 0), 0);
  const totalCarbs = todayLogs.reduce((sum, l) => sum + (parseInt(l.carbs) || 0), 0);
  const totalFat = todayLogs.reduce((sum, l) => sum + (parseInt(l.fat) || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a meal/food name.');
      return;
    }
    if (isNaN(calories) || parseFloat(calories) < 0 || isNaN(protein) || parseFloat(protein) < 0) {
      alert('Please enter valid macro quantities.');
      return;
    }

    const newMeal = {
      mealType,
      name: name.trim(),
      calories: parseInt(calories) || 0,
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0,
      fat: parseInt(fat) || 0,
      date: today
    };

    addNutritionMeal(newMeal);
    setLogs(getNutritionLogs());
    if (onUserUpdate) onUserUpdate();
    setSuccess('Meal added to log. +30 XP rewarded.');
    
    // Reset Form
    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setShowForm(false);

    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this food entry?")) {
      deleteNutritionMeal(id);
      setLogs(getNutritionLogs());
      if (onUserUpdate) onUserUpdate();
      setSuccess('Food entry deleted.');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  // Progress percentages
  const calPercent = Math.min(100, Math.round((totalCalories / calorieGoal) * 100));
  const proPercent = Math.min(100, Math.round((totalProtein / proteinGoal) * 100));
  const carbPercent = Math.min(100, Math.round((totalCarbs / carbsGoal) * 100));
  const fatPercent = Math.min(100, Math.round((totalFat / fatGoal) * 100));

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <div className="flex justify-between align-center wrap gap-2">
        <div>
          <h1 style={{ marginBottom: '8px' }}>Nutrition Tracker</h1>
          <p className="text-secondary">Balance your macros and monitor calorie thresholds daily.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn btn-primary flex align-center gap-1"
        >
          <Plus size={18} />
          <span>{showForm ? 'Close panel' : 'Log Food / Meal'}</span>
        </button>
      </div>

      {success && (
        <div className="alert alert-success animate-fade">
          <ShieldCheck size={18} />
          <span>{success}</span>
        </div>
      )}

      {/* Main Dashboard view split */}
      <div className="grid grid-2 gap-3" style={{ gridTemplateColumns: '3fr 2fr' }} id="nutrition-split">
        
        {/* Left column: calorie rings and items list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Daily limits dashboard card */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Today's Balance</h3>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
              flexWrap: 'wrap'
            }}>
              {/* Circular Progress description */}
              <div style={{ flex: 1, minWidth: '180px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Flame size={20} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Calories Intake</span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800 }}>
                  {totalCalories} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ {calorieGoal} kcal</span>
                </div>
                <div className="progress-container" style={{ height: '10px', marginTop: '12px' }}>
                  <div className="progress-bar" style={{ width: `${calPercent}%`, backgroundColor: totalCalories > calorieGoal ? 'var(--error)' : 'var(--primary)' }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                  {totalCalories > calorieGoal ? `${totalCalories - calorieGoal} kcal over daily target limit!` : `${calorieGoal - totalCalories} kcal remaining`}
                </div>
              </div>

              {/* Pie metrics breakdown */}
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: '8px solid var(--bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }} className="cal-pie">
                <div className="text-center">
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>{calPercent}%</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Target Hit</div>
                </div>
              </div>
            </div>

            {/* Macro bars */}
            <div className="macronutrients" style={{ marginTop: '28px' }}>
              
              <div className="macro-box">
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Protein</div>
                <div style={{ fontWeight: 800, margin: '4px 0' }}>{totalProtein}g / {proteinGoal}g</div>
                <div className="progress-container" style={{ height: '4px' }}>
                  <div className="progress-bar" style={{ width: `${proPercent}%`, backgroundColor: 'var(--primary)' }} />
                </div>
              </div>

              <div className="macro-box">
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Carbohydrates</div>
                <div style={{ fontWeight: 800, margin: '4px 0' }}>{totalCarbs}g / {carbsGoal}g</div>
                <div className="progress-container" style={{ height: '4px' }}>
                  <div className="progress-bar" style={{ width: `${carbPercent}%`, backgroundColor: 'var(--secondary)' }} />
                </div>
              </div>

              <div className="macro-box">
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Fats</div>
                <div style={{ fontWeight: 800, margin: '4px 0' }}>{totalFat}g / {fatGoal}g</div>
                <div className="progress-container" style={{ height: '4px' }}>
                  <div className="progress-bar" style={{ width: `${fatPercent}%`, backgroundColor: 'var(--success)' }} />
                </div>
              </div>

              <div className="macro-box">
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Macro Cal Ratio</div>
                <div style={{ fontWeight: 800, margin: '4px 0', color: 'var(--secondary)' }}>
                  {totalProtein * 4 + totalCarbs * 4 + totalFat * 9} kcal
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Calculated</div>
              </div>

            </div>
          </div>

          {/* Table list of items logged */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.15rem' }}>Today's Food Intake Log</h3>
            </div>
            
            {todayLogs.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Food Item</th>
                      <th>Protein</th>
                      <th>Carbs</th>
                      <th>Fat</th>
                      <th>Calories</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="text-sm font-semibold">{log.mealType}</td>
                        <td className="text-sm">{log.name}</td>
                        <td className="text-xs text-secondary">{log.protein}g</td>
                        <td className="text-xs text-secondary">{log.carbs}g</td>
                        <td className="text-xs text-secondary">{log.fat}g</td>
                        <td className="text-sm font-bold" style={{ color: 'var(--primary)' }}>{log.calories} kcal</td>
                        <td>
                          <button 
                            onClick={() => handleDelete(log.id)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '6px', color: 'var(--error)' }}
                            title="Delete Food Entry"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-muted" style={{ padding: '40px' }}>
                <Apple size={36} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                <div>No meals logged today.</div>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Log Form panel */}
        <div>
          {showForm ? (
            <div className="card animate-slide">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Log New Food Item</h3>
              
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label className="form-label">Meal Type</label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    className="form-input"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack / Shake</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Food Name / Description</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Whey Protein Shake, Egg Scramble"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Calories (kcal)</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="e.g., 350"
                    className="form-input"
                    required
                  />
                </div>

                <div className="grid grid-3 gap-1" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Protein (g)</label>
                    <input
                      type="number"
                      value={protein}
                      onChange={(e) => setProtein(e.target.value)}
                      placeholder="e.g., 25"
                      className="form-input"
                      style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Carbs (g)</label>
                    <input
                      type="number"
                      value={carbs}
                      onChange={(e) => setCarbs(e.target.value)}
                      placeholder="e.g., 40"
                      className="form-input"
                      style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Fat (g)</label>
                    <input
                      type="number"
                      value={fat}
                      onChange={(e) => setFat(e.target.value)}
                      placeholder="e.g., 10"
                      className="form-input"
                      style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-full flex align-center justify-center gap-1" style={{ marginTop: '24px' }}>
                  <span>Log Meal Entry</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="card" style={{ borderStyle: 'dashed', textAlign: 'center', padding: '36px 20px' }}>
              <Scale size={32} style={{ color: 'var(--secondary)', marginBottom: '12px' }} />
              <h4>Dynamic Balances</h4>
              <p className="text-xs text-secondary" style={{ marginTop: '8px', lineHeight: '1.5' }}>
                Balanced eating helps maintain muscle tissue growth. Track your macronutrients daily to hit your ratios (40% carbs, 30% protein, 30% fats).
              </p>
            </div>
          )}
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          #nutrition-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
}
