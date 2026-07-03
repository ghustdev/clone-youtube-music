// services/playlistService.ts
import { api } from "./api";
import { Musica } from "./musicaService";

export interface Playlist {
    id: number;
    nome?: string;
    name?: string;
    descricao?: string;
    description?: string;
    capa_url?: string;
    musicas?: Musica[];
    tracks?: Musica[];
}

export const playlistService = {
    listar: async (): Promise<Playlist[]> => {
        try {
            const response = await api.get("/api/playlists");
            return Array.isArray(response.data) ? response.data : response.data?.content || [];
        } catch (error) {
            console.error("Erro ao listar playlists:", error);
            throw error;
        }
    },

    obterPorId: async (id: number): Promise<Playlist> => {
        const response = await api.get(`/api/playlists/${id}`);
        return response.data;
    },

    criar: async (playlist: any): Promise<Playlist> => {
        const response = await api.post("/api/playlists", playlist);
        return response.data;
    },

    atualizar: async (id: number, playlist: any): Promise<Playlist> => {
        const response = await api.put(`/api/playlists/${id}`, playlist);
        return response.data;
    },

    deletar: async (id: number): Promise<void> => {
        await api.delete(`/api/playlists/${id}`);
    },
};