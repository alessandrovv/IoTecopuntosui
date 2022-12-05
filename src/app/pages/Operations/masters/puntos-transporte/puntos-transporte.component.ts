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
import { DeleteModalComponent } from '../../../_shared/delete-customer-modal/delete-modal.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MultitablaService } from '../../../_core/services/multitabla.service';
import { Router } from '@angular/router';
import { SaveUpdatePuntosTransporteComponent } from './save-update-puntos-transporte/save-update-puntos-transporte.component';
import { PuntosTransporteServiceService } from '../../_core/services/puntos-transporte-service.service';




@Component({
  selector: 'app-puntos-transporte',
  templateUrl: './puntos-transporte.component.html',
  styleUrls: ['./puntos-transporte.component.scss']
})
export class PuntosTransporteComponent implements OnInit {

  load_data:boolean = true;
  no_data:boolean = false;
  searchBan:boolean = false;
  filtroUbicacion:String = '';
  filtroActividad:String = '';
  filterGroup:FormGroup;
  searchGroup:FormGroup;
  listData:MatTableDataSource<any>;
  displayedColumns:string[] = ['Nro', 'NOMBRE', 'PAIS', 'UBICACION', 'ACTIVO','OPCIONES'];
  @ViewChild(MatSort) MatSort:MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

