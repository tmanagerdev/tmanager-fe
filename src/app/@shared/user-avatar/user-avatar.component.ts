import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/@core/services/auth.service';
import { Router } from '@angular/router';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [CommonModule, MenuModule],
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
})
export class UserAvatarComponent {
  user: any;
  constructor(public authService: AuthService, private router: Router) {
    this.user = this.authService.currentUser;
  }

  items: MenuItem[] = [
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {
        this.authService.signOut();
        this.router.navigate(['/auth']);
      },
    },
  ];
}
