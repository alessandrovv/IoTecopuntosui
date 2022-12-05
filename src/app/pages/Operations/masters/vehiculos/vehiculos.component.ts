import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { Subscription } from 'rxjs';
import { ToastrManager } from 'ng6-toastr-notifications';
import { PermissionViewActionService } from 'src/app/Shared/services/permission-view-action.service';
import { Router } from '@angular/router';
import { ProveedorService } from '../../../Logistica/_core/services/proveedor.service';
import { VehiculoService } from '../../_core/services/vehiculo.service';
import { SaveUpdateVehiculoComponent } from './save-update-vehiculo/save-update-vehiculo.component';
import { DeleteVehiculoModalComponent } from 'src/app/pages/_shared/delete-vehiculo-modal/delete-vehiculo-modal.component';


@Component({
    selector: 'app-vehiculos',
    templateUrl: './vehiculos.component.html',
    styleUrls: ['./vehiculos.component.scss']
})
export class VehiculosComponent implements OnInit {

    load_data: boolean = true;
    no_data: boolean = false;
    searchBan: boolean = false;
    filterGroup: FormGroup;
    searchGroup: FormGroup;

    //Recordar usar para un siguiente filtro por estados Activo, Inactivo y Todos.
    array_estado: any = [
        { value: -1, descripcion: 'Todos' },
        { value: 1, descripcion: 'Activo' },
        { value: 0, descripcion: 'Inactivo' }
    ];
    array_proveedores: any;
    array_procedencia: any;

    listData: MatTableDataSource<any>;
    displayedColumns: string[] = ['Nro', 'Codigo', 'Placa', 'Procedencia', 'Proveedor', 'TipoVehiculo', 'Activo', 'Operaciones'];

    @ViewChild(MatSort) MatSort: MatSort;
    @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

    private subscriptions: Subscription[] = [];
    validViewAction = this.pvas.validViewAction;
    viewsActions: Array<Navigation> = [];

    constructor(
        private modalService: NgbModal,
        private fb: FormBuilder,
        public toastr: ToastrManager,
        public pvas: PermissionViewActionService,
        private router: Router,
        private proveedor_s: ProveedorService,
        private vehiculo_s: VehiculoService) {
    }

    ngOnInit(): void {
        this.listData = new MatTableDataSource([]);
        this.viewsActions = this.pvas.get();
        console.log(this.viewsActions);
        this.filterForm();
        this.searchForm();
        this.getProveedores();
        this.getTipoProcedencia(0);
        this.GetListarVehiculos();
    }

    filterForm() {
        this.filterGroup = this.fb.group({
            Procedencia: [null],
            Proveedor: [null],
            Estado: [-1]
        });
    }

    searchForm() {
        this.searchGroup = this.fb.group({
            searchTerm: [''],
        });
    }

    getTipoProcedencia(valor) {
        let defaultIndex
        this.vehiculo_s.GetTipoProcedencia().subscribe(
            (data: any) => {

                this.array_procedencia = data;
                this.array_procedencia.unshift({
                    valor: '0000',
                    nombre: 'Todos',
                });
                if (this.array_procedencia.length > 1) {
                    defaultIndex = data[0].valor;
                    this.filterGroup.controls.Procedencia.setValue(defaultIndex);
                }
            }
        )
    }

    getProveedores() {
        let defaultIndex = 0
        this.vehiculo_s.GetProveedoresTransporte(0).subscribe(
            (data: any) => {

                this.array_proveedores = data;
                this.array_proveedores.unshift({
                    idProveedor: 0,
                    razonSocial: 'Todos',
                    idCategoriaProveedor: 1,
                    categoria: 'Transporte'
                });
                if (this.array_proveedores.length > 1) {
                    defaultIndex = data[0].idProveedor;
                    this.filterGroup.controls.Proveedor.setValue(defaultIndex);
                }

            }
        )
    }

    GetListarVehiculos(idProcedencia = "0000", idProveedor = 0, activo = null) {
        if (activo === 0) {
            activo = false
        }
        

        this.listData = new MatTableDataSource([]);
        this.searchBan = false;
        this.load_data = false;
        this.no_data = true;

        this.vehiculo_s.GetListarVehiculos(idProcedencia, idProveedor, activo).subscribe(
            (data: any) => {
        
                this.load_data = true;
                this.searchBan = false;
                this.listData = new MatTableDataSource(data);
                if (data.length > 0) {
                    this.no_data = true;
                } else {
                    this.no_data = false;
                }
                this.listData.sort = this.MatSort;
                this.listData.paginator = this.paginator;
               
            }, (errorServicio) => {
                console.log(errorServicio);
                this.load_data = true;
                this.no_data = false;
                this.searchBan = false;
            }
        );
    }

    addVehiculo() {
        this.router.navigate(['Operations/masters/vehiculos/add']);
    }

    edit(idVehiculo) {
        this.router.navigate(['Operations/masters/vehiculos/edit'], {
            queryParams: {
                id: idVehiculo
            }
        });
    }

    delete(id: number) {
        const modalRef = this.modalService.open(DeleteVehiculoModalComponent);
        modalRef.componentInstance.id = id;
        // modalRef.componentInstance.tipo = 3;
        modalRef.componentInstance.titulo = 'Eliminar Vehiculo';
        modalRef.componentInstance.descripcion = 'Esta seguro de eliminar el Vehiculo seleccionado?';
        modalRef.componentInstance.msgloading = 'Eliminando Vehiculo...';
        modalRef.result.then((result) => {
            this.GetListarVehiculos();
        }, (reason) => {
            console.log(reason);
        });
    }

    search() {
        if (this.searchGroup.controls.searchTerm.value == null) {
            this.searchGroup.controls.searchTerm.setValue('');
        }
        this.listData.filter = this.searchGroup.controls.searchTerm.value.trim().toLowerCase();
        if (this.listData.paginator) {
            this.listData.paginator.firstPage();
        }
    }

    enabledDisabledVehiculo(item) {
        this.vehiculo_s.EnableDisableVehiculo(item.idVehiculo, !item.activo).subscribe(
        	(data: any) => {
        		if (data[0].Ok > 0) {
        			this.GetListarVehiculos(
                        this.filterGroup.controls.Procedencia.value
                        , this.filterGroup.controls.Proveedor.value
                        , this.filterGroup.controls.Estado.value
                    );
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

        	}, (errorServicio) => {
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
