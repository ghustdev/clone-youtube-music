// services/musicaService.ts
import { api } from "./api";

export interface Musica {
  id: number;
  album: {
    id?: number;
    titulo?: string;
    title?: string;
    capa_url?: string;
    ano_lancamento?: number;
  };
  artist: {
    id?: number;
    nome?: string;
    name?: string;
    foto_url?: string;
    biografia?: string;
  };
  createdAt?: string;
  durationSeconds?: number;
  duracaoSegundos?: number;
  genre?: any;
  genero?: any;
  title?: string;
  titulo?: string;
  youtubeUrl?: string;
  urlYoutube?: string;
}

export const musicaService = {
  listar: async (): Promise<Musica[]> => {
    try {
      const response = await api.get("/api/musics");
      return Array.isArray(response.data) ? response.data : response.data?.content || [];
    } catch (error) {
      console.error("Erro ao listar músicas:", error);
      throw error;
    }
  },

  // 👇 FUNÇÃO ADICIONADA PARA CORRIGIR O ERRO
  obterPorId: async (id: number): Promise<Musica> => {
    const response = await api.get(`/api/musics/${id}`);
    return response.data;
  },

  criar: async (musica: any): Promise<Musica> => {
    const response = await api.post("/api/musics", musica);
    return response.data;
  },

  atualizar: async (id: number, musica: any): Promise<Musica> => {
    const response = await api.put(`/api/musics/${id}`, musica);
    return response.data;
  },

  deletar: async (id: number): Promise<void> => {
    await api.delete(`/api/musics/${id}`);
  },
};