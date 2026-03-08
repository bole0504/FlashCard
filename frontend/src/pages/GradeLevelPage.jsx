import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Divider,
} from '@mui/material';
import { ArrowBack, TrendingUp } from '@mui/icons-material';
import { LevelIconTree } from '../components/icons/LevelIconTree';
import { getProgressToNextLevel, getGradeInfo, GRADE_THRESHOLDS, GRADE_GROUPS } from '../constants/grades';
import { getVocabularies } from '../services/vocabularyService';

export default function GradeLevelPage() {
  const navigate = useNavigate();

  const { data: vocabularies = [] } = useQuery({
    queryKey: ['vocabularies'],
    queryFn: getVocabularies,
  });

  const wordCount = vocabularies.length;
  const { grade, progress, nextThreshold, wordsNeeded } = getProgressToNextLevel(wordCount);
  const gradeInfo = getGradeInfo(grade);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', py: 2, px: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/home')} color="inherit">
          Back
        </Button>
      </Box>

      <Box sx={{ maxWidth: 640, mx: 'auto', p: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          How to level up
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Your level is based on total vocabulary count. Add more words to grow your tree and reach higher grades.
        </Typography>

        {/* Current progress */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <LevelIconTree grade={grade} size={48} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                  Level {grade} — {gradeInfo.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {wordCount} words saved
                  {nextThreshold && ` • ${wordsNeeded} more to reach Level ${grade + 1}`}
                  {!nextThreshold && ' • Max level reached!'}
                </Typography>
              </Box>
            </Box>
            {nextThreshold && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Progress to Level {grade + 1}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {wordCount} / {nextThreshold}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progress * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'action.hover',
                    '& .MuiLinearProgress-bar': { bgcolor: gradeInfo.color },
                  }}
                />
              </Box>
            )}
          </CardContent>
        </Card>

        {/* How it works */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp fontSize="small" />
              How it works
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Each new word you add counts toward your level. The formula is:
            </Typography>
            <Typography
              variant="body2"
              component="code"
              sx={{
                display: 'block',
                p: 1.5,
                borderRadius: 1,
                bgcolor: 'action.hover',
                fontFamily: 'monospace',
                mb: 2,
              }}
            >
              Level n requires 20 × 2^(n-1) words
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Level 1 starts at 0 words. Level 2 needs 20 words, Level 3 needs 40, and so on. Keep adding vocabulary to climb!
            </Typography>
          </CardContent>
        </Card>

        {/* Level thresholds */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Level thresholds
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => {
                const info = getGradeInfo(g);
                const isCurrent = g === grade;
                return (
                  <Box
                    key={g}
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: isCurrent ? `${info.color}30` : `${info.color}15`,
                      border: `1px solid ${isCurrent ? info.color : `${info.color}40`}`,
                      fontWeight: isCurrent ? 700 : 500,
                    }}
                  >
                    <Typography variant="caption">
                      L{g}: {g === 1 ? 0 : GRADE_THRESHOLDS[g - 2]}–{g === 12 ? '∞' : GRADE_THRESHOLDS[g - 1] - 1}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: GRADE_GROUPS.primary.color }} />
                <Typography variant="caption">Primary (1–5): Seedling</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: GRADE_GROUPS.middle.color }} />
                <Typography variant="caption">Middle (6–8): Growing tree</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: GRADE_GROUPS.high.color }} />
                <Typography variant="caption">High (9–12): Mature tree</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Button variant="contained" onClick={() => navigate('/vocabulary/add')} fullWidth>
          Add vocabulary
        </Button>
      </Box>
    </Box>
  );
}
