"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Plus, Heart, ListMusic, Play } from "lucide-react";
import Link from "next/link";
import { authService } from "@/services/authService";
import { musicaService, Musica } from "@/services/musicaService";

export default function Library() {
  const router = useRouter();
  const isAuthenticated = useSyncExternalStore(
      authService.subscribeAuthChanges,
      authService.getAuthSnapshot,
      () => false,
  );

  const [recentMusics, setRecentMusics] = useState<Musica[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth");
    } else {
      musicaService.listar()
          .then((data) => {
            setRecentMusics(data.slice(0, 5)); // Simulando uma lista de faixas recentes/curtidas
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Erro ao carregar biblioteca:", error);
            setIsLoading(false);
          });
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
      <div className="flex flex-col gap-8 p-8 pb-32">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-white">Biblioteca</h1>
          <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-full text-sm font-medium text-white transition-colors">
            <Plus size={18} /> Nova Playlist
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-gradient-to-br from-indigo-900/50 to-zinc-900 border border-zinc-800 rounded-lg flex flex-col gap-4 group cursor-pointer hover:border-zinc-600 transition-colors">
            <div className="w-12 h-12 bg-indigo-500 rounded-md flex items-center justify-center shadow-lg">
              <Heart size={24} className="fill-white text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">Músicas curtidas</h3>
              <p className="text-sm text-zinc-400 mt-1">
                Sua coleção de faixas favoritas sincronizadas com o backend.
              </p>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-emerald-900/50 to-zinc-900 border border-zinc-800 rounded-lg flex flex-col gap-4 group cursor-pointer hover:border-zinc-600 transition-colors">
            <div className="w-12 h-12 bg-emerald-500 rounded-md flex items-center justify-center shadow-lg">
              <ListMusic size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">Playlists salvas</h3>
              <p className="text-sm text-zinc-400 mt-1">
                Lê e grava dados estruturados em listas vindas da sua aplicação.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <h2 className="text-2xl font-bold text-white">Adicionadas recentemente</h2>

          {isLoading ? (
              <p className="text-zinc-400">Sincronizando com a biblioteca...</p>
          ) : recentMusics.length === 0 ? (
              <p className="text-zinc-400">Sua biblioteca está vazia.</p>
          ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {recentMusics.map((music) => {
                  const capaUrl = music.album?.capa_url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300&h=300";
                  const titulo = music.title || music.titulo || "Desconhecido";
                  const artistaNome = typeof music.artist === 'object'
                      ? (music.artist?.nome || music.artist?.name)
                      : (music.artist || music.artista?.nome || music.artista || "Desconhecido");

                  return (
                      <Link
                          href={`/album/${music.id}`}
                          key={music.id}
                          className="flex flex-col gap-2 group cursor-pointer"
                      >
                        <div className="w-full aspect-square bg-zinc-800 rounded-md overflow-hidden relative shadow-lg">
                          <img
                              src={capaUrl}
                              alt={`Capa de ${titulo}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
                              <Play size={24} className="ml-1 fill-white" />
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col mt-1">
                          <strong className="text-white font-medium truncate" title={titulo}>{titulo}</strong>
                          <span className="text-zinc-400 text-sm truncate" title={artistaNome}>{artistaNome}</span>
                        </div>
                      </Link>
                  );
                })}
              </div>
          )}
        </div>
      </div>
  );
}