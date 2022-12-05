import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ICreateAction, IEditAction, IDeleteAction, IDeleteSelectedAction, IFetchSelectedAction, IUpdateStatusForSelectedAction, ISortView, IFilterView, IGroupingView, ISearchView, PaginatorState, SortState, GroupingState } from 'src/app/_metronic/shared/crud-table';
import { PermissionViewActionService } from '../../../../Shared/services/permission-view-action.service';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { CertificadosService } from '../../_core/services/certificados.service';
import { ITableState, TableResponseModel } from '../../../../_metronic/shared/crud-table/models/table.model';
import { Certificado } from '../../_core/models/certificado.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SaveUpdateCertificadoModalComponent } from './save-update-certificado-modal/save-update-certificado-modal.component';
import { DeleteModalComponent } from '../../../_shared/delete-customer-modal/delete-modal.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { EmpresaService } from '../../../Security/_core/services/empresa.service';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-certificados',
  templateUrl: './certificados.component.html',
  styleUrls: ['./certificados.component.scss']
})
export class CertificadosComponent implements OnInit { 
  // paginator: PaginatorState;
  load_data: boolean = true;
  no_data: boolean = false;
  searchBan: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Nro', 'actions', 'Estado', 'Empresa', 'Codigo', 'Nombre', 'Cliente'];

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
  array_cliente_externo: any;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public certificado_s: CertificadosService,
    public empresa_s:EmpresaService,
    public pvas: PermissionViewActionService,
     public toastr: ToastrManager,
     private chgRef: ChangeDetectorRef,
     
  ) { }

  ngOnInit(): void {
    console.log(this.array_estado);
    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();
    console.log(this.viewsActions);
    this.filterForm();
    this.searchForm();

    this.getEmpresas();
    this.getCienteInterno(0);    
  }

  getEmpresas() {
    this.empresa_s.GetEmpresaByUsuario().subscribe(
      (data:any) => {        
        this.array_empresas = data;
        if(this.array_empresas.length > 1){
            this.array_empresas.unshift({
              idEmpresa: 0, razonSocial: 'Todos'
            });
        }else
        this.filterGroup.controls.Empresa.setValue(this.array_empresas[0].idEmpresa);
        console.log(data);
      }, ( errorServicio ) => {           
        console.log(errorServicio);
      }
    );

  }

  getCienteInterno(Empresa) {
    this.filterGroup.controls.Cliente.reset();   
    this.certificado_s.GetClientesExternoByUsuario(Empresa).pipe(finalize(()=>{this.getCetificados(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Cliente.value, this.filterGroup.controls.Estado.value); })).subscribe(
      (data:any) => {                   
        this.array_cliente_externo = data;
        if(this.array_cliente_externo.length > 1){        
          this.array_cliente_externo.unshift({
            ClienteExterno: 0, NombreCliente: 'Todos'
          });          
          this.filterGroup.controls.Cliente.setValue(this.array_cliente_externo[0].ClienteExterno);
        }else{
          if(this.array_cliente_externo.length == 0){       
          }else{            
            this.filterGroup.controls.Cliente.setValue(this.array_cliente_externo[0].ClienteExterno);
          }         
        }
      }, ( errorServicio ) => {
            
        console.log(errorServicio);
      }
    );
  }

  getCetificados(empresa, cliente, estado) {
    this.listData = new MatTableDataSource([]);
    this.searchBan = false;
    this.load_data = false;
    this.no_data = true;
    console.log(empresa, cliente, estado);
    
    this.certificado_s.GetCertificadosList(empresa, ((cliente == null) ? 0 : cliente), estado).subscribe(
      (data:any) => {
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
      Cliente: [0],
      Empresa: [0],
      Estado: [-1],
    });    
  }


  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
    });    
  }

  create(item) {
    const modalRef = this.modalService.open(SaveUpdateCertificadoModalComponent, { size: 'ms' });
    modalRef.componentInstance.item = item;
    modalRef.result.then((result) => {
      this.getCetificados(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Cliente.value, this.filterGroup.controls.Estado.value);
    }, (reason) => {
     console.log(reason);
    }); 
  }

  edit(item) {
    const modalRef = this.modalService.open(SaveUpdateCertificadoModalComponent, { size: 'ms' });
    modalRef.componentInstance.item = item;
    modalRef.result.then((result) => {
      this.getCetificados(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Cliente.value, this.filterGroup.controls.Estado.value);
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
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.tipo = 1;
    modalRef.componentInstance.titulo = 'Eliminar Certificado';
    modalRef.componentInstance.descripcion = 'Esta seguro de eliminar el certificado seleccionado?';
    modalRef.componentInstance.msgloading = 'Eliminando certificado...';
    modalRef.result.then((result) => {
      this.getCetificados(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Cliente.value, this.filterGroup.controls.Estado.value);
    }, (reason) => {
     console.log(reason);
    }); 
  }

  disabledCertificado(item) {
    this.certificado_s.DeleteCertificado(item.idCertificado, 1, !item.Activo).subscribe(
      (data:any) => {
        if (data[0].Ok > 0) {
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
