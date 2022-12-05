import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { Subscription } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PermissionViewActionService } from "../../../../Shared/services/permission-view-action.service";
import { Navigation } from "src/app/modules/auth/_core/interfaces/navigation";
import { ToastrManager } from "ng6-toastr-notifications";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { NotaAlmacenService } from "../../_core/services/nota-almacen.service";

@Component({
  selector: "app-nota-almacen",
  templateUrl: "./nota-almacen.component.html",
  styleUrls: ["./nota-almacen.component.scss"],
})
export class NotaAlmacenComponent implements OnInit {
  /* Variables para la tabla de notas de almacen */
  searchBan: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = [
    "Nro",
    "actions",
    "Estado",
    "Codigo",
    "FechaContable",
    "TipoNota",
    "TipoOperacion",
    "TipoDocumento",
    "Documento",
    "Establecimiento",
    "Empleado",
  ];
  @ViewChild(MatSort) MatSort: MatSort;
  @ViewChild("matPaginator", { static: true }) paginator: MatPaginator;

  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];

  /* Variables de filtro */
  fechaActual: any;
  mesActual: any;
  dtFechaActual: any;
  fechaMesAnterior: any;
  array_estado: any;
  array_tipo_nota: any;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private chgRef: ChangeDetectorRef,
    private nota_almacen_s: NotaAlmacenService,
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
    this.getEstados(0);
    this.getTipoNotas(0);
    this.getListaNotasAlmacen(this.fechaMesAnterior, this.fechaActual, 0, 0);
  }

  /* Inicializar filtros */
  filterForm() {
    this.filterGroup = this.fb.group({
      Desde: [this.fechaMesAnterior],
      Hasta: [this.fechaActual],
      Estado: [null],
      TipoNota: [null],
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

  /* Botones de nota de almacen */
  addNotaEntrada() {
    this.router.navigate(["Logistica/process/NotaAlmacen/Entrada/add"]);
  }

  addNotaSalida() {
    this.router.navigate(["Logistica/process/NotaAlmacen/Salida/add"]);
  }

  verNotaEntrada(idNotaAlmacen) {
    this.router.navigate(["Logistica/process/NotaAlmacen/Entrada/ver"], {
      queryParams: {
        id: idNotaAlmacen,
      },
    });
  }

  verNotaSalida(idNotaAlmacen) {
    this.router.navigate(["Logistica/process/NotaAlmacen/Salida/ver"], {
      queryParams: {
        id: idNotaAlmacen,
      },
    });
  }

  anularNotaAlmacen(idNotaAlmacen, content) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          if (result) {
            this.nota_almacen_s.AnularNotaEntrada(idNotaAlmacen).subscribe(
              (data: any) => {
                if (data[0].Ok == 1) {
                  this.toastr.successToastr(data[0].Message, "Correcto!", {
                    toastTimeout: 2000,
                    showCloseButton: true,
                    animate: "fade",
                    progressBar: true,
                  });
                  const controls = this.filterGroup.controls;
                  this.getListaNotasAlmacen(
                    controls.Desde.value,
                    controls.Hasta.value,
                    controls.Estado.value,
                    controls.TipoNota.value
                  );
                  this.chgRef.markForCheck();
                } else {
                  this.toastr.errorToastr(data[0].Message, "Error!", {
                    toastTimeout: 2000,
                    showCloseButton: true,
                    animate: "fade",
                    progressBar: true,
                  });
                }
              },
              (error: any) => {
                console.log(error);
              }
            );
          }
        },
        (reason) => {
          console.log(reason);
        }
      );
  }

  /* Listar las notas de almacen */
  getListaNotasAlmacen(fechaDesde, fechaHasta, estado, tipoNota) {
    if (estado != null && tipoNota != null) {
      this.listData = new MatTableDataSource([]);
      this.searchBan = false;
      this.nota_almacen_s
        .GetNotasAlmacen(fechaDesde, fechaHasta, estado, tipoNota)
        .subscribe(
          (data: any) => {
            this.searchBan = false;
            this.listData = new MatTableDataSource(data[0]);
            this.listData.sort = this.MatSort;
            this.listData.paginator = this.paginator;
          },
          (error: any) => {
            console.log(error);
          }
        );
    }
  }

  /* Listar combos de filtros */
  getEstados(valor) {
    this.nota_almacen_s.GetEstadoNotaAlmacen().subscribe(
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

  getTipoNotas(valor) {
    this.nota_almacen_s.GetTipoNotas().subscribe(
      (data: any) => {
        this.array_tipo_nota = data;
        this.array_tipo_nota.unshift({
          valor: 0,
          nombre: "Todos",
        });
        this.filterGroup.controls.TipoNota.setValue(valor);
      },
      (error: any) => {
        console.log(error);
        this.searchBan = false;
      }
    );
  }
}
