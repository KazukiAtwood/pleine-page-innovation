import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PanierService } from '../services/panier.service';
import { LivresService } from '../services/livres.service';

@Component({
  selector: 'app-panier',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './panier.html',
  styleUrl: './panier.css',
})
export class Panier implements OnInit {
  protected readonly panier = inject(PanierService);
  private readonly livresService = inject(LivresService);

  ngOnInit(): void {
    this.livresService.charger();
  }
}
