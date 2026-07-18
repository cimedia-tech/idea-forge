import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import CapturePage from './pages/CapturePage';
import FeedPage from './pages/FeedPage';
import VaultPage from './pages/VaultPage';
import PlansPage from './pages/PlansPage';
import IdeaDetailPage from './pages/IdeaDetailPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Widescreen Desktop Dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Mobile PWA Shell Wrapper */}
        <Route 
          path="*" 
          element={
            <div className="max-w-md mx-auto relative bg-[var(--color-background)] min-h-screen shadow-2xl overflow-hidden border-x border-[var(--color-border)]">
              <main className="h-full overflow-y-auto pb-16 scrollbar-hide">
                <Routes>
                  <Route path="/" element={<CapturePage />} />
                  <Route path="/feed" element={<FeedPage />} />
                  <Route path="/vault" element={<VaultPage />} />
                  <Route path="/plans" element={<PlansPage />} />
                  <Route path="/idea/:id" element={<IdeaDetailPage />} />
                </Routes>
              </main>
              
              <Routes>
                <Route path="/idea/:id" element={null} />
                <Route path="*" element={<BottomNav />} />
              </Routes>
            </div>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
