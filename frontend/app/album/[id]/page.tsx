"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import YouTube from "react-youtube";
import { Play, Pause, Clock, Volume2, Heart } from "lucide-react";
import { playerService } from "@/services/playerService";
import { musicaService, Musica } from "@/services/musicaService";

export default function AlbumDetails() {
  const params = useParams();
  const musicId = Number(params.id);

  const [music, setMusic] = useState<Musica | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);

  // ESTADOS DO LIKE
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!musicId) return;

    musicaService.obterPorId(musicId)
        .then((data) => {
          setMusic(data);
          playerService.setCurrentSong(data);
        })
        .catch((error) => console.error("Erro ao buscar música:", error));
  }, [musicId]);

  // VERIFICA SE A MÚSICA JÁ ESTAVA CURTIDA AO CARREGAR
  useEffect(() => {
    if (music) {
      const savedLikes = JSON.parse(localStorage.getItem("@musicapp:likes") || "[]");
      const alreadyLiked = savedLikes.some((m: any) => m.id === music.id);
      setIsLiked(alreadyLiked);
    }
  }, [music]);

  if (!music) {
    return <div className="p-10 text-white font-bold">Carregando a música...</div>;
  }

  // Extração segura baseada na interface tipada
  const capaUrl = music.album?.capa_url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300&h=300";
  const titulo = music.title || music.titulo || "Música Desconhecida";
  const albumTitulo = music.album?.titulo || music.album?.title || "Single";
  const artistaNome = typeof music.artist === 'object'
      ? (music.artist?.nome || music.artist?.name)
      : (music.artist || music.artista?.nome || music.artista || "Artista Desconhecido");
  const fotoArtista = music.artist?.foto_url;

  const duracao = music.durationSeconds || music.duracaoSegundos || 0;
  const duracaoFormatada = `${Math.floor(duracao / 60)}:${Math.floor(duracao % 60).toString().padStart(2, '0')}`;

  const youtubeUrl = music.youtubeUrl || music.urlYoutube || "";
  const youtubeId = youtubeUrl ? youtubeUrl.split("v=")[1]?.split("&")[0] : "";

  const onPlayerReady = (event: any) => {
    (window as any).ytPlayer = event.target;
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

  // FUNÇÃO QUE SALVA/REMOVE DOS FAVORITOS
  const toggleLike = () => {
    if (!music) return;
    const savedLikes = JSON.parse(localStorage.getItem("@musicapp:likes") || "[]");
    let newLikes;

    if (isLiked) {
      newLikes = savedLikes.filter((m: any) => m.id !== music.id);
      setIsLiked(false);
    } else {
      newLikes = [...savedLikes, music];
      setIsLiked(true);
    }
    localStorage.setItem("@musicapp:likes", JSON.stringify(newLikes));
  };

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: { autoplay: 1, controls: 0, disablekb: 1, rel: 0 },
  };

  return (
      <div className="flex flex-col gap-8 pb-24 p-8">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mt-4">
          <img
              src={capaUrl}
              alt={`Capa do Álbum ${albumTitulo}`}
              className="w-56 h-56 shadow-2xl rounded-md object-cover"
          />
          <div className="flex flex-col gap-3 text-center md:text-left">
          <span className="text-sm font-medium uppercase tracking-wider text-zinc-400">
            {albumTitulo}
          </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">{titulo}</h1>
            <div className="flex items-center justify-center md:justify-start gap-3 text-zinc-400 text-sm mt-2">
              {fotoArtista && (
                  <img
                      src={fotoArtista}
                      alt={artistaNome}
                      className="w-6 h-6 rounded-full object-cover"
                  />
              )}
              <span className="text-white font-bold">{artistaNome}</span>
              {music.album?.ano_lancamento && (
                  <>
                    <span>•</span>
                    <span>{music.album.ano_lancamento}</span>
                  </>
              )}
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

              {/* BOTÃO DE CURTIR */}
              <button
                  onClick={toggleLike}
                  className="w-14 h-14 flex items-center justify-center rounded-full hover:bg-zinc-800 transition-colors"
                  title="Salvar na Biblioteca"
              >
                <Heart
                    size={28}
                    className={`transition-colors ${isLiked ? 'text-emerald-500 fill-emerald-500' : 'text-zinc-400 hover:text-white'}`}
                />
              </button>
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

        <div className="mt-8 flex flex-col max-w-4xl">
          <div className="grid grid-cols-[30px_1fr_100px] gap-4 px-4 py-2 border-b border-zinc-800 text-sm text-zinc-400 mb-2">
            <span>#</span><span>Título</span><div className="flex justify-end pr-4"><Clock size={16} /></div>
          </div>
          <div
              onClick={togglePlay}
              className="grid grid-cols-[30px_1fr_100px] gap-4 px-4 py-3 hover:bg-zinc-800/60 rounded-md text-sm items-center transition-colors cursor-pointer"
          >
          <span className="text-zinc-400 text-center">
            {isPlaying ? <img src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f93a2ef4.gif" className="w-3 h-3 mx-auto" alt="playing" /> : "1"}
          </span>
            <div className="flex flex-col">
              <span className={`font-medium ${isPlaying ? 'text-red-500' : 'text-white'}`}>{titulo}</span>
              <span className="text-xs text-zinc-400 mt-1">{artistaNome}</span>
            </div>
            <span className="text-zinc-400 text-right pr-4">{duracaoFormatada}</span>
          </div>
        </div>
      </div>
  );
}