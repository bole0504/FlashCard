import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from '@mui/material';
import { Logout, School, Add, Person, DarkMode, LightMode, People, Leaderboard, LocalFireDepartment, LocalFireDepartmentOutlined } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';
import { LevelIconTree } from '../components/icons/LevelIconTree';
import AppLogo from '../components/AppLogo';
import { getProgressToNextLevel, getGradeInfo } from '../constants/grades';
import { getVocabularies } from '../services/vocabularyService';
import { getSlots } from '../services/slotsService';
import { resolveAssetUrl } from '../lib/api';

export default function HomePage() {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleProfileClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSignOut = () => {
    handleClose();
    logout();
  };
  const handleThemeToggle = () => {
    toggleTheme();
    handleClose();
  };

  const { data: vocabularies = [] } = useQuery({
    queryKey: ['vocabularies'],
    queryFn: getVocabularies,
  });
  const { data: slots } = useQuery({
    queryKey: ['slots'],
    queryFn: getSlots,
  });

  const wordCount = vocabularies.length;
  const streak = slots?.streak ?? 0;
  const { grade, progress, nextThreshold } = getProgressToNextLevel(wordCount);
  const gradeInfo = getGradeInfo(grade);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static">
        <Toolbar sx={{ px: { xs: 1, sm: 2 }, gap: 1, minHeight: { xs: 56, sm: 64 } }}>
          <AppLogo variant="compact" showTagline={false} to="/home" size="small" sx={{ flexShrink: 0 }} />

          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', px: { xs: 1, sm: 2 }, minWidth: 0 }}>
            <Box sx={{ width: '100%', maxWidth: 200 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'inherit', opacity: 0.9 }}>
                  Grade {grade}
                </Typography>
                {nextThreshold && (
                  <Typography variant="caption" sx={{ color: 'inherit', opacity: 0.7 }}>
                    {wordCount}/{nextThreshold}
                  </Typography>
                )}
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress * 100}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)'),
                  '& .MuiLinearProgress-bar': { bgcolor: gradeInfo.color },
                }}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, flexShrink: 0 }}>
            <Box
              component="button"
              onClick={() => navigate('/level')}
              sx={{
                display: 'inline-flex',
                p: 0.5,
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                borderRadius: 1,
                '&:hover': { bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)') },
              }}
              aria-label="View level info"
            >
              <LevelIconTree grade={grade} size={32} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {streak >= 3 ? (
                <LocalFireDepartment sx={{ fontSize: 20, color: 'warning.main' }} />
              ) : (
                <LocalFireDepartmentOutlined sx={{ fontSize: 20, color: 'grey.400' }} />
              )}
              <Typography variant="caption" fontWeight={600}>t
                {streak}d
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {user?.name}
            </Typography>
            <IconButton
              color="inherit"
              onClick={handleProfileClick}
              aria-controls={open ? 'profile-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              size="small"
              sx={{ p: 0.25 }}
            >
              <Avatar
                src={user?.avatar ? (user.avatar.startsWith('http') ? user.avatar : resolveAssetUrl(user.avatar)) : undefined}
                sx={{ width: 36, height: 36 }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || <Person fontSize="small" />}
              </Avatar>
            </IconButton>
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              slotProps={{ paper: { sx: { mt: 1.5, minWidth: 180 } } }}
            >
              <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleThemeToggle}>
                <ListItemIcon>
                  {mode === 'dark' ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
                </ListItemIcon>
                <ListItemText>{mode === 'dark' ? 'Light mode' : 'Dark mode'}</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleSignOut}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <ListItemText>Sign out</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Choose an action to get started
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 2,
            width: '100%',
          }}
        >
          <Card
            onClick={() => navigate('/vocabulary/add')}
            sx={{
              p: 0,
              textAlign: 'left',
              minHeight: 140,
              display: 'flex',
              alignItems: 'stretch',
              cursor: 'pointer',
              '&:hover': { filter: 'brightness(1.1)' },
            }}
          >
            <CardContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <Add sx={{ fontSize: 48, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight="bold">
                Add vocabulary
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Save new words with examples
              </Typography>
            </CardContent>
          </Card>

          <Card
            onClick={() => navigate('/leaderboard')}
            sx={{
              p: 0,
              textAlign: 'left',
              minHeight: 140,
              display: 'flex',
              alignItems: 'stretch',
              cursor: 'pointer',
              '&:hover': { filter: 'brightness(1.1)' },
            }}
          >
            <CardContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <Leaderboard sx={{ fontSize: 48, color: 'warning.main' }} />
              <Typography variant="h6" fontWeight="bold">
                Leaderboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Top users by new words this week/month
              </Typography>
            </CardContent>
          </Card>

          <Card
            onClick={() => navigate('/friends')}
            sx={{
              p: 0,
              textAlign: 'left',
              minHeight: 140,
              display: 'flex',
              alignItems: 'stretch',
              cursor: 'pointer',
              '&:hover': { filter: 'brightness(1.1)' },
            }}
          >
            <CardContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <People sx={{ fontSize: 48, color: 'secondary.main' }} />
              <Typography variant="h6" fontWeight="bold">
                Friends
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Find friends and see their levels
              </Typography>
            </CardContent>
          </Card>

          <Card
            onClick={() => navigate('/review')}
            sx={{
              p: 0,
              textAlign: 'left',
              minHeight: 140,
              display: 'flex',
              alignItems: 'stretch',
              cursor: 'pointer',
              '&:hover': { filter: 'brightness(1.1)' },
            }}
          >
            <CardContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <School sx={{ fontSize: 48, color: 'secondary.main' }} />
              <Typography variant="h6" fontWeight="bold">
                Review
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Practice with flashcards. Pass 5/5 to unlock more add slots
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
