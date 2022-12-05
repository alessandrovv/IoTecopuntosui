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
import { DistritoServiceService } from '../../_core/services/distrito-service.service';
import { SaveUpdateDistritoModalComponent } from './update-distrito-modal/update-distrito-modal.component';
import { NewDistritoModalComponent } from  './new-distrito-modal/new-distrito-modal.component';

@Component({
  selector: 'app-distrito',
  templateUrl: './distrito.component.html',
  styleUrls: ['./distrito.component.scss']
})
export class DistritoComponent implements OnInit {
  
  load_data:boolean = true;
  no_data:boolean = false;
  searchBan:boolean = false;
  filterGroup:FormGroup;
  searchGroup:FormGroup;
  listData:MatTableDataSource<any>;
  displayedColumns:string[] = ['Nro', 'DISTRITOS', 'PROVINCIA', 'DEPARTAMENTO', 'PAIS','ACTIVO','OPCIONES'];
  @ViewChild(MatSort) MatSort:MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

    private subscriptions: Subscription[] = [];
    validViewAction = this.pvas.validViewAction;
    viewsActions: Array<Navigation> = [];
    array_data: TableResponseModel<any>;
    array_dataList: any;

    array_paises: any =[];
    array_departamentos: any =[];
    array_provincias: any =[]; 

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    public toastr: ToastrManager,
    public pvas: PermissionViewActionService,
    public multitabla_s: MultitablaService,
    private router: Router,
    public distrito_s: DistritoServiceService,
    private claseDistritoService: DistritoServiceService,
  ) { }

  ngOnInit(): void {
        this.listData = new MatTableDataSource([]);
        this.viewsActions = this.pvas.get();
        
        //this.search();
        this.filterForm();
        this.searchForm();
        this.getPaises();

        this.getListarDistrito();
        
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

  filterForm(){
    this.filterGroup = this.fb.group({
      Pais:[null],
      Departamento:[null],
      Provincia:[null],
    });
  }

  searchForm(){
    this.searchGroup = this.fb.group({
      searchTerm:[''],
    });
  }
  


searchPaises(){


  var dist =  this.filterGroup.controls.Pais.value

  try {
    this.array_paises.forEach(x=>{
      if(dist == x.Pais){
        dist = x.NombrePais;
      }
    })
    if(dist.trim().toLowerCase() == 'todos' || dist == null){
      dist = '';
    }
  } catch (error) {
    dist = '';
  }

  this.listData.filter = dist.trim().toLowerCase(); 
  if(this.listData.paginator){
    this.listData.paginator.firstPage();
  }
}

searchDepartamentos(){


  var dist =  this.filterGroup.controls.Departamento.value

  try {
    this.array_departamentos.forEach(x=>{
      if(dist == x.Departamento){
        dist = x.NombreDepartamento;
      }
    })
    if(dist.trim().toLowerCase() == 'todos' || dist == null){
      dist = '';
    }
  } catch (error) {
    dist = '';
  }

  this.listData.filter = dist.trim().toLowerCase(); 
  if(this.listData.paginator){
    this.listData.paginator.firstPage();
  }
}

searchProvincia(){


  var dist =  this.filterGroup.controls.Provincia.value

  try {
    this.array_provincias.forEach(x=>{
      if(dist == x.Provincia){
        dist = x.NombreProvincia;
      }
    })
    if(dist.trim().toLowerCase() == 'todos' || dist == null){
      dist = '';
    }
  } catch (error) {
    dist = '';
  }

  this.listData.filter = dist.trim().toLowerCase(); 
  if(this.listData.paginator){
    this.listData.paginator.firstPage();
  }
}

/*LISTAR TABLA DISTRITOS*/

getListarDistrito(){
  this.listData = new MatTableDataSource([]);
  this.searchBan = false;
  this.load_data =false;
  this.no_data = true;

  this.claseDistritoService.GetListarDistritos().subscribe(
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

EnableDisableDistrito(id:number, activo:boolean){
  const dataActivar = {
    IdDistrito : id,
    Activo : activo
  }
  this.claseDistritoService.EnableDisableDistrito(dataActivar).subscribe(
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

deleteDistrito(idDistrito:number){
  // console.log(idDistrito)
  const modalRef = this.modalService.open(DeleteModalComponent);
  modalRef.componentInstance.id = idDistrito;
  modalRef.componentInstance.tipo = 99;
  modalRef.componentInstance.titulo = 'Eliminar Distrito';
  modalRef.componentInstance.descripcion = '¿Esta seguro de eliminar los elementos seleccionado?';
  modalRef.componentInstance.msgloading = 'Eliminando...';
  modalRef.result.then((result)=>{

    console.log('Eliminacion:',result);

    this.getListarDistrito();
  },(reason)=>{
    console.log(reason);
  });
  this.ngOnInit();
}


  saveUpdate(item) {
    // console.log(item)
    const modalRef = this.modalService.open(SaveUpdateDistritoModalComponent, { size: 'ms' });
    modalRef.componentInstance.item = item;
    modalRef.result.then((result) => {
      this.getListarDistrito();
    }, (reason) => {
     console.log(reason);
    }); 
}

  newmodal(item) {
    // console.log(item)
    const modalRef = this.modalService.open(NewDistritoModalComponent, { size: 'ms' });
    modalRef.componentInstance.item = item;
    modalRef.result.then((result) => {
      this.getListarDistrito();
    }, (reason) => {
    console.log(reason);
    }); 
  }




getPaises() {
  this.filterGroup.controls.Pais.reset();
  this.multitabla_s.GetListarPaises().pipe(
    finalize(() => {

      this.getDepartamentos(this.filterGroup.controls.Pais.value);
    })
  ).subscribe(
    (data: any) => {
      this.array_paises = data;
      console.log(this.array_paises);
      if(this.array_paises.length > 0){
        this.array_paises.unshift({
          Pais: 0, 
          NombrePais: 'Todos'
        });            
        this.filterGroup.controls.Pais.setValue(1);     
      // }else{
      //   this.filterGroup.controls.Pais.setValue(this.array_paises[0].Pais);  
      }
    }, (errorServicio) => {
      console.log(errorServicio);
    }
  );
}

getDepartamentos(Pais) {
  console.log("Pais: " + Pais);

    this.filterGroup.controls.Departamento.setValue(null);
  if (Pais != null) {
    this.multitabla_s.GetListarDepartamentos(Pais).pipe(
      finalize(() => {
        
        if (this.filterGroup.controls.Pais.value === 1) {
          this.getProvincias(this.filterGroup.controls.Departamento.value);
        } else {
          this.getProvincias(-1);
        }
      })
    ).subscribe(
      (data:any) => {
        console.log(data);          
        this.array_departamentos = data;          
          this.array_departamentos.unshift({
            Departamento: 0, NombreDepartamento: 'Todos'
          });                   
        this.filterGroup.controls.Departamento.setValue(
          this.array_departamentos[0].Departamento
        );   
      }, ( errorServicio ) => {           
        console.log(errorServicio);
      }
    );
     } 
     else {
    this.array_departamentos = [];
    this.filterGroup.controls.Provincia.setValue(null);
    this.getProvincias(null);}
  }
 

getProvincias(Departamento) {
  console.log("Departamento: " + Departamento);
  this.filterGroup.controls.Provincia.setValue(null);
  
  if (Departamento != null) {
    this.multitabla_s.GetListarProvincia(Departamento).pipe(
      finalize(() => {       
      })
    ).subscribe(
      (data: any) => {
        this.array_provincias = data;
        console.log(this.array_provincias);

        this.array_provincias.unshift({
          Provincia: 0, NombreProvincia: 'Todos'
        });
        this.filterGroup.controls.Provincia.setValue(
          this.array_provincias[0].Provincia
        );

      }, (errorServicio) => {

        console.log(errorServicio);
      }
    );
  } else {
    this.array_provincias = [];
  }
}

}


