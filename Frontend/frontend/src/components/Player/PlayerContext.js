import React, { createContext, useContext, useState, useRef } from "react";

const PlayerContext = createContext();

export function usePlayer() {
  return useContext(PlayerContext);
}

export function PlayerProvider({ children }) {
  const [track, setTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const playTrack = (trackData) => {
    setTrack(trackData);
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
    audioRef.current?.pause();
  };

  const resume = () => {
    setIsPlaying(true);
    audioRef.current?.play();
  };

  return (
    <PlayerContext.Provider value={{ track, isPlaying, playTrack, pause, resume, audioRef }}>
      {children}
    </PlayerContext.Provider>
  );
}