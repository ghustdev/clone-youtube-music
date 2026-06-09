"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Importe o router do Next.js
import {
  Play,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  ChevronDown,
} from "lucide-react";

export default function NowPlaying() {
  const router = useRouter(); // Inicialize o router
  const [activeTab, setActiveTab] = useState<"queue" | "lyrics">("queue");

  // Fila simulada
  const queue = [
    {
      id: 1,
      title: "Smells Like Teen Spirit",
      artist: "Nirvana",
      duration: "5:01",
    },
    { id: 2, title: "In The End", artist: "Linkin Park", duration: "3:36" },
    {
      id: 3,
      title: "Chop Suey!",
      artist: "System Of A Down",
      duration: "3:30",
    },
    { id: 4, title: "Numb", artist: "Linkin Park", duration: "3:07" },
    {
      id: 5,
      title: "Bring Me To Life",
      artist: "Evanescence",
      duration: "3:55",
    },
  ];

  return (
    // Adicionei um 'relative' e um 'pt-12' no container principal para dar espaço ao botão
    <div className="relative flex flex-col lg:flex-row gap-10 h-full max-w-7xl mx-auto pt-12 lg:pt-0">
      {/* Botão de Minimizar / Voltar absoluto no topo esquerdo */}
      <button
        onClick={() => router.back()}
        className="absolute top-0 left-0 lg:top-4 p-2 text-zinc-400 hover:text-white transition-colors bg-zinc-900/50 hover:bg-zinc-800 rounded-full"
        title="Minimizar player"
      >
        <ChevronDown size={32} />
      </button>

      {/* Lado Esquerdo: Player Principal */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="w-full max-w-md aspect-square bg-zinc-800 rounded-md shadow-2xl overflow-hidden mt-4 lg:mt-0">
          <img
            src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=600&h=600"
            alt="Capa do Álbum"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full max-w-md flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h1 className="text-3xl font-extrabold text-white">
                Música Selecionada
              </h1>
              <span className="text-lg text-zinc-400">
                Banda / Artista • Álbum
              </span>
            </div>
            <div className="flex items-center gap-4">
              <ThumbsDown
                size={24}
                className="text-zinc-400 cursor-pointer hover:text-white transition-colors"
              />
              <ThumbsUp
                size={24}
                className="text-zinc-400 cursor-pointer hover:text-white transition-colors"
              />
              <MoreVertical
                size={24}
                className="text-zinc-400 cursor-pointer hover:text-white transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="h-1.5 rounded-full w-full bg-zinc-700 cursor-pointer relative group">
              <div className="bg-red-500 w-1/3 h-full rounded-full absolute top-0 left-0"></div>
              <div className="absolute left-1/3 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"></div>
            </div>
            <div className="flex justify-between text-sm text-zinc-400 font-medium">
              <span>1:23</span>
              <span>3:45</span>
            </div>
          </div>

          <div className="flex justify-between items-center px-4">
            <Shuffle
              size={24}
              className="text-zinc-400 cursor-pointer hover:text-white transition-colors"
            />
            <SkipBack
              size={36}
              className="text-zinc-200 cursor-pointer hover:text-white transition-colors"
            />
            <button className="w-20 h-20 flex items-center justify-center bg-white rounded-full text-black hover:scale-105 transition-transform shadow-xl">
              <Play className="fill-black ml-1" size={32} />
            </button>
            <SkipForward
              size={36}
              className="text-zinc-200 cursor-pointer hover:text-white transition-colors"
            />
            <Repeat
              size={24}
              className="text-zinc-400 cursor-pointer hover:text-white transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Lado Direito: Fila (Queue) e Letras */}
      <div className="w-full lg:w-[400px] flex flex-col bg-zinc-900/40 rounded-xl overflow-hidden border border-zinc-800/50 mt-8 lg:mt-0">
        <div className="flex justify-center gap-8 p-4 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab("queue")}
            className={`font-semibold pb-1 border-b-2 transition-colors ${activeTab === "queue" ? "border-white text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}
          >
            A seguir
          </button>
          <button
            onClick={() => setActiveTab("lyrics")}
            className={`font-semibold pb-1 border-b-2 transition-colors ${activeTab === "lyrics" ? "border-white text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}
          >
            Letras
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {activeTab === "queue" ? (
            <div className="flex flex-col gap-1">
              {queue.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center gap-3 p-2 hover:bg-zinc-800/50 rounded-md group transition-colors cursor-pointer"
                >
                  <div className="text-zinc-500 text-sm w-4 text-center group-hover:hidden">
                    {track.id}
                  </div>
                  <Play
                    size={14}
                    className="text-white hidden group-hover:block w-4 text-center"
                  />

                  <div className="w-10 h-10 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=100&h=100"
                      alt="Capa"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col flex-1 truncate">
                    <span className="text-white text-sm font-medium truncate">
                      {track.title}
                    </span>
                    <span className="text-zinc-400 text-xs truncate">
                      {track.artist}
                    </span>
                  </div>
                  <span className="text-zinc-500 text-xs">
                    {track.duration}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 flex flex-col items-center justify-center h-full">
              <p className="text-2xl font-bold leading-relaxed text-zinc-300">
                A letra desta música
                <br />
                ainda não está disponível
                <br />
                no seu backend Java.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
