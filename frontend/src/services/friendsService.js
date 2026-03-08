import api from '../lib/axios';

export async function getFriends() {
  const { data } = await api.get('/friends');
  return data;
}

export async function searchUsers(q) {
  const { data } = await api.get('/friends/search', { params: { q } });
  return data;
}

export async function addFriend(userId) {
  const { data } = await api.post(`/friends/${userId}`);
  return data;
}

export async function removeFriend(userId) {
  const { data } = await api.delete(`/friends/${userId}`);
  return data;
}
