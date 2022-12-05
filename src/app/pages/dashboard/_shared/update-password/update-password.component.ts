import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { Customer } from 'src/app/modules/e-commerce/_models/customer.model';
import { CustomersService } from 'src/app/modules/e-commerce/_services';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { DashboardComercialService } from '../../_core/dashboard-comercial.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class UpdatePasswordComponent implements OnInit {

  isLoading$;
  idCertificado: number = 0;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  array_empresas: any;
  array_cliente_externo: any;
  constructor(
    private customersService: CustomersService,
    private fb: FormBuilder, 
    public s_dashboard: DashboardComercialService,
    public modal: NgbActiveModal,
    public toastr: ToastrManager,    
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.customersService.isLoading$;
    this.loadForm();
    this.formGroup.controls.PassNew.disable();
    this.formGroup.controls.PassNewRepeat.disable();
  }

  loadForm() {
    this.formGroup = this.fb.group({
      PassActual: [null, Validators.compose([Validators.required])],
      PassNew: [null, Validators.compose([Validators.required])],
      PassNewRepeat: [null, Validators.compose([Validators.required])]     
    });
  }

  onPressed() {
    const formData = this.formGroup.value;
    this.s_dashboard.VerifyPasswordUsuario(formData.PassActual).subscribe(
      (data:any) => {
        console.log(data);
        if (data === 0) {
          this.formGroup.controls.PassNew.disable();
          this.formGroup.controls.PassNewRepeat.disable();
          this.toastr.infoToastr('La contraseña actual es incorrecta.', 'Información!', {
            toastTimeout: 4000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });   
        } else {
          this.formGroup.controls.PassNew.enable();
          this.formGroup.controls.PassNewRepeat.enable();
        }
               
      }, ( errorServicio ) => { 
        this.toastr.errorToastr('Ocurrio un error.', 'Error!', {
          toastTimeout: 2000,
          showCloseButton: true,
          animate: 'fade',
          progressBar: true
        });       
        console.log(errorServicio);
      }
    );
  }

  save() {
    const formData = this.formGroup.value;

    if (formData.PassNew !== formData.PassNewRepeat) {
      this.toastr.infoToastr('Las nuevas contraseñas no coinciden. Por favor ingrese nuevamente', 'Información!', {
        toastTimeout: 4000,
        showCloseButton: true,
        animate: 'fade',
        progressBar: true
      });
      return;
    }
    
    let data = this.prepareUsuario();
    this.s_dashboard.UpdatePassUsuario(data).subscribe(
      (data:any) => {
        if (data[0].Ok > 0) {
          this.toastr.successToastr(data[0].Message, 'Correcto!', {
            toastTimeout: 4000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });

          this.modal.close(true);  
        } else {
          this.toastr.errorToastr(data[0].Message, 'Error!', {
            toastTimeout: 4000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
          // this.modal.close(true);  
        }
               
      }, ( errorServicio ) => { 
        this.toastr.errorToastr('Ocurrio un error.', 'Error!', {
          toastTimeout: 2000,
          showCloseButton: true,
          animate: 'fade',
          progressBar: true
        });       
        console.log(errorServicio);
      }
    );
  }

  private prepareUsuario() {
    const formData = this.formGroup.value;
    return {
      prmstrPassword: formData.PassNew,      
      PassNewRepeat: formData.PassNewRepeat 
    }
    
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
