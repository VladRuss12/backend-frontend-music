import { useEffect } from "react";
import { useStreamFiles } from './useStreamFiles';

export function useStreamFileByTrackId(trackId) {
  const { files, loadFiles } = useStreamFiles();

  useEffect(() => { loadFiles(); }, [loadFiles]);

  if (!trackId) return null;
  return files.find(f => (f.track_id || '').toLowerCase() === trackId.toLowerCase()) || null;
}