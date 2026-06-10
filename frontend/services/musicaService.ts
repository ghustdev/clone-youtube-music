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

  criar: async (musica: Omit<Musica, "id">): Promise<Musica> => {
    const response = await api.post("/api/musicas", musica);
    return response.data;
  },

  deletar: async (id: number): Promise<void> => {
    await api.delete(`/api/musicas/${id}`);
  },
};
