import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { Subscription } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PermissionViewActionService } from "../../../../Shared/services/permission-view-action.service";
import { Navigation } from "src/app/modules/auth/_core/interfaces/navigation";
import { OrdenCompraService } from "../../_core/services/orden-compra.service";
import { ToastrManager } from "ng6-toastr-notifications";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { ProveedorService } from "../../_core/services/proveedor.service";
import { CerrarOrdenCompraModalComponent } from './cerrar-orden-compra-modal/cerrar-orden-compra-modal.component';
import { AnularOrdenCompraModalComponent } from './anular-orden-compra-modal/anular-orden-compra-modal.component';

@Component({
  selector: "app-orden-compra",
  templateUrl: "./orden-compra.component.html",
  styleUrls: ["./orden-compra.component.scss"],
})
export class OrdenCompraComponent implements OnInit {
  /* Variables para la tabla */
  load_data: boolean = true;
  no_data: boolean = false;
  searchBan: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = [
    "Nro",
    "actions",
    "Estado",
    "Codigo",
    "Proveedor",
    "FechaEmision",
    "TipoDocumento",
    "Moneda",
    "Total",
    "Empleado",
  ];
  @ViewChild(MatSort) MatSort: MatSort;
  @ViewChild("matPaginator", { static: true }) paginator: MatPaginator;

  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];

  /* Variables para filtros */
  array_dataList: any;
  fechaActual: any;
  mesActual: any;
  dtFechaActual: any;
  fechaMesAnterior: any;
  array_estado: any;
  array_proveedores: any;

  constructor(
    private fb: FormBuilder,
    private ordenCompra_s: OrdenCompraService,
    private proveedor_s: ProveedorService,
    private modalService: NgbModal,
    public pvas: PermissionViewActionService,
    public toastr: ToastrManager,
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
    this.getProveedores(0);
    this.getEstados(0);
    this.getOrdenesCompraList(this.fechaMesAnterior, this.fechaActual, 0, 0);
  }

  /* Filtros para listar ordenes de compra */
  filterForm() {
    this.filterGroup = this.fb.group({
      Desde: [this.fechaMesAnterior],
      Hasta: [this.fechaActual],
      Estado: [null],
      Proveedor: [null],
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

  /* Nueva orden de Compra */
  addOrdenCompra() {
    this.router.navigate(["Logistica/process/OrdenCompra/add"]);
  }

  /* Editar Orden de compra */
  editOrdenCompra(ordenCompra: number) {
    this.router.navigate(["Logistica/process/OrdenCompra/edit"], {
      queryParams: {
        id: ordenCompra,
      },
    });
  }

  /* copiar una orden de compra */
  copiarOrdenCompra(ordenCompra: number) {
    this.router.navigate(["Logistica/process/OrdenCompra/copy"], {
      queryParams: {
        id: ordenCompra,
      },
    });
  }

  /* Ver una orden de compra */
  verOrdenCompra(ordenCompra: number) {
    this.router.navigate(["Logistica/process/OrdenCompra/ver"], {
      queryParams: {
        id: ordenCompra,
      },
    });
  }

  /* Cerrar una orden de compra */
  cerrarOrdenCompra(ordenCompra: number) {
    const modalRef = this.modalService.open(CerrarOrdenCompraModalComponent, {
      size: "xl",
    });
    modalRef.componentInstance.idOrdenCompra = ordenCompra;
    modalRef.result.then(
      (result) => {
        if (result) {
          this.getOrdenesCompraList(
            this.filterGroup.controls.Desde.value,
            this.filterGroup.controls.Hasta.value,
            this.filterGroup.controls.Estado.value,
            this.filterGroup.controls.Proveedor.value
          );
        }
      },
      (reason) => {
        console.log(reason);
      }
    );
  }

  /* Anular una orden de compra */
  anularOrdenCompra(ordenCompra: number) {
    const modalRef = this.modalService.open(AnularOrdenCompraModalComponent, {
      size: "lg",
    });
    modalRef.componentInstance.idOrdenCompra = ordenCompra;
    modalRef.result.then(
      (result) => {
        if (result) {
          this.getOrdenesCompraList(
            this.filterGroup.controls.Desde.value,
            this.filterGroup.controls.Hasta.value,
            this.filterGroup.controls.Estado.value,
            this.filterGroup.controls.Proveedor.value
          );
        }
      },
      (reason) => {
        console.log(reason);
      }
    );
  }

  /* Filtros combos */
  getEstados(valor) {
    this.ordenCompra_s.GetEstadoOrdenCompra().subscribe(
      (data: any) => {
        this.array_estado = data;
        this.array_estado.unshift({
          valor: 0,
          nombre: "Todos",
        });
        this.filterGroup.controls.Estado.setValue(valor);
      },
      (errorServicio) => {
        console.log(errorServicio);
      }
    );
  }

  getProveedores(valor) {
    this.proveedor_s.GetProveedores(0, 0, 0, 0, 0).subscribe(
      (data: any) => {
        this.array_proveedores = data.filter((e) => e.activo == true);
        this.array_proveedores.unshift({
          idProveedor: 0,
          razonSocial: "Todos",
        });
        this.filterGroup.controls.Proveedor.setValue(valor);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  /* listar ordenes de compras */
  getOrdenesCompraList(fechaDesde, fechaHasta, Estado, Proveedor) {
    if (Estado != null && Proveedor != null) {
      let array_lista: any = [];
      this.listData = new MatTableDataSource([]);
      this.searchBan = false;
      this.load_data = false;
      this.no_data = true;
      this.ordenCompra_s
        .GetListaOrdenCompra(fechaDesde, fechaHasta, Estado, Proveedor)
        .subscribe(
          (data: any) => {
            array_lista = data[0];
            this.load_data = true;
            this.searchBan = false;
            this.listData = new MatTableDataSource(array_lista);
            if (array_lista.length > 0) {
              this.no_data = true;
            } else {
              this.no_data = false;
            }
            this.listData.sort = this.MatSort;
            this.listData.paginator = this.paginator;
          },
          (errorServicio) => {
            console.log(errorServicio);
            this.load_data = true;
            this.no_data = false;
            this.searchBan = false;
          }
        );
    }
  }
}
