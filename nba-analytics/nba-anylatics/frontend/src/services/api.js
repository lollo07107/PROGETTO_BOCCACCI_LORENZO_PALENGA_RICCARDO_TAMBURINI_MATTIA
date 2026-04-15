const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('nba_token');
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Errore di rete');
  return data;
}

export const api = {
  // Auth
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (username, email, password) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ username, email, password }) }),

  // Dashboard
  dashboard: () => request('/dashboard'),

  // Teams
  teams: () => request('/teams'),
  team: (id) => request(`/teams/${id}`),

  // Players
  players: (search = '') => request(`/players${search ? `?search=${encodeURIComponent(search)}` : ''}`),

  // Games
  games: (status = '') => request(`/games${status ? `?status=${status}` : ''}`),

  // Predict
  predict: (homeTeamId, awayTeamId) =>
    request('/predict', { method: 'POST', body: JSON.stringify({ homeTeamId, awayTeamId }) }),
};