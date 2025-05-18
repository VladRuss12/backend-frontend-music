import axiosInstance from '../../api/axiosInstance';

// Получить трек по id
export const fetchTrackById = async (trackId) => {
  const res = await axiosInstance.get(`/music/tracks/${trackId}`);
  return res.data;
};