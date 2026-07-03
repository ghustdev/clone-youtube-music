// services/playerService.ts
import { Musica } from "./musicaService";

class PlayerService {
  private currentSong: Musica | null = null;
  private listeners: Set<() => void> = new Set();

  public getCurrentSong = () => this.currentSong;

  public setCurrentSong = (musica: Musica) => {
    this.currentSong = musica;
    this.notifyListeners();
  };

  public clearCurrentSong = () => {
    this.currentSong = null;
    this.notifyListeners();
  };

  public subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private notifyListeners = () => {
    this.listeners.forEach((listener) => listener());
  };
}

export const playerService = new PlayerService();