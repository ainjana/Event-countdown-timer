import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, LogOut, Calendar, LayoutDashboard } from 'lucide-react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <RouterLink to="/dashboard" className="nav-brand">
          <span>Event <i className="serif-italic">Countdown</i></span>
        </RouterLink>

        {isAuthenticated ? (
          <div className="nav-links">
            <span className="nav-user">Hello, <strong>{user?.username}</strong></span>
            
            <RouterLink to="/dashboard" className="btn btn-secondary btn-sm">
              <LayoutDashboard size={15} />
              <span>Dashboard</span>
            </RouterLink>

            <RouterLink to="/events/new" className="btn btn-primary btn-sm">
              <Plus size={15} />
              <span>Add Event</span>
            </RouterLink>

            <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Logout">
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="nav-links">
            <RouterLink to="/login" className="btn btn-secondary btn-sm">
              Login
            </RouterLink>
            <RouterLink to="/register" className="btn btn-primary btn-sm">
              Register
            </RouterLink>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
