import { api } from "./api";

export interface Musica {
  id: number;
  album: string;
  artist: string;
  createdAt: string;
  durationSeconds: number;
  genre: string;
  title: string;
  youtubeUrl: string;
}

export const musicaService = {
  listar: async (): Promise<Musica[]> => {
    const response = await api.get("/api/musics");
    return response.data;
  },

  search: async (musica: string): Promise<Musica[]> => {
    const response = await api.get("/api/musics/search", {
      params: { q: musica },
    });
    return response.data;
  },

  findById: async (id: number): Promise<Musica> => {
    const response = await api.get(`/api/musicas/${id}`);
    return response.data;
  },
};
