import React from "react";
import { usePlayer } from "./Player/PlayerContext";
import axios from "../api/axiosInstance";

function TrackCard({ trackId, title }) {
  const { playTrack } = usePlayer();

  const handlePlay = async () => {
    // Получаем mp3-файл
    const response = await axios.get(`/tracks/download/${trackId}`, { responseType: "blob" });
    const url = URL.createObjectURL(response.data);

    playTrack({ title, audioUrl: url });

    // Здесь можно отправить событие "прослушал трек" в историю
    // await axios.post('/recommendations/listening/history', ...)
  };

  return (
    <div>
      <span>{title}</span>
      <button onClick={handlePlay}>Play</button>
    </div>
  );
}

export default TrackCard;