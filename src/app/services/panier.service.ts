import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { LivresService } from './livres.service';

const STORAGE_KEY = 'pleine-page-panier';

@Injectable({ providedIn: 'root' })
export class PanierService {
  private readonly livresService = inject(LivresService);

  /** Liste des IDs (doublons = quantité) */
  private readonly ids = signal<number[]>(this.lireStockage());

  readonly articles = computed(() => this.ids());
  readonly totalArticles = computed(() => this.ids().length);

  /** Lignes regroupées : id → quantité */
  readonly lignes = computed(() => {
    const map = new Map<number, number>();
    for (const id of this.ids()) {
      map.set(id, (map.get(id) ?? 0) + 1);
    }
    return [...map.entries()].map(([id, quantite]) => {
      const livre = this.livresService.parId(id);
      return { id, quantite, livre };
    });
  });

  readonly totalPrix = computed(() =>
    this.ids().reduce((somme, id) => {
      const livre = this.livresService.parId(id);
      return somme + (livre?.prix ?? 0);
    }, 0)
  );

  constructor() {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.ids()));
    });
  }

  quantitePour(id: number): number {
    return this.ids().filter((x) => x === id).length;
  }

  ajouter(id: number, quantite = 1): void {
    const ajouts = Array.from({ length: Math.max(1, quantite) }, () => id);
    this.ids.update((p) => [...p, ...ajouts]);
  }

  retirerUn(id: number): void {
    this.ids.update((p) => {
      const i = p.lastIndexOf(id);
      if (i < 0) return p;
      return [...p.slice(0, i), ...p.slice(i + 1)];
    });
  }

  definirQuantite(id: number, quantite: number): void {
    const q = Math.max(0, Math.floor(quantite));
    this.ids.update((p) => {
      const sans = p.filter((x) => x !== id);
      if (q === 0) return sans;
      return [...sans, ...Array.from({ length: q }, () => id)];
    });
  }

  supprimer(id: number): void {
    this.ids.update((p) => p.filter((x) => x !== id));
  }

  vider(): void {
    this.ids.set([]);
  }

  private lireStockage(): number[] {
    try {
      const brut = localStorage.getItem(STORAGE_KEY);
      if (!brut) return [];
      const data = JSON.parse(brut);
      return Array.isArray(data) ? data.filter((x) => typeof x === 'number') : [];
    } catch {
      return [];
    }
  }
}
