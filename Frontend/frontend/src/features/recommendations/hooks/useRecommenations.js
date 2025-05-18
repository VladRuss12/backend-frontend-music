import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { setRecommendations, setLoading,setLoaded, setError } from '../recommendationsSlice';
import { fetchRecommendations } from '../recommendationsService';

// Для персональных рекомендаций
export function useRecommendations(userId) {
  const dispatch = useDispatch();
  const items = useSelector(state => state.recommendations.items);
  const loading = useSelector(state => state.recommendations.loading);
  const error = useSelector(state => state.recommendations.error);

  const loadRecommendations = useCallback(async () => {
    if (!userId) return;
    dispatch(setLoading(true));
    try {
      const data = await fetchRecommendations(userId);
      dispatch(setRecommendations(data));
      dispatch(setError(null));
    } catch (e) {
      dispatch(setError('Ошибка загрузки рекомендаций'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, userId]);

  return { items, loading, error, loadRecommendations };
}