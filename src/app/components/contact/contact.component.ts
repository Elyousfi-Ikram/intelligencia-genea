import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StudyModalComponent } from '../study-modal/study-modal.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, StudyModalComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  @Input() buttonText: string = 'Nous contacter';
  @Input() buttonClass: string = 'btn-primary';
  @Input() showIcon: boolean = true;
  @Input() iconType: 'email' | 'phone' | 'form' = 'form';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() variant: 'primary' | 'secondary' | 'outline' = 'primary';
  @Input() disabled: boolean = false;
  
  @Output() contactClick = new EventEmitter<void>();

  showModal = false;

  constructor(private router: Router) {}

  onContactClick() {
    if (!this.disabled) {
      this.showModal = true;
      this.contactClick.emit();
    }
  }

  onCloseModal() {
    this.showModal = false;
  }

  handleNavigateToHonoraires() {
    this.router.navigate(['/nos-honoraires']);
  }

  getIconClass(): string {
    switch (this.iconType) {
      case 'email':
        return '✉️';
      case 'phone':
        return '📞';
      case 'form':
      default:
        return '📝';
    }
  }

  getButtonClasses(): string {
    const baseClass = 'contact-btn';
    const sizeClass = `contact-btn--${this.size}`;
    const variantClass = `contact-btn--${this.variant}`;
    
    return `${baseClass} ${sizeClass} ${variantClass} ${this.buttonClass}`;
  }
}