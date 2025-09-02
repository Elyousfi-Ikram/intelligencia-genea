import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

interface NavigationItem {
  id: string;
  title: string;
  hasDropdown: boolean;
  subItems?: SubItem[];
  redirectUrl?: string;
}

interface SubItem {
  id: string;
  title: string;
  iconClass: string;
}

interface ContactInfo {
  icon: string;
  text: string;
  type: string;
  ariaLabel: string;
}

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit, OnDestroy {
  @Input() onNavigate?: (page: string) => void;
  @Output() navigate = new EventEmitter<string>();

  activeDropdown: string | null = null;
  isMobileMenuOpen = false;
  isScrolled = false;

  // Navigation enrichie avec titres SEO
  navigationData: NavigationItem[] = [
    {
      id: 'qui-sommes-nous',
      title: 'QUI SOMMES-NOUS',
      hasDropdown: true,
      seoTitle: 'Découvrez INTELLIGENCIA-GENEA, experts en généalogie successorale',
      subItems: [
        { id: 'comprendre-genealogie', title: 'Comprendre la généalogie', iconClass: 'icon-tree' },
        { id: 'notre-agence', title: 'Notre agence', iconClass: 'icon-entreprise' },
      ]
    },
    {
      id: 'nos-prestations',
      title: 'NOS PRESTATIONS',
      hasDropdown: true,
      seoTitle: 'Services de généalogie professionnelle - Recherche héritiers',
      subItems: [
        { id: 'nos-services', title: 'Nos services', iconClass: 'icon-services' },
        { id: 'nos-garanties', title: 'Nos garanties et engagements', iconClass: 'icon-shield' },
        { id: 'nos-honoraires', title: 'Nos honoraires', iconClass: 'icon-euro' }
      ]
    },
    {
      id: 'charte-de-deontologie',
      title: 'CHARTE DE DEONTOLOGIE',
      hasDropdown: false,
      seoTitle: 'Charte déontologique INTELLIGENCIA-GENEA - Éthique professionnelle'
    },
    {
      id: 'reseau',
      title: 'NOTRE RESEAU',
      hasDropdown: false,
      seoTitle: 'Réseau national INTELLIGENCIA-GENEA - 18 bureaux en France',
      redirectUrl: ''
    }
  ];

  // Contact enrichi avec données structurées
  contactInfo: ContactInfo[] = [
    { 
      icon: '📞', 
      text: '06 45 82 06 97', 
      type: 'phone', 
      ariaLabel: 'Appeler INTELLIGENCIA-GENEA au 06 45 82 06 97 pour vos recherches généalogiques',
      seoData: 'Contactez nos généalogistes experts'
    },
    { 
      icon: '✉️', 
      text: 'intelligencia.lagarde@gmail.com', 
      type: 'email', 
      ariaLabel: 'Envoyer un email à INTELLIGENCIA-GENEA pour vos demandes de généalogie successorale',
      seoData: 'Email professionnel généalogie'
    }
  ];

  constructor(
    private meta: Meta, 
    private title: Title,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initSEOMetadata();
    }
  }

  // Initialisation des métadonnées SEO dynamiques
  private initSEOMetadata() {
    // Métadonnées spécifiques au banner
    this.meta.updateTag({ 
      name: 'description', 
      content: 'INTELLIGENCIA-GENEA - Généalogistes experts avec 18 bureaux en France. Spécialisés en généalogie successorale et recherche d\'héritiers pour notaires et particuliers.' 
    });
    
    this.meta.updateTag({ 
      name: 'keywords', 
      content: 'généalogiste professionnel, recherche héritiers, généalogie successorale, expert généalogie France, INTELLIGENCIA-GENEA' 
    });

    // Données structurées pour le header
    this.addStructuredData();
  }

  // Ajout de données structurées spécifiques au banner
  private addStructuredData() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "INTELLIGENCIA-GENEA",
      "url": "http://intelligencia-genea.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "http://intelligencia-genea.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "INTELLIGENCIA-GENEA",
        "logo": "http://intelligencia-genea.com/logo.jpeg"
      }
    };

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    this.document.head.appendChild(script);
  }

  // Méthode pour obtenir les titres SEO de navigation
  getNavigationTitle(item: NavigationItem): string {
    return item.seoTitle || item.title;
  }

  ngOnDestroy() {
    // Nettoyage automatique avec @HostListener
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    const scrollTop = window.pageYOffset || this.document.documentElement.scrollTop;
    const scrollThreshold = 50;
    this.isScrolled = scrollTop > scrollThreshold;
  }

  toggleDropdown(section: string) {
    this.activeDropdown = this.activeDropdown === section ? null : section;
  }

  handleNavigation(item: NavigationItem) {
    console.log('Navigation clicked:', item.id, 'hasDropdown:', item.hasDropdown);
    
    if (item.hasDropdown) {
      this.toggleDropdown(item.id);
      console.log('Active dropdown after toggle:', this.activeDropdown);
    } else {
      // Fermer tous les dropdowns
      this.activeDropdown = null;
      
      // Navigation vers les pages
      if (item.redirectUrl && item.redirectUrl !== '') {
        window.location.href = item.redirectUrl;
      } else {
        this.navigate.emit(item.id);
        if (this.onNavigate) {
          this.onNavigate(item.id);
        }
      }
    }
  }

  handleSubItemClick(parentId: string, subItem: SubItem) {
    console.log(`Navigation vers: ${parentId} > ${subItem.title}`);

    const navigationMap: { [key: string]: string } = {
      'comprendre-genealogie': 'genealogie',
      'notre-agence': 'agence',
      'nos-services': 'services',
      'nos-engagements': 'nos-engagements',
      'nos-garanties': 'nos-garanties',
      'nos-honoraires': 'nos-honoraires',
    };

    const targetPage = navigationMap[subItem.id];
    if (targetPage) {
      this.navigate.emit(targetPage);
      if (this.onNavigate) {
        this.onNavigate(targetPage);
      }
    }

    this.activeDropdown = null;
  }

  handleLogoClick() {
    this.navigate.emit('home');
    if (this.onNavigate) {
      this.onNavigate('home');
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  getPhoneHref(phone: string): string {
    return `tel:${phone.replace(/\s/g, '')}`;
  }

  getEmailHref(email: string): string {
    return `mailto:${email}`;
  }

  getIconClass(iconClass: string): string {
    const iconMap: { [key: string]: string } = {
      'icon-tree': 'fas fa-tree',
      'icon-entreprise': 'fas fa-building',
      'icon-services': 'fas fa-briefcase',
      'icon-shield': 'fas fa-shield-alt',
      'icon-euro': 'fas fa-euro-sign'
    };
    return iconMap[iconClass] || '';
  }
}

// Interface enrichie
interface NavigationItem {
  id: string;
  title: string;
  hasDropdown: boolean;
  seoTitle?: string;
  subItems?: SubItem[];
  redirectUrl?: string;
}

interface ContactInfo {
  icon: string;
  text: string;
  type: string;
  ariaLabel: string;
  seoData?: string;
}