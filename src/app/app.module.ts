import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LayoutComponent } from './@ui/layout/layout.component';
import { FooterComponent } from './@ui/footer/footer.component';
import { SidebarComponent } from './@ui/sidebar/sidebar.component';
import { TopbarComponent } from './@ui/topbar/topbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './@core/interceptors/auth.interceptor';
import { appInit } from './app-init';
import { AuthService } from './@core/services/auth.service';
import { UserAvatarComponent } from './@shared/user-avatar/user-avatar.component';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { ImageUploaderComponent } from './@shared/image-uploader/image-uploader.component';

registerLocaleData(localeIt);

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    FooterComponent,
    SidebarComponent,
    TopbarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    UserAvatarComponent,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInit,
      multi: true,
      deps: [AuthService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: LOCALE_ID,
      useValue: 'it',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
