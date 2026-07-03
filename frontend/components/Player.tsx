// components/Player.tsx (ou onde estiver seu arquivo do player)
"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Play, Pause, SkipBack, SkipForward, Maximize2, Minimize2, Volume2 } from "lucide-react";
import { playerService } from "@/services/playerService";

// Função blindada para sempre extrair um texto, nunca um objeto!
const getTextoSeguro = (campo: any, chavePrimaria: string): string => {
  if (!campo) return "Desconhecido";
  if (typeof campo === "string") return campo; // Se ainda for string (legado)
  if (typeof campo === "object") {
    return campo[chavePrimaria] || campo.nome || campo.name || campo.titulo || campo.title || "Desconhecido";
  }
  return "Desconhecido";
};

export default function Player() {
  const pathname = usePathname();
  const router = useRouter();

  const currentSong = useSyncExternalStore(
      playerService.subscribe,
      playerService.getCurrentSong,
      () => null
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);

  const isNowPlaying = pathname === "/now-playing";

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const player = (window as any).ytPlayer;
      if (player && player.getPlayerState) {
        setIsPlaying(player.getPlayerState() === 1);
        setCurrentTime(player.getCurrentTime());
        setDuration(player.getDuration());
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const togglePlay = () => {
    const player = (window as any).ytPlayer;
    if (player) {
      isPlaying ? player.pauseVideo() : player.playVideo();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    const player = (window as any).ytPlayer;
    if (player && player.setVolume) {
      player.setVolume(newVolume);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);

    const player = (window as any).ytPlayer;
    if (player && player.seekTo) {
      player.seekTo(newTime, true);
    }
  };

  // Usando a extração segura
  const capaUrl = currentSong?.album?.capa_url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=60&h=60";
  const titulo = currentSong ? getTextoSeguro(currentSong.title || currentSong.titulo, "title") : "Nenhuma música";
  const artistaNome = currentSong ? getTextoSeguro(currentSong.artist || currentSong.artista, "nome") : "---";

  return (
      <footer className="h-24 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4 w-1/3">
          <div className="w-12 h-12 bg-zinc-800 rounded md:block hidden overflow-hidden">
            <img
                src={capaUrl}
                alt="Capa"
                className="w-full h-full object-cover rounded"
            />
          </div>
          <div className="flex flex-col">
            <strong className="text-sm font-normal text-white truncate max-w-[200px]" title={titulo}>
              {titulo}
            </strong>
            <span className="text-xs text-zinc-400 truncate max-w-[200px]" title={artistaNome}>
            {artistaNome}
          </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 w-1/3">
          <div className="flex items-center gap-6">
            <SkipBack size={24} className="text-zinc-200 cursor-pointer hover:text-white" />
            <button
                onClick={togglePlay}
                disabled={!currentSong}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-black hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
            >
              {isPlaying ? <Pause className="fill-black" size={20} /> : <Play className="fill-black ml-1" size={20} />}
            </button>
            <SkipForward size={24} className="text-zinc-200 cursor-pointer hover:text-white" />
          </div>

          <div className="flex items-center gap-2 w-full max-w-md">
            <span className="text-xs text-zinc-400">{formatTime(currentTime)}</span>
            <div className="h-1 rounded-full w-full bg-zinc-600 cursor-pointer relative group">
              <input
                  type="range" min="0" max={duration || 100} value={currentTime}
                  onChange={handleSeek} disabled={!currentSong}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
              />
              <div
                  className="bg-red-500 h-full rounded-full absolute top-0 left-0 pointer-events-none transition-all"
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="text-xs text-zinc-400">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="w-1/3 flex justify-end items-center gap-4">
          <Volume2 size={20} className="text-zinc-400" />
          <div className="w-24 h-1 bg-zinc-600 rounded-full cursor-pointer relative group hidden md:block">
            <input
                type="range" min="0" max="100" value={volume} onChange={handleVolumeChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="bg-zinc-400 h-full rounded-full pointer-events-none transition-all" style={{ width: `${volume}%` }}></div>
          </div>
          {isNowPlaying ? (
              <button onClick={() => router.back()} className="ml-4 text-zinc-400 hover:text-white"><Minimize2 size={20} /></button>
          ) : (
              <Link href="/now-playing" className="ml-4 text-zinc-400 hover:text-white"><Maximize2 size={20} /></Link>
          )}
        </div>
      </footer>
  );
}