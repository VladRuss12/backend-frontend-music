import { useDispatch, useSelector } from "react-redux";
import { setFiles, setLoading, setError } from "../streamSlice";
import { fetchStreamFiles } from "../streamService";
import { useCallback } from "react";

export function useStreamFiles() {
  const dispatch = useDispatch();
  const files = useSelector(state => state.stream.files);
  const loading = useSelector(state => state.stream.loading);
  const error = useSelector(state => state.stream.error);

  const loadFiles = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const data = await fetchStreamFiles();
      dispatch(setFiles(data));
      dispatch(setError(null));
    } catch (e) {
      dispatch(setError("Ошибка загрузки файлов"));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return { files, loading, error, loadFiles };
}