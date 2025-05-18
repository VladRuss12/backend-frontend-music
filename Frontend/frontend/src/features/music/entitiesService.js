import axiosInstance from '../../api/axiosInstance';

// entityType: "performers" | "tracks" | "playlists"
// id — string

export async function fetchEntityById(entityType, id) {
  const res = await axiosInstance.get(`/music/${entityType}/${id}`);
  return res.data;
}

export async function fetchEntities(entityType) {
  const res = await axiosInstance.get(`/music/${entityType}`);
  return res.data;
}

export async function createEntity(entityType, data) {
  const res = await axiosInstance.post(`/music/${entityType}`, data);
  return res.data;
}

export async function updateEntity(entityType, id, data) {
  const res = await axiosInstance.put(`/music/${entityType}/${id}`, data);
  return res.data;
}

export async function deleteEntity(entityType, id) {
  const res = await axiosInstance.delete(`/music/${entityType}/${id}`);
  return res.data;
}