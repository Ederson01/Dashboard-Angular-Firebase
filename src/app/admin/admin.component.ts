import { Component } from '@angular/core';

@Component({
  selector: 'admin-pages',
  template: `
  <div class="wrapper normal-menu" [ngClass]="alterMenu ? 'mini-menu' : 'normal-menu'">
    <div class="menu">
      <app-menu></app-menu>
      <div class="menu-background"></div>
    </div>
    <div class="main-panel clearfix">
      <app-header></app-header>
      <notification-message></notification-message>
      <router-outlet></router-outlet>
      <app-footer></app-footer>
    </div>
  </div>
  `,
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  alterMenu = false;
}
