import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Livre } from '../livres';

@Injectable({ providedIn: 'root' })
export class LivresService {
  private readonly http = inject(HttpClient);
  private readonly _livres = signal<Livre[]>([]);
  private charge = false;

  readonly livres = this._livres.asReadonly();

  charger(): void {
    if (this.charge) return;
    this.charge = true;
    this.http.get<Livre[]>('/livres.json').subscribe({
      next: (data) => this._livres.set(data),
      error: () => {
        this.charge = false;
        this._livres.set([]);
      },
    });
  }

  parId(id: number): Livre | undefined {
    return this._livres().find((l) => l.id === id);
  }
}
