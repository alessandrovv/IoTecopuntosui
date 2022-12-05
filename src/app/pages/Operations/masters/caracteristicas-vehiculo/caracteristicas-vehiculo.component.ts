import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionViewActionService } from '../../../../Shared/services/permission-view-action.service';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { ObjetoCaracteristicasVehiculoService } from './serviceCaracteristicas/objeto-caracteristicas-vehiculo.service';
import { CaracteristicasVehiculoService } from '../../_core/services/caracteristicas-vehiculo.service';
import { DeleteCaracteristicasVehiculoModalComponent } from 'src/app/pages/_shared/delete-caracteristicas-vehiculo-modal/delete-caracteristicas-vehiculo-modal.component';
import { DeleteModalComponent } from 'src/app/pages/_shared/delete-customer-modal/delete-modal.component';
@Component({
  selector: 'app-caracteristicas-vehiculo',
  templateUrl: './caracteristicas-vehiculo.component.html',
  styleUrls: ['./caracteristicas-vehiculo.component.scss']
})
export class CaracteristicasVehiculoComponent implements OnInit {

  load_data:boolean = true;
  actividadControl = "Todos"
  no_data:boolean = false;
  searchBan:boolean = false;
  searchGroup:FormGroup;
  listData:MatTableDataSource<any>;
  displayedColumns:string[] = ['Nro', 'NOMBRE', 'DESCRIPCION','ACTIVO','OPCIONES'];
  @ViewChild(MatSort) MatSort:MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

  constructor(
    private fb:FormBuilder,
    private modalService: NgbModal,
    private caracterisitcas_s: CaracteristicasVehiculoService,
    public pvas: PermissionViewActionService,
    public toastr: ToastrManager,
    private caractVehiculo: ObjetoCaracteristicasVehiculoService,
    private router: Router
  ) { }

  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];
  array_dataList:any;
  array_actividad= [];

  ngOnInit(): void {
    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();

    this.searchForm();
    this.getFiltroActividad();
    this.getCaracteristicasMaterial();
  }

  getFiltroActividad(){
    this.array_actividad.push("Todos")
    this.array_actividad.push("Activos");
    this.array_actividad.push("Inactivos");

  }

  getCaracteristicasMaterial(){
    this.listData = new MatTableDataSource([]);
    this.searchBan = false;
    this.load_data =false;
    this.no_data = true;

    this.caracterisitcas_s.getCaracteristicaVehiculo().subscribe(
      (data:any) => {
        this.load_data = true;
        this.searchBan = false;
        console.log(data)
        this.listData = new MatTableDataSource(data);
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
    if(this.listData.paginator){
      this.listData.paginator.firstPage();
    }
  }

  searchByActividad(tipoActividad:string){

    var actividad;
    if(tipoActividad.trim().toLocaleLowerCase() == "todos"){
      actividad = "";
    }else if(tipoActividad.trim().toLowerCase() == 'inactivos'){
      actividad = "false";
    }else{
      actividad = "true";
    }

    this.listData.filter = actividad;
    if(this.listData.paginator){
      this.listData.paginator.firstPage();
    }
  }

  searchForm(){
    this.searchGroup = this.fb.group({
      searchTerm:[''],
    });
  }

  delete(idCaracteristicaVehiculo:number){
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.id = idCaracteristicaVehiculo;
    modalRef.componentInstance.tipo = 13;
    modalRef.componentInstance.titulo = 'Eliminar Caracteristica de Material';
    modalRef.componentInstance.descripcion = '¿Esta seguro de eliminar la caracteristica de material seleccionado?';
    modalRef.componentInstance.msgloading = 'Eliminando caracteristica de material...';
    modalRef.result.then((result)=>{

      console.log('Eliminacion:',result);

      this.getCaracteristicasMaterial();
    },(reason)=>{
      console.log(reason);
    });
  }
  
  enableDisable(id:number, activo:boolean){

    const dataActivar = {
      idCaracteristicaMaterial : id,
      Activo : activo
    }    

    this.caracterisitcas_s.enableDisableCaracteristicaVehiculo(dataActivar).subscribe(
      (data:any)=>{
          console.log(data)
          this.getCaracteristicasMaterial();
          if (data[0].Success> 0) {
            this.toastr.successToastr(data[0].Message, 'Correcto!', {
              toastTimeout: 2000,
              showCloseButton: true,
              animate: 'fade',
              progressBar: true
            });
          } else {
            this.toastr.errorToastr(data[0].Message,' FALLIDO', {
              toastTimeout: 2000,
              showCloseButton: true,
              animate: 'fade',
              progressBar: true
            });
          }
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
  save(caracteristica: any){
    this.caractVehiculo.setcaracteristicaVehiculo(caracteristica);
    this.router.navigate(['Operations/masters/caracteristicaVehiculos/add']);
  }

  update(caracteristica: any){
    this.caractVehiculo.setcaracteristicaVehiculo(caracteristica);
    this.router.navigate(['Operations/masters/caracteristicaVehiculos/edit']);
  }
}
