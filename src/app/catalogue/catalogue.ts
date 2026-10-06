import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LivresService } from '../services/livres.service';

@Component({
  selector: 'app-catalogue',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './catalogue.html',
  styleUrl: './catalogue.css',
})
export class Catalogue implements OnInit {
  private readonly livresService = inject(LivresService);

  protected readonly filtre = signal('');
  protected readonly livres = this.livresService.livres;

  protected readonly resultats = computed(() => {
    const q = this.filtre().toLowerCase().trim();
    const tous = this.livres();
    if (!q) return tous;
    return tous.filter(
      (l) =>
        l.auteur.toLowerCase().includes(q) ||
        l.titre.toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    this.livresService.charger();
  }
}
