import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Dumbbell, 
  PlusCircle, 
  History, 
  Target, 
  Trophy, 
  Image, 
  Apple, 
  TrendingUp, 
  Settings 
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Workouts', path: '/workouts', icon: Dumbbell },
    { name: 'Log Workout', path: '/workouts/add', icon: PlusCircle },
    { name: 'Workout History', path: '/workouts/history', icon: History },
    { name: 'Nutrition Log', path: '/nutrition', icon: Apple },
    { name: 'Challenges', path: '/challenges', icon: Target },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Progress Gallery', path: '/gallery', icon: Image },
    { name: 'Analytics Insights', path: '/analytics', icon: TrendingUp },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const isItemActive = (itemPath) => {
    if (itemPath === '/dashboard') {
      return currentPath === '/dashboard';
    }
    return currentPath.startsWith(itemPath);
  };

  return (
    <aside className="sidebar-container" style={{
      width: '260px',
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      flexShrink: 0
    }}>
      <div style={{
        padding: '0 8px 16px 8px',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '16px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        User Panel
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex align-center gap-2 sidebar-link"
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--border-radius)',
                color: active ? '#000' : 'var(--text-secondary)',
                backgroundColor: active ? 'var(--primary)' : 'transparent',
                fontWeight: active ? 600 : 500,
                fontSize: '0.95rem',
                transition: 'all var(--transition-fast)',
                boxShadow: active ? '0 4px 12px var(--primary-glow)' : 'none'
              }}
            >
              <Icon size={18} style={{ color: active ? '#000' : 'inherit' }} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Embedded style for hover interaction and responsive view */}
      <style>{`
        .sidebar-link:hover {
          background-color: var(--bg-tertiary) !important;
          color: var(--text-primary) !important;
        }
        .sidebar-link:hover span {
          transform: translateX(2px);
        }
        .sidebar-link span {
          transition: transform 0.15s ease;
        }
        @media (max-width: 768px) {
          .sidebar-container {
            width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid var(--border-color) !important;
            padding: 16px !important;
          }
          .sidebar-container nav {
            flex-direction: row !important;
            flex-wrap: wrap !important;
            gap: 8px !important;
            justify-content: center !important;
          }
          .sidebar-link {
            padding: 8px 12px !important;
            font-size: 0.85rem !important;
          }
        }
      `}</style>
    </aside>
  );
}
