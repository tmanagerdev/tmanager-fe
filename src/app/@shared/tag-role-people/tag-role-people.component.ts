import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { PeopleRolePipe } from 'src/app/@core/pipes/people-role.pipe';

@Component({
  selector: 'app-tag-role-people',
  standalone: true,
  imports: [CommonModule, TagModule, PeopleRolePipe],
  templateUrl: './tag-role-people.component.html',
  styleUrls: ['./tag-role-people.component.scss'],
  providers: [PeopleRolePipe],
})
export class TagRolePeopleComponent {
  category: any;
  @Input() set people(p: any) {
    this.category =
      p.people && p.people.category
        ? this.rolePipe.transform(p.people.category)
        : this.rolePipe.transform(p.category);
  }

  constructor(private rolePipe: PeopleRolePipe) {}
}
