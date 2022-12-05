import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { forkJoin, Subscription } from 'rxjs';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { MultitablaService } from 'src/app/pages/_core/services/multitabla.service';
import { DeleteModalComponent } from 'src/app/pages/_shared/delete-customer-modal/delete-modal.component';
import { PermissionViewActionService } from 'src/app/Shared/services/permission-view-action.service';
import { TableResponseModel } from 'src/app/_metronic/shared/crud-table';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { DatePipe } from '@angular/common';
import { DataSource } from '@angular/cdk/table';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { runInThisContext } from 'vm';
import { ProveedorService } from '../../../_core/services/proveedor.service';
import { UtilService } from 'src/app/pages/_shared/util.service';

@Component({
	selector: 'app-save-update-proveedores',
	templateUrl: './save-update-proveedores.component.html',
	styleUrls: ['./save-update-proveedores.component.scss'],
	providers: [DatePipe,
		{ provide: NgbDateAdapter, useClass: CustomAdapter },
		{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
	]
})
export class SaveUpdateProveedoresComponent implements OnInit {
	formDatosPersonales: FormGroup;
	load_data: boolean = true;
	no_data: boolean = false;
	searchBan: boolean = false;
	listData: MatTableDataSource<any>;
	@ViewChild(MatSort) MatSort: MatSort;
	@ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

	private subscriptions: Subscription[] = [];
	validViewAction = this.pvas.validViewAction;
	viewsActions: Array<Navigation> = [];
	array_dataList: any;
	array_categorias: any;
	array_puestos: any;
	array_modalidad: any;
	array_pais: any;
	array_departamento: any;
	array_provincia: any;
	array_distrito: any;
	array_tipo_doc: any;
	array_moneda: any;
	array_banco: any;
	array_tipo_cuenta: any;

	tabs = {
		CONTACTO_TAB: 0,
		CUENTAS_BANCARIAS_TAB: 1,
	};

	activeTabId = this.tabs.CONTACTO_TAB;

	deta_formTipoDocumentoContacto: FormControl[] = [];
	deta_formDocumentoIdentidadContacto: FormControl[] = [];
	deta_formNombre: FormControl[] = [];
	deta_formApellidoPaterno: FormControl[] = [];
	deta_formApellidoMaterno: FormControl[] = [];
	deta_formCargo: FormControl[] = [];
	deta_formTelefonoContacto: FormControl[] = [];
	deta_formEmailContacto: FormControl[] = [];
	deta_formActivoContacto: FormControl[] = [];

	deta_formTitular: FormControl[] = [];
	deta_formNumeroCuenta: FormControl[] = [];
	deta_formCuentaInterbancaria: FormControl[] = [];
	deta_formBanco: FormControl[] = [];
	deta_formTipoCuenta: FormControl[] = [];
	deta_formTipoMoneda: FormControl[] = [];

	array_contactos: any = [];
	array_cuentasBancarias: any = [];

	hide_save: Boolean = false;
	hide_load: Boolean = true;

	idProveedor: number = 0;
	mostrarActivo: boolean = true;
	data: any = {};

	form: FormGroup = null;

	constructor(
		private fb: FormBuilder,
		public multitabla_s: MultitablaService,
		public proveedor_s: ProveedorService,
		public pvas: PermissionViewActionService,
		public toastr: ToastrManager,
		private chgRef: ChangeDetectorRef,
		private router: Router,
		private route: ActivatedRoute,
		private datePipe: DatePipe,
		private httpClient: HttpClient,
		private storage: AngularFireStorage,
		private formBuilder: FormBuilder,
		private util_S : UtilService,
	) { }

	ngOnInit(): void {
		this.datosForm();

		this.getBanco(null);
		this.getTipoCuenta(null);
		this.getMoneda(null);

		this.idProveedor = this.route.snapshot.queryParams['id'] || 0;
		if (this.idProveedor > 0) {
			this.getDataProveedor(this.idProveedor);

		} else {
			this.getCodigo();
			this.getCategoria(null);
			this.getPaises(null);
			this.getTipoDocumentoIdentidad(null);
			this.mostrarActivo = false;
		}

	}

	datosForm() {
		this.formDatosPersonales = this.fb.group({
			Codigo: [null],
			Categoria: [null, Validators.compose([Validators.required])],
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
			Telefono: [null, Validators.compose([Validators.required])],
			Telefono2: [null],
			Activo: [true],
		});

	}

	getDataProveedor(Proveedor) {
		this.proveedor_s.GetDatosProveedor(Proveedor).subscribe(
			(data: any) => {
				console.log(data);
				let dataGenerales = data[0][0];
				this.formDatosPersonales.controls.Codigo.setValue(dataGenerales.codigo);
				this.formDatosPersonales.controls.RazonSocial.setValue(dataGenerales.razonSocial);
				this.formDatosPersonales.controls.NombreComercial.setValue(dataGenerales.nombreComercial);
				this.formDatosPersonales.controls.Direccion.setValue(dataGenerales.direccion);
				this.formDatosPersonales.controls.Referencia.setValue(dataGenerales.referencia);
				this.formDatosPersonales.controls.DocumentoIdentidad.setValue(dataGenerales.documentoIdentidad);
				this.formDatosPersonales.controls.Telefono.setValue(dataGenerales.telefono1);
				this.formDatosPersonales.controls.Telefono2.setValue(dataGenerales.telefono2);
				this.formDatosPersonales.controls.Email.setValue(dataGenerales.email);
				this.formDatosPersonales.controls.Activo.setValue(dataGenerales.activo);

				if (dataGenerales.idPais !== 1) {
					this.formDatosPersonales.removeControl('Departamento');
					this.formDatosPersonales.removeControl('Provincia');
					this.formDatosPersonales.removeControl('Distrito');
					this.formDatosPersonales.addControl("Departamento", new FormControl(null));
					this.formDatosPersonales.addControl("Provincia", new FormControl(null));
					this.formDatosPersonales.addControl("Distrito", new FormControl(null));
				}

				this.getCategoria(dataGenerales);
				this.getPaises(dataGenerales);
				this.getListarDepartamento(dataGenerales.idPais, dataGenerales);
				this.getListarProvincia(dataGenerales.idDepartamento, dataGenerales);
				this.getListarDistrito(dataGenerales.idProvincia, dataGenerales);
				this.getTipoDocumentoIdentidad(dataGenerales);


				this.llenarContactos(data[1]);
				this.llenarCuentasBancarias(data[2]);

			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}

	llenarContactos(Contactos) {
		for (let i = 0; i <= Contactos.length - 1; i++) {
			this.array_contactos.push(Contactos[i]);
			this.deta_formTipoDocumentoContacto.push(new FormControl(Contactos[i].idTipoDocumentoIdentidad, [Validators.required]));
			this.deta_formDocumentoIdentidadContacto.push(new FormControl(Contactos[i].documentoIdentidad, [Validators.required]));
			this.deta_formNombre.push(new FormControl(Contactos[i].nombres, [Validators.required]));
			this.deta_formApellidoPaterno.push(new FormControl(Contactos[i].apePaterno, [Validators.required]));
			this.deta_formApellidoMaterno.push(new FormControl(Contactos[i].apeMaterno, [Validators.required]));
			this.deta_formCargo.push(new FormControl(Contactos[i].cargo, [Validators.required]));
			this.deta_formTelefonoContacto.push(new FormControl(Contactos[i].telefono, [Validators.required]));
			this.deta_formEmailContacto.push(new FormControl(Contactos[i].email, [Validators.required]));
			this.array_contactos[i].Activo = Contactos[i].activoContacto;
		}
	}

	llenarCuentasBancarias(CuentasBancarias) {
		for (let i = 0; i <= CuentasBancarias.length - 1; i++) {
			this.array_cuentasBancarias.push(CuentasBancarias[i]);
			this.deta_formBanco.push(new FormControl(CuentasBancarias[i].idBanco, [Validators.required]));
			this.deta_formTitular.push(new FormControl(CuentasBancarias[i].titular, [Validators.required]));
			this.deta_formTipoCuenta.push(new FormControl(CuentasBancarias[i].idTipoCuentaBancaria, [Validators.required]));
			this.deta_formTipoMoneda.push(new FormControl(CuentasBancarias[i].idMoneda, [Validators.required]));
			this.deta_formNumeroCuenta.push(new FormControl(CuentasBancarias[i].nroCuenta, [Validators.required]));
			this.deta_formCuentaInterbancaria.push(new FormControl(CuentasBancarias[i].nroCCI, [Validators.required]));
			this.array_cuentasBancarias[i].Detraccion = CuentasBancarias[i].detraccion;
			this.array_cuentasBancarias[i].Activo = CuentasBancarias[i].activoCuenta;

		}
	}

	getCodigo() {
		this.proveedor_s.GetCodigoSiguienteProveedor().subscribe(
			(data: any) => {
				this.formDatosPersonales.controls.Codigo.setValue(data[0].codigo);
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);

	}

	getCategoria(dataCabecera) {
		this.proveedor_s.GetListarCategoriaProveedores().subscribe(
			(data: any) => {
				if (dataCabecera != null) {
					if (data.find(categoria => categoria.idCategoriaProveedor === dataCabecera.idCategoriaProveedor) === undefined) {
						data.push(
							{
								Categoria: dataCabecera.idCategoriaProveedor,
								NombreCategoria: dataCabecera.NombreCategoria
							}
						);
					}
					this.array_categorias = data.sort((a, b) => a.NombreCategoria > b.NombreCategoria ? 1 : -1);
					this.formDatosPersonales.controls.Categoria.setValue(dataCabecera.idCategoriaProveedor);
				}
				else {
					this.array_categorias = data.sort((a, b) => a.NombreCategoria > b.NombreCategoria ? 1 : -1);
				}
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}

	getPaises(dataCabecera) {
		this.multitabla_s.GetListarPaises().subscribe(
			(data: any) => {
				if (dataCabecera != null) {
					if (dataCabecera.idPais != null) {
						if (data.find(pais => pais.Pais === dataCabecera.idPais) === undefined) {
							data.push(
								{
									Pais: dataCabecera.idPais,
									NombrePais: dataCabecera.Pais
								}
							);
						}
						this.array_pais = data;
						this.formDatosPersonales.controls.Pais.setValue(dataCabecera.idPais);
					}
				} else {
					this.array_pais = data;
				}
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}

	getListarDepartamento(Pais, dataCabecera) {
		if (Pais !== 1) {
			this.formDatosPersonales.removeControl('Departamento');
			this.formDatosPersonales.removeControl('Provincia');
			this.formDatosPersonales.removeControl('Distrito');
			this.formDatosPersonales.addControl("Departamento", new FormControl(null));
			this.formDatosPersonales.addControl("Provincia", new FormControl(null));
			this.formDatosPersonales.addControl("Distrito", new FormControl(null));
		} else {
			this.formDatosPersonales.controls.Departamento.setValidators(Validators.compose([Validators.required]));
			this.formDatosPersonales.controls.Provincia.setValidators(Validators.compose([Validators.required]));
			this.formDatosPersonales.controls.Distrito.setValidators(Validators.compose([Validators.required]));
		}

		this.formDatosPersonales.controls.Departamento.reset();
		this.multitabla_s.GetListarDepartamentos(Pais).subscribe(
			(data: any) => {
				if (dataCabecera != null) {
					if (dataCabecera.idDepartamento != null) {
						if (data.find(departamento => departamento.Departamento === dataCabecera.idDepartamento) === undefined) {
							data.push(
								{
									Departamento: dataCabecera.idDepartamento,
									NombreDepartamento: dataCabecera.Departamento
								}
							);
						}
						this.array_departamento = data.sort((a, b) => a.NombreDepartamento > b.NombreDepartamento ? 1 : -1);
						this.formDatosPersonales.controls.Departamento.setValue(dataCabecera.idDepartamento);
					}
				}
				else {
					this.array_departamento = data.sort((a, b) => a.NombreDepartamento > b.NombreDepartamento ? 1 : -1);
				}
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}

	getListarProvincia(Departamento, dataCabecera) {
		this.formDatosPersonales.controls.Provincia.reset();
		this.multitabla_s.GetListarProvincia(Departamento).subscribe(
			(data: any) => {
				if (dataCabecera != null) {
					if (dataCabecera.idProvincia != null) {
						if (data.find(provincia => provincia.NombreProvincia === dataCabecera.idProvincia) === undefined) {
							data.push(
								{
									Provincia: dataCabecera.idProvincia,
									NombreProvincia: dataCabecera.Provincia
								}
							);
						}
						this.array_provincia = data.sort((a, b) => a.NombreProvincia > b.NombreProvincia ? 1 : -1);
						this.formDatosPersonales.controls.Provincia.setValue(dataCabecera.idProvincia);
					}
				}
				else {
					this.array_provincia = data.sort((a, b) => a.NombreProvincia > b.NombreProvincia ? 1 : -1);
				}
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}

	getListarDistrito(Provincia, dataCabecera) {
		this.formDatosPersonales.controls.Distrito.reset();
		this.multitabla_s.GetListarDistrito(Provincia).subscribe(
			(data: any) => {
				if (dataCabecera != null) {
					if (dataCabecera.idDistrito != null) {
						if (data.find(distrito => distrito.NombreDistrito === dataCabecera.idDistrito) === undefined) {
							data.push(
								{
									Distrito: dataCabecera.idDistrito,
									NombreDistrito: dataCabecera.Distrito
								}
							);
						}
						this.array_distrito = data.sort((a, b) => a.NombreDistrito > b.NombreDistrito ? 1 : -1);
						this.formDatosPersonales.controls.Distrito.setValue(dataCabecera.idDistrito);
					}
				}
				else {
					this.array_distrito = data.sort((a, b) => a.NombreDistrito > b.NombreDistrito ? 1 : -1);
				}
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}

	getTipoDocumentoIdentidad(dataCabecera) {
		this.multitabla_s.GetTipoDocumentoIdentidad().subscribe(
			(data: any) => {
				console.log(data);
				if (dataCabecera != null) {
					if (data.find(tipoDocIdentidad => tipoDocIdentidad.ValorDocIdentidad === dataCabecera.idTipoDocumentoIdentidad) === undefined) {
						data.push(
							{
								ValorDocIdentidad: dataCabecera.idTipoDocumentoIdentidad,
								NombreDocIdentidad: dataCabecera.TipoDocumentoIdentidad
							}
						);
					}
					this.array_tipo_doc = data;
					this.formDatosPersonales.controls.TipoDocumento.setValue(dataCabecera.idTipoDocumentoIdentidad);
				}
				else {
					this.array_tipo_doc = data;
				}
			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

	getBanco(PosibleValor) {
		this.multitabla_s.GetListarBancos().subscribe(
			(data: any) => {
				this.array_banco = data;
				if (PosibleValor !== null) {
					this.formDatosPersonales.controls.Banco.setValue(PosibleValor)
				}
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}

	getTipoCuenta(PosibleValor) {
		this.multitabla_s.GetListarCuentaBancaria().subscribe(
			(data: any) => {
				this.array_tipo_cuenta = data;
				if (PosibleValor !== null) {
					this.formDatosPersonales.controls.TipoCuenta.setValue(PosibleValor)
				}
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}

	getMoneda(PosibleValor) {
		this.multitabla_s.GetListarMoneda().subscribe(
			(data: any) => {
				this.array_moneda = data;
				if (PosibleValor !== null) {
					this.formDatosPersonales.controls.Moneda.setValue(PosibleValor)
				}
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}

	changeTab(tabId: number) {
		this.activeTabId = tabId;
	}

	addContactos() {
		this.array_contactos.push({
			idProveedorContacto: 0,
			Nombre: null,
			ApellidoPaterno: null,
			ApellidoMaterno: null,
			TipoDocumentoContacto: null,
			DocumentoIdentidadContacto: null,
			Cargo: null,
			TelefonoContacto: null,
			EmailContacto: null,
			Activo: true
		});

		this.deta_formTipoDocumentoContacto.push(new FormControl(null, [Validators.required]));
		this.deta_formDocumentoIdentidadContacto.push(new FormControl(null, [Validators.required]));
		this.deta_formNombre.push(new FormControl(null, [Validators.required]));
		this.deta_formApellidoPaterno.push(new FormControl(null, [Validators.required]));
		this.deta_formApellidoMaterno.push(new FormControl(null));
		this.deta_formCargo.push(new FormControl(null, [Validators.required]));
		this.deta_formTelefonoContacto.push(new FormControl(null));
		this.deta_formEmailContacto.push(new FormControl(null));
		this.chgRef.markForCheck();
	}

	array_contacto_eliminado: any = [];
	deleteContacto(item) {
		let index = this.array_contactos.indexOf(item);
		if (item.idProveedorContacto > 0) {
			this.array_contacto_eliminado.push(item);
		}
		this.array_contactos.splice(index, 1);
		this.deta_formTipoDocumentoContacto.splice(index, 1);
		this.deta_formDocumentoIdentidadContacto.splice(index, 1);
		this.deta_formNombre.splice(index, 1);
		this.deta_formApellidoPaterno.splice(index, 1);
		this.deta_formApellidoMaterno.splice(index, 1);
		this.deta_formCargo.splice(index, 1);
		this.deta_formTelefonoContacto.splice(index, 1);
		this.deta_formEmailContacto.splice(index, 1);
	}

	addCuentasBancarias() {
		this.array_cuentasBancarias.push({
			idProveedorCuentaBancaria: 0,
			Banco: null,
			TipoCuenta: null,
			TipoMoneda: null,
			Titular: null,
			NCuenta: null,
			CuentaInterbancaria: null,
			Detraccion: true,
			Activo: true

		});

		this.deta_formBanco.push(new FormControl(null, [Validators.required]));
		this.deta_formTitular.push(new FormControl(null, [Validators.required]));
		this.deta_formTipoCuenta.push(new FormControl(null, [Validators.required]));
		this.deta_formTipoMoneda.push(new FormControl(null, [Validators.required]));
		this.deta_formNumeroCuenta.push(new FormControl(null, [Validators.required]));
		this.deta_formCuentaInterbancaria.push(new FormControl(null, [Validators.required]));

		this.chgRef.markForCheck();
	}

	array_cuentaBancaria_eliminado: any = [];
	deleteCuentaBancaria(item) {

		let index = this.array_cuentasBancarias.indexOf(item);

		if (item.idProveedorCuentaBancaria > 0) {
			this.array_cuentaBancaria_eliminado.push(item);
		}

		this.array_cuentasBancarias.splice(index, 1);

		this.deta_formBanco.splice(index, 1);
		this.deta_formTitular.splice(index, 1);
		this.deta_formTipoCuenta.splice(index, 1);
		this.deta_formTipoMoneda.splice(index, 1);
		this.deta_formNumeroCuenta.splice(index, 1);
		this.deta_formCuentaInterbancaria.splice(index, 1);
	}

	prepare_model() {
		const controls = this.formDatosPersonales.controls;
		//let datoProveedor = [];
		let datoContacto = [];
		let datoCuentaBancaria = [];

		// datoProveedor.push({
		// 	idProveedor: this.idProveedor,
		// 	codigo: controls['Codigo'].value,
		// 	idCategoriaProveedor: controls['Categoria'].value,
		// 	idPais: controls['Pais'].value,
		// 	idDepartamento: controls['Departamento'].value,
		// 	idProvincia: controls['Provincia'].value,
		// 	idDistrito: controls['Distrito'].value,
		// 	razonSocial: controls['RazonSocial'].value,
		// 	nombreComercial: controls['NombreComercial'].value,
		// 	direccion: controls['Direccion'].value,
		// 	referencia: controls['Referencia'].value,
		// 	idTipoDocumentoIdentidad: controls['TipoDocumento'].value,
		// 	documentoIdentidad: controls['DocumentoIdentidad'].value,
		// 	telefono1: controls['Telefono'].value,
		// 	telefono2: controls['Telefono2'].value,
		// 	email: controls['Email'].value,
		// 	activo: controls['Activo'].value
		// })

		for (let i = 0; i < this.array_contactos.length; i++) {
			datoContacto.push({
				idProveedor: this.idProveedor,
				idProveedorContacto: this.array_contactos[i].idProveedorContacto,
				nombres: this.deta_formNombre[i].value,
				apePaterno: this.deta_formApellidoPaterno[i].value,
				apeMaterno: this.deta_formApellidoMaterno[i].value,
				idTipoDocumentoIdentidad: this.deta_formTipoDocumentoContacto[i].value,
				documentoIdentidad: this.deta_formDocumentoIdentidadContacto[i].value,
				cargo: this.deta_formCargo[i].value,
				telefono: this.deta_formTelefonoContacto[i].value,
				email: this.deta_formEmailContacto[i].value,
				activo: this.array_contactos[i].Activo,
				eliminado: 0

			});
		}

		for (let i = 0; i < this.array_contacto_eliminado.length; i++) {
			datoContacto.push({
				idProveedor: this.idProveedor,
				idProveedorContacto: this.array_contacto_eliminado[i].idProveedorContacto,
				nombres: this.array_contacto_eliminado[i].Nombre,
				apePaterno: this.array_contacto_eliminado[i].ApellidoPaterno,
				apeMaterno: this.array_contacto_eliminado[i].ApellidoMaterno,
				idTipoDocumentoIdentidad: this.array_contacto_eliminado[i].TipoDocumentoContacto,
				documentoIdentidad: this.array_contacto_eliminado[i].DocumentoIdentidadContacto,
				cargo: this.array_contacto_eliminado[i].Cargo,
				telefono: this.array_contacto_eliminado[i].TelefonoContacto,
				email: this.array_contacto_eliminado[i].EmailContacto,
				activo: this.array_contacto_eliminado[i].ActivoContacto,
				eliminado: 1
			});
		}

		for (let i = 0; i < this.array_cuentasBancarias.length; i++) {
			datoCuentaBancaria.push({
				idProveedor: this.idProveedor,
				idProveedorCuentaBancaria: this.array_cuentasBancarias[i].idProveedorCuentaBancaria,
				idBanco: this.deta_formBanco[i].value,
				idTipoCuentaBancaria: this.deta_formTipoCuenta[i].value,
				idMoneda: this.deta_formTipoMoneda[i].value,
				titular: this.deta_formTitular[i].value,
				nroCuenta: this.deta_formNumeroCuenta[i].value,
				nroCCI: this.deta_formCuentaInterbancaria[i].value,
				detraccion: this.array_cuentasBancarias[i].Detraccion,
				activo: this.array_cuentasBancarias[i].Activo,
				eliminado: 0
			});

		}

		for (let i = 0; i < this.array_cuentaBancaria_eliminado.length; i++) {
			datoCuentaBancaria.push({
				idProveedor: this.idProveedor,
				idProveedorCuentaBancaria: this.array_cuentaBancaria_eliminado[i].idProveedorCuentaBancaria,
				idBanco: this.array_cuentaBancaria_eliminado[i].Banco,
				idTipoCuentaBancaria: this.array_cuentaBancaria_eliminado[i].TipoCuenta,
				idMoneda: this.array_cuentaBancaria_eliminado[i].TipoMoneda,
				titular: this.array_cuentaBancaria_eliminado[i].Titular,
				nroCuenta: this.array_cuentaBancaria_eliminado[i].NCuenta,
				nroCCI: this.array_cuentaBancaria_eliminado[i].CuentaInterbancaria,
				detraccion: this.array_cuentaBancaria_eliminado[i].Detraccion,
				activo: this.array_cuentaBancaria_eliminado[i].Activo,
				eliminado: 1
			});
		}

		return {
			//Proveedor: datoProveedor,
			
			idProveedor: this.idProveedor,
			codigo: controls['Codigo'].value,
			idCategoriaProveedor: controls['Categoria'].value,
			idPais: controls['Pais'].value,
			idDepartamento: controls['Departamento'].value,
			idProvincia: controls['Provincia'].value,
			idDistrito: controls['Distrito'].value,
			razonSocial: controls['RazonSocial'].value,
			nombreComercial: controls['NombreComercial'].value,
			direccion: controls['Direccion'].value,
			referencia: controls['Referencia'].value,
			idTipoDocumentoIdentidad: controls['TipoDocumento'].value,
			documentoIdentidad: controls['DocumentoIdentidad'].value,
			telefono1: controls['Telefono'].value,
			telefono2: controls['Telefono2'].value,
			email: controls['Email'].value,
			activo: controls['Activo'].value,
			proveedorContactos: datoContacto,
			proveedorCuentasBancarias: datoCuentaBancaria
		}
	}

	saveUpdateProveedores() {
		this.hide_save = true;
		this.hide_load = false;
		const controls = this.formDatosPersonales.controls;

		if (this.formDatosPersonales.invalid) {
			this.hide_save = false;
			this.hide_load = true;
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

		let is_contactoValid: boolean = true;
		for (let i = 0; i < this.array_contactos.length; i++) {
			this.activeTabId = 0;
			let is_invalid: boolean =
				(this.deta_formTipoDocumentoContacto[i].invalid ||
					this.deta_formDocumentoIdentidadContacto[i].invalid ||
					this.deta_formNombre[i].invalid ||
					this.deta_formApellidoPaterno[i].invalid ||
					this.deta_formCargo[i].invalid);
			if (is_invalid) {
				this.deta_formTipoDocumentoContacto[i].markAsTouched();
				this.deta_formDocumentoIdentidadContacto[i].markAsTouched();
				this.deta_formNombre[i].markAsTouched();
				this.deta_formApellidoPaterno[i].markAsTouched();
				this.deta_formApellidoMaterno[i].markAsTouched();
				this.deta_formCargo[i].markAsTouched();
				this.deta_formTelefonoContacto[i].markAsTouched();
				this.deta_formEmailContacto[i].markAsTouched();
				is_contactoValid = is_contactoValid && false;
			}
		}
		if (!is_contactoValid) {
			this.hide_save = false;
			this.hide_load = true;
			this.toastr.warningToastr(
				"Ingrese campos obligatorios en Contacto.",
				"Advertencia!",
				{
					toastTimeout: 2000,
					showCloseButton: true,
					animate: "fade",
					progressBar: true,
				}
			);
			return;
		}

		let is_cuentasValid: boolean = true;
		for (let i = 0; i < this.array_cuentasBancarias.length; i++) {
			this.activeTabId = 1;
			let is_invalid: boolean =
				this.deta_formBanco[i].invalid ||
				this.deta_formTitular[i].invalid ||
				this.deta_formTipoCuenta[i].invalid ||
				this.deta_formTipoMoneda[i].invalid ||
				this.deta_formNumeroCuenta[i].invalid ||
				this.deta_formCuentaInterbancaria[i].invalid;
			if (is_invalid) {
				this.deta_formBanco[i].markAsTouched();
				this.deta_formTitular[i].markAsTouched();
				this.deta_formTipoCuenta[i].markAsTouched();
				this.deta_formTipoMoneda[i].markAsTouched();
				this.deta_formNumeroCuenta[i].markAsTouched();
				this.deta_formCuentaInterbancaria[i].markAsTouched();
				is_cuentasValid = is_cuentasValid && false;
			}
		}
		if (!is_cuentasValid) {
			this.hide_save = false;
			this.hide_load = true;
			this.toastr.warningToastr(
				"Ingrese campos obligatorios en Cuentas Bancarias.",
				"Advertencia!",
				{
					toastTimeout: 2000,
					showCloseButton: true,
					animate: "fade",
					progressBar: true,
				}
			);
			return;
		}

		let datos = this.prepare_model();
		this.proveedor_s.SaveUpdateProveedores(datos).subscribe(
			(data: any) => {
				this.hide_save = false;
				this.hide_load = true;
				this.util_S.viewExito(data[0].Ok, data[0].Message);
				
				if (data[0].Ok > 0) {   
					this.router.navigate(['Logistica/masters/Proveedores']);
				}

				this.chgRef.markForCheck();
			}, 
			(errorServicio) => {
				this.hide_save = false;
				this.hide_load = true;

				this.util_S.viewError(errorServicio);

				this.chgRef.markForCheck();
			}
		);

	}

	isInvalidForm() {
		return this.form.invalid;
	}

	mostrar() {
		return this.mostrarActivo;
	}

	isControlValid(controlName: string): boolean {
		const control = this.formDatosPersonales.controls[controlName];
		return control.valid && (control.dirty || control.touched);
	}

	isControlInvalid(controlName: string): boolean {
		const control = this.formDatosPersonales.controls[controlName];
		return control.invalid && (control.dirty || control.touched);
	}

	controlHasError(validation, controlName): boolean {
		const control = this.formDatosPersonales.controls[controlName];
		return control.hasError(validation) && (control.dirty || control.touched);
	}

	isControlTouched(controlName): boolean {
		const control = this.formDatosPersonales.controls[controlName];
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
}
