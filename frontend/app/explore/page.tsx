"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Music, Guitar, Headphones } from "lucide-react"; // Troquei alguns ícones para combinar com os gêneros

export default function Explore() {
  const [musics, setMusics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // NOVO: Estado para guardar qual gênero está selecionado
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/musics")
      .then((response) => response.json())
      .then((data) => {
        setMusics(data.reverse());
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar músicas:", error);
        setIsLoading(false);
      });
  }, []);

  // NOVO: Função para alternar o filtro. Se clicar no gênero já selecionado, ele desmarca (mostra tudo).
  const toggleGenre = (genre: string) => {
    setSelectedGenre(selectedGenre === genre ? null : genre);
  };

  // NOVO: Lógica que filtra as músicas. 
  // DICA: Substitua `music.genre` pelo nome exato do campo que vem do seu Java (ex: music.genero, music.categoria)
  const filteredMusics = selectedGenre
    ? musics.filter((music) => music.genre === selectedGenre || music.genero === selectedGenre)
    : musics;

  return (
    <div className="flex flex-col gap-8 p-8 pb-32">
      <h1 className="text-3xl font-bold text-white">Explorar</h1>

      {/* Botões de Gêneros Musicais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => toggleGenre("Rock")}
          className={`bg-emerald-600 hover:bg-emerald-500 transition-all rounded-lg p-6 flex items-center justify-between group cursor-pointer border-none text-left ${selectedGenre === "Rock" ? "ring-4 ring-white scale-105" : ""}`}
        >
          <span className="text-xl font-bold text-white">Rock</span>
          <Guitar size={28} className="text-emerald-300 opacity-50 group-hover:opacity-100 transition-opacity" />
        </button>

        <button 
          onClick={() => toggleGenre("Pop")}
          className={`bg-blue-600 hover:bg-blue-500 transition-all rounded-lg p-6 flex items-center justify-between group cursor-pointer border-none text-left ${selectedGenre === "Pop" ? "ring-4 ring-white scale-105" : ""}`}
        >
          <span className="text-xl font-bold text-white">Pop</span>
          <Music size={28} className="text-blue-300 opacity-50 group-hover:opacity-100 transition-opacity" />
        </button>

        <button 
          onClick={() => toggleGenre("Eletrônica")}
          className={`bg-orange-600 hover:bg-orange-500 transition-all rounded-lg p-6 flex items-center justify-between group cursor-pointer border-none text-left ${selectedGenre === "Eletrônica" ? "ring-4 ring-white scale-105" : ""}`}
        >
          <span className="text-xl font-bold text-white">Eletrônica</span>
          <Headphones size={28} className="text-orange-300 opacity-50 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Seção de Músicas */}
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {selectedGenre ? `Explorando: ${selectedGenre}` : "Novos lançamentos"}
          </h2>
          {selectedGenre && (
            <button 
              onClick={() => setSelectedGenre(null)}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Limpar filtro
            </button>
          )}
        </div>
        
        {isLoading ? (
          <p className="text-zinc-400">Carregando músicas do banco de dados...</p>
        ) : filteredMusics.length === 0 ? (
          <p className="text-zinc-400">
            {selectedGenre 
              ? `Nenhuma música de ${selectedGenre} encontrada.` 
              : "Nenhuma música encontrada no banco de dados."}
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredMusics.map((music) => (
              <Link 
                href={`/album/${music.id}`} 
                key={music.id}
                className="flex flex-col gap-2 group cursor-pointer"
              >
                <div className="w-full aspect-square bg-zinc-800 rounded-md overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300&h=300"
                    alt={music.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-xl">
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
      </div>
    </div>
  );
}