import { Component, Input, Output, EventEmitter, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';
// Supprimer cette ligne temporairement
// import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  // Supprimer la section animations temporairement
  // animations: [...]
})
export class HeaderComponent implements OnInit {
  @Input() onNavigate?: (page: string) => void;
  @Output() navigate = new EventEmitter<string>();

  activeDropdown: string | null = null;
  isMobileMenuOpen = false;
  isScrolled = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Méthode vide mais nécessaire pour l'interface OnInit
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    const scrollTop = window.pageYOffset || this.document.documentElement.scrollTop;
    const scrollThreshold = 50;
    this.isScrolled = scrollTop > scrollThreshold;
    
    // Fermer les dropdowns lors du défilement
    if (this.activeDropdown) {
      this.activeDropdown = null;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
  
    const target = event.target as HTMLElement;
    const headerElement = this.document.querySelector('.header');
  
    // Vérifier si le clic est en dehors du header
    if (headerElement && !headerElement.contains(target)) {
      // Fermer les dropdowns
      if (this.activeDropdown) {
        this.activeDropdown = null;
      }
      
      // Fermer le menu mobile
      if (this.isMobileMenuOpen) {
        this.isMobileMenuOpen = false;
      }
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    // Fermer les dropdowns avec la touche Escape
    if (this.activeDropdown) {
      this.activeDropdown = null;
    }
    
    // Fermer le menu mobile avec la touche Escape
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }

  toggleDropdown(section: string) {
    this.activeDropdown = this.activeDropdown === section ? null : section;
  }

  goToHome() {
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

  handleNavigation(page: string): void {
    // Fermer le dropdown actif
    this.activeDropdown = null;
    
    // Fermer le menu mobile
    this.isMobileMenuOpen = false;
    
    // Émettre l'événement de navigation
    this.navigate.emit(page);
    
    // Appeler la fonction de navigation si fournie
    if (this.onNavigate) {
      this.onNavigate(page);
    }
  }
}
