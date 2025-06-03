import { useSelector, useDispatch } from 'react-redux';
import { setHistory, setLoading, setLoaded, setError } from '../recommendationsSlice';import { fetchHistory, addHistory } from '../recommendationsService';
import { useCallback } from 'react';

export function useHistory(mediaType = 'track') {
  const dispatch = useDispatch();
  const history = useSelector(state => state.recommendations.history);
  const loading = useSelector(state => state.recommendations.loading[mediaType]);
  const error = useSelector(state => state.recommendations.error[mediaType]);
  const user = useSelector(state => state.auth.user);
  const userId = user?.id || user?.user_id;

  const loadHistory = useCallback(async () => {
    if (!userId) return;
    dispatch(setLoading(mediaType));
    try {
      const data = await fetchHistory(userId, mediaType);
      dispatch(setHistory(data));
      dispatch(setError({ entityType: mediaType, error: null }));
    } catch (e) {
      dispatch(setError({ entityType: mediaType, error: 'Ошибка загрузки истории' }));
    } finally {
      dispatch(setLoaded(mediaType));
    }
  }, [dispatch, userId, mediaType]);

  const addToHistory = useCallback(async (mediaId) => {
    console.log("addToHistory called, userId:", userId, "mediaId:", mediaId, "mediaType:", mediaType);
    if (!userId) return;
    try {
      await addHistory({ userId, mediaId, mediaType });
      loadHistory();
    } catch (e) {
      dispatch(setError({ entityType: mediaType, error: 'Ошибка добавления в историю' }));
    }
  }, [userId, mediaType, loadHistory, dispatch]);

  return { history, loading, error, loadHistory, addToHistory };
}