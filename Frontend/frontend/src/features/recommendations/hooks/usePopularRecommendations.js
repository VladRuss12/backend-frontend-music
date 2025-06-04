import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { setPopular, setLoading, setLoaded, setError } from '../recommendationsSlice';
import { fetchPopularRecommendations } from '../recommendationsService';

export function usePopularRecommendations(entityType = 'track', limit = 10) {
  const dispatch = useDispatch();

  const recommendations = useSelector(state => state.recommendations.popular[entityType] || []);
  const loading = useSelector(state => state.recommendations.loading[entityType]);
  const error = useSelector(state => state.recommendations.error[entityType]);

  const loadPopular = useCallback(async () => {
    dispatch(setLoading(entityType));
    try {
      const data = await fetchPopularRecommendations(entityType, limit);
      dispatch(setPopular({ entityType, recommendations: data })); // сохраняем массив объектов!
      dispatch(setError({ entityType, error: null }));
    } catch (e) {
      dispatch(setError({ entityType, error: 'Ошибка загрузки популярных' }));
    } finally {
      dispatch(setLoaded(entityType));
    }
  }, [dispatch, entityType, limit]);

  return { recommendations, loading, error, loadPopular };
}