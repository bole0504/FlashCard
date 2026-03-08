import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import { ArrowBack, CloudUpload } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { getMe, updateMe } from '../services/usersService';
import { resolveAssetUrl } from '../lib/api';

function getAvatarUrl(avatar, name) {
  if (avatar?.startsWith('http')) return avatar;
  if (avatar) return resolveAssetUrl(avatar);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&size=128&background=6E39D0&color=fff`;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: authUser, login } = useAuth();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getMe,
  });

  const updateMutation = useMutation({
    mutationFn: updateMe,
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
      login({ ...authUser, ...data }, localStorage.getItem('token'));
      setAvatarFile(null);
      setAvatarPreview(null);
      setRemoveAvatar(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name')?.trim();
    const bio = formData.get('bio')?.trim();
    updateMutation.mutate({
      name,
      bio,
      avatar: avatarFile || undefined,
      removeAvatar: removeAvatar || undefined,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setRemoveAvatar(false);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setRemoveAvatar(true);
  };

  if (isLoading || !profile) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const displayAvatar = removeAvatar
    ? getAvatarUrl(null, profile.name)
    : avatarPreview || getAvatarUrl(profile.avatar, profile.name);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', py: 2, px: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/home')} color="inherit">
          Back
        </Button>
      </Box>

      <Box sx={{ maxWidth: 480, mx: 'auto', p: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Profile
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Update your profile and introduce yourself
        </Typography>

        <Card>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit}>
              {/* Avatar */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={displayAvatar}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    component="label"
                    variant="outlined"
                    size="small"
                    startIcon={<CloudUpload />}
                  >
                    Upload
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </Button>
                  {(avatarFile || avatarPreview || removeAvatar) && (
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={handleRemoveAvatar}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  {profile.avatar ? 'Change your avatar' : 'No avatar — one will be generated from your name'}
                </Typography>
              </Box>

              <TextField
                fullWidth
                name="name"
                label="Name"
                defaultValue={profile.name}
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                name="bio"
                label="About me"
                placeholder="Introduce yourself..."
                defaultValue={profile.bio}
                multiline
                rows={4}
                sx={{ mb: 3 }}
              />

              {updateMutation.isError && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                  {updateMutation.error?.response?.data?.message || 'Failed to update'}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Saving...' : 'Save profile'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
