import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { AgregarMaterialEntradaComponent } from './agregar-material-entrada/agregar-material-entrada.component';
import { EditMaterialEntradaComponent } from './edit-material-entrada/edit-material-entrada.component';

@Component({
  selector: "app-save-nota-entrada",
  templateUrl: "./save-nota-entrada.component.html",
  styleUrls: ["./save-nota-entrada.component.scss"],
  providers: [
    DatePipe,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class SaveNotaEntradaComponent implements OnInit {
  /* Datos de busqueda */
  formBusqueda: FormGroup;

  /* Datos Generales */
  formDatos: FormGroup;
  array_tipo_operaciones: any = [];
  array_tipo_documento: any = [];
  array_periodos: any = [];
  array_establecimientos: any = [];
  idNotaAlmacen: number = 0;
  fechaActual: any;
  igv: any;
  habilitarbusqueda: boolean = true;
  mostrarDatos: boolean = false;
  estado: any;
  hide_buscar: boolean = false;
  nDecimales: number;
  tasaCambio: any;
  idOrdenCompra: number;
  idCompra: number;
  igvTotal: any;
  subtotal: any;
  total: any;
  clase: string = "col-lg-3 col-6 mb-5";

  /* Datos Orden Compra */
  mostrarOC: boolean = false;

  /* Datos para detalle */
  formGroupDetalle: FormGroup;
  array_materiales: any = [];
  array_materiales_eliminados: any = [];
  array_detalle_original: any = [];
  mostrarDetalleOC: boolean = false;
  deta_formObservacion: FormControl[] = [];

  /* Datos para Otros Documentos */
  mostrarOtros: boolean = false;

  /* Botones de accion */
  mostrarBotones: boolean = false;
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.viewsActions = this.pvas.get();
    this.fechaActual = new Date().toLocaleDateString("EN-CA");
    this.formularioBusqueda();
    this.formularioDatos();
    this.formDetalleNota();
    this.getIgv();
    this.getTipoOperaciones("0002");
    this.getTipoDocumentos("0001");
    let getAnio = new Date().getFullYear();
    this.getPeriodos(getAnio);
    this.getEstablecimientos(1);
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

  formularioBusqueda() {
    this.formBusqueda = this.fb.group({
      TipoOperacion: [null, Validators.compose([Validators.required])],
      TipoDocumento: [null, Validators.compose([Validators.required])],
      Periodo: [null, Validators.compose([Validators.required])],
      Correlativo: [null, Validators.compose([Validators.required])],
    });
  }

  get controlsBusca() {
    return this.formBusqueda.controls;
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
      Observacion: [null],
    });
  }

  get controlsDatos() {
    return this.formDatos.controls;
  }

  getTipoOperaciones(valor) {
    this.nota_almacen_s.GetTipoOperacionesEntrada().subscribe(
      (data: any) => {
        this.array_tipo_operaciones = data;
        if (valor !== 0) {
          this.controlsBusca.TipoOperacion.setValue(valor);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getTipoDocumentos(valor) {
    this.nota_almacen_s.GetTipoDocumentoEntrada().subscribe(
      (data: any) => {
        this.array_tipo_documento = data;
        if (valor !== 0) {
          this.controlsBusca.TipoDocumento.setValue(valor);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getPeriodos(valor) {
    this.nota_almacen_s.GetPeriodos().subscribe(
      (data: any) => {
        this.array_periodos = data;
        if (valor != 0) {
          this.controlsBusca.Periodo.setValue(valor);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  buscarPorCorrelativo(vista) {
    let correlativo = this.controlsBusca.Correlativo.value;
    let tipo_documento = this.controlsBusca.TipoDocumento.value;
    let anio = this.controlsBusca.Periodo.value;
    if (
      this.controlsBusca.Correlativo.invalid ||
      this.controlsBusca.Periodo.invalid
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
      this.controlsBusca.Correlativo.markAsTouched();
      this.controlsBusca.Periodo.markAsTouched();
    } else {
      if (tipo_documento == "0001") {
        this.hide_buscar = true;
        this.nota_almacen_s
          .GetOrdenCompraByCorrelativo(correlativo, anio)
          .subscribe(
            (data: any) => {
              this.hide_buscar = false;
              if (data[0][0].respuesta == 1) {
                let datos_generales = data[0][0];
                this.idOrdenCompra = datos_generales.idOrdenCompra;
                this.idCompra = datos_generales.idCompra;
                vista.setDatosOC(data);
                this.tasaCambio = datos_generales.tasaCambio;
                this.igvTotal = datos_generales.igvTotal;
                this.subtotal = datos_generales.subtotal;
                this.total = datos_generales.total;
                this.mostrarDatos = true;
                this.mostrarOC = true;
                this.mostrarBotones = true;
                this.chgRef.markForCheck();
              } else {
                this.mostrarDatos = false;
                this.mostrarOC = false;
                this.mostrarBotones = false;
                this.chgRef.markForCheck();
                this.toastr.errorToastr(data[0][0].Message, "Error!", {
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
      } else {
        this.toastr.errorToastr("No existe orden de producción", "Error!", {
          toastTimeout: 2000,
          showCloseButton: true,
          animate: "fade",
          progressBar: true,
        });
      }
    }
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
    const modalRef = this.modalService.open(AgregarMaterialEntradaComponent, {
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

  editarMaterial(idMaterial) {
    const modalRef = this.modalService.open(EditMaterialEntradaComponent, {
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

  /* Accion de verificar el documento */
  verificarOperacion() {
    this.array_materiales = [];
    let tipo_operacion = this.controlsBusca.TipoOperacion.value;
    if (tipo_operacion == "0002") {
      this.controlsBusca.TipoDocumento.setValue("0001");
      this.verificarDocumento();
    } else if (tipo_operacion == "0007") {
      this.idCompra = this.idOrdenCompra = 0;
      this.controlsBusca.TipoDocumento.setValue("0006");
      this.verificarDocumento();
    } else {
      this.idCompra = this.idOrdenCompra = 0;
      this.controlsBusca.TipoDocumento.setValue("0015");
      this.verificarDocumento();
    }
  }

  verificarDocumento() {
    this.array_materiales = [];
    let tipo_documento = this.controlsBusca.TipoDocumento.value;
    if (tipo_documento == "0001" && this.idNotaAlmacen == 0) {
      this.clase = "col-lg-3 col-6 mb-5";
      this.habilitarbusqueda = true;
      this.mostrarDatos = false;
      this.mostrarOC = false;
      this.mostrarDetalleOC = false;
      this.mostrarOtros = false;
      this.mostrarBotones = false;
    } else if (tipo_documento == "0015") {
      this.clase = "col-lg-4 col-6 mb-5";
      this.idCompra = this.idOrdenCompra = 0;
      this.habilitarbusqueda = false;
      this.mostrarDatos = true;
      this.mostrarBotones = true;
      this.mostrarOtros = true;
      this.mostrarOC = false;
      this.mostrarDetalleOC = false;
    } else if (tipo_documento == "0006") {
      this.clase = "col-lg-3 col-6 mb-5";
      this.idCompra = this.idOrdenCompra = 0;
      this.controlsBusca.TipoOperacion.setValue("19");
      this.habilitarbusqueda = true;
      this.mostrarDatos = false;
      this.mostrarOC = false;
      this.mostrarDetalleOC = false;
      this.mostrarOtros = false;
      this.mostrarBotones = false;
    } else {
      this.clase = "col-lg-4 col-6 mb-5";
      this.idCompra = this.idOrdenCompra = 0;
      this.habilitarbusqueda = false;
      this.mostrarDatos = true;
      this.mostrarBotones = true;
      this.mostrarOtros = true;
      this.mostrarOC = false;
      this.mostrarDetalleOC = false;
    }
  }

  /* Guardar o registrar una Nota de entrada */
  saveNotaEntrada(vista) {
    if (this.idOrdenCompra>0) {
      this.saveNotaEntradaOC(vista);
    } else {
      this.save(null);
    }
  }

  save(data) {
    this.hide_load_guardar = false;
    this.estado = "0003";

    if (this.formDatos.invalid) {
      this.hide_load_guardar = true;
      Object.keys(this.controlsDatos).forEach((controlName) => {
        this.controlsDatos[controlName].markAsTouched();
      });
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

    let datos = this.prepare_nota_entrada(data);
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
  
  saveNotaEntradaOC(vista) {
    this.hide_load_guardar = false;
    this.estado = "0003";

    vista.saveNotaEntradaOC().then((result) => {
      this.array_materiales = result.materiales;
      this.array_materiales_eliminados = result.materiales_eliminados;
      this.save(result);
    }).catch((err) => {
      this.hide_load_guardar = err.hide_guardar;
    });
  }

  prepare_nota_entrada(datos_oc) {
    let datos_generales = [];
    let datos_detalle = [];

    datos_generales.push({
      idNotaAlmacen: this.idNotaAlmacen,
      idOrdenCompra: this.idOrdenCompra ? this.idOrdenCompra : 0,
      idCompra: this.idCompra ? this.idCompra : 0,
      idTipoNota: "0001",
      tipoOperacion: this.controlsBusca.TipoOperacion.value,
      tipoDocumento: this.controlsBusca.TipoDocumento.value,
      idEstablecimiento: this.controlsDatos.Establecimiento.value,
      serie: datos_oc?datos_oc.serieDoc:'',
      numero: datos_oc?datos_oc.numeroDoc:'',
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
      observaciones: datos_oc?datos_oc.observacion:this.controlsDatos.Observacion.value,
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
        valorUnitario: this.array_materiales[i].valorUnit,
        precioUnitario: this.array_materiales[i].precioUnit,
        cantidad: this.array_materiales[i].cantidad,
        valorTotal: this.array_materiales[i].valorTotal,
        precioTotal: this.array_materiales[i].precioTotal,
        cantidadTotal: this.array_materiales[i].cantidadTotal,
        idUnidadMedida: this.array_materiales[i].idUnidadMedida,
        unidadMedida: this.array_materiales[i].unidadMedida,
        observacion: this.deta_formObservacion[i]
          ? this.deta_formObservacion[i].value
          : "",
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
        idPresentacion: this.array_materiales_eliminados[i].idPresentacion
          ? this.array_materiales_eliminados[i].idPresentacion
          : 0,
        nombrePresentacion: this.array_materiales_eliminados[i].nombrePresentacion
          ? this.array_materiales_eliminados[i].nombrePresentacion
          : "",
        valorUnitario: this.array_materiales_eliminados[i].valorUnit,
        precioUnitario: this.array_materiales_eliminados[i].precioUnit,
        cantidad: this.array_materiales_eliminados[i].cantidad,
        valorTotal: this.array_materiales_eliminados[i].valorTotal,
        precioTotal: this.array_materiales_eliminados[i].precioTotal,
        cantidadTotal: this.array_materiales_eliminados[i].cantidadTotal,
        idUnidadMedida: this.array_materiales_eliminados[i].idUnidadMedida,
        unidadMedida: this.array_materiales_eliminados[i].unidadMedida,
        observacion: this.deta_formObservacion[i]
          ? this.deta_formObservacion[i].value
          : "",
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
