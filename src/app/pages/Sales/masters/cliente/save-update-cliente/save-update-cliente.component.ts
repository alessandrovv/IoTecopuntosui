import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ProveedorService } from 'src/app/pages/Logistica/_core/services/proveedor.service';
import { MultitablaService } from 'src/app/pages/_core/services/multitabla.service';
import { PermissionViewActionService } from 'src/app/Shared/services/permission-view-action.service';
import { ClientesService } from '../../../_core/clientes.service';
import { element } from 'protractor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SaveUpdateSucursalComponent } from './save-update-sucursal/save-update-sucursal.component';

@Component({
	selector: 'app-save-update-cliente',
	templateUrl: './save-update-cliente.component.html',
	styleUrls: ['./save-update-cliente.component.scss']
})
export class SaveUpdateClienteComponent implements OnInit {
	/* NAVEGACION */
	tabs = {
		DESCRIPCION_TAB: 0,
		SUCURSALES_TAB: 1,
		SUBCLIENTES_TAB: 2
	};
	activeTabId = this.tabs.DESCRIPCION_TAB;

	idCliente: number = 0;
	formDatosGenerales: FormGroup;

	array_clienteSucursal: any[] = []
	array_clienteSucursal_eliminado: any[] = [];

	array_pais: any;
	array_departamento: any;
	array_provincia: any;
	array_distrito: any;

	array_sucursal_pais: any;
	array_sucursal_departamento: any;
	array_sucursal_provincia: any;
	array_sucursal_distrito: any;

	array_tipo_doc: any;

	//SUBCLIENTE
	formSubclientes: FormGroup;
	estadosDocumento: boolean[] = [];
	estadosRazonSocial: boolean[] = [];
	array_subclientes_eliminado: any = [];
	array_subcliente_tipodocumento: any;

	hide_save: Boolean = false;
	hide_load: Boolean = true;
	isLoading$;
	constructor(
		private fb: FormBuilder,
		public multitabla_s: MultitablaService,
		public proveedor_s: ProveedorService,
		public pvas: PermissionViewActionService,
		public cliente_s: ClientesService,
		public toastr: ToastrManager,
		private chgRef: ChangeDetectorRef,
		private router: Router,
		private route: ActivatedRoute,

		private modalService: NgbModal,
	) { }

