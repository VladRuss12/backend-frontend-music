import React, { createContext, useContext, useRef, useState, useCallback } from "react";

const PlayerContext = createContext();

export function usePlayer() {
  return useContext(PlayerContext);
}

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playTrack = useCallback((track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => setIsPlaying(false), []);
  const resume = useCallback(() => setIsPlaying(true), []);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(()=>{});
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  // YouTube ссылки напрямую проигрывать нельзя через <audio>, нужен mp3/mp4 прямой url
  // Для теста используем рандомный mp3 url (пример)
  const getAudioUrl = (track) =>
    track?.audio_url ||
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; // замените на любой открытый mp3

  return (
    <PlayerContext.Provider value={{
      currentTrack,
      isPlaying,
      playTrack,
      pause,
      resume,
      audioRef,
    }}>
      {children}
      <audio
        ref={audioRef}
        src={getAudioUrl(currentTrack)}
        style={{ display: "none" }}
        onEnded={() => setIsPlaying(false)}
      />
    </PlayerContext.Provider>
  );
}