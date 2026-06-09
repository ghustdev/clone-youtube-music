"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  Library,
  Play,
  Search,
  History,
  Settings,
  LogIn,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/", label: "Início", icon: Home },
    { href: "/explore", label: "Explorar", icon: Compass },
    { href: "/search", label: "Buscar", icon: Search },
    { href: "/library", label: "Biblioteca", icon: Library },
    { href: "/history", label: "Histórico", icon: History },
  ];

  const adminItems = [
    { href: "/admin", label: "Painel Admin", icon: Settings },
    { href: "/auth", label: "Login / Sair", icon: LogIn },
  ];

  return (
    <aside className="w-64 bg-black p-6 flex flex-col gap-6 hidden md:flex border-r border-zinc-900 justify-between">
      <div>
        <div className="flex items-center gap-2 mb-8">
          <Play className="text-red-500 fill-red-500" size={28} />
          <span className="text-xl font-bold tracking-tighter">Music</span>
        </div>

        <nav className="flex flex-col gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 text-sm font-medium transition-colors ${isActive ? "text-white font-semibold" : "text-zinc-400 hover:text-white"}`}
              >
                <Icon
                  size={24}
                  className={isActive ? "text-white" : "text-zinc-400"}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <nav className="flex flex-col gap-4 border-t border-zinc-900 pt-4">
        {adminItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 text-sm font-medium transition-colors ${isActive ? "text-white font-semibold" : "text-zinc-400 hover:text-white"}`}
            >
              <Icon
                size={20}
                className={isActive ? "text-white" : "text-zinc-400"}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
