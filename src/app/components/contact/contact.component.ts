import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StudyModalService } from '../../services/study-modal.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  disabled: boolean = false;

  constructor(
    private router: Router,
    private studyModalService: StudyModalService
  ) {}

  onContactClick() {
    if (!this.disabled) {
      this.studyModalService.openModal();
    }
  }
}