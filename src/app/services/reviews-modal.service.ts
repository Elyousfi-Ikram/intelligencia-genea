import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Review {
  id: number;
  name: string;
  service: string;
  rating: number;
  comment: string;
  verified: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewsModalService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  public isOpen$ = this.isOpenSubject.asObservable();

  // Données par défaut
  private defaultReviews: Review[] = [
    {
      id: 1,
      name: 'Jean-Pierre L.',
      service: 'Recherches d\'Héritiers',
      rating: 5,
      comment: 'Votre cabinet a su retrouver rapidement les héritiers de mon oncle, ce qui a permis de régler une succession qui semblait bloquée depuis des années. Merci pour votre efficacité.',
      verified: true
    },
    {
      id: 2,
      name: 'Claire M.',
      service: 'Généalogie Familiale',
      rating: 5,
      comment: 'Un arbre généalogique complet, riche en détails et illustré par des archives passionnantes. C\'est un cadeau que je garderai précieusement pour mes enfants.',
      verified: true
    },
    {
      id: 3,
      name: 'François T.',
      service: 'Investigations Privées',
      rating: 4,
      comment: 'Une enquête discrète et professionnelle qui m\'a permis de confirmer mes doutes. Rapport clair et délai respecté.',
      verified: true
    },
    {
      id: 4,
      name: 'Hélène R.',
      service: 'Expertise Juridique',
      rating: 5,
      comment: 'Vos explications juridiques m\'ont permis de comprendre une situation successorale très complexe. J\'ai beaucoup apprécié la clarté et la pédagogie.',
      verified: true
    },
    {
      id: 5,
      name: 'Marc B.',
      service: 'Recherches d\'Héritiers',
      rating: 4,
      comment: 'Le travail a été sérieux et précis. La communication aurait pu être un peu plus régulière, mais le résultat est excellent.',
      verified: true
    },
    {
      id: 6,
      name: 'Isabelle D.',
      service: 'Généalogie Familiale',
      rating: 5,
      comment: 'Vous avez redonné vie à des ancêtres oubliés. Le dossier final est d\'une grande qualité, richement documenté et très émouvant.',
      verified: true
    },
    {
      id: 7,
      name: 'Nicolas F.',
      service: 'Investigations Privées',
      rating: 4,
      comment: 'Une mission délicate menée avec discrétion et professionnalisme. Les informations recueillies se sont révélées très utiles.',
      verified: true
    },
    {
      id: 8,
      name: 'Sophie L.',
      service: 'Expertise Juridique',
      rating: 5,
      comment: 'Des conseils juridiques précis et adaptés à mon dossier. J\'ai pu prendre les bonnes décisions grâce à votre accompagnement.',
      verified: true
    },
    {
      id: 9,
      name: 'Gérard P.',
      service: 'Recherches d\'Héritiers',
      rating: 5,
      comment: 'La rapidité avec laquelle vous avez retrouvé les ayants droit m\'a impressionné. Une équipe réactive et compétente.',
      verified: true
    },
    {
      id: 10,
      name: 'Valérie C.',
      service: 'Généalogie Familiale',
      rating: 5,
      comment: 'Un service chaleureux et humain. Vos recherches nous ont permis de découvrir une branche familiale au Canada, quelle surprise !',
      verified: true
    },
    {
      id: 11,
      name: 'Antoine M.',
      service: 'Investigations Privées',
      rating: 4,
      comment: 'Résultats clairs et preuves solides. L\'approche est très professionnelle, même si les délais ont été un peu longs.',
      verified: true
    },
    {
      id: 12,
      name: 'Patricia G.',
      service: 'Expertise Juridique',
      rating: 5,
      comment: 'Un accompagnement juridique transparent et rassurant. Les explications étaient toujours adaptées et compréhensibles.',
      verified: true
    },
    {
      id: 13,
      name: 'Olivier S.',
      service: 'Recherches d\'Héritiers',
      rating: 5,
      comment: 'Votre intervention a été décisive dans une succession compliquée. Merci pour votre disponibilité et vos conseils avisés.',
      verified: true
    },
    {
      id: 14,
      name: 'Christine H.',
      service: 'Généalogie Familiale',
      rating: 5,
      comment: 'Le livret généalogique est magnifique. Mes parents ont été très touchés par ce travail qui retrace notre histoire familiale.',
      verified: true
    },
    {
      id: 15,
      name: 'Laurent V.',
      service: 'Investigations Privées',
      rating: 4,
      comment: 'Une enquête sérieuse, respectueuse et bien documentée. Je recommande vos services sans hésiter.',
      verified: true
    }
  ];

  private reviews: Review[] = [];
  private readonly STORAGE_KEY = 'intelligencia-reviews';

  // Subject pour notifier les changements dans la liste des avis
  private reviewsSubject = new BehaviorSubject<Review[]>([]);
  public reviews$ = this.reviewsSubject.asObservable();

  constructor() {
    this.loadReviews();
  }

  // Charger les avis depuis le localStorage ou utiliser les données par défaut
  private loadReviews(): void {
    try {
      const savedReviews = localStorage.getItem(this.STORAGE_KEY);
      if (savedReviews) {
        this.reviews = JSON.parse(savedReviews);
      } else {
        // Première visite : utiliser les données par défaut et les sauvegarder
        this.reviews = [...this.defaultReviews];
        this.saveReviews();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
      this.reviews = [...this.defaultReviews];
    }
    
    this.reviewsSubject.next([...this.reviews]);
  }

  // Sauvegarder les avis dans le localStorage
  private saveReviews(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.reviews));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des avis:', error);
    }
  }

  openModal(): void {
    this.isOpenSubject.next(true);
  }

  closeModal(): void {
    this.isOpenSubject.next(false);
  }

  get isOpen(): boolean {
    return this.isOpenSubject.value;
  }

  getReviews(): Review[] {
    return this.reviews;
  }

  getAverageRating(): number {
    if (this.reviews.length === 0) return 0;
    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((total / this.reviews.length) * 10) / 10;
  }

  getTotalReviews(): number {
    return this.reviews.length;
  }

  // Ajouter un avis et le sauvegarder
  addReview(reviewData: Omit<Review, 'id' | 'verified'>): void {
    const newReview: Review = {
      id: this.getNextId(),
      ...reviewData,
      verified: false
    };
    
    this.reviews.unshift(newReview);
    this.saveReviews(); // Sauvegarder immédiatement
    this.reviewsSubject.next([...this.reviews]);
  }

  private getNextId(): number {
    if (this.reviews.length === 0) return 1;
    return Math.max(...this.reviews.map(r => r.id)) + 1;
  }

  // Supprimer un avis
  removeReview(id: number): void {
    this.reviews = this.reviews.filter(review => review.id !== id);
    this.saveReviews();
    this.reviewsSubject.next([...this.reviews]);
  }

  // Marquer un avis comme vérifié
  verifyReview(id: number): void {
    const review = this.reviews.find(r => r.id === id);
    if (review) {
      review.verified = true;
      this.saveReviews();
      this.reviewsSubject.next([...this.reviews]);
    }
  }

  // Réinitialiser aux données par défaut (optionnel)
  resetToDefault(): void {
    this.reviews = [...this.defaultReviews];
    this.saveReviews();
    this.reviewsSubject.next([...this.reviews]);
  }
}