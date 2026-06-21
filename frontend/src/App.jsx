import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Providers from './components/Providers';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import EventFeed from './pages/EventFeed';
import SubmitEvent from './pages/SubmitEvent';
import ModeratorDashboard from './pages/ModeratorDashboard';
import EventDetail from './pages/EventDetails';
import Login from './pages/Login';
import Profile from './pages/Profile';
import SavedEvents from './pages/SavedEvents';
import AdminDashboard from './pages/AdminDashboard';
import AdvisorDashboard from './pages/AdvisorDashboard';
import MyEvents from './pages/MyEvents';
import UniversityList from './pages/UniversityList';
import UniversityDetail from './pages/UniversityDetail';
import ApplyOrganizer from './pages/ApplyOrganizer';
import AboutPage from './pages/AboutPage';
import HelpPage from './pages/HelpPage';
import NotFound from './pages/NotFound';
import MyRegistrations from './pages/MyRegistrations';
import PasswordReset from './pages/PasswordReset';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';

function App() {
  return (
    <Providers>
      <BrowserRouter>
        <ErrorBoundary>
          <Navbar />
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/events" element={<EventFeed />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/universities" element={<UniversityList />} />
              <Route path="/universities/:name" element={<UniversityDetail />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/reset-password" element={<PasswordReset />} />

              <Route path="/submit" element={<ProtectedRoute><SubmitEvent /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/saved-events" element={<ProtectedRoute><SavedEvents /></ProtectedRoute>} />
              <Route path="/my-registrations" element={<ProtectedRoute><MyRegistrations /></ProtectedRoute>} />
              <Route path="/my-events" element={<ProtectedRoute><MyEvents /></ProtectedRoute>} />
              <Route path="/apply-organizer" element={<ProtectedRoute><ApplyOrganizer /></ProtectedRoute>} />

              <Route path="/advisor" element={<ProtectedRoute requiredRole="advisor"><AdvisorDashboard /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute requiredRole={["moderator", "admin"]}><ModeratorDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </ErrorBoundary>
      </BrowserRouter>
    </Providers>
  );
}

export default App;
