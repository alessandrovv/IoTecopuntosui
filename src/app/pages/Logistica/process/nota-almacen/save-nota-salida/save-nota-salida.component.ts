import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { PermissionViewActionService } from 'src/app/Shared/services/permission-view-action.service';
import { DatePipe } from '@angular/common';
import { OrdenCompraService } from '../../../_core/services/orden-compra.service';
import { NotaAlmacenService } from '../../../_core/services/nota-almacen.service';
import { AgregarMaterialSalidaComponent } from './agregar-material-salida/agregar-material-salida.component';
import { EditMaterialSalidaComponent } from './edit-material-salida/edit-material-salida.component';
import { ChartType } from 'chart.js';

@Component({
  selector: "app-save-nota-salida",
  templateUrl: "./save-nota-salida.component.html",
  styleUrls: ["./save-nota-salida.component.scss"],
  providers: [
    DatePipe,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class SaveNotaSalidaComponent implements OnInit {
  /* Datos Buscar */
  formBuscar: FormGroup;
  mostrarBuscar: boolean;
  array_tipo_operaciones: any = [];
  array_tipo_documento: any = [];
  array_periodos: any = [];

  /* Datos Generales */
  formDatos: FormGroup;
  array_establecimientos: any = [];
  idNotaAlmacen: number = 0;
  fechaActual: any;
  igv: any;
  mostrarDatos: boolean;
  estado: any;
  hide_buscar: boolean = false;
  nDecimales: number;
  tasaCambio: any;
  idOrdenCompra: number;
  idCompra: number;
  idPedidoVenta: number;
  igvTotal: any;
  subtotal: any;
  total: any;
  clase: string = "col-lg-3 col-6 mb-5";
  habilitarbusqueda: boolean;
  // @ViewChild(pedidoVenta);

  /* Datos Orden Servicio */
  mostrarOS: boolean;

  /* Datos OTM */
  mostrarOTM: boolean;

  /* Datos Pedido Venta */
  datos_pv: any;
  mostrarPV: boolean;

  /* Datos para detalle */
  formGroupDetalle: FormGroup;
  array_materiales: any = [];
  array_materiales_eliminados: any = [];
  array_detalle_original: any = [];
  mostrarDetalleOC: boolean = false;
  deta_formObservacion: FormControl[] = [];

  /* Datos para Otros Documentos */
  mostrarOtros: boolean;

  /* Botones de accion */
  mostrarBotones: boolean;
  hide_load_guardar: boolean = true;

  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];

  constructor(
    private fb: FormBuilder,
    public pvas: PermissionViewActionService,
    public toastr: ToastrManager,
    private chgRef: ChangeDetectorRef,
    private orden_compra_s: OrdenCompraService,
    private nota_almacen_s: NotaAlmacenService,
    public modalService: NgbModal,
    private datePipe: DatePipe,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.viewsActions = this.pvas.get();
    this.fechaActual = new Date().toLocaleDateString("EN-CA");
    this.formularioBuscar();
    this.formularioDatos();
    this.formDetalleNota();
    this.getIgv();
    this.getTipoOperaciones("0001");
    this.getTipoDocumentos("0008");
    let getAnio = new Date().getFullYear();
    this.getPeriodos(getAnio);
    this.getEstablecimientos(0);
    this.mostrarBuscar = true;
    this.mostrarBotones = false;
    this.mostrarDatos = false;
    this.mostrarOtros = false;
    this.mostrarPV = false;
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

  formularioBuscar() {
    this.formBuscar = this.fb.group({
      TipoOperacion: [null, Validators.compose([Validators.required])],
      TipoDocumento: [null, Validators.compose([Validators.required])],
      Periodo: [null, Validators.compose([Validators.required])],
      Correlativo: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]\d*$/),
        ]),
      ],
    });
  }

  get ctrlsBuscar() {
    return this.formBuscar.controls;
  }

  formularioDatos() {
    this.formDatos = this.fb.group({
      FechaEmision: [
        this.fechaActual,
        Validators.compose([Validators.required]),
      ],
      FechaContable: [
        this.fechaActual,
        Validators.compose([Validators.required]),
      ],
      Establecimiento: [null, Validators.compose([Validators.required])],
      SerieDocumento: [null],
      NumeroDocumento: [null],
      Observacion: [null],
    });
  }

  get controlsDatos() {
    return this.formDatos.controls;
  }

  buscarPorCorrelativo() {
    return new Promise((response, reject) => {
      let correlativo = this.ctrlsBuscar.Correlativo.value;
      let anio = this.ctrlsBuscar.Periodo.value;
      let establecimiento = this.controlsDatos.Establecimiento.value
        ? this.controlsDatos.Establecimiento.value
        : 0;
      if (
        this.ctrlsBuscar.Correlativo.invalid ||
        this.ctrlsBuscar.Periodo.invalid
      ) {
        this.toastr.warningToastr(
          "Debes llenar todos los campos antes de buscar.",
          "Advertencia!",
          {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: "fade",
            progressBar: true,
          }
        );
        this.ctrlsBuscar.Correlativo.markAsTouched();
        this.ctrlsBuscar.Periodo.markAsTouched();
        reject(null);
      } else {
        this.nota_almacen_s.GetPVByCorrelativo(correlativo, anio, establecimiento).subscribe(
          (data: any) => {
            if (data[0][0].Ok == 1) {
              this.mostrarDatos = true;
              this.mostrarPV = true;
              this.mostrarBotones = false;
              this.toastr.successToastr(data[0][0].Message, "Correcto!", {
                toastTimeout: 2000,
                showCloseButton: true,
                animate: "fade",
                progressBar: true,
              });
              response(data);
            } else {
              this.mostrarDatos = false;
              this.mostrarPV = false;
              this.mostrarBotones = false;
              this.toastr.warningToastr(data[0][0].Message, "Advertencia!", {
                toastTimeout: 2000,
                showCloseButton: true,
                animate: "fade",
                progressBar: true,
              });
              reject(null);
            }
            this.chgRef.markForCheck();
          },
          (error: any) => {
            reject(error);
          }
        );
      }
    });
  }

  buscar(vista: any) {
    this.buscarPorCorrelativo()
      .then((result) => {
        let establecimiento = result[0][0].idEstablecimiento;
        this.controlsDatos.Establecimiento.setValue(establecimiento);
        vista.setDatosPV(result);
        vista.actualizarEstablecimiento(establecimiento);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getTipoOperaciones(valor) {
    this.nota_almacen_s.GetTipoOperacionesSalida().subscribe(
      (data: any) => {
        this.array_tipo_operaciones = data;
        console.log(data);
        if (valor !== 0) {
          this.ctrlsBuscar.TipoOperacion.setValue(valor);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getTipoDocumentos(valor) {
    this.nota_almacen_s.GetTipoDocumentoSalida().subscribe(
      (data: any) => {
        this.array_tipo_documento = data.filter(
          (e) => e.valor == "0015" || e.valor == "0008"
        );
        if (valor !== 0) {
          this.ctrlsBuscar.TipoDocumento.setValue(valor);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  changeCboTipoDocumento() {
    let tipodoc = this.ctrlsBuscar.TipoDocumento.value;
    if (tipodoc == "0008") {
      this.idPedidoVenta = 0;
      this.mostrarBuscar = true;
      this.mostrarDatos = false;
      this.mostrarOtros = false;
      this.mostrarPV = false;
      this.mostrarBotones = false;
      this.clase = "col-lg-3 col-6 mb-5";
    } else if (tipodoc == "0015") {
      this.idPedidoVenta = 0;
      this.mostrarBuscar = false;
      this.mostrarDatos = true;
      this.mostrarOtros = true;
      this.mostrarPV = false;
      this.mostrarBotones = true;
      this.clase = "col-lg-4 col-6 mb-5";
    } else {
      this.idPedidoVenta = 0;
      this.mostrarBuscar = true;
      this.mostrarDatos = false;
      this.mostrarOtros = false;
      this.mostrarPV = false;
      this.mostrarBotones = false;
      this.clase = "col-lg-3 col-6 mb-5";
    }
  }

  changeCboTipoOperacion() {
    let tipoop = this.ctrlsBuscar.TipoOperacion.value;
    if (tipoop == "0001") {
      this.ctrlsBuscar.TipoDocumento.setValue("0008");
      this.changeCboTipoDocumento();
    } else if(tipoop == "0006") {
      this.ctrlsBuscar.TipoDocumento.reset();
      this.changeCboTipoDocumento();
    } else {
      this.ctrlsBuscar.TipoDocumento.setValue("0015");
      this.changeCboTipoDocumento();
    }
  }

  getPeriodos(valor) {
    this.nota_almacen_s.GetPeriodos().subscribe(
      (data: any) => {
        this.array_periodos = data;
        if (valor != 0) {
          this.ctrlsBuscar.Periodo.setValue(valor);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getEstablecimientos(value) {
    this.orden_compra_s.GetEstablecimientos().subscribe(
      (data: any) => {
        this.array_establecimientos = data;
        if (value > 0) {
          this.controlsDatos.Establecimiento.setValue(value);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  changeEstablecimiento(vista) {
    let establecimiento = this.controlsDatos.Establecimiento;
    vista.actualizarEstablecimiento(establecimiento);
    (establecimiento.value)
      ? vista.getDetallePV(establecimiento.value)
      : 0;
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

  pushMaterial(material) {
    this.array_materiales.push(material);
    this.deta_formObservacion.push(new FormControl(null));
  }

  fixedValor(valor) {
    return parseFloat(valor).toFixed(this.nDecimales);
  }

  agregarMaterial() {
    if (this.controlsDatos.Establecimiento.invalid) {
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
      this.controlsDatos.Establecimiento.markAsTouched();
    } else {
      const modalRef = this.modalService.open(AgregarMaterialSalidaComponent, {
        size: "xl",
      });
      modalRef.componentInstance.array_materiales = this.array_materiales;
      modalRef.componentInstance.igv = this.igv;
      modalRef.componentInstance.almacen =
        this.controlsDatos.Establecimiento.value;
      modalRef.result.then(
        (value: any) => {
          this.pushMaterial(value);
          let index = this.array_materiales.indexOf(value);
          this.deta_formObservacion[index].setValue(value.observacion);
          this.chgRef.markForCheck();
        },
        (reason: any) => {
          console.log(reason);
        }
      );
    }
  }

  editarMaterial(idMaterial) {
    const modalRef = this.modalService.open(EditMaterialSalidaComponent, {
      size: "md",
    });
    this.array_materiales[idMaterial].igv = this.igv;
    modalRef.componentInstance.item = this.array_materiales[idMaterial];
    modalRef.result.then(
      (value: any) => {
        this.array_materiales[idMaterial] = value;
        this.chgRef.markForCheck();
      },
      (reason: any) => {
        console.log(reason);
      }
    );
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

  regresarDatos() {
    this.array_materiales = [];
    this.deta_formObservacion = [];
    this.array_detalle_original.forEach((e) => {
      this.pushMaterial({ ...e });
    });
    this.chgRef.markForCheck();
  }

  guardarMateriales(notaSalida) {
    return new Promise((result, reject) => {
      if (notaSalida) {
        this.datos_pv = notaSalida.datosg;
        this.idPedidoVenta = this.datos_pv.idPedidoVenta;
        this.array_materiales = [...notaSalida.datosd];
        this.array_materiales_eliminados = [...notaSalida.datose];
        result(true);
      } else {
        reject(false);
      }
    });
  }

  saveNotaPV(notaPV, vista) {
    this.guardarMateriales(notaPV)
      .then((result) => {
        if (result) {
          let datos = this.prepare_nota_pv();
          this.saveUpdateNotaSalida(datos, vista);
        }
      })
      .catch();
  }

  /* Guardar o registrar una Nota de entrada */
  saveNotaSalida() {
    let datos = this.prepare_nota_salida();
    this.saveUpdateNotaSalida(datos, null);
  }

  saveUpdateNotaSalida(datos, vista) {
    this.hide_load_guardar = false;
    this.estado = "0003";
    if (this.formDatos.invalid) {
      Object.keys(this.controlsDatos).forEach((controlName) => {
        this.controlsDatos[controlName].markAsTouched();
      });
      this.hide_load_guardar = true;
      vista ? vista.hideGuardar(true) : 0;
      this.chgRef.markForCheck();
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

    if (this.array_materiales.length == 0) {
      this.hide_load_guardar = true;
      vista ? vista.hideGuardar(true) : 0;
      this.chgRef.markForCheck();
      this.toastr.warningToastr(
        "Ingresar materiales a la nota de almacen. ",
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

    let sinStock: boolean = false;
    this.array_materiales.forEach((e) => {
      if (e.cantidad > e.stock) {
        sinStock = true;
        return;
      }
    });

    if (sinStock) {
      this.hide_load_guardar = true;
      vista ? vista.hideGuardar(true) : 0;
      this.chgRef.markForCheck();
      this.toastr.errorToastr("Stock insuficiente.", "Error!", {
        toastTimeout: 2000,
        showCloseButton: true,
        animate: "fade",
        progressBar: true,
      });
      return;
    }

    this.nota_almacen_s.SaveUpdateNotaAlmacen(datos).subscribe(
      (data: any) => {
        if (data[0][0].Ok == 1) {
          this.hide_load_guardar = true;
          this.chgRef.markForCheck();
          this.toastr.successToastr(data[0][0].Message, "Correcto!", {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: "fade",
            progressBar: true,
          });
          this.router.navigate(["Logistica/process/NotaAlmacen"]);
        } else {
          this.hide_load_guardar = true;
          this.chgRef.markForCheck();
          this.toastr.warningToastr(data[0][0].Message, "Advertencia!", {
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

  prepare_nota_pv() {
    let datos_generales = [];
    let datos_detalle = [];

    datos_generales.push({
      idNotaAlmacen: this.idNotaAlmacen,
      idOrdenCompra: this.idOrdenCompra ? this.idOrdenCompra : 0,
      idCompra: this.idCompra ? this.idCompra : 0,
      idPedidoVenta: this.idPedidoVenta ? this.idPedidoVenta : 0,
      idTipoNota: "0002",
      tipoOperacion: this.ctrlsBuscar.TipoOperacion.value,
      tipoDocumento: this.ctrlsBuscar.TipoDocumento.value,
      idEstablecimiento: this.controlsDatos.Establecimiento.value,
      serie: "",
      numero: "",
      fechaEmision: this.datePipe.transform(
        this.controlsDatos.FechaEmision.value,
        "yyyy-MM-dd"
      ),
      fechaContable: this.datePipe.transform(
        this.controlsDatos.FechaContable.value,
        "yyyy-MM-dd"
      ),
      tasaCambio: this.tasaCambio ? this.tasaCambio : 0,
      igvPorcentaje: this.igv ? this.igv : 0,
      igv: this.igvTotal ? this.igvTotal : 0,
      subtotal: this.subtotal ? this.subtotal : 0,
      total: this.total ? this.total : 0,
      observaciones: this.datos_pv.observacion,
    });

    for (let i = 0; i < this.array_materiales.length; i++) {
      datos_detalle.push({
        idDetalleAlmacen: this.array_materiales[i].idDetalleNota
          ? this.array_materiales[i].idDetalleNota
          : 0,
        idNotaAlmacen: this.idNotaAlmacen,
        idMaterial: this.array_materiales[i].idMaterial,
        nombreMaterial: this.array_materiales[i].material,
        idPresentacion: this.array_materiales[i].idPresentacion
          ? this.array_materiales[i].idPresentacion
          : 0,
        nombrePresentacion: this.array_materiales[i].nombrePresentacion
          ? this.array_materiales[i].nombrePresentacion
          : "",
        valorUnitario: this.array_materiales[i].valorUnit
          ? this.array_materiales[i].valorUnit
          : 0,
        precioUnitario: this.array_materiales[i].precioUnit
          ? this.array_materiales[i].precioUnit
          : 0,
        cantidad: this.array_materiales[i].cantADespachar,
        valorTotal: this.array_materiales[i].valorTotal
          ? this.array_materiales[i].valorTotal
          : 0,
        precioTotal: this.array_materiales[i].precioTotal
          ? this.array_materiales[i].precioTotal
          : 0,
        cantidadTotal: this.array_materiales[i].cantADespachar,
        idUnidadMedida: this.array_materiales[i].idUnidadMedida,
        unidadMedida: this.array_materiales[i].unidadMedida,
        observacion: "",
        activo: 1,
        eliminado: 0,
      });
    }

    for (let i = 0; i < this.array_materiales_eliminados.length; i++) {
      datos_detalle.push({
        idDetalleAlmacen: this.array_materiales_eliminados[i].idDetalleNota,
        idNotaAlmacen: this.idNotaAlmacen,
        idMaterial: this.array_materiales_eliminados[i].idMaterial,
        nombreMaterial: this.array_materiales_eliminados[i].nombreMaterial,
        idPresentacion: this.array_materiales_eliminados[i].idPresentacion,
        nombrePresentacion:
          this.array_materiales_eliminados[i].nombrePresentacion,
        valorUnitario: this.array_materiales_eliminados[i].valorUnit,
        precioUnitario: this.array_materiales_eliminados[i].precioUnit,
        cantidad: this.array_materiales_eliminados[i].cantidad,
        valorTotal: this.array_materiales_eliminados[i].valorTotal,
        precioTotal: this.array_materiales_eliminados[i].precioTotal,
        cantidadTotal: this.array_materiales_eliminados[i].cantidadTotal,
        idUnidadMedida: this.array_materiales_eliminados[i].idUnidadMedida,
        unidadMedida: this.array_materiales_eliminados[i].unidadMedida,
        observacion: "",
        activo: 0,
        eliminado: 1,
      });
    }

    return {
      datosGenerales: datos_generales,
      datosDetalle: datos_detalle,
    };
  }

  prepare_nota_salida() {
    let datos_generales = [];
    let datos_detalle = [];

    datos_generales.push({
      idNotaAlmacen: this.idNotaAlmacen,
      idOrdenCompra: this.idOrdenCompra ? this.idOrdenCompra : 0,
      idCompra: this.idCompra ? this.idCompra : 0,
      idPedidoVenta: this.idPedidoVenta ? this.idPedidoVenta : 0,
      idTipoNota: "0002",
      tipoOperacion: this.ctrlsBuscar.TipoOperacion.value,
      tipoDocumento: this.ctrlsBuscar.TipoDocumento.value,
      idEstablecimiento: this.controlsDatos.Establecimiento.value,
      serie: "",
      numero: "",
      fechaEmision: this.datePipe.transform(
        this.controlsDatos.FechaEmision.value,
        "yyyy-MM-dd"
      ),
      fechaContable: this.datePipe.transform(
        this.controlsDatos.FechaContable.value,
        "yyyy-MM-dd"
      ),
      tasaCambio: this.tasaCambio ? this.tasaCambio : 0,
      igvPorcentaje: this.igv ? this.igv : 0,
      igv: this.igvTotal ? this.igvTotal : 0,
      subtotal: this.subtotal ? this.subtotal : 0,
      total: this.total ? this.total : 0,
      observaciones: this.controlsDatos.Observacion.value,
    });

    for (let i = 0; i < this.array_materiales.length; i++) {
      datos_detalle.push({
        idDetalleAlmacen: this.array_materiales[i].idDetalleNota
          ? this.array_materiales[i].idDetalleNota
          : 0,
        idNotaAlmacen: this.idNotaAlmacen,
        idMaterial: this.array_materiales[i].idMaterial,
        nombreMaterial: this.array_materiales[i].nombreMaterial,
        idPresentacion: this.array_materiales[i].idPresentacion
          ? this.array_materiales[i].idPresentacion
          : 0,
        nombrePresentacion: this.array_materiales[i].nombrePresentacion
          ? this.array_materiales[i].nombrePresentacion
          : "",
        valorUnitario: this.array_materiales[i].valorUnit
          ? this.array_materiales[i].valorUnit
          : 0,
        precioUnitario: this.array_materiales[i].precioUnit
          ? this.array_materiales[i].precioUnit
          : 0,
        cantidad: this.array_materiales[i].cantidad,
        valorTotal: this.array_materiales[i].valorTotal
          ? this.array_materiales[i].valorTotal
          : 0,
        precioTotal: this.array_materiales[i].precioTotal
          ? this.array_materiales[i].precioTotal
          : 0,
        cantidadTotal: this.array_materiales[i].cantidadTotal,
        idUnidadMedida: this.array_materiales[i].idUnidadMedida,
        unidadMedida: this.array_materiales[i].unidadMedida,
        observacion: this.deta_formObservacion[i].value,
        activo: 1,
        eliminado: 0,
      });
    }

    for (let i = 0; i < this.array_materiales_eliminados.length; i++) {
      datos_detalle.push({
        idDetalleAlmacen: this.array_materiales_eliminados[i].idDetalleNota,
        idNotaAlmacen: this.idNotaAlmacen,
        idMaterial: this.array_materiales_eliminados[i].idMaterial,
        nombreMaterial: this.array_materiales_eliminados[i].nombreMaterial,
        idPresentacion: this.array_materiales_eliminados[i].idPresentacion,
        nombrePresentacion:
          this.array_materiales_eliminados[i].nombrePresentacion,
        valorUnitario: this.array_materiales_eliminados[i].valorUnit,
        precioUnitario: this.array_materiales_eliminados[i].precioUnit,
        cantidad: this.array_materiales_eliminados[i].cantidad,
        valorTotal: this.array_materiales_eliminados[i].valorTotal,
        precioTotal: this.array_materiales_eliminados[i].precioTotal,
        cantidadTotal: this.array_materiales_eliminados[i].cantidadTotal,
        idUnidadMedida: this.array_materiales_eliminados[i].idUnidadMedida,
        unidadMedida: this.array_materiales_eliminados[i].unidadMedida,
        observacion: null,
        activo: 0,
        eliminado: 1,
      });
    }

    return {
      datosGenerales: datos_generales,
      datosDetalle: datos_detalle,
    };
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
