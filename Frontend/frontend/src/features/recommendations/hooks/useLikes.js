import { useSelector, useDispatch } from 'react-redux';
import { setLiked, setLoading, setError } from '../recommendationsSlice';
import { fetchLikedEntities, likeEntity, unlikeEntity } from '../recommendationsService';
import { useCallback } from 'react';

export function useLikes(entityType = 'track') {
  const dispatch = useDispatch();
  const liked = useSelector(state => state.recommendations.liked);
  const loading = useSelector(state => state.recommendations.loading);
  const error = useSelector(state => state.recommendations.error);

  const loadLiked = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const data = await fetchLikedEntities(entityType);
      dispatch(setLiked(data));
      dispatch(setError(null));
    } catch (e) {
      dispatch(setError('Ошибка загрузки лайкнутых'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, entityType]);

  const like = useCallback(async (entityId) => {
    await likeEntity({ entityId, entityType });
    loadLiked();
  }, [entityType, loadLiked]);

  const unlike = useCallback(async (entityId) => {
    await unlikeEntity({ entityId, entityType });
    loadLiked();
  }, [entityType, loadLiked]);

  return { liked, loading, error, loadLiked, like, unlike };
}