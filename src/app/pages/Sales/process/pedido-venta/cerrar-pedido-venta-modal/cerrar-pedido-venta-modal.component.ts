import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Subscription } from 'rxjs';
import { CustomersService } from '../../../../../modules/e-commerce/_services/fake/customers.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Navigation } from '../../../../../modules/auth/_core/interfaces/navigation';
import { PermissionViewActionService } from '../../../../../Shared/services/permission-view-action.service';
import { variable } from '@angular/compiler/src/output/output_ast';
import { PedidoVentaService } from '../../../_core/pedido-venta.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: "app-cerrar-pedido-venta-modal",
  templateUrl: "./cerrar-pedido-venta-modal.component.html",
  styleUrls: ["./cerrar-pedido-venta-modal.component.scss"],
  providers: [
    DatePipe,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class CerrarPedidoVentaModalComponent implements OnInit {
  @Input() id: any;
  idPedidoVenta: number;
  estadoPedido: any;
  hide_load: any = false;

  searchBanDocVenta: boolean = false;
  searchBanNotaSalida: boolean = false;
  searchBanResumen: boolean = false;

  searchDocVenta: FormGroup;
  searchNotaSalida: FormGroup;
  searchResumen: FormGroup;

  listDocVenta: MatTableDataSource<any>;
  listNotasSalida: MatTableDataSource<any>;
  listResumen: MatTableDataSource<any>;

  columnasDocVenta: string[] = [
    "Nro",
    "Estado",
    "Codigo",
    "Cliente",
    "FechaEmision",
    "TipoDocumento",
    "Documento",
    "Moneda",
    "Total",
  ];
  columnasNotas: string[] = [
    "Nro",
    "Estado",
    "Codigo",
    "FechaContable",
    "Material",
    "Cantidad",
    "CostoUnit",
    "CostoTotal",
    "UnidadMedida",
  ];
  columnasResumen: string[] = [
    "Nro",
    "Material",
    "CantidadOC",
    "CantidadDC",
    "CantidadIngresada",
    "CantidadPorIngresar",
    "UnidadMedida",
  ];

  @ViewChild(MatSort) MatSort: MatSort;

  @ViewChild("matPaginatorDV", { static: true }) paginatorDV: MatPaginator;
  @ViewChild("matPaginatorNS", { static: true }) paginatorNS: MatPaginator;
  @ViewChild("matPaginatorRE", { static: true }) paginatorRE: MatPaginator;

  constructor(
    private customersService: CustomersService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    public toastr: ToastrManager,
    private pedido_venta_s: PedidoVentaService,
    private chgRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.idPedidoVenta = this.id;
    this.filterDocVenta();
    this.filterNotaSalida();
    this.filterResumen();
    this.getDataPedidoVenta(this.idPedidoVenta);
  }

  /* DOCUMENTO DE VENTA */
  filterDocVenta() {
    this.searchDocVenta = this.fb.group({
      searchDoc: [""],
    });
  }

  searchTableDocVenta() {
    if (this.searchDocVenta.controls.searchDoc.value == null) {
      this.searchDocVenta.controls.searchDoc.setValue("");
    }
    this.listDocVenta.filter = this.searchDocVenta.controls.searchDoc.value
      .trim()
      .toLowerCase();
    if (this.listDocVenta.paginator) {
      this.listDocVenta.paginator.firstPage();
    }
  }

  /* NOTA DE SALIDA */
  filterNotaSalida() {
    this.searchNotaSalida = this.fb.group({
      searchNota: [""],
    });
  }

  searchTableNotas() {
    if (this.searchNotaSalida.controls.searchDoc.value == null) {
      this.searchNotaSalida.controls.searchDoc.setValue("");
    }
    this.listNotasSalida.filter = this.searchNotaSalida.controls.searchDoc.value
      .trim()
      .toLowerCase();
    if (this.listNotasSalida.paginator) {
      this.listNotasSalida.paginator.firstPage();
    }
  }

  /* RESUMEN */
  filterResumen() {
    this.searchResumen = this.fb.group({
      searchRes: [""],
    });
  }

  searchTableResumen() {
    if (this.searchResumen.controls.searchDoc.value == null) {
      this.searchResumen.controls.searchDoc.setValue("");
    }
    this.listResumen.filter = this.searchResumen.controls.searchDoc.value
      .trim()
      .toLowerCase();
    if (this.listResumen.paginator) {
      this.listResumen.paginator.firstPage();
    }
  }

  getDataPedidoVenta(idPedidoVenta) {
    this.listDocVenta = new MatTableDataSource([]);
    this.listNotasSalida = new MatTableDataSource([]);
    this.listResumen = new MatTableDataSource([]);
    this.pedido_venta_s.GetDocNotasPedidoVenta(idPedidoVenta).subscribe(
      (data: any) => {
        let array_doc_venta = data[0];
        let array_nota_salida = data[0];
        let array_resumen = data[0];

        this.searchBanDocVenta = false;
        this.searchBanNotaSalida = false;
        this.searchBanResumen = false;

        this.listDocVenta = new MatTableDataSource(array_doc_venta);
        this.listNotasSalida = new MatTableDataSource(array_nota_salida);
        this.listResumen = new MatTableDataSource(array_resumen);

        this.listDocVenta.sort = this.MatSort;
        this.listNotasSalida.sort = this.MatSort;
        this.listResumen.sort = this.MatSort;

        this.listDocVenta.paginator = this.paginatorDV;
        this.listNotasSalida.paginator = this.paginatorNS;
        this.listResumen.paginator = this.paginatorRE;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  cerrarPedidoVenta() {
    this.hide_load = true;
    this.pedido_venta_s.CerrarPedidoVenta(this.idPedidoVenta).subscribe(
      (data: any) => {
        console.log(data);
        this.hide_load = false;
        if (data[0].Ok == 1) {
          this.toastr.successToastr(data[0].Message, "Operación exitosa!", {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: "fade",
            progressBar: true,
          });
          this.modal.close(true);
        } else {
          this.toastr.errorToastr(
            data[0].Message,
            "No se pudo completar la acción!",
            {
              toastTimeout: 2000,
              showCloseButton: true,
              animate: "fade",
              progressBar: true,
            }
          );
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
