import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactComponent } from '../contact/contact.component';


@Component({
  selector: 'app-agence',
  standalone: true,
  imports: [CommonModule, ContactComponent],

  templateUrl: './agence.component.html',
  styleUrls: ['./agence.component.scss']
})
export class AgenceComponent {
  showStudyModal = false;
  constructor() { }

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
}