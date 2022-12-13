import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/_services/auth.service';
import { environment } from 'src/environments/environment';
// Highlight JS
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { SplashScreenModule } from './_metronic/partials/layout/splash-screen/splash-screen.module';
// #fake-start#
import { FakeAPIService } from './_fake/fake-api.service';
import { HttpConfigInterceptor } from './Security/interceptors/HttpConfigInterceptor';
import { MenuAsideService } from './pages/_layout/components/services/menu-aside.service';
import { MenuConfigService } from './modules/auth/_services/menu-config.service';
import { LayoutConfigService } from './pages/_layout/components/services/layout-config.service';
import { LayoutConfigStorageService } from './pages/_layout/components/services/layout-config-storage.service';
import { ToastrModule } from 'ng6-toastr-notifications';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorage } from '@angular/fire/storage';
import {DatePipe} from '@angular/common';
import { EstudiantesModule } from './pages/estudiantes/estudiantes.module';
import { RecompensasModule } from './pages/recompensas/recompensas.module';
import { BasurerosModule } from './pages/basureros/basureros.module';



// #fake-end#

function appInitializer(authService: AuthService) {
  return () => {
    return new Promise((resolve) => {
      authService.getUserByToken().subscribe().add(resolve);
    });
  };
}


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SplashScreenModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    HighlightModule,
    ClipboardModule,
    // #fake-start#
    environment.isMockEnabled
      ? HttpClientInMemoryWebApiModule.forRoot(FakeAPIService, {
        passThruUnknownUrl: true,
        dataEncapsulation: false,
      })
      : [],
    // #fake-end#
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    ToastrModule.forRoot(),
    NgbModule,
    EstudiantesModule,
    RecompensasModule,
    BasurerosModule,
  ],
  providers: [
    LayoutConfigStorageService,
    LayoutConfigService,
    DatePipe,
    MenuAsideService,
    MenuConfigService,
    AngularFireStorage,
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          xml: () => import('highlight.js/lib/languages/xml'),
          typescript: () => import('highlight.js/lib/languages/typescript'),
          scss: () => import('highlight.js/lib/languages/scss'),
          json: () => import('highlight.js/lib/languages/json')
        },
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
