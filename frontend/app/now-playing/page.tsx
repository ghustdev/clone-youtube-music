"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import YouTube from "react-youtube";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Heart, // <-- Trocado ThumbsUp por Heart
  MoreVertical,
  ChevronDown,
  Loader2 
} from "lucide-react";

type Track = {
  id: number;
  title: string;
  artist: string;
  duration: string;
  youtubeUrl: string; 
};

export default function NowPlaying() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"queue" | "lyrics">("queue");
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<any>(null);

  const [queue, setQueue] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ESTADO DO LIKE
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/api/musics")
      .then((res) => res.json())
      .then((data) => {
        const formattedData = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          artist: item.artist || "Artista Desconhecido",
          duration: item.duration || "0:00",
          youtubeUrl: item.youtubeUrl || item.url || "", 
        }));
        
        setQueue(formattedData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar músicas do Java:", err);
        setIsLoading(false);
      });
  }, []);

  // VERIFICA SE A MÚSICA ATUAL ESTÁ CURTIDA (Roda toda vez que a música pula)
  useEffect(() => {
    const currentTrack = queue[currentIndex];
    if (currentTrack) {
      const savedLikes = JSON.parse(localStorage.getItem("@musicapp:likes") || "[]");
      const alreadyLiked = savedLikes.some((m: any) => m.id === currentTrack.id);
      setIsLiked(alreadyLiked);
    }
  }, [currentIndex, queue]);

  // FUNÇÃO QUE SALVA/REMOVE DA BIBLIOTECA
  const toggleLike = () => {
    const currentTrack = queue[currentIndex];
    if (!currentTrack) return;
    
    const savedLikes = JSON.parse(localStorage.getItem("@musicapp:likes") || "[]");
    let newLikes;

    if (isLiked) {
      newLikes = savedLikes.filter((m: any) => m.id !== currentTrack.id);
      setIsLiked(false);
    } else {
      newLikes = [...savedLikes, currentTrack];
      setIsLiked(true);
    }
    localStorage.setItem("@musicapp:likes", JSON.stringify(newLikes));
  };

  const extractVideoId = (url: string) => {
    if (!url) return "";
    const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : "";
  };

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: { autoplay: 1, rel: 0 },
  };

  const onPlayerReady = (event: any) => {
    playerRef.current = event.target;
    (window as any).ytPlayer = event.target;
  };

  const onPlayerEnd = () => {
    playNext();
  };

  const togglePlay = () => {
    const player = (window as any).ytPlayer;
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  const playTrack = (index: number) => {
    setCurrentIndex(index);
    const videoId = extractVideoId(queue[index]?.youtubeUrl);
    const player = (window as any).ytPlayer;
    if (player && videoId) {
      player.loadVideoById(videoId);
    }
  };

  const playNext = () => {
    if (currentIndex < queue.length - 1) playTrack(currentIndex + 1);
  };

  const playPrevious = () => {
    if (currentIndex > 0) playTrack(currentIndex - 1);
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-6rem)] w-full items-center justify-center flex-col gap-4 text-zinc-400">
        <Loader2 className="animate-spin" size={48} />
        <p>Carregando músicas do banco de dados...</p>
      </div>
    );
  }

  if (queue.length === 0) {
    return (
      <div className="flex h-[calc(100vh-6rem)] w-full items-center justify-center text-zinc-400">
        <p>Nenhuma música encontrada no banco de dados.</p>
      </div>
    );
  }

  const currentTrack = queue[currentIndex];

  return (
    <div className="relative flex flex-col lg:flex-row gap-10 h-full max-w-7xl mx-auto pt-12 lg:pt-0">
      <button
        onClick={() => router.back()}
        className="absolute top-0 left-0 lg:top-4 p-2 text-zinc-400 hover:text-white transition-colors bg-zinc-900/50 hover:bg-zinc-800 rounded-full"
        title="Minimizar player"
      >
        <ChevronDown size={32} />
      </button>

      {/* Lado Esquerdo: Player Principal */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="w-full max-w-md aspect-square bg-black rounded-md shadow-2xl overflow-hidden mt-4 lg:mt-0">
          <YouTube
            videoId={extractVideoId(currentTrack.youtubeUrl)}
            opts={opts}
            onReady={onPlayerReady}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnd={onPlayerEnd}
            className="w-full h-full"
          />
        </div>

        <div className="w-full max-w-md flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h1 className="text-3xl font-extrabold text-white">
                {currentTrack.title}
              </h1>
              <span className="text-lg text-zinc-400">
                {currentTrack.artist}
              </span>
            </div>
            <div className="flex items-center gap-4">
              
              {/* NOSSO BOTÃO DE CURTIR */}
              <Heart 
                size={24} 
                onClick={toggleLike}
                className={`cursor-pointer transition-colors ${isLiked ? 'text-emerald-500 fill-emerald-500' : 'text-zinc-400 hover:text-white'}`} 
              />
              
              <MoreVertical size={24} className="text-zinc-400 cursor-pointer hover:text-white transition-colors" />
            </div>
          </div>

          <div className="flex justify-between items-center px-4">
            <Shuffle size={24} className="text-zinc-400 cursor-pointer hover:text-white transition-colors" />
            <SkipBack
              size={36}
              onClick={playPrevious}
              className="text-zinc-200 cursor-pointer hover:text-white transition-colors"
            />
            <button
              onClick={togglePlay}
              className="w-20 h-20 flex items-center justify-center bg-white rounded-full text-black hover:scale-105 transition-transform shadow-xl"
            >
              {isPlaying ? (
                <Pause className="fill-black" size={32} />
              ) : (
                <Play className="fill-black ml-1" size={32} />
              )}
            </button>
            <SkipForward
              size={36}
              onClick={playNext}
              className="text-zinc-200 cursor-pointer hover:text-white transition-colors"
            />
            <Repeat size={24} className="text-zinc-400 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>
      </div>

      {/* Lado Direito: Fila (Queue) e Letras */}
      <div className="w-full lg:w-[400px] flex flex-col bg-zinc-900/40 rounded-xl overflow-hidden border border-zinc-800/50 mt-8 lg:mt-0">
        <div className="flex justify-center gap-8 p-4 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab("queue")}
            className={`font-semibold pb-1 border-b-2 transition-colors ${activeTab === "queue" ? "border-white text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}
          >
            A seguir
          </button>
          <button
            onClick={() => setActiveTab("lyrics")}
            className={`font-semibold pb-1 border-b-2 transition-colors ${activeTab === "lyrics" ? "border-white text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}
          >
            Letras
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {activeTab === "queue" ? (
            <div className="flex flex-col gap-1">
              {queue.map((track, index) => (
                <div
                  key={track.id}
                  onClick={() => playTrack(index)}
                  className={`flex items-center gap-3 p-2 hover:bg-zinc-800/50 rounded-md group transition-colors cursor-pointer ${index === currentIndex ? "bg-zinc-800/70" : ""}`}
                >
                  <div className="text-zinc-500 text-sm w-4 text-center group-hover:hidden">
                    {index === currentIndex ? (
                      <span className="text-red-500">▶</span>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <Play
                    size={14}
                    className="text-white hidden group-hover:block w-4 text-center"
                  />

                  <div className="w-10 h-10 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={`https://img.youtube.com/vi/${extractVideoId(track.youtubeUrl)}/default.jpg`}
                      alt="Capa"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col flex-1 truncate">
                    <span className={`text-sm font-medium truncate ${index === currentIndex ? "text-red-400" : "text-white"}`}>
                      {track.title}
                    </span>
                    <span className="text-zinc-400 text-xs truncate">
                      {track.artist}
                    </span>
                  </div>
                  <span className="text-zinc-500 text-xs">
                    {track.duration}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 flex flex-col items-center justify-center h-full">
              <p className="text-2xl font-bold leading-relaxed text-zinc-300">
                A letra desta música
                <br />
                ainda não está disponível
                <br />
                no seu backend Java.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}