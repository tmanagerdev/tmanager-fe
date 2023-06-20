import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { tap } from 'rxjs';
import { IMenu } from 'src/app/@core/models/menu.model';
import { NavigationService } from 'src/app/@core/services/navigation.service';
import { ThemeService } from 'src/app/@core/services/theme.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  menu: IMenu[] = [];
  @ViewChild('sidebar', { static: false }) sidebar?: ElementRef<HTMLElement>;

  themeControl: FormControl = new FormControl(false);

  constructor(
    private renderer: Renderer2,
    private themeService: ThemeService,
    private navigationService: NavigationService
  ) {
    this.navigationService.toggleLayout$
      .pipe(tap((res) => this.toggleBar(res)))
      .subscribe();
  }

  ngOnInit(): void {
    this.themeControl.valueChanges
      .pipe(tap((theme) => this.changeTheme(theme)))
      .subscribe();

    this.menu = [
      {
        label: '',
        items: [
          {
            label: 'Prossimi eventi',
            icon: 'event_upcoming',
            routerLink: ['/', 'personal-events'],
          },
          {
            label: 'Prenotazioni',
            icon: 'shopping_cart',
            routerLink: ['/', 'personal-cart'],
          },
        ],
      },
      {
        label: 'Admin',
        items: [
          {
            label: 'Città',
            icon: 'location_city',
            routerLink: ['/', 'city'],
          },
          {
            label: 'Campionati',
            icon: 'table_rows',
            routerLink: ['/', 'league'],
          },
          {
            label: 'Squadre',
            icon: 'sports_soccer',
            routerLink: ['/', 'team'],
          },
          {
            label: 'Calendari',
            icon: 'calendar_month',
            routerLink: ['/', 'calendar'],
          },
          {
            label: 'Utenti',
            icon: 'group',
            routerLink: ['/', 'user'],
          },
          {
            label: 'Servizi',
            icon: 'local_mall',
            routerLink: ['/', 'activity'],
          },
          {
            label: 'Prenotazioni',
            icon: 'data_check',
            routerLink: ['/', 'cart'],
          },
        ],
      },
    ];
  }

  toggleBar(active: boolean) {
    active
      ? this.renderer.removeClass(this.sidebar!.nativeElement, 'active')
      : this.renderer.addClass(this.sidebar!.nativeElement, 'active');
  }

  closeBar() {
    this.navigationService.toggleLayout();
  }

  changeTheme(theme: boolean) {
    theme
      ? this.themeService.changeTheme('light')
      : this.themeService.changeTheme('dark');
  }

  setTheme(theme: boolean) {
    this.themeControl.setValue(theme);
  }

  getTheme() {
    return this.themeService.currentTheme;
  }
}
