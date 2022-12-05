import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { Customer } from 'src/app/modules/e-commerce/_models/customer.model';
import { CustomersService } from 'src/app/modules/e-commerce/_services';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';
import { CertificadosService } from '../../../_core/services/certificados.service';
import { EmpresaService } from '../../../../Security/_core/services/empresa.service';

@Component({
  selector: 'app-save-update-certificado-modal',
  templateUrl: './save-update-certificado-modal.component.html',
  styleUrls: ['./save-update-certificado-modal.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class SaveUpdateCertificadoModalComponent implements OnInit {
  @Input() item: any;
  isLoading$;
  idCertificado: number = 0;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  array_empresas: any;
  array_cliente_externo: any;
  constructor(
    private customersService: CustomersService,
    private fb: FormBuilder, 
    public modal: NgbActiveModal,
    public empresa_s:EmpresaService,
    public certificado_s: CertificadosService,
    public toastr: ToastrManager,
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.customersService.isLoading$;
    this.loadCustomer();
  }

  loadCustomer() {
    console.log(this.item);
    if (this.item !== null) {
      this.idCertificado = this.item.idCertificado;
      this.loadForm();    
      this.getEmpresas(this.item.idEmpresa);
      this.getCienteInterno(this.item.idEmpresa,this.item.idClienteExterno); 
      this.formGroup.controls.NombreCertificado.setValue(this.item.Nombre);      
      this.formGroup.controls.Activo.setValue(this.item.Activo);      
    } else {
      console.log(this.item);
      this.idCertificado = 0;
      this.loadForm();
      this.getEmpresas(null);
      this.getCienteInterno(null,null);
    }
  }  

  loadForm() {
    this.formGroup = this.fb.group({
      Empresa: [null, Validators.compose([Validators.required])],
      Cliente: [null, Validators.compose([Validators.required])],
      NombreCertificado: [null, Validators.compose([Validators.required])],
      Activo: [true],      
    });
  }

  getEmpresas(PosibleValor) {
    this.empresa_s.GetEmpresaByUsuario().subscribe(
      (data:any) => {        
        this.array_empresas = data;
        if (PosibleValor !== null) {
          this.formGroup.controls.Empresa.setValue(PosibleValor);
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
    this.certificado_s.SaveUpdateCertificados(data).subscribe(
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
      IdCertificado: this.idCertificado,
      Empresa: formData.Empresa,
      Cliente: formData.Cliente,
      Activo: formData.Activo,      
      Nombre: formData.NombreCertificado 
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
