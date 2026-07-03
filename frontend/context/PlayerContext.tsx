// context/PlayerContext.tsx
"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Track = {
  id: number;
  title: string;
  artist: string;
  duration: string;
  youtubeUrl: string;
};

type PlayerContextType = {
  queue: Track[];
  currentIndex: number;
  currentTrack: Track | null;
  isPlaying: boolean;
  setQueue: (tracks: Track[], startIndex?: number) => void;
  playTrack: (index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  setIsPlaying: (v: boolean) => void;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [queue, setQueueState] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const extractVideoId = (url: string) => {
    const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : "";
  };

  const loadInPlayer = (track: Track) => {
    const player = (window as any).ytPlayer;
    const videoId = extractVideoId(track.youtubeUrl);
    if (player && videoId) {
      player.loadVideoById(videoId);
    }
  };

  const setQueue = useCallback((tracks: Track[], startIndex = 0) => {
    setQueueState(tracks);
    setCurrentIndex(startIndex);
    if (tracks[startIndex]) loadInPlayer(tracks[startIndex]);
  }, []);

  const playTrack = useCallback((index: number) => {
    setCurrentIndex(index);
    if (queue[index]) loadInPlayer(queue[index]);
  }, [queue]);

  const playNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = prev < queue.length - 1 ? prev + 1 : prev;
      if (queue[next]) loadInPlayer(queue[next]);
      return next;
    });
  }, [queue]);

  const playPrevious = useCallback(() => {
    setCurrentIndex((prev) => {
      const back = prev > 0 ? prev - 1 : 0;
      if (queue[back]) loadInPlayer(queue[back]);
      return back;
    });
  }, [queue]);

  const currentTrack = queue[currentIndex] || null;

  return (
    <PlayerContext.Provider
      value={{ queue, currentIndex, currentTrack, isPlaying, setQueue, playTrack, playNext, playPrevious, setIsPlaying }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer precisa estar dentro de <PlayerProvider>");
  return ctx;
}