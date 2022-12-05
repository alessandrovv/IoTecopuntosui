import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { Subscription } from 'rxjs';
import { ToastrManager } from 'ng6-toastr-notifications';
import { PermissionViewActionService } from 'src/app/Shared/services/permission-view-action.service';
import { VehiculoService } from '../../../_core/services/vehiculo.service';
import { finalize } from 'rxjs/operators';
import { TypeControlEnum } from '../../../_core/model/type-control.enum.model';
import { SaveUpdateNeumaticosModalComponent } from '../save-update-neumaticos-modal/save-update-neumaticos-modal.component';
import { ProveedorService } from 'src/app/pages/Logistica/_core/services/proveedor.service';
import { SaveUpdateDocumentosModalComponent } from '../save-update-documentos-modal/save-update-documentos-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentoService } from '../../../_core/services/documento.service';
import { DatePipe } from '@angular/common';
import { AlertaService } from '../../../_core/services/alerta.service';
import { NeumaticoService } from '../../../_core/services/neumatico.service';

@Component({
	selector: 'app-save-update-vehiculo',
	templateUrl: './save-update-vehiculo.component.html',
	styleUrls: ['./save-update-vehiculo.component.scss']
})
export class SaveUpdateVehiculoComponent implements OnInit {



	constructor(
		private modalService: NgbModal,
		private fb: FormBuilder,
		public toastr: ToastrManager,
		private chgRef: ChangeDetectorRef,
		private router: Router,
		public pvas: PermissionViewActionService,
		private route: ActivatedRoute,
		public vehiculo_s: VehiculoService,
		public documento_s: DocumentoService,
		public neumatico_s: NeumaticoService,
		public alerta_s: AlertaService,
		public proveedor_s: ProveedorService,
		private formBuilder: FormBuilder,) {
	}

	// ngDoCheck() {
	// 	console.log('Changes detected');

	// }

	load_data = true;
	no_data = false;
	searchBan = false;
	// filterGroup: FormGroup;
	searchGroup: FormGroup;

	load_data2 = true;
	no_data2 = false;
	searchBan2 = false;
	// filterGroup: FormGroup;
	searchGroup2: FormGroup;

	listData: MatTableDataSource<any>;
	displayedColumns: string[] = ['TipoDocumento', 'NumeroDocumento', 'FechaPago', 'ImportePago', 'FechaInicioVigencia'
		, 'FechaFinVigencia', 'ProximoPago', 'Activo', 'Acciones'];

	@ViewChild(MatSort) MatSort: MatSort;
	@ViewChild('matPaginator', { static: true }) paginator: MatPaginator;


	listData2: MatTableDataSource<any>;
	displayedColumns2: string[] = ['Codigo', 'Nombre', 'Marca', 'Tipo', 'Posicion'
		, 'Tamanio', 'Traccion', 'SurcoInicial', 'CostoUnitario', 'Activo', 'Acciones'];

	@ViewChild(MatSort) MatSort2: MatSort;
	@ViewChild('matPaginator', { static: true }) paginator2: MatPaginator;

	formDatos: FormGroup;
	idVehiculo: number = 0;

	FilterformTipoVehiculo: FormGroup;
	prefixNameControl = `c_${(new Date()).getTime()}_`;


	prefixValueArrayAlerta = `c_${(new Date()).getTime()}_`;

	// Recordar usar para un siguiente filtro por estados Activo, Inactivo y Todos.
	array_estado: any = [
		{ value: -1, descripcion: 'Todos' },
		{ value: 1, descripcion: 'Activo' },
		{ value: 0, descripcion: 'Inactivo' }
	];

	array_procedencia: any;

	array_tipoVehiculo: any;

	array_proveedores: any;

	array_datosVehiculo: any;

	array_tipoAlertaMantenimiento: any;

	hide_save: Boolean = false;
	hide_load: Boolean = true;

	metadata: any;

	tabs = {
		DATOS_TAB: 0, // DATOS GENERALES
		DOCUMENTOS_TAB: 1, // DOCUMENTOS
		ALERTAS_TAB: 2, // ALERTAS
		NEUMATICOS_TAB: 3// NEUMATICOS
	};

	activeTabId = this.tabs.DATOS_TAB;


	deta_formTipoMantenimiento: FormControl[] = [];
	deta_formCiclosKM: FormControl[] = [];
	deta_formAlertaKM: FormControl[] = [];
	deta_formActivo: FormControl[] = [];


	readyForm = false;
	data: any = {};


	array_vehiculoCaracteristicas: any = [];
	array_vehiculoCaracteristicas_Eliminados: any = [];

	array_vehiculoDocumentos: any = [];
	array_vehiculoDocumentos_Eliminados: any = []

	array_vehiculoAlertas: any = [];
	array_vehiculoAlertas_Eliminados: any = [];

	array_neumaticos: any = [];
	array_vehiculoNeumaticos: any = [];
	array_vehiculoNeumaticos_Eliminados: any = [];

	controlsEnum: typeof TypeControlEnum = TypeControlEnum;


	private subscriptions: Subscription[] = [];
	validViewAction = this.pvas.validViewAction;
	viewsActions: Array<Navigation> = [];

	array_data = [];

	// controls: any = {}
	ngOnInit(): void {
		this.listData = new MatTableDataSource([]);
		this.listData2 = new MatTableDataSource([]);
		this.viewsActions = this.pvas.get();
		// this.filterForm();
		this.datosForm();
		this.searchForm();
		this.getTipoVehiculos();
		this.getProveedores();
		this.getTipoProcedencia();
		this.GetTipoAlertaMantenimiento();
		this.idVehiculo = this.route.snapshot.queryParams['id'] || 0;
		if (this.idVehiculo > 0) {
			this.GetDatosVehiculo(this.idVehiculo);

		}
		this.disableProveedorIf();
	}

	datosForm() {
		this.formDatos = this.fb.group({
			Placa: [null, Validators.compose([Validators.required])],
			Proveedor: [null],
			Procedencia: [null, Validators.compose([Validators.required])],
			TipoVehiculo: [null, Validators.compose([Validators.required])],
		});
	}
	searchForm() {
		this.searchGroup = this.fb.group({
			searchTerm: [''],
			searchTerm2: [''],
		});
	}

