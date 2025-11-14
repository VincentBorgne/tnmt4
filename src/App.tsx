import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TournamentRegistration from './components/TournamentRegistration';
import RegistrationReport from './components/RegistrationReport';

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Routes>
            {/* Registration routes - slug from iframe URL determines which tournament */}
            <Route path="/register/:tournamentId" element={<TournamentRegistration />} />
            
            {/* Report route */}
            <Route path="/registrations" element={<RegistrationReport />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}