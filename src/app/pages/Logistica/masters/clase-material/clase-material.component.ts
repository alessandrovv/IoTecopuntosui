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
import { SaveUpdateClaseMaterialModalComponent } from './save-update-clase-material-modal/save-update-clase-material-modal.component';


@Component({
  selector: 'app-clase-material',
  templateUrl: './clase-material.component.html',
  styleUrls: ['./clase-material.component.scss']
})
export class ClaseMaterialComponent implements OnInit {


  load_data:boolean = true;
  no_data:boolean = false;
  searchBan:boolean = false;
  filterGroup:FormGroup;
  searchGroup:FormGroup;
  listData:MatTableDataSource<any>;
  displayedColumns:string[] = ['Nro', 'OPCIONES', 'ACTIVO', 'CATEGORIA', 'SUBCATEGORIA', 'NOMBRE', 'DESCRIPCION'];
  @ViewChild(MatSort) MatSort:MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

  constructor(
    private fb:FormBuilder,
    private modalService: NgbModal,
    private claseMaterialService: ClaseMaterialService,
    public material_s:MaterialService,
    public multitabla_s: MultitablaService,
    public pvas: PermissionViewActionService,
    public toastr: ToastrManager,
    private router: Router
  ) { }

  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];
  array_dataList:any;
  array_subcategorias:any;
  arrayCategorias:any;

  ngOnInit(): void {
    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();

    this.filterForm();
    this.searchForm();
    this.getCategorias();
    this.getClasesMateriales();
    this.getSubcategorias(0);
  }

  getCategorias(){
    this.filterGroup.controls.Categoria.reset();
    this.material_s.GetCategorias().subscribe(
      (data:any)=>{
        this.arrayCategorias = data;
        this.arrayCategorias.unshift({
          Categoria:'0',
          NombreCategoria:'Todos'
        });
        this.filterGroup.controls.Categoria.setValue("Todos")
      },(error)=>{
        console.log('Error en subcategorias: ',error);
      }
    );
  }


  getSubcategorias(categoria){

    if(categoria == undefined){
      categoria = 0;
    }

    this.filterGroup.controls.Subcategoria.reset();
    this.material_s.GetSubcategorias(categoria).subscribe(
      (data:any)=>{
        this.array_subcategorias = data;
        this.array_subcategorias.unshift({
          Subcategoria:'0',
          Categoria:'0',
          NombreSubcategoria:'Todos'
        });
        this.filterGroup.controls.Subcategoria.setValue("Todos")
      },(error)=>{
        console.log('Error en subcategorias: ',error);
      }
    );
  }



  getClasesMateriales(){
    this.listData = new MatTableDataSource([]);
    this.searchBan = false;
    this.load_data =false;
    this.no_data = true;

    this.claseMaterialService.getClaseMaterial().subscribe(
      (data:any) => {
        // console.log(data);
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

  searchCategoria(){


    var cat =  this.filterGroup.controls.Categoria.value

    try {
      this.arrayCategorias.forEach(x=>{
        if(cat == x.Categoria){
          cat = x.NombreCategoria;
        }
      })
      if(cat.trim().toLowerCase() == 'todos' || cat == null){
        cat = '';
      }
    } catch (error) {
      cat = '';
    }

    this.listData.filter = cat.trim().toLowerCase(); 
    if(this.listData.paginator){
      this.listData.paginator.firstPage();
    }
  }

  setCategoria(subCat: string){
    var idCat;
    this.array_subcategorias.forEach(x=>{
      if(x.NombreSubcategoria == subCat){
        idCat = x.Categoria
      }
    })

    this.arrayCategorias.forEach(x=>{
      if(x.Categoria == idCat){
        this.filterGroup.controls.Categoria.setValue(x.NombreCategoria)
      }
    })
  }


  searchSubCategoria(subCat){

    if(this.filterGroup.controls.Categoria.value != undefined){
      this.searchCategoria();
    }

    this.setCategoria(subCat);    

    console.log(this.filterGroup.controls.Subcategoria.value)

    try {
      if(subCat.trim().toLowerCase() == 'todos' || subCat == null){
        subCat = '';
      }
    } catch (error) {
      subCat = '';
    }

    this.listData.filter = subCat.trim().toLowerCase(); 
    if(this.listData.paginator){
      this.listData.paginator.firstPage();
    }
  }

  filterForm(){
    this.filterGroup = this.fb.group({
      Categoria:['Todos'],
      Subcategoria:['Todos'],
    });
  }

  searchForm(){
    this.searchGroup = this.fb.group({
      searchTerm:[''],
    });
  }

  deleteClaseMaterial(idClaseMaterial:number){

    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.id = idClaseMaterial;
    modalRef.componentInstance.tipo = 7;
    modalRef.componentInstance.titulo = 'Eliminar Clase de Material';
    modalRef.componentInstance.descripcion = '¿Esta seguro de eliminar la clase de material seleccionado?';
    modalRef.componentInstance.msgloading = 'Eliminando clase material...';
    modalRef.result.then((result)=>{

      console.log('Eliminacion:',result);

      this.getClasesMateriales();
    },(reason)=>{
      console.log(reason);
    });
    this.ngOnInit();
  }
  
  enableDisableClaseMaterial(id:number, activo:boolean){


    const dataActivar = {
      Material : id,
      EsActivo : activo
    }
    

    this.claseMaterialService.enableDisableClaseMaterial(dataActivar).subscribe(
      (data:any)=>{
          this.getClasesMateriales();
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

  saveUpdate(item) {
    const modalRef = this.modalService.open(SaveUpdateClaseMaterialModalComponent, { size: 'ms' });
    modalRef.componentInstance.item = item;
    modalRef.result.then((result) => {
      this.getClasesMateriales();
    }, (reason) => {
     console.log(reason);
    }); 
  }


  
  addRuta() {    
    this.router.navigate(['/Logistica/masters/claseMaterial/add']);
  }
  editRuta(Categoria) {    
    this.router.navigate(['/Logistica/masters/claseMaterial/edit'],{
      queryParams: {
        id: Categoria
      }
      });
  }

}
