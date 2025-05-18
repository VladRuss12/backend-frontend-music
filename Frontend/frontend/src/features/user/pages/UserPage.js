import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProfile, setLoading, setError } from '../userSlice';
import { fetchUserProfile } from '../userService';
import UserProfile from '../components/UserProfile';
import { useUser } from '../hooks/useUser';
import { useIsAuthenticated } from '../../auth/hooks/useIsAuthenticated';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function UserPage() {
  const dispatch = useDispatch();
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);
  const navigate = useNavigate();

  useEffect(() => {
    // Если не авторизован — редирект на /auth/login
    if (!isAuthenticated) {
      navigate('/auth/login', { replace: true });
      return;
    }
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
  }, [dispatch, isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return <UserProfile user={user} />;
}