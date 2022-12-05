import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionViewActionService } from '../../../../Shared/services/permission-view-action.service';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { TableResponseModel } from '../../../../_metronic/shared/crud-table/models/table.model';
import { MatTableDataSource } from '@angular/material/table';
// import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DeleteModalComponent } from '../../../_shared/delete-customer-modal/delete-modal.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MultitablaService } from '../../../_core/services/multitabla.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { CertificadosService } from 'src/app/pages/Talento/_core/services/certificados.service';
import { VentasService } from '../../_core/ventas.service';
import * as XLSX from 'ts-xlsx';
import { EmpresaService } from '../../../Security/_core/services/empresa.service';

@Component({
  selector: 'app-seguimiento-ventas',
  templateUrl: './seguimiento-ventas.component.html',
  styleUrls: ['./seguimiento-ventas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe,
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class SeguimientoVentasComponent implements OnInit {

  load_data: boolean = true;
  no_data: boolean = false;
  searchBan: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  listData: MatTableDataSource<any>;
  totalInicial: any = 0;
  totalActual: any = 0;
  displayedColumns: string[] = ['Nro', 'actions', 'EstadoAtencion',  'Fecha', 'NombreSupervisor', 'NombreAsesor', 'Cliente','DocumentoIdentidad',   
                              'FechaCargaCRM',  'EstadoVentaInterno', 'EstadoVentaCliente', 
                              'FechaInstalacion', 'BackOffice'];

  @ViewChild(MatSort) MatSort: MatSort;
  // @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];
  array_dataList: any;
  array_empresas: any;
  array_estado: any;
  filecontrolDocumento = new FormControl(null);
  arrayBuffer: any;
  fileDocumento: any = null;
  constructor(
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private modalService: NgbModal,
    public multitabla_s: MultitablaService,
    public certificado_s: CertificadosService,
    public empresa_s:EmpresaService,
    public ventas_s: VentasService,
    public pvas: PermissionViewActionService,
    public toastr: ToastrManager,
    private router: Router,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();
    console.log(this.viewsActions);
    this.filterForm();
    this.searchForm();
    this.getEmpresas();
    this.getEstados();
    // this.getPuestoTrabajo(0);
    this.getSeguimientoVentasList();    
  }

  getEmpresas() {
    this.empresa_s.GetEmpresaByUsuario().subscribe(
      (data:any) => {        
        this.array_empresas = data;
        if(this.array_empresas.length > 1){
          this.array_empresas.unshift({
            idEmpresa: 0, razonSocial: 'Todos'
          });
        }
        this.filterGroup.controls.Empresa.setValue(this.array_empresas[0].idEmpresa)
      }, ( errorServicio ) => {           
        console.log(errorServicio);
      }
    );
  }

  getEstados() {
    this.ventas_s.GetEstadoVentaInterna().subscribe(
      (data:any) => {
        this.array_estado = data;
        this.array_estado.unshift({
          valor: '-1', nombre: 'Todos'
        });
      }, ( errorServicio ) => {           
        console.log(errorServicio);
      }
    );
  } 


  getSeguimientoVentasList() {
    this.listData = new MatTableDataSource([]);
    this.searchBan = false;
    this.load_data = false;
    this.no_data = true;
    this.totalActual = 0;
    this.ventas_s.GetSeguimientoVentasList(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Estado.value, this.filterGroup.controls.FechaInicio.value, this.filterGroup.controls.FechaFin.value).subscribe(
      (data:any) => {
        this.cd.markForCheck();
        console.log(data);
        this.load_data = true;
        this.searchBan = false;
        this.totalInicial = data.length;
        this.listData = new MatTableDataSource(data.map(e=> {
					e.FechaCargaCRM = (e.FechaCargaCRM!='1969-12-31T00:00:00')?e.FechaCargaCRM:'';
					return e;
				} ));
        if(data.length > 0){
          this.no_data = true;          
        }else{
          this.no_data = false;
        }
        this.listData.sort = this.MatSort;   
        const secondsCounter = interval(20000);
        secondsCounter.subscribe(n =>
          this.getSeguimientoVentasListBusqueda());   
        // this.listData.paginator = this.paginator;       
      }, ( errorServicio ) => {
        this.load_data = true;
        this.no_data = false;
        this.searchBan = false;        
      }
    );

  }

  getSeguimientoVentasListBusqueda() {
    this.listData = new MatTableDataSource([]);
    this.searchBan = false;
    this.load_data = false;
    this.no_data = true;
    this.ventas_s.GetSeguimientoVentasList(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Estado.value, this.filterGroup.controls.FechaInicio.value, this.filterGroup.controls.FechaFin.value).subscribe(
      (data:any) => {
        console.log(data);
        this.cd.markForCheck();
        console.log(data);
        this.load_data = true;
        this.searchBan = false;
        this.listData = new MatTableDataSource(data.map(e=> {
					e.FechaCargaCRM = (e.FechaCargaCRM!='1969-12-31T00:00:00')?e.FechaCargaCRM:'';
					return e;
				} ));
        if(data.length > 0){
          this.no_data = true;          
        }else{
          this.no_data = false;
        }
        this.listData.sort = this.MatSort;


        this.totalActual = data.length;        
        if (this.totalInicial < this.totalActual) {
          const audio = new Audio('../../../../../assets/media/alerts/ALERTA_SERVICIO.mp3');
          audio.play();
          this.totalInicial = data.length;
          this.cd.markForCheck();
          this.toastr.infoToastr('Se encontro un nuevo seguimiento para el dia de hoy. Por favor revisar', 'Información!', {
            toastTimeout: 3000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });          
        }

        // this.listData.paginator = this.paginator;       
      }, ( errorServicio ) => {
        this.load_data = true;
        this.no_data = false;
        this.searchBan = false;        
      }
    );

  }




  filterForm() {
    this.filterGroup = this.fb.group({
      FechaInicio: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), Validators.compose([Validators.required])],
      FechaFin: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), Validators.compose([Validators.required])],
      Empresa: ['0', Validators.compose([Validators.required])],
      Estado: ['-1', Validators.compose([Validators.required])],
    });    
  }

  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
    });    
  }

  search() {
    if(this.searchGroup.controls.searchTerm.value == null) {
      this.searchGroup.controls.searchTerm.setValue('');
    }
    this.listData.filter = this.searchGroup.controls.searchTerm.value.trim().toLowerCase();
    // if (this.listData.paginator) {
    //   this.listData.paginator.firstPage();
    // }
  }

  editVentas(Venta) {
    console.log('SDFADFASDFS');
    this.router.navigate(['Comercial/process/SeguimientoVentas/edit'], {
      queryParams: {
        id: Venta
      }
    });
  }

  delete(id: number) {
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.tipo = 5;
    modalRef.componentInstance.titulo = 'Eliminar Venta';
    modalRef.componentInstance.descripcion = 'Esta seguro de eliminar la venta seleccionada?';
    modalRef.componentInstance.msgloading = 'Eliminando venta...';
    modalRef.result.then((result) => {
      this.getSeguimientoVentasList();
    }, (reason) => {
     console.log(reason);
    }); 
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

  onFileAddDocumento(event) {
		if (event.target.files.length > 0  && event.target.files[0].size <= 80000000 && event.target.files[0].size !== undefined ) {
			const files: { [key: string]: File } = event.target.files;
			for (let key in files) {
			if (!isNaN(parseInt(key))) {this.fileDocumento = files[key];}
			}
		} else {
			if (event.target.files[0].size > 80000000) {
			this.toastr.warningToastr('El tamaño excede a los 8Mb de capacidad. No se podra guardar', 'Advertencia!', {
				toastTimeout: 2000,
				showCloseButton: true,
				animate: 'fade',
				progressBar: true
			});
			}
			this.fileDocumento = null;
		}
	
		if (this.fileDocumento !== null) {
			let fileReader = new FileReader();
			fileReader.readAsArrayBuffer(this.fileDocumento);
			fileReader.onload = (e)=> this.transform_EXCEL_to_xml_documento(fileReader);
		}
	}

  array_validado: any = [];
	transform_EXCEL_to_xml_documento(fileReader: FileReader) {
		this.arrayBuffer = fileReader.result;
		let data = new Uint8Array(this.arrayBuffer);
		let arr = new Array();
		for(let i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
		let bstr = arr.join("");
		let workbook = XLSX.read(bstr, {type:"binary"});
		let first_sheet_name = workbook.SheetNames[0];
		let worksheet = workbook.Sheets[first_sheet_name];
	
		let array_json=XLSX.utils.sheet_to_json(worksheet,{raw:true});


    console.log(array_json);
    for (let i = 0; i <= array_json.length - 1; i++) {
      let dato: any = array_json[i];
      this.array_validado.push({
        fechaVenta: (dato.fecha_venta) ? this.datePipe.transform(this.numeroAFecha(dato.fecha_venta, true), 'yyyy-MM-dd') : null,
        nroDoc: dato.nro_doc,
        planAceptado: dato.plan_aceptado,
        estado: (dato.estado) ? dato.estado : 'N/A',
        fechaInstalacion: (dato.inst_cod_ped !== 0) ? this.formatoFecha(dato.inst_cod_ped) : null,
        campoBG: dato.comentario_pr,
        campoBD: dato.tipo_pr,
        campoBB: dato.tipo_validacion,
        campoBK: (dato.estado_area) ? dato.estado_area : 'N/A',
        campoBE: (dato.fecha_pr > 0 || dato.fecha_pr !== '') ? this.datePipe.transform(this.numeroASoloFecha(dato.fecha_pr, true), 'yyyy-MM-dd') : null,
        campoBH: (dato.inst_cod_ped !== 0) ? this.formatoFecha(dato.inst_cod_ped) : null
      });			
		}

		if (this.array_validado.length > 0) {
      console.log(this.array_validado);
			this.ventas_s.CargarVentasCliente(this.array_validado).subscribe(
			(data: any) => {
				console.log(data);
        if (data[0].Ok === 1) {
          this.filecontrolDocumento.reset();
          this.toastr.successToastr(data[0].Message, 'Correcto!', {
            toastTimeout: 3000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
            });
        } else {
          this.toastr.errorToastr(data[0].Message, 'Correcto!', {
            toastTimeout: 3000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
            });
        }
        
				
			}, ( errorServicio) => {

				this.filecontrolDocumento.reset();
				this.toastr.errorToastr(errorServicio.message, 'Error!', {
					toastTimeout: 3000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
					});
					console.log(errorServicio);
				}
			);
		} else {
			this.toastr.warningToastr('Sin data para cargar', 'Advertencia', {
			toastTimeout: 3000,
			showCloseButton: true,
			animate: 'fade',
			progressBar: true
			});
			this.filecontrolDocumento.reset();
		}

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
    console.log(texto);
    if (texto) {
      if (texto !== '') {
        let strValores = texto.split('/');
        return strValores[2] + '-' + strValores[1] + '-' + strValores[0];
      } else {
        return null;
      }
    } else {
      return null;
    }
    
		
    
		
	}



}

