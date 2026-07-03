"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search as SearchIcon, Music } from "lucide-react";

export default function Search() {
  const [musics, setMusics] = useState<any[]>([]);
  // Estado para guardar o que o usuário está digitando
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Busca TODAS as músicas do banco Java apenas uma vez ao carregar a página
    fetch("http://localhost:8080/api/musics")
      .then((response) => response.json())
      .then((data) => {
        setMusics(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar músicas:", error);
        setIsLoading(false);
      });
  }, []);

  // A MÁGICA DA BUSCA ACONTECE AQUI:
  // Filtramos o array original baseado no texto digitado
  const filteredMusics = musics.filter((music) => {
    // Se a barra de busca estiver vazia, não mostra nada (ou mude para true para mostrar todas)
    if (searchQuery.trim() === "") return true; 

    const termo = searchQuery.toLowerCase();
    const titulo = music.title ? music.title.toLowerCase() : "";
    const artista = music.artist ? music.artist.toLowerCase() : "";

    // Retorna a música se o termo digitado estiver no título OU no artista
    return titulo.includes(termo) || artista.includes(termo);
  });

  return (
    <div className="flex flex-col gap-8 p-8 pb-32">
      
      {/* Barra de Busca Gigante */}
      <div className="relative max-w-2xl mt-4">
        <SearchIcon 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400" 
          size={24} 
        />
        <input
          type="text"
          placeholder="O que você quer ouvir?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-900 text-white pl-12 pr-4 py-4 rounded-full border border-zinc-700 focus:outline-none focus:border-white transition-colors text-lg"
        />
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <p className="text-zinc-400 font-medium">Conectando ao servidor...</p>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white mb-2">
              {searchQuery ? "Resultados da busca" : "Navegar por tudo"}
            </h2>
            
            {filteredMusics.length === 0 ? (
              <p className="text-zinc-400">
                Nenhuma música ou artista encontrado para "{searchQuery}".
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {filteredMusics.map((music) => (
                  <Link 
                    href={`/album/${music.id}`} 
                    key={music.id}
                    className="flex flex-col gap-2 group cursor-pointer"
                  >
                    <div className="w-full aspect-square bg-zinc-800 rounded-md overflow-hidden relative shadow-lg">
                      <img
                        src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300&h=300"
                        alt={music.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          <Music size={24} className="ml-1" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col mt-1">
                      <strong className="text-white font-medium truncate">{music.title}</strong>
                      <span className="text-zinc-400 text-sm truncate">{music.artist}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}