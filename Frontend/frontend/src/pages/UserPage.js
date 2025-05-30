import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProfile, setLoading, setError } from '../features/user/userSlice';
import { fetchUserProfile } from '../features/user/userService';
import UserProfile from '../features/user/components/UserProfile';
import { useUser } from '../features/user/hooks/useUser';
import { useIsAuthenticated } from '../features/auth/hooks/useIsAuthenticated';
import { Box, CircularProgress, Typography, Grid, Paper, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useHistory } from '../features/recommendations/hooks/useHistory';
import { useRecommendations } from '../features/recommendations/hooks/useRecommendations';
import HistoryList from '../features/recommendations/components/HistoryList';
import RecommendationsList from '../features/recommendations/components/RecommendationsList';
import LikedList from '../features/recommendations/components/LikedList';

export default function UserPage() {
  const dispatch = useDispatch();
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const loadingProfile = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);
  const navigate = useNavigate();

  const trackHistory = useHistory('track');
  const {
    items: recommendations,
    loading: loadingRec,
    error: recError,
    loadRecommendations
  } = useRecommendations(user?.id);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login', { replace: true });
      return;
    }
    if (!user?.id) {
      const load = async () => {
        dispatch(setLoading(true));
        try {
          const profile = await fetchUserProfile();
          dispatch(setProfile(profile));
          dispatch(setError(null));
        } catch (e) {
          dispatch(setError('Не удалось загрузить профиль'));
        } finally {
          dispatch(setLoading(false));
        }
      };
      load();
    }
  }, [dispatch, isAuthenticated, navigate, user?.id]);

  useEffect(() => {
    if (user?.id) {
      trackHistory.loadHistory();
      loadRecommendations();
    }
  }, [user?.id]);

  const isLoading =
    loadingProfile ||
    trackHistory.loading?.track ||
    loadingRec?.track;

  const hasError =
    error ||
    trackHistory.error?.track ||
    recError?.track;

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="70vh"
        sx={{ bgcolor: 'background.default' }}
      >
        <CircularProgress size={56} thickness={4} />
      </Box>
    );
  }

  if (hasError) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height="70vh">
        <Paper elevation={2} sx={{ p: 4, borderRadius: 4, bgcolor: 'error.light' }}>
          <Typography color="error" variant="h6">
            {error || trackHistory.error?.track || recError?.track}
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: 'auto',
        my: 4,
        px: { xs: 1, sm: 2, md: 0 },
      }}
    >
      <UserProfile user={user} />

      <Divider sx={{ my: 4, borderColor: 'divider' }} />

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: 'background.paper',
              minHeight: 320,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              История прослушиваний
            </Typography>
            <HistoryList history={trackHistory.history || []} maxVisible={5} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: 'background.paper',
              minHeight: 320,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Понравившиеся треки
            </Typography>
            <LikedList entityType="track" maxVisible={5} />
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4, borderColor: 'divider' }} />

      <Box>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 4,
            bgcolor: 'background.paper',
            minHeight: 320,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
          }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Рекомендации для вас
          </Typography>
          <RecommendationsList recommendations={recommendations || []} maxVisible={5} />
        </Paper>
      </Box>
    </Box>
  );
}