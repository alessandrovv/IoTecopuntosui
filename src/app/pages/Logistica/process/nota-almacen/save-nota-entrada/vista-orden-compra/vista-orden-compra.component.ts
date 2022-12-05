import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { PermissionViewActionService } from 'src/app/Shared/services/permission-view-action.service';
import { DatePipe } from '@angular/common';
import { OrdenCompraService } from '../../../../_core/services/orden-compra.service';
import { NotaAlmacenService } from '../../../../_core/services/nota-almacen.service';
import { AgregarMaterialEntradaComponent } from '../agregar-material-entrada/agregar-material-entrada.component';
import { EditMaterialEntradaComponent } from '../edit-material-entrada/edit-material-entrada.component';

@Component({
  selector: "app-vista-orden-compra",
  templateUrl: "./vista-orden-compra.component.html",
  styleUrls: ["./vista-orden-compra.component.scss"],
  providers: [
    DatePipe,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class VistaOrdenCompraComponent implements OnInit {
  /* Salida y entrada de datos */
  
  /* Datos Orden Compra */
  formOrdenCompra: FormGroup;
  mostrarOC: boolean = false;
  idOrdenCompra: number;
  idCompra: number;
  nDecimales: number = 2;
  hide_load_guardar: boolean;
  igv: any;
  mostrarBotones: boolean = false;

  /* Datos detalle de orden de compra */
  formGroupDetalle: FormGroup;
  array_materiales: any = [];
  array_detalle_original: any = [];
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getIgv();
    this.formularioOrdenCompra();
    this.formDetalleNota();
  }

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
      SerieDocumento: [null],
      NumeroDocumento: [null],
      Observacion: [null],
    });
  }

  get controlsOrden() {
    return this.formOrdenCompra.controls;
  }

  setDatosOC(data) {
    let datos_generales = data[0][0];
    this.mostrarBotones = true;
    this.idOrdenCompra = datos_generales.idOrdenCompra;
    this.idCompra = datos_generales.idCompra;
    this.controlsOrden.Codigo.setValue(datos_generales.codigo);
    this.controlsOrden.Proveedor.setValue(datos_generales.proveedor);
    this.controlsOrden.TipoDocumento.setValue(datos_generales.tipoDocumento);
    this.controlsOrden.FormaPago.setValue(datos_generales.formaPago);
    this.controlsOrden.FechaEmision.setValue(
      this.datePipe.transform(datos_generales.fechaEmision, "yyyy-MM-dd")
    );
    this.controlsOrden.FechaEntrega.setValue(
      this.datePipe.transform(datos_generales.fechaEntrega, "yyyy-MM-dd")
    );
    this.controlsOrden.TipoMoneda.setValue(datos_generales.moneda);
    this.controlsOrden.SerieDocumento.setValue(datos_generales.serie);
    this.controlsOrden.NumeroDocumento.setValue(datos_generales.numero);
    this.nDecimales = datos_generales.numDecimales;
    this.array_materiales = [];
    this.array_detalle_original = [];
    let datos_detalle = data[1];
    datos_detalle.forEach((e) => {
      e.idDetalleNota = 0;
      this.pushMaterial(e);
      this.array_detalle_original.push({ ...e });
    });
    this.toastr.successToastr(datos_generales.Message, "Correcto!", {
      toastTimeout: 2000,
      showCloseButton: true,
      animate: "fade",
      progressBar: true,
    });
    this.chgRef.markForCheck();
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
    this.array_detalle_original.forEach((e) => {
      this.pushMaterial({ ...e });
    });
    this.chgRef.markForCheck();
  }

  saveNotaEntradaOC() {
    return new Promise(( result, reject ) => {
      this.hide_load_guardar = false;
      let datos = {
        idOrdenCompra: this.idOrdenCompra,
        idCompra: this.idCompra,
        serieDoc: this.controlsOrden.SerieDocumento.value,
        numeroDoc: this.controlsOrden.NumeroDocumento.value,
        observacion: this.controlsOrden.Observacion.value,
        materiales: this.array_materiales,
        materiales_eliminados: this.array_materiales_eliminados,
        hide_guardar: this.hide_load_guardar,
      };

      if (this.formOrdenCompra.invalid) {
        this.hide_load_guardar = true;
        Object.keys(this.controlsOrden).forEach((controlName) => {
          this.controlsOrden[controlName].markAsTouched();
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
        datos.hide_guardar = this.hide_load_guardar;
        reject(datos);
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
        datos.hide_guardar = this.hide_load_guardar;
        reject(datos);
      }
      result(datos);
    });
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
