import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionViewActionService } from 'src/app/Shared/services/permission-view-action.service';
import { DatePipe } from '@angular/common';
import { OrdenCompraService } from '../../../../_core/services/orden-compra.service';
import { NotaAlmacenService } from '../../../../_core/services/nota-almacen.service';

@Component({
  selector: "app-vista-orden-compra-ver",
  templateUrl: "./vista-orden-compra-ver.component.html",
  styleUrls: ["./vista-orden-compra-ver.component.scss"],
  providers: [
    DatePipe,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class VistaOrdenCompraVerComponent implements OnInit {
  formOrdenCompra: FormGroup;
  igv: any;
  idOrdenCompra: number;
  idCompra: number;
  nDecimales: number = 2;

  /* Datos para detalle */
  formGroupDetalle: FormGroup;
  array_materiales: any = [];
  array_materiales_eliminados: any = [];

  constructor(
    private fb: FormBuilder,
    public pvas: PermissionViewActionService,
    public toastr: ToastrManager,
    private chgRef: ChangeDetectorRef,
    private orden_compra_s: OrdenCompraService,
    private nota_almacen_s: NotaAlmacenService,
    public modalService: NgbModal,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.formularioOrdenCompra();
    this.formDetalleNota();
    this.getIgv();
  }

  /* Datos generales */
  getIgv() {
    let date = new Date();
    let anio = date.getFullYear();
    this.orden_compra_s.GetIgv(anio).subscribe(
      (data: any) => {
        if (data.length > 0) {
          this.igv = data[0].porcentaje;
        } else {
          this.toastr.warningToastr(
            "No se ha ingresado el IGV del periodo actual",
            "Advertencia!",
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

  formularioOrdenCompra() {
    this.formOrdenCompra = this.fb.group({
      Codigo: [{ value: null, disabled: true }],
      Proveedor: [{ value: null, disabled: true }],
      TipoDocumento: [{ value: null, disabled: true }],
      FormaPago: [{ value: null, disabled: true }],
      FechaEmision: [{ value: null, disabled: true }],
      FechaEntrega: [{ value: null, disabled: true }],
      TipoMoneda: [{ value: null, disabled: true }],
      SerieDocumento: [{ value: null, disabled: true }],
      NumeroDocumento: [{ value: null, disabled: true }],
      Observacion: [{ value: null, disabled: true }],
    });
  }

  get controlsOrden() {
    return this.formOrdenCompra.controls;
  }

  /* Detalle nota entrada */
  formDetalleNota() {
    this.formGroupDetalle = this.fb.group({
      Materiales: this.fb.array([]),
    });
  }

  get materiales() {
    return this.formGroupDetalle.controls["Materiales"] as FormArray;
  }

  getDatosOC(idOrdenCompra, dataNA) {
    let dataG = dataNA[0][0];
    let dataD = dataNA[1];
    this.nota_almacen_s.GetOrdenCompra(idOrdenCompra).subscribe(
      (data: any) => {
        let genOc = data[0][0];
        this.controlsOrden.Codigo.setValue(genOc.codigo);
        this.controlsOrden.Proveedor.setValue(genOc.proveedor);
        this.controlsOrden.TipoDocumento.setValue(genOc.tipoDocumento);
        this.controlsOrden.FormaPago.setValue(genOc.formaPago);
        this.controlsOrden.FechaEmision.setValue(
          this.datePipe.transform(genOc.fechaEmision, "yyyy-MM-dd")
        );
        this.controlsOrden.FechaEntrega.setValue(
          this.datePipe.transform(genOc.fechaEntrega, "yyyy-MM-dd")
        );
        this.controlsOrden.TipoMoneda.setValue(genOc.moneda);
        this.controlsOrden.SerieDocumento.setValue(genOc.serie);
        this.controlsOrden.NumeroDocumento.setValue(genOc.numero);
        this.controlsOrden.Observacion.setValue(dataG.observaciones);
        this.nDecimales = genOc.numDecimales;
        dataD.forEach((e) => {
          this.pushMaterial({ ...e });
        });
        this.chgRef.markForCheck();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  pushMaterial(material) {
    this.array_materiales.push(material);
  }

  fixedValor(valor) {
    return parseFloat(valor).toFixed(this.nDecimales);
  }
}
