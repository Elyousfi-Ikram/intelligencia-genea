import { Component, ElementRef, ViewChild, OnInit, OnDestroy, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

// Déclaration globale pour gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

@Component({
  selector: 'app-genealogie',
  standalone: true,
  imports: [CommonModule],
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

  // Nombre total de slides (statique)
  readonly totalSlides = 5;

  // Propriétés pour les dates (initialisées une seule fois)
  public readonly currentDateISO: string;
  public readonly currentDateFR: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Initialisation des dates une seule fois
    const now = new Date();
    this.currentDateISO = now.toISOString();
    this.currentDateFR = now.toLocaleDateString('fr-FR');
  }

  ngOnInit() {
    this.trackPageView();
  }

  ngAfterViewInit() {
    this.setupPassiveEventListeners();
  }

  ngOnDestroy() {
    this.removePassiveEventListeners();
  }

  private setupPassiveEventListeners(): void {
    if (isPlatformBrowser(this.platformId)) {
      const trackElement = this.trackRef?.nativeElement;
      if (trackElement) {
        trackElement.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        trackElement.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
        trackElement.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
      }
    }
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

  private trackPageView(): void {
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: 'Généalogie',
        page_location: window.location.href
      });
    }
  }

  // Méthodes du carousel
  nextSlide(): void {
    this.isUserInteracted = true;
    if (this.currentSlide < this.totalSlides - 1) {
      this.currentSlide++;
    }
  }

  prevSlide(): void {
    this.isUserInteracted = true;
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  goToSlide(index: number): void {
    this.isUserInteracted = true;
    if (index >= 0 && index < this.totalSlides) {
      this.currentSlide = index;
    }
  }

  getTransformStyle(): { [key: string]: string } {
    const translateX = -(this.currentSlide * 20); // 20% par slide au lieu de 100%
    return {
      transform: `translateX(${translateX}%)`
    };
  }

  // Gestion tactile
  handleTouchStart(event: TouchEvent): void {
    this.startX = event.touches[0].clientX;
    this.isDragging = true;
  }

  handleTouchMove(event: TouchEvent): void {
    if (!this.isDragging) return;
    this.currentX = event.touches[0].clientX;
  }

  handleTouchEnd(): void {
    if (!this.isDragging) return;
    
    const diffX = this.startX - this.currentX;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }

    this.isDragging = false;
    this.startX = 0;
    this.currentX = 0;
  }

  // Méthode pour gérer les erreurs d'images
  onImageError(event: any, slideId: string): void {
    console.warn(`Erreur de chargement pour l'image du slide ${slideId}`);
    // Image de fallback - vous pouvez personnaliser le chemin
    event.target.src = '/assets/genealogiePage/default-image.webp';
  }
}