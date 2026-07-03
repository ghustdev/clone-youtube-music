"use client";

import { Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { musicaService, Musica } from "@/services/musicaService";

export default function Home() {
    const [musics, setMusics] = useState<Musica[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        musicaService.listar()
            .then((data) => {
                setMusics(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Erro ao buscar do Java:", error);
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="flex flex-col gap-6 p-8">
            <h1 className="text-3xl font-bold tracking-tight">Ouvir novamente</h1>

            {isLoading ? (
                <p className="text-zinc-400">Carregando músicas...</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {musics.length === 0 ? (
                        <p className="text-zinc-400">Nenhuma música encontrada no banco de dados.</p>
                    ) : (
                        musics.map((music) => {
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
                                    <div className="flex flex-col gap-2 group cursor-pointer">
                                        <div className="w-full aspect-square bg-zinc-800 rounded-md overflow-hidden relative">
                                            <img
                                                src={capaUrl}
                                                alt={`Capa do Álbum ${titulo}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <button className="absolute bottom-3 right-3 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg transform translate-y-2 group-hover:translate-y-0">
                                                <Play className="fill-black text-black ml-1" size={20} />
                                            </button>
                                        </div>
                                        <strong className="text-sm font-medium leading-tight truncate" title={titulo}>
                                            {titulo}
                                        </strong>
                                        <span className="text-xs text-zinc-400 truncate" title={artistaNome}>
                      {artistaNome}
                    </span>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}