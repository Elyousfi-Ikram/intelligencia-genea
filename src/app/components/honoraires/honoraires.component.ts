import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-honoraires',
  standalone: true,
  imports: [CommonModule, ContactComponent],
  templateUrl: './honoraires.component.html',
  styleUrls: ['./honoraires.component.scss']
})
export class HonorairesComponent {
  constructor() {}
}