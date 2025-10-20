import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// Import your pages
import RegistrationForm from './pages/RegistrationForm'; // Your existing form
import RegistrationReport from './pages/RegistrationReport';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegistrationForm />} />
        <Route path="/report" element={<RegistrationReport />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);