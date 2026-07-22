import { Target, ShieldCheck, Heart, Users } from 'lucide-react';

export default function About() {
  const pillars = [
    { title: "Empower Habits", desc: "Consistency beats intensity. Our tools focus on logging simple logs daily to build everlasting physical habits.", icon: Target },
    { title: "Gamified Fitness", desc: "Climb leaderboard positions and earn experience points (XP) for every workout logged, meal tracked, or challenge completed.", icon: ShieldCheck },
    { title: "Pure Privacy", desc: "All data is written and stored locally on your device (using Local Storage). No servers, no tracking, pure sovereignty.", icon: Heart },
    { title: "Peer Motivation", desc: "Engage in friendly campus rivalry. Build your profiles, collect unique badges, and check other classmates' performance.", icon: Users }
  ];

  return (
    <div className="container animate-fade" style={{ padding: '60px 24px', display: 'flex', flexDirection: 'column', gap: '60px' }}>
      
      {/* Title */}
      <section className="text-center" style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h1 className="text-gradient">About FlexSquad</h1>
        <p className="text-secondary" style={{ fontSize: '1.15rem', lineHeight: '1.6' }}>
          FlexSquad is an interactive, gamified Fitness Challenge Community designed specifically for college students to track their training, monitor dietary goals, and support each other's wellness journeys.
        </p>
      </section>

      {/* Pillars Grid */}
      <section className="grid grid-2 gap-3">
        {pillars.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div key={idx} className="card" style={{ display: 'flex', gap: '20px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--border-radius)',
                backgroundColor: 'var(--primary-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={22} style={{ color: 'var(--primary)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{p.title}</h3>
                <p className="text-secondary text-sm" style={{ lineHeight: '1.6' }}>{p.desc}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Gamification description */}
      <section className="card" style={{ padding: '40px' }}>
        <h2 style={{ marginBottom: '16px', textAlign: 'center' }}>How Does XP Work?</h2>
        <p className="text-secondary text-center" style={{ maxWidth: '600px', margin: '0 auto 32px auto' }}>
          We believe consistency should be celebrated. FlexSquad tracks your daily updates and translates them directly into Experience Points (XP) to elevate your level standing!
        </p>

        <div className="grid grid-3 gap-2" style={{ textAlign: 'center' }}>
          <div style={{ padding: '16px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>+100 XP</div>
            <h4 style={{ marginBottom: '4px' }}>Log a Workout</h4>
            <p className="text-muted text-sm">Add a strength, cardio, or yoga session. Increments your leaderboard workout total.</p>
          </div>
          
          <div style={{ padding: '16px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '8px' }}>+200 XP</div>
            <h4 style={{ marginBottom: '4px' }}>Join Community Challenges</h4>
            <p className="text-muted text-sm">Step outside your comfort zone. Join one of the shared challenges to push your boundaries.</p>
          </div>

          <div style={{ padding: '16px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)', marginBottom: '8px' }}>+30 XP</div>
            <h4 style={{ marginBottom: '4px' }}>Track Meals</h4>
            <p className="text-muted text-sm">Log your breakfast, lunch, or dinner macros to build positive dietary awareness.</p>
          </div>
        </div>
      </section>

      {/* Project details */}
      <section className="text-center" style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2>Academic Project Info</h2>
        <p className="text-secondary text-sm" style={{ lineHeight: '1.6' }}>
          This application was built in partial fulfillment of the Web Engineering curriculum. It showcases a modern, responsive single page application (SPA) created in React, utilizing client-side Routing and web local storage caches to model real-world database experiences without requiring setup overhead.
        </p>
        <div style={{
          marginTop: '8px',
          display: 'inline-flex',
          justifyContent: 'center',
          gap: '24px',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}>
          <span><strong>Course:</strong> Web Engineering 301</span>
          <span><strong>Instructor:</strong> Capstone Review Board</span>
        </div>
      </section>

    </div>
  );
}
