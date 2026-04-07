import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import EventFeed from './pages/EventFeed';
import SubmitEvent from './pages/SubmitEvent';
import ModeratorDashboard from './pages/ModeratorDashboard';
import EventDetail from './pages/EventDetails';
import Login from './pages/Login';
import Profile from './pages/Profile';
import MySubmissions from './pages/MySubmissions';
import SavedEvents from './pages/SavedEvents';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/events" element={<EventFeed />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/submit" element={<SubmitEvent />} />
        <Route path="/admin" element={<ModeratorDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-submissions" element={<MySubmissions />} />
        <Route path="/saved-events" element={<SavedEvents />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;