import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as Excel from 'exceljs/dist/exceljs';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Subscription } from 'rxjs';
import { EmpresaService } from 'src/app/pages/Security/_core/services/empresa.service';
import { CertificadosService } from 'src/app/pages/Talento/_core/services/certificados.service';
import { TrabajadorService } from 'src/app/pages/Talento/_core/services/trabajador.service';
import { MultitablaService } from 'src/app/pages/_core/services/multitabla.service';
import { PermissionViewActionService } from 'src/app/Shared/services/permission-view-action.service';
import { StorageService } from 'src/app/Shared/services/storage.service';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import * as XLSX from 'ts-xlsx';
import { RutasService } from '../../_core/rutas.service';
import { VisitaComercialService } from '../../_core/visita-comercial.service';
import { VerEvidenciaComponent } from './ver-evidencia/ver-evidencia.component';
import { VerMapaComponent } from './ver-mapa/ver-mapa.component';
@Component({
  selector: 'app-seguimiento-visita-comercial',
  templateUrl: './seguimiento-visita-comercial.component.html',
  styleUrls: ['./seguimiento-visita-comercial.component.scss'],
  providers: [DatePipe,
	{ provide: NgbDateAdapter, useClass: CustomAdapter },
	{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
]
})
export class SeguimientoVisitaComercialComponent implements OnInit {

  load_data: boolean = true;
	no_data: boolean = false;
	searchBan: boolean = false;
	filterGroup: FormGroup;
	searchGroup: FormGroup;
	listData: MatTableDataSource<any>;
	totalInicial: any = 0;
	totalActual: any = 0;
	displayedColumns: string[] = ['Nro', 'actions', 'Estado','Codigo', 'Fecha','HoraInicio','HoraFin','Trabajador','RazonSocial','NombreComercial','Sucursal','Motivo','Transporte','CondicionCliente', 'ResultadoVisita','Observacion'];

	@ViewChild(MatSort) MatSort: MatSort;

	private subscriptions: Subscription[] = [];
	validViewAction = this.pvas.validViewAction;
	viewsActions: Array<any> = [];
	array_dataList: any;
	arrayBuffer: any;
	fileDocumento: any = null;
	blobType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
	cols = ['CODIGO','FECHA','HORA INICIO','HORA FIN', 'TRABAJADOR','RAZON SOCIAL','NOMBRE COMERCIAL','SUCURSAL','MOTIVO','TRANSPORTE','CONDICION CLIENTE', 'RESULTADO VISITA','OBSERVACION','ESTADO'];
	sName: string; excelFileName: string;
	dataFiltros: any;


	array_clientes: any;
	array_trabajadores: any;
	array_estadoVisita: any;
	array_motivoVisita: any;
	array_transporte: any;
	array_condicionCliente: any;
	array_resultadoVisita:any;
	constructor(
		private cd: ChangeDetectorRef,
		private fb: FormBuilder,
		private modalService: NgbModal,
		public multitabla_s: MultitablaService,
		public certificado_s: CertificadosService,
		public ruta_s:RutasService,
		public empresa_s: EmpresaService,
		public visitaComercial_s: VisitaComercialService,
		public storage_s: StorageService,
		public pvas: PermissionViewActionService,
		public toastr: ToastrManager,
		private router: Router,
		private datePipe: DatePipe,
		public trabajador_s: TrabajadorService, 
	) { }

	ngOnInit(): void {
		this.listData = new MatTableDataSource([]);
		this.viewsActions = this.pvas.get();
		console.log('entro a seguimiento');

		this.filterForm();
		this.searchForm();
		this.getListarClientes();
		this.getListarTrabajadores();
		this.getListarEstadoVisitaComercial();
		this.getListarCondicionCliente();
		this.getListarTransporteVisitaComercial();
		this.getListarMotivoVisitaComercial();
		this.getListarResultadoVisitaComercial();
		this.getSeguimientoVisitasComercialList();
	}

	ngOnDestroy(): void {
		console.log('destruyendo componente');
		this.subscriptions.forEach((sb) => sb.unsubscribe());
	}
	getListarClientes(){
		this.ruta_s.GetListarClientes().subscribe(
			(data: any) => {
				this.array_clientes = data;
				
				if (this.array_clientes.length > 1) {
					this.array_clientes.unshift({
						idCliente: 0, razonSocial: 'Todos'
					});
				}
				if (!this.dataFiltros) {
					this.filterGroup.controls.Cliente.setValue(this.array_clientes[0].idCliente)
				} else {
					this.filterGroup.controls.Cliente.setValue(this.filterGroup.controls.Cliente.value)
				}
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}
	getListarTrabajadores(){
		this.trabajador_s.GetTrabajadoresList(0,0,0,1).subscribe(
			(data:any)=>{
				this.array_trabajadores = data;
				
				if (this.array_trabajadores.length > 1) {
					this.array_trabajadores.unshift({
						idTrabajador: 0, NombresApellidos: 'Todos'
					});
				}
				if (!this.dataFiltros) {
					this.filterGroup.controls.Trabajador.setValue(this.array_trabajadores[0].idTrabajador)
				} else {
					this.filterGroup.controls.Trabajador.setValue(this.filterGroup.controls.Trabajador.value)
				}
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}
	getListarResultadoVisitaComercial(){
		this.visitaComercial_s.GetResultadoVisitaComercial().subscribe(
			(data: any) => {
				this.array_resultadoVisita = data;
				
				if (this.array_resultadoVisita.length > 1) {
					this.array_resultadoVisita.unshift({
						valor: '0000', nombre: 'Todos'
					});
				}
				if (!this.dataFiltros) {
					this.filterGroup.controls.ResultadoVisita.setValue(this.array_resultadoVisita[0].valor)
				} else {
					this.filterGroup.controls.ResultadoVisita.setValue(this.filterGroup.controls.ResultadoVisita.value)
				}
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}
	getListarEstadoVisitaComercial(){
		this.visitaComercial_s.GetEstadoVisitaComercial().subscribe(
			(data: any) => {
				this.array_estadoVisita = data;
				
				if (this.array_estadoVisita.length > 1) {
					this.array_estadoVisita.unshift({
						valor: '0000', nombre: 'Todos'
					});
				}
				if (!this.dataFiltros) {
					this.filterGroup.controls.EstadoVisita.setValue(this.array_estadoVisita[0].valor)
				} else {
					this.filterGroup.controls.EstadoVisita.setValue(this.filterGroup.controls.EstadoVisita.value)
				}
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
		
	}
	getListarCondicionCliente(){
		this.visitaComercial_s.GetCondicionCliente().subscribe(
			(data: any) => {
				this.array_condicionCliente = data;
				
				if (this.array_condicionCliente.length > 1) {
					this.array_condicionCliente.unshift({
						valor: '0000', nombre: 'Todos'
					});
				}
				if (!this.dataFiltros) {
					this.filterGroup.controls.CondicionCliente.setValue(this.array_condicionCliente[0].valor)
				} else {
					this.filterGroup.controls.CondicionCliente.setValue(this.filterGroup.controls.CondicionCliente.value)
				}
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
		
	}
	getEvidenciaVisitaComercial(item){
		const modalRef = this.modalService.open(VerEvidenciaComponent, { size: 'lg' });
		modalRef.componentInstance.item = item.idVisitaComercial;
		modalRef.componentInstance.cabecera = {trabajador : item.NombresApellidos,cliente : item.razonSocial,codigo : item.codigo};
		modalRef.result.then((result) => {
		}, (reason) => {
		console.log(reason);
		});
	}
	getMapaVisitaComercial(item){
		const modalRef = this.modalService.open(VerMapaComponent, { size: 'lg' });
		modalRef.componentInstance.cabecera = {trabajador : item.NombresApellidos,cliente : item.razonSocial,codigo : item.codigo,direccionDestino: item.direccionDestino,direccionOrigen : item.direccionOrigen,direccionSucursal:item.direccionSucursal,latitudSucursal:item.latitudSucursal,longitudSucursal:item.longitudSucursal};
		if(item.latitudOrigen !=null && item.longitudOrigen!=null && item.fechaHoraInicio!=null)
			modalRef.componentInstance.origen = {lat: item.latitudOrigen, lng: item.longitudOrigen,label:item.fechaHoraInicio};
		else
			modalRef.componentInstance.origen = null
		if(item.latitudDestino !=null && item.longitudDestino!=null && item.fechaHoraFin!=null)
			modalRef.componentInstance.destino = {lat: item.latitudDestino, lng: item.longitudDestino,label:item.fechaHoraFin};
		else
			modalRef.componentInstance.destino = null;
		modalRef.result.then((result) => {
		}, (reason) => {
		console.log(reason);
		});
	}
	getListarTransporteVisitaComercial(){
		this.visitaComercial_s.GetTransporteVisitaComercial().subscribe(
			(data: any) => {
				this.array_transporte = data;
				
				if (this.array_transporte.length > 1) {
					this.array_transporte.unshift({
						valor: '0000', nombre: 'Todos'
					});
				}
				if (!this.dataFiltros) {
					this.filterGroup.controls.Transporte.setValue(this.array_transporte[0].valor)
				} else {
					this.filterGroup.controls.Transporte.setValue(this.filterGroup.controls.Transporte.value)
				}
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}
	getListarMotivoVisitaComercial(){
		this.visitaComercial_s.GetMotivoVisitaComercial().subscribe(
			(data: any) => {
				this.array_motivoVisita = data;
				
				if (this.array_motivoVisita.length > 1) {
					this.array_motivoVisita.unshift({
						valor: '0000', nombre: 'Todos'
					});
				}
				if (!this.dataFiltros) {
					this.filterGroup.controls.MotivoVisita.setValue(this.array_motivoVisita[0].valor)
				} else {
					this.filterGroup.controls.MotivoVisita.setValue(this.filterGroup.controls.MotivoVisita.value)
				}
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}
	filterForm() {
		this.dataFiltros = this.storage_s.getJson('filtrosVisita');
		this.filterGroup = this.fb.group({
			Cliente: [0, Validators.compose([Validators.required])],
			Trabajador: [0, Validators.compose([Validators.required])],
			EstadoVisita: ['0000', Validators.compose([Validators.required])],
			MotivoVisita: ['0000', Validators.compose([Validators.required])],
			Transporte: ['0000', Validators.compose([Validators.required])],
			CondicionCliente: ['0000', Validators.compose([Validators.required])],
			ResultadoVisita: ['0000', Validators.compose([Validators.required])],
			FechaInicio: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), Validators.compose([Validators.required])],
			FechaFin: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), Validators.compose([Validators.required])],
		});
		if (this.dataFiltros) {
			this.filterGroup.controls.Cliente.setValue(this.dataFiltros.Cliente)
			this.filterGroup.controls.Trabajador.setValue(this.dataFiltros.Trabajador)
			this.filterGroup.controls.EstadoVisita.setValue(this.dataFiltros.EstadoVisita)
			this.filterGroup.controls.MotivoVisita.setValue(this.dataFiltros.MotivoVisita)
			this.filterGroup.controls.Transporte.setValue(this.dataFiltros.Transporte)
			this.filterGroup.controls.CondicionCliente.setValue(this.dataFiltros.CondicionCliente)
			this.filterGroup.controls.ResultadoVisita.setValue(this.dataFiltros.ResultadoVisita)
			this.filterGroup.controls.FechaInicio.setValue(this.dataFiltros.FechaInicio)
			this.filterGroup.controls.FechaFin.setValue(this.dataFiltros.FechaFin)
		}
	}

	searchForm() {
		this.searchGroup = this.fb.group({
			searchTerm: [''],
		});
	}

	search() {
		if (this.searchGroup.controls.searchTerm.value == null) {
			this.searchGroup.controls.searchTerm.setValue('');
		}
		this.listData.filter = this.searchGroup.controls.searchTerm.value.trim().toLowerCase();

		console.log('search: ', this.listData.filter);
	}


	getSeguimientoVisitasComercialList() {
		this.searchBan = false;
		this.load_data = false;
		this.no_data = true;
		this.totalActual = 0;
		this.storage_s.setJson('filtrosVisita', {
			Cliente: this.filterGroup.controls.Cliente.value,
			Trabajador: this.filterGroup.controls.Trabajador.value,
			EstadoVisita: this.filterGroup.controls.EstadoVisita.value,
			MotivoVisita: this.filterGroup.controls.MotivoVisita.value,
			Transporte: this.filterGroup.controls.Transporte.value,
			CondicionCliente: this.filterGroup.controls.CondicionCliente.value,
			ResultadoVisita:this.filterGroup.controls.ResultadoVisita.value,
			FechaInicio: this.filterGroup.controls.FechaInicio.value,
			FechaFin: this.filterGroup.controls.FechaFin.value,
		});

		this.visitaComercial_s.GetSeguimientoVisitaComercialList(
			this.filterGroup.controls.Cliente.value,
			this.filterGroup.controls.Trabajador.value,
			this.filterGroup.controls.EstadoVisita.value,
			this.filterGroup.controls.MotivoVisita.value,
			this.filterGroup.controls.Transporte.value,
			this.filterGroup.controls.CondicionCliente.value,
			this.filterGroup.controls.ResultadoVisita.value,
			this.filterGroup.controls.FechaInicio.value,
			this.filterGroup.controls.FechaFin.value).subscribe(
			(data: any) => {
				this.cd.markForCheck();
				this.visitaComercial_s.actualizarFiltros({
					Cliente: this.filterGroup.controls.Cliente.value,
					Trabajador: this.filterGroup.controls.Trabajador.value,
					EstadoVisita: this.filterGroup.controls.EstadoVisita.value,
					MotivoVisita: this.filterGroup.controls.MotivoVisita.value,
					Transporte: this.filterGroup.controls.Transporte.value,
					CondicionCliente: this.filterGroup.controls.CondicionCliente.value,
					ResultadoVisita: this.filterGroup.controls.ResultadoVisita.value,
					FechaInicio: this.filterGroup.controls.FechaInicio.value,
					FechaFin: this.filterGroup.controls.FechaFin.value,
					DataLength: data.length,
				});
				console.log(data);
				this.load_data = true;
				this.searchBan = false;
				this.totalInicial = data.length;
				this.listData = new MatTableDataSource(data);

				this.listData.filter = this.searchGroup.controls.searchTerm.value.trim().toLowerCase();
				if (data.length > 0) {
					this.no_data = true;
				} else {
					this.no_data = false;
				}
				this.listData.sort = this.MatSort;

				this.subscriptions.push(this.visitaComercial_s.updateTableVentas$.subscribe(
					(data) => {
						this.proccessDataTableVentas(data);
					}
				))
     
			}, (errorServicio) => {
				this.load_data = true;
				this.no_data = false;
				this.searchBan = false;
			}
		);

	}

	proccessDataTableVentas(data) {
		this.cd.markForCheck();
		this.load_data = true;
		this.searchBan = false;
		this.listData = new MatTableDataSource(data);
		this.listData.filter = this.searchGroup.controls.searchTerm.value.trim().toLowerCase()
		if (data.length > 0) {
			this.no_data = true;
		} else {
			this.no_data = false;
		}
		this.listData.sort = this.MatSort;
		this.cd.markForCheck();
	}

	descargarReporte() {
		this.visitaComercial_s.GetSeguimientoVisitaComercialReporte(this.filterGroup.controls.Cliente.value,
			this.filterGroup.controls.Trabajador.value,
			this.filterGroup.controls.EstadoVisita.value,
			this.filterGroup.controls.MotivoVisita.value,
			this.filterGroup.controls.Transporte.value,
			this.filterGroup.controls.CondicionCliente.value,
			this.filterGroup.controls.ResultadoVisita.value,
			this.filterGroup.controls.FechaInicio.value,
			this.filterGroup.controls.FechaFin.value).subscribe(
			(data: any) => {
				console.log(data);
				this.array_dataList = data;
				this.exportarDatos();
				this.cd.markForCheck();
			}, (errorServicio) => {
				this.load_data = true;
				this.no_data = false;
				this.searchBan = false;
			}
		);
	}

	
	
	isControlValid(controlName: string): boolean {
		const control = this.filterGroup.controls[controlName];
		return control.valid && (control.dirty || control.touched);
	}

	isControlInvalid(controlName: string): boolean {
		const control = this.filterGroup.controls[controlName];
		return control.invalid && (control.dirty || control.touched);
	}

	controlHasError(validation, controlName): boolean {
		const control = this.filterGroup.controls[controlName];
		return control.hasError(validation) && (control.dirty || control.touched);
	}

	isControlTouched(controlName): boolean {
		const control = this.filterGroup.controls[controlName];
		return control.dirty || control.touched;
	}


	

	numeroAFecha(numeroDeDias, esExcel = false) {
		let diasDesde1900 = esExcel ? 25567 + 2 : 25567;
		// 86400 es el número de segundos en un día, luego multiplicamos por 1000 para obtener milisegundos.
		return new Date((numeroDeDias - diasDesde1900) * 86400 * 1000);
	}

	numeroASoloFecha(numeroDeDias, esExcel = false) {
		let diasDesde1900 = esExcel ? 25567 + 1 : 25567;
		// 86400 es el número de segundos en un día, luego multiplicamos por 1000 para obtener milisegundos.
		return new Date((numeroDeDias - diasDesde1900) * 86400 * 1000);
	}

	formatoFecha(texto) {
		if (texto) {
			if (texto !== '') {				
				texto = texto.substring(0, 10);
				
				let strValores = texto.split('/');
				if(strValores.length == 3){
					return strValores[2] + '-' + strValores[1] + '-' + strValores[0];	
				}
				else{
					return "";
				}
			} 
			else {
				return null;
			}
		} else {
			return null;
		}




	}

	exportarDatos() {
		if (this.array_dataList.length > 0) {
			this.sName = 'Reporte de Visitas Comerciales';
			this.excelFileName = `${this.sName}.xlsx`;
			const workbook = new Excel.Workbook();
			workbook.creator = 'Web';
			workbook.lastModifiedBy = 'Web';
			workbook.created = new Date();
			workbook.modified = new Date();
			workbook.addWorksheet(this.sName, { views: [{ ySplit: 0, xSplit: 20, activeCell: 'A1', showGridLines: true }] });
			const sheet = workbook.getWorksheet(1);
			sheet.getColumn(1).width = 30;
			sheet.getRow(1).values = this.cols;

			sheet.columns = [
				{ key: 'codigo', width: 20 },
				{ key: 'fecha', width: 20 },
				{ key: 'fechaHoraInicio', width: 20 },
				{ key: 'fechaHoraFin', width: 20 },
				{ key: 'trabajador', width: 20 },
				{ key: 'razonSocial', width: 40 },
				{ key: 'nombreComercial', width: 40 },
				{ key: 'sucursal', width: 30 },
				{ key: 'motivo', width: 25 },
				{ key: 'transporte', width: 50 },				
				{ key: 'condicionCliente', width: 40 },
				{ key: 'resultado', width: 40 },
				{ key: 'observaciones', width: 50 },
				{ key: 'estado', width: 40 },
			];

			['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1', 'K1', 'L1','M1','N1'].map(key => {
				sheet.getCell(key).fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'eaeaea' }
				};
			});

			console.log('dataReporte', this.array_dataList);


			this.array_dataList.forEach(item => {
				sheet.addRow({
					codigo:item.codigo,
					fecha:this.datePipe.transform(item.fechaRutaComercial, 'dd/MM/yyy') || '-',
					fechaHoraInicio:this.datePipe.transform(item.fechaHoraInicio, 'h:mm:ss a') || '-',
					fechaHoraFin:this.datePipe.transform(item.fechaHoraFin, 'h:mm:ss a') || '-',
					trabajador: item.NombresApellidos || '-',
					razonSocial: item.razonSocial || '-',
					nombreComercial: item.nombreComercial || '-',
					sucursal: item.direccionSucursal || '-',
					motivo: item.nombreMotivo || '-',
					transporte: item.nombreTransporte || '-',
					condicionCliente:item.nombreCondicionCliente || '-',
					resultado:item.nombreResultado || '-',
					observaciones:item.observaciones || '-',
					estado:item.nombreEstado || '-',
				});
			});

			const nav = (window.navigator as any);
			// if (nav.msSaveOrOpenBlob) {
			//   nav.msSaveOrOpenBlob(data, filename);
			// }

			workbook.xlsx.writeBuffer().then(dataReporte => {
				var file = new Blob([dataReporte], { type: this.blobType });
				if (nav.msSaveOrOpenBlob) {
					nav.msSaveOrOpenBlob(file, this.excelFileName);
				} else { // Others
					var a = document.createElement("a"),
						url = URL.createObjectURL(file);
					a.href = url;
					a.download = this.excelFileName;
					document.body.appendChild(a);
					a.click();
					setTimeout(function () {
						document.body.removeChild(a);
						window.URL.revokeObjectURL(url);
					}, 0);
				}
			});
		} else {
			this.toastr.infoToastr('No se encontraron datos', 'Información!', {
				toastTimeout: 4000,
				showCloseButton: true,
				animate: 'fade',
				progressBar: true
			});
		}
	}

}
