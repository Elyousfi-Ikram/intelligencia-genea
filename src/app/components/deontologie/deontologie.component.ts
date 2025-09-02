import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, signal, computed, ViewChild, TemplateRef, ViewEncapsulation, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ContactComponent } from '../contact/contact.component';
import { Meta, Title } from '@angular/platform-browser';
import charteData from '../../../data/charte.json';

// ===== INTERFACES =====
interface CharteSection {
    title: string;
    article: Array<{
        subtitle?: string;
        content: string | string[];
        list?: string[];
    }>;
}

interface ArticleItem {
    subtitle?: string;
    content: string | string[];
    list?: string[];
}

@Component({
    selector: 'app-deontologie',
    standalone: true,
    imports: [CommonModule, ContactComponent],
    templateUrl: './deontologie.component.html',
    styleUrls: ['./deontologie.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class DeontologieComponent implements OnInit, OnDestroy {
    // ===== CONSTANTES =====
    readonly maxPages = 5; // Ajusté pour 9 sections sur 5 pages
    readonly charteData: CharteSection[] = charteData as CharteSection[];
    
    readonly pageContentMapping = {
        left: {
            1: 0,  // PRÉAMBULE
            2: 2,  // I. PRINCIPES GÉNÉRAUX  
            3: 4,  // III. MÉTHODES DE RECHERCHE
            4: 6,  // V. GARANTIES ET RESPONSABILITÉS
            5: 8,  // Engagement Personnel
        },
        right: {
            1: 1,  // SOMMAIRE
            2: 3,  // II. OBLIGATIONS ENVERS LA CLIENTÈLE
            3: 5,  // IV. RELATIONS PROFESSIONNELLES
            4: 7,  // VI. DISPOSITIONS FINALES
            5: 'loading',  // Page vide ou loading
        }
    };

    // ===== SIGNALS ET COMPUTED =====
    currentPage = signal(0);
    isPageTurning = signal(false);
    turnDirection = signal<'next' | 'prev' | null>(null);

    leftPageNumber = computed(() => (this.currentPage() * 2) - 1);
    rightPageNumber = computed(() => this.currentPage() * 2);
    canNavigateNext = computed(() => this.currentPage() < this.maxPages && !this.isPageTurning());
    canNavigatePrev = computed(() => this.currentPage() > 1 && !this.isPageTurning());

    // ===== PROPRIÉTÉS PRIVÉES =====
    private animationTimeouts: NodeJS.Timeout[] = [];

    // ===== RÉFÉRENCES AUX TEMPLATES =====
    @ViewChild('loadingTemplate', { static: true }) loadingTemplate!: TemplateRef<any>;
    @ViewChild('sectionContentTemplate', { static: true }) sectionContentTemplate!: TemplateRef<any>;

    // ===== MÉTHODES DE NAVIGATION =====
    openBook(): void {
        this.currentPage.set(1);
    }

    closeBook(): void {
        this.currentPage.set(0);
    }

    nextPage(): void {
        if (this.canNavigateNext()) {
            this.startPageTurn('next');
        }
    }

    previousPage(): void {
        if (this.canNavigatePrev()) {
            this.startPageTurn('prev');
        }
    }

    goToPage(page: number): void {
        if (this.isValidPageNumber(page) && !this.isPageTurning()) {
            this.currentPage.set(page);
        }
    }

    navigateToSection(sectionPage: number): void {
        if (this.isValidPageNumber(sectionPage) && !this.isPageTurning()) {
            this.currentPage.set(sectionPage);
        } else {
            console.warn(`Navigation impossible vers la page ${sectionPage}`);
        }
    }

    // ===== GESTION DES ANIMATIONS =====
    private startPageTurn(direction: 'next' | 'prev'): void {
        this.clearAnimationTimeouts();

        this.isPageTurning.set(true);
        this.turnDirection.set(direction);

        const ANIMATION_MIDDLE_DELAY = 100;
        const ANIMATION_TOTAL_DELAY = 200;

        // Changer la page au milieu de l'animation
        const middleTimeout = setTimeout(() => {
            const newPage = direction === 'next'
                ? this.currentPage() + 1
                : this.currentPage() - 1;
            this.currentPage.set(newPage);
        }, ANIMATION_MIDDLE_DELAY);

        // Terminer l'animation
        const endTimeout = setTimeout(() => {
            this.isPageTurning.set(false);
            this.turnDirection.set(null);
        }, ANIMATION_TOTAL_DELAY);

        this.animationTimeouts.push(middleTimeout, endTimeout);
    }

    private clearAnimationTimeouts(): void {
        this.animationTimeouts.forEach(timeout => clearTimeout(timeout));
        this.animationTimeouts = [];
    }

    // ===== MÉTHODES DE CONTENU =====
    getCharteSection(index: number): CharteSection | null {
        return this.charteData[index] || null;
    }

    getCurrentLeftPageContent(): string | CharteSection | null {
        const sectionIndex = this.pageContentMapping.left[this.currentPage() as keyof typeof this.pageContentMapping.left];
        console.log('Current page:', this.currentPage(), 'Left content:', sectionIndex);
        
        if (typeof sectionIndex === 'string') {
            return sectionIndex;
        }
    
        if (typeof sectionIndex === 'number') {
            const section = this.getCharteSection(sectionIndex);
            console.log('Section found:', section);
            return section;
        }
    
        return 'loading';
    }
    
    getCurrentRightPageContent(): string | CharteSection | null {
        const mapping = this.pageContentMapping.right[this.currentPage() as keyof typeof this.pageContentMapping.right];
    
        if (typeof mapping === 'string') {
            return mapping;
        }
    
        if (typeof mapping === 'number') {
            return this.getCharteSection(mapping);
        }
    
        return 'loading';
    }

    getNextLeftPageContent(): string | CharteSection | null {
        const nextPage = this.turnDirection() === 'next' ? this.currentPage() + 1 : this.currentPage() - 1;
        const sectionIndex = this.pageContentMapping.left[nextPage as keyof typeof this.pageContentMapping.left];

        if (typeof sectionIndex === 'number') {
            return this.getCharteSection(sectionIndex);
        }

        return 'loading';
    }

    getNextRightPageContent(): string | CharteSection | null {
        const nextPage = this.turnDirection() === 'next' ? this.currentPage() + 1 : this.currentPage() - 1;
        const mapping = this.pageContentMapping.right[nextPage as keyof typeof this.pageContentMapping.right];

        if (typeof mapping === 'number') {
            return this.getCharteSection(mapping);
        }

        return 'loading';
    }

    getPageTemplate(content: string | CharteSection | null): TemplateRef<any> {
        if (content === 'loading') {
            return this.loadingTemplate;
        }
        if (typeof content === 'object' && content !== null) {
            return this.sectionContentTemplate;
        }
        return this.loadingTemplate;
    }

    // ===== MÉTHODES UTILITAIRES =====
    getCurrentDate(): string {
        return new Date().toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    isArray(value: any): boolean {
        return Array.isArray(value);
    }
    
    asStringArray(value: string | string[]): string[] {
        return Array.isArray(value) ? value : [value];
    }
    
    // Nouvelle méthode pour gérer le contenu de manière plus sûre
    getContentAsArray(content: string | string[]): string[] {
        if (Array.isArray(content)) {
            return content;
        }
        return [content];
    }

    private isValidPageNumber(page: number): boolean {
        return page >= 1 && page <= this.maxPages;
    }

    // ===== GESTION DES ÉVÉNEMENTS =====
    onTocItemClick(event: Event): void {
        const target = event.target as HTMLElement;
        const tocItem = target.closest('.toc-item');
        if (tocItem) {
            const pageNumber = parseInt(tocItem.getAttribute('data-page') || '1', 10);
            this.navigateToSection(pageNumber);
        }
    }

    // ===== LIFECYCLE HOOKS =====
    // Nouvelle propriété pour gérer les sections expandues
    expandedSections: boolean[] = [];
    
    // Ajout du constructeur avec injection des dépendances
    constructor(
        private meta: Meta,
        private title: Title,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}
    
    // Ajout de la méthode ngOnInit manquante
    ngOnInit(): void {
        this.initializeSEO();
        this.preloadCriticalResources();
        this.trackSEOMetrics();
    }

    private initializeSEO(): void {
        // Titre optimisé avec mots-clés longue traîne
        this.title.setTitle('Charte Déontologique INTELLIGENCIA-GENEA® | Éthique Généalogiste Professionnel | Code Déontologie Généalogie');
        
        // Meta description optimisée
        this.meta.updateTag({
            name: 'description',
            content: 'Charte déontologique INTELLIGENCIA-GENEA®. Code d\'éthique des généalogistes professionnels. Principes déontologiques, obligations clientèle, méthodes recherche, garanties responsabilités. Expertise généalogie France.'
        });
        
        // Mots-clés spécifiques déontologie
        this.meta.updateTag({
            name: 'keywords',
            content: 'charte déontologique généalogiste, code éthique généalogie, déontologie professionnelle, obligations généalogiste, principes éthiques recherche, garanties généalogie, responsabilités généalogiste professionnel, méthodes recherche généalogique, relations professionnelles généalogie'
        });
        
        // Métadonnées spécialisées
        this.meta.updateTag({ name: 'deontology.type', content: 'Charte professionnelle généalogie' });
        this.meta.updateTag({ name: 'deontology.scope', content: 'Généalogistes professionnels France' });
        this.meta.updateTag({ name: 'deontology.compliance', content: 'Code déontologique INTELLIGENCIA-GENEA' });
        this.meta.updateTag({ name: 'professional.ethics', content: 'Éthique généalogie successorale' });
        
        // Open Graph spécialisé
        this.meta.updateTag({ property: 'og:title', content: 'Charte Déontologique INTELLIGENCIA-GENEA® | Éthique Généalogiste' });
        this.meta.updateTag({ property: 'og:description', content: 'Code déontologique des généalogistes INTELLIGENCIA-GENEA®. Principes éthiques, obligations professionnelles et garanties qualité.' });
        this.meta.updateTag({ property: 'og:type', content: 'article' });
        this.meta.updateTag({ property: 'article:section', content: 'Déontologie' });
        this.meta.updateTag({ property: 'article:tag', content: 'Charte déontologique, Éthique généalogie, Code professionnel' });
        
        // Twitter Cards
        this.meta.updateTag({ name: 'twitter:title', content: 'Charte Déontologique INTELLIGENCIA-GENEA®' });
        this.meta.updateTag({ name: 'twitter:description', content: 'Code déontologique des généalogistes professionnels. Éthique et garanties qualité.' });
        
        // Balises géographiques étendues
        this.meta.updateTag({ name: 'geo.region', content: 'FR' });
        this.meta.updateTag({ name: 'geo.placename', content: 'France' });
        this.meta.updateTag({ name: 'ICBM', content: '46.603354, 1.888334' });
        
        // Données structurées Schema.org
        this.addStructuredData();
    }
    
    private addStructuredData(): void {
        if (isPlatformBrowser(this.platformId)) {
            // Schema Article pour la charte
            const articleSchema = {
                '@context': 'https://schema.org',
                '@type': 'Article',
                'headline': 'Charte Déontologique INTELLIGENCIA-GENEA®',
                'description': 'Code déontologique des généalogistes professionnels INTELLIGENCIA-GENEA®. Principes éthiques, obligations envers la clientèle, méthodes de recherche et garanties.',
                'author': {
                    '@type': 'Organization',
                    'name': 'INTELLIGENCIA-GENEA',
                    'url': 'http://intelligencia-genea.com'
                },
                'publisher': {
                    '@type': 'Organization',
                    'name': 'INTELLIGENCIA-GENEA',
                    'logo': {
                        '@type': 'ImageObject',
                        'url': 'http://intelligencia-genea.com/logo.jpeg'
                    }
                },
                'datePublished': new Date().toISOString(),
                'dateModified': new Date().toISOString(),
                'mainEntityOfPage': {
                    '@type': 'WebPage',
                    '@id': 'http://intelligencia-genea.com/deontologie'
                },
                'articleSection': 'Déontologie professionnelle',
                'keywords': 'charte déontologique, éthique généalogie, code professionnel, généalogiste',
                'inLanguage': 'fr-FR',
                'isPartOf': {
                    '@type': 'WebSite',
                    'name': 'INTELLIGENCIA-GENEA',
                    'url': 'http://intelligencia-genea.com'
                }
            };
            
            // Schema ProfessionalService
            const serviceSchema = {
                '@context': 'https://schema.org',
                '@type': 'ProfessionalService',
                'name': 'Services Généalogiques Déontologiques',
                'description': 'Services de généalogie professionnelle respectant une charte déontologique stricte',
                'provider': {
                    '@type': 'Organization',
                    'name': 'INTELLIGENCIA-GENEA'
                },
                'hasCredential': {
                    '@type': 'EducationalOccupationalCredential',
                    'name': 'Charte Déontologique Généalogiste',
                    'description': 'Code déontologique professionnel des généalogistes'
                },
                'serviceType': 'Généalogie déontologique',
                'areaServed': 'France'
            };
            
            this.insertStructuredData('deontology-article-schema', articleSchema);
            this.insertStructuredData('deontology-service-schema', serviceSchema);
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
        // Préchargement des ressources critiques
    }
    
    private trackSEOMetrics(): void {
        // Tracking des Core Web Vitals
        if ('web-vital' in window) {
            // Mesure du LCP (Largest Contentful Paint)
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'largest-contentful-paint') {
                        console.log('LCP:', entry.startTime);
                    }
                }
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }

    ngOnDestroy(): void {
        this.clearAnimationTimeouts();
    }

    // Méthode pour obtenir toutes les sections pour la version tablette
    getAllSections() {
      return charteData;
    }
    
    // Nouvelle méthode pour toggle les sections
    toggleSection(index: number): void {
        this.expandedSections[index] = !this.expandedSections[index];
    }
    
    // Méthode pour le type checking
    getArticleItems(section: CharteSection): ArticleItem[] {
        return section.article as ArticleItem[];
    }
}