import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { PermissionViewActionService } from 'src/app/Shared/services/permission-view-action.service';
import { DatePipe } from '@angular/common';
import { PedidoVentaService } from '../../../../../Sales/_core/pedido-venta.service';
import { NotaAlmacenService } from '../../../../_core/services/nota-almacen.service';

@Component({
  selector: "app-vista-pedido-venta-ver",
  templateUrl: "./vista-pedido-venta-ver.component.html",
  styleUrls: ["./vista-pedido-venta-ver.component.scss"],
  providers: [
    DatePipe,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class VistaPedidoVentaVerComponent implements OnInit {
  /* Datos generales */
  datos_generales: any;
  formPedidoVenta: FormGroup;
  formEstablecimiento: any;
  igv: number = 0;
  mostrarBotones: boolean = false;
  idPedidoVenta: number;

  /* Datos del detalle */
  array_original: any = [];
  array_materiales: any = [];
  array_materiales_eliminados: any = [];
  deta_formCatidadDespachar: FormControl[] = [];
  nDecimales: number = 2;

  constructor(
    private fb: FormBuilder,
    public pvas: PermissionViewActionService,
    public toastr: ToastrManager,
    public modalService: NgbModal,
    private datePipe: DatePipe,
    private chgRef: ChangeDetectorRef,
    private pedido_venta_s: PedidoVentaService,
    private nota_almacen_s: NotaAlmacenService
  ) {}

  ngOnInit(): void {
    this.getIgv();
    this.formularioPedidoVenta();
  }

  getIgv() {
    let date = new Date();
    let anio = date.getFullYear();
    this.pedido_venta_s.GetIgv(anio).subscribe(
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

  getDatosPV(idPedidoVenta, dataNA) {
    this.pedido_venta_s.GetPedidoVentaById(idPedidoVenta).subscribe(
      (data:any) => {
        let dataG = dataNA[0][0];
        let dataD = dataNA[1];
        let datos_pv = data[0][0];
        this.idPedidoVenta = datos_pv.idPedidoVenta;
        this.controlsPedido.Codigo.setValue(datos_pv.codigo);
        this.controlsPedido.Cliente.setValue(datos_pv.razonSocial);
        this.controlsPedido.TipoDocumento.setValue(
          datos_pv.nombreTipoDocumento
        );
        this.controlsPedido.FechaEmision.setValue(
          this.datePipe.transform(datos_pv.fechaEmision, "yyyy-MM-dd")
        );
        this.controlsPedido.FechaEntrega.setValue(
          this.datePipe.transform(datos_pv.fechaEntrega, "yyyy-MM-dd")
        );
        this.controlsPedido.TipoMoneda.setValue(datos_pv.nombreMoneda);
        this.controlsPedido.Observacion.setValue(dataG.observaciones);
        this.nDecimales = datos_pv.numDecimales;
        console.log(dataG);
        console.log(dataD);
        dataD.forEach((e) => {
          this.pushMaterial({ ...e });
        });
        this.chgRef.markForCheck();
      }, (error:any) => {
        console.log(error);
      }
    );
  }

  formularioPedidoVenta() {
    this.formPedidoVenta = this.fb.group({
      Codigo: [{ value: null, disabled: true }],
      Cliente: [{ value: null, disabled: true }],
      TipoDocumento: [{ value: null, disabled: true }],
      FechaEmision: [{ value: null, disabled: true }],
      FechaEntrega: [{ value: null, disabled: true }],
      TipoMoneda: [{ value: null, disabled: true }],
      Observacion: [{ value: null, disabled: true }],
    });
  }

  get controlsPedido() {
    return this.formPedidoVenta.controls;
  }

  fixedValor(value) {
    let strValue: string = parseFloat(value).toFixed(this.nDecimales);
    return strValue;
  }

  pushMaterial(material) {
    this.array_materiales.push(material);
  }
}
