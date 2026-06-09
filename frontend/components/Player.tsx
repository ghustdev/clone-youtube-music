"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Play,
  SkipBack,
  SkipForward,
  Maximize2,
  Minimize2,
  Volume2,
} from "lucide-react";

export default function Player() {
  const pathname = usePathname();
  const router = useRouter();

  // Verifica se o usuário já está na tela cheia
  const isNowPlaying = pathname === "/now-playing";

  return (
    <footer className="h-24 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between px-6 z-10">
      {/* Informações da Música */}
      <div className="flex items-center gap-4 w-1/3">
        <div className="w-12 h-12 bg-zinc-800 rounded md:block hidden">
          <img
            src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=60&h=60"
            alt="Capa"
            className="w-full h-full object-cover rounded"
          />
        </div>
        <div>
          <strong className="block text-sm font-normal">
            Música Selecionada
          </strong>
          <span className="text-xs text-zinc-400">Artista / Álbum</span>
        </div>
      </div>

      {/* Controles de Reprodução */}
      <div className="flex flex-col items-center gap-2 w-1/3">
        <div className="flex items-center gap-6">
          <SkipBack
            size={24}
            className="text-zinc-200 cursor-pointer hover:text-white"
          />
          <button className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-black hover:scale-105 transition-transform">
            <Play className="fill-black ml-1" size={20} />
          </button>
          <SkipForward
            size={24}
            className="text-zinc-200 cursor-pointer hover:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full max-w-md">
          <span className="text-xs text-zinc-400">1:23</span>
          <div className="h-1 rounded-full w-full bg-zinc-600 cursor-pointer relative group">
            <div className="bg-red-500 w-1/3 h-full rounded-full absolute top-0 left-0"></div>
          </div>
          <span className="text-xs text-zinc-400">3:45</span>
        </div>
      </div>

      {/* Volume / Extras */}
      <div className="w-1/3 flex justify-end items-center gap-4">
        <Volume2
          size={20}
          className="text-zinc-400 cursor-pointer hover:text-white transition-colors"
        />
        <div className="w-24 h-1 bg-zinc-600 rounded-full cursor-pointer hidden md:block">
          <div className="bg-zinc-400 w-2/3 h-full rounded-full"></div>
        </div>

        {/* Controle Inteligente: Maximizar ou Minimizar */}
        {isNowPlaying ? (
          <button
            onClick={() => router.back()}
            className="ml-4 text-zinc-400 hover:text-white transition-colors"
            title="Minimizar"
          >
            <Minimize2 size={20} />
          </button>
        ) : (
          <Link
            href="/now-playing"
            className="ml-4 text-zinc-400 hover:text-white transition-colors"
            title="Tela Cheia"
          >
            <Maximize2 size={20} />
          </Link>
        )}
      </div>
    </footer>
  );
}
