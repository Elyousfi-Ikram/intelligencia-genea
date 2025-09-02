import { Component, ElementRef, ViewChild, OnInit, OnDestroy, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
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
  selector: 'app-genealogie',
  standalone: true,
  imports: [CommonModule, ContactComponent],
  templateUrl: './genealogie.component.html',
  styleUrls: ['./genealogie.component.scss']
})
export class GenealogiePage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('trackRef', { static: false }) trackRef!: ElementRef;

  currentSlide = 0;
  isUserInteracted = false;
  startX = 0;
  currentX = 0;
  isDragging = false;
  autoSlideInterval: any;

  // Propriétés pour les dates (initialisées une seule fois)
  public readonly currentDateISO: string;
  public readonly currentDateFR: string;

  slides = [
    {
      id: '1', // au lieu de 'evolution'
      title: 'Un domaine en expansion : contexte et enjeux contemporains',
      content: {
        slideTitle: 'Un domaine en expansion : contexte et enjeux contemporains',
        introText: 'Bien que cette spécialité ait émergé au XIXe siècle, elle a acquis une importance cruciale avec les mutations sociétales des XXe et XXIe siècles :',
        features: [
          { 
            title: 'Recompositions familiales',
            description: 'Les structures familiales modernes sont plus complexes et éclatées'
          },
          { 
            title: 'Isolement des personnes âgées',
            description: 'La distance géographique complique l\'identification des héritiers'
          },
          { 
            title: 'Affaiblissement des liens intergénérationnels',
            description: 'La perte de contact entre générations rend les recherches plus difficiles'
          },
          { 
            title: 'Multiplication des décès sans héritiers immédiatement identifiables',
            description: 'De plus en plus de successions nécessitent des investigations approfondies'
          }
        ],
        conclusion: 'Historiquement, les bénéficiaires étaient connus car les familles demeuraient géographiquement stables, souvent sur plusieurs générations. Désormais, localiser un héritier constitue une véritable investigation, nécessitant des compétences juridiques, archivistiques et relationnelles.'
      }
    },
    {
      id: '2', // au lieu de 'legal'
      title: 'Un domaine rigoureusement encadré',
      content: {
        slideTitle: 'Un domaine rigoureusement encadré',
        introText: 'Bien que cette activité ne soit pas réglementée stricto sensu (contrairement au notariat), la généalogie successorale évolue dans un environnement juridique structuré, notamment par :',
        features: [
          {
            title: 'Article 36 de la loi du 23 juin 2006',
            description: 'Exige un mandat pour toute investigation d\'héritiers dans une succession ouverte'
          },
          {
            title: 'Code de la consommation',
            description: 'Réglemente les contrats de révélation, assimilés au démarchage domiciliaire'
          },
          {
            title: 'Charte déontologique',
            description: 'Référentiel commun aux praticiens, établi par les organisations syndicales'
          },
          {
            title: 'Garanties ministérielles',
            description: 'Fondement de garanties élaboré sous l\'autorité du ministère de la Justice'
          }
        ],
        conclusion: 'Ce cadre juridique garantit la légitimité et la sécurité des investigations généalogiques, protégeant à la fois les héritiers et les praticiens dans leurs démarches successorales.'
      }
    },
    {
      id: '3', // au lieu de 'tools'
      title: 'L\'arsenal méthodologique de la généalogie successorale',
      content: {
        slideTitle: 'L\'arsenal méthodologique de la généalogie successorale',
        introText: 'Contrairement aux idées préconçues, la France ne possède aucun répertoire centralisé facilitant l\'identification des héritiers d\'un défunt. Cette activité s\'appuie donc sur une investigation méticuleuse dans des sources variées, parfois dispersées et soumises à des restrictions de consultation.',
        features: [
          {
            title: 'Archives d\'état civil',
            description: 'Actes de naissance, mariage, décès'
          },
          {
            title: 'Registres officiels',
            description: 'Registres notariés, fiscaux, électoraux ou cadastraux'
          },
          {
            title: 'Archives publiques',
            description: 'Archives départementales, communales ou militaires'
          },
          {
            title: 'Documents privés',
            description: 'Livrets de famille ou correspondances découvertes'
          }
        ],
        conclusion: 'À partir de ces sources, recoupées et authentifiées, il est possible d\'établir un arbre généalogique certifié, attestant la légitimité des héritiers.'
      }
    },
    {
      id: '4', // au lieu de 'complexity'
      title: 'Des investigations complexes aux délais variables',
      content: {
        slideTitle: 'Des investigations complexes aux délais variables',
        introText: 'Identifier un héritier peut nécessiter quelques semaines… ou s\'étendre sur plusieurs années. Les délais dépendent de multiples variables :',
        features: [
          { 
            title: 'La lisibilité des documents fournis',
            description: 'Des documents anciens ou détériorés peuvent ralentir les recherches'
          },
          { 
            title: 'L\'intrication de la lignée',
            description: 'Des familles nombreuses ou recomposées complexifient l\'arbre généalogique'
          },
          { 
            title: 'L\'éparpillement géographique des héritiers',
            description: 'La dispersion des héritiers à travers le monde complique leur localisation'
          },
          { 
            title: 'La parcimonie des informations disponibles',
            description: 'Le manque d\'archives ou de documents peut prolonger les investigations'
          }
        ],
        conclusion: 'Les investigations peuvent s\'étendre jusqu\'au sixième degré de parenté, soit jusqu\'aux arrières-petits-enfants des arrière-grands-parents du défunt, impliquant parfois une remontée jusqu\'aux années 1880. Chaque dossier constitue donc une enquête singulière, où le moindre indice peut s\'avérer déterminant pour l\'avancement des investigations.'
      }
    },
    {
      id: '5', // au lieu de 'mission'
      title: 'Une mission de confiance au service des familles et du droit',
      content: {
        slideTitle: 'Une mission de confiance au service des familles et du droit',
        introText: 'L\'activité de la généalogie successorale se situe à l\'intersection du droit, de l\'investigation et de l\'humain. Elle œuvre pour :',
        features: [
          {
            title: 'Identification complète',
            description: 'S\'assurer que tous les ayants droit soient correctement identifiés et localisés'
          },
          {
            title: 'Sécurisation juridique',
            description: 'Sécuriser juridiquement la transmission successorale'
          },
          {
            title: 'Prévention des litiges',
            description: 'Prévenir les litiges liés à des omissions ou des erreurs'
          },
          {
            title: 'Transparence',
            description: 'Permettre aux héritiers de connaître leurs droits et de les exercer en toute transparence'
          }
        ],
        conclusion: 'Cette discipline exigeante est exercée par des spécialistes formés, astreints à des obligations de rigueur, de confidentialité et de loyauté, dans un cadre légal précis et avec une finalité : garantir une transmission patrimoniale équitable et juridiquement incontestable.'
      }
    }
  ];

  // Données SEO enrichies
  // Suppression des anciens getters pour éviter la duplication
  // Les propriétés currentDateISO et currentDateFR sont maintenant déclarées en haut de la classe

  // Déclaration de seoData sans initialisation
  private seoData: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private meta: Meta,
    private title: Title
  ) {
    // Initialisation des dates une seule fois
    const now = new Date();
    this.currentDateISO = now.toISOString();
    this.currentDateFR = now.toLocaleDateString('fr-FR');
    
    // Initialisation de seoData après les propriétés de date
    this.seoData = {
      title: 'Généalogie Successorale vs Familiale | INTELLIGENCIA-GENEA® | Expert France',
      description: 'Découvrez les différences entre généalogie successorale et familiale. INTELLIGENCIA-GENEA®, expert en recherche d\'héritiers et arbres généalogiques. 18 bureaux en France.',
      keywords: 'généalogie successorale, généalogie familiale, recherche héritiers, arbre généalogique, notaire, succession, INTELLIGENCIA-GENEA, France',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': 'Généalogie successorale ou généalogie familiale : quelle différence ?',
        'description': 'Guide complet sur les différences entre généalogie successorale et familiale par INTELLIGENCIA-GENEA®',
        'author': {
          '@type': 'Organization',
          'name': 'INTELLIGENCIA-GENEA'
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'INTELLIGENCIA-GENEA',
          'logo': {
            '@type': 'ImageObject',
            'url': 'http://intelligencia-genea.com/logo.jpeg'
          }
        },
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': 'http://intelligencia-genea.com/genealogie'
        },
        'datePublished': this.currentDateISO,
        'dateModified': this.currentDateISO,
        'articleSection': 'Généalogie',
        'keywords': ['généalogie successorale', 'généalogie familiale', 'recherche héritiers', 'succession'],
        'about': [
          {
            '@type': 'Thing',
            'name': 'Généalogie successorale',
            'description': 'Recherche d\'héritiers dans le cadre de successions'
          },
          {
            '@type': 'Thing',
            'name': 'Généalogie familiale',
            'description': 'Reconstitution d\'arbres généalogiques pour particuliers'
          }
        ]
      }
    };
  }

  ngOnInit() {
    this.initializeSEO();
    this.addStructuredData();
    this.preloadCriticalResources();
    this.trackPageView();
  }

  ngAfterViewInit() {
    this.setupPassiveEventListeners();
  }

  private setupPassiveEventListeners(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Configuration des événements passifs pour améliorer les performances
      const trackElement = this.trackRef?.nativeElement;
      if (trackElement) {
        trackElement.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        trackElement.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
        trackElement.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
      }
    }
  }
  ngOnDestroy() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
    this.removeStructuredData();
    this.removePassiveEventListeners();
  }
  
  private removePassiveEventListeners(): void {
    if (isPlatformBrowser(this.platformId)) {
      const trackElement = this.trackRef?.nativeElement;
      if (trackElement) {
        trackElement.removeEventListener('touchstart', this.handleTouchStart.bind(this));
        trackElement.removeEventListener('touchmove', this.handleTouchMove.bind(this));
        trackElement.removeEventListener('touchend', this.handleTouchEnd.bind(this));
      }
    }
  }
  private initializeSEO(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Titre optimisé avec mots-clés principaux
      this.title.setTitle(this.seoData.title);
      
      // Meta descriptions optimisées
      this.meta.updateTag({ name: 'description', content: this.seoData.description });
      this.meta.updateTag({ name: 'keywords', content: this.seoData.keywords });
      
      // Ajout de meta tags spécialisés pour le SEO local
      this.meta.updateTag({ name: 'geo.region', content: 'FR' });
      this.meta.updateTag({ name: 'geo.country', content: 'France' });
      this.meta.updateTag({ name: 'ICBM', content: '46.603354, 1.888334' }); // Centre de la France
      
      // Meta tags spécifiques à la généalogie avec mots-clés longue traîne
      this.meta.updateTag({ name: 'genealogy.type', content: 'Généalogie successorale et familiale professionnelle' });
      this.meta.updateTag({ name: 'genealogy.scope', content: 'France métropolitaine et DOM-TOM' });
      this.meta.updateTag({ name: 'genealogy.services', content: 'Recherche héritiers, arbres généalogiques certifiés, expertise juridique successorale' });
      this.meta.updateTag({ name: 'genealogy.methodology', content: 'Archives état civil, registres officiels, sources authentifiées, investigation professionnelle' });
      this.meta.updateTag({ name: 'genealogy.experience', content: 'Plus de 25 ans d\'expérience, 18 bureaux en France' });
      
      // Ajout de meta tags pour l'autorité et la confiance
      this.meta.updateTag({ name: 'author', content: 'INTELLIGENCIA-GENEA' });
      this.meta.updateTag({ name: 'copyright', content: 'INTELLIGENCIA-GENEA' });
      this.meta.updateTag({ name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' });
      this.meta.updateTag({ name: 'googlebot', content: 'index, follow' });
      
      // Open Graph optimisé
      this.meta.updateTag({ property: 'og:title', content: this.seoData.title });
      this.meta.updateTag({ property: 'og:description', content: this.seoData.description });
      this.meta.updateTag({ property: 'og:type', content: 'article' });
      this.meta.updateTag({ property: 'og:url', content: 'http://intelligencia-genea.com/genealogie' });
      this.meta.updateTag({ property: 'og:image', content: 'http://intelligencia-genea.com/assets/genealogiePage/genealogiePage-header.webp' });
      this.meta.updateTag({ property: 'og:image:width', content: '1200' });
      this.meta.updateTag({ property: 'og:image:height', content: '630' });
      this.meta.updateTag({ property: 'og:image:alt', content: 'Généalogie successorale et familiale INTELLIGENCIA-GENEA' });
      this.meta.updateTag({ property: 'og:site_name', content: 'INTELLIGENCIA-GENEA' });
      this.meta.updateTag({ property: 'og:locale', content: 'fr_FR' });
      
      // Twitter Cards optimisé
      this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
      this.meta.updateTag({ name: 'twitter:title', content: this.seoData.title });
      this.meta.updateTag({ name: 'twitter:description', content: this.seoData.description });
      this.meta.updateTag({ name: 'twitter:image', content: 'http://intelligencia-genea.com/assets/genealogiePage/genealogiePage-header.webp' });
      this.meta.updateTag({ name: 'twitter:image:alt', content: 'Généalogie successorale et familiale INTELLIGENCIA-GENEA' });
      
      // Canonical URL
      this.meta.updateTag({ rel: 'canonical', href: 'http://intelligencia-genea.com/genealogie' });
      
      // Ajout de liens hreflang pour le SEO international
      this.meta.updateTag({ rel: 'alternate', hreflang: 'fr', href: 'http://intelligencia-genea.com/genealogie' });
      this.meta.updateTag({ rel: 'alternate', hreflang: 'fr-FR', href: 'http://intelligencia-genea.com/genealogie' });
      
      // Métadonnées d'accessibilité et performance
      this.meta.updateTag({ name: 'theme-color', content: '#f3e1c2' });
      this.meta.updateTag({ name: 'color-scheme', content: 'light' });
      this.meta.updateTag({ name: 'format-detection', content: 'telephone=yes' });
      
      // Ajout de meta tags pour la vitesse et l'expérience utilisateur
      this.meta.updateTag({ 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' });
      this.meta.updateTag({ name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' });
    }
  }

  private addStructuredData(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Données structurées principales
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(this.seoData.structuredData);
      script.id = 'genealogie-structured-data';
      document.head.appendChild(script);
      
      // Données structurées pour l'organisation (améliore l'autorité)
      const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'INTELLIGENCIA-GENEA',
        'url': 'http://intelligencia-genea.com',
        'logo': 'http://intelligencia-genea.com/logo.jpeg',
        'description': 'Cabinet de généalogie successorale et familiale, expert en recherche d\'héritiers depuis 1995',
        'foundingDate': '1995',
        'areaServed': {
          '@type': 'Country',
          'name': 'France'
        },
        'hasOfferCatalog': {
          '@type': 'OfferCatalog',
          'name': 'Services de généalogie professionnelle',
          'itemListElement': [
            {
              '@type': 'Offer',
              'itemOffered': {
                '@type': 'Service',
                'name': 'Généalogie successorale',
                'description': 'Recherche d\'héritiers et constitution d\'arbres successoraux pour notaires et tribunaux',
                'provider': {
                  '@type': 'Organization',
                  'name': 'INTELLIGENCIA-GENEA'
                }
              }
            },
            {
              '@type': 'Offer',
              'itemOffered': {
                '@type': 'Service',
                'name': 'Généalogie familiale',
                'description': 'Reconstitution d\'arbres généalogiques et recherche d\'ancêtres pour particuliers',
                'provider': {
                  '@type': 'Organization',
                  'name': 'INTELLIGENCIA-GENEA'
                }
              }
            }
          ]
        },
        'contactPoint': {
          '@type': 'ContactPoint',
          'contactType': 'Service client',
          'areaServed': 'FR',
          'availableLanguage': 'French'
        }
      };
      
      const orgScript = document.createElement('script');
      orgScript.type = 'application/ld+json';
      orgScript.text = JSON.stringify(organizationSchema);
      orgScript.id = 'genealogie-organization-schema';
      document.head.appendChild(orgScript);
      
      // Breadcrumb pour améliorer la navigation
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Accueil',
            'item': 'http://intelligencia-genea.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Généalogie',
            'item': 'http://intelligencia-genea.com/genealogie'
          }
        ]
      };
      
      const breadcrumbScript = document.createElement('script');
      breadcrumbScript.type = 'application/ld+json';
      breadcrumbScript.text = JSON.stringify(breadcrumbSchema);
      breadcrumbScript.id = 'genealogie-breadcrumb-schema';
      document.head.appendChild(breadcrumbScript);
    }
  }

  private removeStructuredData(): void {
    if (isPlatformBrowser(this.platformId)) {
      const scripts = [
        'genealogie-structured-data',
        'genealogie-organization-schema',
        'genealogie-breadcrumb-schema'
      ];
      
      scripts.forEach(id => {
        const script = document.getElementById(id);
        if (script) {
          document.head.removeChild(script);
        }
      });
    }
  }

  private preloadCriticalResources(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Préchargement des ressources critiques pour améliorer les Core Web Vitals
      const criticalResources = [
        { href: '/assets/genealogiePage/genealogiePage-header.webp', as: 'image' },
        { href: '/assets/genealogiePage/successoral-icon.webp', as: 'image' },
        { href: '/assets/genealogiePage/genealogiste-table.webp', as: 'image' },
        { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap', as: 'style' }
      ];
      
      criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = resource.as;
        link.href = resource.href;
        if (resource.as === 'style') {
          link.crossOrigin = 'anonymous';
        }
        document.head.appendChild(link);
      });
      
      // Préconnexion aux domaines externes
      const preconnectDomains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://www.google-analytics.com'
      ];
      
      preconnectDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    }
  }

  private trackPageView(): void {
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined' && window.gtag) {
      // Tracking amélioré pour le SEO
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: 'Généalogie - Différences Successorale vs Familiale',
        page_location: 'http://intelligencia-genea.com/genealogie',
        content_group1: 'Services',
        content_group2: 'Généalogie',
        custom_map: {
          'dimension1': 'page_type',
          'dimension2': 'user_engagement'
        }
      });
      
      // Événement de temps de lecture pour améliorer les métriques d'engagement
      setTimeout(() => {
        this.trackEvent('page_engagement', {
          engagement_time_msec: 30000,
          page_title: 'Généalogie - Guide complet'
        });
      }, 30000);
    }
  }

  private trackEvent(eventName: string, parameters: any = {}): void {
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        event_category: 'Genealogie',
        event_label: 'Carousel Interaction',
        ...parameters
      });
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.isUserInteracted = true;
   this.trackEvent('carousel_next', { slide_index: this.currentSlide });
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.isUserInteracted = true;
    this.trackEvent('carousel_prev', { slide_index: this.currentSlide });
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.isUserInteracted = true;
    this.trackEvent('carousel_goto', { slide_index: index });
  }

  handleTouchStart(event: TouchEvent) {
    this.startX = event.touches[0].clientX;
    this.isDragging = true;
    this.isUserInteracted = true;
  }

  handleTouchMove(event: TouchEvent) {
    if (!this.isDragging) return;
    this.currentX = event.touches[0].clientX;
    const deltaX = this.currentX - this.startX;
    
    // Seuil de déclenchement pour éviter les déclenchements accidentels
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        this.prevSlide();
      } else {
        this.nextSlide();
      }
      this.isDragging = false;
    }
  }

  handleTouchEnd() {
    this.isDragging = false;
    this.startX = 0;
    this.currentX = 0;
  }

  getTransformStyle() {
    const slideWidth = 100 / this.slides.length;
    return {
      transform: `translateX(-${this.currentSlide * slideWidth}%)`,
      display: 'flex',
      transition: this.isDragging ? 'none' : 'transform 0.3s ease',
      width: `${this.slides.length * 100}%`
    };
  }
}
