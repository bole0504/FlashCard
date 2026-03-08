import api from '../lib/axios';

export async function getReviewSession() {
  const { data } = await api.get('/review/session');
  return data;
}

export async function completeReview(results) {
  const { data } = await api.post('/review/complete', { results });
  return data;
}

export async function getHint(vocabId) {
  const { data } = await api.get(`/review/hint/${vocabId}`);
  return data;
}

export async function verifyCard(vocabId, answer) {
  const { data } = await api.post('/review/verify-card', { vocabId, answer });
  return data;
}
