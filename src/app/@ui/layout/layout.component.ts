import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { tap } from 'rxjs';
import { NavigationService } from 'src/app/@core/services/navigation.service';
import { ThemeService } from 'src/app/@core/services/theme.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  @ViewChild('page', { static: false }) page?: ElementRef<HTMLElement>;

  constructor(
    private navigationService: NavigationService,
    private themeService: ThemeService,
    private renderer: Renderer2
  ) {
    this.navigationService.toggleLayout$
      .pipe(tap((res) => this.togglePage(res)))
      .subscribe();

    this.themeService.currentTheme$
      .pipe(tap((res) => this.changeTheme(res)))
      .subscribe();
  }

  ngOnInit(): void {}

  togglePage(active: boolean) {
    active
      ? this.renderer.removeClass(this.page!.nativeElement, 'active')
      : this.renderer.addClass(this.page!.nativeElement, 'active');
  }

  changeTheme(theme: 'dark' | 'light') {
    if (theme === 'dark') {
      this.renderer.removeClass(document.body, 'theme-light');
      this.renderer.addClass(document.body, 'theme-dark');
    } else if (theme === 'light') {
      this.renderer.removeClass(document.body, 'theme-dark');
      this.renderer.addClass(document.body, 'theme-light');
    }
  }
}