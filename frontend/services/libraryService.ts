// services/libraryService.ts
import { Musica } from "./musicaService";

const STORAGE_KEY = "@musicapp:likes";

export const libraryService = {
    // Busca as músicas curtidas salvas localmente
    getCurtidas: (): Musica[] => {
        if (typeof window === "undefined") return [];
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    },

    // Adiciona ou remove uma música da lista de curtidas
    toggleCurtir: (musica: Musica): Musica[] => {
        const curtidas = libraryService.getCurtidas();
        const jaCurtida = curtidas.some((m) => m.id === musica.id);

        let novasCurtidas;
        if (jaCurtida) {
            novasCurtidas = curtidas.filter((m) => m.id !== musica.id);
        } else {
            novasCurtidas = [...curtidas, musica];
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(novasCurtidas));
        return novasCurtidas;
    }
};