import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { LegalModalService } from '../../services/legal-modal.service';
import { PolicyModalService } from '../../services/policy-modal.service';
import { CookiesModalService } from '../../services/cookies-modal.service';
import { ReviewsModalService } from '../../services/reviews-modal.service';
import { StudyModalService } from '../../services/study-modal.service';
// import { StudyModalComponent } from '../modal/study-modal/study-modal.component';
import { ModalComponent } from '../modal/modal.component';
import { Subscription } from 'rxjs';

declare let gtag: Function;

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  readonly currentYear = new Date().getFullYear();

  private readonly subscriptions = new Subscription();

  // Données statiques pour le template (sans SEO)
  private readonly staticData = {
    companyName: 'INTELLIGENCIA-GENEA®',
    phone: '06 45 82 06 97',
    email: 'intelligencia.lagarde@gmail.com',
    services: [
      'Recherches d\'Héritiers Successorale',
      'Généalogie Familiale',
      'Investigations Privées',
      'Expertise Juridique'
    ] as const,
    clients: [
      'Particuliers',
      'Notaires',
      'Banquiers',
      'Assureurs',
      'Syndics et copropriétaires',
      'Administrateurs judiciaires',
      'Avocats',
      'Situations Particulières'
    ] as const,
    keywords: 'généalogiste professionnel, recherche héritiers, généalogie successorale, investigations privées, expertise juridique, cabinet généalogie agréé, Aix-en-Provence'
  } as const;

  constructor(
    private readonly router: Router,
    private readonly legalModalService: LegalModalService,
    private readonly policyModalService: PolicyModalService,
    private readonly cookiesModalService: CookiesModalService,
    private readonly reviewsModalService: ReviewsModalService,
    private readonly studyModalService: StudyModalService,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private trackEvent(action: string, category: string, label: string): void {
    if (isPlatformBrowser(this.platformId) && typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label
      });
    }
  }

  onPhoneClick(): void {
    this.trackEvent('contact_phone', 'engagement', 'footer_phone_click');
    window.location.href = `tel:${this.staticData.phone.replace(/\s/g, '')}`;
  }

  onLegalClick(section: string): void {
    // Appeler les méthodes spécifiques du service selon le bouton cliqué
    switch(section) {
      case 'mentions':
        this.legalModalService.openModal();
        break;
      case 'confidentialite':
        this.policyModalService.openModal();
        break;
      case 'cookies':
        this.cookiesModalService.openModal();
        break;
    }

    this.trackEvent('legal_click', 'footer', section);
  }

  onServiceClick(service: string): void {
    this.trackEvent('service_navigation', 'navigation', `footer_service_${service}`);

    this.router.navigate(['/services']).then(() => {
      setTimeout(() => {
        const sectionMap: Record<string, string> = {
          recherches: 'recherches',
          'genealogie-familiale': 'recherches',
          investigations: 'investigations',
          expertise: 'expertise'
        };

        const sectionId = sectionMap[service] || 'recherches';
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 500);
    });
  }

  // Méthodes pour le template (données statiques)
  getStructuredServices(): string {
    return this.staticData.services.join(', ');
  }

  getStructuredClients(): string {
    return this.staticData.clients.join(', ');
  }

  getBusinessKeywords(): string {
    return this.staticData.keywords;
  }

  openReviewsModal(): void {
    this.reviewsModalService.openModal();
    this.trackEvent('reviews_modal', 'engagement', 'footer_reviews_click');
  }

  onEmailClick(): void {
    this.trackEvent('contact_email', 'engagement', 'footer_email_click');
    this.studyModalService.openModal();
  }
}