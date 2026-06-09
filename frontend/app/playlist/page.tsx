import { Play, Clock, MoreVertical, Heart } from "lucide-react";

export default function Playlist() {
  // Lista de músicas simulando objetos lidos do backend
  const tracks = [
    {
      id: 1,
      title: "Bohemian Rhapsody",
      artist: "Queen",
      album: "A Night at the Opera",
      duration: "5:55",
    },
    {
      id: 2,
      title: "Hotel California",
      artist: "Eagles",
      album: "Hotel California",
      duration: "6:30",
    },
    {
      id: 3,
      title: "Stairway to Heaven",
      artist: "Led Zeppelin",
      album: "Led Zeppelin IV",
      duration: "8:02",
    },
    {
      id: 4,
      title: "Sweet Child O' Mine",
      artist: "Guns N' Roses",
      album: "Appetite for Destruction",
      duration: "5:56",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Cabeçalho da Playlist */}
      <div className="flex items-end gap-6 mt-4">
        <img
          src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300&h=300"
          alt="Capa da Playlist"
          className="w-48 h-48 shadow-2xl rounded-md"
        />
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium uppercase tracking-wider text-zinc-400">
            Playlist
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight">
            Rock Classics
          </h1>
          <p className="text-zinc-400 mt-2">
            As melhores do rock clássico. • 4 músicas, 26 minutos
          </p>

          <div className="flex items-center gap-4 mt-4">
            <button className="bg-white text-black px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform">
              <Play className="fill-black" size={20} />
              Tocar
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-600 text-zinc-300 hover:text-white hover:border-white transition-colors">
              <Heart size={20} />
            </button>
            <MoreVertical className="text-zinc-400 cursor-pointer hover:text-white" />
          </div>
        </div>
      </div>

      {/* Tabela de Músicas (Lista) */}
      <div className="mt-6 flex flex-col">
        {/* Cabeçalho da Tabela */}
        <div className="grid grid-cols-[16px_4fr_3fr_minmax(120px,1fr)] gap-4 px-4 py-2 border-b border-zinc-800 text-sm text-zinc-400">
          <span>#</span>
          <span>Título</span>
          <span>Álbum</span>
          <div className="flex justify-end">
            <Clock size={16} />
          </div>
        </div>

        {/* Linhas da Tabela */}
        <div className="flex flex-col mt-2">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              className="grid grid-cols-[16px_4fr_3fr_minmax(120px,1fr)] gap-4 px-4 py-3 hover:bg-zinc-800/50 rounded-md group text-sm items-center transition-colors cursor-pointer"
            >
              <span className="text-zinc-400 group-hover:hidden">
                {index + 1}
              </span>
              <Play size={16} className="text-white hidden group-hover:block" />

              <div className="flex flex-col">
                <span className="text-white font-medium">{track.title}</span>
                <span className="text-zinc-400 text-xs">{track.artist}</span>
              </div>

              <span className="text-zinc-400 truncate">{track.album}</span>
              <span className="text-zinc-400 text-right">{track.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
