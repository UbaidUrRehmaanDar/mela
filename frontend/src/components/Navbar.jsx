import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, User, Menu, X, Search } from 'lucide-react';
import { logOut } from '../services';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';

function NavItem({ to, children, end = false, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => (isActive ? 'active' : undefined)}
      onClick={onClick}
    >
      {children}
    </NavLink>
  );
}

export default function Navbar() {
  const { user, profile } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    if (!showMenu) return;
    const handler = () => setShowMenu(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [showMenu]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = async () => {
    await logOut();
    setShowMenu(false);
    setMobileOpen(false);
    navigate('/');
  };

  const closeMobile = () => setMobileOpen(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?q=${encodeURIComponent(searchQuery.trim())}`);
      closeMobile();
    }
  };

  const displayName =
    profile?.displayName || profile?.display_name || user?.email?.split('@')[0] || 'User';

  const role = profile?.role || null;

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="navbar-inner">
          <Link to="/" className="logo" onClick={closeMobile}>MELA</Link>

          <form className="nav-center" onSubmit={handleSearch} role="search">
            <input
              type="search"
              className="nav-search"
              placeholder="Search events, organizers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search events"
            />
          </form>

          <div className="nav-links">
            {!user && <NavItem to="/" end>Discover</NavItem>}
            <NavItem to="/events">Events</NavItem>
            {(role !== 'admin' && role !== 'moderator') && (
              <>
                <NavItem to="/universities">Campuses</NavItem>
                <NavItem to="/about">About</NavItem>
              </>
            )}

            {user && (role === 'admin' || role === 'moderator') && (
              <>
                <span className="nav-divider" aria-hidden="true" />
                {role === 'moderator' && <NavItem to="/admin">Moderator</NavItem>}
                {role === 'admin' && <NavItem to="/admin" end>Submissions</NavItem>}
                {role === 'admin' && <NavItem to="/admin/users">Admin</NavItem>}
              </>
            )}

            {user && (role !== 'admin' && role !== 'moderator') && (
              <>
                <span className="nav-divider" aria-hidden="true" />
                <NavItem to="/saved-events">Saved</NavItem>
                <NavItem to="/submit">Submit</NavItem>
                <NavItem to="/my-events">My Events</NavItem>
                <NavItem to="/my-registrations">Registrations</NavItem>
                {role === 'advisor' && <NavItem to="/advisor">Advisor</NavItem>}
              </>
            )}

            {user ? (
              <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="primary"
                  className="nav-user-btn"
                  size="sm"
                  onClick={() => setShowMenu((v) => !v)}
                  aria-expanded={showMenu}
                  aria-haspopup="true"
                >
                  {displayName}
                  <ChevronDown size={14} />
                </Button>

                {showMenu && (
                  <div className="nav-dropdown" role="menu">
                    <Link
                      to="/profile"
                      className="nav-dropdown-item"
                      onClick={() => setShowMenu(false)}
                      role="menuitem"
                    >
                      <User size={16} /> Profile
                    </Link>
                    <button
                      className="nav-dropdown-item danger"
                      onClick={handleLogout}
                      role="menuitem"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="sm">Login</Button>
              </Link>
            )}
          </div>

          <button
            className="nav-toggle"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <>
          <div
            className="mobile-nav-overlay open"
            onClick={closeMobile}
            aria-hidden="true"
          />
          <div className="mobile-nav-drawer" role="dialog" aria-label="Navigation menu">
            <div className="mobile-nav-header">
              <Link to="/" className="logo" onClick={closeMobile}>MELA</Link>
              <button className="nav-toggle" onClick={closeMobile} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSearch} className="search-bar" style={{ maxWidth: '100%', marginBottom: '8px' }}>
              <input
                type="search"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search events"
              />
              <button type="submit" aria-label="Search">
                <Search size={16} />
              </button>
            </form>

            {!user && <NavItem to="/" end onClick={closeMobile}>Discover</NavItem>}
            <NavItem to="/events" onClick={closeMobile}>Events</NavItem>

            {(role === 'admin' || role === 'moderator') ? (
              <>
                {role === 'moderator' && <NavItem to="/admin" onClick={closeMobile}>Moderator</NavItem>}
                {role === 'admin' && <NavItem to="/admin" end onClick={closeMobile}>Submissions</NavItem>}
                {role === 'admin' && <NavItem to="/admin/users" onClick={closeMobile}>Admin</NavItem>}
              </>
            ) : (
              <>
                <NavItem to="/universities" onClick={closeMobile}>Campuses</NavItem>
                <NavItem to="/about" onClick={closeMobile}>About</NavItem>
                <NavItem to="/help" onClick={closeMobile}>Help</NavItem>
                {user && (
                  <>
                    <NavItem to="/saved-events" onClick={closeMobile}>Saved</NavItem>
                    <NavItem to="/submit" onClick={closeMobile}>Submit</NavItem>
                    <NavItem to="/my-events" onClick={closeMobile}>My Events</NavItem>
                    <NavItem to="/my-registrations" onClick={closeMobile}>Registrations</NavItem>
                    {role === 'advisor' && <NavItem to="/advisor" onClick={closeMobile}>Advisor</NavItem>}
                  </>
                )}
              </>
            )}

            {user ? (
              <>
                <NavItem to="/profile" onClick={closeMobile}>Profile</NavItem>
                <button
                  className="nav-dropdown-item danger"
                  style={{ marginTop: '8px', border: 'var(--border)', width: '100%' }}
                  onClick={handleLogout}
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <NavItem to="/login" onClick={closeMobile}>Login</NavItem>
            )}
          </div>
        </>
      )}
    </>
  );
}
