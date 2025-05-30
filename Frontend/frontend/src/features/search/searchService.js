import axiosInstance from '../../api/axiosInstance';

export async function searchAllEntities(query) {
  const res = await axiosInstance.get(`music/search`, { params: { query } });
  return res.data; // { playlists: [...], tracks: [...], performers: [...] }
}

export async function searchEntities(entityType, query) {
  const res = await axiosInstance.get(`music/search/${entityType}`, { params: { query } });
  return res.data; // массив результатов
}