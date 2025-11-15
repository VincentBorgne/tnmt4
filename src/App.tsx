import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import TournamentRegistration from './components/TournamentRegistration';
import RegistrationReport from './components/RegistrationReport';

// Component to determine background color based on tournament
function AppContent() {
  const location = useLocation();
  
  // Determine tournament from URL path
  const isMPATournament = location.pathname.includes('mpa-dec-2025');
  const bgColor = isMPATournament ? 'bg-white' : 'bg-black';
  
  return (
    <div className={`min-h-screen ${bgColor} py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-3xl mx-auto">
        <Routes>
          {/* Registration routes - slug from iframe URL determines which tournament */}
          <Route path="/register/:tournamentId" element={<TournamentRegistration />} />
          
          {/* Admin Report route - no background wrapper needed */}
          <Route 
            path="/adminreport/:tournamentId" 
            element={
              <div className="min-h-screen">
                <RegistrationReport />
              </div>
            } 
          />
        </Routes>
      </div>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}