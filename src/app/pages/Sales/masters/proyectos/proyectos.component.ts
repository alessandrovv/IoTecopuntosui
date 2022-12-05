import { Component, OnDestroy,OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrManager } from 'ng6-toastr-notifications';
import { FormBuilder,FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { DeleteModalComponent } from '../../../_shared/delete-customer-modal/delete-modal.component';
import { MatSort } from '@angular/material/sort';
import { finalize } from 'rxjs/operators';
import { MultitablaService } from '../../../_core/services/multitabla.service';
import { Router } from '@angular/router';
import { PermissionViewActionService } from '../../../../Shared/services/permission-view-action.service';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { ITableState, TableResponseModel } from '../../../../_metronic/shared/crud-table/models/table.model';
import { ProyectosService } from '../../_core/proyectos.service';
import { DatePipe } from '@angular/common';
import { UpdateProyectoModalComponent } from './update-proyecto-modal/update-proyecto-modal.component';
import { SaveProyectoModalComponent } from './save-proyecto-modal/save-proyecto-modal.component';


@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss']
})
export class ProyectosComponent implements OnInit {
  load_data:boolean = true;
  no_data:boolean = false;
  searchBan:boolean = false;
  filterGroup:FormGroup;
  searchGroup:FormGroup;
  listData:MatTableDataSource<any>;
  displayedColumns:string[] = ['Nro', 'PROYECTOS', 'CLIENTES','FECHAINICIO','FECHAFIN','ACTIVO','OPCIONES'];
  @ViewChild(MatSort) MatSort:MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public proyecto_s: ProyectosService,
    public multitabla_s: MultitablaService,
    public pvas: PermissionViewActionService,
    public toastr: ToastrManager,
    private router: Router,   
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();

    this.searchForm();
    this.getListarProyectos()
  }

  searchForm(){
    this.searchGroup = this.fb.group({
      searchTerm:[''],
    });
  }
  
  search(){
    if(this.searchGroup.controls.searchTerm.value == null){
      this.searchGroup.controls.searchTerm.setValue('');
    }
    this.listData.filter = this.searchGroup.controls.searchTerm.value.trim().toLowerCase();
    if(this.listData.paginator){
      this.listData.paginator.firstPage();
    }
  }

  getListarProyectos(){
    this.listData = new MatTableDataSource([]);
    this.searchBan = false;
    this.load_data =false;
    this.no_data = true;
  
    this.proyecto_s.GetListarProyectos().subscribe(
      (data:any) => {
        this.load_data = true;
        this.searchBan = false;
        this.listData = new MatTableDataSource(data);
        if(data.length >0){
          this.no_data = true;
        }else{
          this.no_data = false;
        }
        this.listData.sort = this.MatSort;
        this.listData.paginator = this.paginator;
  
        // console.log(data)
      }, (error)=>{
        this.load_data = true;
        this.no_data = false;
        this.searchBan = false
        console.log('Error en materiales: ',error);      }
    );
  
  }

  EnableDisableProyecto(id:number, activo:boolean){
    const dataActivar = {
      IdProyecto : id,
      Activo : activo
    }
    this.proyecto_s.EnableDisableProyecto(dataActivar).subscribe(
      (data:any)=>{
          // this.getListarDistrito();
          this.toastr.successToastr(data[0].Message, 'Correcto!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          
          });
          // console.log(data)
        //this.ngOnInit();
      },(error)=>{
        this.toastr.errorToastr('Ocurrio un error.', 'Error!', {
          toastTimeout: 2000,
          showCloseButton: true,
          animate: 'fade',
          progressBar: true
        });       
        console.log(error);
      }
    )
  }

  deleteProyecto(idProyecto:number){
    console.log(idProyecto)
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.id = idProyecto;
    modalRef.componentInstance.tipo = 17;
    modalRef.componentInstance.titulo = 'Eliminar Proyecto';
    modalRef.componentInstance.descripcion = '¿Esta seguro de eliminar los elementos seleccionados?';
    modalRef.componentInstance.msgloading = 'Eliminando...';
    modalRef.result.then((result)=>{
  
      console.log('Eliminacion:',result);
  
      this.getListarProyectos();
    },(reason)=>{
      console.log(reason);
    });
    this.ngOnInit();
  }

  UpdateModal(item) {
    const modalRef = this.modalService.open(UpdateProyectoModalComponent, { size: 'ms' });
    modalRef.componentInstance.item = item;
    modalRef.result.then((result) => {
      this.getListarProyectos();
    }, (reason) => {
     console.log(reason);
    }); 
  }

  SaveModal(item) {
    const modalRef = this.modalService.open(SaveProyectoModalComponent, { size: 'ms' });
    modalRef.componentInstance.item = item;
    modalRef.result.then((result) => {
      this.getListarProyectos();
    }, (reason) => {
     console.log(reason);
    }); 
  }

}