import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { Subscription } from "rxjs";
import { NgbModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { PermissionViewActionService } from "../../../../Shared/services/permission-view-action.service";
import { Navigation } from "src/app/modules/auth/_core/interfaces/navigation";
import { ToastrManager } from "ng6-toastr-notifications";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { MultitablaService } from "../../../_core/services/multitabla.service";
import { PedidoVentaService } from "../../_core/pedido-venta.service";
import { AnularPedidoVentaModalComponent } from './anular-pedido-venta-modal/anular-pedido-venta-modal.component';
import { TrabajadorService } from '../../../Talento/_core/services/trabajador.service';
import { CerrarPedidoVentaModalComponent } from './cerrar-pedido-venta-modal/cerrar-pedido-venta-modal.component';

@Component({
  selector: "app-pedido-venta",
  templateUrl: "./pedido-venta.component.html",
  styleUrls: ["./pedido-venta.component.scss"],
})
export class PedidoVentaComponent implements OnInit {
  searchBan: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = [
    "Nro",
    "actions",
    "Estado",
    "Codigo",
    "Cliente",
    "FechaEmision",
    "TipoDocumento",
    "FormaPago",
    "MedioPago",
    "FechaEntrega",
    "Moneda",
    "Total",
    "Empleado",
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
  array_clientes: any;
  array_trabajadores: any;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private chgRef: ChangeDetectorRef,
    private multitabla_s: MultitablaService,
    public pvas: PermissionViewActionService,
    public toastr: ToastrManager,
    public pedido_venta_s: PedidoVentaService,
    public trabajador_s: TrabajadorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();
    this.fechaActual = new Date().toLocaleDateString("EN-CA");
    this.dtFechaActual = new Date();
    this.dtFechaActual.setMonth(this.dtFechaActual.getMonth() - 1);
    this.fechaMesAnterior = this.dtFechaActual.toLocaleDateString("EN-CA");
    this.filterForm();
    this.searchForm();
    this.getClientes(0);
    this.getTrabajadores(0);
    this.getEstados(0);
    this.getListaPedidosVenta(this.fechaMesAnterior, this.fechaActual, 0, 0, 0);
  }

  filterForm() {
    this.filterGroup = this.fb.group({
      Desde: [this.fechaMesAnterior],
      Hasta: [this.fechaActual],
      Estado: [null],
      Cliente: [null],
      Trabajador: [null],
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

  getClientes(valor) {
    this.pedido_venta_s.GetClientes().subscribe(
      (data: any) => {
        this.array_clientes = data;
        this.array_clientes.unshift({
          idCliente: 0,
          razonSocial: "Todos",
        });
        this.filterGroup.controls.Cliente.setValue(valor);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getEstados(valor) {
    this.pedido_venta_s.GetEstadosPedidoVenta().subscribe(
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

  getTrabajadores(valor) {
    this.trabajador_s.GetTrabajadoresList(0, 0, 0, 1).subscribe(
      (data: any) => {
        this.array_trabajadores = data;
        this.array_trabajadores.unshift({
          idTrabajador: 0,
          NombresApellidos: "Todos"
        });
        if (valor !== null) {
          this.filterGroup.controls.Trabajador.setValue(valor);
        }
      },
      (errorServicio) => {
        console.log(errorServicio);
      }
    );
  }

  getListaPedidosVenta(desde, hasta, estado, cliente, trabajador) {
    if (estado != null && cliente != null && trabajador!=null) {
      this.listData = new MatTableDataSource([]);
      this.searchBan = false;
      this.pedido_venta_s
        .GetPedidosVenta(desde, hasta, estado, cliente, trabajador)
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

  addPedidoVenta() {
    this.router.navigate(["Sales/process/PedidoVenta/add"]);
  }

  editPedidoVenta(id) {
    this.router.navigate(["Sales/process/PedidoVenta/edit"], {
      queryParams: {
        id: id,
      },
    });
  }

  verPedidoVenta(id) {
    this.router.navigate(["Sales/process/PedidoVenta/ver"], {
      queryParams: {
        id: id,
      },
    });
  }

  cerrarPedidoVenta(id) {
    const modalRef = this.modalService.open(CerrarPedidoVentaModalComponent, {
      size: "xl"
    });
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      (result) => {
        if (result) {
          this.getListaPedidosVenta(
            this.filterGroup.controls.Desde.value,
            this.filterGroup.controls.Hasta.value,
            this.filterGroup.controls.Estado.value,
            this.filterGroup.controls.Cliente.value,
            this.filterGroup.controls.Trabajador.value
          );
        }
      }, (reason) => {
        console.log(reason);
      }
    );
  }

  anularPedidoVenta(id) {
    const modalRef = this.modalService.open(AnularPedidoVentaModalComponent, {
      size: "lg",
    });
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      (result) => {
        if (result) {
          this.getListaPedidosVenta(
            this.filterGroup.controls.Desde.value,
            this.filterGroup.controls.Hasta.value,
            this.filterGroup.controls.Estado.value,
            this.filterGroup.controls.Cliente.value,
            this.filterGroup.controls.Trabajador.value
          );
        }
      },
      (reason) => {
        console.log(reason);
      }
    );
  }

  copiarPedidoVenta(id) {}
}