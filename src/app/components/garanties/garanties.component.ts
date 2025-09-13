import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

// Déclaration globale pour gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

@Component({
  selector: 'app-garanties',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './garanties.component.html',
  styleUrls: ['./garanties.component.scss']
})
export class GarantiesComponent implements OnInit {
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.trackPageView();
  }

  // CONSERVER - Tracking détaillé utile pour l'analyse
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

  // Méthodes utilisées dans le template - CONSERVER
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