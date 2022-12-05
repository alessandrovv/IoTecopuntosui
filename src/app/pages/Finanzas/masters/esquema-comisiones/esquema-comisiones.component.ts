import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ICreateAction, IEditAction, IDeleteAction, IDeleteSelectedAction, IFetchSelectedAction, IUpdateStatusForSelectedAction, ISortView, IFilterView, IGroupingView, ISearchView, PaginatorState, SortState, GroupingState } from 'src/app/_metronic/shared/crud-table';
import { PermissionViewActionService } from '../../../../Shared/services/permission-view-action.service';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { CertificadosService } from '../../../Talento/_core/services/certificados.service';
import { EsquemaComisionService } from '../../_core/services/esquema-comision.service';
import { ITableState, TableResponseModel } from '../../../../_metronic/shared/crud-table/models/table.model';
import { Certificado } from '../../../Talento/_core/models/certificado.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SaveUpdateEsquemaComisionesModalComponent } from './save-update-esquema-comisiones-modal/save-update-esquema-comisiones-modal.component';
import { DeleteEsquemaComisionComponent } from './../../../_shared/delete-esquema-comision/delete-esquema-comision.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { puestoTrabajoService } from '../../../Talento/_core/services/puestoTrabajo.service';
import { EmpresaService } from '../../../Security/_core/services/empresa.service';
import {finalize} from 'rxjs/operators';
@Component({
  selector: 'app-esquema-comisiones',
  templateUrl: './esquema-comisiones.component.html',
  styleUrls: ['./esquema-comisiones.component.scss']
})
export class EsquemaComisionesComponent implements OnInit { 
  // paginator: PaginatorState;
  load_data: boolean = true;
  no_data: boolean = false;
  searchBan: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Nro', 'Empresa', 'NombreEsquema', 'Certificado', 'PuestoTrabajo', 'Comision', 'Estado', 'actions'];

  @ViewChild(MatSort) MatSort: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

  array_estado: any = [
    { value: -1, descripcion: 'Todos' },
    { value: 1, descripcion: 'Activo' },
    { value: 0, descripcion: 'Inactivo' }
  ];

  
  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];
  array_data: TableResponseModel<Certificado>;
  array_dataList: any;
  array_empresas: any;
	array_puestoTrabajo: any;
	array_certificados: any;
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
		public esquema_s: EsquemaComisionService,
    public certificado_s: CertificadosService,
    public empresa_s:EmpresaService,
    public puestoTrabajo_s:puestoTrabajoService,
    public pvas: PermissionViewActionService,
     public toastr: ToastrManager,
  ) { }

  ngOnInit(): void {
    console.log(this.array_estado);
    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();
    console.log(this.viewsActions);
    this.filterForm();
    this.searchForm();


    this.getEmpresas();
		this.getCertificados();
		this.getPuestoTrabajo(0);
  }

	getCertificados(){
		this.certificado_s.GetCertificadosList(0,0,-1).subscribe(
			(data:any) => {
				this.array_certificados = data;
				this.array_certificados.unshift({
					idCertificado: 0,
					Nombre: 'Todos',
				});
			}, (errorServicio) =>{
				console.log(errorServicio);
			}
		)
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

  getPuestoTrabajo(Empresa) {    
    this.filterGroup.controls.PuestoTrabajo.reset();   
    this.puestoTrabajo_s.GetPuestoTrabajoByUsuario(Empresa,0).pipe(finalize(()=>{this.getEsquemaComision(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Certificado.value, this.filterGroup.controls.PuestoTrabajo.value); })).subscribe(
      (data:any) => {                   
        this.array_puestoTrabajo = data;
        if(this.array_puestoTrabajo.length > 1){        
          this.array_puestoTrabajo.unshift({
            PuestoTrabajo: 0, NombrePuestoTrabajo: 'Todos'
          });
          
        this.filterGroup.controls.PuestoTrabajo.setValue(this.array_puestoTrabajo[0].PuestoTrabajo);
        }else{
          if(this.array_puestoTrabajo.length == 0){       
          }else{            
          this.filterGroup.controls.PuestoTrabajo.setValue(this.array_puestoTrabajo[0].PuestoTrabajo);
          }         
        }
        
      }, ( errorServicio ) => {
            
        console.log(errorServicio);
      }
    );
  }


	getEsquemaComision(empresa,certificado,puestoTrabajo){
		this.listData = new MatTableDataSource([]);
		this.searchBan = false;
		this.load_data = false;
		this.no_data = true;
		console.log(empresa, certificado, puestoTrabajo);
		this.esquema_s.GetEsquemasComisionesList(empresa, certificado, ((puestoTrabajo == null) ? 0 : puestoTrabajo)).subscribe(
      (data:any) => {
				console.log("listado: ",data)
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


  filterForm() {
    this.filterGroup = this.fb.group({
      Certificado: [0],
      Empresa: [0],
      PuestoTrabajo: [0],
    });    
  }


  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
    });    
  }

  create(item) {
    const modalRef = this.modalService.open(SaveUpdateEsquemaComisionesModalComponent, { size: 'ms' });
    modalRef.componentInstance.item = item;
    modalRef.result.then((result) => {
      this.getEsquemaComision(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Certificado.value, this.filterGroup.controls.PuestoTrabajo.value);
    }, (reason) => {
     console.log(reason);
    }); 
  }

  edit(item) {
    const modalRef = this.modalService.open(SaveUpdateEsquemaComisionesModalComponent, { size: 'ms' });
    modalRef.componentInstance.item = item;
    modalRef.result.then((result) => {
      this.getEsquemaComision(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Certificado.value, this.filterGroup.controls.PuestoTrabajo.value);
    }, (reason) => {
     console.log(reason);
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

  delete(id: number) {
    const modalRef = this.modalService.open(DeleteEsquemaComisionComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then((result) => {
      this.getEsquemaComision(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Certificado.value, this.filterGroup.controls.PuestoTrabajo.value);
    }, (reason) => {
     console.log(reason);
    }); 
  }

	enableEsquemaComision(item){
		item.activo = !item.activo;
		console.log(item);
		this.esquema_s.EnableDisableEsquemaComision(item).subscribe(
      (data:any) => {
        if (data[0].Success > 0) {
          // this.getCetificados(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Cliente.value, this.filterGroup.controls.Estado.value);
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
