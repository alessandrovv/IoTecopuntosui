import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { Customer } from 'src/app/modules/e-commerce/_models/customer.model';
import { CustomersService } from 'src/app/modules/e-commerce/_services';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';
import { MultitablaService } from '../../../../_core/services/multitabla.service';
import { CertificadosService } from '../../../_core/services/certificados.service';
import { puestoTrabajoService } from '../../../_core/services/puestoTrabajo.service';
import { EmpresaService } from '../../../../Security/_core/services/empresa.service';
import { AreaService } from '../../../_core/services/area.service';

@Component({
  selector: 'app-save-update-puesto-trabajo',
  templateUrl: './save-update-puesto-trabajo.component.html',
  styleUrls: ['./save-update-puesto-trabajo.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class SaveUpdatePuestoTrabajoComponent implements OnInit {
  @Input() item: any;
  isLoading$;
  idPuestoTrabajo: number = 0;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  array_empresas: any;
  array_areas: any;
	array_puestoTrabajos: any;
  constructor(
    public multitabla_s : MultitablaService,
    public puestoTrabajo_s : puestoTrabajoService,
    public certificado_s: CertificadosService,
    public area_s:AreaService,
    private customersService: CustomersService,
    public empresa_s:EmpresaService,
    private fb: FormBuilder, 
    public modal: NgbActiveModal,
    public toastr: ToastrManager,
    ) { }


  ngOnInit(): void {
    this.isLoading$ = this.customersService.isLoading$;
    this.loadCustomer();
  }
  loadCustomer() {
    console.log(this.item);
    if (this.item !== null) {
      this.idPuestoTrabajo = this.item.idPuestoTrabajo;
      this.loadForm();    
      this.getEmpresas(this.item.idEmpresa);
      this.getAreas(this.item.idEmpresa,this.item.idArea); 
			this.getPuestoTrabajo(this.item.idEmpresa, this.item.idPuestoSuperior1, this.item.idPuestoSuperior2);
      this.formGroup.controls.Codigo.setValue(this.item.codigo); 
      this.formGroup.controls.Nombre.setValue(this.item.nombre); 
      this.formGroup.controls.Descripcion.setValue(this.item.descripcion);     
      this.formGroup.controls.Activo.setValue(this.item.activo);      
    } else {
      this.idPuestoTrabajo = 0;
      this.loadForm();
      this.getEmpresas(null);
      this.getAreas(null,null);
    }
  }  
  loadForm() {
    this.formGroup = this.fb.group({
      Empresa: [null, Validators.compose([Validators.required])],
      Area: [null, Validators.compose([Validators.required])],
      Nombre: [null, Validators.compose([Validators.required])],
      Codigo: [null, Validators.compose([Validators.required])],
			PuestoSuperior1: [null],
			PuestoSuperior2: [null],
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

		getPuestoTrabajo(Empresa,PosibleValor1, PosibleValor2){
			this.puestoTrabajo_s.GetPuestoTrabajoByUsuario(Empresa, 0).subscribe(
				(data:any)=>{
					this.array_puestoTrabajos = data;
					console.log(data);					
					if(PosibleValor1!==null){
						this.formGroup.controls.PuestoSuperior1.setValue(PosibleValor1);
					}
					if(PosibleValor2!==null){
						this.formGroup.controls.PuestoSuperior2.setValue(PosibleValor2);
					}
				}, (errorServicio)=>{console.log(errorServicio);}
			);
		}

    getAreas(Empresa,PosibleValor){       
      this.formGroup.controls.Area.reset();		
      this.array_areas = [];  
      if (Empresa !== null && Empresa !== undefined) {    
        this.area_s.GetAreaByUsuario(Empresa).subscribe(
        (data:any) => {          
          this.array_areas = data;  
          console.log(this.array_areas);
          if (PosibleValor !== null) {
          this.formGroup.controls.Area.setValue(PosibleValor);
          }         
        }, ( errorServicio ) => {           
          console.log(errorServicio);
        }
        );
      } 
    }

  private prepareCustomer() {
    const formData = this.formGroup.value;
    return {
      PuestoTrabajo: this.idPuestoTrabajo,
      Area: formData.Area,      
      Codigo: formData.Codigo,      
      Nombre: formData.Nombre,
			PuestoSuperior1: formData.PuestoSuperior1,
			PuestoSuperior2: formData.PuestoSuperior2,
      Descripcion: formData.Descripcion,
      Activo: formData.Activo      
    }
    
  }
  save() {
    let data = this.prepareCustomer();
    this.puestoTrabajo_s.SaveUpdatePuestoTrabajo(data).subscribe(
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