	disableFormDatos() {
		this.formDatos.get("Placa").disable();
		this.formDatos.get("Procedencia").disable();
		this.formDatos.get("Proveedor").disable();
		this.formDatos.get("TipoVehiculo").disable();
	}

	enableFormDatos() {
		this.formDatos.get("Placa").enable();
		this.formDatos.get("Procedencia").enable();
		this.formDatos.get("Proveedor").enable();
		this.formDatos.get("TipoVehiculo").enable();
	}

	disableProveedorIf() {
		if (this.idVehiculo > 0) {
			if (this.formDatos.controls.Procedencia.value == '0002'
				|| this.formDatos.controls.Procedencia.value == '0003') {
				this.formDatos.get("Proveedor").enable();//vehiculo a actualizar
			} else {
				this.formDatos.get("Proveedor").disable();
				this.formDatos.controls.Proveedor.setValue(0);
			}
		} else {
			if (this.formDatos.controls.Procedencia.value == '0002'
				|| this.formDatos.controls.Procedencia.value == '0003') {
				this.formDatos.controls.Proveedor.setValue(0);//Cuando es un nuevo vehiculo
				this.formDatos.get("Proveedor").enable();//vehiculo a actualizar

			} else {
				this.formDatos.get("Proveedor").disable();
				// this.formDatos.controls.Proveedor.updateValueAndValidity();
			}
		}
		this.chgRef.markForCheck();
	}



	changeTab(tabId: number) {
		this.activeTabId = tabId;
		if (tabId === 0) {
			console.log("tab_Datos");
			this.enableFormDatos();
			this.disableProveedorIf()
		}

		if (tabId === 1) { // Documentos
			console.log("tab_Documentos");
			this.disableFormDatos();
		}

		if (tabId === 2) { // Alertas
			console.log("tab_Alertas");
			this.disableFormDatos();
		}
		if (tabId === 3) { // Neumaticos
			console.log("tab_Neumaticos");
			this.disableFormDatos();
		}

	}

	//#region Vehiculo datos generales
	getTipoProcedencia() {
		let defaultIndex
		this.vehiculo_s.GetTipoProcedencia().subscribe(
			(data: any) => {

				this.array_procedencia = data;
				this.array_procedencia.unshift({
					valor: '0000',
					nombre: 'Todos',
				});
				if (this.array_procedencia.length > 1) {
					defaultIndex = data[0].valor;
					this.formDatos.controls.Procedencia.setValue(defaultIndex);
				}
			}
		)
	}

	getProveedores() {
		let defaultIndex = 0
		this.vehiculo_s.GetProveedoresTransporte(0).subscribe(
			(data: any) => {

				this.array_proveedores = data;
				this.array_proveedores.unshift({
					idProveedor: 0,
					razonSocial: 'Todos',
					idCategoriaProveedor: 1,
					categoria: 'Transporte'
				});
				if (this.array_proveedores.length > 1) {
					defaultIndex = data[0].idProveedor;
					this.formDatos.controls.Proveedor.setValue(defaultIndex);
				}

			}
		)
	}



	getTipoVehiculos() {
		this.vehiculo_s.GetTipoVehiculo(1)
			.pipe(
		)
			.subscribe( // Con el parametro en 1 obtenemos todos los tipos vehiculos activos
				(data: any) => {
					this.array_tipoVehiculo = data;


					if (this.array_tipoVehiculo.length > 1) {
						this.array_tipoVehiculo.unshift({
							idTipoVehiculo: 0, nombre: 'Seleccionar tipo vehiculo...', Descripcion: 'Seleccionar tipo vehiculo...', activo: true
						});
					}
					this.formDatos.controls.TipoVehiculo.setValue(this.array_tipoVehiculo[0].idTipoVehiculo);
				}, (errorServicio) => {

				}
			);
	}


	GetDatosVehiculo(idVehiculo) {
		let defaultIndex = 0
		var dataExclusivaVehiculo

		this.vehiculo_s.GetDatosVehiculo(idVehiculo)
			.pipe(
				finalize(
					() => {
						// setTimeout(() => {
						// 	this.getCaracteristicasByTipoVehiculo(dataExclusivaVehiculo.tipoVehiculo);
						// }, 1000);

						this.getCaracteristicasByTipoVehiculo(dataExclusivaVehiculo.tipoVehiculo);

						this.getDocumentosOnInit(this.idVehiculo);
						this.getAlertasOnInit(this.idVehiculo);

						this.getNeumaticosOnInit(this.idVehiculo);

					}
				)
			)
			.subscribe(
				(data: any) => {

					this.array_datosVehiculo = data;


					dataExclusivaVehiculo = {
						placa: this.array_datosVehiculo[0].placa,
						procedencia: this.array_datosVehiculo[0].idProcedencia,
						proveedor: this.array_datosVehiculo[0].idProveedor,
						tipoVehiculo: this.array_datosVehiculo[0].idTipoVehiculo
					}


					// this.getDocumentosOnInit(this.idVehiculo);/*Observación, si hay un error(Exception) al obtener dataExclusivaVehiculo
					// entonces no se podra obtener los documentos del vehiculo. La solucion es llamar al método directamente en el oninit junto con datos el método datos de vehiculo -> GetDatosVehiculo(this.idVehiculo);

					// De la misma forma ocurrira con lo que sigue a continuación
					// */

					// this.getAlertasOnInit(this.idVehiculo);

					// this.getNeumaticosOnInit(this.idVehiculo);

					// setTimeout(() => {
					// 	this.formDatos.controls.Placa.setValue(dataExclusivaVehiculo.placa)
					// 	this.formDatos.controls.Procedencia.setValue(dataExclusivaVehiculo.procedencia)
					// 	this.formDatos.controls.Proveedor.setValue(dataExclusivaVehiculo.proveedor)
					// 	this.formDatos.controls.TipoVehiculo.setValue(dataExclusivaVehiculo.tipoVehiculo)
					// 	this.chgRef.markForCheck();
					// }, 500);

					this.formDatos.controls.Placa.setValue(dataExclusivaVehiculo.placa)
					this.formDatos.controls.Procedencia.setValue(dataExclusivaVehiculo.procedencia)
					this.formDatos.controls.Proveedor.setValue(dataExclusivaVehiculo.proveedor)
					this.formDatos.controls.TipoVehiculo.setValue(dataExclusivaVehiculo.tipoVehiculo)
					this.chgRef.markForCheck();
				}
			)
	}

