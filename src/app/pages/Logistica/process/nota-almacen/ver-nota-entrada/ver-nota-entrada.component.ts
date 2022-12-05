import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionViewActionService } from 'src/app/Shared/services/permission-view-action.service';
import { DatePipe } from '@angular/common';
import { OrdenCompraService } from '../../../_core/services/orden-compra.service';
import { NotaAlmacenService } from '../../../_core/services/nota-almacen.service';

@Component({
  selector: "app-ver-nota-entrada",
  templateUrl: "./ver-nota-entrada.component.html",
  styleUrls: ["./ver-nota-entrada.component.scss"],
  providers: [
    DatePipe,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class VerNotaEntradaComponent implements OnInit {
  @ViewChild('ordenCompra') ordenCompra:any;

  /* Datos Generales */
  formDatos: FormGroup;
  array_tipo_operaciones: any = [];
  array_tipo_documento: any = [];
  array_periodos: any = [];
  array_establecimientos: any = [];
  idNotaAlmacen: number = 0;
  igv: any;
  habilitarbusqueda: boolean = true;
  mostrarDatos: boolean = true;
  estado: any;
  hide_buscar: boolean = false;
  nDecimales: number = 2;
  tasaCambio: any;
  idOrdenCompra: number;
  idCompra: number;
  igvTotal: any;
  subtotal: any;
  total: any;
  codigo: any = "";

  /* Datos Orden Compra */
  formOrdenCompra: FormGroup;
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
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.viewsActions = this.pvas.get();
    this.formularioDatos();
    this.formularioOrdenCompra();
    this.formDetalleNota();
    this.idNotaAlmacen = this.route.snapshot.queryParams["id"] || 0;
    if (this.idNotaAlmacen > 0) {
      this.getDatosNotaAlmacen(this.idNotaAlmacen);
    }
    this.getIgv();
  }

  /* Obtener datos de la nota de almacen */
  getDatosNotaAlmacen(idNotaAlmacen) {
    this.nota_almacen_s.GetDatosNotaAlmacen(idNotaAlmacen).subscribe(
      (data: any) => {
        let datosG = data[0][0];
        let datosD = data[1];
        this.codigo = datosG.codigo;
        this.controlsDatos.TipoOperacion.setValue(datosG.tipoOperacion);
        this.controlsDatos.TipoDocumento.setValue(datosG.tipoDocumento);
        this.controlsDatos.Periodo.setValue(datosG.anio);
        this.controlsDatos.FechaEmision.setValue(
          this.datePipe.transform(datosG.fechaEmision, "yyyy-MM-dd")
        );
        this.controlsDatos.FechaContable.setValue(
          this.datePipe.transform(datosG.fechaContable, "yyyy-MM-dd")
        );
        this.controlsDatos.Establecimiento.setValue(datosG.establecimiento);
        if (datosG.idTipoDocumento == "01") {
          this.mostrarOC = true;
          this.mostrarBotones = true;
          this.ordenCompra.getDatosOC(datosG.idOrdenCompra, data);
          this.chgRef.markForCheck();
        } else {
          this.mostrarDatos = true;
          this.mostrarOtros = true;
          this.mostrarBotones = true;
          datosD.forEach((e) => {
            this.pushMaterial({ ...e });
          });
          this.chgRef.markForCheck();
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
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

  formularioDatos() {
    this.formDatos = this.fb.group({
      TipoOperacion: [
        { value: null, disabled: true },
        Validators.compose([Validators.required]),
      ],
      TipoDocumento: [
        { value: null, disabled: true },
        Validators.compose([Validators.required]),
      ],
      Periodo: [
        { value: null, disabled: true },
        Validators.compose([Validators.required]),
      ],
      FechaEmision: [
        { value: null, disabled: true },
        Validators.compose([Validators.required]),
      ],
      FechaContable: [
        { value: null, disabled: true },
        Validators.compose([Validators.required]),
      ],
      Establecimiento: [
        { value: null, disabled: true },
        Validators.compose([Validators.required]),
      ],
      Observacion: [{ value: null, disabled: true }],
    });
  }

  get controlsDatos() {
    return this.formDatos.controls;
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

  pushMaterial(material) {
    this.array_materiales.push(material);
    this.deta_formObservacion.push(
      new FormControl({ value: material.observacion, disabled: true })
    );
  }

  fixedValor(valor) {
    return parseFloat(valor).toFixed(this.nDecimales);
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