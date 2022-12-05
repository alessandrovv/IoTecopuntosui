import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup , Validators , FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';

import { Router,ActivatedRoute} from '@angular/router';
import { CertificadosService } from '../../../../Talento/_core/services/certificados.service';
import { PermissionViewActionService } from '../../../../../Shared/services/permission-view-action.service';
import { DatePipe } from '@angular/common';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../_metronic/core/utils/date-picker.utils';
import { TrabajadorService } from '../../../../Talento/_core/services/trabajador.service';
import { CustomersService } from '../../../../../modules/e-commerce/_services/fake/customers.service';
import { MetaComercialService } from '../../../_core/meta-comercial.service';
import { createHostListener } from '@angular/compiler/src/core';
import { EmpresaService } from '../../../../Security/_core/services/empresa.service';
@Component({
  selector: 'app-save-update-metas-comerciales',
  templateUrl: './save-update-metas-comerciales.component.html',
  styleUrls: ['./save-update-metas-comerciales.component.scss'],
  providers: [DatePipe,
		{ provide: NgbDateAdapter, useClass: CustomAdapter },
		{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
	]
})
export class SaveUpdateMetasComercialesComponent implements OnInit {
  idMetaComercial: number = 0;  
  hide_save: Boolean = false;
  hide_load: Boolean = true;
  isLoading$;
  formGroup: FormGroup;
  data_formMeta: FormControl[] = [];

  array_trabajadores:any=[];
  array_empresas: any;
  array_anios: any;
  array_meses: any;

	private subscriptions: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    private customersService: CustomersService,
    private chgRef: ChangeDetectorRef,
    public certificado_s: CertificadosService,
    public trabajador_s: TrabajadorService,
    public metaComercial_s: MetaComercialService,
    public empresa_s:EmpresaService,
    private router: Router,
    private route: ActivatedRoute,    
    public toastr: ToastrManager,      
    public pvas: PermissionViewActionService, 
  ) { }

  ngOnInit(): void {   
    this.isLoading$ = this.customersService.isLoading$;    
    this.loadForm(); 
    this.idMetaComercial = this.route.snapshot.queryParams['id'] || 0;
    if (this.idMetaComercial > 0) {
      this.getDatosMetaComercial(this.idMetaComercial);      
    } else {
      this.getEmpresas(null);
      this.getAnios(null);
      this.getMeses(null);      
      this.getTrabajadores();
    }
    console.log(this.idMetaComercial);
    
  }

  loadForm() {    
    this.formGroup = this.fb.group({
      Empresa: [null, Validators.compose([Validators.required])],
      Anio: [null, Validators.compose([Validators.required])],
      Mes: [null, Validators.compose([Validators.required])],
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
  getAnios(PosibleValor){
    this.metaComercial_s.GetListarAnios().subscribe(
      (data:any) => {
        this.array_anios = data;  
        if (PosibleValor !== null) { 
          this.formGroup.controls.Anio.setValue(PosibleValor)
        }        
      }, ( errorServicio ) => {           
        console.log(errorServicio);
      }
    );
  }
  getMeses(PosibleValor){
    this.metaComercial_s.GetListarMeses().subscribe(
      (data:any) => {
        this.array_meses = data;
        if (PosibleValor !== null) { 
          this.formGroup.controls.Mes.setValue(PosibleValor.toString())
        }
        console.log(this.array_meses);       
      }, ( errorServicio ) => {           
        console.log(errorServicio);
      }
    );     
  }

  getTrabajadores(){
    this.trabajador_s.GetTrabajadoresList('0', '0', '0', '-1').subscribe(
      (data:any) => {
        data.forEach(element => {          
          this.array_trabajadores.push({
            IdMetaDetalle: 0, 
            IdTrabajador: element.idTrabajador,
            NombresApellidos :element.NombresApellidos
          });          
          let numRegex = /^-?\d*[.,]?\d{0,2}$/;
          this.data_formMeta.push(new FormControl(null, [Validators.required,Validators.pattern(numRegex)]));
        });        
        this.chgRef.markForCheck();  
        console.log(this.array_trabajadores);
              
      }, ( errorServicio ) => {
        console.log(errorServicio);       
      }
    );
  }

  
  getDatosMetaComercial(MetaComercial){
    this.metaComercial_s.GetDatosMetaComercial(MetaComercial).subscribe(
			(data:any) => {
				let dataForm = data[0][0];
				this.getEmpresas(dataForm.empresa);
				this.getAnios(dataForm.ValorAnio);
				this.getMeses(dataForm.ValorMes);
				this.llenarMetasDetalle(data[1]);
        console.log(dataForm); 	          
			}, ( errorServicio ) => {           
			  console.log(errorServicio);
      }
    );
  }
  llenarMetasDetalle(MetasDetalle){
    
    for (let i = 0; i <= MetasDetalle.length - 1; i++) {
      this.array_trabajadores.push({
        IdMetaDetalle: MetasDetalle[i].IdMetaDetalle, 
        IdTrabajador: MetasDetalle[i].Trabajador,
        NombresApellidos :MetasDetalle[i].NombresApellidos
      });     
                
      let numRegex = /^-?\d*[.,]?\d{0,2}$/;
      this.data_formMeta.push(new FormControl(null, [Validators.required,Validators.pattern(numRegex)])); 
		}
    this.chgRef.markForCheck();
    console.log(this.array_trabajadores);
    
  }
  prepare_model(){
    const controls = this.formGroup.controls;
    let dataMetasTrabajador = [];
    for (let i = 0; i < this.array_trabajadores.length; i++) {
			dataMetasTrabajador.push({
				IdMetaDetalle: this.array_trabajadores[i].IdMetaDetalle, 
        IdTrabajador: this.array_trabajadores[i].IdTrabajador, 
        Meta: this.data_formMeta[i].value 
			});
		}
    return {
      MetaComercial: this.idMetaComercial,
      Empresa:controls['Empresa'].value,
      Anio:controls['Anio'].value,
      Mes:controls['Mes'].value,
      xmlMetas:dataMetasTrabajador
    }
  }
  prepare_validate():boolean{    
		const controls = this.formGroup.controls;
    let bandera = false;
    if (this.formGroup.invalid) {
      bandera=true;
		}
    for (let i = 0; i < this.array_trabajadores.length; i++) {
			if (this.data_formMeta[i].invalid) {			
			  bandera = true;
			}
		}
    Object.keys(controls).forEach(controlName =>
      controls[controlName].markAsTouched()
    );    
		this.data_formMeta.forEach(item => { if (item.invalid) item.markAsTouched()});	
    return bandera;
  }
  saveUpdateMetaComercial(){
          
    this.hide_save = true;
    this.hide_load = false;
    if(this.prepare_validate()){
      this.hide_save = false;
			this.hide_load = true;
			this.toastr.warningToastr('Ingrese los campos obligatorios.', 'Advertencia!', {
				toastTimeout: 2000,
				showCloseButton: true,
				animate: 'fade',
				progressBar: true
			});
      return;
    }
    let datos = this.prepare_model();
    this.metaComercial_s.SaveUpdateMetaComercial(datos).subscribe(
      (data:any) => {        
        if (data[0].Ok == 1) {     
          this.toastr.successToastr(data[0].Message, 'Correcto!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
          this.router.navigate(['Comercial/masters/MetasComerciales']);
        } else {             
          this.hide_save = false;
          this.hide_load = true;
          this.chgRef.markForCheck();          
          if (data[0].Ok == 2) {         
            this.toastr.warningToastr(data[0].Message, 'Advertencia!', {
              toastTimeout: 3000,
              showCloseButton: true,
              animate: 'fade',
              progressBar: true
            });
          }else{
            this.toastr.errorToastr(data[0].Message, 'Error!', {
              toastTimeout: 2000,
              showCloseButton: true,
              animate: 'fade',
              progressBar: true
            });
          }
        }
               
      }, ( errorServicio ) => { 
        this.hide_save = false;
        this.hide_load = true;
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
  /*CONTROL*/
  isFormControlValid(controlName): boolean {		
		return controlName.valid && (controlName.dirty || controlName.touched);
	}

	isFormControlInvalid(controlName): boolean {
		return controlName.invalid && (controlName.dirty || controlName.touched);
	}

	FormControlHasError(validation, controlName): boolean {
		return controlName.hasError(validation) && (controlName.dirty || controlName.touched);
	}
}
