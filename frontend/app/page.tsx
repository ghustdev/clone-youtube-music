import { Play } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const albums = [1, 2, 3, 4, 5];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Ouvir novamente</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {albums.map((id) => (
          <Link
            href={`/album/${id}`}
            key={id}
            className="flex flex-col gap-2 group cursor-pointer"
          >
            <div key={id} className="flex flex-col gap-2 group cursor-pointer">
              <div className="w-full aspect-square bg-zinc-800 rounded-md overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300&h=300"
                  alt="Capa do Álbum"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute bottom-3 right-3 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg transform translate-y-2 group-hover:translate-y-0">
                  <Play className="fill-black text-black" size={20} />
                </button>
              </div>
              <strong className="text-sm font-medium leading-tight">
                Álbum Recomendado {id}
              </strong>
              <span className="text-xs text-zinc-400">Gênero / Playlist</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
