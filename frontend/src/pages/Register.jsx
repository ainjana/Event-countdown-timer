import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, ArrowRight } from 'lucide-react';

export const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      return;
    }

    if (password !== passwordConfirm) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      await register({
        username,
        email,
        password,
        password_confirm: passwordConfirm,
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (data.username) {
          setError(`Username: ${data.username.join(' ')}`);
        } else if (data.password) {
          setError(`Password: ${data.password.join(' ')}`);
        } else if (data.detail) {
          setError(data.detail);
        } else {
          setError('Failed to create account. Please check your inputs.');
        }
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2rem 1rem' }}>
      <div className="form-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Create <i className="serif-italic">Account</i>
          </h2>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>
            Join Event Countdown to start tracking your milestone moments
          </p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email (Optional)</label>
            <input
              type="email"
              className="form-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Re-enter your password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '1rem' }}
            disabled={submitting}
          >
            {submitting ? 'Creating account...' : 'Create Account'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#111', fontWeight: 700, textDecoration: 'underline' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
