import axiosInstance from '../../api/axiosInstance';

// Получить список всех стрим-файлов
export const fetchStreamFiles = async () => {
  const res = await axiosInstance.get('/stream/files'); 
  return res.data;
};

// Получить метаданные файла по id
export const fetchStreamFileMeta = async (fileId) => {
  const res = await axiosInstance.get(`/stream/${fileId}/meta`);
  return res.data;
};

// Загрузить стрим-файл
export const uploadStreamFile = async (file, trackId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('track_id', trackId);
  const res = await axiosInstance.post('/stream/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};