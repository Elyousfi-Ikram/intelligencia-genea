import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, ContactComponent],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  constructor() {}

  onContactClick(): void {
    // Logique pour le bouton "Nous contacter"
    console.log('Contact button clicked');
  }

  onQuoteClick(): void {
    // Logique pour le bouton "Demander un devis"
    console.log('Quote button clicked');
  }
}