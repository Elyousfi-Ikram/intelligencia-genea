import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ContactComponent } from '../contact/contact.component';
import { Meta, Title } from '@angular/platform-browser';

// Déclaration globale pour gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

@Component({
  selector: 'app-garanties',
  standalone: true,
  imports: [CommonModule, ContactComponent],
  templateUrl: './garanties.component.html',
  styleUrls: ['./garanties.component.scss']
})
export class GarantiesComponent implements OnInit {
  
  // Données SEO enrichies pour les garanties
  private readonly seoData = {
    title: 'Garanties et Engagements INTELLIGENCIA-GENEA® | Généalogiste Professionnel France',
    description: 'Découvrez nos garanties professionnelles : pratique légale encadrée, méthodologie éprouvée, respect des délais, éthique irréprochable, contrats transparents et assurance responsabilité civile.',
    keywords: 'garanties généalogiste, engagements professionnels, éthique généalogie, assurance responsabilité civile, contrat généalogie, délais recherche héritiers, méthodologie généalogique, déontologie généalogiste',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': 'Garanties et Engagements Généalogiques INTELLIGENCIA-GENEA®',
      'description': 'Services garantis de généalogie professionnelle avec engagement qualité, respect des délais, éthique irréprochable et assurance responsabilité civile.',
      'provider': {
        '@type': 'Organization',
        'name': 'INTELLIGENCIA-GENEA'
      },
      'serviceType': 'Généalogie professionnelle garantie',
      'hasOfferCatalog': {
        '@type': 'OfferCatalog',
        'name': 'Garanties professionnelles',
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Pratique légale encadrée',
              'description': 'Conformité à l\'article 36 de la loi du 23 juin 2006, mandat préalable obligatoire'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Méthodologie éprouvée',
              'description': 'Hiérarchisation des sources, vérification croisée, transparence totale'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Respect des délais',
              'description': 'Dossiers finalisés entre 6 à 12 mois, communication régulière'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Éthique irréprochable',
              'description': 'Conformité Code civil, charte déontologique, confidentialité absolue'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Contrats transparents',
              'description': 'Contrat de révélation lisible, aucune clause abusive, explications détaillées'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Assurance responsabilité civile',
              'description': 'Couverture professionnelle complète, sécurité juridique garantie'
            }
          }
        ]
      },
      'areaServed': [
        'France', 'Aix-en-Provence', 'Nice', 'Marseille', 'Cannes', 'Saint-Tropez',
        'Bordeaux', 'Nantes', 'Tours', 'Rennes', 'Le Havre', 'Ajaccio', 'Bastia'
      ]
    }
  };

  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.initializeSEO();
    this.addStructuredData();
    this.preloadCriticalResources();
    this.trackPageView();
  }

  private initializeSEO(): void {
    // Titre optimisé
    this.title.setTitle(this.seoData.title);

    // Meta descriptions
    this.meta.updateTag({ name: 'description', content: this.seoData.description });
    this.meta.updateTag({ name: 'keywords', content: this.seoData.keywords });
    
    // Métadonnées spécifiques aux garanties
    this.meta.updateTag({ name: 'guarantees.type', content: 'Garanties professionnelles généalogie' });
    this.meta.updateTag({ name: 'guarantees.scope', content: 'Services généalogiques France' });
    this.meta.updateTag({ name: 'guarantees.compliance', content: 'Loi 23 juin 2006, Code civil, Code consommation' });
    this.meta.updateTag({ name: 'professional.insurance', content: 'Responsabilité civile professionnelle' });
    this.meta.updateTag({ name: 'service.timeline', content: '6-12 mois délai standard' });
    this.meta.updateTag({ name: 'service.methodology', content: 'Sources hiérarchisées, vérification croisée' });
    
    // Open Graph pour garanties
    this.meta.updateTag({ property: 'og:title', content: this.seoData.title });
    this.meta.updateTag({ property: 'og:description', content: this.seoData.description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: 'http://intelligencia-genea.com/garanties' });
    
    // Twitter Cards
    this.meta.updateTag({ name: 'twitter:title', content: this.seoData.title });
    this.meta.updateTag({ name: 'twitter:description', content: this.seoData.description });
    
    // Métadonnées business
    this.meta.updateTag({ name: 'business.guarantees', content: 'Assurance RC professionnelle, Conformité légale, Éthique déontologique' });
    this.meta.updateTag({ name: 'business.compliance', content: 'Article 36 loi 23 juin 2006' });
    this.meta.updateTag({ name: 'business.timeline', content: '6-12 mois recherche standard' });
  }

  private addStructuredData(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Supprimer les données structurées existantes pour cette page
      const existingScript = document.querySelector('script[data-schema="garanties"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Ajouter les nouvelles données structurées
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', 'garanties');
      script.textContent = JSON.stringify(this.seoData.structuredData);
      document.head.appendChild(script);
    }
  }

  private preloadCriticalResources(): void {
    if (isPlatformBrowser(this.platformId)) {
      const criticalImages = [
        '/assets/garantiesPage/institutions-organismes.webp',
        '/assets/garantiesPage/situations-particulieres.webp',
        '/assets/garantiesPage/delais.webp',
        '/assets/garantiesPage/ethique.webp',
        '/assets/garantiesPage/contrat.webp',
        '/assets/garantiesPage/valeurs.webp',
        '/assets/garantiesPage/confidentialite.webp'
      ];

      criticalImages.forEach(src => {
        // Vérifier si l'image existe avant de la précharger
        const img = new Image();
        img.onload = () => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = src;
          link.type = 'image/webp';
          document.head.appendChild(link);
        };
        img.onerror = () => {
          console.warn(`Image non trouvée: ${src}`);
        };
        img.src = src;
      });
    }
  }

  private trackPageView(): void {
    this.trackEvent('page_view', {
      page_title: 'Garanties et Engagements',
      page_location: '/garanties',
      content_group1: 'Services',
      content_group2: 'Garanties'
    });
  }

  private trackEvent(eventName: string, parameters: any): void {
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined' && window.gtag) {
      try {
        window.gtag('event', eventName, parameters);
      } catch (error) {
        console.warn('Erreur lors du tracking:', error);
      }
    }
  }

  // Méthodes pour le tracking des interactions utilisateur
  onGuaranteeClick(guaranteeType: string): void {
    this.trackEvent('guarantee_interaction', {
      guarantee_type: guaranteeType,
      interaction_type: 'click'
    });
  }

  onImageLoad(imageName: string): void {
    this.trackEvent('image_loaded', {
      image_name: imageName,
      page: 'garanties'
    });
  }
}