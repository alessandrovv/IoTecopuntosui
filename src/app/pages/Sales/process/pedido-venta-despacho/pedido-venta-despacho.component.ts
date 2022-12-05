import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrManager } from "ng6-toastr-notifications";
import { Subscription } from "rxjs";
import { Navigation } from "src/app/modules/auth/_core/interfaces/navigation";
import { DeletePedidoVentaDespachoModalComponent } from "src/app/pages/_shared/delete-pedido-venta-despacho-modal/delete-pedido-venta-despacho-modal.component";
import { PermissionViewActionService } from "../../../../Shared/services/permission-view-action.service";
import { MultitablaService } from "../../../_core/services/multitabla.service";
import { PedidoVentaService } from "../../_core/pedido-venta.service";
import { StockEcommerceService } from "../../_core/stock-ecommerce.service";

@Component({
    selector: 'app-pedido-venta-despacho',
    templateUrl: './pedido-venta-despacho.component.html',
    styleUrls: ['./pedido-venta-despacho.component.scss']
})
export class PedidoVentaDespachoComponent implements OnInit {
    searchBan: boolean = false;
    filterGroup: FormGroup;
    searchGroup: FormGroup;
    listData: MatTableDataSource<any>;
    displayedColumns: string[] = [
        "Nro",
        "actions",
        'Estado',
        "Codigo",
        "Cliente",
        "FechaEmision",
        "Total"
    ];
    @ViewChild(MatSort) MatSort: MatSort;
    @ViewChild("matPaginator", { static: true }) paginator: MatPaginator;

    private subscriptions: Subscription[] = [];
    validViewAction = this.pvas.validViewAction;
    viewsActions: Array<Navigation> = [];
    fechaActual: any;
    mesActual: any;
    dtFechaActual: any;
    fechaMesAnterior: any;
    array_estado: any;
    array_establecimiento: any = [];

    constructor(
        private fb: FormBuilder,
        private modalService: NgbModal,
        private chgRef: ChangeDetectorRef,
        private multitabla_s: MultitablaService,
        public pvas: PermissionViewActionService,
        public toastr: ToastrManager,
        public pedido_venta_s: PedidoVentaService,
        public stock_ecommerce_s: StockEcommerceService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.listData = new MatTableDataSource([]);
        this.viewsActions = this.pvas.get();
        this.fechaActual = new Date().toLocaleDateString("EN-CA");
        this.dtFechaActual = new Date();
        this.dtFechaActual.setMonth(this.dtFechaActual.getMonth() - 1);
        this.fechaMesAnterior = this.dtFechaActual.toLocaleDateString("EN-CA");
        this.filterForm();
        this.searchForm();
        this.getEstados(0);
        this.getEstablecimiento(0);
        this.getListaPedidosVenta(this.fechaMesAnterior, this.fechaActual, 0, 0);
    }

    filterForm() {
        this.filterGroup = this.fb.group({
            Desde: [this.fechaMesAnterior],
            Hasta: [this.fechaActual],
            Establecimiento: [null],
            Estado: [null],
            // Cliente: [null],
        });
    }

    searchForm() {
        this.searchGroup = this.fb.group({
            searchTerm: [""],
        });
    }

    search() {
        if (this.searchGroup.controls.searchTerm.value == null) {
            this.searchGroup.controls.searchTerm.setValue("");
        }
        this.listData.filter = this.searchGroup.controls.searchTerm.value
            .trim()
            .toLowerCase();
        if (this.listData.paginator) {
            this.listData.paginator.firstPage();
        }
    }

    getEstablecimiento(valor) {
        this.stock_ecommerce_s.GetComboEstablecimientos().subscribe(
            (data: any) => {
                this.array_establecimiento = data;
                this.array_establecimiento.unshift({
                    idEstablecimiento: 0, nombre: 'Todos'
                });
                this.filterGroup.controls.Establecimiento.setValue(
                    valor
                );
                this.chgRef.markForCheck();
            }
        )
    }


    getEstados(valor) {
        this.pedido_venta_s.GetEstadosPedidoVentaDespacho().subscribe(
            (data: any) => {
                this.array_estado = data;
                this.array_estado.unshift({
                    valor: 0,
                    nombre: "Todos",
                });
                this.filterGroup.controls.Estado.setValue(valor);
            },
            (error) => {
                console.log(error);
                this.searchBan = false;
            }
        );
    }

    getListaPedidosVenta(desde, hasta, establecimiento, estado) {
        if (estado != null && establecimiento != null) {
            this.listData = new MatTableDataSource([]);
            this.searchBan = false;
            this.pedido_venta_s
                .GetPedidosVentaDespacho(desde, hasta, establecimiento, estado)
                .subscribe(
                    (data: any) => {
                        this.searchBan = false;
                        this.listData = new MatTableDataSource(data);
                        this.listData.sort = this.MatSort;
                        this.listData.paginator = this.paginator;
                    },
                    (error: any) => {
                        console.log(error);
                    }
                );
        }
    }

    

    verPedidoVentaDespacho(id) {
        this.router.navigate(["Sales/process/pedidoVentaDespacho/ver"], {
            queryParams: {
                id: id,
            },
        });
    }

    


    deletePedidoVentaDespacho(id) {
        const modalRef = this.modalService.open(DeletePedidoVentaDespachoModalComponent);
        modalRef.componentInstance.id = id;
        modalRef.componentInstance.titulo = 'Eliminar pedido ';
        modalRef.componentInstance.descripcion = 'Esta seguro de eliminar el Pedido seleccionado?';
        modalRef.componentInstance.msgloading = 'Eliminando Pedido...';
        modalRef.componentInstance.service = () => {
            // return this.establecimiento_s.DeleteCliente(idCliente);
        };
        modalRef.result.then((result) => {
            this.getListaPedidosVenta(this.filterGroup.controls['Desde'].value, this.filterGroup.controls['Hasta'].value, this.filterGroup.controls['Establecimiento'].value, this.filterGroup.controls['Estado'].value);
        }, (reason) => {
            console.log(reason);
        });
    }

    
}
