// The API only accepts changes from a signed-in admin, so every write request
// must carry the token that was saved at login.
export function authHeaders() {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Returns true (and sends the admin back to the login page) when the server
// says the session is missing or has expired.
export function sessionExpired(res, navigate) {
  if (res.status !== 401) return false;
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  alert('Your session has expired. Please sign in again.');
  navigate('/dashboard/login');
  return true;
}
