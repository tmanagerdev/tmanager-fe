import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/@core/services/navigation.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  languages = [
    { key: 'IT', value: 'it', flag: '🇮🇹' },
    { key: 'EN', value: 'en', flag: '🇬🇧' },
  ];
  currentLang: string = 'IT';
  constructor(private navigationService: NavigationService) {}

  ngOnInit(): void {}

  toggleBar() {
    this.navigationService.toggleLayout();
  }

  changeLanguage(value: any) {
    console.log('choose', value);
  }
}