  constructor(
    private fb:FormBuilder,
    private modalService: NgbModal,
    private puntoTransporte_s: PuntosTransporteServiceService,
    public multitabla_s: MultitablaService,
    public pvas: PermissionViewActionService,
    public toastr: ToastrManager,
  ) { }

  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];
  dataCompleta:any;
  arrayUbicaciones:any;
  arrayPaises:any;
  arrayActividad = [];
  arrayTabla = [];


  ngOnInit(): void {
    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();
    this.getFiltroActividad();
    this.filterForm();
    this.searchForm();
    this.getPaises();
    this.getPuntosTransporte();
    this.getUbicaciones(1);

  }


  getPaises(){
    this.filterGroup.controls.Pais.reset();
    this.puntoTransporte_s.getPaises().subscribe(
      (data:any)=>{
        console.log(data)
        this.arrayPaises = data;
        this.filterGroup.controls.Pais.setValue("Perú")
      },(error)=>{
        console.log('Error: ',error);
      }
    );
  }


  getUbicaciones(Pais){
    var idPais = Pais.idPais;
    if(idPais == undefined){
      idPais = 1;
    }

    this.filterGroup.controls.Ubicacion.reset();
    this.puntoTransporte_s.getUbicaciones(idPais).subscribe(
      (data:any)=>{
        console.log(data)
        this.arrayUbicaciones = data;
        this.arrayUbicaciones.unshift({
          Ubicacion: 'Todos',
          idDepartamente: 0,
          idDistrito: 0,
          idProvincia: 0,
          idPais: 0
        });
        this.filterGroup.controls.Ubicacion.setValue("Todos")
      },(error)=>{
        console.log('Error en subcategorias: ',error);
      }
    );
  }


  dataFiltrada(){
    var data_1 = this.arrayTabla[1].filter((elemento) => {
      return this.arrayTabla[2].includes(elemento);
    });

    this.listData.data = data_1;
  }

  getPuntosTransporte(){

    this.listData = new MatTableDataSource([]);
    this.searchBan = false;
    this.load_data =false;
    this.no_data = true;

    this.puntoTransporte_s.getPuntosTransporte().subscribe(
      (data:any) => {
        console.log(data)
        this.load_data = true;
        this.searchBan = false;
        this.listData = new MatTableDataSource(data);
        this.arrayTabla[0] = this.listData.data;
        this.arrayTabla[1] = this.listData.data;
        this.arrayTabla[2] = this.listData.data;
        if(data.length >0){
          this.no_data = true;
        }else{
          this.no_data = false;
        }
        this.listData.sort = this.MatSort;
        this.listData.paginator = this.paginator;
      }, (error)=>{
        this.load_data = true;
        this.no_data = false;
        this.searchBan = false
        console.log('Error en materiales: ',error);      }
    );

  }

  search(){
    if(this.searchGroup.controls.searchTerm.value == null){
      this.searchGroup.controls.searchTerm.setValue('');
    }
    this.listData.filter = this.searchGroup.controls.searchTerm.value.trim().toLowerCase();
    this.filterGroup.controls.Actividad.setValue('Todos')
    if(this.listData.paginator){
      this.listData.paginator.firstPage();
    }
  }

  searchByActividad(){
    
    try {
      if(this.filterGroup.controls.Actividad.value.trim().toLocaleLowerCase() == 'todos' || this.filterGroup.controls.Actividad.value == null){
        this.filtroActividad = '';
      }else if(this.filterGroup.controls.Actividad.value.trim().toLowerCase() == 'inactivos'){
        this.filtroActividad = 'false';
      }else{
        this.filtroActividad = 'true';
      }
    } catch (error) {
      this.filtroActividad = '';
    }
    this.listData.filter = this.filtroActividad.trim()
    ;
    if(this.listData.paginator){
      this.listData.paginator.firstPage();
    }
  }

  getFiltroActividad(){
    this.arrayActividad.push("Todos")
    this.arrayActividad.push("Activos");
    this.arrayActividad.push("Inactivos");

  }

  filterForm(){
    this.filterGroup = this.fb.group({
      Pais:['Perú'],
      Ubicacion:['Todos'],
      Actividad:['Todos'],
    });
  }


  searchByPais(){
    try {
      if(this.filterGroup.controls.Pais.value.Nombre.trim().toLowerCase() == 'todos' || this.filterGroup.controls.Pais.value == null){
        this.arrayTabla[1] = this.arrayTabla[0];
      }else{
        this.arrayTabla[1] = this.arrayTabla[0].filter((elemento) => {
          return elemento.NombrePais.trim().toLowerCase() == this.filterGroup.controls.Pais.value.Nombre.trim().toLowerCase() ;
        });      }
    } catch (error) {
      this.arrayTabla[1] = this.arrayTabla[0];
    }
    this.dataFiltrada();
  }


  searchByUbicacion(){
    try {
      if(this.filterGroup.controls.Ubicacion.value.trim().toLowerCase() == 'todos' || this.filterGroup.controls.Ubicacion.value == null){
        this.arrayTabla[2] = this.arrayTabla[0];
      }else{
        this.arrayTabla[2] = this.arrayTabla[0].filter((elemento) => {
          return elemento.Ubicacion.trim().toLowerCase() == this.filterGroup.controls.Ubicacion.value.trim().toLowerCase() ;
        });      }
    } catch (error) {
      this.arrayTabla[2] = this.arrayTabla[0];
    }
    this.dataFiltrada();
  }

  searchForm(){
    this.searchGroup = this.fb.group({
      searchTerm:[''],
    });
  }

  deletePuntoTransporte(idPuntoTransporte:number){

    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.id = idPuntoTransporte;
    modalRef.componentInstance.tipo = 15;
    modalRef.componentInstance.titulo = 'Eliminar Punto de Transporte';
    modalRef.componentInstance.descripcion = '¿Esta seguro de eliminar el Punto de Transporte seleccionado?';
    modalRef.componentInstance.msgloading = 'Eliminando Punto de Transporte...';
    modalRef.result.then((result)=>{
      this.getPuntosTransporte();
    },(reason)=>{
      console.log(reason);
    });
  }
  
  enableDisable(id:number, activo:boolean){
    const dataActivar = {
      idPuntoTransporte : id,
      Activo : activo
    }    
    this.puntoTransporte_s.enableDisablePuntosTransporte(dataActivar).subscribe(
      (data:any)=>{
          this.getPuntosTransporte();
          this.toastr.successToastr(data[0].Message, 'Correcto!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
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

  saveUpdate(item) {
    const modalRef = this.modalService.open(SaveUpdatePuntosTransporteComponent, { size: 'ms' });
    modalRef.componentInstance.item = item;
    modalRef.result.then((result) => {
      this.getPuntosTransporte();
    }, (reason) => {
     console.log(reason);
    }); 
  }
}
