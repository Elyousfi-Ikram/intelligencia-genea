import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewsModalService, Review } from '../../../services/reviews-modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reviews-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews-modal.component.html',
  styleUrls: ['../modal.component.scss']
})
export class ReviewsModalComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  reviews: Review[] = [];
  averageRating = 0;
  showAddReviewForm = false;

  newReview = {
    name: '',
    service: '',
    rating: 5,
    comment: ''
  };

  private reviewsSubscription!: Subscription;

  constructor(private reviewsModalService: ReviewsModalService) { }

  ngOnInit() {
    this.reviewsSubscription = this.reviewsModalService.reviews$.subscribe(reviews => {
      this.reviews = reviews;
      this.averageRating = this.reviewsModalService.getAverageRating();
    });
  }

  ngOnDestroy() {
    if (this.reviewsSubscription) {
      this.reviewsSubscription.unsubscribe();
    }
  }

  onClose() {
    this.isOpen = false;
    this.reviewsModalService.closeModal();
    this.closeModal.emit();
    this.showAddReviewForm = false;
    this.resetForm();
  }

  onOverlayClick(event: Event) {
    event.stopPropagation();
    this.onClose();
  }

  getStarStyle(starIndex: number, rating: number): any {
    const fillPercentage = this.getStarFillPercentage(starIndex, rating);
    const primaryColor = '#5d4e37';
    const lightColor = 'rgba(93, 78, 55, 0.25)';
    
    if (fillPercentage === 100) {
      return { 'color': primaryColor, 'font-weight': 'bold' };
    } else if (fillPercentage === 0) {
      return { 'color': lightColor, 'opacity': '0.6' };
    } else {
      return {
        'background': `linear-gradient(90deg, ${primaryColor} ${fillPercentage}%, ${lightColor} ${fillPercentage}%)`,
        '-webkit-background-clip': 'text',
        'background-clip': 'text',
        '-webkit-text-fill-color': 'transparent'
      };
    }
  }

  getStarFillPercentage(starIndex: number, rating: number): number {
    const starPosition = starIndex + 1;
    if (rating >= starPosition) return 100;
    if (rating <= starPosition - 1) return 0;
    return Math.round((rating - (starPosition - 1)) * 100);
  }

  getFormattedRating(): string {
    return this.averageRating.toFixed(2);
  }

  onAddReview() {
    this.showAddReviewForm = true;
  }

  onBackToReviews() {
    this.showAddReviewForm = false;
    this.resetForm();
  }

  onSubmitReview() {
    if (this.isFormValid()) {
      this.reviewsModalService.addReview({
        name: this.newReview.name,
        service: this.newReview.service,
        rating: this.newReview.rating,
        comment: this.newReview.comment
      });

      this.resetForm();
      this.showAddReviewForm = false;
      alert('Votre avis a été ajouté avec succès !');
    }
  }

  setRating(rating: number) {
    this.newReview.rating = rating;
  }

  private resetForm() {
    this.newReview = { name: '', service: '', rating: 5, comment: '' };
  }

  private isFormValid(): boolean {
    return this.newReview.name.trim() !== '' &&
      this.newReview.service.trim() !== '' &&
      this.newReview.comment.trim() !== '';
  }
}