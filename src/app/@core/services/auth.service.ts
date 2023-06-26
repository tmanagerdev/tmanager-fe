import { Injectable } from '@angular/core';
import { KEY_STORAGE_USER } from '../constant';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated: boolean = false;
  private _currentUser$: Subject<any> = new Subject();
  private _currentUser: any = null;
  currentUser$ = this._currentUser$.asObservable();

  get currentUser(): any {
    return this._currentUser;
  }

  constructor() {}

  initializeUser() {
    const user = localStorage.getItem(KEY_STORAGE_USER);
    if (user) {
      console.log(user);
      this.setCurrentUser(JSON.parse(user));
    }
  }

  setCurrentUser(data: any) {
    console.log('current user', data);
    this._currentUser$.next(data);
    this._currentUser = data;
    localStorage.setItem(KEY_STORAGE_USER, JSON.stringify(data));
  }

  getJwtToken() {
    return this.currentUser ? this.currentUser.token : null;
  }

  signOut() {
    this._currentUser$.next(null);
    this._currentUser = null;
    localStorage.removeItem(KEY_STORAGE_USER);
  }
}
