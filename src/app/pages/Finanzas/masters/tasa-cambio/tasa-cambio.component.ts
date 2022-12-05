import { Component, OnInit,ViewChild  } from '@angular/core';
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
import { DeleteModalGeneralComponent } from '../../../_shared/delete-modal/delete-modal.component';
import { MultitablaService } from 'src/app/pages/_core/services/multitabla.service';
import { SaveUpdateTasaCambioComponent } from './save-update-tasa-cambio/save-update-tasa-cambio.component';
import { TasaCambioService } from '../../_core/services/tasa-cambio.service';

@Component({
  selector: 'app-tasa-cambio',
  templateUrl: './tasa-cambio.component.html',
  styleUrls: ['./tasa-cambio.component.scss']
})
export class TasaCambioComponent implements OnInit {
  load_data: boolean = true;
  no_data: boolean = false;
  searchBan: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Nro', 'Fecha', 'MonedaOrigen', 'MonedaDestino', 'ValorCompra','ValorVenta', 'Activo', 'actions'];

  @ViewChild(MatSort) MatSort: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];
  array_data: TableResponseModel<any>;
  array_dataList: any;
  //array_monedas: any;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public pvas: PermissionViewActionService,
    public toastr: ToastrManager,
    private multitabla_s:MultitablaService,
    private tasaCambio_s:TasaCambioService
  ) { }

  ngOnInit(): void {
    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();
    this.searchForm();
    this.getTasasCambio();
  }

  getTasasCambio(){
    this.listData = new MatTableDataSource([]);
     this.searchBan = false;
     this.load_data = false;
     this.no_data = true;

     this.tasaCambio_s.GetTasasCambio().subscribe(
        (data:any)=>{
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
       },(error)=>{
        this.load_data = true;
        this.no_data = false;
        this.searchBan = false;
       }
     );
  }

  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
    });    
  }

  create(item){
    const modalRef = this.modalService.open(SaveUpdateTasaCambioComponent, {size:'md'});
    modalRef.componentInstance.item = item;
    modalRef.result.then((result)=>{
      this.getTasasCambio();
    },(reason)=>{
      console.log(reason);
    }
    );
  }

  edit(item){
    const modalRef = this.modalService.open(SaveUpdateTasaCambioComponent, {size:'md'});
    modalRef.componentInstance.item = item;
    modalRef.result.then((result)=>{
      this.getTasasCambio();
    },(reason)=>{
      console.log(reason);
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

  disable(item){
    this.tasaCambio_s.DeleteDisableTasaCambio(item.idTasaCambio,1,!item.activo).subscribe(
      (data:any)=>{
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
      },(error)=>{
        this.toastr.errorToastr('Ocurrio un error.', 'Error!', {
          toastTimeout: 2000,
          showCloseButton: true,
          animate: 'fade',
          progressBar: true
        });       
        console.log(error);
      }
    );
  }

  delete(id:number){
    const modalRef = this.modalService.open(DeleteModalGeneralComponent);
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.titulo = 'Eliminar Tasa de Cambio';
    modalRef.componentInstance.descripcion = 'Esta seguro de eliminar la tasa de cambio seleccionada?';
    modalRef.componentInstance.msgloading = 'Eliminando Tasa de Cambio...';
    modalRef.componentInstance.service = ()=>{ // funcion que se va a llamar al presionar el boton de eliminar
			return this.tasaCambio_s.DeleteDisableTasaCambio(id,2,null);  // es necesario usar el return para que el servicio retorne 
		};
    modalRef.result.then((result) => {
      this.getTasasCambio();
    }, (reason) => {
     console.log(reason);
    }); 
  }

}
