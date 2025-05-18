import { useSelector, useDispatch } from 'react-redux';
import { setHistory, setLoading, setError } from '../recommendationsSlice';
import { fetchHistory, addHistory } from '../recommendationsService';
import { useCallback } from 'react';

export function useHistory(entityType = 'track') {
  const dispatch = useDispatch();
  const history = useSelector(state => state.recommendations.history);
  const loading = useSelector(state => state.recommendations.loading);
  const error = useSelector(state => state.recommendations.error);

  const loadHistory = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const data = await fetchHistory(entityType);
      dispatch(setHistory(data));
      dispatch(setError(null));
    } catch (e) {
      dispatch(setError('Ошибка загрузки истории'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, entityType]);

  const addToHistory = useCallback(async (entityId) => {
    try {
      await addHistory({ entityId, entityType });
      loadHistory();
    } catch (e) {
      // можно обработать локально
    }
  }, [entityType, loadHistory]);

  return { history, loading, error, loadHistory, addToHistory };
}