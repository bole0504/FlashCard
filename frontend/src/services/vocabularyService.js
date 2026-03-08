import api from '../lib/axios';

export async function getVocabularies(params = {}) {
  const { data } = await api.get('/vocabulary', { params });
  return data;
}

export async function createVocabulary(formData) {
  const { data } = await api.post('/vocabulary', formData);
  return data;
}