	getCaracteristicasByTipoVehiculo(idTipoVehiculo) {

		this.vehiculo_s.GetCaracteristicasByTipoVehiculo(idTipoVehiculo).subscribe(
			(data: any) => {
				this.metadata = data;
				this.loadDataDatos();
				this.chgRef.markForCheck();
			}
		);

	}
	//#endregion

	//#region Caracteristicas por Vehiculo y tipo vehiculo
	loadDataDatos() {
		this.readyForm = false;
		this.data = {};
		let array_cbo = []; // si existe un tipo de dato combo, entonces se poblara el arreglo array_cbo con sus valores respectivos
		const controls: any = {};

		let idTipoVehiculoCaracteristica_previous;
		this.metadata.forEach(control => {
			this.data[control.idTipoVehiculoCaracteristica] = {
				idCaracteristicaVehiculo: control.idCaracteristicaVehiculo,
				IdConfigDato: control.idTipoVehiculoCaracteristica,
				ControlName: `${this.prefixNameControl}${control.idTipoVehiculoCaracteristica}`,
				TipoDatoRespuesta: control.tipoDato,
				NombreDato: control.caracteristica,
				value: null,
				valueCbo: []
			};
			if (control.defaultValue) {
				this.data[control.idTipoVehiculoCaracteristica].value = control.defaultValue;
			}

			if (control.tipoDato == TypeControlEnum.CHECK) {
				this.data[control.idTipoVehiculoCaracteristica].value = false;
			}

			if (control.tipoDato == TypeControlEnum.LIST_WS) {

				if (control.idTipoVehiculoCaracteristica == idTipoVehiculoCaracteristica_previous) {
					array_cbo.push(control.valorCaracteristica);
				}
				else {

					array_cbo = [];
					array_cbo.push(control.valorCaracteristica); /**En el caso que el siguiente elemento sea de tipo de dato combo,
					entoonces la primera vez debemos empujar ese valor caracteristica para no perderlo*/

				}
			} else {
				array_cbo = [];
			}
			this.data[control.idTipoVehiculoCaracteristica].valueCbo = array_cbo;

			idTipoVehiculoCaracteristica_previous = control.idTipoVehiculoCaracteristica;

			controls[this.data[control.idTipoVehiculoCaracteristica].ControlName] = [this.data[control.idTipoVehiculoCaracteristica].value, []];

			if (control.obligatorio == 1) {

				controls[this.data[control.idTipoVehiculoCaracteristica].ControlName] = [this.data[control.idTipoVehiculoCaracteristica].value, Validators.compose([Validators.required])];
			}

		});

		this.FilterformTipoVehiculo = this.formBuilder.group(controls);

		this.array_data = Object.values(this.data);
		this.fillVehiculosCaracteristicas(this.array_data);
		this.readyForm = true;
	}




	fillVehiculosCaracteristicas(paramVehiculoCaracteristicas) {
		this.array_vehiculoCaracteristicas = [];
		// try {
		if (this.idVehiculo > 0) { //update
			if (this.array_datosVehiculo.length > 0 && this.array_datosVehiculo[0].idTipoVehiculo ==
				this.formDatos.controls.TipoVehiculo.value) {// Tipo vehiculo pertenece al vehiculo seleccionado actual

				for (let i = 0; i < this.array_datosVehiculo.length; i++) {

					//Tipo vehiculo pertenece al vehiculo seleccionado actual
					let vehiculoCaracteristica = {
						idVehiculoCaracteristica: this.array_datosVehiculo[i].idVehiculoCaracteristica,
						idVehiculo: this.idVehiculo,
						idTipoVehiculoCaracteristica: this.array_datosVehiculo[i].idTipoVehiculoCaracteristica,
						idCaracteristicaVehiculo: this.array_datosVehiculo[i].idCaracteristicaVehiculo,
						valor: this.data[this.array_datosVehiculo[i].idTipoVehiculoCaracteristica].ControlName,
						valorCaracteristica: this.array_datosVehiculo[i].valorCaracteristica

					}

					// Establecer valor a las caracteristicas del vehiculo encontradas
					this.FilterformTipoVehiculo.controls[
						vehiculoCaracteristica.valor
					].setValue(this.array_datosVehiculo[i].valorCaracteristica);
					this.array_vehiculoCaracteristicas.push(vehiculoCaracteristica)
				}

				this.array_vehiculoCaracteristicas_Eliminados = this.array_vehiculoCaracteristicas;
			} else {
				for (let i = 0; i < paramVehiculoCaracteristicas.length; i++) {
					let vehiculoCaracteristica = {
						idVehiculoCaracteristica: 0,
						idVehiculo: this.idVehiculo,
						idTipoVehiculoCaracteristica: paramVehiculoCaracteristicas[i].IdConfigDato,
						idCaracteristicaVehiculo: paramVehiculoCaracteristicas[i].idCaracteristicaVehiculo,
						valor: this.data[paramVehiculoCaracteristicas[i].IdConfigDato].ControlName,
						valorCaracteristica:

							this.array_datosVehiculo.
								find(e => e.idCaracteristicaVehiculo == paramVehiculoCaracteristicas[i].idCaracteristicaVehiculo) &&
								paramVehiculoCaracteristicas[i].idCaracteristicaVehiculo == this.array_datosVehiculo.
									find(e => e.idCaracteristicaVehiculo == paramVehiculoCaracteristicas[i].idCaracteristicaVehiculo).idCaracteristicaVehiculo ?
								this.array_datosVehiculo.
									find(e => e.idCaracteristicaVehiculo == paramVehiculoCaracteristicas[i].idCaracteristicaVehiculo).valorCaracteristica
								: null
					}

					if (paramVehiculoCaracteristicas[i].TipoDatoRespuesta == TypeControlEnum.LIST_WS) {
						this.FilterformTipoVehiculo.controls[
							vehiculoCaracteristica.valor
						].setValue(paramVehiculoCaracteristicas[i].valueCbo[0]);
						// this.array_vehiculoCaracteristicas.push(vehiculoCaracteristica)
					} else {
						this.FilterformTipoVehiculo.controls[
							vehiculoCaracteristica.valor
						].setValue(vehiculoCaracteristica.valorCaracteristica);

					}
					this.array_vehiculoCaracteristicas.push(vehiculoCaracteristica)
				}

			}
		} else { //create
			for (let i = 0; i < paramVehiculoCaracteristicas.length; i++) {
				let vehiculoCaracteristica = {
					idVehiculoCaracteristica: 0,
					idVehiculo: this.idVehiculo,
					idTipoVehiculoCaracteristica: paramVehiculoCaracteristicas[i].IdConfigDato,
					idCaracteristicaVehiculo: paramVehiculoCaracteristicas[i].idCaracteristicaVehiculo,
					valor: this.data[paramVehiculoCaracteristicas[i].IdConfigDato].ControlName,
					valorCaracteristica: null
				}
				this.array_vehiculoCaracteristicas.push(vehiculoCaracteristica)
			}
		}
		// } catch (exception) {
		// 	console.log(exception);
		// }

		this.chgRef.markForCheck();
	}
	//#endregion

