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
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
import { SaveUpdateTarifaComponent } from './save-update-tarifa/save-update-tarifa.component';
import { TarifaService } from '../../_core/services/tarifa.service';
import { UtilService } from 'src/app/pages/_shared/util.service';

@Component({
  selector: 'app-tarifa',
  templateUrl: './tarifa.component.html',
  styleUrls: ['./tarifa.component.scss']
})
export class TarifaComponent implements OnInit {

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
  arrayVigencia = [];
  arrayActividad = [];

  
  arrayTabla = [];
  displayedColumns:string[] = ['Nro', 'RUTA', 'CLIENTE', 'INICIO', 'FIN','COSTO', 'MONEDA', 'VIGENCIA', 'ACTIVO','OPCIONES'];
  @ViewChild(MatSort) MatSort:MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

  constructor(
    private fb:FormBuilder,
    private modalService: NgbModal,
    public multitabla_s: MultitablaService,
    public pvas: PermissionViewActionService,
    private tarifa_s : TarifaService,
    public toastr: ToastrManager,
    private util_S : UtilService,
  ) { }

  ngOnInit(): void {
    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();
    this.getFiltroActividad();
    this.filterForm();
    this.searchForm();
    this.getRutas();
    this.getVigencia();
    console.log(this.arrayActividad)
  }

  getVigencia(){
    this.arrayVigencia.push("Todos")
    this.arrayVigencia.push("SI");
    this.arrayVigencia.push("NO");
  }
  getFiltroActividad(){
    this.arrayActividad.push({
      clave: null,
      valor: "Todos"
    });
    this.arrayActividad.push({
      clave: true,
      valor: "Activos"
    });
    this.arrayActividad.push({
      clave: false,
      valor: "Inactivos"
    });

  }

  getRutas(){
    this.listData = new MatTableDataSource([]);
    this.searchBan = false;
    this.load_data =false;
    this.no_data = true;
    this.tarifa_s.getTarifas().subscribe(
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

    var todos = false;
    try {
      todos = this.filterGroup.controls.Actividad.value["$ngOptionLabel"].trim().toLowerCase() == "todos"? true : false; 
    } catch (error) {
      todos = false
    }

    try {
      if( todos || this.filterGroup.controls.Actividad.value == null){
        this.arrayTabla[1] = this.arrayTabla[0];
      }else{
        this.arrayTabla[1] = this.arrayTabla[0].filter((elemento) => {
          return elemento.activo == this.filterGroup.controls.Actividad.value;
        });      }
    } catch (error) {
      this.arrayTabla[1] = this.arrayTabla[0];
    }
    this.dataFiltrada();
  }

  filterForm(){
    this.filterGroup = this.fb.group({
      Vigencia:['Todos'],
      Actividad:['Todos'],
    });
  }

  dataFiltrada(){
    var data_1 = this.arrayTabla[1].filter((elemento) => {
      return this.arrayTabla[2].includes(elemento);
    });

    this.listData.data = data_1;
  }


  searchByVigencia(){
    try {
      if(this.filterGroup.controls.Vigencia.value.trim().toLowerCase() == 'todos' || this.filterGroup.controls.Vigencia.value == null){
        this.arrayTabla[2] = this.arrayTabla[0];
      }else{
        this.arrayTabla[2] = this.arrayTabla[0].filter((elemento) => {
          return elemento.vigente.trim().toLowerCase() == this.filterGroup.controls.Vigencia.value.trim().toLowerCase() ;
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

  deletePuntoTransporte(idTarifa:number){
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.id = idTarifa;
    modalRef.componentInstance.tipo = 17;
    modalRef.componentInstance.titulo = 'Eliminar Tarifa';
    modalRef.componentInstance.descripcion = '¿Esta seguro de eliminar la tarifa seleccionada?';
    modalRef.componentInstance.msgloading = 'Eliminando Tarifa...';
    modalRef.result.then((result)=>{
      this.getRutas();
    },(reason)=>{
      console.log(reason);
    });
  }
  
  enableDisable(id:number, activo:boolean){
    const dataActivar = {
      idTarifa : id,
      activo : activo
    }    
    this.tarifa_s.enableDisableTarifa(dataActivar).subscribe(
      (data:any)=>{
        console.log(data);
        this.util_S.viewExito(data[0].Success, data[0].Message);
      },(error)=>{
        this.util_S.viewError(error);
      }
    )
  }

  saveUpdate(item, idItem:number) {
    if(item != null){
      item.idTarifa = idItem;
    }
    const modalRef = this.modalService.open(SaveUpdateTarifaComponent, { size: 'ms' });
    modalRef.componentInstance.item = item;
    modalRef.result.then((result) => {
      this.getRutas();
    }, (reason) => {
     console.log(reason);
    }); 
  }

}
