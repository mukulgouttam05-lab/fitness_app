import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required.";
    
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address.";
    }

    if (!formData.subject.trim()) tempErrors.subject = "Subject is required.";
    
    if (!formData.message.trim()) {
      tempErrors.message = "Message cannot be empty.";
    } else if (formData.message.length < 10) {
      tempErrors.message = "Message must be at least 10 characters long.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      // Auto fade success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  return (
    <div className="container animate-fade" style={{ padding: '60px 24px', display: 'flex', flexDirection: 'column', gap: '48px' }}>
      
      {/* Title */}
      <div className="text-center" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 className="text-gradient">Get In Touch</h1>
        <p className="text-secondary" style={{ marginTop: '8px' }}>
          Have any issues logging details, syncing with your class dashboard, or questions about the community? Send us a line.
        </p>
      </div>

      <div className="grid grid-3 gap-3" style={{ gridTemplateColumns: '1fr 2fr' }} id="contact-split">
        {/* Support channels card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <h3 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Support Channels</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="flex align-center gap-2">
                <div style={{
                  padding: '8px',
                  backgroundColor: 'var(--primary-glow)',
                  borderRadius: 'var(--border-radius-sm)',
                  color: 'var(--primary)'
                }}>
                  <Mail size={18} />
                </div>
                <div>
                  <div className="text-xs text-muted">Email Support</div>
                  <div className="text-sm font-semibold" style={{ wordBreak: 'break-all' }}>support@flexsquad.edu</div>
                </div>
              </div>

              <div className="flex align-center gap-2">
                <div style={{
                  padding: '8px',
                  backgroundColor: 'var(--secondary-glow)',
                  borderRadius: 'var(--border-radius-sm)',
                  color: 'var(--secondary)'
                }}>
                  <Phone size={18} />
                </div>
                <div>
                  <div className="text-xs text-muted">Hotline Call</div>
                  <div className="text-sm font-semibold">+1 (555) 789-FLEX</div>
                </div>
              </div>

              <div className="flex align-center gap-2">
                <div style={{
                  padding: '8px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  borderRadius: 'var(--border-radius-sm)',
                  color: 'var(--success)'
                }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-xs text-muted">Campus Office</div>
                  <div className="text-sm font-semibold">Rec Center, Room 102</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ backgroundColor: 'var(--bg-secondary)', borderStyle: 'dashed' }}>
            <h4 style={{ marginBottom: '8px', color: 'var(--primary)' }}>Academic Notice</h4>
            <p className="text-xs text-secondary" style={{ lineHeight: '1.5' }}>
              This contact form is fully interactive and validates standard forms on the client side. Submitting inputs updates the view but does not dispatch emails to servers.
            </p>
          </div>
        </div>

        {/* Message submission form */}
        <div className="card">
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Send Message</h2>
          
          {success && (
            <div className="alert alert-success animate-fade">
              <CheckCircle2 size={18} />
              <span>Thank you! Your feedback has been simulated. We will review it shortly.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Alex Carter"
                />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="name@university.edu"
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="form-input"
                placeholder="How can we assist you?"
              />
              {errors.subject && <div className="form-error">{errors.subject}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-input"
                rows="6"
                placeholder="Write details of your question here (minimum 10 characters)..."
                style={{ resize: 'vertical' }}
              />
              {errors.message && <div className="form-error">{errors.message}</div>}
            </div>

            <button type="submit" className="btn btn-primary btn-full flex align-center justify-center gap-1">
              <Send size={16} />
              <span>Submit Message</span>
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #contact-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
