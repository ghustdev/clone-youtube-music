// services/adminServices.ts
import { api } from "./api";

export interface Artista {
    id: number;
    nome: string;
    biografia?: string;
    foto_url?: string;
}

export interface Genero {
    id: number;
    nome: string;
}

export interface Album {
    id: number;
    titulo: string;
    artistaId?: number;
    artista?: Artista;
    ano_lancamento?: number;
    capa_url?: string;
}

export const artistaService = {
    listar: async (): Promise<Artista[]> => {
        const response = await api.get("/api/admin/artistas");
        return response.data;
    },

    criar: async (data: { nome: string; biografia: string; foto_url: string }): Promise<Artista> => {
        const response = await api.post("/api/admin/artistas", data);
        return response.data;
    },

    atualizar: async (id: number, data: { nome: string; biografia: string; foto_url: string }): Promise<Artista> => {
        const response = await api.put(`/api/admin/artistas/${id}`, data);
        return response.data;
    },

    deletar: async (id: number): Promise<void> => {
        await api.delete(`/api/admin/artistas/${id}`);
    },
};

export const generoService = {
    listar: async (): Promise<Genero[]> => {
        const response = await api.get("/api/admin/generos");
        return response.data;
    },

    criar: async (data: { nome: string }): Promise<Genero> => {
        const response = await api.post("/api/admin/generos", data);
        return response.data;
    },

    atualizar: async (id: number, data: { nome: string }): Promise<Genero> => {
        const response = await api.put(`/api/admin/generos/${id}`, data);
        return response.data;
    },

    deletar: async (id: number): Promise<void> => {
        await api.delete(`/api/admin/generos/${id}`);
    },
};

export const albumService = {
    listar: async (): Promise<Album[]> => {
        const response = await api.get("/api/admin/albums");
        return response.data;
    },

    criar: async (data: { titulo: string; artistaId: number; ano_lancamento: number; capa_url: string }): Promise<Album> => {
        const response = await api.post("/api/admin/albums", data);
        return response.data;
    },

    atualizar: async (id: number, data: { titulo: string; artistaId: number; ano_lancamento: number; capa_url: string }): Promise<Album> => {
        const response = await api.put(`/api/admin/albums/${id}`, data);
        return response.data;
    },

    deletar: async (id: number): Promise<void> => {
        await api.delete(`/api/admin/albums/${id}`);
    },
};