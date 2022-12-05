import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { MultitablaService } from 'src/app/pages/_core/services/multitabla.service';
import { PermissionViewActionService } from 'src/app/Shared/services/permission-view-action.service';
import { CertificadosService } from '../../../_core/services/certificados.service';
import { DocumentoService } from '../../../_core/services/documento.service';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { DynamicFormComponent } from '../../_shared/dynamic-form/dynamic-form.component';
import { DatePipe } from '@angular/common';
import { AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';

import { puestoTrabajoService } from '../../../_core/services/puestoTrabajo.service';
import { CustomersService } from '../../../../../modules/e-commerce/_services/fake/customers.service';
import { VacanteService } from '../../../_core/services/vacante.service';
import { EmpresaService } from '../../../../Security/_core/services/empresa.service';
import { AreaService } from '../../../_core/services/area.service';

@Component({
  selector: 'app-save-update-vacante',
  templateUrl: './save-update-vacante.component.html',
  styleUrls: ['./save-update-vacante.component.scss'],
  providers: [DatePipe,
		{ provide: NgbDateAdapter, useClass: CustomAdapter },
		{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
	]
})
export class SaveUpdateVacanteComponent implements OnInit {
	/*IDVACANTE */	
	idVacante: number = 0;

	/* NAVEGACION */
	tabs = {
		DATOS_TAB: 0,
		FUNCIONES_TAB: 1,
		REQUISITOS_TAB: 2,
		ESPECIFICACIONES_TAB: 3
	};	
	activeTabId = this.tabs.DATOS_TAB;

	/* DATOS GENERALES */
	load_data: boolean = true;
	no_data: boolean = false;
	searchBan: boolean = false;

	formDatosGenerales: FormGroup;
	array_empresas: any;
	array_areas:any
	array_puestos: any;

	/* FUNCIONES */	
	nombreVacante: string = '';
	data_DescripcionFuncion: FormControl[] = [];
	array_funciones:any=[];
	array_funciones_eliminado:any=[];

	/* REQUISITOS */	
	data_DescripcionRequisito: FormControl[] = [];
	array_requisitos:any=[];
	array_requisitos_eliminado:any=[];

	/* ESPECIFICACIONES */
	data_DescripcionEspecificacion: FormControl[] = [];
	array_especificaciones:any=[];
	array_especificaciones_eliminado:any=[];

	/*SAVE UPDATE */	
	hide_save: Boolean = false;
	hide_load: Boolean = true;

	private subscriptions: Subscription[] = [];

	isLoading$;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private datePipe: DatePipe,

		private customersService: CustomersService,
		private fb: FormBuilder,

		public vacante_s: VacanteService,
		public documento_s: DocumentoService,
		public multitabla_s: MultitablaService,

		public empresa_s:EmpresaService,
		public area_s:AreaService,
		public puestoTrabajo_s:puestoTrabajoService,

		public pvas: PermissionViewActionService,
		public toastr: ToastrManager,
	) { }

	ngOnInit(): void {
		this.isLoading$ = this.customersService.isLoading$;		
		this.datosGeneralesForm();
		this.idVacante = this.route.snapshot.queryParams['id'] || 0;
		if (this.idVacante > 0) {			
			this.getDatosVacante(this.idVacante);
		} else {
			this.getEmpresas(null);
			this.getAreas(null,null);
			this.getPuestoTrabajos(null,null,null);
		}
	}
	
	changeTab(tabId: number) {
		this.activeTabId = tabId;
		console.log(tabId);
		this.nombreVacante = (this.formDatosGenerales.controls.Nombre.value === null ? '' : this.formDatosGenerales.controls.Nombre.value);
	}

	/* DATOS GENERALES */

	datosGeneralesForm() {
		this.formDatosGenerales = this.fb.group({
			Codigo: [null],
			Empresa: [null, Validators.compose([Validators.required])],
			Area: [null, Validators.compose([Validators.required])],
			PuestoTrabajo: [null, Validators.compose([Validators.required])],
			FechaInicioVigencia: [null, Validators.compose([Validators.required])],
			FechaFinVigencia: [null, Validators.compose([Validators.required])],
			Nombre: [null, Validators.compose([Validators.required])],
			Descripcion: [null, Validators.compose([Validators.required])],
			Activo: [true],      
		});
	}

	getDatosVacante(Vacante){
		this.vacante_s.GetDatosVacante(Vacante).subscribe(
			(data:any) => {
				let dataGenerales = data[0][0];
				console.log(dataGenerales);				
				this.formDatosGenerales.controls.Codigo.setValue(dataGenerales.codigo);
				this.formDatosGenerales.controls.Nombre.setValue(dataGenerales.nombre);
				this.formDatosGenerales.controls.FechaInicioVigencia.setValue(this.datePipe.transform(new Date(dataGenerales.inicioVigencia), 'yyyy-MM-dd'));
				this.formDatosGenerales.controls.FechaFinVigencia.setValue(this.datePipe.transform(new Date(dataGenerales.finVigencia), 'yyyy-MM-dd'));
				this.formDatosGenerales.controls.Descripcion.setValue(dataGenerales.descripcion);
				this.formDatosGenerales.controls.Activo.setValue(dataGenerales.activo);
				this.getEmpresas(dataGenerales.empresa);
				this.getAreas(dataGenerales.empresa,dataGenerales.area);
				this.getPuestoTrabajos(dataGenerales.empresa,dataGenerales.area,dataGenerales.puestoTrabajo);
				this.llenarFunciones(data[1]);
				this.llenarRequisitos(data[2]);
				this.llenarEspecificaciones(data[3]);
					          
			}, ( errorServicio ) => {           
			  console.log(errorServicio);
			}
		  );
	}

	

	getEmpresas(PosibleValor) {
		this.empresa_s.GetEmpresaByUsuario().subscribe(
			(data:any)=>{
				this.array_empresas = data;
				if(PosibleValor!== null){
					this.formDatosGenerales.controls.Empresa.setValue(PosibleValor)
				}
			}, (errorServicio)=>{
				console.log(errorServicio)
			}
		);
	  }
	
	getAreas(Empresa,PosibleValor){       
		this.formDatosGenerales.controls.Area.reset();		
		this.formDatosGenerales.controls.PuestoTrabajo.reset();  
		this.array_areas = [];  
		if (Empresa !== null && Empresa !== undefined) {    
			this.area_s.GetAreaByUsuario(Empresa).subscribe(
			(data:any) => {          
				this.array_areas = data;  
				console.log(this.array_areas);
				if (PosibleValor !== null) {
				this.formDatosGenerales.controls.Area.setValue(PosibleValor);
				}         
			}, ( errorServicio ) => {           
				console.log(errorServicio);
			}
			);
		} 
	}
	
	getPuestoTrabajos(Empresa,Area,PosibleValor) {
		this.formDatosGenerales.controls.PuestoTrabajo.reset();
		this.array_puestos = [];  
		if (Empresa !== null && Empresa!==undefined && Area !== null && Area!==undefined) { 
			this.puestoTrabajo_s.GetPuestoTrabajoByUsuario(Empresa,Area).subscribe(
			(data:any) => {
				this.array_puestos = data;
				if (PosibleValor !== null) {
					this.formDatosGenerales.controls.PuestoTrabajo.setValue(PosibleValor);
				} 
					
			}, ( errorServicio ) => {
					
				console.log(errorServicio);
			}
			);
		}
	}
	/* FUNCIONES */
	llenarFunciones(Funciones){
		for (let i = 0; i <= Funciones.length - 1; i++) {
			this.array_funciones.push(Funciones[i]);
			this.data_DescripcionFuncion.push(new FormControl(Funciones[i].Descripcion, [Validators.required]));
		}
		console.log(this.array_funciones);
	}

	addFuncion() {
		this.array_funciones.push({
			IdFuncion: 0,
			Descripcion: null,
			Activo: true,
		});
		this.data_DescripcionFuncion.push(new FormControl(null, [Validators.required]));
		console.log(this.array_funciones);
		
	}

	deleteFuncion(item){
		let index = this.array_funciones.indexOf(item);
		if (item.IdFuncion > 0) {
			this.array_funciones_eliminado.push(item);
		}
		this.array_funciones.splice(index, 1);
		this.data_DescripcionFuncion.splice(index, 1);
		console.log(this.array_funciones);
		console.log(this.array_funciones_eliminado);
	}

	/* REQUISITOS */
	llenarRequisitos(Requisitos){
		for (let i = 0; i <= Requisitos.length - 1; i++) {
			this.array_requisitos.push(Requisitos[i]);
			this.data_DescripcionRequisito.push(new FormControl(Requisitos[i].Descripcion, [Validators.required]));
		}
		console.log(this.array_requisitos);
	}
	addRequisito() {
		this.array_requisitos.push({
			IdRequisito: 0,
			Descripcion: null,
			Activo: true,
		});
		this.data_DescripcionRequisito.push(new FormControl(null, [Validators.required]));
		console.log(this.array_requisitos);
	}
	
	deleteRequisito(item){
		let index = this.array_requisitos.indexOf(item);
		if (item.IdRequisito > 0) {
			this.array_requisitos_eliminado.push(item);
		}
		this.array_requisitos.splice(index, 1);
		this.data_DescripcionRequisito.splice(index, 1);
		console.log(this.array_requisitos);
		console.log(this.array_requisitos_eliminado);
	}

	/* ESPECIFICACION */
	llenarEspecificaciones(Especificacion){
		for (let i = 0; i <= Especificacion.length - 1; i++) {
			this.array_especificaciones.push(Especificacion[i]);
			this.data_DescripcionEspecificacion.push(new FormControl(Especificacion[i].Descripcion, [Validators.required]));
		}
		console.log(this.array_especificaciones);
	}
	addEspecificacion() {
		this.array_especificaciones.push({
			IdEspecificacion: 0,
			Descripcion: null,
			Activo: true,
		});
		this.data_DescripcionEspecificacion.push(new FormControl(null, [Validators.required]));
		console.log(this.array_especificaciones);
	}
	
	deleteEspecificacion(item){
		let index = this.array_especificaciones.indexOf(item);
		if (item.IdEspecificacion > 0) {
			this.array_especificaciones_eliminado.push(item);
		}
		this.array_especificaciones.splice(index, 1);
		this.data_DescripcionEspecificacion.splice(index, 1);
		console.log(this.array_especificaciones);
		console.log(this.array_especificaciones_eliminado);
	}


	/*SAVE UPDATE */
	prepare_model() {		
		const controls = this.formDatosGenerales.controls;
		let dataFunciones = [];
		let dataRequisitos = [];
		let dataEspecificaciones = [];
		/*FUNCION*/
		for (let i = 0; i < this.array_funciones.length; i++) {
			dataFunciones.push({
				IdFuncion: this.array_funciones[i].IdFuncion,
				Descripcion: this.data_DescripcionFuncion[i].value,
				Activo: this.array_funciones[i].Activo,
				Eliminado: 0
			});
		}
		for (let i = 0; i < this.array_funciones_eliminado.length; i++) {
			dataFunciones.push({
				IdFuncion: this.array_funciones_eliminado[i].IdFuncion,
				Descripcion: this.array_funciones_eliminado[i].Descripcion,
				Activo: this.array_funciones_eliminado[i].Activo,
				Eliminado: 1
			});
		}
		/*REQUISITO*/
		for (let i = 0; i < this.array_requisitos.length; i++) {
			dataRequisitos.push({
				IdRequisito: this.array_requisitos[i].IdRequisito,
				Descripcion: this.data_DescripcionRequisito[i].value,
				Activo: this.array_requisitos[i].Activo,
				Eliminado: 0
			});
		}
		for (let i = 0; i < this.array_requisitos_eliminado.length; i++) {
			dataRequisitos.push({
				IdRequisito: this.array_requisitos_eliminado[i].IdRequisito,
				Descripcion: this.array_requisitos_eliminado[i].Descripcion,
				Activo: this.array_requisitos_eliminado[i].Activo,
				Eliminado: 1
			});
		}
		/*ESPECIFICACION*/
		for (let i = 0; i < this.array_especificaciones.length; i++) {
			dataEspecificaciones.push({
				IdEspecificacion: this.array_especificaciones[i].IdEspecificacion,
				Descripcion: this.data_DescripcionEspecificacion[i].value,
				Activo: this.array_especificaciones[i].Activo,
				Eliminado: 0
			});
		}
		for (let i = 0; i < this.array_especificaciones_eliminado.length; i++) {
			dataEspecificaciones.push({
				IdEspecificacion: this.array_especificaciones_eliminado[i].IdEspecificacion,
				Descripcion: this.array_especificaciones_eliminado[i].Descripcion,
				Activo: this.array_especificaciones_eliminado[i].Activo,
				Eliminado: 1
			});
		}

		return {
			Vacante: this.idVacante,
			Codigo: controls['Codigo'].value,
			Empresa:controls['Empresa'].value,
			Area: controls['Area'].value,
			PuestoTrabajo: controls['PuestoTrabajo'].value,
			Nombre: controls['Nombre'].value,
			Descripcion: controls['Descripcion'].value,
			InicioVigencia: this.datePipe.transform(controls['FechaInicioVigencia'].value, 'yyyy-MM-dd'),
			FinVigencia:  this.datePipe.transform(controls['FechaFinVigencia'].value, 'yyyy-MM-dd'),
			Activo: controls['Activo'].value,
			Funciones: dataFunciones,
			Requisitos: dataRequisitos,
			Especificaciones: dataEspecificaciones

		}
	}

	saveUpdateVacante() {
		this.hide_save = true;
		this.hide_load = false;
		const controls = this.formDatosGenerales.controls;

		if (this.formDatosGenerales.invalid) {
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

		for (let i = 0; i < this.array_funciones.length; i++) {
			this.activeTabId = 1;
			if (this.data_DescripcionFuncion[i].invalid) {
				this.hide_save = false;
				this.hide_load = true;
				this.toastr.warningToastr('Ingrese una Descripción, es obligatorio.', 'Advertencia!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				this.data_DescripcionFuncion.forEach(item => { if (item.invalid) item.markAsTouched()});
				return;
			}
		}

		for (let i = 0; i < this.array_requisitos.length; i++) {
			this.activeTabId = 2;
			if (this.data_DescripcionRequisito[i].invalid) {
				this.hide_save = false;
				this.hide_load = true;
				this.toastr.warningToastr('Ingrese una Descripción, es obligatorio.', 'Advertencia!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				this.data_DescripcionRequisito.forEach(item => { if (item.invalid) item.markAsTouched()});
				return;
			}
		}
		for (let i = 0; i < this.array_especificaciones.length; i++) {
			this.activeTabId = 3;
			if (this.data_DescripcionEspecificacion[i].invalid) {
				this.hide_save = false;
				this.hide_load = true;
				this.toastr.warningToastr('Ingrese una Descripción, es obligatorio.', 'Advertencia!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				this.data_DescripcionEspecificacion.forEach(item => { if (item.invalid) item.markAsTouched()});
				return;
			}
		}
		let datos = this.prepare_model();
		this.vacante_s.SaveUpdateVacante(datos).subscribe(
			(data: any) => {
				if (data[0].Ok > 0) {
					this.hide_save = false;
					this.hide_load = true;
					this.toastr.successToastr(data[0].Message, 'Correcto!', {
						toastTimeout: 2000,
						showCloseButton: true,
						animate: 'fade',
						progressBar: true
					});
					this.router.navigate(['Talento/masters/Vacante']);
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
	/*CONTROL GROUP */
	isControlValid(controlName: string): boolean {
		const control = this.formDatosGenerales.controls[controlName];
		return control.valid && (control.dirty || control.touched);
	}

	isControlInvalid(controlName: string): boolean {
		const control = this.formDatosGenerales.controls[controlName];
		return control.invalid && (control.dirty || control.touched);
	}

	controlHasError(validation, controlName): boolean {
		const control = this.formDatosGenerales.controls[controlName];
		return control.hasError(validation) && (control.dirty || control.touched);
	}

	isControlTouched(controlName): boolean {
		const control = this.formDatosGenerales.controls[controlName];
		return control.dirty || control.touched;
	}

	/*FUNCIONES REQUISITOS ESPECIFICACIONES */
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
