import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  currentTheme: 'dark' | 'light' = 'dark';
  currentTheme$: Subject<'dark' | 'light'> = new Subject();

  constructor() {}

  changeTheme(newTheme: 'dark' | 'light') {
    this.currentTheme = newTheme;
    this.currentTheme$.next(newTheme);
  }
}