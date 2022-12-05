import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MultitablaService } from 'src/app/pages/_core/services/multitabla.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PermissionViewActionService } from '../../../../Shared/services/permission-view-action.service';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SaveUpdateProvinciaComponent } from './save-update-provincia/save-update-provincia.component';
import { ProvinciaServiceService } from '../../_core/services/provincia-service.service';
import { DeleteModalComponent } from 'src/app/pages/_shared/delete-customer-modal/delete-modal.component';
import { TableResponseModel } from 'src/app/_metronic/shared/crud-table';
import { finalize } from 'rxjs/operators';
import { DepartamentoServiceService } from '../../_core/services/departamento-service.service';

@Component({
  selector: 'app-provincia',
  templateUrl: './provincia.component.html',
  styleUrls: ['./provincia.component.scss']
})
export class ProvinciaComponent implements OnInit {

    load_data: boolean = true;
    no_data: boolean = false;
    searchBan: boolean = false;
    filterGroup: FormGroup;
    searchGroup: FormGroup;

    listData: MatTableDataSource<any>;
    displayedColumns: string[] = ['Nro', 'Nombre', 'Pais','Departamento', 'Estado', 'actions'];
      
    @ViewChild(MatSort) MatSort: MatSort;
    @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

    private subscriptions: Subscription[] = [];
    validViewAction = this.pvas.validViewAction;
    viewsActions: Array<Navigation> = [];
    array_data: TableResponseModel<any>;
    array_dataList: any;

    array_paises: any;
    array_departamentos: any;

    constructor(
        private modalService: NgbModal,
        private fb: FormBuilder,
		private multitabla_s: MultitablaService,
        public departamento_s: DepartamentoServiceService,
        public toastr: ToastrManager,
        public pvas: PermissionViewActionService,
        public provincia_s: ProvinciaServiceService
    ) { }


    ngOnInit(): void {
        this.listData = new MatTableDataSource([]);
        this.viewsActions = this.pvas.get();

        // this.getProvincias();
        this.filterForm();
        this.searchForm();
        this.getPaises();
        this.getDepartamentos(0);
		this.getProvincias();

        
    }

    getPaises(){
        this.filterGroup.controls.Pais.reset();
        this.multitabla_s.GetListarPaises().pipe(
            finalize( () => {
                // console.log(this.filterGroup.controls.Pais.value);
				this.getDepartamentos(this.filterGroup.controls.Pais.value);
                
            })
            ).subscribe(
                (data: any) => {
                    // console.log(data);
                    this.array_paises = data;
                    if(this.array_paises.length > 1){
                        this.array_paises.unshift({
                        Pais: 0, NombrePais: 'Todos'
                });            
                this.filterGroup.controls.Pais.setValue(1);     
            }else{
              this.filterGroup.controls.Pais.setValue(this.array_paises[0].Pais);  
            }    
            }, (errorServicio) => {
      
                  console.log(errorServicio);
              }
          );
        
    }

    getProvincias(){
        this.listData = new MatTableDataSource([]);
        this.searchBan = false;
        this.load_data =false;
        this.no_data = true;
    
        this.provincia_s.GetListarProvincias().subscribe(
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
          }, (error)=>{
            this.load_data = true;
            this.no_data = false;
            this.searchBan = false
            console.log('Error en provincias: ',error);      }
        );
    
    }

    enabledDisabledProvincia(item) {
        // console.log(item);
        this.provincia_s.EnableDisableProvincia(item.idProvincia, !item.activo).subscribe(
        (data:any) => {
        if (data[0].Success > 0) {
            // this.getProvincias();
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

    saveUpdate(item) {
        // console.log(item);
        const modalRef = this.modalService.open(SaveUpdateProvinciaComponent, { size: 'ms' });
        modalRef.componentInstance.item = item;
        modalRef.result.then((result) => {
          this.getProvincias();
        }, (reason) => {
         console.log(reason);
        }); 
    }

    getDepartamentos(idPais) {
        // console.log(idPais)

        if(idPais == undefined){
            idPais = 0;
          }
      
          this.filterGroup.controls.Departamento.reset();
          this.departamento_s.GetListarDepartamentos(idPais).subscribe(
            (data:any)=>{
              this.array_departamentos = data;
              this.array_departamentos.unshift({
                idDepartamento:'0',
                idPais:'0',
                nombreDepartamento:'Todos'
              });
            //   console.log(data);
              this.filterGroup.controls.Departamento.setValue("Todos")
            },(error)=>{
              console.log('Error en subcategorias: ',error);
            }
        );
    }
    
    deleteProvincia(idProvincia:number){

        const modalRef = this.modalService.open(DeleteModalComponent);
        modalRef.componentInstance.id = idProvincia;
        modalRef.componentInstance.tipo = 40;
        modalRef.componentInstance.titulo = 'Eliminar Provincia';
        modalRef.componentInstance.descripcion = '¿Esta seguro de eliminar la provincia seleccionado?';
        modalRef.componentInstance.msgloading = 'Eliminando provincia...';
        modalRef.result.then((result)=>{
    
          console.log('Eliminacion:',result);
    
          this.getProvincias();
        },(reason)=>{
          console.log(reason);
        });
        this.ngOnInit();
    }
    
    filterForm(){
      this.filterGroup = this.fb.group({
        Pais:['Todos'],
        Departamento:['Todos'],
      });
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

    searchPais(){
        var pais =  this.filterGroup.controls.Pais.value
        console.log(pais)
    
        try {
            this.array_paises.forEach(x=>{
                if(pais == x.Pais){
                    pais = x.NombrePais;
                }
            })
            if(pais.trim().toLowerCase() == 'todos' || pais == null){
                pais = '';
            }

        } catch (error) {
            pais = '';
        }
    
        this.listData.filter = pais.trim().toLowerCase(); 
        if(this.listData.paginator){
            this.listData.paginator.firstPage();
        }

        // console.log(this.listData.data)
    }

    setPais(dpto: string){
        // console.log(dpto)
        var idPais;
        this.array_departamentos.forEach(x=>{
          if(x.nombreDepartamento == dpto){
            idPais = x.idPais
          }
        })
    
        this.array_paises.forEach(x=>{
          if(x.Pais == idPais){
            this.filterGroup.controls.Pais.setValue(x.Pais)
          }
        })
    }

    searchDepartamento(dpto){

        if(this.filterGroup.controls.Pais.value != undefined){
          this.searchPais();
        }
    
        this.setPais(dpto);    
    
        // console.log(this.filterGroup.controls.Departamento.value)
    
        try {
          if(dpto.trim().toLowerCase() == 'todos' || dpto == null){
            dpto = '';
          }
        } catch (error) {
            dpto = '';
        }
    
        this.listData.filter = dpto.trim().toLowerCase(); 
        if(this.listData.paginator){
          this.listData.paginator.firstPage();
        }
    }

  

}

