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
  selector: "app-anular-orden-compra-modal",
  templateUrl: "./anular-orden-compra-modal.component.html",
  styleUrls: ["./anular-orden-compra-modal.component.scss"],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class AnularOrdenCompraModalComponent implements OnInit {
  /* Variables generales */
  @Input() idOrdenCompra: number;
  estadoOrden: any;
  hide_load: any = false;

  /* Variables tabla DC */
  searchBanDC: boolean = false;
  searchDC: FormGroup;
  listaDataDC: MatTableDataSource<any>;
  columnasDC: string[] = ["Nro", "CodigoDC", "EstadoDC"];
  @ViewChild("matPaginatorDC", { static: true }) paginatorDC: MatPaginator;

  /* Variables tabla NE */
  searchBanNE: boolean = false;
  searchNE: FormGroup;
  listaDataNE: MatTableDataSource<any>;
  columnasNE: string[] = ["Nro", "CodigoNA", "FechaContable", "EstadoNA"];
  @ViewChild("matPaginatorNE", { static: true }) paginatorNE: MatPaginator;

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
    this.getDataOrdenCompra(this.idOrdenCompra);
  }

  /* Funciones para la tabla DC */
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

  /* Funciones para la tabla NE */
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

  /* Obtener datos para las tablas */
  getDataOrdenCompra(ordenCompra: number) {
    let array_dc: any = [];
    let array_ne: any = [];

    this.ordenCompra_s.GetDatosOrdenCompra(ordenCompra).subscribe(
      (data: any) => {
        this.estadoOrden = data[0][0].IdEstado;
        array_dc = data[3];
        this.searchBanDC = false;
        this.listaDataDC = new MatTableDataSource(array_dc);
        this.listaDataDC.sort = this.MatSort;
        this.listaDataDC.paginator = this.paginatorDC;

        array_ne = data[5];
        this.searchBanNE = false;
        this.listaDataNE = new MatTableDataSource(array_ne);
        this.listaDataNE.sort = this.MatSort;
        this.listaDataNE.paginator = this.paginatorNE;

        this.chgRef.markForCheck();
      },
      (errorServicio) => {
        console.log(errorServicio);
      }
    );
  }

  /* Proceso anular orden compra */
  anularOrdenCompra() {
    this.hide_load = true;
    this.ordenCompra_s.AnularOrdenCompra(this.idOrdenCompra).subscribe(
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
