import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-logo.component.html',
  styleUrls: ['./team-logo.component.scss'],
})
export class TeamLogoComponent {
  @Input() team: any;

  get bg() {
    return this.team.logoUrl
      ? this.team.logoUrl
      : '/assets/images/placeholder.png';
  }
}
