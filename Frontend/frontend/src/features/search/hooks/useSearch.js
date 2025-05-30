import { useDispatch, useSelector } from 'react-redux';
import { searchAll, searchByType, clearSearch } from '../searchSlice';

export function useSearch() {
  const dispatch = useDispatch();
  const { results, loading, error, query } = useSelector(state => state.search);

  function search(query) {
    dispatch(searchAll(query));
  }

  function searchEntityType(entityType, query) {
    dispatch(searchByType({ entityType, query }));
  }

  function clear() {
    dispatch(clearSearch());
  }

  return { results, loading, error, query, search, searchEntityType, clear };
}