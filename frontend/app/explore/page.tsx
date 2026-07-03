"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Music, BarChart2, Smile } from "lucide-react";

export default function Explore() {
  // O <any[]> resolve aquele erro do "type never" da sua print!
  const [musics, setMusics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Busca as músicas do seu backend Java
    fetch("http://localhost:8080/api/musics")
      .then((response) => response.json())
      .then((data) => {
        // Usamos .reverse() para simular que as últimas adicionadas no banco
        // são os "Novos Lançamentos" (aparecem primeiro na lista)
        setMusics(data.reverse());
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar músicas:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col gap-8 p-8 pb-32">
      <h1 className="text-3xl font-bold text-white">Explorar</h1>

      {/* Botões Superiores - Mantemos o design igual ao da sua print */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-emerald-600 hover:bg-emerald-500 transition-colors rounded-lg p-6 flex items-center justify-between group cursor-pointer border-none text-left">
          <span className="text-xl font-bold text-white">Lançamentos</span>
          <Music size={28} className="text-emerald-300 opacity-50 group-hover:opacity-100 transition-opacity" />
        </button>

        <button className="bg-blue-600 hover:bg-blue-500 transition-colors rounded-lg p-6 flex items-center justify-between group cursor-pointer border-none text-left">
          <span className="text-xl font-bold text-white">Paradas</span>
          <BarChart2 size={28} className="text-blue-300 opacity-50 group-hover:opacity-100 transition-opacity" />
        </button>

        <button className="bg-orange-600 hover:bg-orange-500 transition-colors rounded-lg p-6 flex items-center justify-between group cursor-pointer border-none text-left">
          <span className="text-xl font-bold text-white">Vibe e humor</span>
          <Smile size={28} className="text-orange-300 opacity-50 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Seção de Novos Lançamentos puxando do Java */}
      <div className="flex flex-col gap-4 mt-4">
        <h2 className="text-2xl font-bold text-white">Novos lançamentos</h2>
        
        {isLoading ? (
          <p className="text-zinc-400">Carregando músicas do banco de dados...</p>
        ) : musics.length === 0 ? (
          <p className="text-zinc-400">Nenhuma música encontrada no banco de dados.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {musics.map((music) => (
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
                  {/* Ícone de play que aparece no hover (detalhe profissional) */}
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