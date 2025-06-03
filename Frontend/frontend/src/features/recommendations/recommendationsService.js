import axiosInstance from '../../api/axiosInstance';

// Получить рекомендации (пример, если нужно)
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

// Получить популярные треки/плейлисты
export const fetchPopularRecommendations = async (mediaType = 'track', limit = 10) => {
  const res = await axiosInstance.get(`/recommendations/popular`, {
    params: { media_type: mediaType, limit }
  });
  return res.data;
};

// Получить историю
export const fetchHistory = async (userId, mediaType = 'track') => {
  const res = await axiosInstance.get(`/recommendations/listening/history`, {
    headers: { "X-User-ID": userId },
    params: { media_type: mediaType }
  });
  return res.data;
};

// Добавить в историю
export const addHistory = async ({ userId, mediaId, mediaType = 'track' }) => {
  const res = await axiosInstance.post(
    `/recommendations/listening/history`,
    {
      media_id: mediaId,
      media_type: mediaType,
    },
    {
      headers: { "X-User-ID": userId }
    }
  );
  return res.data;
};

// Поставить лайк
export const likeEntity = async ({ userId, mediaId, mediaType = 'track' }) => {
  const res = await axiosInstance.post(
    `/recommendations/listening/like`,
    {
      media_id: mediaId,
      media_type: mediaType,
    },
    {
      headers: { "X-User-ID": userId }
    }
  );
  return res.data;
};

// Убрать лайк
export const unlikeEntity = async ({ userId, mediaId, mediaType = 'track' }) => {
  const res = await axiosInstance.post(
    `/recommendations/listening/unlike`,
    {
      media_id: mediaId,
      media_type: mediaType,
    },
    {
      headers: { "X-User-ID": userId }
    }
  );
  return res.data;
};

// Получить лайкнутые сущности
export const fetchLikedEntities = async (userId, mediaType = 'track') => {
  const res = await axiosInstance.get(`/recommendations/listening/liked`, {
    headers: { "X-User-ID": userId },
    params: { media_type: mediaType }
  });
  return res.data;
};