	//#region Documentos
	getDocumentosOnInit(idVehiculo) {
		this.documento_s.GetListarVehiculoDocumentos(idVehiculo).subscribe(
			(data: any) => {
				this.array_vehiculoDocumentos = data;
				this.array_vehiculoDocumentos = this.array_vehiculoDocumentos
					.map(e => {
						const datepipe: DatePipe = new DatePipe('en-US')
						let formattedFechaPago = datepipe.transform(e.fechaPago, 'yyyy-MM-dd')
						e.fechaPago = formattedFechaPago

						let formattedFechaInicioVigencia = datepipe.transform(e.fechaInicioVigencia, 'yyyy-MM-dd')
						e.fechaInicioVigencia = formattedFechaInicioVigencia

						let formattedFechaFinVigencia = datepipe.transform(e.fechaFinVigencia, 'yyyy-MM-dd')
						e.fechaFinVigencia = formattedFechaFinVigencia

						if (e.activo == true) {

							e.activo = 'Si'
						}
						return e;
					})
				this.load_data = true;
				this.searchBan = false;
				this.listData = new MatTableDataSource(this.array_vehiculoDocumentos);
				if (data.length > 0) {
					this.no_data = true;
				} else {
					this.no_data = false;
				}
				this.listData.sort = this.MatSort;
				this.listData.paginator = this.paginator;

			}, (errorServicio) => {
				console.log(errorServicio);
				this.load_data = true;
				this.no_data = false;
				this.searchBan = false;
			}
		);
	}

