import axiosInstance from '../../api/axiosInstance';

export const fetchRecommendations = async (userId, mediaType = "track") => {
  const res = await axiosInstance.get(
    `/recommendations/user`,
    {
      headers: { "X-User-ID": userId },
      params: { media_type: mediaType }
    }
  );
  return res.data;
};

// Получить популярные треки или плейлисты
export const fetchPopularRecommendations = async (mediaType = 'track', limit = 10) => {
  const res = await axiosInstance.get(`/recommendations/popular`, {
    params: { media_type: mediaType, limit }
  });
  return res.data;
};

// Получить историю прослушиваний пользователя
export const fetchHistory = async (mediaType = 'track') => {
  const res = await axiosInstance.get(`/recommendations/listening/history`, {
    params: { media_type: mediaType }
  });
  return res.data;
};

// Добавить в историю прослушивания пользователя
export const addHistory = async ({ mediaId, mediaType = 'track' }) => {
  const res = await axiosInstance.post(`/recommendations/listening/history`, {
    media_id: mediaId,
    media_type: mediaType,
  });
  return res.data;
};

// Поставить лайк треку или плейлисту
export const likeEntity = async ({ mediaId, mediaType = 'track' }) => {
  const res = await axiosInstance.post(`/recommendations/listening/like`, {
    media_id: mediaId,
    media_type: mediaType,
  });
  return res.data;
};

// Убрать лайк
export const unlikeEntity = async ({ mediaId, mediaType = 'track' }) => {
  const res = await axiosInstance.post(`/recommendations/listening/unlike`, {
    media_id: mediaId,
    media_type: mediaType,
  });
  return res.data;
};

// Получить лайкнутые сущности
export const fetchLikedEntities = async (mediaType = 'track') => {
  const res = await axiosInstance.get(`/recommendations/listening/liked`, {
    params: { media_type: mediaType }
  });
  return res.data; 
};