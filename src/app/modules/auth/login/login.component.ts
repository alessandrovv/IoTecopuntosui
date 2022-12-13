import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserModel } from '../_models/user.model';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationCodeComponent } from './confirmation-code/confirmation-code.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  // KeenThemes mock, change it to:
  // defaultAuth = {
  //   email: '',
  //   password: '',
  // };
  mesageError: any = '';
  defaultAuth: any = {
    email: 'admin@demo.com',
    password: 'demo',
  };
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private modalService:NgbModal
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl =
        this.route.snapshot.queryParams['returnUrl'.toString()] || '/';

    //this.openModalConfirm(1);
    }

    

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      usuario: [
        null, 
        Validators.compose([
          Validators.required
        ]),
      ],
      password: [
        null,
        Validators.compose([
          Validators.required
        ]),
      ],
    });
  }

  submit() {
    this.hasError = false;
    // const loginSubscr = this.authService
    //   .login(this.f.email.value, this.f.password.value)
    //   .pipe(first())
    //   .subscribe((user: UserModel) => {
    //     if (user) {
    //       this.router.navigate([this.returnUrl]);
    //     } else {
    //       this.hasError = true;
    //     }
    //   });
    // this.unsubscribe.push(loginSubscr);

    let model = {
      Usuario: this.f.usuario.value, 
      Password: this.f.password.value
    }
    this.authService.login(model)
			.subscribe(response => {
				if (response.Ok) {
          //if(response.IpInvalid){
          //  const body = {
          //    To: `whatsapp:+51${response.Telefono.replace(' ','')}`,
          //    From: "whatsapp:+14155238886",
          //    Body: `Alguien está intentando ingresar a tu cuenta. \nSi eres tú, ingresa el siguiente código: ${response.Code}`
          //  }
          //  this.authService.sendTwilioMessage(body).subscribe((data:any) =>{
          //    console.log(data);
          //    this.openModalConfirm(response.IdUsuario);
          //  },error=>{
          //    console.log(error);
          //  });
          //  
          //}else{
            this.authService.redirectToMain();
          //}
				  
				} else {
					this.hasError = true;
          this.mesageError = response.Message;
				}
				this.cdr.detectChanges();
			}, error => {
        console.log(error);
				this.hasError = true;
        this.mesageError = error.error.Mesage;
				this.cdr.detectChanges();
			});


  }

  enviarMensaje(){
    this.authService.enviarMensaje().subscribe(
      (data:any)=>{
        console.log(data);
      }
    )
  }

  openModalConfirm(id){
    const modalRef = this.modalService.open(ConfirmationCodeComponent,{size:'md',centered:true, backdrop:'static'});
    modalRef.componentInstance.id = id;
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
