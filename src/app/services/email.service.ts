import { Injectable } from '@angular/core';
import { EmailConfig, EmailData } from '../config/emailjs.config';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private emailConfig: EmailConfig) { }

  async sendEmail(formData: EmailData) {
    const emailData = {
      from_name: formData.name,
      from_email: formData.email,
      to_email: 'intelligencia.lagarde@gmail.com',
      subject: 'Demande d\'étude généalogique',
      message: formData.message,
      study_type: formData.studyType || 'Non spécifié',
      phone: formData.phone || 'Non renseigné'
    };

    this.emailConfig.sendMail(emailData);
  }

}