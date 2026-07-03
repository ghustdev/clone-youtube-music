"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Link as LinkIcon,
  AlertCircle,
} from "lucide-react";
import { musicaService, Musica } from "@/services/musicaService";

export default function Admin() {
  const [musicas, setMusicas] = useState<Musica[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Busca os dados do Java assim que a tela carrega
  useEffect(() => {
    carregarMusicas();
  }, []);

  const carregarMusicas = async () => {
    try {
      setLoading(true);
      const dados = await musicaService.listar();
      console.log(dados);
      setMusicas(dados);
      setErro(null);
    } catch (error) {
      console.error("Erro ao buscar do Java:", error);
      setErro(
        "Não foi possível conectar ao servidor. Verifique se o Spring Boot está rodando.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeletar = async (id?: number) => {
    if (!id) return;

    if (confirm("Tem certeza que deseja excluir esta música?")) {
      try {
        await musicaService.deletar(id);
        // Atualiza a lista na tela removendo a música deletada
        setMusicas(musicas.filter((m) => m.id !== id));
      } catch (error) {
        alert("Erro ao excluir a música.");
      }
    }
  };

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

      {/* Tratamento de Exceções Visual (Requisito do Trabalho) */}
      {erro && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-md flex items-center gap-3">
          <AlertCircle size={20} />
          <p>{erro}</p>
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-[2fr_2fr_3fr_100px] gap-4 px-6 py-4 bg-zinc-950/50 border-b border-zinc-800 text-sm font-semibold text-zinc-400">
          <span>Título</span>
          <span>Artista</span>
          <span>Link YouTube</span>
          <span className="text-right">Ações</span>
        </div>

        <div className="flex flex-col relative min-h-[100px]">
          {loading ? (
            <div className="flex justify-center items-center p-8 text-zinc-500">
              Carregando dados do servidor...
            </div>
          ) : (
            musicas.map((musica) => (
              <div
                key={musica.id}
                className="grid grid-cols-[2fr_2fr_3fr_100px] gap-4 px-6 py-4 items-center border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors text-sm"
              >
                <span className="font-medium text-white">{musica.title}</span>
                <span className="text-zinc-400">{musica.artist}</span>
                <span className="text-zinc-500 flex items-center gap-2 truncate">
                  <LinkIcon size={14} /> {musica.youtubeUrl}
                </span>
                <div className="flex items-center justify-end gap-3">
                  <button
                    className="text-zinc-400 hover:text-white transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeletar(musica.id)}
                    className="text-zinc-400 hover:text-red-500 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
