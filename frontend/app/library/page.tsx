import { Plus } from "lucide-react";

export default function Library() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Biblioteca</h1>
        <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-full text-sm font-medium transition-colors">
          <Plus size={18} /> Nova Playlist
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg flex flex-col gap-2">
          <h3 className="font-semibold text-lg">Músicas curtidas</h3>
          <p className="text-sm text-zinc-400">
            Sua coleção de faixas favoritas sincronizadas com o backend.
          </p>
        </div>

        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg flex flex-col gap-2">
          <h3 className="font-semibold text-lg">Playlists salvas</h3>
          <p className="text-sm text-zinc-400">
            Lê e grava dados estruturados em listas vindas da sua aplicação.
          </p>
        </div>
      </div>
    </div>
  );
}
