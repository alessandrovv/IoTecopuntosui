import { Component, OnInit,ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ICreateAction, IEditAction, IDeleteAction, IDeleteSelectedAction, IFetchSelectedAction, IUpdateStatusForSelectedAction, ISortView, IFilterView, IGroupingView, ISearchView, PaginatorState, SortState, GroupingState } from 'src/app/_metronic/shared/crud-table';
import { PermissionViewActionService } from '../../../../Shared/services/permission-view-action.service';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { AreaService } from '../../_core/services/area.service';
import { ITableState, TableResponseModel } from '../../../../_metronic/shared/crud-table/models/table.model';
import { Area } from '../../_core/models/area.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SaveUpdateAreaComponent } from './save-update-area/save-update-area.component';
import { DeleteModalComponent } from '../../../_shared/delete-customer-modal/delete-modal.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DeleteModalGeneralComponent } from '../../../_shared/delete-modal/delete-modal.component';
import { EmpresaService } from '../../../Security/_core/services/empresa.service';


@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {
  load_data: boolean = true;
  no_data: boolean = false;
  searchBan: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Nro', 'actions', 'Activo', 'Empresa', 'Nombre','Descripcion'];

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
  array_data: TableResponseModel<Area>;
  array_dataList: any;
  array_empresas: any;
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public area_s: AreaService,
    public empresa_s:EmpresaService,
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
    this.getArea(0,-1);    
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

   getArea(empresa, estado) {
     this.listData = new MatTableDataSource([]);
     this.searchBan = false;
     this.load_data = false;
     this.no_data = true;

     this.area_s.GetArea(empresa, estado).subscribe(
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
    const modalRef = this.modalService.open(SaveUpdateAreaComponent, { size: 'ms' });
    modalRef.componentInstance.item = item;
    modalRef.result.then((result) => {
      this.getArea(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Estado.value);
    }, (reason) => {
     console.log(reason);
    }); 
  }

  edit(item) {
    const modalRef = this.modalService.open(SaveUpdateAreaComponent, { size: 'ms' });
    modalRef.componentInstance.item = item;
    modalRef.result.then((result) => {
      this.getArea(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Estado.value);
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
    const modalRef = this.modalService.open(DeleteModalGeneralComponent);
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.titulo = 'Eliminar Área';
    modalRef.componentInstance.descripcion = 'Esta seguro de eliminar el área seleccionado?';
    modalRef.componentInstance.msgloading = 'Eliminando Área...';
    modalRef.componentInstance.service = ()=>{ // funcion que se va a llamar al presionar el boton de eliminar
			return this.area_s.DeleteArea(id);  // es necesario usar el return para que el servicio retorne 
		};
    modalRef.result.then((result) => {
      this.getArea(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Estado.value);
    }, (reason) => {
     console.log(reason);
    }); 
  }
  disabledArea(item) {
  //  item.activo = !item.activo
   this.area_s.EnableDisableArea(item.idArea, !item.activo).subscribe(
     (data:any) => {
       if (data[0].Success > 0) {
         this.toastr.successToastr(data[0].Message, 'Correcto!', {
           toastTimeout: 2000,
           showCloseButton: true,
           animate: 'fade',
           progressBar: true
         });
       } else {
         item.activo = item.activo;
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

