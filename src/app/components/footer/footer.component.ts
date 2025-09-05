import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { StudyModalComponent } from '../study-modal/study-modal.component';
import { LegalModalComponent } from '../legal-modal/legal-modal.component';
import { LegalModalService, LegalContent } from '../../services/legal-modal.service';
import { Subscription } from 'rxjs';
import { StudyModalService } from '../../services/study-modal.service';
// Ajoutez l'import
import { ReviewsModalService } from '../../services/reviews-modal.service';

// Déclaration TypeScript pour Google Analytics
declare let gtag: Function;

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, LegalModalComponent], // Retirer StudyModalComponent
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  currentYear = new Date().getFullYear();
  showModal = false;
  showLegalModal = false;
  currentLegalContent: LegalContent | null = null;
  
  private subscriptions = new Subscription();

  // Données SEO enrichies
  readonly seoData = {
    companyName: 'INTELLIGENCIA-GENEA®',
    description: 'Cabinet de généalogie professionnel agréé par le Ministère de la Culture. Recherches d\'héritiers, généalogie successorale, investigations privées.',
    address: '67 Cours Mirabeau, 13100 Aix-en-Provence',
    phone: '06 45 82 06 97',
    email: 'intelligencia.lagarde@gmail.com',
    linkedin: 'https://www.linkedin.com/in/olivier-lagarde-détective-8a7024239/',
    services: [
      'Recherches d\'Héritiers Successorale',
      'Généalogie Familiale',
      'Investigations Privées',
      'Expertise Juridique'
    ],
    clients: [
      'Particuliers',
      'Notaires',
      'Banquiers',
      'Assureurs',
      'Syndics et copropriétaires',
      'Administrateurs judiciaires',
      'Avocats',
      'Situations Particulières'
    ],
    keywords: 'généalogiste professionnel, recherche héritiers, généalogie successorale, investigations privées, expertise juridique, cabinet généalogie agréé, Aix-en-Provence'
  };

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller,
    private meta: Meta,
    private title: Title,
    private legalModalService: LegalModalService,
    private studyModalService: StudyModalService,
    private reviewsModalService: ReviewsModalService, // Ajouter cette ligne
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.initializeFooterSEO();
    this.addStructuredData();
    this.preloadCriticalResources();
    
    // S'abonner aux changements du service
    this.subscriptions.add(
      this.legalModalService.isOpen$.subscribe(isOpen => {
        this.showLegalModal = isOpen;
      })
    );
    
    this.subscriptions.add(
      this.legalModalService.content$.subscribe(content => {
        this.currentLegalContent = content;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeFooterSEO(): void {
    // Métadonnées footer spécifiques
    this.meta.updateTag({ name: 'footer.company', content: this.seoData.companyName });
    this.meta.updateTag({ name: 'footer.services', content: this.seoData.services.join(', ') });
    this.meta.updateTag({ name: 'footer.location', content: 'Aix-en-Provence, Bouches-du-Rhône, PACA' });
    this.meta.updateTag({ name: 'footer.contact', content: `${this.seoData.phone} | ${this.seoData.email}` });
    
    // Métadonnées business enrichies
    this.meta.updateTag({ name: 'business.type', content: 'Cabinet généalogie professionnel' });
    this.meta.updateTag({ name: 'business.certification', content: 'Agréé Ministère Culture' });
    this.meta.updateTag({ name: 'business.specialization', content: 'Généalogie successorale recherche héritiers' });
    this.meta.updateTag({ name: 'business.target', content: 'Notaires banquiers assureurs particuliers' });
  }

  private addStructuredData(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Schema Organization enrichi
      const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        'name': this.seoData.companyName,
        'description': this.seoData.description,
        'url': 'http://intelligencia-genea.com',
        'logo': 'http://intelligencia-genea.com/logo.jpeg',
        'image': 'http://intelligencia-genea.com/logo.jpeg',
        'telephone': this.seoData.phone,
        'email': this.seoData.email,
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': '67 Cours Mirabeau',
          'addressLocality': 'Aix-en-Provence',
          'postalCode': '13100',
          'addressRegion': 'Bouches-du-Rhône',
          'addressCountry': 'FR'
        },
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': '43.5263',
          'longitude': '5.4454'
        },
        'areaServed': {
          '@type': 'Country',
          'name': 'France'
        },
        'serviceType': 'Généalogie professionnelle',
        'hasCredential': {
          '@type': 'EducationalOccupationalCredential',
          'name': 'Agrément Ministère de la Culture',
          'description': 'Cabinet de généalogie agréé'
        },
        'knowsAbout': this.seoData.services,
        'makesOffer': this.seoData.services.map(service => ({
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': service,
            'serviceType': 'Généalogie professionnelle'
          }
        })),
        'sameAs': [this.seoData.linkedin],
        'foundingDate': '2020',
        'numberOfEmployees': '1-5',
        'priceRange': '$$',
        'paymentAccepted': ['Cash', 'Credit Card', 'Bank Transfer'],
        'currenciesAccepted': 'EUR',
        'openingHours': 'Mo-Fr 09:00-18:00',
        'contactPoint': {
          '@type': 'ContactPoint',
          'telephone': this.seoData.phone,
          'email': this.seoData.email,
          'contactType': 'customer service',
          'availableLanguage': 'French'
        }
      };

      // Schema LocalBusiness
      const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        'name': this.seoData.companyName,
        'description': 'Cabinet de généalogie professionnel spécialisé dans la recherche d\'héritiers et la généalogie successorale',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': '67 Cours Mirabeau',
          'addressLocality': 'Aix-en-Provence',
          'postalCode': '13100',
          'addressRegion': 'Provence-Alpes-Côte d\'Azur',
          'addressCountry': 'FR'
        },
        'telephone': this.seoData.phone,
        'email': this.seoData.email,
        'url': 'http://intelligencia-genea.com',
        'openingHours': 'Mo-Fr 09:00-18:00',
        'priceRange': '$$',
        'servesCuisine': 'Professional Genealogy Services'
      };

      this.insertStructuredData('footer-organization-schema', organizationSchema);
      this.insertStructuredData('footer-localbusiness-schema', localBusinessSchema);
    }
  }

  private insertStructuredData(id: string, schema: any): void {
    const existingScript = document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }
    
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  private preloadCriticalResources(): void {
    if (isPlatformBrowser(this.platformId)) {
    }
  }

  // Méthode sécurisée pour le tracking Google Analytics
  private trackEvent(action: string, category: string, label: string): void {
    if (isPlatformBrowser(this.platformId) && typeof gtag !== 'undefined') {
      gtag('event', action, {
        'event_category': category,
        'event_label': label
      });
    }
  }

  // Méthodes existantes avec optimisations SEO
  onPhoneClick() {
    // Tracking pour SEO
    this.trackEvent('contact_phone', 'engagement', 'footer_phone_click');
    window.location.href = 'tel:0645820697';
  }

  onEmailClick() {
    // Tracking pour SEO
    this.trackEvent('contact_email', 'engagement', 'footer_email_click');
    this.showModal = true;
  }

  onCloseModal() {
    this.showModal = false;
  }

  onCloseLegalModal() {
    this.legalModalService.closeModal();
  }

  onLegalClick(section: string) {
    switch (section) {
      case 'mentions':
        this.legalModalService.openMentionsLegales();
        break;
      case 'confidentialite':
        this.legalModalService.openPolitiqueConfidentialite();
        break;
      case 'cookies':
        this.legalModalService.openPolitiqueCookies();
        break;
    }
    this.showLegalModal = true;
  }

  // Navigation vers les services avec défilement vers la section
  onServiceClick(service: string) {
    // Tracking pour SEO
    this.trackEvent('service_navigation', 'navigation', `footer_service_${service}`);
    
    this.router.navigate(['/services']).then(() => {
      setTimeout(() => {
        let sectionId = '';
        
        switch(service) {
          case 'recherches':
          case 'genealogie-familiale':
            sectionId = 'recherches';
            break;
          case 'investigations':
            sectionId = 'investigations';
            break;
          case 'expertise':
            sectionId = 'expertise';
            break;
          default:
            sectionId = 'recherches';
        }
        
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    });
  }

  onSocialClick(platform: string) {
    // Tracking pour SEO
    this.trackEvent('social_click', 'engagement', `footer_${platform}`);
    console.log(`Navigating to ${platform}`);
  }

  // Nouvelles méthodes SEO
  getStructuredServices(): string {
    return this.seoData.services.join(', ');
  }

  getStructuredClients(): string {
    return this.seoData.clients.join(', ');
  }

  getBusinessKeywords(): string {
    return this.seoData.keywords;
  }

  openStudyModal(): void {
    this.studyModalService.openModal();
  }

  // Ajoutez la méthode
  openReviewsModal(): void {
    this.reviewsModalService.openModal();
    this.trackEvent('reviews_modal', 'engagement', 'footer_reviews_click');
  }
}