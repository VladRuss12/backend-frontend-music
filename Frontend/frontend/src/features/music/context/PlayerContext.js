import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
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
    setCurrentTrack((prev) => {
      if (prev && prev.id === track.id) return prev;
      return track;
    });
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const resume = useCallback(() => {
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    // debug only
    // console.log("[PlayerContext] currentTrack changed:", currentTrack);
  }, [currentTrack]);

  useEffect(() => {
    // debug only
    // console.log("[PlayerContext] audioUrl changed:", audioUrl);
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch((e) => {
        // console.warn("[PlayerContext] audio.play() error:", e);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      // console.log("[PlayerContext] Reset audio.currentTime due to audioUrl change");
      audio.currentTime = 0;
    }
  }, [audioUrl]);

  // value обернут в useMemo
  const contextValue = useMemo(
    () => ({
      currentTrack,
      isPlaying,
      playTrack,
      pause,
      resume,
      audioRef,
      audioUrl,
    }),
    [currentTrack, isPlaying, playTrack, pause, resume, audioUrl]
  );

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
      <audio
        ref={audioRef}
        src={audioUrl}
        style={{ display: "none" }}
        onEnded={() => {
          setIsPlaying(false);
        }}
      />
    </PlayerContext.Provider>
  );
}