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

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.component.html',
  styleUrls: ['./materiales.component.scss']
})
export class MaterialesComponent implements OnInit {

  load_data:boolean = true;
  no_data:boolean = false;
  searchBan:boolean = false;
  filterGroup:FormGroup;
  searchGroup:FormGroup;
  listData:MatTableDataSource<any>;
  displayedColumns:string[] = ['Nro', 'OPCIONES', 'ACTIVO', 'CODIGO', 'MATERIAL', 'SUBCATEGORIA','CLASE','MARCA','MODELO'];
  @ViewChild(MatSort) MatSort:MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];
  array_dataList:any;
  array_subcategorias:any;
  array_clases:any;

  constructor(
    private fb:FormBuilder,
    private modalService: NgbModal,
    public material_s:MaterialService,
    public multitabla_s: MultitablaService,
    public pvas: PermissionViewActionService,
    public toastr: ToastrManager,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();

    this.filterForm();
    this.searchForm();
    this.getSubcategorias('0');
    this.getClases('0');
    this.getMateriales('0','0');
  }

  buscarSubcategoria(val){
    console.log('Valor: ', val);
    this.array_clases.forEach(item => {
      if(item.Clase == val){
        this.filterGroup.controls.Subcategoria.setValue(item.Subcategoria);
      }
    });
  }

  getSubcategorias(categoria){
    this.filterGroup.controls.Subcategoria.reset();
    this.material_s.GetSubcategorias(categoria).subscribe(
      (data:any)=>{
        console.log('Subcategorias: ', data);
        this.array_subcategorias = data;
        this.array_subcategorias.unshift({
          Subcategoria:'0',
          Categoria:'0',
          NombreSubcategoria:'Todos'
        });
        this.filterGroup.controls.Subcategoria.setValue('0');
      },(error)=>{
        console.log('Error en subcategorias: ',error);
      }
    );
  }

  getClases(subcategoria){
    this.filterGroup.controls.Clase.reset();
    this.material_s.GetClases(subcategoria).subscribe(
      (data:any)=>{
        
        this.array_clases =data;
        this.array_clases.unshift({
          Clase:'0',
          Subcategoria:'0',
          Categoria:'0',
          NombreClase:'Todos'
        });
        this.filterGroup.controls.Clase.setValue('0');
      },(error)=>{
        console.log('Error en clases: ',error);
      }
    );
  }

  getMateriales(subcategoria,clase){
    this.listData = new MatTableDataSource([]);
    this.searchBan = false;
    this.load_data =false;
    this.no_data = true;

    this.material_s.GetMateriales(subcategoria===undefined || subcategoria==null?'0':subcategoria,(clase === undefined || clase===null?'0':clase)).subscribe(
      (data:any)=>{
        console.log('Materiales: ', data);
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
      },(error)=>{
        this.load_data = true;
        this.no_data = false;
        this.searchBan = false
        console.log('Error en materiales: ',error);
      }
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

  filterForm(){
    this.filterGroup = this.fb.group({
      Subcategoria:['0'],
      Clase:['0'],
    });
  }

  searchForm(){
    this.searchGroup = this.fb.group({
      searchTerm:[''],
    });
  }

  addMaterial(){
    this.router.navigate(['Logistica/masters/Materiales/add']);
  }

  editMaterial(idMaterial){
    this.router.navigate(['Logistica/masters/Materiales/edit'],{
      queryParams:{
        id:idMaterial
      }
    });
  }

  deleteMaterial(idMaterial:number){
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.id = idMaterial;
    modalRef.componentInstance.tipo = 6;
    modalRef.componentInstance.titulo = 'Eliminar Material';
    modalRef.componentInstance.descripcion = '¿Esta seguro de eliminar el material seleccionado?';
    modalRef.componentInstance.msgloading = 'Eliminando material...';
    modalRef.result.then((result)=>{
      console.log('Eliminacion:',result);
      this.getMateriales(this.filterGroup.controls.Subcategoria.value,this.filterGroup.controls.Clase.value);
    },(reason)=>{
      console.log(reason);
    });
  }
  
  disabledMaterial(item){
    console.log(item.Activo);
    this.material_s.DeleteDisabledMaterial(item.idMaterial,1,!item.Activo).subscribe(
      (data:any)=>{
        if(data[0].Ok>0){
          this.getMateriales(this.filterGroup.controls.Subcategoria.value,this.filterGroup.controls.Clase.value);
          this.toastr.successToastr(data[0].Message, 'Correcto!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
        }else{
          item.Activo = item.Activo;
          this.toastr.errorToastr(data[0].Message, 'Erroor!', {
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
    )
  }
}
