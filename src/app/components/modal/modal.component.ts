import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegalModalService } from '../../services/legal-modal.service';
import { PolicyModalService } from '../../services/policy-modal.service';
import { CookiesModalService } from '../../services/cookies-modal.service';
import { ReviewsModalService } from '../../services/reviews-modal.service';
import { StudyModalService } from '../../services/study-modal.service';
import { LegalModalComponent } from './legal-modal/legal-modal.component';
import { PolicyModalComponent } from './policy-modal/policy-modal.component';
import { CookiesModalComponent } from './cookies-modal/cookies-modal.component';
import { ReviewsModalComponent } from './reviews-modal/reviews-modal.component';
import { StudyModalComponent } from './study-modal/study-modal.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    CommonModule,
    LegalModalComponent,
    PolicyModalComponent,
    CookiesModalComponent,
    ReviewsModalComponent,
    StudyModalComponent
  ],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent {
  constructor(
    public legalService: LegalModalService,
    public policyService: PolicyModalService,
    public cookiesService: CookiesModalService,
    public reviewsService: ReviewsModalService,
    public studyService: StudyModalService
  ) { }
}