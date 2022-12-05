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
import { MaterialService } from '../../_core/services/material.service';
import { ClaseMaterialService } from '../../_core/services/clase-material.service';
import { CaracteristicaMaterialService } from '../../_core/services/caracteristica-material.service';
import { CaracteristicaMaterialObjetoService } from './serviciocaracteristicaMaterial/caracteristica-material-objeto.service';
@Component({
  selector: 'app-caracteristica-material',
  templateUrl: './caracteristica-material.component.html',
  styleUrls: ['./caracteristica-material.component.scss']
})
export class CaracteristicaMaterialComponent implements OnInit {

  load_data:boolean = true;
  actividadControl = "Todos"
  no_data:boolean = false;
  searchBan:boolean = false;
  searchGroup:FormGroup;
  listData:MatTableDataSource<any>;
  displayedColumns:string[] = ['Nro', 'OPCIONES', 'ACTIVO', 'NOMBRE', 'DESCRIPCION'];
  @ViewChild(MatSort) MatSort:MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

  constructor(
    private fb:FormBuilder,
    private modalService: NgbModal,
    private claseMaterialService: ClaseMaterialService,
    public material_s:MaterialService,
    public multitabla_s: MultitablaService,
    private caracterisitcas_s: CaracteristicaMaterialService,
    public pvas: PermissionViewActionService,
    public toastr: ToastrManager,
    private caractMat: CaracteristicaMaterialObjetoService,
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

    this.caracterisitcas_s.getCaracteristicaMaterial().subscribe(
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

  delete(idCaracteristicaMaterial:number){
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.id = idCaracteristicaMaterial;
    modalRef.componentInstance.tipo = 8;
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

    this.caracterisitcas_s.enableDisableCaracteristicaMaterial(dataActivar).subscribe(
      (data:any)=>{
          console.log(data)
          this.getCaracteristicasMaterial();
          this.toastr.successToastr(data[0].Message, 'Correcto!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
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
    this.caractMat.setCaracteristicaMaterial(caracteristica);
    this.router.navigate(['Logistica/masters/caracteristicaMateriales/add']);
  }

  update(caracteristica: any){
    this.caractMat.setCaracteristicaMaterial(caracteristica);
    this.router.navigate(['Logistica/masters/caracteristicaMateriales/edit']);
  }
}
