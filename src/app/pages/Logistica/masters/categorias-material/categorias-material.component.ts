import { SaveUpdateCategoriamaterialComponent } from './save-update-categoriamaterial/save-update-categoriamaterial.component';
import { CategoriaMaterialService } from '../../_core/services/categoria-material.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionViewActionService } from '../../../../Shared/services/permission-view-action.service';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { TableResponseModel } from '../../../../_metronic/shared/crud-table/models/table.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrManager } from 'ng6-toastr-notifications';
import {CategoriaMaterial} from '../../_core/services/models/CategoriaMaterial.interface';
import { EliminarCategoriaMaterialComponent } from '../_shared/eliminar-categoria-material/eliminar-categoria-material.component';

@Component({
  selector: 'app-categorias-material',
  templateUrl: './categorias-material.component.html',
  styleUrls: ['./categorias-material.component.scss']
})
export class CategoriasMaterialComponent implements OnInit {

  load_data: boolean = true;
  no_data: boolean = false;
  searchBan: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;

  array_estado: any = [
    { value: -1, descripcion: 'Todos' },
    { value: 1, descripcion: 'Activo' },
    { value: 0, descripcion: 'Inactivo' }
  ];

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Nro', 'actions', 'Estado', 'Nombre', 'Descripcion'];

  @ViewChild(MatSort) MatSort: MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];
  array_data: TableResponseModel<CategoriaMaterial>;
  array_dataList: any;
  array_roles: any;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    public toastr: ToastrManager,
    public pvas: PermissionViewActionService,
    public categorias_s: CategoriaMaterialService) { 
  }

  ngOnInit(): void {
    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();
    this.filterForm();
    this.searchForm();
    this. GetCategoriaMaterial('-1');
  }
  filterForm() {
    this.filterGroup = this.fb.group({
      Estado: [-1],
    });    
  }
  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
    });    
  }
  GetCategoriaMaterial(estado) {
    this.listData = new MatTableDataSource([]);
    this.searchBan = false;
    this.load_data = false;
    this.no_data = true;

    this.categorias_s.GetCategoriaMaterial(estado).subscribe(
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
        console.log(errorServicio);
        this.load_data = true;
        this.no_data = false;
        this.searchBan = false; 
      }
    );
  }
  create(item) {
    const modalRef = this.modalService.open(SaveUpdateCategoriamaterialComponent, { size: 'ms' });
    modalRef.componentInstance.item = item;
    modalRef.result.then((result) => {
      this.GetCategoriaMaterial(this.filterGroup.controls.Estado.value);     
    }, (reason) => {
     console.log(reason);
    }); 
  }
   edit(item) {
    const modalRef = this.modalService.open(SaveUpdateCategoriamaterialComponent, { size: 'ms' });
    modalRef.componentInstance.item = item;
    modalRef.result.then((result) => {
      this.GetCategoriaMaterial(this.filterGroup.controls.Estado.value);
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

  enabledDisabledCategoriaMaterial(item) {
    console.log(item);
		this.categorias_s.EnableDisableCategoriaMaterial(item.idCategoriaMaterial, !item.activo).subscribe(
      (data:any) => {
        if (data[0].Success > 0) {
					this.GetCategoriaMaterial(this.filterGroup.controls.Estado.value);
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

  delete(item) {
    const modalRef = this.modalService.open(EliminarCategoriaMaterialComponent, { size: 'ms' });
    modalRef.componentInstance.id = item.idCategoriaMaterial;
    console.log(item.nombre);
    
    modalRef.componentInstance.nombre = item.nombre;
    modalRef.componentInstance.titulo = 'Eliminar Catgegoria Material';
    modalRef.componentInstance.descripcion = 'Esta seguro de eliminar la Siguiente Categoria de Material: ' + item.nombre;
    modalRef.componentInstance.msgloading = 'Eliminando Categoria...';
    modalRef.result.then((result) => {
      this.GetCategoriaMaterial(this.filterGroup.controls.Estado.value);
    }, (reason) => {
     console.log(reason);
    }); 
  }
}
