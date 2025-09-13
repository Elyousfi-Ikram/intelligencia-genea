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
  public isOpen$ = this.isOpenSubject.asObservable();

  openModal(): void {
    this.isOpenSubject.next(true);
  }

  closeModal(): void {
    this.isOpenSubject.next(false);
  }

  get isOpen(): boolean {
    return this.isOpenSubject.value;
  }

  // Méthode de compatibilité
  openMentionsLegales(): void {
    this.openModal();
  }
}