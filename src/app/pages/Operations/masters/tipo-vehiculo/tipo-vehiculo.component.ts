import { EliminarTipovehiculoComponent } from './eliminar-tipovehiculo/eliminar-tipovehiculo.component';
import { TipoVehiculo } from './../../_core/models/tipoVehiculo.interface';
import { Navigation } from './../../../../modules/auth/_core/interfaces/navigation';
import { TableResponseModel } from './../../../../_metronic/shared/crud-table/models/table.model';
import { TipoVehiculoService } from './../../_core/services/tipo-vehiculo.service';
import { PermissionViewActionService } from './../../../../Shared/services/permission-view-action.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';



@Component({
  selector: 'app-tipo-vehiculo',
  templateUrl: './tipo-vehiculo.component.html',
  styleUrls: ['./tipo-vehiculo.component.scss']
})
export class TipoVehiculoComponent implements OnInit {
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
  

  listData:MatTableDataSource<any>;
  displayedColumns: string[] = ['Nro', 'Nombre', 'Descripcion', 'Estado', 'actions'];

  @ViewChild(MatSort) MatSort: MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;
  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];
  array_data: TableResponseModel<TipoVehiculo>;
  array_dataList: any;
  array_roles: any;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private fb: FormBuilder,
    public toastr: ToastrManager,
    public pvas: PermissionViewActionService,
    public tipoVehiculo_s: TipoVehiculoService
  ){}


  ngOnInit(): void {
    console.log(this.array_estado);
    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();
    console.log(this.viewsActions);
    this.filterForm();
    this.searchForm();
    this.getTipoVehiculo('-1');
  }
  // RUTAS PARA AGREGAR y EDITAR
  addRuta() {    
    this.router.navigate(['Operations/masters/tipoVehiculo/add']);
  }
  editRuta(idTipoVehiculo) {    
    this.router.navigate(['Operations/masters/tipoVehiculo/edit'],{
      queryParams: {
        id: idTipoVehiculo
      }
      });
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
  getTipoVehiculo(estado) {
    this.listData = new MatTableDataSource([]);
    this.searchBan = false;
    this.load_data = false;
    this.no_data = true;

    this.tipoVehiculo_s.GetTipoVehiculo(estado).subscribe(
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
  search() {
    if(this.searchGroup.controls.searchTerm.value == null) {
      this.searchGroup.controls.searchTerm.setValue('');
    }
    this.listData.filter = this.searchGroup.controls.searchTerm.value.trim().toLowerCase();
    if (this.listData.paginator) {
      this.listData.paginator.firstPage();
    }
  }
  
  enabledDisabledTipoVehiculo(item) {
    console.log(item);
		this.tipoVehiculo_s.EnableDisableTipoVehiculo(item.idTipoVehiculo, !item.activo).subscribe(
      (data:any) => {
        if (data[0].Success > 0) {
					this.getTipoVehiculo(this.filterGroup.controls.Estado.value);
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
    const modalRef = this.modalService.open(EliminarTipovehiculoComponent,{ size: 'ms' });
    modalRef.componentInstance.id = item.idTipoVehiculo;
    console.log(item.nombre);
    
    modalRef.componentInstance.nombre = item.nombre;
    modalRef.componentInstance.titulo = 'Eliminar el Tipo de Vehiculo';
    modalRef.componentInstance.descripcion = 'Esta seguro de eliminar el siguiente Tipo de Vehiculo: ';
    modalRef.componentInstance.msgloading = 'Eliminando Tipo de Vehiculo...';
    modalRef.result.then((result) => {
    this.getTipoVehiculo(this.filterGroup.controls.Estado.value);
    }, (reason) => {
     console.log(reason);
    }); 
  }
 

  


}
