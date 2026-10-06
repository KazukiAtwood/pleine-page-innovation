import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PanierService } from './services/panier.service';
import { LivresService } from './services/livres.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly panier = inject(PanierService);
  private readonly livresService = inject(LivresService);

  ngOnInit(): void {
    this.livresService.charger();
  }
}
