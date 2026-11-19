import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert('Please check empty field...!');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', data.user.username);
        navigate('/dashboard/home');
      } else {
        alert(data.error || 'Please Enter correct username and password...!');
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      alert('Login error: ' + err.message);
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/dashboard/assets/img/bgimg.jpg')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
            <div className="card card-primary" style={{ boxShadow: '0 4px 25px 0 rgba(0,0,0,0.2)' }}>
              <div className="card-header bg-white py-3 border-bottom">
                <h4 style={{ margin: 0, color: '#333' }}>Login</h4>
              </div>
              <div className="card-body p-4">
                {error && <div className="alert alert-danger py-2">{error}</div>}
                <form onSubmit={handleLogin}>
                  <div className="form-group mb-3">
                    <label htmlFor="name">Username</label>
                    <input
                      id="name"
                      type="text"
                      className="form-control"
                      name="name"
                      required
                      autoComplete="off"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label htmlFor="password">Password</label>
                    <input
                      id="password"
                      type="password"
                      className="form-control"
                      name="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg btn-block w-100"
                      disabled={loading}
                    >
                      {loading ? 'Logging in...' : 'Login'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
