import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { Customer } from 'src/app/modules/e-commerce/_models/customer.model';
import { CustomersService } from 'src/app/modules/e-commerce/_services';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';
import { CertificadosService } from '../../../../Talento/_core/services/certificados.service';
import { EsquemaComisionService } from '../../../_core/services/esquema-comision.service';
// import { MultitablaService } from '../../../../_core/services/multitabla.service';
import { EmpresaService } from '../../../../Security/_core/services/empresa.service';
import { puestoTrabajoService } from '../../../../Talento/_core/services/puestoTrabajo.service';

@Component({
  selector: 'app-save-update-esquema-comisiones-modal',
  templateUrl: './save-update-esquema-comisiones-modal.component.html',
  styleUrls: ['./save-update-esquema-comisiones-modal.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class SaveUpdateEsquemaComisionesModalComponent implements OnInit {
  @Input() item: any;
  isLoading$;
  idEsquemaComision: number = 0;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
	array_certificados: any;
  array_puestoTrabajo: any;
  array_empresas: any;
  constructor(
    private customersService: CustomersService,
		private esquema_s: EsquemaComisionService,
    private fb: FormBuilder, 
    public modal: NgbActiveModal,
    public certificado_s: CertificadosService,
    public empresa_s:EmpresaService,
    public puestoTrabajo_s:puestoTrabajoService,
    public toastr: ToastrManager,
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.customersService.isLoading$;
    this.loadCustomer();
  }

  loadCustomer() {
    console.log(this.item);
    if (this.item !== null) {
      this.idEsquemaComision = this.item.idEsquemaComision;
      this.loadForm();    
      this.formGroup.controls.NombreEsquema.setValue(this.item.nombreEsquema);      
			this.formGroup.controls.Comision.setValue(this.item.porcentajeComision);
			this.formGroup.controls.nroVenta.setValue(this.item.aplicarNroVenta);
      this.getPuestoTrabajos(0,this.item.idPuestoTrabajo);
			this.getCertificados(this.item.idCertificado);
    } else {
      console.log(this.item);
      this.idEsquemaComision = 0;
      this.loadForm();
			this.getCertificados(null);
      this.getPuestoTrabajos(0,null);
    }
  }  

  loadForm() {
    this.formGroup = this.fb.group({
			NombreEsquema: [null, Validators.compose([Validators.required])],
      Certificado: [null, Validators.compose([Validators.required])],
      PuestoTrabajo: [null, Validators.compose([Validators.required])],
      Comision: [null, Validators.compose([Validators.required])],
      nroVenta: [null, Validators.compose([Validators.required])],      
    });
  }

	getCertificados(PosibleValor){
		this.certificado_s.GetCertificadosList(0,0,-1).subscribe(
			(data:any)=>{
				this.array_certificados = data;
				if(PosibleValor !==null){
					this.formGroup.controls.Certificado.setValue(PosibleValor);
				}
			}, (errorServicio)=>{
				console.log(errorServicio);
			}
		)
	}
  getPuestoTrabajos(Empresa,PosibleValor) {
		this.formGroup.controls.PuestoTrabajo.reset();
		this.array_puestoTrabajo = [];  
		if (Empresa !== null && Empresa!==undefined) { 
			this.puestoTrabajo_s.GetPuestoTrabajoByUsuario(Empresa,0).subscribe(
			(data:any) => {
				this.array_puestoTrabajo = data;
				if (PosibleValor !== null) {
					this.formGroup.controls.PuestoTrabajo.setValue(PosibleValor);
				} 
					
			}, ( errorServicio ) => {
					
				console.log(errorServicio);
			}
			);
		}
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

  // getEmpresas(PosibleValor) {
  //   this.certificado_s.GetEmpresa().subscribe(
  //     (data:any) => {
  //       this.array_empresas = data;  
  //       if (PosibleValor !== null) {
  //         this.formGroup.controls.Empresa.setValue(PosibleValor);
  //       }        
  //     }, ( errorServicio ) => {           
  //       console.log(errorServicio);
  //     }
  //   );

  // }

  // getCienteInterno(PosibleValor) {
  //   this.certificado_s.GetClientesExterno().subscribe(
  //     (data:any) => {
  //       this.array_cliente_externo = data; 
  //       if (PosibleValor !== null) {
  //         this.formGroup.controls.Cliente.setValue(PosibleValor);
  //       }         
  //     }, ( errorServicio ) => {            
  //       console.log(errorServicio);
  //     }
  //   );
  // }

  save() {
    let data = this.prepareData();
    this.esquema_s.SaveUpdateEsquemaComision(data).subscribe(
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

  private prepareData() {
    const formData = this.formGroup.value;
    return {
      idEsquemaComision: this.idEsquemaComision,
      idEmpresa: 1,
      nombre: formData.NombreEsquema,
      idCertificado: formData.Certificado,      
      idPuestoTrabajo: formData.PuestoTrabajo ,
			porcentajeComision: formData.Comision ,
			nroVenta: formData.nroVenta ,
			activo: true
    }
    
  }

	// NombreEsquema: [null, Validators.compose([Validators.required])],
	// Certificado: [null, Validators.compose([Validators.required])],
	// PuestoTrabajo: [null, Validators.compose([Validators.required])],
	// Comision: [null, Validators.compose([Validators.required])],
	// nroVenta: [true],     

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
