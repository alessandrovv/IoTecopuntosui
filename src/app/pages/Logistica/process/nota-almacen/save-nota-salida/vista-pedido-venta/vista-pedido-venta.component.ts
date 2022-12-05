import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { PermissionViewActionService } from 'src/app/Shared/services/permission-view-action.service';
import { DatePipe } from '@angular/common';
import { PedidoVentaService } from '../../../../../Sales/_core/pedido-venta.service';
import { AgregarMaterialSalidaComponent } from '../agregar-material-salida/agregar-material-salida.component';
import { NotaAlmacenService } from '../../../../_core/services/nota-almacen.service';

@Component({
  selector: "app-vista-pedido-venta",
  templateUrl: "./vista-pedido-venta.component.html",
  styleUrls: ["./vista-pedido-venta.component.scss"],
  providers: [
    DatePipe,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class VistaPedidoVentaComponent implements OnInit {
  @Input() hide_load_guardar: boolean = true;
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

  @Output() onMateriales: EventEmitter<any> = new EventEmitter();

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

  formularioPedidoVenta() {
    this.formPedidoVenta = this.fb.group({
      Codigo: [{ value: null, disabled: true }],
      Cliente: [{ value: null, disabled: true }],
      TipoDocumento: [{ value: null, disabled: true }],
      FechaEmision: [{ value: null, disabled: true }],
      FechaEntrega: [{ value: null, disabled: true }],
      TipoMoneda: [{ value: null, disabled: true }],
      Observacion: [null],
    });
  }

  get controlsPedido() {
    return this.formPedidoVenta.controls;
  }

  actualizarEstablecimiento(value) {
    this.formEstablecimiento = value;
  }

  setDatosPV(data) {
    this.datos_generales = data[0][0];
    if (data) {
      let datos_pv = data[0][0];
      this.idPedidoVenta = datos_pv.idPedidoVenta;
      this.controlsPedido.Codigo.setValue(datos_pv.codigo);
      this.controlsPedido.Cliente.setValue(datos_pv.cliente);
      this.controlsPedido.TipoDocumento.setValue(datos_pv.tipoDocumento);
      this.controlsPedido.FechaEmision.setValue(
        this.datePipe.transform(datos_pv.fechaEmision, "yyyy-MM-dd")
      );
      this.controlsPedido.FechaEntrega.setValue(
        this.datePipe.transform(datos_pv.fechaEntrega, "yyyy-MM-dd")
      );
      this.controlsPedido.TipoMoneda.setValue(datos_pv.moneda);
      this.nDecimales = datos_pv.numDecimales;
      this.mostrarBotones = true;

      this.getDetallePV(datos_pv.idEstablecimiento);
      this.chgRef.markForCheck();
    }
  }

  getDetallePV(establecimiento) {
    this.nota_almacen_s.GetPVDetalleByCorrelativo(this.idPedidoVenta, establecimiento).subscribe(
        (data: any) => {
          let datos_detalle = data[0];
          this.array_materiales = [];
          this.deta_formCatidadDespachar = [];
          datos_detalle.forEach((e) => {
            e.idDetalleNota = 0;
            this.pushMaterial(e);
            this.array_original.push({ ...e });
          });
          this.chgRef.markForCheck();
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  regresarDatos() {
    this.array_materiales = [];
    this.deta_formCatidadDespachar = [];
    this.array_original.forEach((e) => {
      this.pushMaterial({ ...e });
    });
    this.chgRef.markForCheck();
  }

  fixedValor(value) {
    let strValue: string = parseFloat(value).toFixed(this.nDecimales);
    return strValue;
  }

  actualizarCantidad(index) {
    this.array_materiales[index].cantADespachar =
      this.deta_formCatidadDespachar[index].value;
  }

  pushMaterial(material) {
    this.array_materiales.push(material);
    this.deta_formCatidadDespachar.push(
      new FormControl(
        null,
        Validators.compose([
          Validators.pattern(/^[1-9]\d*$/),
          Validators.required,
        ])
      )
    );
    let index = this.deta_formCatidadDespachar.length - 1;
    this.deta_formCatidadDespachar[index].setValue(material.cantADespachar);
  }

  agregarMaterial() {
    if (this.formEstablecimiento.invalid) {
      this.toastr.warningToastr(
        "Ingresar campos obligatorios. ",
        "Advertencia!",
        {
          toastTimeout: 2000,
          showCloseButton: true,
          animate: "fade",
          progressBar: true,
        }
      );
      this.formEstablecimiento.markAsTouched();
    } else {
      const modalRef = this.modalService.open(AgregarMaterialSalidaComponent, {
        size: "xl",
      });
      modalRef.componentInstance.array_materiales = this.array_materiales;
      modalRef.componentInstance.igv = this.igv;
      modalRef.componentInstance.almacen = this.formEstablecimiento.value;
      modalRef.result.then(
        (value: any) => {
          this.pushMaterial(value);
          this.chgRef.markForCheck();
        },
        (reason: any) => {
          console.log(reason);
        }
      );
    }
  }

  eliminarMaterial(idMaterial, content) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          if (result && this.array_materiales[idMaterial].idDetalleNota == 0) {
            this.array_materiales.splice(idMaterial, 1);
          } else {
            this.array_materiales_eliminados.push(
              this.array_materiales[idMaterial]
            );
            this.array_materiales.splice(idMaterial, 1);
          }
        },
        (reason) => {
          console.log(reason);
        }
      );
  }

  saveUpdateNotaSalida() {
    let is_invalido: boolean = false;
    this.hide_load_guardar = false;

    for (let i = 0; i < this.deta_formCatidadDespachar.length; ++i) {
      if (this.deta_formCatidadDespachar[i].invalid) {
        this.deta_formCatidadDespachar[i].markAsTouched();
        is_invalido = true;
      }
    }

    if (is_invalido) {
      this.hide_load_guardar = true;
      this.toastr.warningToastr(
        "Ingresar campos obligatorios. ",
        "Advertencia!",
        {
          toastTimeout: 2000,
          showCloseButton: true,
          animate: "fade",
          progressBar: true,
        }
      );
      return;
    }

    let modelNS: any = {};

    this.datos_generales.observacion = this.controlsPedido.Observacion.value;
    modelNS.datosg = this.datos_generales;
    modelNS.datosd = this.array_materiales;
    modelNS.datose = this.array_materiales_eliminados;

    this.onMateriales.emit(modelNS);
  }

  hideGuardar(valor) {
    this.hide_load_guardar = valor;
    this.chgRef.markForCheck();
  }

  /* Validacion de formularios */
  isFormControlValid(controlName): boolean {
    return controlName.valid && (controlName.dirty || controlName.touched);
  }

  isFormControlInvalid(controlName): boolean {
    return controlName.invalid && (controlName.dirty || controlName.touched);
  }

  FormControlHasError(validation, controlName): boolean {
    return (
      controlName.hasError(validation) &&
      (controlName.dirty || controlName.touched)
    );
  }
}
