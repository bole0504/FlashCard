import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ArrowBack, Search, PersonAdd, PersonRemove, LocalFireDepartment, LocalFireDepartmentOutlined } from '@mui/icons-material';
import { LevelIconTree } from '../components/icons/LevelIconTree';
import { getGradeFromWordCount } from '../constants/grades';
import { getFriends, searchUsers, addFriend, removeFriend } from '../services/friendsService';

export default function FriendsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { data: friendsData, isLoading: friendsLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: getFriends,
  });

  const friends = friendsData?.friends ?? [];
  const me = friendsData?.me;

  const { data: searchResults = [], isLoading: searchLoading } = useQuery({
    queryKey: ['friends', 'search', searchQuery],
    queryFn: () => searchUsers(searchQuery),
    enabled: searchQuery.trim().length >= 2,
  });

  const addFriendMutation = useMutation({
    mutationFn: addFriend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['friends', 'search', searchQuery] });
    },
  });

  const removeFriendMutation = useMutation({
    mutationFn: removeFriend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
  });

  const handleSearch = (e) => {
    e?.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  const friendIds = new Set(friends.map((f) => f._id));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', py: 2, px: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/home')} color="inherit">
          Back
        </Button>
      </Box>

      <Box sx={{ maxWidth: 560, mx: 'auto', p: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Friends
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Find friends and see their learning progress
        </Typography>
        {me && me.totalInGroup >= 2 && (
          <Card sx={{ mb: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="body2">
                Your rank among friends: <strong>#{me.rankByWords}</strong> by words ({me.wordCount} words)
                {me.rankByStreak > 0 && (
                  <> · <strong>#{me.rankByStreak}</strong> by streak ({me.streak} days)</>
                )}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    disabled={searchInput.trim().length < 2}
                  >
                    Search
                  </Button>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
        </Box>

        {/* Search results */}
        {searchQuery && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Search results
              </Typography>
              {searchLoading ? (
                <Box sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress size={24} />
                </Box>
              ) : searchResults.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No users found. Try a different search.
                </Typography>
              ) : (
                <List dense disablePadding>
                  {searchResults.map((user) => {
                    const grade = getGradeFromWordCount(user.wordCount);
                    const isFriend = friendIds.has(user._id);
                    return (
                      <ListItem
                        key={user._id}
                        sx={{
                          px: 0,
                          borderBottom: 1,
                          borderColor: 'divider',
                          '&:last-child': { borderBottom: 0 },
                        }}
                        secondaryAction={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LevelIconTree grade={grade} size={28} />
                            <Typography variant="caption" color="text.secondary" sx={{ minWidth: 36 }}>
                              L{grade}
                            </Typography>
                            {isFriend ? (
                              <Button size="small" disabled>
                                Friends
                              </Button>
                            ) : (
                              <IconButton
                                color="primary"
                                onClick={() => addFriendMutation.mutate(user._id)}
                                disabled={addFriendMutation.isPending}
                                aria-label="Add friend"
                              >
                                <PersonAdd />
                              </IconButton>
                            )}
                          </Box>
                        }
                      >
                        <ListItemText
                          primary={user.name}
                          secondary={user.email}
                          primaryTypographyProps={{ fontWeight: 600 }}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              )}
              {addFriendMutation.isError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {addFriendMutation.error?.response?.data?.message || 'Failed to add friend'}
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* My friends */}
        <Card>
          <CardContent>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              My friends ({friends.length})
            </Typography>
            {friendsLoading ? (
              <Box sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={24} />
              </Box>
            ) : friends.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No friends yet. Search above to find and add friends.
              </Typography>
            ) : (
              <List dense disablePadding>
                {friends
                  .sort((a, b) => b.wordCount - a.wordCount)
                  .map((friend) => {
                    const grade = getGradeFromWordCount(friend.wordCount);
                    return (
                      <ListItem
                        key={friend._id}
                        sx={{
                          px: 0,
                          borderBottom: 1,
                          borderColor: 'divider',
                          '&:last-child': { borderBottom: 0 },
                        }}
                        secondaryAction={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LevelIconTree grade={grade} size={32} />
                            <Box sx={{ textAlign: 'right', minWidth: 70 }}>
                              <Typography variant="body2" fontWeight="600">
                                Level {grade}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                {friend.wordCount} words
                              </Typography>
                              {friend.streak > 0 && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                                  {friend.streak >= 3 ? (
                                    <LocalFireDepartment sx={{ fontSize: 14, color: 'warning.main' }} />
                                  ) : (
                                    <LocalFireDepartmentOutlined sx={{ fontSize: 14, color: 'grey.400' }} />
                                  )}
                                  <Typography variant="caption" color="text.secondary">
                                    {friend.streak}d
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => removeFriendMutation.mutate(friend._id)}
                              disabled={removeFriendMutation.isPending}
                              aria-label="Remove friend"
                            >
                              <PersonRemove />
                            </IconButton>
                          </Box>
                        }
                      >
                        <ListItemAvatar>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '1rem',
                            }}
                          >
                            {friend.name.charAt(0).toUpperCase()}
                          </Box>
                        </ListItemAvatar>
                        <ListItemText
                          primary={friend.name}
                          secondary={friend.email}
                          primaryTypographyProps={{ fontWeight: 600 }}
                        />
                      </ListItem>
                    );
                  })}
              </List>
            )}
            {removeFriendMutation.isError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {removeFriendMutation.error?.response?.data?.message || 'Failed to remove friend'}
              </Alert>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
