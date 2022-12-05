import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { Customer } from 'src/app/modules/e-commerce/_models/customer.model';
import { CustomersService } from 'src/app/modules/e-commerce/_services';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';
import { AreaService } from '../../../_core/services/area.service';
import { Area } from '../../../_core/models/area.model';
import { EmpresaService } from '../../../../Security/_core/services/empresa.service';

@Component({
  selector: 'app-save-update-area',
  templateUrl: './save-update-area.component.html',
  styleUrls: ['./save-update-area.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class SaveUpdateAreaComponent implements OnInit {

  @Input() item: any;
  isLoading$;
  idArea: number = 0;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  array_empresas: any;
  constructor(
    private customersService: CustomersService,
    private fb: FormBuilder, 
    public modal: NgbActiveModal,
    public area_s: AreaService,
    public empresa_s:EmpresaService,
    public toastr: ToastrManager,
    ) { }


    ngOnInit(): void {
      this.isLoading$ = this.customersService.isLoading$;
      this.loadCustomer();
    }

  loadCustomer() {
    console.log(this.item);
    if (this.item !== null) {
      this.idArea = this.item.idArea;
      this.loadForm();    
      this.getEmpresas(this.item.idEmpresa);

      this.formGroup.controls.NombreArea.setValue(this.item.Nombre);    
      this.formGroup.controls.Descripcion.setValue(this.item.Descripcion);   
      this.formGroup.controls.Activo.setValue(this.item.Activo);      
    } else {
      console.log(this.item);
      this.idArea = 0;
      this.loadForm();
      this.getEmpresas(null);
    
    }
  }  

  loadForm() {
    this.formGroup = this.fb.group({
      Empresa: [null, Validators.compose([Validators.required])],
      NombreArea: [null, Validators.compose([Validators.required])],
      Descripcion: [null, Validators.compose([Validators.required])],
      Activo: [true],      
    });
  }

  getEmpresas(PosibleValor) {
		this.empresa_s.GetEmpresaByUsuario().subscribe(
			(data:any)=>{
				this.array_empresas = data;
				if(PosibleValor!== null){
					this.formGroup.controls.Empresa.setValue(PosibleValor)
				}
			}, (errorServicio)=>{
				console.log(errorServicio)
			}
		);
	  }


  save() {
    let data = this.prepareCustomer();
    this.area_s.SaveUpdateArea(data).subscribe(
      (data:any) => {
        if (data[0].Ok > 0) {
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

  private prepareCustomer() {
    const formData = this.formGroup.value;
    return {
      IdArea: this.idArea,
      Empresa: formData.Empresa,
      Nombre: formData.NombreArea,
      Descripcion:formData.Descripcion,
      Activo: formData.Activo,          
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
