import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

// Interface pour typer les données
export interface EmailData {
  name: string;
  email: string;
  phone?: string;
  studyType?: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailConfig {

  private serviceId = 'service_fakz66t';
  private templateId = 'template_d8nxzgy';
  private publicKey = 'mJbhfOPzVINELgwsg';

  constructor() {
    // Initialiser EmailJS avec la clé publique
    emailjs.init(this.publicKey);
  }

  async sendMail(emailData: any) {
    try {
      console.log('Envoi email avec les paramètres:', emailData);
      const response = await emailjs.send(this.serviceId, this.templateId, emailData);
      console.log('Email envoyé avec succès:', response);
      return response;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      throw error;
    }
  }

}