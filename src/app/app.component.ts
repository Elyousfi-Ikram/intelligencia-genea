import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BannerComponent } from './components/banner/banner.component';
import { RouterOutlet } from '@angular/router';
import { ScrollToTopComponent } from './components/scroll-to-top/scroll-to-top.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BannerComponent, RouterOutlet, ScrollToTopComponent, FooterComponent],
  template: `
    <app-banner (navigate)="onNavigate($event)"></app-banner>
    <router-outlet></router-outlet>
    <app-scroll-to-top></app-scroll-to-top>
    <app-footer></app-footer>
  `
})
export class AppComponent {
  title = 'intelligencia-genea-Angular';

  constructor(private router: Router) {}

  onNavigate(route: string) {
    this.router.navigate([route]);
  }
}