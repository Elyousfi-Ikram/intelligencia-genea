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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BannerComponent, RouterOutlet, ScrollToTopComponent, FooterComponent, LegalModalComponent, CommonModule, StudyModalComponent],
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
  `
})
export class AppComponent {
  title = 'intelligencia-genea-Angular';

  constructor(
    private router: Router,
    public legalModalService: LegalModalService,
    public studyModalService: StudyModalService
  ) {}

  onNavigate(route: string) {
    this.router.navigate([route]);
  }
}