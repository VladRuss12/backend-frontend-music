import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getEntityById } from '../entitiesSlice';

// entityType: "performers" | "tracks" | "playlists"
export function useEntity(entityType, id) {
  const dispatch = useDispatch();
  const entity = useSelector(
    state => state.entities.entities[entityType]?.byId?.[id]
  );
  const loading = useSelector(
    state => state.entities.loading[entityType]
  );
  const error = useSelector(
    state => state.entities.error[entityType]
  );

  useEffect(() => {
    if (id && !entity) {
      dispatch(getEntityById({ entityType, id }));
    }
  }, [dispatch, entityType, id, entity]);

  return { entity, loading, error };
}