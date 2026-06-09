"use client";

import { Plus, Edit2, Trash2, Link as LinkIcon } from "lucide-react";

export default function Admin() {
  // Simulação de dados vindos do backend Java
  const mockMusicas = [
    {
      id: 1,
      titulo: "Música Exemplo 1",
      artista: "Artista A",
      url: "youtube.com/watch?v=1",
    },
    {
      id: 2,
      titulo: "Música Exemplo 2",
      artista: "Artista B",
      url: "youtube.com/watch?v=2",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-red-500">
            Painel do Administrador
          </h1>
          <p className="text-zinc-400 mt-1">
            Gerenciamento do catálogo musical (CRUD)
          </p>
        </div>
        <button className="flex items-center gap-2 bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-full text-sm font-bold transition-colors">
          <Plus size={18} /> Nova Música
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-[2fr_2fr_3fr_100px] gap-4 px-6 py-4 bg-zinc-950/50 border-b border-zinc-800 text-sm font-semibold text-zinc-400">
          <span>Título</span>
          <span>Artista</span>
          <span>Link YouTube</span>
          <span className="text-right">Ações</span>
        </div>

        <div className="flex flex-col">
          {mockMusicas.map((musica) => (
            <div
              key={musica.id}
              className="grid grid-cols-[2fr_2fr_3fr_100px] gap-4 px-6 py-4 items-center border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors text-sm"
            >
              <span className="font-medium text-white">{musica.titulo}</span>
              <span className="text-zinc-400">{musica.artista}</span>
              <span className="text-zinc-500 flex items-center gap-2 truncate">
                <LinkIcon size={14} /> {musica.url}
              </span>
              <div className="flex items-center justify-end gap-3">
                <button
                  className="text-zinc-400 hover:text-white transition-colors"
                  title="Editar"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  className="text-zinc-400 hover:text-red-500 transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
