"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Plus, Heart, Music as MusicIcon, Play, X } from "lucide-react";
import { authService } from "@/services/authService";
import { Musica } from "@/services/musicaService";
import { playlistService, Playlist } from "@/services/playlistService";
import Link from "next/link";

export default function Library() {
  const router = useRouter();
  const isAuthenticated = useSyncExternalStore(
      authService.subscribeAuthChanges,
      authService.getAuthSnapshot,
      () => false,
  );

  const [likedMusics, setLikedMusics] = useState<Musica[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para criação de playlist
  const [criando, setCriando] = useState(false);
  const [novoNome, setNovoNome] = useState("");

  const carregarDados = async () => {
    setIsLoading(true);
    try {
      const savedLikes = JSON.parse(localStorage.getItem("@musicapp:likes") || "[]");
      setLikedMusics(savedLikes);

      const data = await playlistService.listar();
      setPlaylists(data);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth");
    } else {
      carregarDados();
    }
  }, [isAuthenticated, router]);

  const handleCriarPlaylist = async () => {
    if (!novoNome.trim()) return;
    try {
      await playlistService.criar(novoNome);
      setNovoNome("");
      setCriando(false);
      carregarDados(); // Recarrega a lista após criar
    } catch (err) {
      console.error("Erro ao criar playlist:", err);
      alert("Não foi possível criar a playlist. Verifique se o servidor está rodando.");
    }
  };

  if (!isAuthenticated) return null;

  return (
      <div className="flex flex-col gap-8 pb-32 p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-white">Sua Biblioteca</h1>
          <button
              onClick={() => setCriando(!criando)}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            {criando ? <X size={18} /> : <Plus size={18} />}
            {criando ? "Cancelar" : "Nova Playlist"}
          </button>
        </div>

        {/* Formulário de Criação */}
        {criando && (
            <div className="flex gap-2 p-4 bg-zinc-900 border border-zinc-800 rounded-lg animate-in fade-in zoom-in duration-200">
              <input
                  autoFocus
                  placeholder="Nome da playlist"
                  className="bg-zinc-800 text-white p-2 rounded flex-1 outline-none border border-zinc-700 focus:border-white"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCriarPlaylist()}
              />
              <button
                  onClick={handleCriarPlaylist}
                  className="bg-white text-black px-4 py-2 rounded font-bold hover:bg-zinc-200 transition-colors"
              >
                Salvar
              </button>
            </div>
        )}

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
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                  {likedMusics.map((music) => {
                    const capaUrl = music.album?.capa_url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=150&h=150";
                    const titulo = music.title || music.titulo || "Desconhecido";
                    const artistaNome = typeof music.artist === 'object'
                        ? (music.artist?.nome || music.artist?.name || "Artista")
                        : (music.artist || "Artista");

                    return (
                        <Link href={`/album/${music.id}`} key={music.id}>
                          <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-3 rounded-lg hover:bg-zinc-800 transition-colors group cursor-pointer">
                            <div className="w-16 h-16 bg-zinc-800 rounded relative overflow-hidden flex-shrink-0">
                              <img src={capaUrl} alt={titulo} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
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

          {/* SEÇÃO 2: PLAYLISTS REAIS */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-zinc-800 rounded-lg shadow-lg">
                <MusicIcon size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Suas Playlists</h2>
              </div>
            </div>

            {isLoading ? (
                <p className="text-zinc-400">Carregando playlists...</p>
            ) : playlists.length === 0 ? (
                <div className="p-8 border border-dashed border-zinc-700 rounded-lg text-center mt-2 bg-zinc-900/30">
                  <p className="text-zinc-400">Nenhuma playlist criada ainda.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {playlists.map((pl) => (
                      <Link href={`/playlist/${pl.id}`} key={pl.id} className="group">
                        <div className="bg-zinc-900 p-4 rounded-lg hover:bg-zinc-800 transition-colors">
                          <img src={pl.capa_url || "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=200"} className="w-full aspect-square object-cover rounded-md mb-3" alt={pl.nome || "Playlist"} />
                          <h3 className="font-bold text-white truncate">{pl.nome || pl.name}</h3>
                          <p className="text-sm text-zinc-400">Playlist</p>
                        </div>
                      </Link>
                  ))}
                </div>
            )}
          </div>
        </div>
      </div>
  );
}
