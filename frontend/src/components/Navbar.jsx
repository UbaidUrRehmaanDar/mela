import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logOut, onAuthChange } from '../services';
import Button from './ui/Button';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logOut();
    setShowMenu(false);
    navigate('/');
  };

  return (
    <nav className="navbar flex-between">
      <Link to="/" className="logo">MELA</Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        
        {user ? (
          <>
            <Link to="/saved-events">Saved</Link>
            <Link to="/submit">Submit Event</Link>
            <Link to="/my-submissions">My Submissions</Link>
            <Link to="/admin">Moderator</Link>
            
            <div style={{ position: 'relative' }}>
              <Button 
                variant="primary" 
                onClick={() => setShowMenu(!showMenu)}
                style={{ padding: '0.4rem 1rem' }}
              >
                {user.displayName || user.email?.split('@')[0] || 'User'} ▼
              </Button>
              
              {showMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  background: 'var(--mela-white)',
                  border: '3px solid black',
                  minWidth: '180px',
                  zIndex: 1000
                }}>
                  <Link 
                    to="/profile" 
                    onClick={() => setShowMenu(false)}
                    style={{ 
                      display: 'block', 
                      padding: '1rem', 
                      fontWeight: 700,
                      borderBottom: '2px solid black'
                    }}
                  >
                    👤 Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{ 
                      display: 'block', 
                      width: '100%',
                      padding: '1rem', 
                      fontWeight: 700,
                      background: 'var(--mela-pink)',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link to="/login">
            <Button variant="primary" style={{ padding: '0.4rem 1rem' }}>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
