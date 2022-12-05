import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionViewActionService } from '../../../../Shared/services/permission-view-action.service';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DeleteModalComponent } from '../../../_shared/delete-customer-modal/delete-modal.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MultitablaService } from '../../../_core/services/multitabla.service';
import { PuntosTransporteServiceService } from '../../_core/services/puntos-transporte-service.service';
import { SaveUpdateRutaComponent } from './save-update-ruta/save-update-ruta.component';
import { RutaServiceService } from '../../_core/services/ruta-service.service';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
@Component({
  selector: 'app-ruta',
  templateUrl: './ruta.component.html',
  styleUrls: ['./ruta.component.scss']
})
export class RutaComponent implements OnInit {

  load_data:boolean = true;
  no_data:boolean = false;
  searchBan:boolean = false;
  filtroUbicacion:String = '';
  filtroActividad:String = '';
  filterGroup:FormGroup;
  searchGroup:FormGroup;
  listData:MatTableDataSource<any>;
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];
  dataCompleta:any;
  arrayPuntosTransporte:any;
  arrayPaises:any;
  arrayActividad = [];
  arrayTabla = [];
  displayedColumns:string[] = ['Nro', 'ORIGEN', 'DESTINO', 'DISTANCIA', 'COMBUSTIBLE', 'ACTIVO','OPCIONES'];
  @ViewChild(MatSort) MatSort:MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

  constructor(
    private fb:FormBuilder,
    private modalService: NgbModal,
    private puntoTransporte_s: PuntosTransporteServiceService,
    public multitabla_s: MultitablaService,
    public pvas: PermissionViewActionService,
    private rutas_s : RutaServiceService,
    public toastr: ToastrManager,
  ) { }

  ngOnInit(): void {
    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();
    this.getFiltroActividad();
    this.filterForm();
    this.searchForm();
    this.getRutas();
    this.getUbicaciones();
  }

  getUbicaciones(){
    this.puntoTransporte_s.getPuntosTransporte().subscribe(
      (data:any)=>{
        console.log(data)
        this.arrayPuntosTransporte = data;
        this.arrayPuntosTransporte.unshift({
          Activo: true,​​
          Nombre: "Todos",​​
          NombrePais: "",​​
          Pais: "",
          Ubicacion: "",
          idDepartamento: 0,
          idDistrito: 0,
          idProvincia: 0,
          idPuntoTransporte: 0,
          ipPais: 0
        });
        this.filterGroup.controls.Origen.setValue("Todos")
        this.filterGroup.controls.Destino.setValue("Todos")
      },(error)=>{
        console.log('Error en subcategorias: ',error);
      }
    );
  }

  getRutas(){
    this.listData = new MatTableDataSource([]);
    this.searchBan = false;
    this.load_data =false;
    this.no_data = true;
    this.rutas_s.getRutas().subscribe(
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
    this.listData.filter = this.filtroActividad.trim();
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
      Origen:['Perú'],
      Destino:['Todos'],
      Actividad:['Todos'],
    });
  }

  dataFiltrada(){
    var data_1 = this.arrayTabla[1].filter((elemento) => {
      return this.arrayTabla[2].includes(elemento);
    });

    this.listData.data = data_1;
  }


  searchByOrigen(){
    try {
      if(this.filterGroup.controls.Origen.value.Nombre.trim().toLowerCase() == 'todos' || this.filterGroup.controls.Origen.value == null){
        this.arrayTabla[1] = this.arrayTabla[0];
      }else{
        this.arrayTabla[1] = this.arrayTabla[0].filter((elemento) => {
          return elemento.nombreOrigen.trim().toLowerCase() == this.filterGroup.controls.Origen.value.Nombre.trim().toLowerCase() ;
        });      }
    } catch (error) {
      this.arrayTabla[1] = this.arrayTabla[0];
    }
    this.dataFiltrada();
  }


  searchByDestino(){
    try {
      if(this.filterGroup.controls.Destino.value.Nombre.trim().toLowerCase() == 'todos' || this.filterGroup.controls.Destino.value == null){
        this.arrayTabla[2] = this.arrayTabla[0];
      }else{
        this.arrayTabla[2] = this.arrayTabla[0].filter((elemento) => {
          return elemento.nombreDestino.trim().toLowerCase() == this.filterGroup.controls.Destino.value.Nombre.trim().toLowerCase() ;
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

  deletePuntoTransporte(idRuta:number){
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.id = idRuta;
    modalRef.componentInstance.tipo = 16;
    modalRef.componentInstance.titulo = 'Eliminar Ruta';
    modalRef.componentInstance.descripcion = '¿Esta seguro de eliminar la ruta seleccionada?';
    modalRef.componentInstance.msgloading = 'Eliminando Ruta...';
    modalRef.result.then((result)=>{
      this.getRutas();
    },(reason)=>{
      console.log(reason);
    });
  }
  
  enableDisable(id:number, activo:boolean){
    const dataActivar = {
      idRuta : id,
      activo : activo
    }    
    this.rutas_s.enableDisableRuta(dataActivar).subscribe(
      (data:any)=>{
        console.log(data);
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
    const modalRef = this.modalService.open(SaveUpdateRutaComponent, { size: 'ms' });
    modalRef.componentInstance.item = item;
    modalRef.result.then((result) => {
      this.getRutas();
    }, (reason) => {
     console.log(reason);
    }); 
  }

}
