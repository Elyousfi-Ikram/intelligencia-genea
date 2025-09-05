import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BannerComponent } from './components/banner/banner.component';
import { RouterOutlet } from '@angular/router';
import { ScrollToTopComponent } from './components/scroll-to-top/scroll-to-top.component';
import { FooterComponent } from './components/footer/footer.component';
import { LegalModalComponent } from './components/legal-modal/legal-modal.component';
import { LegalModalService } from './services/legal-modal.service';
import { CommonModule } from '@angular/common';
import { StudyModalComponent } from './components/study-modal/study-modal.component';
import { StudyModalService } from './services/study-modal.service';
// Ajoutez les imports
import { ReviewsModalComponent } from './components/reviews-modal/reviews-modal.component';
import { ReviewsModalService } from './services/reviews-modal.service';

// Supprimez cette section problématique :
// if (typeof window !== 'undefined') {
//   import('../styles/components.scss');
// }

@Component({
  selector: 'app-root',
  standalone: true,
  // Dans les imports
  imports: [BannerComponent, RouterOutlet, ScrollToTopComponent, FooterComponent, LegalModalComponent, CommonModule, StudyModalComponent, ReviewsModalComponent],
  // Dans le template
  template: `
    <app-banner (navigate)="onNavigate($event)"></app-banner>
    <router-outlet></router-outlet>
    <app-scroll-to-top></app-scroll-to-top>
    <app-footer></app-footer>
    
    <!-- Modale légale globale -->
    <app-legal-modal 
      [isOpen]="(legalModalService.isOpen$ | async) || false" 
      [legalContent]="(legalModalService.content$ | async)"
      (closeModal)="legalModalService.closeModal()">
    </app-legal-modal>
    
    <!-- Modale d'étude globale -->
    <app-study-modal></app-study-modal>
    
    <!-- Modale d'avis clients -->
    <app-reviews-modal></app-reviews-modal>
  `
})
export class AppComponent {
  title = 'intelligencia-genea-Angular';

  // Dans le constructeur
  constructor(
    private router: Router,
    public legalModalService: LegalModalService,
    public studyModalService: StudyModalService,
    public reviewsModalService: ReviewsModalService
  ) {}

  onNavigate(route: string) {
    this.router.navigate([route]);
  }
}