import { Music2, BarChart2, Smile } from "lucide-react";

export default function Explore() {
  const categories = [
    { label: "Lançamentos", icon: Music2, color: "bg-emerald-600" },
    { label: "Paradas", icon: BarChart2, color: "bg-sky-600" },
    { label: "Vibe e humor", icon: Smile, color: "bg-amber-600" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Explorar</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <div
              key={i}
              className={`p-4 h-24 rounded-lg ${cat.color} flex items-center justify-between cursor-pointer hover:brightness-110 transition-all`}
            >
              <span className="font-bold text-lg">{cat.label}</span>
              <Icon size={32} className="opacity-80" />
            </div>
          );
        })}
      </div>

      <h2 className="text-2xl font-bold mt-4">Novos lançamentos</h2>
      <div className="bg-zinc-900/50 p-4 rounded-md border border-zinc-800 text-zinc-400 text-sm">
        [Aqui você pode listar as últimas músicas inseridas no banco de dados
        via Java]
      </div>
    </div>
  );
}
