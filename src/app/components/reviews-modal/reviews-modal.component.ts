import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewsModalService, Review } from '../../services/reviews-modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reviews-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews-modal.component.html',
  styleUrls: ['./reviews-modal.component.scss']
})
export class ReviewsModalComponent implements OnInit, OnDestroy {
  isOpen = false;
  reviews: Review[] = [];
  averageRating = 0;
  totalReviews = 0;
  showAddReviewForm = false;
  private subscription!: Subscription;
  private reviewsSubscription!: Subscription;

  // Propriétés du formulaire
  newReview = {
    name: '',
    service: '',
    rating: 5,
    comment: ''
  };

  constructor(private reviewsModalService: ReviewsModalService) {}

  ngOnInit() {
    this.subscription = this.reviewsModalService.isOpen$.subscribe(isOpen => {
      this.isOpen = isOpen;
    });
    
    // S'abonner aux changements de la liste des avis
    this.reviewsSubscription = this.reviewsModalService.reviews$.subscribe(reviews => {
      this.reviews = reviews;
      this.updateStats();
    });
    
    // Initialiser les données
    this.reviews = this.reviewsModalService.getReviews();
    this.updateStats();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.reviewsSubscription) {
      this.reviewsSubscription.unsubscribe();
    }
  }

  // Méthode pour mettre à jour les statistiques
  private updateStats() {
    this.averageRating = this.reviewsModalService.getAverageRating();
    this.totalReviews = this.reviewsModalService.getTotalReviews();
  }

  onClose() {
    this.reviewsModalService.closeModal();
    // Réinitialiser le formulaire et revenir à la vue des avis
    this.showAddReviewForm = false;
    this.resetForm();
  }

  onOverlayClick(event: Event) {
    this.onClose();
  }

  getStarArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, index) => index < rating);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getRoundedRating(): number {
    return Math.round(this.averageRating);
  }

  getStarFillPercentage(starIndex: number, rating: number): number {
    if (starIndex < Math.floor(rating)) {
      return 100; // Étoile complètement remplie
    } else if (starIndex === Math.floor(rating)) {
      return (rating - Math.floor(rating)) * 100; // Étoile partiellement remplie
    } else {
      return 0; // Étoile vide
    }
  }

  getStarStyle(starIndex: number, rating: number): any {
    const fillPercentage = this.getStarFillPercentage(starIndex, rating);
    
    if (fillPercentage === 100) {
      // Étoile complètement remplie
      return {
        color: '#f3e1c2'
      };
    } else if (fillPercentage === 0) {
      // Étoile vide
      return {
        color: 'rgba(255, 255, 255, 0.3)'
      };
    } else {
      // Étoile partiellement remplie - utilisation du background-image
      return {
        background: `linear-gradient(90deg, #f3e1c2 ${fillPercentage}%, rgba(255, 255, 255, 0.3) ${fillPercentage}%)`,
        '-webkit-background-clip': 'text',
        'background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
        'color': 'transparent'
      };
    }
  }

  getStarClipPath(starIndex: number, rating: number): any {
    const fillPercentage = this.getStarFillPercentage(starIndex, rating);
    return {
      'clip-path': `inset(0 ${100 - fillPercentage}% 0 0)`
    };
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
      // Ajouter le nouvel avis via le service
      this.reviewsModalService.addReview({
        name: this.newReview.name,
        service: this.newReview.service,
        rating: this.newReview.rating,
        comment: this.newReview.comment
      });
      
      // Réinitialiser le formulaire et revenir à la liste
      this.resetForm();
      this.showAddReviewForm = false;
      
      // Afficher un message de succès
      this.showSuccessMessage();
    }
  }

  private resetForm() {
    this.newReview = {
      name: '',
      service: '',
      rating: 5,
      comment: ''
    };
  }

  private isFormValid(): boolean {
    return this.newReview.name.trim() !== '' && 
           this.newReview.service.trim() !== '' && 
           this.newReview.comment.trim() !== '';
  }

  private showSuccessMessage() {
    // Vous pouvez remplacer ceci par un toast ou une notification plus élégante
    alert('Votre avis a été ajouté avec succès !');
  }

  // Ajouter cette méthode dans la classe ReviewsModalComponent
  setRating(rating: number) {
    this.newReview.rating = rating;
  }

  // Nouvelle méthode pour supprimer un avis
  // Supprimer ces méthodes :
  // onDeleteReview(reviewId: number, reviewerName: string) { ... }
  // onDeleteAllNewReviews() { ... }
  // hasNewReviews(): boolean { ... }
  onDeleteReview(reviewId: number, reviewerName: string) {
    const confirmMessage = `Êtes-vous sûr de vouloir supprimer l'avis de ${reviewerName} ?`;
    
    if (confirm(confirmMessage)) {
      this.reviewsModalService.removeReview(reviewId);
      
      // Optionnel : afficher un message de confirmation
      console.log(`Avis de ${reviewerName} supprimé avec succès`);
    }
  }

  // Méthode pour supprimer tous les avis non vérifiés (optionnel)
  onDeleteAllNewReviews() {
    const newReviews = this.reviews.filter(review => !review.verified);
    
    if (newReviews.length === 0) {
      alert('Aucun nouvel avis à supprimer.');
      return;
    }
    
    const confirmMessage = `Êtes-vous sûr de vouloir supprimer tous les ${newReviews.length} nouveaux avis ?`;
    
    if (confirm(confirmMessage)) {
      newReviews.forEach(review => {
        this.reviewsModalService.removeReview(review.id);
      });
      
      alert(`${newReviews.length} avis supprimés avec succès.`);
    }
  }

  // Méthode pour vérifier s'il y a des nouveaux avis
  hasNewReviews(): boolean {
    return this.reviews.some(review => !review.verified);
  }
}