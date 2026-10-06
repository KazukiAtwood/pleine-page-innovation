import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LivresService } from '../services/livres.service';
import { PanierService } from '../services/panier.service';

@Component({
  selector: 'app-fiche',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './fiche.html',
  styleUrl: './fiche.css',
})
export class Fiche implements OnInit {
  readonly id = input.required<string>();

  protected readonly livresService = inject(LivresService);
  protected readonly panier = inject(PanierService);

  protected readonly quantite = signal(1);
  protected readonly tiltX = signal(0);
  protected readonly tiltY = signal(0);
  protected readonly shineX = signal(50);
  protected readonly shineY = signal(50);
  protected readonly feedback = signal(false);

  protected readonly livre = computed(() =>
    this.livresService.parId(Number(this.id()))
  );

  protected readonly suggestions = computed(() =>
    this.livresService
      .livres()
      .filter((l) => l.id !== Number(this.id()))
      .slice(0, 4)
  );

  protected readonly dejaDansPanier = computed(() =>
    this.panier.quantitePour(Number(this.id()))
  );

  constructor() {
    effect(() => {
      this.id();
      this.quantite.set(1);
      this.resetTilt();
      this.feedback.set(false);
    });
  }

  ngOnInit(): void {
    this.livresService.charger();
  }

  protected surSouris(event: MouseEvent): void {
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    this.tiltY.set((x - 0.5) * 22);
    this.tiltX.set((0.5 - y) * 18);
    this.shineX.set(x * 100);
    this.shineY.set(y * 100);
  }

  protected resetTilt(): void {
    this.tiltX.set(0);
    this.tiltY.set(0);
    this.shineX.set(50);
    this.shineY.set(50);
  }

  protected augmenterQte(): void {
    this.quantite.update((q) => Math.min(99, q + 1));
  }

  protected diminuerQte(): void {
    this.quantite.update((q) => Math.max(1, q - 1));
  }

  protected ajouter(): void {
    const livre = this.livre();
    if (!livre) return;
    this.panier.ajouter(livre.id, this.quantite());
    this.feedback.set(true);
    setTimeout(() => this.feedback.set(false), 1600);
  }
}
