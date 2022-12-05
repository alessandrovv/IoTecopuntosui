import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CustomersService } from '../../../../../modules/e-commerce/_services/fake/customers.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { OrdenCompraService } from '../../../_core/services/orden-compra.service';

@Component({
  selector: "app-cerrar-orden-compra-modal",
  templateUrl: "./cerrar-orden-compra-modal.component.html",
  styleUrls: ["./cerrar-orden-compra-modal.component.scss"],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class CerrarOrdenCompraModalComponent implements OnInit {
  /* Variables generales */
  @Input() idOrdenCompra: number;
  estadoOrden: any;
  hide_load: any = false;

  /* Variables tabla DC */
  searchBanDC: boolean = false;
  searchDC: FormGroup;
  listaDataDC: MatTableDataSource<any>;
  columnasDC: string[] = [
    "Nro",
    "EstadoDC",
    "AnticipoDC",
    "CodigoDC",
    "ProveedorDC",
    "FechaEmisionDC",
    "TipoDocumentoDC",
    "DocumentoDC",
    "MonedaDC",
    "TotalDC",
  ];
  @ViewChild("matPaginatorDC", { static: true }) paginatorDC: MatPaginator;

  /* Variables tabla NE */
  searchBanNE: boolean = false;
  searchNE: FormGroup;
  listaDataNE: MatTableDataSource<any>;
  columnasNE: string[] = [
    "Nro",
    "EstadoNE",
    "CodigoNE",
    "FechaContableNE",
    "MaterialNE",
    "CantidadNE",
    "CostoUnitNE",
    "CostoTotalNE",
    "UnidadMedidaNE",
  ];
  @ViewChild("matPaginatorNE", { static: true }) paginatorNE: MatPaginator;

  /* Variables tabla RC */
  searchBanRC: boolean = false;
  searchRC: FormGroup;
  listaDataRC: MatTableDataSource<any>;
  columnasRC: string[] = [
    "Nro",
    "Material",
    "CantidadOC",
    "CantidadDC",
    "CantidadIngresada",
    "CantidadPorIngresar",
    "UnidadMedida",
  ];
  @ViewChild("matPaginatorRC", { static: true }) paginatorRC: MatPaginator;

  @ViewChild(MatSort) MatSort: MatSort;

  constructor(
    private customersService: CustomersService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private ordenCompra_s: OrdenCompraService,
    public toastr: ToastrManager,
    private chgRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.filterDC();
    this.filterNE();
    this.filterRC();
    this.getDataOrdenCompra(this.idOrdenCompra);
  }

  /* Filtros para la tabla DC */
  filterDC() {
    this.searchDC = this.fb.group({
      txtSearchDC: [""],
    });
  }

  searchTableDC() {
    if (this.searchDC.controls.txtSearchDC.value == null) {
      this.searchDC.controls.txtSearchDC.setValue("");
    }
    this.listaDataDC.filter = this.searchDC.controls.txtSearchDC.value
      .trim()
      .toLowerCase();
    if (this.listaDataDC.paginator) {
      this.listaDataDC.paginator.firstPage();
    }
  }

  /* Filtros para la tabla NE */
  filterNE() {
    this.searchNE = this.fb.group({
      txtSearchNE: [""],
    });
  }

  searchTableNE() {
    if (this.searchNE.controls.txtSearchNE.value == null) {
      this.searchNE.controls.txtSearchNE.setValue("");
    }
    this.listaDataNE.filter = this.searchNE.controls.txtSearchNE.value
      .trim()
      .toLowerCase();
    if (this.listaDataNE.paginator) {
      this.listaDataNE.paginator.firstPage();
    }
  }

  /* Filtros para la tabla RC */
  filterRC() {
    this.searchRC = this.fb.group({
      txtSearchRC: [""],
    });
  }

  searchTableRC() {
    if (this.searchRC.controls.txtSearchRC.value == null) {
      this.searchRC.controls.txtSearchRC.setValue("");
    }
    this.listaDataRC.filter = this.searchRC.controls.txtSearchRC.value
      .trim()
      .toLowerCase();
    if (this.listaDataRC.paginator) {
      this.listaDataRC.paginator.firstPage();
    }
  }

  /* Obtener datos para las tablas */
  getDataOrdenCompra(ordenCompra: number) {
    let array_dc: any = [];
    let array_ne: any = [];
    let array_rc: any = [];

    this.ordenCompra_s.GetDatosOrdenCompra(ordenCompra).subscribe(
      (data: any) => {
        this.estadoOrden = data[0][0].IdEstado;
        array_dc = data[3];
        this.searchBanDC = false;
        this.listaDataDC = new MatTableDataSource(array_dc);
        this.listaDataDC.sort = this.MatSort;
        this.listaDataDC.paginator = this.paginatorDC;
        
        array_ne = data[4];
        this.searchBanNE = false;
        this.listaDataNE = new MatTableDataSource(array_ne);
        this.listaDataNE.sort = this.MatSort;
        this.listaDataNE.paginator = this.paginatorNE;
        
        array_rc = data[6];
        this.searchBanRC = false;
        this.listaDataRC = new MatTableDataSource(array_rc);
        this.listaDataRC.sort = this.MatSort;
        this.listaDataRC.paginator = this.paginatorRC;

        this.chgRef.markForCheck();
      },
      (errorServicio) => {
        console.log(errorServicio);
      }
    );
  }

  /* Proceso cerrar orden compra */
  cerrarOrdenCompra() {
    this.hide_load = true;
    this.ordenCompra_s
      .CerrarOrdenCompra(this.idOrdenCompra)
      .subscribe(
        (data: any) => {
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
        (error) => {
          console.log(error);
        }
      );
  }
}
