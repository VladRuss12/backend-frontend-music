import axiosInstance from '../../api/axiosInstance';

// Получить рекомендации по userId
export const fetchRecommendations = async (userId) => {
  const res = await axiosInstance.get(`/recommendations/${userId}`);
  return res.data;
};

// Получить популярные треки или плейлисты
export const fetchPopularRecommendations = async (entityType = 'track', limit = 10) => {
  const res = await axiosInstance.get(`/recommendations/popular`, {
    params: { entity_type: entityType, limit }
  });
  return res.data;
};

// Получить историю прослушиваний пользователя
export const fetchHistory = async (entityType = 'track') => {
  const res = await axiosInstance.get(`/recommendations/listening/history`, {
    params: { entity_type: entityType }
  });
  return res.data;
};

// Добавить в историю прослушивания
export const addHistory = async ({ entityId, entityType = 'track' }) => {
  const res = await axiosInstance.post(`/recommendations/listening/history`, {
    entity_id: entityId,
    entity_type: entityType,
  });
  return res.data;
};

// Поставить лайк треку или плейлисту
export const likeEntity = async ({ entityId, entityType = 'track' }) => {
  const res = await axiosInstance.post(`/recommendations/listening/like`, {
    entity_id: entityId,
    entity_type: entityType,
  });
  return res.data;
};

// Убрать лайк
export const unlikeEntity = async ({ entityId, entityType = 'track' }) => {
  const res = await axiosInstance.post(`/recommendations/listening/unlike`, {
    entity_id: entityId,
    entity_type: entityType,
  });
  return res.data;
};

// Получить лайкнутые сущности
export const fetchLikedEntities = async (entityType = 'track') => {
  const res = await axiosInstance.get(`/recommendations/listening/liked`, {
    params: { entity_type: entityType }
  });
  return res.data;
};

