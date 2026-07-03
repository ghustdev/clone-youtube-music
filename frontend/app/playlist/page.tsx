// app/playlist/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Play, Clock, MoreVertical, Heart } from "lucide-react";
import { playlistService, Playlist } from "@/services/playlistService";
import { playerService } from "@/services/playerService";
import { Musica } from "@/services/musicaService";

export default function PlaylistPage() {
  const params = useParams();
  const playlistId = Number(params.id);

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!playlistId) return;

    playlistService.obterPorId(playlistId)
        .then((data) => {
          setPlaylist(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Erro ao buscar playlist:", error);
          setIsLoading(false);
        });
  }, [playlistId]);

  if (isLoading) {
    return <div className="p-10 text-zinc-400 font-bold">Carregando playlist...</div>;
  }

  if (!playlist) {
    return <div className="p-10 text-zinc-400 font-bold">Playlist não encontrada.</div>;
  }

  // Extração segura de dados da Playlist
  const capaUrl = playlist.capa_url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300&h=300";
  const tituloPlaylist = playlist.nome || playlist.name || "Playlist sem nome";
  const descricaoPlaylist = playlist.descricao || playlist.description || "Sua coleção personalizada de músicas.";
  const musicas = playlist.musicas || playlist.tracks || [];

  const tempoTotalSegundos = musicas.reduce((acc, music) => acc + (music.durationSeconds || music.duracaoSegundos || 0), 0);
  const tempoTotalMinutos = Math.floor(tempoTotalSegundos / 60);

  const handlePlayMusic = (music: Musica) => {
    playerService.setCurrentSong(music);
    // Tenta iniciar a reprodução automaticamente no player global
    setTimeout(() => {
      const player = (window as any).ytPlayer;
      if (player && player.playVideo) {
        player.playVideo();
      }
    }, 500);
  };

  return (
      <div className="flex flex-col gap-8 pb-32 p-8">
        {/* Cabeçalho da Playlist */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mt-4">
          <img
              src={capaUrl}
              alt={`Capa da Playlist ${tituloPlaylist}`}
              className="w-48 h-48 shadow-2xl rounded-md object-cover"
          />
          <div className="flex flex-col gap-2 text-center md:text-left">
          <span className="text-sm font-medium uppercase tracking-wider text-zinc-400">
            Playlist
          </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              {tituloPlaylist}
            </h1>
            <p className="text-zinc-400 mt-2">
              {descricaoPlaylist} • {musicas.length} músicas, {tempoTotalMinutos} minutos
            </p>

            <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
              <button
                  onClick={() => musicas.length > 0 && handlePlayMusic(musicas[0])}
                  disabled={musicas.length === 0}
                  className="bg-white text-black px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
              >
                <Play className="fill-black" size={20} />
                Tocar
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-600 text-zinc-300 hover:text-white hover:border-white transition-colors">
                <Heart size={20} />
              </button>
              <MoreVertical className="text-zinc-400 cursor-pointer hover:text-white" />
            </div>
          </div>
        </div>

        {/* Tabela de Músicas (Lista) */}
        <div className="mt-6 flex flex-col max-w-5xl">
          {/* Cabeçalho da Tabela */}
          <div className="grid grid-cols-[16px_4fr_3fr_minmax(80px,100px)] gap-4 px-4 py-2 border-b border-zinc-800 text-sm text-zinc-400">
            <span>#</span>
            <span>Título</span>
            <span className="hidden md:block">Álbum</span>
            <div className="flex justify-end pr-2">
              <Clock size={16} />
            </div>
          </div>

          {/* Linhas da Tabela */}
          <div className="flex flex-col mt-2">
            {musicas.length === 0 ? (
                <p className="text-zinc-400 py-4 px-4">Esta playlist está vazia.</p>
            ) : (
                musicas.map((music, index) => {
                  const trackTitle = music.title || music.titulo || "Desconhecido";
                  const trackArtist = typeof music.artist === 'object'
                      ? (music.artist?.nome || music.artist?.name)
                      : (music.artist || music.artista?.nome || music.artista || "Desconhecido");
                  const trackAlbum = typeof music.album === 'object'
                      ? (music.album?.titulo || music.album?.title)
                      : (music.album || music.album?.titulo || "Single");

                  const duracao = music.durationSeconds || music.duracaoSegundos || 0;
                  const duracaoFormatada = `${Math.floor(duracao / 60)}:${Math.floor(duracao % 60).toString().padStart(2, '0')}`;

                  return (
                      <div
                          key={music.id || index}
                          onClick={() => handlePlayMusic(music)}
                          className="grid grid-cols-[16px_4fr_3fr_minmax(80px,100px)] gap-4 px-4 py-3 hover:bg-zinc-800/50 rounded-md group text-sm items-center transition-colors cursor-pointer"
                      >
                  <span className="text-zinc-400 group-hover:hidden">
                    {index + 1}
                  </span>
                        <Play size={16} className="text-white hidden group-hover:block" />

                        <div className="flex flex-col truncate pr-4">
                          <span className="text-white font-medium truncate">{trackTitle}</span>
                          <span className="text-zinc-400 text-xs truncate">{trackArtist}</span>
                        </div>

                        <span className="text-zinc-400 truncate hidden md:block pr-4">{trackAlbum}</span>
                        <span className="text-zinc-400 text-right pr-2">{duracaoFormatada}</span>
                      </div>
                  );
                })
            )}
          </div>
        </div>
      </div>
  );
}