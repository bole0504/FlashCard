import api from '../lib/axios';

export async function getMe() {
  const { data } = await api.get('/users/me');
  return data;
}

export async function updateMe({ name, bio, avatar, removeAvatar }) {
  const fd = new FormData();
  if (name !== undefined) fd.append('name', name);
  if (bio !== undefined) fd.append('bio', bio);
  if (avatar) fd.append('avatar', avatar);
  if (removeAvatar) fd.append('removeAvatar', 'true');
  const { data } = await api.put('/users/me', fd);
  return data;
}
