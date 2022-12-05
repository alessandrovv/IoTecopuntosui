import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { TrabajadorService } from 'src/app/pages/Talento/_core/services/trabajador.service';
import { PermissionViewActionService } from 'src/app/Shared/services/permission-view-action.service';
import { RutasService } from '../../../_core/rutas.service';

import { NgbModal, NgbDateAdapter, NgbDateParserFormatter  } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { CustomAdapter,CustomDateParserFormatter } from '../../../../../_metronic/core/utils/date-picker.utils';
@Component({
  selector: 'app-save-update-ruta',
  templateUrl: './save-update-ruta.component.html',
  styleUrls: ['./save-update-ruta.component.scss'],
  providers: [DatePipe,
		{ provide: NgbDateAdapter, useClass: CustomAdapter },
		{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
	]
})
export class SaveUpdateRutaComponent implements OnInit {
  tabs = {
    DATA_TAB: 0,
    CONFIRMAR_TAB: 1,
  };
  activeTabId = this.tabs.DATA_TAB;
  fechaActual: any;


  idRutaComercial: number = 0;
  formGeneralGroup: FormGroup;

  formVisitaComercial : FormGroup;

  array_visitaComercial:any[] = []
  array_visitaComercial_eliminado:any[] = [];



  array_trabajadores:any [] =[];

  array_clientes:any[] = [];
  array_motivos:any[] = [];
  array_sucursales:any[] = [];

  
	hide_save: Boolean = false;
	hide_load: Boolean = true;
  isLoading$;

  array_resumen:any[] = [];
  nombreTrabajador:any = '-';
  constructor(
    private fb: FormBuilder,    
    private router: Router,
    private route: ActivatedRoute,    
    public toastr: ToastrManager,      
    public pvas: PermissionViewActionService,
    public trabajador_s: TrabajadorService, 
    public ruta_s: RutasService,
    private datePipe: DatePipe,
    private chgRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.getListarTrabajadores();
    this.getListarClientes();
    this.getListarSucursales();
    this.getListarMotivoVisitaComercial();
		this.fechaActual = (new Date()).toLocaleDateString('EN-CA');
    this.idRutaComercial = this.route.snapshot.queryParams['id'] || 0;
    this.formForm();
    this.visitaComercialForm();
    if (this.idRutaComercial > 0) {      	     
      this.getRutaComercial(this.idRutaComercial);
    }
  }
  changeTab(tabId: number) {
    if(this.activeTabId == 0){
      this.generaResumen();
    }else{
      this.activeTabId = tabId;
    }
  }
  getListarTrabajadores(){
		this.trabajador_s.GetTrabajadoresList(0,0,0,1).subscribe(
			(data:any)=>{
				this.array_trabajadores = data;
			}, (errorServicio)=>{
				console.log(errorServicio);
			}
		);
	}

  getListarMotivoVisitaComercial(){
		this.ruta_s.GetListarMotivoVisitaComercial().subscribe(
			(data:any)=>{
				this.array_motivos = data;
			}, (errorServicio)=>{
				console.log(errorServicio);
			}
		);
	}

  getListarSucursales(){
		this.ruta_s.GetListarSucursalesByCliente(-1).subscribe(
			(data:any)=>{
				this.array_sucursales = data;        
			}, (errorServicio)=>{
				console.log(errorServicio);
			}
		);
	}
  changeSucursalesByCliente(Cliente,index){
    this.visitaComercial.controls[index]['controls']['Sucursal'].setValue(null);
    this.array_visitaComercial[index].Array_sucursales= this.array_sucursales.map((sucursal) => {
      if(sucursal.idCliente === Cliente){
        return {...sucursal};
      }
      }).filter(notUndefined => notUndefined !== undefined)
  }
  getListarClientes(){
		this.ruta_s.GetListarClientes().subscribe(
			(data:any)=>{
				this.array_clientes = data;    
			}, (errorServicio)=>{
				console.log(errorServicio);
			}
		);
	}
  
  formForm(){
    this.formGeneralGroup  = this.fb.group({
      Fecha: [this.fechaActual,Validators.compose([Validators.required])],
      Trabajador: [null,Validators.compose([Validators.required])],
      Activo : [true]
    });
  }
  getRutaComercial(idRutaComercial){
    this.ruta_s.GetDataRutaComercial(idRutaComercial).subscribe(
      (data:any) => {      
        console.log('-------------');    
        console.log(data);       
        console.log('-------------');
        this.formGeneralGroup.controls.Fecha.setValue((data[0][0].fecha) ? this.datePipe.transform(new Date(data[0][0].fecha), 'yyyy-MM-dd') : null);
        this.formGeneralGroup.controls.Trabajador.setValue(data[0][0].idTrabajador);
        this.formGeneralGroup.controls.Activo.setValue(data[0][0].activo);
        this.llenarVisitaComercial(data[1]);         
        this.chgRef.markForCheck();
      }, ( errorServicio ) => {           
        console.log(errorServicio);
      }
    );
  }


  visitaComercialForm() {
		this.formVisitaComercial = this.fb.group({
      visitaComercial: this.fb.array([])
		});
	}

  get visitaComercial() {
    return this.formVisitaComercial.controls['visitaComercial'] as FormArray
  }

  llenarVisitaComercial(data){
    console.log(this.array_sucursales);
    
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      const recurso = this.fb.group({
        VisitaComercial: element.idVisitaComercial,        
        Cliente: [element.idCliente,Validators.compose([Validators.required])],
        Sucursal: [element.idClienteSucursal,Validators.compose([Validators.required])],
        Motivo : [element.idMotivo,Validators.compose([Validators.required])],
        Activo: [element.activo],
      });
      const obj2 = { VisitaComercial:element.idVisitaComercial, 
                      Array_sucursales:
                        this.array_sucursales.map((sucursal) => {
                          if(sucursal.idCliente === element.idCliente){
                            return {...sucursal};
                          }
                          }).filter(notUndefined => notUndefined !== undefined)
                    }
                    
      this.array_visitaComercial.push(obj2);      
      this.visitaComercial.push(recurso);
    }
    console.log(this.array_visitaComercial);
    this.chgRef.markForCheck();
  }
  addVisitaComercial() {
    const recurso = this.fb.group({
      VisitaComercial: 0,        
      Cliente: [null, Validators.compose([Validators.required])],
      Sucursal: [null, Validators.compose([Validators.required])],
      Motivo:[null, Validators.compose([Validators.required])],
      Activo: [true],
    });
    const obj2 = { VisitaComercial:0 , 
      Array_sucursales: []
    }
    this.array_visitaComercial.push(obj2);
    this.visitaComercial.push(recurso); 
    console.log(this.array_visitaComercial);   
  }
  deleteVisitaComercial(index){
    if(this.visitaComercial.controls[index]['controls']['VisitaComercial'].value !=0){
      this.array_visitaComercial_eliminado.push({
        VisitaComercial: this.visitaComercial.controls[index]['controls']['VisitaComercial'].value,
        Cliente: this.visitaComercial.controls[index]['controls']['Cliente'].value,
        Sucursal: this.visitaComercial.controls[index]['controls']['Sucursal'].value,
        Motivo: this.visitaComercial.controls[index]['controls']['Motivo'].value,
        Activo: this.visitaComercial.controls[index]['controls']['Activo'].value,
      });
    }
    console.log(this.array_visitaComercial);
    console.log(this.array_visitaComercial_eliminado);
    this.visitaComercial.removeAt(index);    
    this.array_visitaComercial.splice(index,1);
  }

  generaResumen(){
    

    const controls = this.formGeneralGroup.controls;

    /*Validar Descripcion General*/
    if (this.formGeneralGroup.invalid) {
			this.hide_save = false;
			this.hide_load = true;
			this.activeTabId = 0;
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.toastr.warningToastr('Ingrese los campos obligatorios.', 'Advertencia!', {
				toastTimeout: 2000,
				showCloseButton: true,
				animate: 'fade',
				progressBar: true
			});
			return;
		}
    /*Validar VisitaComercial */
    if(this.formVisitaComercial.controls['visitaComercial'].invalid){
      this.hide_save = false;
        this.hide_load = true;
        this.activeTabId = 0;
        this.toastr.warningToastr('Ingrese los campos obligatorios.', 'Advertencia!', {
          toastTimeout: 2000,
          showCloseButton: true,
          animate: 'fade',
          progressBar: true
        });
        this.visitaComercial.controls.forEach(element => {
          Object.keys(element['controls']).forEach(controlName =>
            element['controls'][controlName].markAsTouched()
          );        
        })
        return ;
      }
    this.ruta_s.GetRutasComercial(this.formGeneralGroup.controls['Fecha'].value,this.formGeneralGroup.controls['Fecha'].value,this.formGeneralGroup.controls['Trabajador'].value,1).subscribe(
      (data:any) => {
        console.log(data);
        if(data.length > 0 && data[0].idRutaComercial != this.idRutaComercial){
            this.toastr.warningToastr('Ya existe una ruta comercial asignada a esa fecha', 'Advertencia!', {
              toastTimeout: 4000,
              showCloseButton: true,
              animate: 'fade',
              progressBar: true
            });
            return;
          }else{
              this.nombreTrabajador = this.array_trabajadores[this.array_trabajadores.findIndex(t => t.idTrabajador == this.formGeneralGroup.controls['Trabajador'].value)].NombresApellidos || null ;
              this.array_resumen = [];
              this.visitaComercial.controls.forEach(element => {
                this.array_resumen.push({
                  Cliente: this.array_clientes[this.array_clientes.findIndex(c => c.idCliente == element['controls']['Cliente'].value)].razonSocial,
                  Sucursal:  this.array_sucursales[this.array_sucursales.findIndex(s => s.idClienteSucursal == element['controls']['Sucursal'].value)].direccion,        
                  Motivo:  this.array_motivos[this.array_motivos.findIndex( m => m.valor == element['controls']['Motivo'].value )].nombre ,
                })        
              }) 
              
              console.log(this.array_resumen);
              if(this.array_resumen.length ==0){
                this.toastr.warningToastr('Debe asignar visitas comerciales', 'Advertencia!', {
                  toastTimeout: 4000,
                  showCloseButton: true,
                  animate: 'fade',
                  progressBar: true
                });
                return;
              }
              
              this.activeTabId = 1;
              this.chgRef.markForCheck();
          }
              
      }, ( errorServicio ) => {
        
      console.log(errorServicio);        
      }
    );
    
    
  }
  prepare_model() {		
		const controls = this.formGeneralGroup.controls;

    let dataVisitaComercial = [];
    this.visitaComercial.controls.forEach(element => {
      dataVisitaComercial.push({
        VisitaComercial: element['controls']['VisitaComercial'].value,
        Cliente: element['controls']['Cliente'].value,
        Sucursal:  element['controls']['Sucursal'].value,
        Motivo:  element['controls']['Motivo'].value ,
        Activo:  element['controls']['Activo'].value,
        Eliminado: false
      })        
    }) 
    this.array_visitaComercial_eliminado.forEach(element => {
      dataVisitaComercial.push({
        VisitaComercial: element.VisitaComercial ,
        Cliente: element.Cliente ,
        Sucursal:  element.Sucursal ,
        Motivo:  element.Motivo ,
        Activo:  element.Activo ,
        Eliminado: true
      })        
    })
    return {
      RutaComercial: this.idRutaComercial,      
      Fecha: controls['Fecha'].value,    
      Trabajador: controls['Trabajador'].value,
      Activo: controls['Activo'].value, 
      xmlVisitaComercial: dataVisitaComercial,
    }
	}

  saveUpdateRuta(){

    this.hide_save = true;
	  this.hide_load = false;
	  const controls = this.formGeneralGroup.controls;

    /*Validar Descripcion General*/
    if (this.formGeneralGroup.invalid) {
			this.hide_save = false;
			this.hide_load = true;
			this.activeTabId = 0;
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.toastr.warningToastr('Ingrese los campos obligatorios.', 'Advertencia!', {
				toastTimeout: 2000,
				showCloseButton: true,
				animate: 'fade',
				progressBar: true
			});
			return;
		}

    /*Validar VisitaComercial */
    if(this.formVisitaComercial.controls['visitaComercial'].invalid){
      this.hide_save = false;
        this.hide_load = true;
        this.activeTabId = 0;
        this.toastr.warningToastr('Ingrese los campos obligatorios.', 'Advertencia!', {
          toastTimeout: 2000,
          showCloseButton: true,
          animate: 'fade',
          progressBar: true
        });
        this.visitaComercial.controls.forEach(element => {
          Object.keys(element['controls']).forEach(controlName =>
            element['controls'][controlName].markAsTouched()
          );        
        })
        return ;
      } 

    let datos = this.prepare_model();
    console.log('-----------------------------');
    console.log('Data Enviada',datos);
    console.log('-----------------------------');
    this.ruta_s.SaveUpdateRutaComercial(datos).subscribe((data: any) => {
      console.log(data);
      
      if (data[0].Ok > 0) {
        this.hide_save = false;
        this.hide_load = true;
        this.toastr.successToastr(data[0].Message, 'Correcto!', {
          toastTimeout: 2000,
          showCloseButton: true,
          animate: 'fade',
          progressBar: true
        });
        this.router.navigate(['Sales/process/Rutas']);
      } else {
        this.hide_save = false;
        this.hide_load = true;
        this.toastr.errorToastr(data[0].Message, 'Error!', {
          toastTimeout: 2000,
          showCloseButton: true,
          animate: 'fade',
          progressBar: true
        });
      }
    }, (errorServicio) => {
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
    const control = this.formGeneralGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGeneralGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGeneralGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGeneralGroup.controls[controlName];
    return control.dirty || control.touched;
  }

   /*PESONALIZADOS */
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
