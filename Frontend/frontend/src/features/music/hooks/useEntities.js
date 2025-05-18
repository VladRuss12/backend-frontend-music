import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getEntities } from '../entitiesSlice';

// entityType: "performers" | "tracks" | "playlists"
export function useEntities(entityType) {
  const dispatch = useDispatch();
  const allIds = useSelector(
    state => state.entities.entities[entityType]?.allIds || []
  );
  const byId = useSelector(
    state => state.entities.entities[entityType]?.byId || {}
  );
  const loading = useSelector(
    state => state.entities.loading[entityType]
  );
  const error = useSelector(
    state => state.entities.error[entityType]
  );

  useEffect(() => {
    if (allIds.length === 0) {
      dispatch(getEntities(entityType));
    }
  }, [dispatch, entityType, allIds.length]);

  const items = allIds.map(id => byId[id]);

  return { items, loading, error };
}