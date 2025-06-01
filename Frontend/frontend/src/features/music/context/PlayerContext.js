import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from "react";
import { useStreamFileByTrackId } from "../../streaming/hooks/useStreamFileByTrackId";

const PlayerContext = createContext();

export function usePlayer() {
  return useContext(PlayerContext);
}

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const streamFile = useStreamFileByTrackId(currentTrack?.id);
  const audioUrl = streamFile
    ? `http://localhost:5005/stream/${streamFile.id}`
    : null;

  const playTrack = useCallback((track) => {
    console.log("[PlayerContext] playTrack called with:", track);
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    console.log("[PlayerContext] pause called");
    setIsPlaying(false);
  }, []);

  const resume = useCallback(() => {
    console.log("[PlayerContext] resume called");
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    console.log("[PlayerContext] currentTrack changed:", currentTrack);
  }, [currentTrack]);

  useEffect(() => {
    console.log("[PlayerContext] audioUrl changed:", audioUrl);
  }, [audioUrl]);

  useEffect(() => {
    console.log("[PlayerContext] isPlaying changed:", isPlaying);
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch((e) => {
        console.warn("[PlayerContext] audio.play() error:", e);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      console.log("[PlayerContext] Reset audio.currentTime due to audioUrl change");
      audio.currentTime = 0;
    }
  }, [audioUrl]);

  return (
    <PlayerContext.Provider value={{
      currentTrack,
      isPlaying,
      playTrack,
      pause,
      resume,
      audioRef,
      audioUrl,
    }}>
      {children}
      <audio
        ref={audioRef}
        src={audioUrl}
        style={{ display: "none" }}
        onEnded={() => {
          console.log("[PlayerContext] Audio ended");
          setIsPlaying(false);
        }}
      />
    </PlayerContext.Provider>
  );
}