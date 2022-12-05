import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TranslationService } from './modules/i18n/translation.service';
// language list
import { locale as enLang } from './modules/i18n/vocabs/en';
import { locale as chLang } from './modules/i18n/vocabs/ch';
import { locale as esLang } from './modules/i18n/vocabs/es';
import { locale as jpLang } from './modules/i18n/vocabs/jp';
import { locale as deLang } from './modules/i18n/vocabs/de';
import { locale as frLang } from './modules/i18n/vocabs/fr';
import { SplashScreenService } from './_metronic/partials/layout/splash-screen/splash-screen.service';
import { Router, NavigationEnd, NavigationError } from '@angular/router';
import { Subscription } from 'rxjs';
import { TableExtendedService } from './_metronic/shared/crud-table';
import { environment } from 'src/environments/environment.prod';
import { AuthService } from './modules/auth/_services/auth.service';
import { MaterialService } from './pages/Production/_core/services/material.service';
import createActivityDetector from 'activity-detector';
import { InformationModalComponent } from './pages/_shared/information-modal/information-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private intervalRefreshToken = null;

  activityDetector = createActivityDetector({
    timeToIdle: environment.timeToIdle,
    inactivityEvents: [],
		activityEvents:['click', 'mousemove', 'keydown', 'DOMMouseScroll', 'mousewheel', 'mousedown', 'touchstart', 'touchmove', 'focus'] 
  })
	confirmationTimeout: NodeJS.Timeout;

  constructor(
    private translationService: TranslationService,
    private splashScreenService: SplashScreenService,
    private router: Router,
    private tableService: TableExtendedService,
    private authService: AuthService,
    public test_s: MaterialService,
    public modalService: NgbModal
  ) {
    // register translations
    this.translationService.loadTranslations(
      enLang,
      chLang,
      esLang,
      jpLang,
      deLang,
      frLang
    );
  }

  ngOnInit() {
    
    this.activityDetector.on('idle', ()=>{this.notifyInactivity()})
    
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // clear filtration paginations and others
        this.tableService.setDefaults();
        // hide splash screen
        this.splashScreenService.hide();

        // scroll to top on every route change
        window.scrollTo(0, 0);

        // to display back the body content
        setTimeout(() => {
          document.body.classList.add('page-loaded');
        }, 500);
      }
    });
    this.unsubscribe.push(routerSubscription);

		let modalInformationActive = false;
		this.intervalRefreshToken = setInterval(() => {
			if (this.authService.isLoggedIn()) {
				this.authService.refreshToken().subscribe((data) => { 
					if(data.MostrarMensaje && !modalInformationActive){
						modalInformationActive = true;
						const modalRef = this.modalService.open(InformationModalComponent, {size:'md'});
						modalRef.componentInstance.titulo = data.Titulo;
						modalRef.componentInstance.descripcion = data.Mensaje;

						modalRef.result.then((result) => {
								modalInformationActive = false;
								this.authService.logout();
							}, (reason) => {
								modalInformationActive = false;
								this.authService.logout();
						}); 
					}
				});
			}
			// else {
			// 	this.authService.logout();
			// }
		}, environment.timeToRefreshToken)
  }

	notifyInactivity(){
		if(this.authService.isLoggedIn()){
			this.activityDetector.stop();
			const modalRef = this.modalService.open(InformationModalComponent);
			modalRef.componentInstance.titulo = 'AVISO!';
			modalRef.componentInstance.descripcion = 'Hola, ¿sigues ahí?';
			this.confirmationTimeout = setTimeout(()=>{
				console.log('timeout!');
				
				modalRef.dismiss();
				this.authService.logout();
			},environment.timeToLogOut)
	
			modalRef.result.then(
				(result) => {
					// este codigo no se ejecuta pero por si acaso
					this.activityDetector.on('idle',()=>{this.notifyInactivity()})
					this.activityDetector.initialState = 'active';
	
					this.activityDetector.init();
					// este codigo no se ejecuta pero por si acaso
				}, (reason) => {
					clearTimeout(this.confirmationTimeout);
					this.activityDetector.on('idle',()=>{this.notifyInactivity()})
					this.activityDetector.initialState = 'active';
	
					this.activityDetector.init();
				}); 
		}
	}

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
