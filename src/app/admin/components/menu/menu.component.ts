import { Component } from '@angular/core';

import { AuthService } from '../../../core/auth.service';
import { UploadsService } from '../../../services/uploads.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent {
  
  constructor(public auth: AuthService) { }

  logout() {
    this.auth.signOut();
  }
}
