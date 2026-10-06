import { Routes } from '@angular/router';
import { Catalogue } from './catalogue/catalogue';
import { Fiche } from './fiche/fiche';
import { Panier } from './panier/panier';
import { Page404 } from './page-404/page-404';

export const routes: Routes = [
  { path: '', component: Catalogue },
  { path: 'livre/:id', component: Fiche },
  { path: 'panier', component: Panier },
  { path: '**', component: Page404 },
];
