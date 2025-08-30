import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-study-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './study-modal.component.html',
  styleUrls: ['./study-modal.component.scss']
})
export class StudyModalComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  studyForm!: FormGroup;
  isSubmitting = false;
  submitStatus: 'success' | 'error' | null = null;

  // Ajout des options pour le type d'étude
  studyTypeOptions = [
    {
      label: 'Recherches généalogiques',
      options: [
        { value: 'ascendance-complete', label: 'Ascendance complète' },
        { value: 'ascendance-patronymique', label: 'Ascendance patronymique' },
        { value: 'descendance', label: 'Descendance' },
        { value: 'recherche-ciblée', label: 'Recherche ciblée' }
      ]
    },
    {
      label: 'Études spécialisées',
      options: [
        { value: 'histoire-familiale', label: 'Histoire familiale' },
        { value: 'biographie-ancetre', label: 'Biographie d\'ancêtre' },
        { value: 'reconstitution-parcours', label: 'Reconstitution de parcours' }
      ]
    },
    {
      label: 'Services complémentaires',
      options: [
        { value: 'arbre-illustré', label: 'Arbre généalogique illustré' },
        { value: 'livre-famille', label: 'Livre de famille' },
        { value: 'consultation', label: 'Consultation généalogique' }
      ]
    }
  ];

  // Configuration EmailJS
  private readonly EMAILJS_CONFIG = {
    SERVICE_ID: 'service_vi300ql',
    TEMPLATE_ID: 'template_5dvjz8h',
    PUBLIC_KEY: 'VwyATdIIMBEaFJbkc'
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  ngOnDestroy() {
    // Cleanup si nécessaire
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
    this.closeModal.emit();
    this.studyForm.reset();
    this.submitStatus = null;
  }

  onOverlayClick(event: Event) {
    // Fermer la modal si on clique sur l'overlay (pas sur le contenu)
    this.onClose();
  }

  onFieldChange(fieldName: string) {
    // Réinitialiser le statut d'erreur quand l'utilisateur modifie un champ
    if (this.submitStatus === 'error') {
      this.submitStatus = null;
    }
  }

  // Méthode d'envoi
  async onSubmit() {
    if (this.studyForm.invalid) {
      this.studyForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitStatus = null;

    try {
      const formValue = this.studyForm.value;
      
      // Préparer les données pour EmailJS
      const templateParams = {
        from_name: formValue.name,
        from_email: formValue.email,
        phone: formValue.phone || 'Non renseigné',
        study_type: formValue.studyType || 'Non spécifié',
        message: formValue.message,
        to_name: 'Équipe Intelligencia Genea',
        reply_to: formValue.email
      };

      // Envoyer l'email via EmailJS
      const response = await emailjs.send(
        this.EMAILJS_CONFIG.SERVICE_ID,
        this.EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        this.EMAILJS_CONFIG.PUBLIC_KEY
      );

      console.log('Email envoyé avec succès:', response);
      this.submitStatus = 'success';

      // Reset form après succès
      setTimeout(() => {
        this.studyForm.reset();
        this.submitStatus = null;
        this.onClose();
      }, 2000);

    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      this.submitStatus = 'error';
    } finally {
      this.isSubmitting = false;
    }
  }

  // Getters pour faciliter l'accès aux contrôles du formulaire
  get name() { return this.studyForm.get('name'); }
  get email() { return this.studyForm.get('email'); }
  get phone() { return this.studyForm.get('phone'); }
  get studyType() { return this.studyForm.get('studyType'); }
  get message() { return this.studyForm.get('message'); }
}