import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EStatusCart } from 'src/app/@core/models/cart.model';
import { StatusCartPipe } from 'src/app/@core/pipes/status-cart.pipe';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-tag-status-cart',
  standalone: true,
  imports: [CommonModule, TagModule, StatusCartPipe],
  templateUrl: './tag-status-cart.component.html',
  styleUrls: ['./tag-status-cart.component.scss'],
  providers: [StatusCartPipe],
})
export class TagStatusCartComponent {
  @Input() status: EStatusCart | null = null;

  constructor(private cartPipe: StatusCartPipe) {}
}
