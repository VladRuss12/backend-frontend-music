import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Должен быть импортирован здесь!
import { setTrack, setTracksLoading, setTracksError } from '../tracksSlice';
import { fetchTrackById } from '../tracksService';

export function useTracks(trackIds) {
  const dispatch = useDispatch();
  const tracks = useSelector(state => state.tracks.entities);
  const loading = useSelector(state => state.tracks.loading);
  const error = useSelector(state => state.tracks.error);

  // Загружаем все треки по массиву id (один раз)
  useEffect(() => {
    async function loadTracks() {
      if (!trackIds || trackIds.length === 0) return;
      dispatch(setTracksLoading(true));
      try {
        await Promise.all(trackIds.map(async (id) => {
          if (!tracks[id]) {
            const track = await fetchTrackById(id);
            dispatch(setTrack(track));
          }
        }));
        dispatch(setTracksError(null));
      } catch (e) {
        dispatch(setTracksError('Ошибка загрузки треков'));
      } finally {
        dispatch(setTracksLoading(false));
      }
    }
    loadTracks();
    // eslint-disable-next-line
  }, [dispatch, JSON.stringify(trackIds)]);

  // Возвращаем только те треки, которые уже загружены
  const loadedTracks = trackIds.map(id => tracks[id]).filter(Boolean);

  return { tracks: loadedTracks, loading, error };
}