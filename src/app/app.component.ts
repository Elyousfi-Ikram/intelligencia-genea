import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ScrollToTopComponent } from './components/scroll-to-top/scroll-to-top.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';
import { ModalComponent } from './components/modal/modal.component';
import { HttpClientModule } from '@angular/common/http'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HttpClientModule,
    HeaderComponent,
    ScrollToTopComponent,
    FooterComponent,
    ContactComponent,
    ModalComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'intelligencia-genea-Angular';

  constructor(private router: Router) { }

  onNavigate(route: string): void {
    this.router.navigate([route]);
  }
}