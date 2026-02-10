import { Home, Target, BookOpen, LineChart, Trophy } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/missions', icon: Target, label: 'Missions' },
  { to: '/learn', icon: BookOpen, label: 'Learn' },
  { to: '/simulator', icon: LineChart, label: 'Simulate' },
  { to: '/rewards', icon: Trophy, label: 'Rewards' },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-all duration-200 ${
                active
                  ? 'text-primary scale-105'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className={`rounded-xl p-1.5 transition-all duration-200 ${active ? 'gradient-primary shadow-glow' : ''}`}>
                <Icon size={20} className={active ? 'text-primary-foreground' : ''} />
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
