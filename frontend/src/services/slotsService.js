import api from '../lib/axios';

export async function getSlots() {
  const { data } = await api.get('/slots');
  return data;
}
