"use client";

import React from "react";
import { useParams } from "next/navigation";
import {
  Play,
  Clock,
  MoreVertical,
  Heart,
  Shuffle,
  PlusCircle,
} from "lucide-react";

export default function AlbumDetails() {
  const params = useParams(); // Pega o ID da URL (ex: /album/123)
  const albumId = params.id;

  // No futuro, vocês vão fazer um fetch no Java usando esse albumId
  // const [album, setAlbum] = useState(null);
  // useEffect(() => { api.get(`/api/albuns/${albumId}`).then(...) }, [albumId]);

  const tracks = [
    { id: 1, title: "Bohemian Rhapsody", artist: "Queen", duration: "5:55" },
    { id: 2, title: "Don't Stop Me Now", artist: "Queen", duration: "3:29" },
    { id: 3, title: "Somebody To Love", artist: "Queen", duration: "4:56" },
    {
      id: 4,
      title: "Under Pressure",
      artist: "Queen & David Bowie",
      duration: "4:08",
    },
  ];

  return (
    <div className="flex flex-col gap-8 pb-24">
      {/* Cabeçalho do Álbum / Playlist */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mt-4">
        <img
          src={`https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300&h=300`}
          alt="Capa do Álbum"
          className="w-56 h-56 shadow-2xl rounded-md object-cover"
        />
        <div className="flex flex-col gap-3 text-center md:text-left">
          <span className="text-sm font-medium uppercase tracking-wider text-zinc-400">
            Álbum
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Queen Classics (ID: {albumId})
          </h1>

          <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-400 text-sm mt-2">
            <span className="text-white font-bold">Queen</span>
            <span>•</span>
            <span>2026</span>
            <span>•</span>
            <span>4 músicas, 18 minutos</span>
          </div>

          {/* Ações Rápidas */}
          <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
            <button className="bg-white text-black px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform">
              <Play className="fill-black" size={20} /> Tocar
            </button>
            <button className="bg-zinc-800 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform border border-zinc-700">
              <Shuffle size={20} /> Ordem Aleatória
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors">
              <PlusCircle size={24} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors">
              <MoreVertical size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Músicas */}
      <div className="mt-8 flex flex-col">
        {/* Cabeçalho da Tabela */}
        <div className="grid grid-cols-[30px_1fr_100px] gap-4 px-4 py-2 border-b border-zinc-800 text-sm text-zinc-400 mb-2">
          <span>#</span>
          <span>Título</span>
          <div className="flex justify-end pr-4">
            <Clock size={16} />
          </div>
        </div>

        {/* Linhas das Músicas */}
        <div className="flex flex-col">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              className="grid grid-cols-[30px_1fr_100px] gap-4 px-4 py-3 hover:bg-zinc-800/60 rounded-md group text-sm items-center transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-center w-full">
                <span className="text-zinc-400 group-hover:hidden">
                  {index + 1}
                </span>
                <Play
                  size={16}
                  className="text-white hidden group-hover:block"
                />
              </div>

              <div className="flex flex-col">
                <span className="text-white font-medium truncate">
                  {track.title}
                </span>
                <span className="text-zinc-400 text-xs truncate">
                  {track.artist}
                </span>
              </div>

              <span className="text-zinc-400 text-right pr-4">
                {track.duration}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
