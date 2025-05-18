import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { setPopular, setLoading, setError } from '../recommendationsSlice';
import { fetchPopularRecommendations } from '../recommendationsService';

export function usePopularRecommendations(entityType = 'track', limit = 10) {
  const dispatch = useDispatch();
  const ids = useSelector(state => state.recommendations.popular);
  const loading = useSelector(state => state.recommendations.loading);
  const error = useSelector(state => state.recommendations.error);

  const loadPopular = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const data = await fetchPopularRecommendations(entityType, limit);
      const onlyIds = data.map(item => item.id);
      dispatch(setPopular(onlyIds));
      dispatch(setError(null));
    } catch (e) {
      dispatch(setError('Ошибка загрузки популярных'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, entityType, limit]);

  return { ids, loading, error, loadPopular };
}