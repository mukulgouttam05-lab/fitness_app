import { useState } from 'react';
import { getWorkouts, getGalleryLogs } from '../utils/storage';
import { TrendingUp, BarChart3, LineChart, Sparkles } from 'lucide-react';

export default function Analytics() {
  const [workouts] = useState(() => getWorkouts());
  const [gallery] = useState(() => getGalleryLogs());
  const [hoveredNode, setHoveredNode] = useState(null); // { chartType: 'weight', index: 0, x: 0, y: 0, val: 0 }

  // --- CHART 1: Weight Trend Line Chart ---
  // Sort gallery logs chronological (oldest to newest for graphing left-to-right)
  const weightLogs = [...gallery]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-5); // take last 5 readings

  const maxWeight = Math.max(...weightLogs.map(l => l.weight), 85);
  const minWeight = Math.min(...weightLogs.map(l => l.weight), 65) - 5;
  const range = maxWeight - minWeight || 10;

  // Chart width/height variables
  const width = 500;
  const height = 200;
  const padding = 30;

  // Map weight coordinates to SVG space
  const weightPoints = weightLogs.map((log, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(weightLogs.length - 1, 1);
    const y = height - padding - ((log.weight - minWeight) * (height - padding * 2)) / range;
    return { x, y, weight: log.weight, date: log.date };
  });

  // Generate SVG line command (path d)
  let weightPathD = '';
  if (weightPoints.length > 0) {
    weightPathD = `M ${weightPoints[0].x} ${weightPoints[0].y} ` + 
      weightPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  }

  // --- CHART 2: Weekly Activity Bar Chart ---
  // Calculate minutes logged for each of the last 7 weekdays
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIndex = new Date().getDay();
  // Rearrange weekdays so that today is the last element
  const orderedWeekdays = [];
  for (let i = 6; i >= 0; i--) {
    const idx = (todayIndex - i + 7) % 7;
    orderedWeekdays.push(weekdays[idx]);
  }

  // Group workout durations by day of week (in milliseconds/date matching)
  const workoutMinutesByDay = Array(7).fill(0);
  workouts.forEach(w => {
    const wDate = new Date(w.date);
    const wDay = weekdays[wDate.getDay()];
    const orderIndex = orderedWeekdays.indexOf(wDay);
    if (orderIndex !== -1) {
      workoutMinutesByDay[orderIndex] += parseInt(w.duration) || 0;
    }
  });

  const maxDuration = Math.max(...workoutMinutesByDay, 45); // default ceiling at least 45 minutes

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ marginBottom: '8px' }}>Analytics & Insights</h1>
        <p className="text-secondary">Visualize your training performance patterns and biometric weight trajectories.</p>
      </div>

      {/* Grid containing custom SVG charts */}
      <div className="grid grid-2 gap-3" id="analytics-grid">
        
        {/* Chart Card 1: Weight line */}
        <div className="card">
          <div className="flex align-center gap-1" style={{ marginBottom: '20px' }}>
            <LineChart size={18} style={{ color: 'var(--secondary)' }} />
            <h3 style={{ fontSize: '1.15rem' }}>Body Weight Trend (kg)</h3>
          </div>

          {weightLogs.length > 1 ? (
            <div style={{ position: 'relative' }}>
              <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg">
                {/* Horizontal grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => {
                  const y = padding + r * (height - padding * 2);
                  const wVal = Math.round(maxWeight - r * range);
                  return (
                    <g key={idx}>
                      <line x1={padding} y1={y} x2={width - padding} y2={y} className="chart-grid" />
                      <text x={padding - 8} y={y + 4} textAnchor="end" className="chart-text">{wVal}</text>
                    </g>
                  );
                })}

                {/* Trend line */}
                {weightPathD && <path d={weightPathD} className="chart-line" />}

                {/* Trend line dots */}
                {weightPoints.map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredNode?.chartType === 'weight' && hoveredNode.index === idx ? 8 : 5}
                    className="chart-dot"
                    onMouseEnter={() => setHoveredNode({
                      chartType: 'weight',
                      index: idx,
                      x: pt.x,
                      y: pt.y - 12,
                      val: `${pt.weight} kg on ${pt.date}`
                    })}
                    onMouseLeave={() => setHoveredNode(null)}
                  />
                ))}

                {/* X-Axis Dates */}
                {weightPoints.map((pt, idx) => (
                  <text
                    key={idx}
                    x={pt.x}
                    y={height - 8}
                    textAnchor="middle"
                    className="chart-text"
                  >
                    {pt.date.slice(5) /* MM-DD */}
                  </text>
                ))}
              </svg>

              {/* Dynamic tooltip popup */}
              {hoveredNode?.chartType === 'weight' && (
                <div style={{
                  position: 'absolute',
                  left: `${(hoveredNode.x / width) * 100}%`,
                  top: `${(hoveredNode.y / height) * 100}%`,
                  transform: 'translate(-50%, -100%)',
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  border: '1px solid var(--secondary)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  color: 'white',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  zIndex: 10
                }}>
                  {hoveredNode.val}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-secondary" style={{ padding: '60px 24px' }}>
              <TrendingUp size={36} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
              <p className="text-sm">Log at least two weight entries in the Progress Gallery to generate trendlines.</p>
            </div>
          )}
        </div>

        {/* Chart Card 2: Training Minutes Bar */}
        <div className="card">
          <div className="flex align-center gap-1" style={{ marginBottom: '20px' }}>
            <BarChart3 size={18} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.15rem' }}>Weekly Workout Minutes</h3>
          </div>

          <div style={{ position: 'relative' }}>
            <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg">
              {/* Horizontal grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => {
                const y = padding + r * (height - padding * 2);
                const dVal = Math.round(maxDuration - r * maxDuration);
                return (
                  <g key={idx}>
                    <line x1={padding} y1={y} x2={width - padding} y2={y} className="chart-grid" />
                    <text x={padding - 8} y={y + 4} textAnchor="end" className="chart-text">{dVal}m</text>
                  </g>
                );
              })}

              {/* Columns bars */}
              {workoutMinutesByDay.map((min, idx) => {
                const barWidth = 32;
                const gap = (width - padding * 2) / 7;
                const x = padding + idx * gap + (gap - barWidth) / 2;
                const barHeight = (min * (height - padding * 2)) / maxDuration;
                const y = height - padding - barHeight;

                return (
                  <rect
                    key={idx}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={Math.max(barHeight, 4) /* minimum visible bar */}
                    className="chart-bar"
                    onMouseEnter={() => setHoveredNode({
                      chartType: 'duration',
                      index: idx,
                      x: x + barWidth / 2,
                      y: y - 10,
                      val: `${min} mins training`
                    })}
                    onMouseLeave={() => setHoveredNode(null)}
                  />
                );
              })}

              {/* Day Labels */}
              {orderedWeekdays.map((day, idx) => {
                const gap = (width - padding * 2) / 7;
                const x = padding + idx * gap + gap / 2;
                return (
                  <text
                    key={idx}
                    x={x}
                    y={height - 8}
                    textAnchor="middle"
                    className="chart-text"
                  >
                    {day}
                  </text>
                );
              })}
            </svg>

            {/* Bar Tooltip */}
            {hoveredNode?.chartType === 'duration' && (
              <div style={{
                position: 'absolute',
                left: `${(hoveredNode.x / width) * 100}%`,
                top: `${(hoveredNode.y / height) * 100}%`,
                transform: 'translate(-50%, -100%)',
                backgroundColor: 'rgba(0,0,0,0.9)',
                border: '1px solid var(--primary)',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                color: 'white',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                zIndex: 10
              }}>
                {hoveredNode.val}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Dynamic textual AI feedback tips */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(173, 250, 53, 0.03), rgba(6, 182, 212, 0.03))',
        border: '1px solid var(--border-color)'
      }}>
        <h3 className="flex align-center gap-1" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>
          <Sparkles size={18} style={{ color: 'var(--primary)' }} />
          <span>FlexSquad AI Analysis</span>
        </h3>
        <p className="text-secondary text-sm" style={{ lineHeight: '1.6' }}>
          {workouts.length > 0 ? (
            `Based on your logs, you average ${Math.round(workouts.reduce((sum, w) => sum + w.duration, 0) / workouts.length)} minutes per workout session. Your preferred training split targets Cardiorespiratory fitness, accumulating level progression points efficiently.`
          ) : (
            "Start logging your training split and dietary macros. Once you log exercises, this panel analyzes your metabolic volume."
          )}
        </p>
      </div>

    </div>
  );
}
