import { useSelector, useDispatch } from 'react-redux';
import { setLiked, setLoading, setError, setLoaded } from '../recommendationsSlice';
import { fetchLikedEntities, likeEntity, unlikeEntity } from '../recommendationsService';
import { useCallback } from 'react';
import { useIsAuthenticated } from '../../auth/hooks/useIsAuthenticated';

export function useLikes(mediaType = 'track') {
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
      const data = await fetchLikedEntities(mediaType);
      dispatch(setLiked(data));
      dispatch(setError({ entityType: 'liked', error: null }));
    } catch (e) {
      dispatch(setError({ entityType: 'liked', error: 'Ошибка загрузки лайкнутых' }));
    } finally {
      dispatch(setLoaded('liked'));
    }
  }, [dispatch, mediaType, isAuthenticated]);

 // Оптимистичное добавление лайка
const like = useCallback(async (mediaId, mediaObj) => {
  if (!isAuthenticated) return;
  const already = liked?.some(item => item.media_id === mediaId);
  if (already) return;

  // Оптимистично добавляем с media
  const optimisticLiked = [
    ...(liked || []),
    { media_id: mediaId, media_type: mediaType, liked: true, media: mediaObj }
  ];
  dispatch(setLiked(optimisticLiked));
  try {
    await likeEntity({ mediaId, mediaType });
  } catch (e) {
    dispatch(setLiked(liked));
    dispatch(setError({ entityType: 'liked', error: 'Не удалось лайкнуть' }));
  }
}, [mediaType, isAuthenticated, liked, dispatch]);

// Оптимистичное удаление лайка
const unlike = useCallback(async (mediaId) => {
  if (!isAuthenticated) return;
  const optimisticLiked = (liked || []).filter(item => item.media_id !== mediaId);
  dispatch(setLiked(optimisticLiked));
  try {
    await unlikeEntity({ mediaId, mediaType });
  } catch (e) {
    dispatch(setLiked(liked));
    dispatch(setError({ entityType: 'liked', error: 'Не удалось убрать лайк' }));
  }
}, [mediaType, isAuthenticated, liked, dispatch]);
return { liked, loading, error, loadLiked, like, unlike };
}