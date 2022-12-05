import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Navigation, Router } from '@angular/router';
import { NgbModal, NgbDateAdapter, NgbDateParserFormatter  } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Subscription } from 'rxjs';
import { EmpresaService } from 'src/app/pages/Security/_core/services/empresa.service';
import { CertificadosService } from 'src/app/pages/Talento/_core/services/certificados.service';
import { TrabajadorService } from 'src/app/pages/Talento/_core/services/trabajador.service';
import { DeleteModalGeneralComponent } from 'src/app/pages/_shared/delete-modal/delete-modal.component';
import { PermissionViewActionService } from 'src/app/Shared/services/permission-view-action.service';
import { TableResponseModel } from 'src/app/_metronic/shared/crud-table';
import { RutasService } from '../../_core/rutas.service';
import { DatePipe } from '@angular/common';
import { CustomAdapter,CustomDateParserFormatter } from '../../../../_metronic/core/utils/date-picker.utils';
@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.component.html',
  styleUrls: ['./rutas.component.scss'],
  providers: [DatePipe,
		{ provide: NgbDateAdapter, useClass: CustomAdapter },
		{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
	]
})
export class RutasComponent implements OnInit {

  load_data: boolean = true;
  no_data: boolean = false;
  searchBan: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Nro','actions','Codigo','Fecha', 'TrabajadorAsignado', 'Clientes','Activo'];
  
  @ViewChild(MatSort) MatSort: MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;
  
  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<any> = [];
  array_data: TableResponseModel<any>;
  array_dataList: any;
  
  array_empresas: any;
  array_anios: any;
  array_meses: any;

  array_trabajadores: any;
  array_estado: any = [
    { value: -1, descripcion: 'Todos' },
    { value: 1, descripcion: 'Activo' },
    { value: 0, descripcion: 'Inactivo' }
  ];
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public certificado_s: CertificadosService,
    public ruta_s: RutasService,
    public pvas: PermissionViewActionService,
    public empresa_s:EmpresaService,
    public toastr: ToastrManager,
    private router: Router,
		public trabajador_s: TrabajadorService,    
    private datePipe: DatePipe,
  ) { }
  
  ngOnInit(): void {
    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();
    this.filterForm();
    this.searchForm();    
    this.getListarTrabajadores();
    this.getRutas(this.filterGroup.controls.Desde.value,this.filterGroup.controls.Hasta.value,0,-1);
  }
  getListarTrabajadores(){
		this.trabajador_s.GetTrabajadoresList(0,0,0,1).subscribe(
			(data:any)=>{
				this.array_trabajadores = data;
        if(this.array_trabajadores.length > 1){
          this.array_trabajadores.unshift({
            idTrabajador: 0, NombresApellidos: 'Todos'
          });
        }
        this.filterGroup.controls.Trabajador.setValue(this.array_trabajadores[0].idTrabajador) 
			}, (errorServicio)=>{
				console.log(errorServicio);
			}
		);
	}

  filterForm() {
    this.filterGroup  = this.fb.group({      
      Desde: [this.datePipe.transform(new Date(new Date().setDate(new Date().getDate() - 30)), 'yyyy-MM-dd')],
      Hasta: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
      Trabajador: [0],
      Estado: [-1],
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
    if (this.listData.paginator) {
      this.listData.paginator.firstPage();
    }
  }
  
  getRutas(Desde,Hasta,Trabajador,Estado) {
    this.listData = new MatTableDataSource([]);
    this.searchBan = false;
    this.load_data = false;
    this.no_data = true;
    /* this.filterGroup.controls.FechaInicio.value, this.filterGroup.controls.FechaFin.value */
    this.ruta_s.GetRutasComercial(Desde,Hasta,Trabajador,Estado).subscribe(
      (data:any) => {
        console.log(data);
        this.load_data = true;
        this.searchBan = false;
        this.listData = new MatTableDataSource(data);
        if(data.length > 0){
          this.no_data = true;
        }else{
          this.no_data = false;
        }
        this.listData.sort = this.MatSort;
        this.listData.paginator = this.paginator;       
      }, ( errorServicio ) => {
        this.load_data = true;
        this.no_data = false;
        this.searchBan = false;        
      }
    );
  }
  addRuta() {    
    this.router.navigate(['Sales/process/Rutas/add']);
  }
  
  editRuta(RutaComercial) {
    this.router.navigate(['Sales/process/Rutas/edit'], {
      queryParams: {
        id: RutaComercial
      }
    });
  }
  
  
  delete(idRutaComercial: number) {
    const modalRef = this.modalService.open(DeleteModalGeneralComponent);
    modalRef.componentInstance.id = idRutaComercial;
    modalRef.componentInstance.titulo = 'Eliminar Ruta Comercial';
    modalRef.componentInstance.descripcion = 'Esta seguro de eliminar la Ruta Comercial seleccionada?';
    modalRef.componentInstance.msgloading = 'Eliminando Ruta Comercial...';
		modalRef.componentInstance.service = ()=>{
			return this.ruta_s.DeleteRutaComercial(idRutaComercial);
		};
    modalRef.result.then((result) => {
      this.getRutas(this.filterGroup.controls.Desde.value,this.filterGroup.controls.Hasta.value,this.filterGroup.controls.Trabajador.value,this.filterGroup.controls.Estado.value);
    }, (reason) => {
     console.log(reason);
    });  
   }
   enableDisableRutaComercial(item){
    this.ruta_s.EnableDisableRutaComercial(item.idRutaComercial,!item.activo).subscribe(
      (data:any) => {
        if (data[0].Success > 0) {
          this.toastr.successToastr(data[0].Message, 'Correcto!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
        } else {
          item.Activo = item.Activo;
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
   }
   
}
