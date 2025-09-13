import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, signal, computed, ViewChild, TemplateRef, ViewEncapsulation, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
    imports: [CommonModule],
    templateUrl: './deontologie.component.html',
    styleUrls: ['./deontologie.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class DeontologieComponent implements OnInit, OnDestroy {
    // ===== CONSTANTES =====
    readonly maxPages = 5;
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

    leftPageNumber = computed(() => (this.currentPage() * 2) - 1);
    rightPageNumber = computed(() => this.currentPage() * 2);
    canNavigateNext = computed(() => this.currentPage() < this.maxPages);
    canNavigatePrev = computed(() => this.currentPage() > 1);

    // ===== PROPRIÉTÉS PRIVÉES =====
    expandedSections: boolean[] = [];

    // ===== RÉFÉRENCES AUX TEMPLATES =====
    @ViewChild('loadingTemplate', { static: true }) loadingTemplate!: TemplateRef<any>;
    @ViewChild('sectionContentTemplate', { static: true }) sectionContentTemplate!: TemplateRef<any>;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    // ===== LIFECYCLE HOOKS =====
    ngOnInit(): void { }

    ngOnDestroy(): void { }

    // ===== MÉTHODES DE NAVIGATION =====
    openBook(): void {
        this.currentPage.set(1);
        this.scrollToTop();
    }

    closeBook(): void {
        this.currentPage.set(0);
    }

    nextPage(): void {
        if (this.canNavigateNext()) {
            this.currentPage.set(this.currentPage() + 1);
            this.scrollToTop();
        }
    }

    previousPage(): void {
        if (this.canNavigatePrev()) {
            this.currentPage.set(this.currentPage() - 1);
            this.scrollToTop();
        }
    }

    // ===== MÉTHODES DE CONTENU =====
    getCharteSection(index: number): CharteSection | null {
        return this.charteData[index] || null;
    }

    getCurrentLeftPageContent(): string | CharteSection | null {
        const sectionIndex = this.pageContentMapping.left[this.currentPage() as keyof typeof this.pageContentMapping.left];

        if (typeof sectionIndex === 'string') {
            return sectionIndex;
        }

        if (typeof sectionIndex === 'number') {
            const section = this.getCharteSection(sectionIndex);
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

    private scrollToTop(): void {
        setTimeout(() => {
            const pageContents = document.querySelectorAll('.page-content');
            pageContents.forEach(pageContent => {
                if (pageContent instanceof HTMLElement) {
                    pageContent.scrollTop = 0;
                }
            });
        }, 50);
    }

    isArray(value: any): boolean {
        return Array.isArray(value);
    }

    getContentAsArray(content: string | string[]): string[] {
        if (Array.isArray(content)) {
            return content;
        }
        return [content];
    }

    // ===== GESTION DES ÉVÉNEMENTS =====
    toggleSection(index: number): void {
        this.expandedSections[index] = !this.expandedSections[index];
    }

    getAllSections() {
        return charteData;
    }

    getArticleItems(section: CharteSection): ArticleItem[] {
        return section.article as ArticleItem[];
    }
}