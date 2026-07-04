"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Plus, Heart, Music as MusicIcon, Play } from "lucide-react";
import { authService } from "@/services/authService";
import { Musica } from "@/services/musicaService";
import Link from "next/link";

export default function Library() {
  const router = useRouter();
  const isAuthenticated = useSyncExternalStore(
      authService.subscribeAuthChanges,
      authService.getAuthSnapshot,
      () => false,
  );

  // Agora usando a tipagem correta Musica[]
  const [likedMusics, setLikedMusics] = useState<Musica[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth");
    } else {
      const savedLikes = JSON.parse(localStorage.getItem("@musicapp:likes") || "[]");
      setLikedMusics(savedLikes);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
      <div className="flex flex-col gap-8 pb-32">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-white">Sua Biblioteca</h1>
          <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
            <Plus size={18} /> Nova Playlist
          </button>
        </div>

        <div className="flex flex-col gap-8">
          {/* SEÇÃO 1: MÚSICAS CURTIDAS */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-lg">
                <Heart size={24} className="text-white fill-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Músicas Curtidas</h2>
                <p className="text-sm text-zinc-400">{likedMusics.length} faixas salvas</p>
              </div>
            </div>

            {likedMusics.length === 0 ? (
                <div className="p-8 border border-dashed border-zinc-700 rounded-lg text-center mt-2 bg-zinc-900/30">
                  <p className="text-zinc-400">Você ainda não curtiu nenhuma música.</p>
                  <p className="text-sm text-zinc-500 mt-1">Navegue e clique no joinha para salvar suas favoritas!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                  {likedMusics.map((music) => {
                    // EXTRAÇÃO SEGURA
                    const capaUrl = music.album?.capa_url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=150&h=150";
                    const titulo = music.title || music.titulo || "Desconhecido";
                    const artistaNome = typeof music.artist === 'object'
                        ? (music.artist?.nome || music.artist?.name || "Artista")
                        : (music.artist || "Artista");

                    return (
                        <Link href={`/album/${music.id}`} key={music.id}>
                          <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-3 rounded-lg hover:bg-zinc-800 transition-colors group cursor-pointer">
                            <div className="w-16 h-16 bg-zinc-800 rounded relative overflow-hidden flex-shrink-0">
                              <img
                                  src={capaUrl}
                                  alt={titulo}
                                  className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
                              />
                              <Play className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <strong className="text-white truncate" title={titulo}>{titulo}</strong>
                              <span className="text-sm text-zinc-400 truncate" title={artistaNome}>{artistaNome}</span>
                            </div>
                          </div>
                        </Link>
                    );
                  })}
                </div>
            )}
          </div>

          <hr className="border-zinc-800" />

          {/* SEÇÃO 2: PLAYLISTS */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-zinc-800 rounded-lg shadow-lg">
                <MusicIcon size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Suas Playlists</h2>
                <p className="text-sm text-zinc-400">Coleções personalizadas</p>
              </div>
            </div>

            <div className="p-8 border border-dashed border-zinc-700 rounded-lg text-center mt-2 bg-zinc-900/30">
              <p className="text-zinc-400">Nenhuma playlist criada ainda.</p>
              <button className="mt-4 px-6 py-2 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
                Criar primeira playlist
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}