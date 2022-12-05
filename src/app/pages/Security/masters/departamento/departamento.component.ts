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
import { ProvinciaServiceService } from '../../_core/services/provincia-service.service';
import { DeleteModalComponent } from 'src/app/pages/_shared/delete-customer-modal/delete-modal.component';
import { TableResponseModel } from 'src/app/_metronic/shared/crud-table';
import { finalize } from 'rxjs/operators';
import { DepartamentoServiceService } from '../../_core/services/departamento-service.service';
import { SaveUpdateDepartamentoComponent } from './save-update-departamento/save-update-departamento.component';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.scss']
})
export class DepartamentoComponent implements OnInit {

    load_data: boolean = true;
    no_data: boolean = false;
    searchBan: boolean = false;
    filterGroup: FormGroup;
    searchGroup: FormGroup;

    listData: MatTableDataSource<any>;
    displayedColumns: string[] = ['Nro', 'Nombre', 'Pais', 'Estado', 'actions'];

    @ViewChild(MatSort) MatSort: MatSort;
    @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

    private subscriptions: Subscription[] = [];
    validViewAction = this.pvas.validViewAction;
    viewsActions: Array<Navigation> = [];
    array_data: TableResponseModel<any>;
    array_dataList: any;

    array_paises: any;

    constructor(
        private modalService: NgbModal,
        private fb: FormBuilder,
		private multitabla_s: MultitablaService,

        public toastr: ToastrManager,
        public pvas: PermissionViewActionService,
        public departamento_s: DepartamentoServiceService
    ) { }

    ngOnInit(): void {
        this.listData = new MatTableDataSource([]);
        this.viewsActions = this.pvas.get();

        this.filterForm();
        this.searchForm();

        this.getPaises();
        this.getDepartamentos();
    }

    filterForm(){
        this.filterGroup = this.fb.group({
            Pais:['Todos']
        });
    }


    getPaises(){
        this.multitabla_s.GetListarPaises().subscribe(
            (data: any) => {
                // console.log(data);
                this.array_paises = data;
                if(this.array_paises.length > 1){
                    this.array_paises.unshift({
                        Pais: 0, NombrePais: 'Todos'
                    });            
                this.filterGroup.controls.Pais.setValue(1);
                // console.log(data)     
                }else{
                    this.filterGroup.controls.Pais.setValue(this.array_paises[0].Pais);  
                }    
            }, (errorServicio) => {
                console.log(errorServicio);
            }
        );
    }

    getDepartamentos(){
        this.listData = new MatTableDataSource([]);
        this.searchBan = false;
        this.load_data =false;
        this.no_data = true;
    
        this.departamento_s.GetListarDepartamentos(0).subscribe(
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
            // console.log(data);
          }, (error)=>{
            this.load_data = true;
            this.no_data = false;
            this.searchBan = false
            console.log('Error en provincias: ',error);      }
        );
    }

    enabledDisabledDepartamento(item) {
        // console.log(item);
        this.departamento_s.EnableDisableDepartamento(item.idDepartamento, !item.activo).subscribe(
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
        console.log(item);
        const modalRef = this.modalService.open(SaveUpdateDepartamentoComponent, { size: 'ms' });
        modalRef.componentInstance.item = item;
        modalRef.result.then((result) => {
            this.getDepartamentos();
        }, (reason) => {
            console.log(reason);
        }); 
    }

    deleteDepartamento(idDepartamento:number){

        const modalRef = this.modalService.open(DeleteModalComponent);
        modalRef.componentInstance.id = idDepartamento;
        modalRef.componentInstance.tipo = 50;
        modalRef.componentInstance.titulo = 'Eliminar Departamento';
        modalRef.componentInstance.descripcion = '¿Esta seguro de eliminar el departamento seleccionado?';
        modalRef.componentInstance.msgloading = 'Eliminando departamento...';
        modalRef.result.then((result)=>{
    
          console.log('Eliminacion:',result);
    
          this.getDepartamentos();
        },(reason)=>{
          console.log(reason);
        });
        this.ngOnInit();
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
        try {
            this.array_paises.forEach(x=>{
                if(pais == x.Pais){
                    pais = x.NombrePais;
                    // console.log(pais);
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
        }else{
            this.listData=null;
            this.load_data = false;
        }
    }

    

    
    
    

    


}
