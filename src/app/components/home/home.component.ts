import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ContactComponent],

  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  showStudyModal = false;
  
  // Images paths
  enqueteurImage = 'assets/homePage/Enquêteur.webp';
  arbreImage = 'assets/homePage/Arbre-généalogique.webp';
  archivesImage = 'assets/homePage/Archives.webp';
  expertiseImage = 'assets/homePage/Expertise.webp';
  investigationImage = 'assets/homePage/Investigation.webp';

  private structuredDataScript?: HTMLScriptElement;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Mise à jour du titre de la page
      this.document.title = "Intelligencia-Genea | Généalogiste Professionnel & Enquêteur Successoral";
      
      // Ajout des données structurées
      this.addStructuredData();
    }
  }

  ngOnDestroy(): void {
    // Nettoyage des données structurées
    if (this.structuredDataScript && isPlatformBrowser(this.platformId)) {
      this.document.head.removeChild(this.structuredDataScript);
    }
  }

  openStudyModal(): void {
    this.showStudyModal = true;
  }

  closeStudyModal(): void {
    this.showStudyModal = false;
  }

  handleNavigateToHonoraires(): void {
    // Navigation vers la page des honoraires
    // Vous devrez implémenter la logique de navigation selon votre routing
    console.log('Navigation vers nos-honoraires');
  }

  private addStructuredData(): void {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Accueil - Intelligencia-Genea",
      "description": "Page d'accueil de l'agence de généalogie professionnelle Intelligencia-Genea",
      "url": this.document.location.href,
      "mainEntity": {
        "@type": "ProfessionalService",
        "name": "Intelligencia-Genea"
      }
    };

    this.structuredDataScript = this.document.createElement('script');
    this.structuredDataScript.type = 'application/ld+json';
    this.structuredDataScript.text = JSON.stringify(structuredData);
    this.document.head.appendChild(this.structuredDataScript);
  }
}