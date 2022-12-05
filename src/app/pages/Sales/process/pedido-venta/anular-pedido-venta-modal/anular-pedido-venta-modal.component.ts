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

@Component({
  selector: "app-anular-pedido-venta-modal",
  templateUrl: "./anular-pedido-venta-modal.component.html",
  styleUrls: ["./anular-pedido-venta-modal.component.scss"],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class AnularPedidoVentaModalComponent implements OnInit {
  @Input() id: any;
  idPedidoVenta: number;
  estadoPedido: any;
  hide_load: any = false;

  searchBanDocVenta: boolean = false;
  searchBanNotaSalida: boolean = false;

  searchDocVenta: FormGroup;
  searchNotaSalida: FormGroup;

  listDocVenta: MatTableDataSource<any>;
  listNotasSalida: MatTableDataSource<any>;

  columnasDocVenta: string[] = ["Nro", "Codigo", "Estado"];
  columnasNotas: string[] = ["Nro", "Codigo", "FechaContable", "Estado"];

  @ViewChild(MatSort) MatSort: MatSort;

  @ViewChild("matPaginatorDV", { static: true }) paginatorDV: MatPaginator;
  @ViewChild("matPaginatorNS", { static: true }) paginatorNS: MatPaginator;

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
    this.getDataPedidoVenta(this.idPedidoVenta);
  }

  filterDocVenta() {
    this.searchDocVenta = this.fb.group({
      searchDoc: ['']
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

  filterNotaSalida() {
    this.searchNotaSalida = this.fb.group({
      searchNota: ['']
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

  getDataPedidoVenta(idPedidoVenta) {
    this.listDocVenta = new MatTableDataSource([]);
    this.listNotasSalida = new MatTableDataSource([]);
    this.pedido_venta_s.GetDocNotasPedidoVenta(idPedidoVenta).subscribe(
      (data:any) => {
        let array_doc_venta = data[0];
        let array_nota_salida = data[0];
        
        this.searchBanDocVenta = false;
        this.searchBanNotaSalida = false;

        this.listDocVenta = new MatTableDataSource(array_doc_venta);
        this.listNotasSalida = new MatTableDataSource(array_nota_salida);

        this.listDocVenta.sort = this.MatSort;
        this.listNotasSalida.sort = this.MatSort;

        this.listDocVenta.paginator = this.paginatorDV;
        this.listNotasSalida.paginator = this.paginatorNS;
      }, (error:any) => {
        console.log(error);
      }
    );
  }

  anularPedidoVenta() {
    this.hide_load = true;
    this.pedido_venta_s.AnularPedidoVenta(this.idPedidoVenta).subscribe(
      (data:any) => {
        console.log(data);
        this.hide_load=false;
        if (data[0].Ok==1) {
          this.toastr.successToastr(data[0].Message, 'Operación exitosa!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
          this.modal.close(true);
        } else {
          this.toastr.errorToastr(data[0].Message, 'No se pudo completar la acción!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
        }
      }, (error:any) => {
        console.log(error);
      }
    );
  }
}
