import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
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
import { ProveedorService } from "../../_core/services/proveedor.service";
import { MultitablaService } from "../../../_core/services/multitabla.service";
import { DocumentoCompraService } from "../../_core/services/documento-compra.service";
// import { CambiarEstadoComponent } from "./cambiar-estado/cambiar-estado.component";

@Component({
  selector: "app-documento-compra",
  templateUrl: "./documento-compra.component.html",
  styleUrls: ["./documento-compra.component.scss"],
})
export class DocumentoCompraComponent implements OnInit {
  // variables tabla
  searchBan: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = [
    "Nro",
    "actions",
    "Estado",
    "Anticipo",
    "Codigo",
    "OrdenCompra",
    "Proveedor",
    "FechaEmision",
    "TipoDocumento",
    "Documento",
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
  array_proveedores: any;

  constructor(
    private fb: FormBuilder,
    private proveedor_s: ProveedorService,
    private modalService: NgbModal,
    private chgRef: ChangeDetectorRef,
    private multitabla_s: MultitablaService,
    private documentoCompra_s: DocumentoCompraService,
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
    this.getProveedores(0);
    this.getListaDocumentosCompra(
      this.fechaMesAnterior,
      this.fechaActual,
      0,
      0
    );
  }

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

  addDocumentoCompra() {
    this.router.navigate(["Logistica/process/DocumentoCompra/add"]);
  }

  editDocumentoCompra(idDocumentoCompra) {
    this.router.navigate(["Logistica/process/DocumentoCompra/edit"], {
      queryParams: {
        id: idDocumentoCompra,
      },
    });
  }

  verDocumentoCompra(idDocumentoCompra) {
    this.router.navigate(["Logistica/process/DocumentoCompra/ver"], {
      queryParams: {
        id: idDocumentoCompra,
      },
    });
  }

  cerrarDocumentoCompra(idDocumentoCompra, cerrar) {
    this.modalService
      .open(cerrar, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          if (result) {
            this.documentoCompra_s
              .CambiarEstadoDocumentoCompra(idDocumentoCompra, "0003") //C
              .subscribe(
                (data: any) => {
                  if (data[0].Ok > 0) {
                    this.toastr.successToastr(data[0].Message, "Correcto!", {
                      toastTimeout: 2000,
                      showCloseButton: true,
                      animate: "fade",
                      progressBar: true,
                    });
                    const controls = this.filterGroup.controls;
                    this.getListaDocumentosCompra(
                      controls.Desde.value,
                      controls.Hasta.value,
                      controls.Estado.value,
                      controls.Proveedor.value
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

  anularDocumentoCompra(idDocumentoCompra, anular) {
    this.modalService
      .open(anular, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          if (result) {
            this.documentoCompra_s
              .CambiarEstadoDocumentoCompra(idDocumentoCompra, "0002") //AN
              .subscribe(
                (data: any) => {
                  if (data[0].Ok > 0) {
                    this.toastr.successToastr(data[0].Message, "Correcto!", {
                      toastTimeout: 2000,
                      showCloseButton: true,
                      animate: "fade",
                      progressBar: true,
                    });
                    const controls = this.filterGroup.controls;
                    this.getListaDocumentosCompra(
                      controls.Desde.value,
                      controls.Hasta.value,
                      controls.Estado.value,
                      controls.Proveedor.value
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

  copiarDocumentoCompra(idDocumentoCompra) {
    this.router.navigate(["Logistica/process/DocumentoCompra/copy"], {
      queryParams: {
        id: idDocumentoCompra,
      },
    });
  }

  getListaDocumentosCompra(fechaDesde, fechaHasta, Estado, Proveedor) {
    if (Proveedor != null && Estado != null) {
      let array_lista: any = [];
      this.listData = new MatTableDataSource([]);
      this.searchBan = false;
      this.documentoCompra_s
        .GetDocumentosCompra(fechaDesde, fechaHasta, Estado, Proveedor)
        .subscribe(
          (data: any) => {
            array_lista = data[0];
            this.searchBan = false;
            this.listData = new MatTableDataSource(array_lista);
            this.listData.sort = this.MatSort;
            this.listData.paginator = this.paginator;
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  getEstados(valor) {
    this.documentoCompra_s.GetEstadoDocumentoCompra().subscribe(
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
}
