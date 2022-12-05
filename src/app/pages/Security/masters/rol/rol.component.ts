import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrManager } from 'ng6-toastr-notifications';

import { FormBuilder,FormGroup } from '@angular/forms';
import { SaveUpdateRolModalComponent } from './save-update-rol-modal/save-update-rol-modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RolService } from '../../_core/services/rol.service';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { PermissionViewActionService } from '../../../../Shared/services/permission-view-action.service';
import { TableResponseModel } from '../../../../_metronic/shared/crud-table/models/table.model';
import { Rol } from '../../_core/models/rol.interface';
import { Subscription } from 'rxjs';
import { DeleteModalComponent } from '../../../_shared/delete-customer-modal/delete-modal.component';
import { DeleteRolModalComponent } from '../../../_shared/delete-rol-modal/delete-rol-modal.component';
@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.scss']
})
export class RolComponent implements OnInit {
  
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
  displayedColumns: string[] = ['Nro', 'Nombre', 'Descripcion', 'Estado', 'actions'];

  @ViewChild(MatSort) MatSort: MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];
  array_data: TableResponseModel<Rol>;
  array_dataList: any;
  array_roles: any;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    public toastr: ToastrManager,
    public pvas: PermissionViewActionService,
    public rol_s: RolService) { 
  }

  ngOnInit(): void {
    console.log(this.array_estado);
    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();
    console.log(this.viewsActions);
    this.filterForm();
    this.searchForm();
    this.getRoles('-1');
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
  getRoles(estado) {
    this.listData = new MatTableDataSource([]);
    this.searchBan = false;
    this.load_data = false;
    this.no_data = true;

    this.rol_s.GetRoles(estado).subscribe(
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
        console.log(data);         
      }, ( errorServicio ) => {           
        console.log(errorServicio);
        this.load_data = true;
        this.no_data = false;
        this.searchBan = false; 
      }
    );
  }
  create(item) {
    const modalRef = this.modalService.open(SaveUpdateRolModalComponent, { size: 'ms' });
    modalRef.componentInstance.item = item;
    modalRef.result.then((result) => {
      this.getRoles(this.filterGroup.controls.Estado.value);     
    }, (reason) => {
     console.log(reason);
    }); 
  }
  edit(item) {
    const modalRef = this.modalService.open(SaveUpdateRolModalComponent, { size: 'ms' });
    modalRef.componentInstance.item = item;
    modalRef.result.then((result) => {
      this.getRoles(this.filterGroup.controls.Estado.value);
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

  enabledDisabledRol(item) {
    console.log(item);
		this.rol_s.EnableDisableRol(item.idRol, !item.activo).subscribe(
      (data:any) => {
        if (data[0].Success > 0) {
					this.getRoles(this.filterGroup.controls.Estado.value);
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
    const modalRef = this.modalService.open(DeleteRolModalComponent);
    modalRef.componentInstance.id = item.idRol;
    console.log(item.nombre);
    
    modalRef.componentInstance.nombre = item.nombre;
    modalRef.componentInstance.titulo = 'Eliminar Rol';
    modalRef.componentInstance.descripcion = 'Esta seguro de eliminar el siguiente Rol';
    modalRef.componentInstance.msgloading = 'Eliminando Rol...';
    modalRef.result.then((result) => {
      this.getRoles(this.filterGroup.controls.Estado.value);
    }, (reason) => {
     console.log(reason);
    }); 
  }

}
