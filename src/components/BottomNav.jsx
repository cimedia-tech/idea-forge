import React from 'react';
import { NavLink } from 'react-router-dom';
import { Lightbulb, List, Lock, FolderOpen } from 'lucide-react';

const navItems = [
  { to: '/', icon: Lightbulb, label: 'Capture' },
  { to: '/feed', icon: List, label: 'Feed' },
  { to: '/vault', icon: Lock, label: 'Vault' },
  { to: '/plans', icon: FolderOpen, label: 'Plans' }
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card rounded-b-none border-b-0 border-l-0 border-r-0 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full touch-target transition-colors duration-200 ${
                isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon size={24} className="mb-1" />
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse-glow" />
                  )}
                </div>
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
