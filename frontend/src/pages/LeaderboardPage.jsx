import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tabs,
  Tab,
  CircularProgress,
  Avatar,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { getLeaderboard } from '../services/leaderboardService';
import { resolveAssetUrl } from '../lib/api';

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('week');

  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard', period],
    queryFn: () => getLeaderboard({ period }),
  });

  const rankings = data?.rankings ?? [];
  const myRank = data?.myRank;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', py: 2, px: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/home')} color="inherit">
          Back
        </Button>
      </Box>

      <Box sx={{ maxWidth: 560, mx: 'auto', p: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Leaderboard
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Top users by new words added. Resets every {period === 'week' ? 'Monday' : 'month'}.
        </Typography>

        <Tabs value={period} onChange={(_, v) => setPeriod(v)} sx={{ mb: 2 }}>
          <Tab value="week" label="This week" />
          <Tab value="month" label="This month" />
        </Tabs>

        {myRank && (
          <Card sx={{ mb: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  #{myRank.rank}
                </Typography>
                <Typography variant="body2">
                  You · {myRank.count} new {period === 'week' ? 'words this week' : 'words this month'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Top 20
            </Typography>
            {isLoading ? (
              <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : rankings.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                No activity yet. Add words to climb the leaderboard!
              </Typography>
            ) : (
              <List dense disablePadding>
                {rankings.map((r) => (
                  <ListItem
                    key={r.userId}
                    sx={{
                      px: 0,
                      borderBottom: 1,
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 0 },
                    }}
                    secondaryAction={
                      <Typography variant="body2" fontWeight="600">
                        {r.count} words
                      </Typography>
                    }
                  >
                    <ListItemAvatar sx={{ minWidth: 44 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color={r.rank <= 3 ? 'primary.main' : 'text.secondary'}
                          sx={{ minWidth: 24 }}
                        >
                          #{r.rank}
                        </Typography>
                        <Avatar
                          src={r.avatar?.startsWith('http') ? r.avatar : resolveAssetUrl(r.avatar)}
                          sx={{ width: 36, height: 36 }}
                        >
                          {r.name?.charAt(0)?.toUpperCase()}
                        </Avatar>
                      </Box>
                    </ListItemAvatar>
                    <ListItemText primary={r.name} primaryTypographyProps={{ fontWeight: 600 }} />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
