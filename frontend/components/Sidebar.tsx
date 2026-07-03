"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Compass,
  Library,
  Play,
  Search,
  Settings,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import { authService } from "@/services/authService";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const userSnapshot = useSyncExternalStore(
    authService.subscribeAuthChanges,
    authService.getUserSnapshot,
    () => null,
  );

  const usuario = useMemo(() => {
    if (!userSnapshot) return null;

    try {
      return JSON.parse(userSnapshot) as { name?: string; isAdmin?: boolean };
    } catch {
      return null;
    }
  }, [userSnapshot]);

  const isLogado = !!userSnapshot;
  const isAdmin = !!usuario?.isAdmin;
  const nomeUsuario = usuario?.name ?? "Usuário Logado";

  const handleLogout = () => {
    authService.logout();
    router.push("/auth");
  };

  const menuItems = [
    { href: "/", label: "Início", icon: Home },
    { href: "/explore", label: "Explorar", icon: Compass },
    { href: "/search", label: "Buscar", icon: Search },
    { href: "/library", label: "Biblioteca", icon: Library },
  ];

  const visibleMenuItems = menuItems.filter((item) => {
    if (item.href === "/library") {
      return isLogado;
    }

    return true;
  });
  return (
    <aside className="w-64 bg-black p-6 flex flex-col gap-6 hidden md:flex border-r border-zinc-900 justify-between">
      <div>
        <div className="flex items-center gap-2 mb-8">
          <Play className="text-red-500 fill-red-500" size={28} />
          <span className="text-xl font-bold tracking-tighter">Music</span>
        </div>

        <nav className="flex flex-col gap-4">
          {visibleMenuItems.map((item) => {
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

      <div className="flex flex-col gap-4 border-t border-zinc-900 pt-4">
        {isLogado && isAdmin && (
          <Link
            href="/admin"
            className={`flex items-center gap-4 text-sm font-medium transition-colors ${pathname === "/admin" ? "text-white font-semibold" : "text-zinc-400 hover:text-white"}`}
          >
            <Settings
              size={20}
              className={pathname === "/admin" ? "text-white" : "text-zinc-400"}
            />
            Painel Admin
          </Link>
        )}

        {/* Caixinha Dinâmica de Perfil / Login */}
        {isLogado ? (
          <div className="flex items-center justify-between bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 mt-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-zinc-400" />
              </div>
              <span
                className="text-sm font-medium text-white truncate w-24"
                title={nomeUsuario}
              >
                {nomeUsuario}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-zinc-400 hover:text-red-500 transition-colors p-1"
              title="Sair da conta"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link
            href="/auth"
            className={`flex items-center gap-4 text-sm font-medium transition-colors mt-2 ${pathname === "/auth" ? "text-white font-semibold" : "text-zinc-400 hover:text-white"}`}
          >
            <LogIn
              size={20}
              className={pathname === "/auth" ? "text-white" : "text-zinc-400"}
            />
            Fazer Login
          </Link>
        )}
      </div>
    </aside>
  );
}
