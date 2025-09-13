import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookiesModalService } from '../../../services/cookies-modal.service';

@Component({
  selector: 'app-cookies-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cookies-modal.component.html'
  // styleUrls supprimé - les styles sont maintenant dans modal.component.scss
})
export class CookiesModalComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  constructor(private cookiesModalService: CookiesModalService) {}

  onClose() {
    this.cookiesModalService.closeModal();
    this.closeModal.emit();
  }

  onOverlayClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}