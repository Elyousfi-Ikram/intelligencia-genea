import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegalModalService } from '../../../services/legal-modal.service';

@Component({
  selector: 'app-legal-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legal-modal.component.html'
  // styleUrls supprimé - les styles sont maintenant dans modal.component.scss
})
export class LegalModalComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  constructor(private legalModalService: LegalModalService) {}

  onClose() {
    this.legalModalService.closeModal();
    this.closeModal.emit();
  }

  onOverlayClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}