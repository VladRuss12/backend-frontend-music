import { useSelector, useDispatch } from 'react-redux';
import { setLiked, setLoading, setError, setLoaded } from '../recommendationsSlice';
import { fetchLikedEntities, likeEntity, unlikeEntity } from '../recommendationsService';
import { useCallback } from 'react';
import { useIsAuthenticated } from '../../auth/hooks/useIsAuthenticated';

export function useLikes(entityType = 'track') {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.recommendations.loading['liked']);
  const error = useSelector(state => state.recommendations.error['liked']);
  const liked = useSelector(state => state.recommendations.liked);
  const isAuthenticated = useIsAuthenticated();

  // Загрузка лайков
  const loadLiked = useCallback(async () => {
    if (!isAuthenticated) return;
    dispatch(setLoading('liked'));
    try {
      const data = await fetchLikedEntities(entityType);
      dispatch(setLiked(data));
      dispatch(setError({ entityType: 'liked', error: null }));
    } catch (e) {
      dispatch(setError({ entityType: 'liked', error: 'Ошибка загрузки лайкнутых' }));
    } finally {
      dispatch(setLoaded('liked'));
    }
  }, [dispatch, entityType, isAuthenticated]);

  // Оптимистичное добавление лайка
  const like = useCallback(async (entityId) => {
    if (!isAuthenticated) return;
    const already = liked?.some(item => item.entity_id === entityId);
    if (already) return; // уже лайкнуто

    const optimisticLiked = [...(liked || []), { entity_id: entityId, entity_type: entityType }];
    dispatch(setLiked(optimisticLiked));
    try {
      await likeEntity({ entityId, entityType });
    } catch (e) {
      // Откатываем, если ошибка
      dispatch(setLiked(liked));
      dispatch(setError({ entityType: 'liked', error: 'Не удалось лайкнуть' }));
    }
  }, [entityType, isAuthenticated, liked, dispatch]);

  // Оптимистичное удаление лайка
  const unlike = useCallback(async (entityId) => {
    if (!isAuthenticated) return;
    const optimisticLiked = (liked || []).filter(item => item.entity_id !== entityId);
    dispatch(setLiked(optimisticLiked));
    try {
      await unlikeEntity({ entityId, entityType });
    } catch (e) {
      // Откатываем, если ошибка
      dispatch(setLiked(liked));
      dispatch(setError({ entityType: 'liked', error: 'Не удалось убрать лайк' }));
    }
  }, [entityType, isAuthenticated, liked, dispatch]);

  return { liked, loading, error, loadLiked, like, unlike };
}