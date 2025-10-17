// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TournamentRegistration from './components/TournamentRegistration';
// import RegistrationReport from './components/RegistrationReport'; // Add when you create it

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Routes>
            {/* Registration routes */}
            <Route path="/" element={<Navigate to="/register/aims-nov-2025" replace />} />
            <Route path="/register/:tournamentId" element={<TournamentRegistration />} />
            
            {/* Report routes (add later) */}
            {/* <Route path="/report/:tournamentId" element={<RegistrationReport />} /> */}
            {/* <Route path="/admin" element={<AdminDashboard />} /> */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}