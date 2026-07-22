import { useState } from 'react';
import { getGalleryLogs, addGalleryLog } from '../utils/storage';
import { Image, Upload, Calendar, Weight, CheckCircle, MessageSquare } from 'lucide-react';

export default function Gallery() {
  const [logs, setLogs] = useState(() => getGalleryLogs());
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState('');

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [afterImg, setAfterImg] = useState('');

  // Convert uploaded image file to Base64 data URL
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) { // limit 1.5MB to save localStorage space
        alert('File size must be under 1.5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAfterImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!weight || isNaN(weight) || parseFloat(weight) <= 0) {
      alert('Please enter a valid weight.');
      return;
    }
    if (!afterImg) {
      alert('Please upload a progress photo.');
      return;
    }

    // Set starting image reference
    const startingLog = logs[logs.length - 1]; // oldest log at the end
    const beforeImg = startingLog ? (startingLog.afterImg || startingLog.beforeImg) : afterImg;

    const newLog = {
      date,
      weight: parseFloat(weight),
      notes: notes.trim(),
      beforeImg,
      afterImg
    };

    addGalleryLog(newLog);
    setLogs(getGalleryLogs());
    setSuccess('Progress log uploaded! +150 XP rewarded.');
    
    // Clear form
    setWeight('');
    setNotes('');
    setAfterImg('');
    setShowForm(false);

    setTimeout(() => setSuccess(''), 4000);
  };

  // Find start weight to show overall change
  const startingWeight = logs.length > 0 ? logs[logs.length - 1].weight : null;

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <div className="flex justify-between align-center wrap gap-2">
        <div>
          <h1 style={{ marginBottom: '8px' }}>Progress Gallery</h1>
          <p className="text-secondary">Document your bodily transformations and weight metrics visually.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn btn-primary flex align-center gap-1"
        >
          <Upload size={18} />
          <span>{showForm ? 'Close Form' : 'Log Progress Photo'}</span>
        </button>
      </div>

      {success && (
        <div className="alert alert-success animate-fade">
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      {/* Upload Form Card */}
      {showForm && (
        <div className="card animate-slide" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Upload Progress Check-in</h3>
          
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Check-in Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Current Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g., 76.5"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Upload Current Photo</label>
              <div style={{
                border: '2px dashed var(--border-color)',
                borderRadius: 'var(--border-radius)',
                padding: '24px',
                textAlign: 'center',
                backgroundColor: 'var(--bg-secondary)',
                cursor: 'pointer',
                position: 'relative'
              }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
                
                {afterImg ? (
                  <div className="flex flex-col align-center gap-1">
                    <img 
                      src={afterImg} 
                      alt="Preview" 
                      style={{ maxWidth: '140px', maxHeight: '180px', borderRadius: 'var(--border-radius-sm)', objectFit: 'cover' }} 
                    />
                    <span className="text-xs text-muted" style={{ marginTop: '8px' }}>Click or drag to replace image</span>
                  </div>
                ) : (
                  <div className="flex flex-col align-center gap-2">
                    <Upload size={24} style={{ color: 'var(--text-muted)' }} />
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Choose image files</div>
                    <span className="text-xs text-muted">Supports JPG, PNG, WEBP (Max. 1.5MB)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Progress Notes / Thoughts</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How are you feeling? Any visible muscle gains or dietary observations?"
                className="form-input"
                rows="3"
                style={{ resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full flex align-center justify-center gap-1">
              <span>Publish Progress Entry</span>
            </button>
          </form>
        </div>
      )}

      {/* Grid of logged entries */}
      {logs.length > 0 ? (
        <div className="grid grid-2 gap-3" id="gallery-split-grid">
          {logs.map((log) => {
            const weightDiff = startingWeight ? (log.weight - startingWeight).toFixed(1) : 0;
            const diffSymbol = parseFloat(weightDiff) > 0 ? `+${weightDiff}` : weightDiff;
            
            return (
              <div key={log.id} className="card gallery-card">
                
                {/* Side-by-side photo comparison */}
                <div className="gallery-split">
                  
                  {/* Before */}
                  <div className="gallery-img-container">
                    <img src={log.beforeImg} alt="Before" className="gallery-img" />
                    <span className="gallery-label" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>Before</span>
                  </div>

                  {/* After */}
                  <div className="gallery-img-container">
                    <img src={log.afterImg} alt="After" className="gallery-img" />
                    <span className="gallery-label" style={{ backgroundColor: 'var(--primary)', color: '#000' }}>Current</span>
                  </div>

                </div>

                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="flex justify-between align-center">
                    <div className="flex align-center gap-1 text-xs text-muted">
                      <Calendar size={12} />
                      <span>{log.date}</span>
                    </div>
                    <span className={`badge ${log.isInitial ? 'badge-secondary' : 'badge-primary'}`}>
                      {log.isInitial ? 'Baseline Entry' : 'Progress Log'}
                    </span>
                  </div>

                  <div className="flex justify-between align-center" style={{ margin: '8px 0' }}>
                    <div className="flex align-center gap-1">
                      <Weight size={16} style={{ color: 'var(--secondary)' }} />
                      <strong style={{ fontSize: '1.1rem' }}>{log.weight} kg</strong>
                    </div>

                    {!log.isInitial && startingWeight && (
                      <span className={`badge ${parseFloat(weightDiff) <= 0 ? 'badge-success' : 'badge-error'}`} style={{ fontWeight: 700 }}>
                        {diffSymbol} kg overall
                      </span>
                    )}
                  </div>

                  {log.notes && (
                    <div className="flex gap-2" style={{
                      backgroundColor: 'var(--bg-secondary)',
                      padding: '10px 14px',
                      borderRadius: 'var(--border-radius-sm)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.85rem',
                      lineHeight: '1.5'
                    }}>
                      <MessageSquare size={16} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '2px' }} />
                      <p className="text-secondary italic">"{log.notes}"</p>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="card text-center" style={{ padding: '60px 24px' }}>
          <Image size={40} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
          <h3>No Photos Uploaded</h3>
          <p className="text-secondary text-sm" style={{ maxWidth: '380px', margin: '0 auto' }}>
            Document your physical transformations. Upload your baseline photo now and update it periodically to generate comparisons.
          </p>
        </div>
      )}

      <style>{`
        @media (max-width: 576px) {
          #gallery-split-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
}