	getDocumentos(documento = null) {
		this.listData = new MatTableDataSource([]);
		this.searchBan = false;
		this.load_data = false;
		this.no_data = true;

		let existDocumento
		if (documento.idVehiculoDocumento > 0) { // EditDocumento de la base de datos ( en el servidor)
			existDocumento = this.array_vehiculoDocumentos.find(
				e => e.idVehiculoDocumento == documento.idVehiculoDocumento
			)
		} else { // EditDocumento generado en el cliente (Aquí)


			existDocumento = this.array_vehiculoDocumentos.find(
				e => e.codigo == documento.codigo
			)
		}



		if (existDocumento) { // Si existe editDocumento, entonces editar
			if (existDocumento.codigo) {
				this.load_data = true;
				this.searchBan = false;
				this.array_vehiculoDocumentos = this.array_vehiculoDocumentos
					.map(e => {
						if (e.codigo == documento.codigo) {
							let doc = this.array_vehiculoDocumentos.find(e => e.numeroDocumento == documento.numeroDocumento)
							if (doc) {
								this.toastr.errorToastr('El numero de documento ya existe.', 'Error!', {
									toastTimeout: 2000,
									showCloseButton: true,
									animate: 'fade',
									progressBar: true
								});
								return e;
							} else {
								return documento;
							}

						}
						return e;
					})
			} else if (existDocumento.idVehiculoDocumento > 0) {
				this.load_data = true;
				this.searchBan = false;
				this.array_vehiculoDocumentos = this.array_vehiculoDocumentos
					.map(e => {
						if (e.idVehiculoDocumento == documento.idVehiculoDocumento) {
							let doc = this.array_vehiculoDocumentos.find(e => e.numeroDocumento == documento.numeroDocumento)
							if (doc) {
								this.toastr.errorToastr('El numero de documento ya existe.', 'Error!', {
									toastTimeout: 2000,
									showCloseButton: true,
									animate: 'fade',
									progressBar: true
								});
								return e;
							} else {
								return documento;
							}
						}
						return e;
					})
			}
		} else { //Crear
			this.load_data = true;
			this.searchBan = false;
			let doc = this.array_vehiculoDocumentos.find(e => e.numeroDocumento == documento.numeroDocumento)
			if (doc) {
				this.toastr.errorToastr('El numero de documento ya existe.', 'Error!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
			}
			else {
				this.array_vehiculoDocumentos.push(documento);
			}

		}
		this.listData = new MatTableDataSource(this.array_vehiculoDocumentos);
		if (this.array_vehiculoDocumentos.length > 0) {
			this.no_data = true;
		} else {
			this.no_data = false;
		}
		this.listData.sort = this.MatSort;
		this.listData.paginator = this.paginator;

		// }

		this.chgRef.markForCheck();
	}
	//#region neumaticos

	//#endregion
	createDocumento() {


		// Entidad Seguros se actualizo a Documentos
		let documento;
		const modalRef = this.modalService.open(SaveUpdateDocumentosModalComponent, { size: 'ms' });
		modalRef.componentInstance.vehiculoDocumentoEvent?.subscribe(
			e => {
				//Modificar el objeto y agregar los campos necesarios
				e = {
					codigo: e.codigo,
					idVehiculoDocumento: e.idVehiculoDocumento,
					idVehiculo: this.idVehiculo,
					idTipoDocumento: e.idTipoDocumento,
					nombreTipoDocumento: e.nombreTipoDocumento,
					numeroDocumento: e.numeroDocumento,
					fechaPago: e.fechaPago,
					importePago: e.importePago,
					fechaInicioVigencia: e.fechaInicioVigencia,
					fechaFinVigencia: e.fechaFinVigencia,
					proximoPago: e.proximoPago,
					activo: 'Si'
				};

				documento = e;
			}
		);
		// modalRef.componentInstance.item = item;
		modalRef.result.then((result) => {

			this.getDocumentos(documento);
		}, (reason) => {
			console.log(reason);
		});
	}

	editDocumento(item) {

		let documento;
		const modalRef = this.modalService.open(SaveUpdateDocumentosModalComponent, { size: 'ms' });


		modalRef.componentInstance.item = item;

		modalRef.componentInstance.vehiculoDocumentoEvent?.subscribe(
			e => {
				//Modificar el objeto y agregar los campos necesarios
				e = {
					codigo: e.codigo,
					idVehiculoDocumento: e.idVehiculoDocumento,
					idVehiculo: this.idVehiculo,
					idTipoDocumento: e.idTipoDocumento,
					nombreTipoDocumento: e.nombreTipoDocumento,
					numeroDocumento: e.numeroDocumento,
					fechaPago: e.fechaPago,
					importePago: e.importePago,
					fechaInicioVigencia: e.fechaInicioVigencia,
					fechaFinVigencia: e.fechaFinVigencia,
					proximoPago: e.proximoPago,
					activo: 'Si'
				};

				documento = e;
			}
		);

		modalRef.result.then((result) => {

			this.getDocumentos(documento);
		}, (reason) => {
			console.log(reason);
		});
	}

	deleteDocumento(item) {
		let index = this.array_vehiculoDocumentos.indexOf(item);

		if (item.idVehiculoDocumento > 0) {
			this.array_vehiculoDocumentos_Eliminados.push(item);
		}

		this.array_vehiculoDocumentos.splice(index, 1);



		this.listData = new MatTableDataSource(this.array_vehiculoDocumentos);
		if (this.array_vehiculoDocumentos.length > 0) {
			this.no_data = true;
		} else {
			this.no_data = false;
		}
		this.listData.sort = this.MatSort;
		this.listData.paginator = this.paginator;
		this.chgRef.markForCheck();
	}
	//#endregion

	//#region Alertas
	getAlertasOnInit(idVehiculo) {

		this.alerta_s.GetListarVehiculoAlertas(idVehiculo)
			.pipe(
				finalize(() => {
					// for (let i = 0; i < this.array_vehiculoAlertas.length; i++) {
					// 	this.deta_formTipoMantenimiento[this.array_vehiculoAlertas[i]].setValue(this.array_vehiculoAlertas[i].idTipoMantenimiento)
					// }
					// this.chgRef.markForCheck()
				})
			)
			.subscribe(
				(data: any) => {
					this.array_vehiculoAlertas = data;

					for (let i = 0; i < this.array_vehiculoAlertas.length; i++) {
						// this.array_vehiculoAlertas.push(data[i]);
						this.deta_formTipoMantenimiento.push(new FormControl(this.array_vehiculoAlertas[i].idTipoMantenimiento, [Validators.required]));
						this.deta_formCiclosKM.push(new FormControl(this.array_vehiculoAlertas[i].ciclosKM, [Validators.required]));
						this.deta_formAlertaKM.push(new FormControl(this.array_vehiculoAlertas[i].alertaKM, [Validators.required]));
						this.deta_formActivo.push(new FormControl(this.array_vehiculoAlertas[i].activo, [Validators.required]));


					}

					this.chgRef.markForCheck()
				}, (errorServicio) => {
					console.log(errorServicio);
					this.load_data = true;
					this.no_data = false;
					this.searchBan = false;
				}
			);
	}

	GetTipoAlertaMantenimiento() {
		let defaultIndex = 0
		this.alerta_s.GetTipoAlertaMantenimiento().subscribe(
			(data: any) => {
				this.array_tipoAlertaMantenimiento = data;
			}
		)
	}

	addAlerta() {
		this.prefixValueArrayAlerta = `c_${(new Date()).getTime()}_`;// simular hashCode para el objecto
		this.array_vehiculoAlertas.push({
			idVehiculoAlertaMantenimiento: 0,
			idVehiculo: this.idVehiculo,
			idTipoMantenimiento: '0000',
			ciclosKM: 0.00,
			alertaKM: 0.00,
			activo: true
		})

		this.deta_formTipoMantenimiento.push(new FormControl(null, [Validators.required]));
		this.deta_formCiclosKM.push(new FormControl(null, [Validators.required]));
		this.deta_formAlertaKM.push(new FormControl(null, [Validators.required]));
		this.deta_formActivo.push(new FormControl(true, [Validators.required]));


		// this.chgRef.markForCheck();
	}


	deleteAlerta(item) {
		let index = this.array_vehiculoAlertas.indexOf(item);

		if (this.array_vehiculoAlertas[index].idVehiculoAlertaMantenimiento > 0) {
			this.array_vehiculoAlertas_Eliminados.push(item);
		}
		this.array_vehiculoAlertas.splice(index, 1);

		//Limpiar tambien los controles
		this.deta_formTipoMantenimiento.splice(index, 1);
		this.deta_formCiclosKM.splice(index, 1);
		this.deta_formAlertaKM.splice(index, 1);
		this.deta_formActivo.splice(index, 1);


		this.chgRef.markForCheck();
	}
	//#endregion

	//#region Neumaticos
	getNeumaticosOnInit(idVehiculo) {


		this.neumatico_s.GetListarVehiculoNeumaticos(idVehiculo).subscribe(
			(data: any) => {
				this.array_vehiculoNeumaticos = data;
				this.load_data2 = true;
				this.searchBan2 = false;
				this.listData2 = new MatTableDataSource(this.array_vehiculoNeumaticos);
				if (data.length > 0) {
					this.no_data2 = true;
				} else {
					this.no_data2 = false;
				}
				this.listData2.sort = this.MatSort2;
				this.listData2.paginator = this.paginator2;

			}, (errorServicio) => {
				console.log(errorServicio);
				this.load_data2 = true;
				this.no_data2 = false;
				this.searchBan2 = false;
			}
		);
	}


	getNeumaticos(neumatico = null) {
		this.listData2 = new MatTableDataSource([]);
		this.searchBan2 = false;
		this.load_data2 = false;
		this.no_data2 = true;

		let existNeumatico
		if (neumatico.idVehiculoNeumatico > 0) { // editNeumatico de la base de datos ( en el servidor)
			existNeumatico = this.array_vehiculoNeumaticos.find(
				e => e.idVehiculoNeumatico == neumatico.idVehiculoNeumatico
			)
		} else { // editNeumatico generado en el cliente (Aquí)


			existNeumatico = this.array_vehiculoNeumaticos.find(
				e => e.codigoUnique == neumatico.codigoUnique
			)
		}



		if (existNeumatico) { // Si existe editDocumento, entonces editar
			if (existNeumatico.codigoUnique) {
				this.load_data2 = true;
				this.searchBan2 = false;
				this.array_vehiculoNeumaticos = this.array_vehiculoNeumaticos
					.map(e => {
						if (e.codigoUnique == existNeumatico.codigoUnique) {
							let nem = this.array_vehiculoNeumaticos.find(e => e.codigo == neumatico.codigo)
							if (nem) {
								this.toastr.errorToastr('El codigo de neumatico ya existe.', 'Error!', {
									toastTimeout: 2000,
									showCloseButton: true,
									animate: 'fade',
									progressBar: true
								});
								return e;
							} else {
								return neumatico;
							}
						}
						return e;
					})
			} else if (existNeumatico.idVehiculoNeumatico > 0) {
				this.load_data2 = true;
				this.searchBan2 = false;
				this.array_vehiculoNeumaticos = this.array_vehiculoNeumaticos
					.map(e => {
						if (e.idVehiculoNeumatico == neumatico.idVehiculoNeumatico) {
							let nem = this.array_vehiculoNeumaticos.find(e => e.codigo == neumatico.codigo)
							if (nem) {
								this.toastr.errorToastr('El codigo de neumatico ya existe.', 'Error!', {
									toastTimeout: 2000,
									showCloseButton: true,
									animate: 'fade',
									progressBar: true
								});
								return e;
							} else {
								return neumatico;
							}
						}
						return e;
					})
			}
		} else { //Crear
			this.load_data2 = true;
			this.searchBan2 = false;

			let nem = this.array_vehiculoNeumaticos.find(e => e.codigo == neumatico.codigo)
			if (nem) {
				this.toastr.errorToastr('El codigo de neumatico ya existe.', 'Error!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
			} else {
				this.array_vehiculoNeumaticos.push(neumatico);
			}


		}
		this.listData2 = new MatTableDataSource(this.array_vehiculoNeumaticos);
		if (this.array_vehiculoNeumaticos.length > 0) {
			this.no_data2 = true;
		} else {
			this.no_data2 = false;
		}
		this.listData.sort = this.MatSort2;
		this.listData.paginator = this.paginator2;

		// }

		this.chgRef.markForCheck();
	}

	createNeumatico() {


		// Entidad Seguros se actualizo a Documentos
		let neumatico;
		const modalRef = this.modalService.open(SaveUpdateNeumaticosModalComponent, { size: 'ms' });
		modalRef.componentInstance.vehiculoNeumaticoEvent?.subscribe(
			e => {
				//Modificar el objeto y agregar los campos necesarios
				e = {
					codigoUnique: e.codigoUnique,
					idVehiculoNeumatico: e.idVehiculoNeumatico,
					idVehiculo: this.idVehiculo,
					codigo: e.codigo,
					nombre: e.nombre,
					tamanio: e.tamanio,
					traccion: e.traccion,
					surcoInicial: e.surcoInicial,
					idMarca: e.idMarca,
					nombreMarca: e.nombreMarca,
					idTipo: e.idTipo,
					nombreTipo: e.nombreTipo,
					idPosicion: e.idPosicion,
					nombrePosicion: e.nombrePosicion,
					costoUnitario: e.costoUnitario,
					activo: e.activo,
				};

				neumatico = e;
			}
		);
		// modalRef.componentInstance.item = item;
		modalRef.result.then((result) => {

			this.getNeumaticos(neumatico);
		}, (reason) => {
			console.log(reason);
		});
	}


	editNeumatico(item) {


		// Entidad Seguros se actualizo a Documentos
		let neumatico;
		const modalRef = this.modalService.open(SaveUpdateNeumaticosModalComponent, { size: 'ms' });

		modalRef.componentInstance.item = item;
		modalRef.componentInstance.vehiculoNeumaticoEvent?.subscribe(
			e => {
				//Modificar el objeto y agregar los campos necesarios
				e = {
					codigoUnique: e.codigoUnique,
					idVehiculoNeumatico: e.idVehiculoNeumatico,
					idVehiculo: this.idVehiculo,
					codigo: e.codigo,
					nombre: e.nombre,
					tamanio: e.tamanio,
					traccion: e.traccion,
					surcoInicial: e.surcoInicial,
					idMarca: e.idMarca,
					nombreMarca: e.nombreMarca,
					idTipo: e.idTipo,
					nombreTipo: e.nombreTipo,
					idPosicion: e.idPosicion,
					nombrePosicion: e.nombrePosicion,
					costoUnitario: e.costoUnitario,
					activo: e.activo,
				};

				neumatico = e;
			}
		);
		// modalRef.componentInstance.item = item;
		modalRef.result.then((result) => {

			this.getNeumaticos(neumatico);
		}, (reason) => {
			console.log(reason);
		});

	}


	deleteNeumatico(item) {
		let index = this.array_vehiculoNeumaticos.indexOf(item);

		if (item.idVehiculoNeumatico > 0) {
			this.array_vehiculoNeumaticos_Eliminados.push(item);
		}

		this.array_vehiculoNeumaticos.splice(index, 1);



		this.listData2 = new MatTableDataSource(this.array_vehiculoNeumaticos);
		if (this.array_vehiculoNeumaticos.length > 0) {
			this.no_data2 = true;
		} else {
			this.no_data2 = false;
		}
		this.listData2.sort = this.MatSort2;
		this.listData2.paginator = this.paginator2;
		this.chgRef.markForCheck();
	}
	//#endregion

	//#region Save final Vehiculo
	saveUpdateVehiculo() {
		this.hide_save = true;
		this.hide_load = false;

		const controls = this.formDatos.controls;

		if (this.formDatos.invalid || this.formDatos.controls.Procedencia.value == 0
			|| this.formDatos.controls.TipoVehiculo.value == 0) {
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

			this.enableFormDatos();
			this.disableProveedorIf();

			return;
		} else if (
			(this.formDatos.controls.Procedencia.value === '0002'
				|| this.formDatos.controls.Procedencia.value === '0003')
			&& (this.formDatos.controls.Proveedor.value === 0 || this.formDatos.controls.Proveedor.value == null)) {
			this.hide_save = false;
			this.hide_load = true;
			this.activeTabId = 0;
			this.toastr.warningToastr('Proveedor es un campo Obligatorio.', 'Advertencia!', {
				toastTimeout: 2000,
				showCloseButton: true,
				animate: 'fade',
				progressBar: true
			});
			this.enableFormDatos();
			this.disableProveedorIf();

			return;
		}


		//Revalidar
		if (this.FilterformTipoVehiculo.invalid) {
			this.hide_save = false;
			this.hide_load = true;
			this.activeTabId = 0;
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.toastr.warningToastr('Hay campos obligatorios del Tipo vehiculo seleccionado.', 'Advertencia!', {
				toastTimeout: 2000,
				showCloseButton: true,
				animate: 'fade',
				progressBar: true
			});
			this.enableFormDatos();
			this.disableProveedorIf();

			return;
		}

		for (let i = 0; i < this.array_vehiculoAlertas.length; i++) {
			this.activeTabId = 1;
			if (this.deta_formTipoMantenimiento[i].status === 'INVALID') {
				this.hide_save = false;
				this.hide_load = true;
				this.toastr.warningToastr('Seleccione un Tipo - mantenimiento, es obligatorios.', 'Advertencia!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				this.changeTab(this.tabs.ALERTAS_TAB);//Forzar volver al tab de alertas. Solución por el momento
				return;
			}

			if (this.deta_formCiclosKM[i].status === 'INVALID') {
				this.hide_save = false;
				this.hide_load = true;
				this.toastr.warningToastr('Ingrese ciclos KM, es obligatorio.', 'Advertencia!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				return;
			}

			if (this.deta_formAlertaKM[i].status === 'INVALID') {
				this.hide_save = false;
				this.hide_load = true;
				this.toastr.warningToastr('Ingrese alertas KM, es obligatorio.', 'Advertencia!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				return;
			}
		}



		let datos = this.prepare_model();

		console.log("datos prepare_model", datos);
		this.hide_save = false;
		this.hide_load = true;

		this.vehiculo_s.SaveUpdateVehiculo(datos).subscribe(
			(data: any) => {
				if (data[0].Ok > 0) {
					this.hide_save = false;
					this.hide_load = true;
					this.chgRef.markForCheck();
					this.toastr.successToastr(data[0].Message, 'Correcto!', {
						toastTimeout: 2000,
						showCloseButton: true,
						animate: 'fade',
						progressBar: true
					});
					this.router.navigate(['Operations/masters/vehiculos']);
				} else {


					this.hide_save = false;
					this.hide_load = true;
					this.chgRef.markForCheck();
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
		)


	}

	prepare_model() {
		// const controls = this.formDatos.controls;
		let datoVehiculoCaracteristicas = [];
		let datoVehiculoDocumentos = [];
		let datoVehiculoAlertas = [];
		let datoVehiculoNeumaticos = [];




		for (let i = 0; i < this.array_vehiculoCaracteristicas.length; i++) {
			datoVehiculoCaracteristicas.push({
				idVehiculoCaracteristica: this.array_vehiculoCaracteristicas[i].idVehiculoCaracteristica,
				idVehiculo: this.idVehiculo,
				idTipoVehiculoCaracteristica: this.array_vehiculoCaracteristicas[i].idTipoVehiculoCaracteristica,
				idCaracteristicaVehiculo: this.array_vehiculoCaracteristicas[i].idCaracteristicaVehiculo,

				valorCaracteristica: this.FilterformTipoVehiculo.controls[
					this.data[this.array_vehiculoCaracteristicas[i].idTipoVehiculoCaracteristica].ControlName].value,
				eliminado: 0
			})
		}

		if (this.array_vehiculoCaracteristicas != this.array_vehiculoCaracteristicas_Eliminados) {
			for (let i = 0; i < this.array_vehiculoCaracteristicas_Eliminados.length; i++) {
				datoVehiculoCaracteristicas.push({
					idVehiculoCaracteristica: this.array_vehiculoCaracteristicas_Eliminados[i].idVehiculoCaracteristica,
					idVehiculo: this.idVehiculo,
					idTipoVehiculoCaracteristica: this.array_vehiculoCaracteristicas_Eliminados[i].idTipoVehiculoCaracteristica,
					idCaracteristicaVehiculo: this.array_vehiculoCaracteristicas_Eliminados[i].idCaracteristicaVehiculo,

					valorCaracteristica: this.array_vehiculoCaracteristicas_Eliminados[i].valorCaracteristica,
					eliminado: 1
				})
			}
		}

		for (let i = 0; i < this.array_vehiculoDocumentos.length; i++) {
			datoVehiculoDocumentos.push({
				idVehiculoDocumento: this.array_vehiculoDocumentos[i].idVehiculoDocumento,
				idVehiculo: this.idVehiculo,
				idTipoDocumento: this.array_vehiculoDocumentos[i].idTipoDocumento,
				numeroDocumento: this.array_vehiculoDocumentos[i].numeroDocumento,
				fechaPago: this.array_vehiculoDocumentos[i].fechaPago,
				importePago: this.array_vehiculoDocumentos[i].importePago,
				fechaInicioVigencia: this.array_vehiculoDocumentos[i].fechaInicioVigencia,
				fechaFinVigencia: this.array_vehiculoDocumentos[i].fechaFinVigencia,
				activo: this.array_vehiculoDocumentos[i].activo,
				eliminado: 0
			})
		}

		for (let i = 0; i < this.array_vehiculoDocumentos_Eliminados.length; i++) {
			datoVehiculoDocumentos.push({
				idVehiculoDocumento: this.array_vehiculoDocumentos_Eliminados[i].idVehiculoDocumento,
				idVehiculo: this.array_vehiculoDocumentos_Eliminados.idVehiculo,
				idTipoDocumento: this.array_vehiculoDocumentos_Eliminados[i].idTipoDocumento,
				numeroDocumento: this.array_vehiculoDocumentos_Eliminados[i].numeroDocumento,
				fechaPago: this.array_vehiculoDocumentos_Eliminados[i].fechaPago,
				importePago: this.array_vehiculoDocumentos_Eliminados[i].importePago,
				fechaInicioVigencia: this.array_vehiculoDocumentos_Eliminados[i].fechaInicioVigencia,
				fechaFinVigencia: this.array_vehiculoDocumentos_Eliminados[i].fechaFinVigencia,
				activo: this.array_vehiculoDocumentos_Eliminados[i].activo,
				eliminado: 1
			})
		}

		for (let i = 0; i < this.array_vehiculoAlertas.length; i++) {
			datoVehiculoAlertas.push({
				idVehiculoAlertaMantenimiento: this.array_vehiculoAlertas[i].idVehiculoAlertaMantenimiento,
				idVehiculo: this.idVehiculo,
				idTipoMantenimiento: this.deta_formTipoMantenimiento[i].value,
				ciclosKM: this.deta_formCiclosKM[i].value,
				alertaKM: this.deta_formAlertaKM[i].value,
				activo: this.deta_formActivo[i].value,
				eliminado: 0
			})
		}

		for (let i = 0; i < this.array_vehiculoAlertas_Eliminados.length; i++) {
			datoVehiculoAlertas.push({
				idVehiculoAlertaMantenimiento: this.array_vehiculoAlertas_Eliminados[i].idVehiculoAlertaMantenimiento,
				idVehiculo: this.array_vehiculoAlertas_Eliminados[i].idVehiculo,
				idTipoMantenimiento: this.array_vehiculoAlertas_Eliminados[i].idTipoMantenimiento,
				ciclosKM: this.array_vehiculoAlertas_Eliminados[i].ciclosKM,
				alertaKM: this.array_vehiculoAlertas_Eliminados[i].alertaKM,
				activo: this.array_vehiculoAlertas_Eliminados[i].activo,
				eliminado: 1
			})
		}

		for (let i = 0; i < this.array_vehiculoNeumaticos.length; i++) {
			datoVehiculoNeumaticos.push({
				idVehiculoNeumatico: this.array_vehiculoNeumaticos[i].idVehiculoNeumatico,
				idVehiculo: this.idVehiculo,
				codigo: this.array_vehiculoNeumaticos[i].codigo,
				nombre: this.array_vehiculoNeumaticos[i].nombre,
				idMarca: this.array_vehiculoNeumaticos[i].idMarca,
				idTipo: this.array_vehiculoNeumaticos[i].idTipo,
				idPosicion: this.array_vehiculoNeumaticos[i].idPosicion,
				tamanio: this.array_vehiculoNeumaticos[i].tamanio,
				traccion: this.array_vehiculoNeumaticos[i].traccion,
				costoUnitario: this.array_vehiculoNeumaticos[i].costoUnitario,
				surcoInicial: this.array_vehiculoNeumaticos[i].surcoInicial,
				activo: this.array_vehiculoNeumaticos[i].activo,
				eliminado: 0
			})
		}


		for (let i = 0; i < this.array_vehiculoNeumaticos_Eliminados.length; i++) {
			datoVehiculoNeumaticos.push({
				idVehiculoNeumatico: this.array_vehiculoNeumaticos_Eliminados[i].idVehiculoNeumatico,
				idVehiculo: this.idVehiculo,
				codigo: this.array_vehiculoNeumaticos_Eliminados[i].codigo,
				nombre: this.array_vehiculoNeumaticos_Eliminados[i].nombre,
				idMarca: this.array_vehiculoNeumaticos_Eliminados[i].idMarca,
				idTipo: this.array_vehiculoNeumaticos_Eliminados[i].idTipo,
				idPosicion: this.array_vehiculoNeumaticos_Eliminados[i].idPosicion,
				tamanio: this.array_vehiculoNeumaticos_Eliminados[i].tamanio,
				traccion: this.array_vehiculoNeumaticos_Eliminados[i].traccion,
				costoUnitario: this.array_vehiculoNeumaticos_Eliminados[i].costoUnitario,
				surcoInicial: this.array_vehiculoNeumaticos_Eliminados[i].surcoInicial,
				activo: this.array_vehiculoNeumaticos_Eliminados[i].activo,
				eliminado: 1
			})
		}



		return {
			idVehiculo: this.idVehiculo,
			placa: this.formDatos.controls.Placa.value,
			idProcedencia: this.formDatos.controls.Procedencia.value,
			idProveedor: this.formDatos.controls.Proveedor.value === 0 ||
				this.formDatos.controls.Proveedor.value == null ? null : this.formDatos.controls.Proveedor.value,
			idTipoVehiculo: this.formDatos.controls.TipoVehiculo.value,
			activo: 1,
			vehiculoCaracteristicas: datoVehiculoCaracteristicas,
			vehiculoDocumentos: datoVehiculoDocumentos,
			vehiculoAlertas: datoVehiculoAlertas,
			vehiculoNeumaticos: datoVehiculoNeumaticos
		}

	}
	//#endregion

	ngOnDestroy(): void {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	search() {
		if (this.searchGroup.controls.searchTerm.value == null) {
			this.searchGroup.controls.searchTerm.setValue('');
		}
		this.listData.filter = this.searchGroup.controls.searchTerm.value.trim().toLowerCase();
		if (this.listData.paginator) {
			this.listData.paginator.firstPage();
		}
	}

	search2() {
		if (this.searchGroup.controls.searchTerm2.value == null) {
			this.searchGroup.controls.searchTerm2.setValue('');
		}
		this.listData2.filter = this.searchGroup.controls.searchTerm2.value.trim().toLowerCase();
		if (this.listData2.paginator) {
			this.listData2.paginator.firstPage();
		}
	}

	isControlInvalid(formGroup, controlName: string): boolean {
		const control = formGroup.controls[controlName];
		return control.invalid && (control.dirty || control.touched);
	}

	isControlValid(formGroup, controlName: string): boolean {
		const control = formGroup.controls[controlName];
		return control.valid && (control.dirty || control.touched);
	}

	controlHasError(formGroup, validation, controlName): boolean {
		const control = formGroup.controls[controlName];
		return control.hasError(validation) && (control.dirty || control.touched);
	}

	isControlValidDato(controlName: string): boolean {
		const control = this.FilterformTipoVehiculo.controls[controlName];
		return control.valid && (control.dirty || control.touched);
	}

	isControlInvalidDato(controlName: string): boolean {
		const control = this.FilterformTipoVehiculo.controls[controlName];
		return control.invalid && (control.dirty || control.touched);
	}

	isRequired(control) {
		return control.Obligatorio;
	}

	controlHasErrorDato(validation, controlName): boolean {
		const control = this.FilterformTipoVehiculo.controls[controlName];
		return control.hasError(validation) && (control.dirty || control.touched);
	}

}
