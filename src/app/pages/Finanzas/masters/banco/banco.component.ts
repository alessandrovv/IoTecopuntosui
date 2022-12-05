import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MultitablaService } from 'src/app/pages/_core/services/multitabla.service';
import { PermissionViewActionService } from 'src/app/Shared/services/permission-view-action.service';
import { BancoServiceService } from '../../_core/services/banco-service.service';
import { DeleteModalComponent } from 'src/app/pages/_shared/delete-customer-modal/delete-modal.component';
import { SaveUpdateBancoComponent } from './save-update-banco/save-update-banco.component';

@Component({
  selector: 'app-banco',
  templateUrl: './banco.component.html',
  styleUrls: ['./banco.component.scss']
})

export class BancoComponent implements OnInit {
    formDatosPersonales: FormGroup;
    load_data: boolean = true;
    no_data: boolean = false;
    searchBan: boolean = false;
    filterGroup: FormGroup;
    searchGroup: FormGroup;
    listData: MatTableDataSource<any>;
    displayedColumns: string[] = [ 'Nro', 'Codigo', 'Nombre','Activo', 'actions'];

    @ViewChild(MatSort) MatSort: MatSort;
    @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

    private subscriptions: Subscription[] = [];
    validViewAction = this.pvas.validViewAction;
    viewsActions: Array<Navigation> = [];
    array_dataList: any;

    constructor(
        private fb: FormBuilder,
        private modalService: NgbModal,
        public banco_s: BancoServiceService,
        public multitabla_s: MultitablaService,
        public pvas: PermissionViewActionService,
        public toastr: ToastrManager,
    ) {}

    ngOnInit(): void {
        this.listData = new MatTableDataSource([]);
        this.viewsActions = this.pvas.get();

        this.searchForm();
        this.getBancos();
    }

    searchForm() {
        this.searchGroup = this.fb.group({
          searchTerm: [''],
        });    
    }

    getBancos() {
        this.listData = new MatTableDataSource([]);
        this.searchBan = false;
        this.load_data = false;
        this.no_data = true;
    
        this.banco_s.GetBancos().subscribe(
            (data:any) => {
                this.load_data = true;
                this.searchBan = false;
                this.listData = new MatTableDataSource(data);
                if(data.length > 0){
                this.no_data = true;
                }else{
                this.no_data = false;
                }
                // console.log(this.listData);
                this.listData.sort = this.MatSort;
                this.listData.paginator = this.paginator;       
            }, ( errorServicio ) => {
                this.load_data = true;
                this.no_data = false;
                this.searchBan = false;        
            }
         
        );
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

    enabledDisabledBanco(item) {
        // console.log(item);
        this.banco_s.EnableDisableBanco(item.idBanco, !item.activo).subscribe(
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

    deleteBanco(idBanco:number){
        // console.log(idBanco)
        const modalRef = this.modalService.open(DeleteModalComponent);
        modalRef.componentInstance.id = idBanco;
        modalRef.componentInstance.tipo = 18;
        modalRef.componentInstance.titulo = 'Eliminar Banco';
        modalRef.componentInstance.descripcion = '¿Esta seguro de eliminar el banco seleccionado?';
        modalRef.componentInstance.msgloading = 'Eliminando banco...';
        modalRef.result.then((result)=>{
    
          console.log('Eliminacion:',result);
    
          this.getBancos();
        },(reason)=>{
          console.log(reason);
        });
        this.ngOnInit();
    }

    saveUpdate(item) {
        // console.log(item);
        const modalRef = this.modalService.open(SaveUpdateBancoComponent, { size: 'xl' });
        modalRef.componentInstance.item = item;
        modalRef.result.then((result) => {
            this.getBancos();
        }, (reason) => {
            console.log(reason);
        });  
    }

}

