import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionViewActionService } from '../../../../Shared/services/permission-view-action.service';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';

import { ITableState, TableResponseModel } from '../../../../_metronic/shared/crud-table/models/table.model';
import { Certificado } from '../../_core/models/certificado.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrManager } from 'ng6-toastr-notifications';

import { CertificadosService } from '../../_core/services/certificados.service';
import { MultitablaService } from '../../../_core/services/multitabla.service';
import { SaveUpdatePuestoTrabajoComponent } from './save-update-puesto-trabajo/save-update-puesto-trabajo.component';
import { puestoTrabajoService } from '../../_core/services/puestoTrabajo.service';
import { DeleteModalGeneralComponent } from '../../../_shared/delete-modal/delete-modal.component';
import { EmpresaService } from '../../../Security/_core/services/empresa.service';
import { AreaService } from '../../_core/services/area.service';
@Component({
  selector: 'app-puesto-trabajo',
  templateUrl: './puesto-trabajo.component.html',
  styleUrls: ['./puesto-trabajo.component.scss']
})
export class PuestoTrabajoComponent implements OnInit {

   // paginator: PaginatorState;
   load_data: boolean = true;
   no_data: boolean = false;
   searchBan: boolean = false;
   filterGroup: FormGroup;
   searchGroup: FormGroup;
 
   listData: MatTableDataSource<any>;
   displayedColumns: string[] = ['Nro', 'actions', 'Estado', 'Empresa', 'Area' , 'Codigo', 'Nombre', 'Descripcion'];
 
   @ViewChild(MatSort) MatSort: MatSort;
   // @ViewChild(MatPaginator) paginator: MatPaginator;
   @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;
 
   array_estado: any = [
     { value: -1, descripcion: 'Todos' },
     { value: 1, descripcion: 'Activo' },
     { value: 0, descripcion: 'Inactivo' }
   ];
 
   
   private subscriptions: Subscription[] = [];
   validViewAction = this.pvas.validViewAction;
   viewsActions: Array<Navigation> = [];
   array_data: TableResponseModel<Certificado>;
   array_dataList: any;
   array_empresas: any;
   array_areas: any;

   constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    public empresa_s:EmpresaService,
    public area_s:AreaService,
    public multitabla_s : MultitablaService,
    public puestoTrabajo_s : puestoTrabajoService,
    public pvas: PermissionViewActionService,
    public toastr: ToastrManager,
   ) { }
 
   ngOnInit(): void {
     console.log(this.array_estado);
     this.listData = new MatTableDataSource([]);
     this.viewsActions = this.pvas.get();
     console.log(this.viewsActions);
     this.filterForm();
     this.searchForm(); 

     this.getEmpresas();
     this.getArea(0);

     this.getPuestosDeTrabajo(0, 0, '-1');  
   }
  
   getEmpresas() {
    this.empresa_s.GetEmpresaByUsuario().subscribe(
      (data:any) => {        
        this.array_empresas = data;
        if(this.array_empresas.length > 1){
          this.array_empresas.unshift({
            idEmpresa: 0, razonSocial: 'Todos'
          });
        }
        this.filterGroup.controls.Empresa.setValue(this.array_empresas[0].idEmpresa)
      }, ( errorServicio ) => {           
        console.log(errorServicio);
      }
    );
  }

	getArea(Empresa){
      this.filterGroup.controls.Area.reset();
      console.log(Empresa);
         
      this.area_s.GetAreaByUsuario(Empresa).subscribe(
        (data:any) => {                   
          this.array_areas = data;
          if(this.array_areas.length > 1){        
            this.array_areas.unshift({
              Area: 0, NombreArea: 'Todos'
            });
          }
          this.filterGroup.controls.Area.setValue(this.array_areas[0].Area);   
        }, ( errorServicio ) => {
              
          console.log(errorServicio);
        }
      );    
	}


   getPuestosDeTrabajo(empresa, area, estado) {
    this.listData = new MatTableDataSource([]);
    this.searchBan = false;
    this.load_data = false;
    this.no_data = true;

    this.puestoTrabajo_s.GetPuestosDeTrabajo(empresa, (area === null ? '0' : area), estado).subscribe(
      (data:any) => {
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
      }, ( errorServicio ) => {
        this.load_data = true;
        this.no_data = false;
        this.searchBan = false;        
      }
    );

  }
 
   filterForm() {
     this.filterGroup = this.fb.group({
       Empresa: [0],
       Area: [0],
       Estado: [-1],
     });    
   }
 
 
   searchForm() {
     this.searchGroup = this.fb.group({
       searchTerm: [''],
     });    
   }
 
   create(item) {
    const modalRef = this.modalService.open(SaveUpdatePuestoTrabajoComponent, { size: 'ms' });
    modalRef.componentInstance.item = item;
    modalRef.result.then((result) => {
      this.getPuestosDeTrabajo(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Area.value, this.filterGroup.controls.Estado.value);
    }, (reason) => {
     console.log(reason);
    }); 
   }
 
   edit(item) {
    const modalRef = this.modalService.open(SaveUpdatePuestoTrabajoComponent, { size: 'ms' });
    modalRef.componentInstance.item = item;
    modalRef.result.then((result) => {
      this.getPuestosDeTrabajo(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Area.value, this.filterGroup.controls.Estado.value);
    }, (reason) => {
     console.log(reason);
    }); 
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
 
   delete(idPuestoTrabajo: number) {
    const modalRef = this.modalService.open(DeleteModalGeneralComponent);
    modalRef.componentInstance.id = idPuestoTrabajo;
    modalRef.componentInstance.titulo = 'Eliminar Puesto de Trabajo';
    modalRef.componentInstance.descripcion = 'Esta seguro de eliminar el Puesto de Trabajo seleccionado?';
    modalRef.componentInstance.msgloading = 'Eliminando Puesto de Trabajo...';
		modalRef.componentInstance.service = ()=>{
			return this.puestoTrabajo_s.DeletePuestoTrabajo(idPuestoTrabajo);
		};
    modalRef.result.then((result) => {
      this.getPuestosDeTrabajo(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Area.value, this.filterGroup.controls.Estado.value);
    }, (reason) => {
     console.log(reason);
    });  
   }
 
   disabledPuestoDeTrabajo(item) {
    this.puestoTrabajo_s.EnableDisablePuestoTrabajo(item.idPuestoTrabajo,!item.activo).subscribe(
      (data:any) => {
        if (data[0].Success > 0) {
          this.toastr.successToastr(data[0].Message, 'Correcto!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
        } else {
          item.Activo = item.Activo;
          this.toastr.errorToastr(data[0].Message, 'Error!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
        }
               
      }, ( errorServicio ) => { 
        this.toastr.errorToastr('Ocurrio un error.', 'Error!', {
          toastTimeout: 2000,
          showCloseButton: true,
          animate: 'fade',
          progressBar: true
        });       
        console.log(errorServicio);
      }
    ); 
  }

}
