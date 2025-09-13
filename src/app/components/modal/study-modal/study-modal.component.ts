import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StudyModalService } from '../../../services/study-modal.service';
import { EmailService } from '../../../services/email.service';
import { Subscription } from 'rxjs';
import { EmailData } from '../../../config/emailjs.config';

@Component({
  selector: 'app-study-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ],
  templateUrl: './study-modal.component.html',
  styleUrls: ['../modal.component.scss']
})
export class StudyModalComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  
  private subscription!: Subscription;
  studyForm!: FormGroup;
  isSubmitting = false;
  submitStatus: 'success' | 'error' | null = null;

  constructor(
    private fb: FormBuilder,
    private studyModalService: StudyModalService,
    private emailService: EmailService
  ) {}

  ngOnInit() {
    this.initForm();
    this.subscription = this.studyModalService.isOpen$.subscribe(
      isOpen => this.isOpen = isOpen
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private initForm() {
    this.studyForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      studyType: [''],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onClose() {
    this.studyModalService.closeModal();
    this.studyForm.reset();
    this.submitStatus = null;
  }

  onOverlayClick(event: Event) {
    this.onClose();
  }

  onFieldChange(fieldName: string) {
    if (this.submitStatus === 'error') {
      this.submitStatus = null;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.studyForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitStatus = null;

      try {
        const formData = this.studyForm.value;
        
        // Validation supplémentaire
        if (!formData.name?.trim() || !formData.email?.trim() || !formData.message?.trim()) {
          throw new Error('Veuillez remplir tous les champs obligatoires');
        }

        // Créer l'objet EmailData avec le bon typage
        const emailData: EmailData = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone?.trim() || '',
          studyType: formData.studyType || '',
          message: formData.message.trim()
        };

        console.log('Données à envoyer:', emailData);
        await this.emailService.sendEmail(emailData);
        this.submitStatus = 'success';
        setTimeout(() => this.onClose(), 2000);
      } catch (error: any) {
        console.error('Erreur lors de l\'envoi:', error);
        
        // Gestion d'erreur plus spécifique
        if (error.message?.includes('insufficient authentication scopes')) {
          console.error('Erreur d\'authentification EmailJS - Vérifiez la configuration');
        }
        
        this.submitStatus = 'error';
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  get name() { return this.studyForm.get('name'); }
  get email() { return this.studyForm.get('email'); }
  get phone() { return this.studyForm.get('phone'); }
  get studyType() { return this.studyForm.get('studyType'); }
  get message() { return this.studyForm.get('message'); }
}