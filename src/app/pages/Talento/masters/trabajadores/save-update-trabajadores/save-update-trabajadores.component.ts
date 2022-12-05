import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
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
import { Certificado } from '../../../_core/models/certificado.model';
import { CertificadosService } from '../../../_core/services/certificados.service';
import { DocumentoService } from '../../../_core/services/documento.service';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { Metadata } from '../../../_core/models/metadata.model';
import { MetadataService } from '../../../_core/services/metadata.service';
import { DynamicFormComponent } from '../../_shared/dynamic-form/dynamic-form.component';
import { DatePipe } from '@angular/common';
import { DataSource } from '@angular/cdk/table';
import { TrabajadorService } from '../../../_core/services/trabajador.service';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { TypeControlEnum } from '../../../_core/models/type-control.enum.model';
import * as JSZip from 'jszip';
import * as FileSaver from "file-saver";
import { C } from '@angular/cdk/keycodes';
import { EmpresaService } from '../../../../Security/_core/services/empresa.service';
import { puestoTrabajoService } from '../../../_core/services/puestoTrabajo.service';
import { isJSDocThisTag } from 'typescript';

@Component({
	selector: 'app-save-update-trabajadores',
	templateUrl: './save-update-trabajadores.component.html',
	styleUrls: ['./save-update-trabajadores.component.scss'],
	providers: [DatePipe,
		{ provide: NgbDateAdapter, useClass: CustomAdapter },
		{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
	]
})
export class SaveUpdateTrabajadoresComponent implements OnInit {
	formDatosPersonales: FormGroup;
	formContrato: FormGroup;
	load_data: boolean = true;
	no_data: boolean = false;
	searchBan: boolean = false;
	listData: MatTableDataSource<any>;
	displayedColumns: string[] = ['DesModalidad', 'DesPuestoTrabajo', 'InicioContrato',
		'FinContrato', /* 'DesEsquema','FormatoContrato', 'CargarContrato',*/ 'DescargarContrato', 'Vigente', 'Acciones'];
	@ViewChild(MatSort) MatSort: MatSort;
	@ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

	private subscriptions: Subscription[] = [];
	validViewAction = this.pvas.validViewAction;
	viewsActions: Array<Navigation> = [];
	array_dataList: any;
	array_empresas: any;
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
	array_estado_civil: any;
	array_sexo: any;
	array_motivo_cese: any;
	array_fondo_pension: any;
	array_estado_expediente: any;
	array_cliente_certificado: any;
	array_esquema_comision: any;
	array_contratos: any = [];
	array_contrato_eliminado: any = [];
	array_empresas_trabajador: Array<any> = [];
	array_zonas: Array<any> = [];
	array_unidades: Array<any> = [];

	empresasActivas: Set<number> = new Set();

	tabs = {
		DATOS_TAB: 0,
		CERTIFICACIONES_TAB: 1,
		CONTRATOS_TAB: 2,
		ZONA_UNIDAD_TAB: 3
	};
	tabs_contrato = {
		EXPEDIENTE_TAB: 0,
		DATOS_TAB: 1
	};
	
	activeTabId = this.tabs.DATOS_TAB;
	activeTabIdContrato = this.tabs_contrato.EXPEDIENTE_TAB;
	deta_formFileExpediente: FormControl[] = [];
	deta_formEstadoExpediente: FormControl[] = [];
	deta_formClienteExterno: FormControl[] = [];
	deta_formInicioVigencia: FormControl[] = [];
	deta_formFinVigencia: FormControl[] = [];
	loadingMetadataEspecifica: boolean = false;
	metadataEspecifica: any = [];
	metadataExpedientes: any = [];
	dataEspecifica: any = {};
	array_datos_contrato: any = [];
	array_tipo_dato: any = [];
	array_certificaciones: any = [];
	array_cliente_externo: any = [];
	array_provincia_contrato: any = [];
	hide_save: Boolean = false;
	hide_load: Boolean = true;
	isNewContrato: Boolean = false;
	idTrabajador: number = 0;
	urlFirma: string='';
	nombresTrabajador: string = '';
	nombreEmpresa: string = '';
	estado: any = { id: null };
	respuestasEspecificas = [];
	ref: AngularFireStorageReference;
	task: AngularFireUploadTask;
	@ViewChild('dynamicFormDataEspecifica') dynamicFormDataEspecifica: DynamicFormComponent;

	metadata: Array<Metadata> = [];
	respuestas: Array<any> = [];
	classControl: string = 'col-lg-12';
	data: any = {};
	readyForm = false;
	form: FormGroup = null;//
	prefixNameControl = `c_${(new Date()).getTime()}_`;
	filenameDefault = 'Seleccione el archivo';
	controlsEnum: typeof TypeControlEnum = TypeControlEnum;
	idContratoEditar: any = 0;
	posContratoEditar: any = null;
	zip_masivo = new JSZip();

	constructor(
		private fb: FormBuilder,
		public certificado_s: CertificadosService,
		public puestoTrabajo_s:puestoTrabajoService,
		public documento_s: DocumentoService,
		public multitabla_s: MultitablaService,
		public pvas: PermissionViewActionService,
		public empresa_s:EmpresaService,
		public toastr: ToastrManager,
		private chgRef: ChangeDetectorRef,
		private router: Router,
		private route: ActivatedRoute,
		private metadataService: MetadataService,
		private datePipe: DatePipe,
		private trabajador_s: TrabajadorService,
		private httpClient: HttpClient,
		private storage: AngularFireStorage,
		private formBuilder: FormBuilder,
	) { }

	ngOnInit(): void {
		this.listData = new MatTableDataSource([]);
		this.viewsActions = this.pvas.get();
		this.datosForm();
		this.contratoForm();
		this.getMotivoCese();
		this.getFondoPensiones();
		this.getEstadoExpediente();
		this.getListarEsquemaComision();
		this.getModalidadContratacion(null);
		this.getListarProvinciaContrato();
		this.idTrabajador = this.route.snapshot.queryParams['id'] || 0;
		if (this.idTrabajador > 0) {
			this.getDataTrabajadores(this.idTrabajador);
		} else {
			this.getEmpresas(null);			
			this.getPuestoTrabajo(0,null);
			this.getPaises(null);
			this.getSexo(null);
			this.getTipoDocumentoIdentidad(null);
			this.getBanco(null);
			this.getTipoCuenta(null);
			this.getEstadoCivil(null);
			this.getMoneda(null);
			this.getListaZonas(0);
			this.getListaUnidadesNegocio(0);
		}
	}

	getExpedientesDatos(Modalidad, PuestoTrabajo) {
		let Empresa = this.formDatosPersonales.controls.Empresa.value;
		if (Modalidad === null || PuestoTrabajo === null) {
			this.formContrato.controls.PuestoTrabajo.markAsTouched();
			this.formContrato.controls.Modalidad.markAsTouched();
			this.toastr.infoToastr('Por favor seleccione una moalidad y puesto de trabajo para obtener datos.', 'Información!', {
				toastTimeout: 3000,
				showCloseButton: true,
				animate: 'fade',
				progressBar: true
			});
			return;
		}


		let pensionario = this.formContrato.controls.FondoPensionario.value;

		if (Modalidad === '0001') {
			this.formContrato.removeControl('FondoPensionario');
			this.formContrato.addControl("FondoPensionario", new FormControl(null));
			this.formContrato.controls.FondoPensionario.reset();
			this.formContrato.controls.FondoPensionario.disable();
		} else {
			this.formContrato.removeControl('FondoPensionario');
			this.formContrato.addControl("FondoPensionario", new FormControl(pensionario, Validators.required));
			this.formContrato.controls.FondoPensionario.enable();
		}




		this.loadData(Empresa, Modalidad, PuestoTrabajo);
	}

	arrayData: any = [];
	loadData(Empresa, Modalidad, PuestoTrabajo) {
		this.deta_formEstadoExpediente = [];
		this.deta_formFileExpediente = [];
		this.metadataExpedientes = [];
		this.metadataService.getExpedientesDatosPuesto(Empresa, Modalidad, PuestoTrabajo).subscribe(
			(data: any) => {
				console.log(data);
				this.arrayData = data[1];
				this.arrayData.forEach(e => {
					this.deta_formFileExpediente.push(new FormControl(null));
					this.deta_formEstadoExpediente.push(new FormControl('0001', [Validators.required]));
				});
				this.metadataExpedientes = data[1];
				this.metadataEspecifica = data[0];
				this.metadata = data[0];
				this.loadDataDatos();
				this.loadingMetadataEspecifica = false;
				this.chgRef.markForCheck();
			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

	loadDataDatos() {
		this.readyForm = false;
		this.data = {};
		const controls: any = {};
		this.metadata.forEach(control => {
			this.data[control.ConfigDatoContrato] = {
				ConfigDatoContrato: control.ConfigDatoContrato,
				DatoContrato: control.DatoContrato,
				IdConfigDatoContrato: control.ConfigDatoContrato,
				ControlName: `${this.prefixNameControl}${control.ConfigDatoContrato}`,
				TipoDatoRespuesta: control.TipoDatoRespuesta,
				NombreDato: control.NombreDato,
				value: null
			};
			if (control.defaultValue) {
				this.data[control.ConfigDatoContrato].value = control.defaultValue;
			}

			if (control.TipoDatoRespuesta === TypeControlEnum.CHECK) {
				this.data[control.ConfigDatoContrato].value = false;
			}

			console.log(this.data[control.ConfigDatoContrato].value);
			controls[this.data[control.ConfigDatoContrato].ControlName] = [this.data[control.ConfigDatoContrato].value, []];
		});
		this.form = this.formBuilder.group(controls);

		console.log(this.data);
		this.readyForm = true;
	}

	loadDataDatosEdicion() {
		this.readyForm = false;
		this.data = {};
		const controls: any = {};
		console.log(this.metadata);
		this.metadata.forEach(control => {
			this.data[control.ConfigDatoContrato] = {
				ConfigDatoContrato: control.ConfigDatoContrato,
				DatoContrato: control.DatoContrato,
				IdConfigDatoContrato: control.ConfigDatoContrato,
				ControlName: `${this.prefixNameControl}${control.ConfigDatoContrato}`,
				TipoDatoRespuesta: control.TipoDatoRespuesta,
				NombreDato: control.NombreDato,
				value: (control.value === 'True') ? true : ((control.value === 'False') ? false : control.value)
			};
			controls[this.data[control.ConfigDatoContrato].ControlName] = [this.data[control.ConfigDatoContrato].value, []];
		});
		this.form = this.formBuilder.group(controls);

		console.log(this.data);
		this.readyForm = true;
	}

	calculoMeses(FechaInicio, FechaFin) {
		let meses = this.monthDiff(new Date(FechaInicio + 'T00:00:00'), new Date(FechaFin + 'T00:00:00'))
		this.formContrato.controls.DuracionContrato.setValue(meses);
	}

	monthDiff(d1, d2) {
		var months;
		months = (d2.getFullYear() - d1.getFullYear()) * 12;
		console.log(d2.getFullYear(), d1.getFullYear(), months)
		months -= d1.getMonth() + 1;
		months += d2.getMonth();
		return (months <= 0 ? 0 : months) + 1;
	}

	dataEspecificaLoaded($event) {
		this.dataEspecifica = $event;
	}

	changeTab(tabId: number) {
		this.activeTabId = tabId;
		console.log(tabId);
		if (tabId === 1) {
			this.nombresTrabajador = (this.formDatosPersonales.controls.Nombres.value === null ? '' : this.formDatosPersonales.controls.Nombres.value) + ' ' +
				(this.formDatosPersonales.controls.ApellidoPaterno.value === null ? '' : this.formDatosPersonales.controls.ApellidoPaterno.value) + ' '
				+ (this.formDatosPersonales.controls.ApellidoMaterno.value === null ? '' : this.formDatosPersonales.controls.ApellidoMaterno.value);
		}

		if (tabId === 2) {
			if (this.formDatosPersonales.controls.Empresa.value === null) {
				this.formDatosPersonales.controls.Empresa.markAsTouched();
				this.activeTabId = 0;
				this.toastr.infoToastr('Por favor seleccion una empresa.', 'Información!', {
					toastTimeout: 3000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				return;
			}
			this.getPuestoTrabajo(this.formDatosPersonales.controls.Empresa.value,null);
			this.nombresTrabajador = (this.formDatosPersonales.controls.Nombres.value === null ? '' : this.formDatosPersonales.controls.Nombres.value) + ' ' +
				(this.formDatosPersonales.controls.ApellidoPaterno.value === null ? '' : this.formDatosPersonales.controls.ApellidoPaterno.value) + ' '
				+ (this.formDatosPersonales.controls.ApellidoMaterno.value === null ? '' : this.formDatosPersonales.controls.ApellidoMaterno.value);

			this.nombreEmpresa = this.array_empresas.find(item => item.idEmpresa === this.formDatosPersonales.controls.Empresa.value).razonSocial;
		}
		if(tabId === 3){
			if (this.formDatosPersonales.controls.Empresa.value === null) {
				this.formDatosPersonales.controls.Empresa.markAsTouched();
				this.activeTabId = 0;
				this.toastr.infoToastr('Por favor seleccion una empresa.', 'Información!', {
					toastTimeout: 3000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				return;
			}
			this.array_empresas_trabajador.forEach(element => {
				element.activo = this.empresasActivas.has(element.idEmpresa);
			});
		}
	}

	changeTabContrato(tabId: number) {
		this.activeTabIdContrato = tabId;
		console.log('fasddsfsdf sfsfsd');
	}

	getDataTrabajadores(Trabajador) {
		this.trabajador_s.GetDatosTrabajador(Trabajador).subscribe(
			(data: any) => {
				console.log(data);
				let dataCabecera = data[0];
				// console.log(dataCabecera.UrlFirma)
				this.formDatosPersonales.controls.Codigo.setValue(dataCabecera.Codigo);
				this.formDatosPersonales.controls.Nombres.setValue(dataCabecera.Nombres);
				this.formDatosPersonales.controls.ApellidoPaterno.setValue(dataCabecera.ApellidoPaterno);
				this.formDatosPersonales.controls.ApellidoMaterno.setValue(dataCabecera.ApellidoMaterno);
				this.formDatosPersonales.controls.Direccion.setValue(dataCabecera.Direccion);
				this.formDatosPersonales.controls.Referencias.setValue(dataCabecera.Referencia);
				this.formDatosPersonales.controls.DocumentoIdentidad.setValue(dataCabecera.DocumentoIdentidad);
				if(dataCabecera.FechaNacimiento!==null && dataCabecera.FechaNacimiento != ''){
					this.formDatosPersonales.controls.FechaNacimiento.setValue(dataCabecera.FechaNacimiento);//.split(' ',1)[0]
				}
				this.formDatosPersonales.controls.Email.setValue(dataCabecera.Email);
				this.formDatosPersonales.controls.Telefono.setValue(dataCabecera.Telefono);
				this.formDatosPersonales.controls.Celular.setValue(dataCabecera.Celular);
				this.formDatosPersonales.controls.CelularReferencial.setValue(dataCabecera.CelularReferencial);
				this.formDatosPersonales.controls.RUC.setValue(dataCabecera.Ruc);
				this.formDatosPersonales.controls.NombreConyugue.setValue(dataCabecera.NombreConyugue);
				this.formDatosPersonales.controls.Hijos.setValue(dataCabecera.TieneHijos);
				this.formDatosPersonales.controls.NumeroHijos.setValue(dataCabecera.CantidadHijos);
				this.formDatosPersonales.controls.NumeroCuenta.setValue(dataCabecera.NroCuenta);
				this.formDatosPersonales.controls.NumeroCCI.setValue(dataCabecera.NroCCI);
				this.formDatosPersonales.controls.Activo.setValue(dataCabecera.Activo);
				this.empresasActivas = new Set(dataCabecera.EmpresasAsignadas.split(',').map(e=>parseInt(e)));				
				this.getEmpresas(dataCabecera.Empresa);
				this.getClienteCertificacion(dataCabecera.Empresa);
				this.getListaZonas(Trabajador);
				this.getListaUnidadesNegocio(Trabajador);

				if (dataCabecera.Pais !== 1) {
					this.formDatosPersonales.removeControl('Departamento');
					this.formDatosPersonales.removeControl('Provincia');
					this.formDatosPersonales.removeControl('Distrito');
					this.formDatosPersonales.addControl("Departamento", new FormControl(null));
					this.formDatosPersonales.addControl("Provincia", new FormControl(null));
					this.formDatosPersonales.addControl("Distrito", new FormControl(null));
				}
				this.getPaises(dataCabecera.Pais);
				this.getListarDepartamento(dataCabecera.Pais, dataCabecera.Departamento);
				this.getListarProvincia(dataCabecera.Departamento, dataCabecera.Provincia);
				this.getListarDistrito(dataCabecera.Provincia, dataCabecera.Distrito);
				this.getSexo(dataCabecera.Sexo);
				this.getTipoDocumentoIdentidad(dataCabecera.TipoDocumentoIdentidad);
				this.getBanco(dataCabecera.Banco);
				this.getTipoCuenta(dataCabecera.TipoCuentaBancaria);
				this.getEstadoCivil((dataCabecera.EstadoCivil!="")?dataCabecera.EstadoCivil:null);
				this.getMoneda(dataCabecera.Moneda);
				this.llenarCertificados(dataCabecera.Certificados);
				this.array_contratos = dataCabecera.Contratos;
				this.urlFirma=dataCabecera.UrlFirma;

				console.log(this.urlFirma)
				this.load_data = true;
				this.searchBan = false;
				this.listData = new MatTableDataSource(this.array_contratos);
				if (this.array_contratos.length > 0) {
					this.no_data = true;
				} else {
					this.no_data = false;
				}
				this.chgRef.markForCheck();

			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}


	llenarCertificados(Certificados) {
		for (let i = 0; i <= Certificados.length - 1; i++) {
			this.array_certificaciones.push(Certificados[i]);
			this.deta_formClienteExterno.push(new FormControl(Certificados[i].ClienteExterno, [Validators.required]));
			this.deta_formInicioVigencia.push(new FormControl(Certificados[i].InicioVigencia, [Validators.required]));
			this.deta_formFinVigencia.push(new FormControl(Certificados[i].FinVigencia, [Validators.required]));
		}
		console.log(this.array_certificaciones);
		this.chgRef.markForCheck();
	}

	addContrato() {
		if (this.idTrabajador === 0) {
			if (this.array_contratos.length > 0) {
				this.toastr.infoToastr('Ya se agrego un contrato para este trabajador.', 'Información!', {
					toastTimeout: 3000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				return;
			} else {
				this.isNewContrato = true;
				this.activeTabIdContrato = 0;
			}
		} else {
			let result = this.array_contratos.filter(item => item.Vigencia === 'SI');
			console.log(this.array_contratos)
			// if (result.length > 0) {
				// this.toastr.infoToastr('El trabajador tiene un contrato vigente.', 'Información!', {
					// toastTimeout: 3000,
					// showCloseButton: true,
					// animate: 'fade',
					// progressBar: true
				// });
				// return;
			// } else {
				this.isNewContrato = true;
				this.activeTabIdContrato = 0;
			// }

		}

	}

	deleteContrato(item) {
		let index = this.array_contratos.indexOf(item);

		if (item.Contrato > 0 && this.idTrabajador>0) {
			this.trabajador_s.DeleteContrato(item.Contrato).subscribe(
        (data:any) => {
          if (data[0].Ok > 0) {
            this.toastr.successToastr(data[0].Message, 'Correcto!', {
              toastTimeout: 2000,
              showCloseButton: true,
              animate: 'fade',
              progressBar: true
            });
          } else {
            this.toastr.errorToastr(data[0].Message, 'Error!', {
              toastTimeout: 2000,
              showCloseButton: true,
              animate: 'fade',
              progressBar: true
            });
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
			// this.array_contrato_eliminado.push(item);
		}

		this.array_contratos.splice(index, 1);
		this.load_data = true;
		this.searchBan = false;
		this.listData = new MatTableDataSource(this.array_contratos);
		if (this.array_contratos.length > 0) {
			this.no_data = true;
		} else {
			this.no_data = false;
		}
		this.chgRef.markForCheck();

	}

	editContrato(item, pos) {
		console.log(item);
		console.log(item.Contrato);

		this.idContratoEditar = item.Contrato;
		this.posContratoEditar = pos;

		if (item.Modalidad === '0001') {
			this.formContrato.removeControl('FondoPensionario');
			this.formContrato.addControl("FondoPensionario", new FormControl(null));
			this.formContrato.controls.FondoPensionario.disable();
		} else {
			this.formContrato.removeControl('FondoPensionario');
			this.formContrato.addControl("FondoPensionario", new FormControl(null, Validators.required));
			this.formContrato.controls.FondoPensionario.enable();
		}

		this.formContrato.controls.Modalidad.setValue(item.Modalidad);
		this.formContrato.controls.PuestoTrabajo.setValue(item.PuestoTrabajo);
		if(item.Provincia && item.Provincia !== 0){
			this.formContrato.controls.Provincia.setValue(item.Provincia);
		}
		this.formContrato.controls.Sueldo.setValue(item.Sueldo);
		if(item.HoraInicioLabores){
			this.formContrato.controls.HoraInicioLabores.setValue(item.HoraInicioLabores);
		}
		if (item.HoraFinLabores){
			this.formContrato.controls.HoraFinLabores.setValue(item.HoraFinLabores);
		}
		this.formContrato.controls.Esquema.setValue(item.Esquema);
		this.formContrato.controls.FondoPensionario.setValue(item.FondoPensionario);
		// console.log(item.FechaInicioContrato)
		this.formContrato.controls.FechaInicioContrato.setValue(item.FechaInicioContrato);
		if(item.FechaFinPeriodo){
			this.formContrato.controls.FechaFinPeriodo.setValue(item.FechaFinPeriodo);
		}
		if(item.FechaFinContrato){
			this.formContrato.controls.FechaFinContrato.setValue(item.FechaFinContrato);
			this.calculoMeses(item.FechaInicioContrato, item.FechaFinContrato);
		}
		if(item.Motivo && parseInt(item.Motivo) > 0){
			this.formContrato.controls.Motivo.setValue(item.Motivo);
		}
		this.formContrato.controls.Descripcion.setValue(item.Descripcion);
		this.isNewContrato = true;
		this.activeTabIdContrato = 0;

		if (item.Contrato > 0) {
			this.trabajador_s.GetDatosContrato(item.Contrato).subscribe(
				(data: any) => { 
					console.log(data)
					this.arrayData = data[0];
					this.arrayData.forEach(e => {
						this.deta_formFileExpediente.push(new FormControl(null));
						this.deta_formEstadoExpediente.push(new FormControl(e.Estado, [Validators.required]));
					});
					this.metadataExpedientes = data[0];
					this.metadataEspecifica = data[1];
					this.metadata = data[1];
					this.loadDataDatosEdicion();
					this.loadingMetadataEspecifica = false;
					this.chgRef.markForCheck();
				}, (errorServicio) => {
					console.log(errorServicio);
				}
			);
		} else {
			this.arrayData = item.Expedientes;
			this.arrayData.forEach(e => {
				this.deta_formFileExpediente.push(new FormControl(null));
				this.deta_formEstadoExpediente.push(new FormControl(e.Estado, [Validators.required]));
			});
			this.metadataExpedientes = item.Expedientes;
			this.metadataEspecifica = item.Datos;
			this.metadata = item.Datos;
			this.loadDataDatosEdicion();
			this.loadingMetadataEspecifica = false;
			this.chgRef.markForCheck();
		}
	}

	cancelContrato() {
		this.isNewContrato = false;
		this.idContratoEditar = 0;
		this.posContratoEditar = null;
		this.formContrato.reset();
		this.arrayData = [];
		this.metadataExpedientes = [];
		this.metadataEspecifica = [];
	}

	getEmpresas(PosibleValor) {
		this.empresa_s.GetEmpresaByUsuario().subscribe(
			(data: any) => {
				this.array_empresas_trabajador = data.map(e=>({idEmpresa: e.idEmpresa, idTrabajador: this.idTrabajador, razonSocial: e.razonSocial, activo : 0}));
				this.array_empresas = data;
				if (PosibleValor !== null) {
					this.formDatosPersonales.controls.Empresa.setValue(PosibleValor)
				}
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}

	getPuestoTrabajo(Empresa,PosibleValor) {
		this.puestoTrabajo_s.GetPuestoTrabajoByUsuario((Empresa==null) ? 0:Empresa,0).subscribe(
			(data: any) => {
				this.array_puestos = data;
				if (PosibleValor !== null) {
					this.formDatosPersonales.controls.PuestoTrabajo.setValue(PosibleValor)
				}
				console.log('holi');
				
			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

	getModalidadContratacion(PosibleValor) {
		this.multitabla_s.GetModalidadContratacion().subscribe(
			(data: any) => {
				this.array_modalidad = data;
				// if (PosibleValor !== null) {
				//   this.formGroup.controls.Modalidad.setValue(PosibleValor)
				// }                      
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}

	getPaises(PosibleValor) {
		/* if(!PosibleValor){
			this.formDatosPersonales.controls.Pais.reset()
			return 0
		} */
		this.multitabla_s.GetListarPaises().subscribe(
			(data: any) => {
				this.array_pais = data;
				if (PosibleValor !== null) {
					this.formDatosPersonales.controls.Pais.setValue(PosibleValor)
				}
				console.log(this.array_pais = data);
				
			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

	getSexo(PosibleValor) {
		this.multitabla_s.GetListarSexos().subscribe(
			(data: any) => {
				this.array_sexo = data;
				if (PosibleValor !== null) {
					this.formDatosPersonales.controls.Sexo.setValue(PosibleValor)
				}
			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

	getTipoDocumentoIdentidad(PosibleValor) {
		this.multitabla_s.GetTipoDocumentoIdentidad().subscribe(
			(data: any) => {
				this.array_tipo_doc = data;
				if (PosibleValor !== null) {
					this.formDatosPersonales.controls.TipoDocumento.setValue(PosibleValor)
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

	getEstadoCivil(PosibleValor) {
		this.multitabla_s.GetListarEstadoCivil().subscribe(
			(data: any) => {
				this.array_estado_civil = data;
				if (PosibleValor !== null) {
					this.formDatosPersonales.controls.EstadoCivil.setValue(PosibleValor)
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

	getMotivoCese() {
		this.multitabla_s.GetListarMotivosCese().subscribe(
			(data: any) => {
				this.array_motivo_cese = data;
			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

	getFondoPensiones() {
		this.multitabla_s.GetListarFondoPensiones().subscribe(
			(data: any) => {
				this.array_fondo_pension = data;
			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

	getEstadoExpediente() {
		this.multitabla_s.GetListarEstadoExpediente().subscribe(
			(data: any) => {
				this.array_estado_expediente = data;				
			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

	getClienteCertificacion(Empresa) {
		this.certificado_s.GetCertificadosList(Empresa, 0, '-1').subscribe(
			(data: any) => {
				this.array_cliente_certificado = data;
			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

	getListarEsquemaComision() {
		this.multitabla_s.GetListarEsquemaComision().subscribe(
			(data: any) => {
				this.array_esquema_comision = data;
				this.array_esquema_comision.unshift({
					EsquemaComision: 0,
					NombreComision: 'No aplica'
				})
			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

	getListarDepartamento(Pais, PosibleValor) {
		/* if(!PosibleValor){
			this.formDatosPersonales.controls.Pais.reset()
			return 0
		} */

		if (Pais !== 1) {
			this.formDatosPersonales.removeControl('Departamento');
			this.formDatosPersonales.removeControl('Provincia');
			this.formDatosPersonales.removeControl('Distrito');
			this.formDatosPersonales.addControl("Departamento", new FormControl(null));
			this.formDatosPersonales.addControl("Provincia", new FormControl(null));
			this.formDatosPersonales.addControl("Distrito", new FormControl(null));
		}

		this.formDatosPersonales.controls.Departamento.reset();
		this.multitabla_s.GetListarDepartamentos(Pais).subscribe(
			(data: any) => {
				this.array_departamento = data;
				console.log(this.array_departamento);
				
				if (PosibleValor > 0) {
					this.formDatosPersonales.controls.Departamento.setValue(PosibleValor)
				}
			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

	getListarProvincia(Departamento, PosibleValor) {
		/* if(!PosibleValor){
			this.formDatosPersonales.controls.Pais.reset()
			return 0
		} */
		this.formDatosPersonales.controls.Provincia.reset();
		this.multitabla_s.GetListarProvincia(Departamento).subscribe(
			(data: any) => {
				this.array_provincia = data;
				if (PosibleValor > 0) {
					this.formDatosPersonales.controls.Provincia.setValue(PosibleValor)
				}
			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

	getListarProvinciaContrato() {
		/* if(!PosibleValor){
			this.formDatosPersonales.controls.Pais.reset()
			return 0
		} */
		console.log('sdfsdfsdfsdfsdf fdsfsd');
		this.multitabla_s.GetListarProvincia('').subscribe(
			(data: any) => {
				console.log(data);
				this.array_provincia_contrato = data;				
			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

	getListarDistrito(Provincia, PosibleValor) {
		/* if(!PosibleValor){
			this.formDatosPersonales.controls.Pais.reset()
			return 0
		} */
		this.formDatosPersonales.controls.Distrito.reset();
		this.multitabla_s.GetListarDistrito(Provincia).subscribe(
			(data: any) => {
				this.array_distrito = data;
				if (PosibleValor > 0) {
					this.formDatosPersonales.controls.Distrito.setValue(PosibleValor)
				}
			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

	getListaZonas(idTrabajador){
		this.trabajador_s.GetZonasTrabajador(idTrabajador).subscribe(
			(data:any)=>{
				console.log('Zonas: ',data);
				this.array_zonas = data;
			}, (errorServicio)=>{
				console.log(errorServicio);
			}
		);
	}	

	getListaUnidadesNegocio(idTrabajador){
		this.trabajador_s.GetUnidadesNegocioTrabajador(idTrabajador).subscribe(
			(data:any)=>{
				console.log('Unidades: ',data);
				
				this.array_unidades = data;
			}, (errorServicio)=>{
				console.log(errorServicio);
			}
		);
	}

	chargeFile(Pos) {
		let element: HTMLElement = document.getElementById('File' + Pos) as HTMLElement;
		element.click();
	}

	getFileDATA(event, pos) {
		if (event.target.files && event.target.files.length) {
			let waitToastr = this.toastr.infoToastr('Cargando Archivo...', 'Cargando...', {
				dismiss: 'controlled',
				animate: 'fade',
				progressBar: true
			});
			const file = event.target.files[0];
			let nombreArchivo = file.name;
			let datoArchivo = nombreArchivo.split(".");
			let tipoDocumento = datoArchivo[datoArchivo.length - 1];
			let filePath = '';

			filePath = 'ExpedientesTrabajador/' + Date.now() + '.' + datoArchivo[datoArchivo.length - 1];


			this.ref = this.storage.ref(filePath);
			this.task = this.ref.put(file);
			this.task.snapshotChanges().pipe(
				finalize(() => {
					this.ref.getDownloadURL().subscribe(url => {
						this.metadataExpedientes[pos].urlExpediente = url;
						this.metadataExpedientes[pos].nombreArchivo = nombreArchivo;
						this.deta_formFileExpediente[pos].reset();
						waitToastr.dismiss();
						this.chgRef.markForCheck();
					});
				})
			).subscribe();

		}
	}

	descargarArchivo(nombre, url) {
		if (url !== null) {
			let waitToastr = this.toastr.infoToastr('Descargando Archivo...', 'Descargando', {
				dismiss: 'controlled',
				animate: 'fade',
				progressBar: true
			});
			this.httpClient.get(url, { responseType: 'blob' })
				.subscribe(response => {
					FileSaver.saveAs(response, nombre);
					waitToastr.dismiss();
				}, error => {
					this.toastr.errorToastr('Se produjo un error al descargar archivo.', 'Error!', {
						toastTimeout: 4000,
						showCloseButton: true,
						animate: 'fade',
						progressBar: true
					});
				});
		}
	}

	datosForm() {
		this.formDatosPersonales = this.fb.group({
			Codigo: [null],
			Empresa: [null, Validators.compose([Validators.required])],
			Pais: [null, Validators.compose([Validators.required])],
			Departamento: [null, Validators.compose([Validators.required])],
			Provincia: [null, Validators.compose([Validators.required])],
			Distrito: [null, Validators.compose([Validators.required])],
			Nombres: [null, Validators.compose([Validators.required])],
			ApellidoPaterno: [null, Validators.compose([Validators.required])],
			ApellidoMaterno: [null, Validators.compose([Validators.required])],
			Direccion: [null, Validators.compose([Validators.required])],
			Referencias: [null],
			TipoDocumento: [null, Validators.compose([Validators.required])],
			DocumentoIdentidad: [null, Validators.compose([Validators.required])],
			FechaNacimiento: [null, Validators.compose([Validators.required])],
			Email: [null, Validators.compose([Validators.required, Validators.email])],
			Telefono: [null, Validators.compose([Validators.required])],
			Celular: [null],
			CelularReferencial: [null],
			Sexo: [null, Validators.compose([Validators.required])],
			RUC: [null],
			EstadoCivil: [null, Validators.compose([Validators.required])],
			NombreConyugue: [null],
			Hijos: [false],
			NumeroHijos: [null],
			Banco: [null],
			TipoCuenta: [null],
			Moneda: [null],
			NumeroCuenta: [null],
			NumeroCCI: [null],
			Activo: [true],
		});



		this.formDatosPersonales.controls.Hijos.valueChanges.subscribe(checked => {
			if (checked) {
				this.formDatosPersonales.controls.NumeroHijos.enable()
			} else {
				this.formDatosPersonales.controls.NumeroHijos.disable()
				this.formDatosPersonales.controls.NumeroHijos.setValue("");
			}
		});

		this.formDatosPersonales.controls.EstadoCivil.valueChanges.subscribe(value => {
			if (value === '0001') {
				this.formDatosPersonales.controls.NombreConyugue.enable()
			} else {
				this.formDatosPersonales.controls.NombreConyugue.disable()
				this.formDatosPersonales.controls.NombreConyugue.setValue("");
			}
		});
	}
	
  contratoForm() {
    this.formContrato = this.fb.group({
      Modalidad: [null, Validators.compose([Validators.required])],
      PuestoTrabajo: [null, Validators.compose([Validators.required])],
      Esquema: [null],//, Validators.compose([Validators.required])
      FondoPensionario: [null, Validators.compose([Validators.required])],
      FechaInicioContrato: [null, Validators.compose([Validators.required])],
      FechaFinPeriodo: [null, Validators.compose([Validators.required])],
      FechaFinContrato: [null, Validators.compose([Validators.required])],
      DuracionContrato: [null],
      HoraInicioLabores: [null],
      HoraFinLabores: [null],
      Sueldo: [null, Validators.compose([Validators.required])],
      Provincia: [null, Validators.compose([Validators.required])],
      Motivo: [null],
      Descripcion: [null],     
    }, {validators: this.horarioTrabajoValidator});    
  }

  addCertificaciones() {
    this.array_certificaciones.push({
      IdCertificacion: 0,      
      ClienteExterno: null,
      InicioVigencia: null,
      FinVigencia: null,
      Vigente: null,
      ValorVigente: null,
      Activo: true
    });

    this.deta_formClienteExterno.push(new FormControl(null, [Validators.required]));
    this.deta_formInicioVigencia.push(new FormControl(null, [Validators.required]));
    this.deta_formFinVigencia.push(new FormControl(null, [Validators.required]));

    console.log(this.array_certificaciones);
    this.chgRef.markForCheck();
  }

  saveUpdateTrabajadores() {
    this.hide_save = true;
    this.hide_load = false;
    const controls = this.formDatosPersonales.controls;

		controls.Departamento.setValidators(null);
		controls.Provincia.setValidators(null);
		controls.Distrito.setValidators(null);

		if (this.array_departamento && this.array_departamento.length > 0) {
			controls.Departamento.setValidators([Validators.required]);
			if (this.array_provincia && this.array_provincia.length > 0) {
				controls.Provincia.setValidators([Validators.required]);
				if (this.array_distrito && this.array_distrito.length > 0) {
					controls.Distrito.setValidators([Validators.required]);
				}
			}
		}
		controls.Departamento.updateValueAndValidity();
		controls.Provincia.updateValueAndValidity();
		controls.Distrito.updateValueAndValidity();

		if (this.formDatosPersonales.invalid) {
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

		for (let i = 0; i < this.array_certificaciones.length; i++) {
			this.activeTabId = 1;
			if (this.deta_formClienteExterno[i].status === 'INVALID') {
				this.hide_save = false;
				this.hide_load = true;
				this.toastr.warningToastr('Seleccione un cliente - certificado, es obligatorios.', 'Advertencia!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				return;
			}

			if (this.deta_formInicioVigencia[i].status === 'INVALID') {
				this.hide_save = false;
				this.hide_load = true;
				this.toastr.warningToastr('Seleccione una Fecha de Inicio de Vigencia, es obligatorio.', 'Advertencia!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				return;
			}

			if (this.deta_formFinVigencia[i].status === 'INVALID') {
				this.hide_save = false;
				this.hide_load = true;
				this.toastr.warningToastr('Seleccione una Fecha de Fin de Vigencia, es obligatorio.', 'Advertencia!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				return;
			}
		}

		let datos = this.prepare_model();
		// console.log('suT:', datos);
		
		this.trabajador_s.SaveUpdateTrabajadores(datos).subscribe(
			(data: any) => {
				console.log(data)
				if (data[0].Ok > 0) {
					this.hide_save = false;
					this.hide_load = true;
					this.toastr.successToastr(data[0].Message, 'Correcto!', {
						toastTimeout: 2000,
						showCloseButton: true,
						animate: 'fade',
						progressBar: true
					});
					this.router.navigate(['Talento/masters/Trabajador']);
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
		);
	}

	prepare_model() {
		const controls = this.formDatosPersonales.controls;
		let datoCertificado = [];
		let datoContrato = [];

		for (let i = 0; i < this.array_certificaciones.length; i++) {
			datoCertificado.push({
				IdCertificacion: this.array_certificaciones[i].IdCertificacion,
				Certificado: this.deta_formClienteExterno[i].value,
				InicioVigencia: this.datePipe.transform(this.deta_formInicioVigencia[i].value, 'yyyy-MM-dd'),
				FinVigencia: this.datePipe.transform(this.deta_formFinVigencia[i].value, 'yyyy-MM-dd'),
				Vigencia: this.array_certificaciones[i].ValorVigente,
				Eliminado: 0,
				Activo: 1
			});
		}

		for (let i = 0; i < this.array_certificaciones_eliminado.length; i++) {
			datoCertificado.push({
				IdCertificacion: this.array_certificaciones_eliminado[i].IdCertificacion,
				Certificado: this.deta_formClienteExterno[i].value,
				InicioVigencia: this.datePipe.transform(this.deta_formInicioVigencia[i].value, 'yyyy-MM-dd'),
				FinVigencia: this.datePipe.transform(this.deta_formFinVigencia[i].value, 'yyyy-MM-dd'),
				Vigencia: this.array_certificaciones_eliminado[i].ValorVigente,
				Eliminado: 1,
				Activo: 0
			});
		}
		if (this.idTrabajador===0){
			for (let i = 0; i < this.array_contratos.length; i++) {
				datoContrato.push(this.array_contratos[i]);
			}
	
			for (let i = 0; i < this.array_contrato_eliminado.length; i++) {
				this.array_contrato_eliminado[i].Eliminado = 1;
				datoContrato.push(this.array_contrato_eliminado[i]);
			}
		}

		return {
			Trabajador: this.idTrabajador,
			Empresa: controls['Empresa'].value,
			Pais: controls['Pais'].value,
			Departamento: controls['Departamento'].value || 0,
			Provincia: controls['Provincia'].value || 0,
			Distrito: controls['Distrito'].value || 0,
			Nombres: controls['Nombres'].value,
			ApellidoPaterno: controls['ApellidoPaterno'].value,
			ApellidoMaterno: controls['ApellidoMaterno'].value,
			Direccion: controls['Direccion'].value,
			Referencias: controls['Referencias'].value,
			TipoDocumento: controls['TipoDocumento'].value,
			DocumentoIdentidad: controls['DocumentoIdentidad'].value,
			FechaNacimiento: this.datePipe.transform(controls['FechaNacimiento'].value, 'yyyy-MM-dd'),//
			Email: controls['Email'].value,
			Telefono: controls['Telefono'].value,
			Celular: controls['Celular'].value,
			CelularReferencial: controls['CelularReferencial'].value,
			Sexo: controls['Sexo'].value,
			RUC: controls['RUC'].value,
			EstadoCivil: controls['EstadoCivil'].value,
			NombreConyugue: controls['NombreConyugue'].value,
			Hijos: controls['Hijos'].value,
			NumeroHijos: controls['NumeroHijos'].value,
			Banco: controls['Banco'].value,
			TipoCuenta: controls['TipoCuenta'].value,
			Moneda: controls['Moneda'].value,
			NumeroCuenta: controls['NumeroCuenta'].value,
			NumeroCCI: controls['NumeroCCI'].value,
			Activo: controls['Activo'].value,
			Certificados: datoCertificado,
			Contratos: datoContrato,
			EmpresasAsignadas: this.array_empresas_trabajador.map(e => {e.activo=(e.activo)?1:0; e.eliminado=(e.activo)?0:1; return e}),
			Zonas: this.array_zonas.filter(e=>e.idTrabajadorZona!=0 || e.activo==1).map(e=>{e.activo=(e.activo)?1:0; e.eliminado=(e.activo)?0:1; return e}),
			UnidadesNegocio: this.array_unidades.filter(e=>e.idTrabajadorUnidadNegocio!=0 || e.activo==1).map(e=>{e.activo=(e.activo)?1:0; e.eliminado=(e.activo)?0:1; return e}),
		}
	}

	horarioTrabajoValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
		const horaInicio = control.get('HoraInicioLabores');
		const horaFin = control.get('HoraFinLabores');
		if(horaInicio && horaFin && horaFin.value < horaInicio.value){
			horaFin.setErrors({ 'invalid': true })
			return { horarioInvalido: true }
		}
		horaFin.setErrors(null)
		return  null;
	}

	valoreData: any = [];
	addContratoTrabajador() {
		const controls = this.formContrato.controls; 
		// console.log(controls)
		// const controlsDatos = this.form.controls;
		// console.log(controlsDatos)
		
		let fechaInicio = controls.FechaInicioContrato.value + 'T00:00:00'; // this.datePipe.transform(controls.FechaInicioContrato.value,'yyyy-MM-dd');
		let fechaFin = controls.FechaFinContrato.value + 'T00:00:00'; // this.datePipe.transform(controls.FechaFinContrato.value,'yyyy-MM-dd');

		let objExpediente = [];
		let objDatos = [];

		if (this.formContrato.invalid) {
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

		if(new Date(fechaFin) <= new Date(fechaInicio)){
			// controls.FechaFinContrato.setValue('');
			this.toastr.warningToastr('La F. Fin Contrato no puede ser menor que la F. Fecha inicio', 'Advertencia!', {
				toastTimeout: 2000,
				showCloseButton: true,
				animate: 'fade',
				progressBar: true
			});
			return;
		}

		let bandAdd = true;
		for (let i = 0; i <= this.metadataExpedientes.length - 1; i++) {
			// if (this.metadataExpedientes[i].Obligatorio && this.metadataExpedientes[i].urlExpediente === null) {
			// 	bandAdd = false;

			// 	this.toastr.warningToastr('Existen expedientes que son obligatorios, por favor adjunte un archivo.', 'Advertencia!', {
			// 		toastTimeout: 2000,
			// 		showCloseButton: true,
			// 		animate: 'fade',
			// 		progressBar: true
			// 	});

			// 	objExpediente = [];
			// 	return;
			// }
			// else {
			objExpediente.push({
				Contrato: this.idContratoEditar,
				ExpedienteContrato: this.metadataExpedientes[i].ExpedienteContrato,
				NombreDocumento: this.metadataExpedientes[i].NombreDocumento,
				IdConfiguracionDocumentoExpediente: this.metadataExpedientes[i].IdConfiguracionDocumentoExpediente,
				Obligatorio: this.metadataExpedientes[i].Obligatorio,
				nombreArchivo: this.metadataExpedientes[i].nombreArchivo,
				ObligatorioValor: this.metadataExpedientes[i].ObligatorioValor,
				urlExpediente: this.metadataExpedientes[i].urlExpediente,
				Eliminado: 0,
				ValorDocumento: this.metadataExpedientes[i].ValorDocumento,
				Estado: this.deta_formEstadoExpediente[i].value
			});
			//}
		}

		// if (this.form.invalid) {
		// 	Object.keys(controlsDatos).forEach(controlName =>
		// 		controlsDatos[controlName].markAsTouched()
		// 	);
		// 	this.activeTabIdContrato = 1;
		// 	this.toastr.warningToastr('Ingrese los campos obligatorios en los datos del contrato.', 'Advertencia!', {
		// 		toastTimeout: 2000,
		// 		showCloseButton: true,
		// 		animate: 'fade',
		// 		progressBar: true
		// 	});
		// 	return;
		// }

		let fechaActual = new Date();
		let fechaActualValor = fechaActual.getFullYear() + "-" + ((fechaActual.getMonth() + 1) < 10 ? '0' + (fechaActual.getMonth() + 1) : (fechaActual.getMonth() + 1)) + "-" + (fechaActual.getDate() < 10 ? '0' + fechaActual.getDate() : fechaActual.getDate()) + 'T00:00:00';
		let vigencia = ''
		if (new Date(fechaActualValor) <= new Date(fechaFin)) {
			vigencia = 'SI';
		}
		else {
			vigencia = 'NO';
		}

		let resultModalidad = this.array_modalidad.find(item => item.Valor === controls.Modalidad.value).Nombre;
		// console.log(resultModalidad);
		const dataEspecifica = Object.assign({}, this.dataEspecifica);
		this.valoreData = Object.values(this.data)
		for (let i = 0; i <= this.valoreData.length - 1; i++) {
			objDatos.push({
				Contrato: this.idContratoEditar,
				ConfigDatoContrato: this.valoreData[i].ConfigDatoContrato,
				DatoContrato: this.valoreData[i].DatoContrato,
				IdConfigDatoContrato: this.valoreData[i].IdConfigDatoContrato,
				TipoDatoRespuesta: this.valoreData[i].TipoDatoRespuesta,
				value: this.valoreData[i].value,
				NombreDato: this.valoreData[i].NombreDato
			});
		}

		let resultContrato = objExpediente.find(item => item.ValorDocumento === '0002');

		console.log('idTrabajador', this.idTrabajador, this.idTrabajador!==0);
		if(this.idTrabajador !==0){
			let tempData = {
				Trabajador: this.idTrabajador,
				Contrato: this.idContratoEditar,
				Modalidad: controls.Modalidad.value,
				DesModalidad: this.array_modalidad.find(item => item.Valor === controls.Modalidad.value).Nombre,
				PuestoTrabajo: controls.PuestoTrabajo.value,
				DesPuestoTrabajo: this.array_puestos.find(item => item.PuestoTrabajo === controls.PuestoTrabajo.value).NombrePuestoTrabajo,
				Esquema: controls.Esquema.value,
				// DesEsquema: this.array_esquema_comision.find(item => item.EsquemaComision === controls.Esquema.value).NombreComision,
				FondoPensionario: controls.FondoPensionario.value === null || controls.FondoPensionario.value === 0 ? '' : controls.FondoPensionario.value,
				// DesFondoPensionario: controls.FondoPensionario.value === null ? null : this.array_fondo_pension.find(item => item.FondoPension === controls.FondoPensionario.value).DescFondoPension,
				FechaInicioContrato: controls.FechaInicioContrato.value,
				FechaFinPeriodo: controls.FechaFinPeriodo.value,
				FechaFinContrato: controls.FechaFinContrato.value,
				HoraInicioLabores: controls.HoraInicioLabores.value,
				HoraFinLabores: controls.HoraFinLabores.value,
				DuracionContrato: controls.DuracionContrato.value,
				Provincia: controls.Provincia.value,
				DescProvincia: this.array_provincia_contrato.find(item => item.Provincia === controls.Provincia.value).NombreProvincia,
				Sueldo: controls.Sueldo.value === null ? 0 : controls.Sueldo.value,
				Motivo: controls.Motivo.value === null || controls.Motivo.value === 0 ? '' : controls.Motivo.value,
				Descripcion: controls.Descripcion.value,
				Vigencia: vigencia,
				Activo: 1,
				Eliminado: 0,
				Datos: objDatos,
				UrlArchivo: (resultContrato) ? resultContrato.UrlArchivo : null,
				NombreArchivo: (resultContrato) ? resultContrato.NombreArchivo : null,
				Expedientes: objExpediente
			}
			console.log(tempData);

			this.trabajador_s.SaveUpdateContrato(tempData).subscribe(
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
						this.contrato(controls,data[0].Contrato,vigencia,objExpediente,objDatos,resultContrato)

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
					// this.array_contratos.pop();

				}
			);
		}else{
			this.contrato(controls,this.posContratoEditar,vigencia,objExpediente,objDatos,resultContrato)
		}
	}

	contrato(controls,idContrato,vigencia,objExpediente,objDatos,resultContrato){
		if (this.posContratoEditar !== null) {
			this.array_contratos[this.posContratoEditar] = {
				Contrato: idContrato,
				Modalidad: controls.Modalidad.value,
				DesModalidad: this.array_modalidad.find(item => item.Valor === controls.Modalidad.value).Nombre,
				PuestoTrabajo: controls.PuestoTrabajo.value,
				DesPuestoTrabajo: this.array_puestos.find(item => item.PuestoTrabajo === controls.PuestoTrabajo.value).NombrePuestoTrabajo,
				Esquema: controls.Esquema.value,
				// DesEsquema: this.array_esquema_comision.find(item => item.EsquemaComision === controls.Esquema.value).NombreComision,
				FondoPensionario: controls.FondoPensionario.value,
				// DesFondoPensionario: controls.FondoPensionario.value === null ? null : this.array_fondo_pension.find(item => item.FondoPension === controls.FondoPensionario.value).DescFondoPension,
				FechaInicioContrato: controls.FechaInicioContrato.value,
				FechaFinPeriodo: controls.FechaFinPeriodo.value,
				FechaFinContrato: controls.FechaFinContrato.value,
				HoraInicioLabores: controls.HoraInicioLabores.value,
				HoraFinLabores: controls.HoraFinLabores.value,
				DuracionContrato: controls.DuracionContrato.value,
				Provincia: controls.Provincia.value,
				DescProvincia: this.array_provincia_contrato.find(item => item.Provincia === controls.Provincia.value).NombreProvincia,
				Sueldo: controls.Sueldo.value === null ? 0 : controls.Sueldo.value,
				Motivo: controls.Motivo.value,
				Descripcion: controls.Descripcion.value,
				Vigencia: vigencia,
				Activo: 1,
				Eliminado: 0,
				Datos: objDatos,
				UrlFirma:this.urlFirma,
				UrlArchivo: (resultContrato) ? resultContrato.UrlArchivo : null,
				NombreArchivo: (resultContrato) ? resultContrato.NombreArchivo : null,
				Expedientes: objExpediente
			}
		}
		else {
			this.array_contratos.push({
				Contrato: idContrato,//this.idContratoEditar 
				Modalidad: controls.Modalidad.value,
				DesModalidad: this.array_modalidad.find(item => item.Valor === controls.Modalidad.value).Nombre,
				PuestoTrabajo: controls.PuestoTrabajo.value,
				DesPuestoTrabajo: this.array_puestos.find(item => item.PuestoTrabajo === controls.PuestoTrabajo.value).NombrePuestoTrabajo,
				Esquema: controls.Esquema.value,
				// DesEsquema: this.array_esquema_comision.find(item => item.EsquemaComision === controls.Esquema.value).NombreComision,
				FondoPensionario: controls.FondoPensionario.value,
				// DesFondoPensionario: controls.FondoPensionario.value === null ? null : this.array_fondo_pension.find(item => item.FondoPension === controls.FondoPensionario.value).DescFondoPension,
				FechaInicioContrato: controls.FechaInicioContrato.value,
				FechaFinPeriodo: controls.FechaFinPeriodo.value,
				FechaFinContrato: controls.FechaFinContrato.value,
				HoraInicioLabores: controls.HoraInicioLabores.value,
				HoraFinLabores: controls.HoraFinLabores.value,
				DuracionContrato: controls.DuracionContrato.value,
				Provincia: controls.Provincia.value,
				DescProvincia: this.array_provincia_contrato.find(item => item.Provincia === controls.Provincia.value).NombreProvincia,
				Sueldo: controls.Sueldo.value === null ? 0 : controls.Sueldo.value,
				Motivo: controls.Motivo.value,
				Descripcion: controls.Descripcion.value,
				Vigencia: vigencia,
				Eliminado: 0,
				Activo: 1,
				Datos: objDatos,
				UrlFirma:this.urlFirma,

				UrlArchivo: (resultContrato) ? resultContrato.UrlArchivo : null,
				NombreArchivo: (resultContrato) ? resultContrato.NombreArchivo : null,
				Expedientes: objExpediente
			});
		}
		console.log(this.array_contratos)

		this.load_data = true;
		this.searchBan = false;
		if (this.array_contratos.length > 0) {
			this.no_data = true;
		} else {
			this.no_data = false;
		}
		this.listData.data = this.array_contratos;
		

		this.form.reset();
		this.idContratoEditar = 0;
		this.arrayData = [];
		this.metadataExpedientes = [];
		this.metadataEspecifica = [];
		this.deta_formEstadoExpediente = [];
		this.deta_formFileExpediente = [];
		this.metadata = [];
		this.isNewContrato = false;
		this.data = [];
		this.posContratoEditar = null;
		this.formContrato.reset();

	}

	descargarFormatoContrato(lesson, nombre, url) {
		console.log(lesson)
		let datos = this.getJsonDescargarContrato(lesson);
		console.log('descargar contrato: ',datos);
		console.log(datos)
		this.trabajador_s.GetDescargarContrato(datos).subscribe(
			(data: any) => {
				console.log(data);
				this.trabajador_s.descargarBase64(data.base64, data.name);
			}, (errorServicio) => {

				this.toastr.errorToastr('Ocurrio un error.', 'Error!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				console.log(errorServicio);
			}
		);

		// if (url !== null) {
		// 	this.httpClient.get(url, { responseType: 'blob' })
		// 		.subscribe(response => {
		// 			FileSaver.saveAs(response, nombre);
		// 		}, error => {
		// 			this.toastr.errorToastr('Se produjo un error al descargar archivo.', 'Error!', {
		// 				toastTimeout: 4000,
		// 				showCloseButton: true,
		// 				animate: 'fade',
		// 				progressBar: true
		// 			});
		// 		});
		// }
	}

	getJsonDescargarContrato(item) {
		console.log(item)
		const _controls = this.formDatosPersonales.controls;

		var fechaInicio = new Date(this.datePipe.transform(item.FechaInicioContrato, 'yyyy-MM-dd')).getTime();
		var fechaFin = new Date(this.datePipe.transform(item.FechaFinContrato, 'yyyy-MM-dd')).getTime();		
		var diff = fechaFin - fechaInicio;
		var dias = diff/(1000*60*60*24);
		
		let fechaNacimiento = new Date(_controls.FechaNacimiento.value)
		let edad = Math.floor((new Date().getTime() - fechaNacimiento.getTime())/(1000*60*60*24*365));
		//let resultModalidad = this.array_modalidad.find(item => item.Valor === controls.Modalidad.value).Nombre;
		return {
			"NombreCompleto": _controls.Nombres.value + " " + _controls.ApellidoPaterno.value + " " + _controls.ApellidoMaterno.value,
			"DocumentoIdentidad": _controls.DocumentoIdentidad.value,
			"RUC":_controls.RUC.value,
			"Edad":edad,
			"Banco": (_controls.Banco.value === null || _controls.Banco.value === undefined) ? "": this.array_banco.find(item => item.Banco === _controls.Banco.value).NombreBanco,
			// "Beneficiario": 1,
			"Empresa": this.array_empresas.find(item => item.idEmpresa === _controls.Empresa.value).razonSocial,
			"NroCuenta": _controls.NumeroCuenta.value,
			"CCI": _controls.NumeroCCI.value,
			"Direccion": _controls.Direccion.value,
			"Email": _controls.Email.value,
			"PuestoTrabajo": item.DesPuestoTrabajo,
			"DuracionContrato": item.DuracionContrato + (item.DuracionContrato > 0 ? " meses." : "mes."),
			"FechaInicioContrato": this.datePipe.transform(item.FechaInicioContrato, 'dd/MM/yyyy'),
			"FechaFinContrato": this.datePipe.transform(item.FechaFinContrato, 'dd/MM/yyyy'),
			"FechaFinPeriodoPrueba": this.datePipe.transform(item.FechaFinPeriodo, 'dd/MM/yyyy'),
			// "HoraInicioLabores": this.datePipe.transform( new Date(`2020-03-13T${item.HoraInicioLabores}`), 'h:mm a'),
			"HoraInicioLabores": (item.HoraInicioLabores!==null)?item.HoraInicioLabores.slice(0,-3):'-',
			"HoraFinLabores": (item.HoraFinLabores!==null)?item.HoraFinLabores.slice(0,-3):'-',
			"Sueldo": item.Sueldo,
			"Modalidad": item.Modalidad,
			"DescProvincia": item.DescProvincia,
			"UrlFirma": item.UrlFirma
		}
	}
	
	statusChkHandler({target}, item){
		// console.log(target, " @ ", item);
		// console.log(target.checked);

		item.activo = (target.checked)?1:0
		// console.log("Zonas: ", this.array_zonas)
		// console.log("Unidades: ", this.array_unidades)
	}

	filtrarElementos(item){
		if(item.activo){
			this.empresasActivas.add(item.idEmpresa);
		}else{
			this.empresasActivas.delete(item.idEmpresa);
			this.array_zonas.forEach(e=>{if(e.idEmpresa==item.idEmpresa){e.activo=false}});
			this.array_unidades.forEach(e=>{if(e.idEmpresa==item.idEmpresa){e.activo=false}});
		}
	}

	calculoPeriodoPrueba(inicioFecha){
		console.log(inicioFecha);
		let fechas = inicioFecha.split('-').map(e=>parseInt(e));
		this.formContrato.controls.FechaFinPeriodo.setValue(new Date(fechas[0], fechas[1], fechas[2]).toLocaleDateString('en-CA'))
	}

	formHasError(formulario: FormGroup, error: string){
		return formulario.errors?.[error] && (formulario.touched || formulario.dirty)
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

	isControlValidContrato(controlName: string): boolean {
		const control = this.formContrato.controls[controlName];
		return control.valid && (control.dirty || control.touched);
	}

	isControlInvalidContrato(controlName: string): boolean {
		const control = this.formContrato.controls[controlName];
		return control.invalid && (control.dirty || control.touched);
	}

	controlHasErrorContrato(validation, controlName): boolean {
		const control = this.formContrato.controls[controlName];
		return control.hasError(validation) && (control.dirty || control.touched);
	}

	isControlTouchedContrato(controlName): boolean {
		const control = this.formContrato.controls[controlName];
		return control.dirty || control.touched;
	}

	array_certificaciones_eliminado: any = [];
	deleteCertificado(item) {

		let index = this.array_certificaciones.indexOf(item);

		if (item.IdCertificacion > 0) {
			this.array_certificaciones_eliminado.push(item);
		}

		this.array_certificaciones.splice(index, 1);
		this.deta_formInicioVigencia.splice(index, 1);
		this.deta_formFinVigencia.splice(index, 1);

		console.log(this.array_certificaciones);
		this.chgRef.markForCheck();
	}

	calculoVigente(event, pos) {
		let fechaActual = new Date();
		let fecha = new Date(event);
		fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());
		if (fecha >= fechaActual) {
			console.log('vigente');
			this.array_certificaciones[pos].Vigente = 'SI';
			this.array_certificaciones[pos].ValorVigente = '1';
		} else {
			this.array_certificaciones[pos].Vigente = 'NO';
			this.array_certificaciones[pos].ValorVigente = '0';
		}

	}

	isRequired(control) {
		return control.Obligatorio;
	}

	isInvalidForm() {
		return this.form.invalid;
	}

	detectErrors() {
		Object.keys(this.form.controls).forEach(controlName =>
			this.form.controls[controlName].markAsTouched());
	}

	isControlValidDato(controlName: string): boolean {
		const control = this.form.controls[controlName];
		return control.valid && (control.dirty || control.touched);
	}

	isControlInvalidDato(controlName: string): boolean {
		const control = this.form.controls[controlName];
		return control.invalid && (control.dirty || control.touched);
	}

	controlHasErrorDato(validation, controlName): boolean {
		const control = this.form.controls[controlName];
		return control.hasError(validation) && (control.dirty || control.touched);
	}

	arrayArchivos: any = [];
	descargarArchivosMasivo() {
		this.arrayArchivos = [];
		this.array_contratos.forEach(item => {

			let arrExpedientes = item.Expedientes;
			arrExpedientes.forEach(item2 => {
				console.log(item2.urlExpediente);
				if (item2.urlExpediente !== null) {
					this.arrayArchivos.unshift({
						'NombreArchivo': item2.nombreArchivo,
						'RutaArchivo': item2.urlExpediente
					});
				}
			})

		});

		if (this.arrayArchivos.length > 0) {
			this.recursivoDescargarTodosArchivos(0);
		}
		else {
			this.toastr.warningToastr('No existen archivos para descargar.', 'Advertencia!', {
				toastTimeout: 5000,
				showCloseButton: true,
				animate: 'fade',
				progressBar: true
			});
		}
	}

	recursivoDescargarTodosArchivos(i) {
		console.log('sdfasdfd');
		if (i <= this.arrayArchivos.length - 1) {
			let item = this.arrayArchivos[i];
			console.log(item.RutaArchivo);
			this.httpClient.get(item.RutaArchivo, { responseType: 'blob' }).subscribe(
				async response => {

					var blob = response.slice(0, response.size, response.type);
					var fileFireBase: any = null;
					fileFireBase = new File([blob], item.NombreArchivo, { type: response.type });
					console.log(fileFireBase);


					this.trabajador_s.ObtenerBase64String([fileFireBase], item.NombreArchivo).subscribe(
						(data: any) => {
							if (data.base64) {
								this.zip_masivo.file(item.NombreArchivo, data.base64, { base64: true });
								this.recursivoDescargarTodosArchivos(i + 1);
							}
							else {
								this.recursivoDescargarTodosArchivos(i + 1);
							}
						},
						(errorServicio) => {
							console.log(errorServicio);
						}
					);
				},
				error => {
					this.toastr.errorToastr('Se produjo un error al descargar archivo.', 'Error!', {
						toastTimeout: 4000,
						showCloseButton: true,
						animate: 'fade',
						progressBar: true
					});
				}
			);
		}
		else {
			let _BLOB = this.zip_masivo.generateAsync({ type: 'blob' });
			this.download_blobFile(_BLOB, this.data.NroComprobante + '.zip');
			this.zip_masivo = new JSZip();
		}
	}

	download_blobFile(file, file_name) {
		const nav = (window.navigator as any);
		if (nav.msSaveOrOpenBlob) // IE10+
			nav.msSaveOrOpenBlob(file, file_name);
		else { // resto de motores
			let a = document.createElement("a"),
				url = URL.createObjectURL(file);
			a.href = url;
			a.download = file_name;
			document.body.appendChild(a);
			a.click();
			setTimeout(function () {
				document.body.removeChild(a);
				window.URL.revokeObjectURL(url);
			}, 0);
		}
	}
}