	ngOnInit() {
		this.idCliente = this.route.snapshot.queryParams['id'] || 0;
		this.datosForm();
		this.SubclientesForm();
		this.getListarPaises(null);
		this.getListarDepartamento(0, null);
		this.getListarProvincia(0, null);
		this.getListarDistrito(0, null);
		this.getTipoDocumentoIdentidad(null);
		if (this.idCliente > 0) {
			this.getDataCliente(this.idCliente);
		}
	}
	changeTab(tabId: number) {
		this.activeTabId = tabId;
	}
	getListarPaises(dataCabecera) {
		this.multitabla_s.GetListarPaises().subscribe(
			(data: any) => {
				if (dataCabecera != null) {
					if(dataCabecera.idPais!=null){
						if (data.find( pais => pais.Pais === dataCabecera.idPais ) === undefined){
							data.push(
								{
									Pais : dataCabecera.idPais,
									NombrePais: dataCabecera.Pais
								}
							);
						}
						this.array_pais = data;
						this.formDatosGenerales.controls.Pais.setValue(dataCabecera.idPais);
					}	
				}else{
					this.array_pais = data;
				}
			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

	getListarDepartamento(Pais, dataCabecera) {
		if (Pais !== 1) {
			this.formDatosGenerales.removeControl('Departamento');
			this.formDatosGenerales.removeControl('Provincia');
			this.formDatosGenerales.removeControl('Distrito');
			this.formDatosGenerales.addControl("Departamento", new FormControl(null));
			this.formDatosGenerales.addControl("Provincia", new FormControl(null));
			this.formDatosGenerales.addControl("Distrito", new FormControl(null));
		}

		this.formDatosGenerales.controls.Departamento.reset();
		this.multitabla_s.GetListarDepartamentos(Pais).subscribe(
			(data: any) => {
				if (dataCabecera != null) {
					if(dataCabecera.idDepartamento!=null){
						if (data.find( departamento => departamento.Departamento === dataCabecera.idDepartamento ) === undefined){
							data.push(
								{
									Departamento : dataCabecera.idDepartamento,
									NombreDepartamento: dataCabecera.Departamento
								}
							);
						}
						this.array_departamento = data.sort((a,b) => a.NombreDepartamento > b.NombreDepartamento? 1 : -1);
						this.formDatosGenerales.controls.Departamento.setValue(dataCabecera.idDepartamento);
					}	
				}
				else{
					this.array_departamento = data.sort((a,b) => a.NombreDepartamento > b.NombreDepartamento? 1 : -1);
				}

			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

	getListarProvincia(Departamento, dataCabecera) {
		this.formDatosGenerales.controls.Provincia.reset();
		this.multitabla_s.GetListarProvincia(Departamento).subscribe(
			(data: any) => {
				if (dataCabecera != null) {
					if(dataCabecera.idProvincia !=null){
						if (data.find( provincia => provincia.NombreProvincia === dataCabecera.idProvincia ) === undefined){
							data.push(
								{
									Provincia : dataCabecera.idProvincia,
									NombreProvincia: dataCabecera.Provincia
								}
							);
						}
						this.array_provincia = data.sort((a,b) => a.NombreProvincia > b.NombreProvincia? 1 : -1);
						this.formDatosGenerales.controls.Provincia.setValue(dataCabecera.idProvincia);
					}	
				}
				else{
					this.array_provincia = data.sort((a,b) => a.NombreProvincia > b.NombreProvincia? 1 : -1);
				}
			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

	getListarDistrito(Provincia, dataCabecera) {
		this.formDatosGenerales.controls.Distrito.reset();
		this.multitabla_s.GetListarDistrito(Provincia).subscribe(
			(data: any) => {
				if (dataCabecera != null) {
					if(dataCabecera.idDistrito !=null){
						if (data.find( distrito => distrito.NombreDistrito === dataCabecera.idDistrito ) === undefined){
							data.push(
								{
									Distrito : dataCabecera.idDistrito,
									NombreDistrito: dataCabecera.Distrito
								}
							);
						}
						this.array_distrito = data.sort((a,b) => a.NombreDistrito > b.NombreDistrito? 1 : -1);
						this.formDatosGenerales.controls.Distrito.setValue(dataCabecera.idDistrito);
					}	
				}
				else{
					this.array_distrito = data.sort((a,b) => a.NombreDistrito > b.NombreDistrito? 1 : -1);
				}
			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

	getTipoDocumentoIdentidad(dataCabecera) {
		this.multitabla_s.GetTipoDocumentoIdentidad().subscribe(
			(data: any) => {
				this.array_tipo_doc = data;
				if (dataCabecera != null) {
					if (data.find( tipoDocIdentidad => tipoDocIdentidad.ValorDocIdentidad === dataCabecera.idTipoDocumentoIdentidad ) === undefined){
						data.push(
							{
								ValorDocIdentidad : dataCabecera.idTipoDocumentoIdentidad,
								NombreDocIdentidad: dataCabecera.TipoDocumentoIdentidad
							}
						);
					}
					this.array_tipo_doc = data;
					this.formDatosGenerales.controls.TipoDocumento.setValue(dataCabecera.idTipoDocumentoIdentidad);
				}
				else{
					this.array_tipo_doc = data;
				}
			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

	//SUBCLIENTES
	SubclientesForm() {
		this.formSubclientes = this.fb.group({
			Subcliente: this.fb.array([])
		});
	}

	get Subclientes() {
		return this.formSubclientes.controls.Subcliente as FormArray;
	}

	getSubclientes(data) {
		data.forEach(element => {
			const subclienteForm = this.fb.group({
				IdClienteSubcliente: [element.IdClienteSubcliente],
				IdTipoDocumentoIdentidad: [element.IdTipoDocumentoIdentidad, Validators.compose([Validators.required])],
				DocumentoIdentidad: [element.DocumentoIdentidad, Validators.compose([Validators.required])],
				RazonSocial: [element.RazonSocial, Validators.compose([Validators.required])],
				Direccion: [element.Direccion],
				Email: [element.Email,Validators.compose([Validators.email])],
				Telefono: [element.Telefono],
				Activo: [element.Activo],
			});
			this.Subclientes.push(subclienteForm);
		});
	}

	addSubcliente() {
		const newSubcliente = this.fb.group({
			IdClienteSubcliente: 0,
			IdTipoDocumentoIdentidad: [null, Validators.compose([Validators.required])],
			DocumentoIdentidad: [null, Validators.compose([Validators.required])],
			RazonSocial: [null, Validators.compose([Validators.required])],
			Direccion: [null],
			Email: [null,Validators.compose([Validators.email])],
			Telefono: [null],
			Activo: [true],
		});
		this.Subclientes.push(newSubcliente);
		this.estadosDocumento.push(false);
		this.estadosRazonSocial.push(false);
		console.log(this.Subclientes);
	}

	deleteSubcliente(index) {
		if (this.Subclientes.controls[index]['controls']['IdClienteSubcliente'].value != 0) {
			this.array_subclientes_eliminado.push({
				IdClienteSubcliente: this.Subclientes.controls[index]['controls']['IdClienteSubcliente'].value,
				IdTipoDocumentoIdentidad: this.Subclientes.controls[index]['controls']['IdTipoDocumentoIdentidad'].value,
				DocumentoIdentidad: this.Subclientes.controls[index]['controls']['DocumentoIdentidad'].value,
				RazonSocial: this.Subclientes.controls[index]['controls']['RazonSocial'].value,
				Direccion: this.Subclientes.controls[index]['controls']['Direccion'].value,
				Email: this.Subclientes.controls[index]['controls']['Email'].value,
				Telefono: this.Subclientes.controls[index]['controls']['Telefono'].value,
				Activo: this.Subclientes.controls[index]['controls']['Activo'].value,
			});
		}

		this.buscarDocumentoEliminado(this.Subclientes.controls[index]['controls']['DocumentoIdentidad'].value, index);
		this.buscarRazonSocialEliminado(this.Subclientes.controls[index]['controls']['RazonSocial'].value, index);
		this.Subclientes.removeAt(index);
		this.estadosDocumento.splice(index, 1);
		this.estadosRazonSocial.splice(index, 1);
	}

	buscarDocumentoSubcliente(item, index) {
		let aux = false;
		for (let i = 0; i < this.Subclientes.length; i++) {
			if (i != index) {
				if (this.Subclientes.value[i].DocumentoIdentidad == item) {
					aux = true;
				}
			}
		}
		this.estadosDocumento[index] = aux;
	}

	buscarRazonSocialSubcliente(item, index) {
		let aux = false;
		for (let i = 0; i < this.Subclientes.length; i++) {
			if (i != index) {
				if (this.Subclientes.value[i].RazonSocial == item) {
					aux = true;
				}
			}
		}
		this.estadosRazonSocial[index] = aux;
	}

	buscarDocumentoEliminado(item, index) {
		let aux = [];
		for (let i = 0; i < this.Subclientes.length; i++) {
			if (i != index) {
				if (this.Subclientes.value[i].DocumentoIdentidad == item) {
					aux.push(i);
				}
			}
		}
		this.estadosDocumento[aux[0]] = false;
	}

	buscarRazonSocialEliminado(item, index) {
		let aux = [];
		for (let i = 0; i < this.Subclientes.length; i++) {
			if (i != index) {
				if (this.Subclientes.value[i].RazonSocial == item) {
					aux.push(i);
				}
			}
		}
		this.estadosRazonSocial[aux[0]] = false;
	}

	datosForm() {
		this.formDatosGenerales = this.fb.group({
			Codigo: [null],
			Pais: [null, Validators.compose([Validators.required])],
			Departamento: [null, Validators.compose([Validators.required])],
			Provincia: [null, Validators.compose([Validators.required])],
			Distrito: [null, Validators.compose([Validators.required])],

			RazonSocial: [null, Validators.compose([Validators.required])],
			NombreComercial: [null, Validators.compose([Validators.required])],

			Direccion: [null, Validators.compose([Validators.required])],
			Referencia: [null],

			TipoDocumento: [null, Validators.compose([Validators.required])],
			DocumentoIdentidad: [null, Validators.compose([Validators.required])],
			Email: [null],

			Telefono1: [null, Validators.compose([Validators.required])],
			Telefono2: [null],

			Activo: [true],
		});
	}
	getDataCliente(idCliente) {
		this.cliente_s.GetDataCliente(idCliente).subscribe(
			(data: any) => {
				console.log('-------------');
				console.log(data);
				console.log('-------------');
				this.formDatosGenerales.controls.Codigo.setValue(data[0][0].codigo);
				this.getListarPaises(data[0][0]);
				this.getListarDepartamento(data[0][0].idPais, data[0][0]);
				this.getListarProvincia(data[0][0].idDepartamento, data[0][0]);
				this.getListarDistrito(data[0][0].idProvincia, data[0][0]);
				this.getTipoDocumentoIdentidad(data[0][0]);
				this.formDatosGenerales.controls.RazonSocial.setValue(data[0][0].razonSocial);
				this.formDatosGenerales.controls.NombreComercial.setValue(data[0][0].nombreComercial);

				this.formDatosGenerales.controls.Direccion.setValue(data[0][0].direccion);
				this.formDatosGenerales.controls.Referencia.setValue(data[0][0].referencia);
				this.formDatosGenerales.controls.TipoDocumento.setValue(data[0][0].idTipoDocumentoIdentidad);
				this.formDatosGenerales.controls.DocumentoIdentidad.setValue(data[0][0].documentoIdentidad);
				this.formDatosGenerales.controls.Email.setValue(data[0][0].email);
				this.formDatosGenerales.controls.Telefono1.setValue(data[0][0].telefono1);
				this.formDatosGenerales.controls.Telefono2.setValue(data[0][0].telefono2);
				this.formDatosGenerales.controls.Activo.setValue(data[0][0].activo);
				this.llenarClienteSucursal(data[1]);
				this.getSubclientes(data[4]);
				this.chgRef.markForCheck();
			}, (errorServicio) => {
				console.log(errorServicio);
			});
	}

	llenarClienteSucursal(data) {
		data.forEach(element => {
			const sucursal = {
				ClienteSucursal: element.idClienteSucursal,
				Pais: element.idPais,
				NombrePais: element.NombrePais,
				Departamento: element.idDepartamento,
				NombreDepartamento: element.NombreDepartamento,
				Provincia: element.idProvincia,
				NombreProvincia: element.NombreProvincia,
				Distrito: element.idDistrito,
				NombreDistrito: element.NombreDistrito,
				Direccion: element.direccion,
				Referencia: element.referencia,
				Activo: element.activo,
			}
			this.array_clienteSucursal.push(sucursal);
			console.log(this.array_clienteSucursal);

		});
		this.chgRef.markForCheck();
	}

	deleteClienteSucursal(index) {
		if (this.array_clienteSucursal[index].ClienteSucursal != 0) {
			this.array_clienteSucursal_eliminado.push(this.array_clienteSucursal[index]);
		}
		this.array_clienteSucursal.splice(index, 1);
		console.log(this.array_clienteSucursal);
		this.chgRef.markForCheck();
	}
	prepare_model() {

		let dataClienteSucursal = [];
		let dataSubclientes = [];
		this.array_clienteSucursal.forEach(element => {
			dataClienteSucursal.push({
				ClienteSucursal: element.ClienteSucursal,
				Pais: element.Pais,
				Departamento: element.Departamento,
				Provincia: element.Provincia,
				Distrito: element.Distrito,
				Direccion: element.Direccion,
				Referencia: element.Referencia,
				Activo: true,
				Eliminado: false
			})
		})
		this.array_clienteSucursal_eliminado.forEach(element => {
			dataClienteSucursal.push({
				ClienteSucursal: element.ClienteSucursal,
				Pais: element.Pais,
				Departamento: element.Departamento,
				Provincia: element.Provincia,
				Distrito: element.Distrito,
				Direccion: element.Direccion,
				Referencia: element.Referencia,
				Activo: true,
				Eliminado: true
			})
		});

		this.Subclientes.value.forEach(e => {
			dataSubclientes.push({
				IdClienteSubcliente: e.IdClienteSubcliente,
				IdTipoDocumentoIdentidad: e.IdTipoDocumentoIdentidad,
				DocumentoIdentidad: e.DocumentoIdentidad,
				RazonSocial: e.RazonSocial,
				Direccion: e.Direccion,
				Email: e.Email,
				Telefono: e.Telefono,
				Activo: e.Activo,
				Eliminado: 0
			});
		});
		this.array_subclientes_eliminado.forEach(e => {
			dataSubclientes.push({
				IdClienteSubcliente: e.IdClienteSubcliente,
				IdTipoDocumentoIdentidad: e.IdTipoDocumentoIdentidad,
				DocumentoIdentidad: e.DocumentoIdentidad,
				RazonSocial: e.RazonSocial,
				Direccion: e.Direccion,
				Email: e.Email,
				Telefono: e.Telefono,
				Activo: e.Activo,
				Eliminado: 1
			});
		});

		const controls = this.formDatosGenerales.controls;
		return {
			Cliente: this.idCliente,
			Pais: controls['Pais'].value,
			Departamento: controls['Departamento'].value,
			Provincia: controls['Provincia'].value,
			Distrito: controls['Distrito'].value,

			RazonSocial: controls['RazonSocial'].value,
			NombreComercial: controls['NombreComercial'].value,

			Direccion: controls['Direccion'].value,
			Referencia: controls['Referencia'].value,

			TipoDocumento: controls['TipoDocumento'].value,
			DocumentoIdentidad: controls['DocumentoIdentidad'].value,
			Email: controls['Email'].value,

			Telefono1: controls['Telefono1'].value,
			Telefono2: controls['Telefono2'].value,
			Activo: controls['Activo'].value,
			xmlClienteSucursal: dataClienteSucursal,
			xmlClienteSubcliente: dataSubclientes,
		}
	}
	saveUpdateClienteSucursal(item) {
		const modalRef = this.modalService.open(SaveUpdateSucursalComponent, { size: 'ms' });
		modalRef.componentInstance.item = item;
		modalRef.componentInstance.tipo = null;
		modalRef.result.then((result) => {
			let sucursal = result;
			if (sucursal.ClienteSucursal != null) {
				let index = this.array_clienteSucursal.indexOf(item);
				this.array_clienteSucursal[index] = sucursal;
			}
			else {
				this.array_clienteSucursal.push({ ...sucursal, ClienteSucursal: 0 });
			}
			console.log(this.array_clienteSucursal);

			this.chgRef.markForCheck();
		}, (reason) => {
			console.log(reason);
		});
	}
	saveUpdateCliente() {
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
		if (this.array_clienteSucursal.length == 0) {
			this.hide_save = false;
			this.hide_load = true;
			this.toastr.warningToastr('Debe asignar al menos una sucursal', 'Advertencia!', {
				toastTimeout: 4000,
				showCloseButton: true,
				animate: 'fade',
				progressBar: true
			});
			this.activeTabId = 1;
			return;
		}
		if (this.formSubclientes.invalid) {
			this.hide_save = false;
			this.hide_load = true;
			this.toastr.warningToastr('Ingrese los campos obligatorios.', 'Advertencia!', {
				toastTimeout: 2000,
				showCloseButton: true,
				animate: 'fade',
				progressBar: true
			});
			this.formSubclientes.markAllAsTouched();
			this.activeTabId = 2;
			return;
		}
		if (this.estadosDocumento.includes(true) || this.estadosRazonSocial.includes(true)) {
			this.hide_save = false;
			this.hide_load = true;
			this.toastr.warningToastr('Cambie los campos repetidos', 'Advertencia!', {
				toastTimeout: 2000,
				showCloseButton: true,
				animate: 'fade',
				progressBar: true
			});
			this.activeTabId = 2;
			return;
		}

		let datos = this.prepare_model();
		console.log('-----------------------------');
		console.log('Data Enviada', datos);
		console.log('-----------------------------');
		this.cliente_s.SaveUpdateCliente(datos).subscribe((data: any) => {
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
				this.router.navigate(['Sales/masters/Cliente']);
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


	isFormControlValid(controlName): boolean {
		return controlName.valid && (controlName.dirty || controlName.touched);
	}

	isFormControlInvalid(controlName): boolean {
		return controlName.invalid && (controlName.dirty || controlName.touched);
	}

	FormControlHasError(validation, controlName): boolean {
		return controlName.hasError(validation) && (controlName.dirty || controlName.touched);
	}

	FormControlDocumentoRepetido(controlName, index): boolean {
		return (controlName.dirty || controlName.touched) && this.estadosDocumento[index] == true;
	}

	FormControlRazonSocialRepetido(controlName, index): boolean {
		return (controlName.dirty || controlName.touched) && this.estadosRazonSocial[index] == true;
	}
}
