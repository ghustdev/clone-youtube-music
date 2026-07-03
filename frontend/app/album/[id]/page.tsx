"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import YouTube from "react-youtube";
import {
  Play,
  Pause,
  Clock,
  Shuffle,
  Volume2
} from "lucide-react";

export default function AlbumDetails() {
  const params = useParams();
  const musicId = params.id;

  const [music, setMusic] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);

  useEffect(() => {
    fetch(`http://localhost:8080/api/musics/${musicId}`)
      .then((response) => response.json())
      .then((data) => setMusic(data))
      .catch((error) => console.error("Erro ao buscar música:", error));
  }, [musicId]);

  if (!music) {
    return <div className="p-10 text-white font-bold">Carregando a música...</div>;
  }

  const youtubeId = music.youtubeUrl ? music.youtubeUrl.split("v=")[1]?.split("&")[0] : "";

  // ESTA É A FUNÇÃO QUE O PLAYER DO RODAPÉ VAI USAR
  const onPlayerReady = (event: any) => {
    (window as any).ytPlayer = event.target; // Salva globalmente para o rodapé
    event.target.setVolume(volume);
  };

  const togglePlay = () => {
    const player = (window as any).ytPlayer;
    if (!player) return;

    if (isPlaying) {
      player.pauseVideo();
      setIsPlaying(false);
    } else {
      player.playVideo();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    const player = (window as any).ytPlayer;
    if (player) {
      player.setVolume(newVolume);
    }
  };

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      rel: 0,
    },
  };

  return (
    <div className="flex flex-col gap-8 pb-24 p-8">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mt-4">
        <img
          src={`https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300&h=300`}
          alt="Capa do Álbum"
          className="w-56 h-56 shadow-2xl rounded-md object-cover"
        />
        <div className="flex flex-col gap-3 text-center md:text-left">
          <span className="text-sm font-medium uppercase tracking-wider text-zinc-400">Single</span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">{music.title}</h1>
          <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-400 text-sm mt-2">
            <span className="text-white font-bold">{music.artist}</span>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
            <button 
              onClick={togglePlay}
              className="bg-white text-black w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="fill-black" size={24} /> : <Play className="fill-black ml-1" size={24} />}
            </button>

            <div className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-full border border-zinc-700">
              <Volume2 size={20} className="text-zinc-400" />
              <input 
                type="range" 
                min="0" max="100" 
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 accent-white"
              />
            </div>
          </div>
        </div>
      </div>

      {youtubeId && (
        <div className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl mt-4">
          <YouTube 
            videoId={youtubeId} 
            opts={opts} 
            onReady={onPlayerReady}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full"
          />
        </div>
      )}

      <div className="mt-8 flex flex-col">
        <div className="grid grid-cols-[30px_1fr_100px] gap-4 px-4 py-2 border-b border-zinc-800 text-sm text-zinc-400 mb-2">
          <span>#</span><span>Título</span><div className="flex justify-end pr-4"><Clock size={16} /></div>
        </div>
        <div className="grid grid-cols-[30px_1fr_100px] gap-4 px-4 py-3 hover:bg-zinc-800/60 rounded-md text-sm items-center">
          <span className="text-zinc-400 text-center">1</span>
          <div className="flex flex-col"><span className="text-white font-medium">{music.title}</span></div>
          <span className="text-zinc-400 text-right pr-4">3:45</span>
        </div>
      </div>
    </div>
  );
}