import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { keyframes } from '@emotion/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, CheckCircle, Cancel, Lightbulb } from '@mui/icons-material';
import { getReviewSession, completeReview, getHint, verifyCard } from '../services/reviewService';
import { resolveAssetUrl } from '../lib/api';

const shakeKeyframes = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
  20%, 40%, 60%, 80% { transform: translateX(6px); }
`;

const successKeyframes = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export default function ReviewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [hintsUsed, setHintsUsed] = useState({});
  const [verifiedStatus, setVerifiedStatus] = useState({});
  const [wrongVocab, setWrongVocab] = useState(null);
  const [effect, setEffect] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['review-session'],
    queryFn: getReviewSession,
    retry: false,
  });

  const completeMutation = useMutation({
    mutationFn: completeReview,
    onSuccess: (res) => {
      setResult(res);
      queryClient.invalidateQueries({ queryKey: ['slots'] });
    },
  });

  const hintMutation = useMutation({
    mutationFn: getHint,
    onSuccess: (res, vocabId) => {
      setHintsUsed((prev) => ({ ...prev, [vocabId]: res.firstLetter }));
    },
  });

  const verifyMutation = useMutation({
    mutationFn: ({ vocabId, answer }) => verifyCard(vocabId, answer),
    onSuccess: (res, { vocabId }) => {
      if (res.correct) {
        setEffect('success');
        setVerifiedStatus((prev) => ({ ...prev, [vocabId]: 'correct' }));
        setTimeout(() => setEffect(null), 600);
      } else {
        setEffect('wrong');
        setVerifiedStatus((prev) => ({ ...prev, [vocabId]: 'wrong' }));
        setWrongVocab(res.vocab);
        setTimeout(() => setEffect(null), 600);
      }
    },
  });

  const vocabs = data?.vocabs || [];
  const currentVocab = vocabs[currentIndex];
  const currentAnswer = answers[currentVocab?._id] ?? '';
  const isVerified = currentVocab && verifiedStatus[currentVocab._id];
  const isCorrect = isVerified && verifiedStatus[currentVocab._id] === 'correct';
  const isWrong = isVerified && verifiedStatus[currentVocab._id] === 'wrong';
  const progress = vocabs.length ? ((currentIndex + 1) / vocabs.length) * 100 : 0;

  const handleAnswerChange = (e) => {
    if (!currentVocab) return;
    setAnswers((prev) => ({ ...prev, [currentVocab._id]: e.target.value }));
  };

  const handleVerify = () => {
    if (!currentVocab) return;
    const trimmed = currentAnswer.trim();
    if (!trimmed) return;
    verifyMutation.mutate({ vocabId: currentVocab._id, answer: trimmed });
  };

  const handleNext = () => {
    if (!currentVocab) return;
    setWrongVocab(null);

    if (currentIndex < vocabs.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      const results = vocabs.map((v) => ({
        vocabId: v._id,
        answer: answers[v._id]?.trim() ?? '',
      }));
      completeMutation.mutate(results);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setAnswers({});
    setResult(null);
    setHintsUsed({});
    setVerifiedStatus({});
    setWrongVocab(null);
    setEffect(null);
    queryClient.invalidateQueries({ queryKey: ['review-session'] });
  };

  const handleHint = () => {
    if (!currentVocab || hintsUsed[currentVocab._id]) return;
    hintMutation.mutate(currentVocab._id);
  };

  const currentHint = currentVocab ? hintsUsed[currentVocab._id] : null;
  const canVerify = currentAnswer.trim() && !isVerified && !verifyMutation.isPending;

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    const msg = error?.response?.data?.message || 'Failed to load review session';
    const code = error?.response?.data?.code;
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/home')} color="inherit" sx={{ mb: 2 }}>
          Back
        </Button>
        <Card>
          <CardContent>
            <Typography color="error">{msg}</Typography>
            {code === 'NOT_ENOUGH_VOCAB' && (
              <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/vocabulary/add')}>
                Add vocabulary first
              </Button>
            )}
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (result) {
    const passed = result.passed;
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/home')} color="inherit" sx={{ mb: 2 }}>
          Back
        </Button>
        <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            {passed ? (
              <>
                <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Passed!
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {result.message}
                </Typography>
                <Typography variant="body2" color="primary.main">
                  You now have {result.slotsAvailable}/{result.slotsTotal} slots to add new words.
                </Typography>
              </>
            ) : (
              <>
                <Cancel sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Not passed
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {result.message}
                </Typography>
                <Typography variant="body2">
                  You need 5/5 correct. Try again!
                </Typography>
              </>
            )}
            <Box sx={{ mt: 3, display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button variant="outlined" onClick={() => navigate('/home')}>
                Back to Home
              </Button>
              {!passed && (
                <Button variant="contained" onClick={handleRetry}>
                  Try again
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', py: 2, px: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/home')} color="inherit">
          Back
        </Button>
      </Box>

      <Box sx={{ maxWidth: 480, mx: 'auto', p: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Card {currentIndex + 1} of {vocabs.length}
        </Typography>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3, mb: 3 }} />

        <Card
          sx={{
            overflow: 'hidden',
            ...(effect === 'wrong' && {
              animation: `${shakeKeyframes} 0.5s ease-in-out`,
            }),
            ...(effect === 'success' && {
              animation: `${successKeyframes} 0.5s ease-out`,
            }),
            ...(isCorrect && { border: 2, borderColor: 'success.main' }),
            ...(isWrong && { border: 2, borderColor: 'error.main' }),
          }}
        >
          <Box
            component="img"
            src={resolveAssetUrl(currentVocab?.image)}
            alt="Vocabulary"
            sx={{
              width: '100%',
              aspectRatio: '16/10',
              objectFit: 'cover',
              bgcolor: 'action.hover',
            }}
          />
          <CardContent>
            {!isVerified ? (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Type the word for this image
                </Typography>
                {currentHint && (
                  <Typography variant="body2" color="primary.main" sx={{ mb: 1, fontWeight: 600 }}>
                    Gợi ý: bắt đầu bằng chữ <strong>"{currentHint}"</strong>
                  </Typography>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    placeholder="Enter the word"
                    value={currentAnswer}
                    onChange={handleAnswerChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                    autoFocus
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Lightbulb />}
                    onClick={handleHint}
                    disabled={!!currentHint || hintMutation.isPending}
                    title="Gợi ý chữ cái đầu"
                  >
                    Hint
                  </Button>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleVerify}
                  disabled={!canVerify}
                >
                  Verify
                </Button>
              </>
            ) : isWrong && wrongVocab ? (
              <>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Cancel sx={{ color: 'error.main', fontSize: 28 }} />
                  <Typography variant="h6" color="error.main">
                    Sai rồi. Ôn lại nhé!
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    mb: 2,
                    borderLeft: 4,
                    borderColor: 'error.main',
                    bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(211,47,47,0.15)' : 'rgba(211,47,47,0.08)'),
                  }}
                >
                  <Typography variant="h5" fontWeight="bold" color="error.main" gutterBottom>
                    {wrongVocab.word}
                  </Typography>
                  {wrongVocab.pronunciation && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      / {wrongVocab.pronunciation} /
                    </Typography>
                  )}
                  {wrongVocab.partOfSpeech && (
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      {wrongVocab.partOfSpeech}
                    </Typography>
                  )}
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {wrongVocab.meaning}
                  </Typography>
                  {wrongVocab.example && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      "{wrongVocab.example}"
                    </Typography>
                  )}
                  {wrongVocab.partOfSpeech === 'verb' && (wrongVocab.pastTense || wrongVocab.futureTense) && (
                    <Box sx={{ mt: 1, pt: 1, borderTop: 1, borderColor: 'divider' }}>
                      {wrongVocab.pastTense && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          Past: {wrongVocab.pastTense}
                        </Typography>
                      )}
                      {wrongVocab.futureTense && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          Future: {wrongVocab.futureTense}
                        </Typography>
                      )}
                    </Box>
                  )}
                  {wrongVocab.tags?.length > 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Tags: {wrongVocab.tags.join(', ')}
                    </Typography>
                  )}
                </Box>
                <Button variant="contained" fullWidth size="large" onClick={handleNext}>
                  Next
                </Button>
              </>
            ) : isCorrect ? (
              <>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ color: 'success.main', fontSize: 28 }} />
                  <Typography variant="h6" color="success.main">
                    Chính xác!
                  </Typography>
                </Box>
                <Button variant="contained" fullWidth size="large" onClick={handleNext} color="success">
                  Next
                </Button>
              </>
            ) : null}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
