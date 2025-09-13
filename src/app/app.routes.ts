import { Routes } from '@angular/router';
import { ServicesComponent } from './components/services/services.component';
import { GenealogiePage } from './components/genealogie/genealogie.component';
import { HomeComponent } from './components/home/home.component';
import { AgenceComponent } from './components/agence/agence.component';
import { HonorairesComponent } from './components/honoraires/honoraires.component';
import { GarantiesComponent } from './components/garanties/garanties.component';
import { DeontologieComponent } from './components/deontologie/deontologie.component';
import { ReseauComponent } from './components/reseau/reseau.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'genealogie', component: GenealogiePage },
  { path: 'agence', component: AgenceComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'honoraires', component: HonorairesComponent },
  { path: 'garanties', component: GarantiesComponent },
  { path: 'charte-de-deontologie', component: DeontologieComponent },
  { path: 'reseau', component: ReseauComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
