// services/exploreService.ts
import { musicaService, Musica } from "./musicaService";

export const exploreService = {
    getNovosLancamentos: async (): Promise<Musica[]> => {
        try {
            // Reaproveita a chamada centralizada do musicaService
            const data = await musicaService.listar();

            // CRÍTICO: Cria uma cópia do array antes de usar o .reverse()
            return [...data].reverse();
        } catch (error) {
            console.error("Erro no exploreService:", error);
            // Retorna array vazio como fallback para não quebrar a tela do usuário
            return [];
        }
    },
};