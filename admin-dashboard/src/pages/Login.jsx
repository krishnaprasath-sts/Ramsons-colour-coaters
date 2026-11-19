import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiEye, FiEyeOff, FiLock, FiShield, FiUser } from 'react-icons/fi';
import { api, getToken, saveSession } from '../lib/api';
import { Alert, Spinner } from '../components/ui';

const HIGHLIGHTS = [
  'Update the home page banner slides',
  'Read and manage customer enquiries',
  'Publish and edit blog articles',
];

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get('expired') === '1';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Sign in | Ramson Admin';
  }, []);

  if (getToken() && !sessionExpired) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api('/api/auth/login', {
        method: 'POST',
        json: { username: username.trim(), password },
      });
      saveSession(data.token, data.user || { username: username.trim() });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <section className="login-aside" aria-hidden="true">
        <div className="login-aside-brand">
          <img
            src="/logo.jpg"
            alt=""
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div>
            <strong>Ramson</strong>
            <span>Colour Coaters</span>
          </div>
        </div>

        <div className="login-aside-body">
          <h2>Website control panel</h2>
          <p>Everything you need to keep the Ramson Colour Coaters website up to date, in one place.</p>
          <ul>
            {HIGHLIGHTS.map((item) => (
              <li key={item}>
                <FiCheckCircle />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="login-aside-foot">
          <FiShield />
          <span>Authorised staff only</span>
        </div>
      </section>

      <section className="login-main">
        <form className="login-card" onSubmit={handleSubmit}>
          <img
            className="login-logo"
            src="/logo.jpg"
            alt="Ramson Colour Coaters"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <h1>Sign in</h1>
          <p className="login-sub">Use your administrator account to continue.</p>

          {sessionExpired && !error && (
            <Alert type="info">Your session has ended. Please sign in again.</Alert>
          )}
          {error && <Alert type="danger">{error}</Alert>}

          <div className="field">
            <label htmlFor="login-username">Username</label>
            <div className="input-wrap">
              <FiUser className="input-icon" aria-hidden="true" />
              <input
                id="login-username"
                type="text"
                className="input has-icon"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck="false"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="login-password">Password</label>
            <div className="input-wrap">
              <FiLock className="input-icon" aria-hidden="true" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="input has-icon has-action"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="input-action"
                onClick={() => setShowPassword((show) => !show)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
            {loading ? (
              <>
                <Spinner /> Signing in...
              </>
            ) : (
              <>
                Sign in <FiArrowRight aria-hidden="true" />
              </>
            )}
          </button>

          <p className="login-foot">Protected area &bull; Ramson Colour Coaters</p>
        </form>
      </section>
    </div>
  );
}
