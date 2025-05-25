import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProfile, setLoading, setError } from '../features/user/userSlice';
import { fetchUserProfile } from '../features/user/userService';
import UserProfile from '../features/user/components/UserProfile';
import { useUser } from '../features/user/hooks/useUser';
import { useIsAuthenticated } from '../features/auth/hooks/useIsAuthenticated';
import { Box, CircularProgress, Typography, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useHistory } from '../features/recommendations/hooks/useHistory';
import { useRecommendations } from '../features/recommendations/hooks/useRecommendations';
import HistoryList from '../features/recommendations/components/HistoryList';
import RecommendationsList from '../features/recommendations/components/RecommendationsList';
import LikedList from '../features/recommendations/components/LikedList';
import CollapsibleList from '../layouts/CollapsibleList';

export default function UserPage() {
  const dispatch = useDispatch();
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const loadingProfile = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);
  const navigate = useNavigate();

  const trackHistory = useHistory('track');
  const { items: recommendations, loading: loadingRec, error: recError, loadRecommendations } = useRecommendations(user?.id);

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
      <Box display="flex" alignItems="center" justifyContent="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (hasError) {
    return <Typography color="error">{error || trackHistory.error?.track || recError?.track}</Typography>;
  }

  return (
    <Box>
      <UserProfile user={user} />

      {/* История прослушиваний */}
      <Grid container spacing={4} mt={2}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 3, bgcolor: 'background.paper' }}>
            <CollapsibleList
              items={trackHistory.history || []}
              maxVisible={5}
              title="История прослушиваний"
              renderItem={(item, idx) => (
                <HistoryList key={item.id || idx} history={[item]} type="track" dense />
              )}
              sx={{
                '& .MuiListItem-root': {
                  borderBottom: '1px solid #eee',
                  '&:last-child': { borderBottom: 'none' }
                }
              }}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Лайкнутые треки */}
      <Box mt={4}>
        <Paper elevation={2} sx={{ p: 2, borderRadius: 3, bgcolor: 'background.paper' }}>
          <CollapsibleList
            items={[]} 
            maxVisible={5}
            title="Понравившиеся треки"
            renderItem={null}
            sx={{
              mb: 2,
              '& .MuiListItem-root': {
                borderBottom: '1px solid #eee',
                '&:last-child': { borderBottom: 'none' }
              }
            }}
          />
          {/* Или используйте старый компонент, если он уже сам выводит список */}
          <LikedList entityType="track" />
        </Paper>
      </Box>

      {/* Рекомендации */}
      <Box mt={4}>
        <Paper elevation={2} sx={{ p: 2, borderRadius: 3, bgcolor: 'background.paper' }}>
          <CollapsibleList
            items={recommendations || []}
            maxVisible={5}
            title="Рекомендации для вас"
            renderItem={(item, idx) => (
              <RecommendationsList key={item.id || idx} recommendations={[item]} dense />
            )}
            sx={{
              mb: 2,
              '& .MuiListItem-root': {
                borderBottom: '1px solid #eee',
                '&:last-child': { borderBottom: 'none' }
              }
            }}
          />
        </Paper>
      </Box>
    </Box>
  );
}