import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { Customer } from 'src/app/modules/e-commerce/_models/customer.model';
import { CustomersService } from 'src/app/modules/e-commerce/_services';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';
import { TrabajadorService } from 'src/app/pages/Talento/_core/services/trabajador.service';
import { UsuarioService } from '../../../_core/services/usuario.service';

@Component({
  selector: 'app-save-update-usuario',
  templateUrl: './save-update-usuario.component.html',
  styleUrls: ['./save-update-usuario.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class SaveUpdateUsuarioComponent implements OnInit {
  @Input() item: any;
  isLoading$;
  idUsuario: number = 0;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
	array_trabajadores: any;
  constructor(
    private customersService: CustomersService,
    private fb: FormBuilder, 
    public modal: NgbActiveModal,
		public trabajador_s: TrabajadorService,
		public usuario_s: UsuarioService,
    public toastr: ToastrManager,
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.customersService.isLoading$;
    this.loadUsuario();
  }

	getTrabajadores(PosibleValor){
		this.trabajador_s.GetTrabajadoresList(0,0,0,1).subscribe(
			(data:any)=>{
				this.array_trabajadores = data;
				if(PosibleValor !== null){
					this.formGroup.controls.Trabajador.setValue(PosibleValor);
				}
			}, (errorServicio)=>{
				console.log(errorServicio);
			}
		);
	}

  loadUsuario() {
    if (this.item !== null) {
      this.idUsuario = this.item.idUsuario;
      this.loadForm();    
			this.getTrabajadores(this.item.idTrabajador);
      this.formGroup.controls.Login.setValue(this.item.login);  
      this.formGroup.controls.Password.setValue(this.item.password);    
      this.formGroup.controls.Activo.setValue(this.item.activo);      
    } else {
      this.idUsuario = 0;
      this.loadForm();
			this.getTrabajadores(null);
    }
  }  

  loadForm() {
    this.formGroup = this.fb.group({
      Trabajador: [null, Validators.compose([Validators.required])],
			Login: [null, Validators.compose([Validators.required])],
			Password: [null, Validators.compose([Validators.required])],
      Activo: [true],      
    });
  }


  save() {
    let data = this.prepareUsuario();
		this.usuario_s.SaveUpdateUsuario(data).subscribe(
      (data:any) => {
        if (data[0].Success > 0) {
          this.toastr.successToastr(data[0].Message, 'Correcto!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });

          this.modal.close(true);  
        } else {
          this.toastr.errorToastr(data[0].Message, 'Error!', {
            toastTimeout: 2000,
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
      idUsuario: this.idUsuario,
			idTrabajador: formData.Trabajador,
			login: formData.Login,
			password: formData.Password,
      activo: formData.Activo,      
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
