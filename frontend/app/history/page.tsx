import { Clock, Play } from "lucide-react";

export default function History() {
  const historyTracks = [
    {
      id: 1,
      title: "Can't Stop",
      artist: "Red Hot Chili Peppers",
      playedAt: "Hoje, 14:30",
    },
    {
      id: 2,
      title: "Everlong",
      artist: "Foo Fighters",
      playedAt: "Hoje, 10:15",
    },
    { id: 3, title: "Come As You Are", artist: "Nirvana", playedAt: "Ontem" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4 border-b border-zinc-800 pb-4">
        <Clock className="text-white" size={32} />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Histórico</h1>
          <p className="text-zinc-400 mt-1">
            Músicas que você ouviu recentemente.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        {historyTracks.map((track) => (
          <div
            key={track.id}
            className="flex items-center gap-4 p-3 hover:bg-zinc-800/50 rounded-md group transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 bg-zinc-800 rounded relative overflow-hidden flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=100&h=100"
                alt="Capa"
                className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
              />
              <Play
                size={20}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white hidden group-hover:block"
              />
            </div>

            <div className="flex flex-col flex-1">
              <span className="text-white font-medium">{track.title}</span>
              <span className="text-zinc-400 text-sm">{track.artist}</span>
            </div>

            <span className="text-zinc-500 text-sm">{track.playedAt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
