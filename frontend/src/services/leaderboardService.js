import api from '../lib/axios';

export async function getLeaderboard(params = {}) {
  const { data } = await api.get('/leaderboard', { params });
  return data;
}
