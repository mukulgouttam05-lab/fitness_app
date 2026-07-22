import { Link } from 'react-router-dom';
import { getCurrentUser } from '../utils/storage';
import { Dumbbell, Target, Trophy, Flame, ArrowRight } from 'lucide-react';

export default function Home() {
  const user = getCurrentUser();

  const stats = [
    { label: "Active Members", count: "14.2k+", icon: Flame, color: "var(--primary)" },
    { label: "Completed Workouts", count: "89.4k+", icon: Dumbbell, color: "var(--secondary)" },
    { label: "Challenges Hosted", count: "120+", icon: Target, color: "var(--success)" },
    { label: "XP Distributed", count: "2.4M", icon: Trophy, color: "var(--warning)" }
  ];

  const features = [
    {
      title: "Interactive Challenges",
      desc: "Join community-wide fitness challenges. Keep track of milestones, complete rules, and earn massive XP rewards.",
      icon: Target
    },
    {
      title: "Clean Workout Logger",
      desc: "Track duration, calories, intensity, and detailed notes. Keep an organized log of your physical triumphs.",
      icon: Dumbbell
    },
    {
      title: "Dynamic Leaderboards",
      desc: "Rank against friends and community members. Gain XP, climb levels, and unlock elite titles and badges.",
      icon: Trophy
    },
    {
      title: "Macro Nutrition Tracker",
      desc: "Balance your diet with real-time calorie counts and macronutrient progress compared to your fitness target.",
      icon: Flame
    }
  ];

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '80px', padding: '60px 0' }}>
      
      {/* Hero section */}
      <section className="container text-center" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        maxWidth: '800px'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '9999px',
          border: '1px solid var(--border-color)',
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          <Flame size={14} style={{ color: 'var(--primary)' }} />
          <span>JOIN THE ULTIMATE COLLEGE FITNESS NETWORK</span>
        </div>

        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, textTransform: 'uppercase', lineHeight: '1.1' }}>
          Crush Your Limits.<br />
          <span className="text-gradient">Build Your Community.</span>
        </h1>

        <p className="text-secondary" style={{ fontSize: '1.2rem', maxWidth: '600px', lineHeight: '1.6' }}>
          FlexSquad unites fitness enthusiasts, athletes, and beginners. Log workouts, balance your nutrition, join challenges, and compete on the leaderboard.
        </p>

        <div className="flex gap-2" style={{ marginTop: '16px' }}>
          {user ? (
            <Link to="/dashboard" className="btn btn-primary">
              <span>Go to Dashboard</span>
              <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary">
                <span>Start Free Account</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn btn-secondary">Learn More</Link>
            </>
          )}
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="container">
        <div className="grid grid-4 gap-3">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="card text-center" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-color)'
                }}>
                  <Icon size={24} style={{ color: stat.color }} />
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>{stat.count}</h3>
                <span className="text-muted text-sm">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features grid */}
      <section className="container" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        <div className="text-center" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '16px' }}>Everything You Need To Succeed</h2>
          <p className="text-secondary">Fully loaded with premium trackers, social ranking logs, and picture galleries to document your physical improvements.</p>
        </div>

        <div className="grid grid-2 gap-3">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="card card-interactive flex gap-2" style={{ padding: '32px' }}>
                <div style={{
                  padding: '12px',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: 'var(--border-radius)',
                  height: 'fit-content'
                }}>
                  <Icon size={24} style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{feat.title}</h3>
                  <p className="text-secondary text-sm" style={{ lineHeight: '1.6' }}>{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA banner */}
      <section className="container">
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(9, 13, 22, 0.95))',
          border: '1px solid var(--primary)',
          borderRadius: 'var(--border-radius-lg)',
          padding: '50px 32px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px'
        }}>
          <Dumbbell size={40} style={{ color: 'var(--primary)', transform: 'rotate(-45deg)' }} />
          <h2 style={{ maxWidth: '600px', fontSize: '2.2rem' }}>Are You Ready To Take The Challenge?</h2>
          <p className="text-secondary" style={{ maxWidth: '500px' }}>
            Earn level badges, complete challenges, and keep track of your workouts alongside your classmates.
          </p>
          {!user ? (
            <Link to="/register" className="btn btn-primary">
              <span>Sign Up Now</span>
              <ArrowRight size={18} />
            </Link>
          ) : (
            <Link to="/dashboard" className="btn btn-primary">
              <span>Enter User Dashboard</span>
              <ArrowRight size={18} />
            </Link>
          )}
        </div>
      </section>

    </div>
  );
}
