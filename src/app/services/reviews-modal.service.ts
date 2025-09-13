import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Review {
  _id?: string;
  name: string;
  service: string;
  rating: number;
  comment: string;
  verified: boolean;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewsModalService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  public isOpen$ = this.isOpenSubject.asObservable();

  private apiUrl = '/api/reviews';
  private reviews: Review[] = [];
  private reviewsSubject = new BehaviorSubject<Review[]>([]);
  public reviews$ = this.reviewsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadReviews();
  }

  private loadReviews(): void {
    this.reviewsSubject.next([...this.reviews]);
    this.syncWithAPI();
  }

  private syncWithAPI(): void {
    this.http.get<Review[]>(this.apiUrl).subscribe({
      next: (apiReviews) => {
        this.reviews = apiReviews;
        this.reviewsSubject.next([...this.reviews]);
      },
      error: (error) => {
        console.error('Erreur lors de la synchronisation avec l\'API:', error);
        this.reviewsSubject.next([...this.reviews]);
      }
    });
  }

  openModal(): void {
    this.isOpenSubject.next(true);
  }

  closeModal(): void {
    this.isOpenSubject.next(false);
  }

  getAverageRating(): number {
    if (this.reviews.length === 0) return 0;
    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((total / this.reviews.length) * 10) / 10;
  }

  addReview(reviewData: Omit<Review, '_id' | 'verified'>): void {
    this.http.post<Review>(this.apiUrl, reviewData).subscribe({
      next: (savedReview) => {
        this.reviews.unshift(savedReview);
        this.reviewsSubject.next([...this.reviews]);
        console.log('Avis sauvegardé avec succès dans la base de données');
      },
      error: (error) => {
        console.error('Erreur lors de la sauvegarde de l\'avis:', error);
        const tempReview: Review = {
          ...reviewData,
          verified: false
        };
        this.reviews.unshift(tempReview);
        this.reviewsSubject.next([...this.reviews]);
      }
    });
  }
}