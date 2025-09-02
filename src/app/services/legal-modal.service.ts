import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface LegalContent {
  title: string;
  section: string;
}

@Injectable({
  providedIn: 'root'
})
export class LegalModalService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  private contentSubject = new BehaviorSubject<LegalContent | null>(null);

  public isOpen$ = this.isOpenSubject.asObservable();
  public content$ = this.contentSubject.asObservable();

  openModal(content: LegalContent): void {
    this.contentSubject.next(content);
    this.isOpenSubject.next(true);
  }

  closeModal(): void {
    this.isOpenSubject.next(false);
    this.contentSubject.next(null);
  }

  openMentionsLegales(): void {
    this.openModal({
      title: 'Mentions Légales',
      section: 'mentions'
    });
  }

  openPolitiqueConfidentialite(): void {
    this.openModal({
      title: 'Politique de Confidentialité',
      section: 'confidentialite'
    });
  }

  openPolitiqueCookies(): void {
    this.openModal({
      title: 'Politique de Cookies',
      section: 'cookies'
    });
  }
}