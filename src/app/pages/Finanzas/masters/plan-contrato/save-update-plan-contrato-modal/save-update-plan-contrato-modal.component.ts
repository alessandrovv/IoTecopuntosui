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
import { PlanContratoService } from '../../../_core/services/plan-contrato.service';
import { CertificadosService } from 'src/app/pages/Talento/_core/services/certificados.service';
import { MultitablaService } from '../../../../_core/services/multitabla.service';
import { EmpresaService } from '../../../../Security/_core/services/empresa.service';
@Component({
  selector: 'app-save-update-plan-contrato-modal',
  templateUrl: './save-update-plan-contrato-modal.component.html',
  styleUrls: ['./save-update-plan-contrato-modal.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class SaveUpdatePlanContratoModalComponent implements OnInit {

  @Input() item: any;
  isLoading$;
  idPlanContrato: number = 0;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];

  array_empresas: any;  
  array_cliente_externo: any;
  array_monedas :any;

  constructor(
    private customersService: CustomersService,
    private fb: FormBuilder, 
    public modal: NgbActiveModal,
    public planContrato_s: PlanContratoService,
    public empresa_s:EmpresaService,
    public certificado_s: CertificadosService,
    public multitabla_s: MultitablaService,
    public toastr: ToastrManager,
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.customersService.isLoading$;
    this.loadCustomer();
  }

  loadCustomer() {
    console.log(this.item);
    if (this.item !== null) {
      this.idPlanContrato = this.item.idPlanContrato;
      this.loadForm();    
      this.getEmpresas(this.item.idEmpresa);
      this.getCienteInterno(this.item.idEmpresa,this.item.idClienteExterno);
      this.getMonedas(this.item.idMoneda);
      this.formGroup.controls.NombrePlanContrato.setValue(this.item.nombre); 
      this.formGroup.controls.Descripcion.setValue(this.item.descripcion);   
      this.formGroup.controls.Monto.setValue(this.item.monto);     
      this.formGroup.controls.Activo.setValue(this.item.activo);      
    } else {
      console.log(this.item);
      this.idPlanContrato = 0;
      this.loadForm();
      this.getEmpresas(null);
      this.getMonedas(null);
      this.getCienteInterno(null,null);
    }
  }  

  loadForm() {
    this.formGroup = this.fb.group({
      Empresa: [null, Validators.compose([Validators.required])],
      Cliente: [null, Validators.compose([Validators.required])],
      NombrePlanContrato: [null, Validators.compose([Validators.required])],
      Descripcion: [null, Validators.compose([Validators.required])],
      Moneda: [null, Validators.compose([Validators.required])],
      Monto: [null, Validators.compose([Validators.required])],
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

  getMonedas(PosibleValor) {
    this.multitabla_s.GetListarMoneda().subscribe(
      (data:any) => {
        this.array_monedas = data;
        if (PosibleValor !== null) {
          this.formGroup.controls.Moneda.setValue(PosibleValor)
        }                    
      }, ( errorServicio ) => {
            
        console.log(errorServicio);
      }
    );
  }

  getCienteInterno(Empresa,PosibleValor) {
    this.formGroup.controls.Cliente.reset();  
		this.array_cliente_externo = [];
    if (Empresa !== null && Empresa !== undefined) {
      this.certificado_s.GetClientesExternoByUsuario(Empresa).subscribe(
      (data:any) => {
        this.array_cliente_externo = data; 
        if (PosibleValor !== null) {
          this.formGroup.controls.Cliente.setValue(PosibleValor);
        }         
      }, ( errorServicio ) => {            
        console.log(errorServicio);
      }
    );
    }
  }


  save() {
    let data = this.prepareCustomer();
    this.planContrato_s.SaveUpdatePlanContrato(data).subscribe(
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
      PlanContrato : this.idPlanContrato,      
      Empresa: formData.Empresa,
      Nombre: formData.NombrePlanContrato,
      Descripcion: formData.Descripcion,
      Cliente: formData.Cliente,
      Moneda :formData.Moneda,
      Monto : formData.Monto,
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
