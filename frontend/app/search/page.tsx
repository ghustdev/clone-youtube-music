"use client";

import { useEffect, useState } from "react";
import { Search as SearchIcon, Play } from "lucide-react";
import { musicaService, Musica } from "@/services/musicaService";

export default function Search() {
  const [query, setQuery] = useState("");

  const [musicas, setMusicas] = useState<Musica[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Atualiza os resultados sempre que o termo de busca mudar
  useEffect(() => {
    if (!query.trim()) {
      setMusicas([]);
      setErro(null);
      setLoading(false);
      return;
    }

    carregarMusicas();
  }, [query]);

  const carregarMusicas = async () => {
    try {
      setLoading(true);
      const dados = await musicaService.search(query);
      console.log(dados);
      setMusicas(dados);
      setErro(null);
    } catch (error) {
      console.error("Erro ao buscar do Java:", error);
      setErro(
        "Não foi possível conectar ao servidor. Verifique se o Spring Boot está rodando.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Barra de Pesquisa */}
      <div className="relative max-w-xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="text-zinc-400" size={20} />
        </div>
        <input
          type="text"
          className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-zinc-400 transition-all"
          placeholder="Músicas, álbuns ou artistas"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Resultados da Pesquisa */}
      {query && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-4">
            Principais resultados para "{query}"
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {musicas.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 group cursor-pointer bg-zinc-900/50 p-4 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <div className="w-full aspect-square bg-zinc-800 rounded-md overflow-hidden relative mb-2">
                  <img
                    src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300&h=300"
                    alt="Capa"
                    className="w-full h-full object-cover"
                  />
                  <button className="absolute bottom-2 right-2 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="fill-black text-black" size={20} />
                  </button>
                </div>
                <strong className="text-sm font-medium">
                  Resultado Encontrado {item.title}
                </strong>
                <span className="text-xs text-zinc-400">Música • Artista</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
