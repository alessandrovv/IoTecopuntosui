import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { MultitablaService } from 'src/app/pages/_core/services/multitabla.service';
import { PermissionViewActionService } from 'src/app/Shared/services/permission-view-action.service';
import { ProveedorService } from '../../../_core/services/proveedor.service';
import { MaterialService } from '../../../_core/services/material.service';
import { DatePipe } from '@angular/common';
import { OrdenCompraService } from '../../../_core/services/orden-compra.service';
import { SaveUpdateProveedoresModalComponent } from '../../_shared/save-update-proveedores-modal/save-update-proveedores-modal.component';
import { AgregarMaterialComponent } from '../../_shared/agregar-material/agregar-material.component';
import { AgregarTasaCambioComponent } from '../../_shared/agregar-tasa-cambio/agregar-tasa-cambio.component';

@Component({
  selector: "app-ver-orden-compra",
  templateUrl: "./ver-orden-compra.component.html",
  styleUrls: ["./ver-orden-compra.component.scss"],
  providers: [
    DatePipe,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class VerOrdenCompraComponent implements OnInit {
  /* Datos generales */
  formOrdenCompra: FormGroup;
  activeIncluyeIgv: any = 0;
  estadoOc: any = "0001";
  idOrdenCompra: number = 0;
  operacion: number;
  fechaActual: any = new Date();

  /* Combo de datos generales */
  array_proveedores: any;
  array_cotizaciones: any;
  array_cuentasBancarias: any;
  array_contactos: any;
  array_tipoDocumentos: any;
  array_formasPago: any;
  array_tiposMoneda: any;
  array_establecimientos: any;
  array_pedidosVenta: any;

  /* Tabla de materiales */
  filterGroupMat: FormGroup;
  array_categorias: any = [];
  array_subcategorias: any = [];
  array_clases: any = [];
  searchBan: boolean = false;
  listMateriales: MatTableDataSource<any>;
  displayedColumns: string[] = [
    "Codigo",
    "Material",
    "Categoria",
    "Subcategoria",
    "Clase",
    "Marca",
    "Modelo",
    "Acciones",
  ];
  @ViewChild("matPaginator", { static: true }) paginator: MatPaginator;

  /* Tabla de ultimas compras */
  filterGroupUltCompras: FormGroup;
  searchBanUltimas: boolean = false;
  listUltimasCompras: MatTableDataSource<any>;
  displayedColumnsUlt: string[] = [
    "Nro",
    "Correlativo",
    "TipoDocumento",
    "Moneda",
    "FechaEmision",
    "Total",
    "Material",
    "Cantidad",
    "PrecioUnitario",
    "Descuento",
    "PrecioTotal",
    "Estado",
  ];
  @ViewChild("matPaginatorU", { static: true }) paginatorU: MatPaginator;

  @ViewChild(MatSort) MatSort: MatSort;

  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];

  /* NAVEGACION */
  tabs = {
    DATOS_ORDEN: 0,
    DETALLE: 1,
    DOCS_COMPRA: 2,
    ULTIMAS_COMPRAS: 3,
  };
  activeTabId = this.tabs.DATOS_ORDEN;

  /* DATOS PARA EL DETALLE */
  formMateriales: FormGroup;
  array_materiales: any = [];
  array_materiales_eliminados: any = [];
  activeDescuentoTotal: any = 0;
  igv: number = 18;
  subTotal: any = 0;
  descuentoTotal: any = 0;
  descuentoTotalFix: any = 0;
  igvTotal: any = 0;
  total: any = 0;

  /* DATOS PARA EL DOCUMENTO DE COMPRA */
  formDocumentoCompra: FormGroup;
  array_docsCompra: any = [];
  array_docs_eliminados: any = [];
  activeDocCompra: any = 0;
  activeNotaEntrada: any = 0;
  deta_formFechaContable: FormControl;

  /* VARIABLES PARA LOS BOTONES */
  disableBtnTasaCambio: boolean = true;
  disableBtnProveedor: boolean = false;
  disableBtnMateriales: boolean = false;
  disableBtnDocCompra: boolean = false;
  btnTasaCambioDc: any = [];
  activo: any;
  hide_load_guardar: Boolean = true;
  hide_load_liberar: Boolean = true;
  hide_load_cerrar: Boolean = true;

  constructor(
    private fb: FormBuilder,
    public pvas: PermissionViewActionService,
    public toastr: ToastrManager,
    private chgRef: ChangeDetectorRef,
    private proveedor_s: ProveedorService,
    private multitabla_s: MultitablaService,
    private materiales_s: MaterialService,
    private orden_compra_s: OrdenCompraService,
    public modalService: NgbModal,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getIgv();
    this.listMateriales = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();
    this.fechaActual = new Date().toLocaleDateString("EN-CA");
    this.formDatosGenerales();
    this.filterFormUltCompras();
    this.formGroupDocumentoCompra();
    this.formGroupMateriales();
    this.idOrdenCompra = this.route.snapshot.queryParams["id"] || 0;
    if (this.idOrdenCompra > 0) {
      this.getDatosOrdenCompra(this.idOrdenCompra);
    } else {
      this.getUltimasCompras(0, 0);
    }
  }

  /* Obtener orden de compra */
  getDatosOrdenCompra(idOrdenCompra: number) {
    this.orden_compra_s.GetDatosOrdenCompra(idOrdenCompra).subscribe(
      (data: any) => {
        let datos_generales = data[0][0];
        this.getUltimasCompras(datos_generales.Proveedor, idOrdenCompra);
        this.controlsDatos.Codigo.setValue(datos_generales.Codigo);
        this.controlsDatos.Proveedor.setValue(datos_generales.nombreProveedor);
        this.controlsDatos.CodigoCotizacionProv.setValue(
          datos_generales.CodigoCotizacion
        );
        if (datos_generales.IdCuentaBancaria) {
          this.controlsDatos.CuentaBancaria.setValue(datos_generales.banco + ' | ' + datos_generales.nroCuenta + ' | ' + datos_generales.monedaCuenta);
        } else {
          this.controlsDatos.CuentaBancaria.setValue('-');
        }
        if (datos_generales.IdContacto) {
          this.controlsDatos.Contacto.setValue(datos_generales.contacto);
        } else {
          this.controlsDatos.Contacto.setValue("-");
        }
        this.controlsDatos.TipoDocumento.setValue(datos_generales.TipoDocumento);
        this.controlsDatos.FormaPago.setValue(datos_generales.FormaPago);
        this.controlsDatos.FechaEmision.setValue(
          this.datePipe.transform(datos_generales.FechaEmision, "yyyy-MM-dd")
        );
        this.controlsDatos.FechaEntrega.setValue(
          this.datePipe.transform(datos_generales.FechaEntrega, "yyyy-MM-dd")
        );
        this.controlsDatos.TipoMoneda.setValue(datos_generales.Moneda);
        this.controlsDatos.TasaCambio.setValue(
          datos_generales.TasaCambio.toFixed(3)
        );
        this.controlsDatos.Establecimiento.setValue(datos_generales.Establecimiento);
        this.controlsDatos.IncluyeIgv.setValue(datos_generales.IncluyeIgv);
        datos_generales.IncluyeIgv == 1
          ? (this.activeIncluyeIgv = 1)
          : (this.activeIncluyeIgv = 0);
        this.controlsDatos.NumeroDecimales.setValue(
          datos_generales.NumDecimales
        );
        datos_generales.descuentoTotalActivo == 1
          ? (this.activeDescuentoTotal = 1)
          : (this.activeDescuentoTotal = 0);
        this.subTotal = datos_generales.Subtotal;
        this.descuentoTotalFix = parseFloat(datos_generales.Descuento).toFixed(
          datos_generales.NumDecimales
        );
        this.descuentoTotal = parseFloat(this.descuentoTotalFix).toFixed(6);
        this.igvTotal = datos_generales.Igv;
        this.igv = datos_generales.IgvPorcentaje;
        this.total = datos_generales.Total;
        this.estadoOc = datos_generales.IdEstado;

        datos_generales.fechaContable = this.datePipe.transform(
          datos_generales.fechaContable,
          "yyyy-MM-dd"
        );
        if (
          datos_generales.fechaContable !== "1900-01-01" &&
          datos_generales.fechaContable !== null
        ) {
          this.activeNotaEntrada = 1;
          this.deta_formFechaContable = new FormControl(null, [
            Validators.required,
          ]);
          this.deta_formFechaContable.setValue(datos_generales.fechaContable);
          this.deta_formFechaContable.disable();
        }

        let datos_detalle = data[1];
        datos_detalle.forEach((element) => {
          this.pushMaterial(element);
        });

        let datos_docsCompra = data[2];
        if (datos_docsCompra.length > 0) {
          datos_docsCompra.forEach((element, index) => {
            element.fechaEmision = this.datePipe.transform(
              element.fechaEmision,
              "yyyy-MM-dd"
            );
            this.pushDocCompra(element, element.fechaEmision);
          });
          this.activeDocCompra = 1;
        }
      },
      (errorServicio) => {
        console.log(errorServicio);
      }
    );
  }

  /* ---------------- OBTENER EL IGV ---------------- */
  getIgv() {
    let date = new Date();
    let anio = date.getFullYear();
    this.orden_compra_s.GetIgv(anio).subscribe(
      (data: any) => {
        this.igv = data[0].porcentaje;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /* Cargar formulario de datos generales */
  formDatosGenerales() {
    this.formOrdenCompra = this.fb.group({
      Codigo: [{ value: null, disabled: true }],
      Proveedor: [
        { value: null, disabled: true },
        Validators.compose([Validators.required]),
      ],
      CodigoCotizacionProv: [{ value: null, disabled: true }],
      FechaUltimaCompra: [{ value: null, disabled: true }],
      MontoHistorico: [{ value: null, disabled: true }],
      CuentaBancaria: [{ value: null, disabled: true }],
      Contacto: [{ value: null, disabled: true }],
      TipoDocumento: [
        { value: null, disabled: true },
        Validators.compose([Validators.required]),
      ],
      FormaPago: [
        { value: null, disabled: true },
        Validators.compose([Validators.required]),
      ],
      FechaEmision: [
        { value: this.fechaActual, disabled: true },
        Validators.compose([Validators.required]),
      ],
      FechaEntrega: [
        { value: this.fechaActual, disabled: true },
        Validators.compose([Validators.required]),
      ],
      TipoMoneda: [
        { value: null, disabled: true },
        Validators.compose([Validators.required]),
      ],
      TasaCambio: [
        { value: null, disabled: true },
        Validators.compose([Validators.required]),
      ],
      Establecimiento: [
        { value: null, disabled: true },
        Validators.compose([Validators.required]),
      ],
      IncluyeIgv: [{ value: 0, disabled: true }],
      NumeroDecimales: [
        { value: 2, disabled: true },
        Validators.compose([
          Validators.pattern(/^[0-6]$/),
          Validators.required,
        ]),
      ],
    });
  }

  get controlsDatos() {
    return this.formOrdenCompra.controls;
  }

  /* Cargar fomrulario filtro de la tabla de ultimas compras */
  filterFormUltCompras() {
    this.filterGroupUltCompras = this.fb.group({
      buscarUltCompras: [""],
    });
  }

  searchUltimasCompras() {
    if (this.filterGroupUltCompras.controls.buscarUltCompras.value == null) {
      this.filterGroupUltCompras.controls.buscarUltCompras.setValue("");
    }
    this.listUltimasCompras.filter =
      this.filterGroupUltCompras.controls.buscarUltCompras.value
        .trim()
        .toLowerCase();
    if (this.listUltimasCompras.paginator) {
      this.listUltimasCompras.paginator.firstPage();
    }
  }

  /* Cargar formulario de documentos de compra */
  formGroupDocumentoCompra() {
    this.formDocumentoCompra = this.fb.group({
      DocumentosCompra: this.fb.array([]),
    });
  }

  get dc() {
    return this.formDocumentoCompra.controls["DocumentosCompra"] as FormArray;
  }

  /* Cargar formgroup de materiales */
  formGroupMateriales() {
    this.formMateriales = this.fb.group({
      Materiales: this.fb.array([]),
    });
  }

  get materiales() {
    return this.formMateriales.controls["Materiales"] as FormArray;
  }

  getUltimasCompras(Proveedor, OrdenCompra) {
    let array_ultimasCompras: any = [];
    let datos_adicionales: any;
    this.controlsDatos.FechaUltimaCompra.setValue("");
    this.controlsDatos.MontoHistorico.setValue("");
    this.listUltimasCompras = new MatTableDataSource([]);
    this.searchBanUltimas = false;
    this.orden_compra_s.GetUltimasCompras(Proveedor, OrdenCompra).subscribe(
      (data: any) => {
        array_ultimasCompras = data[0];
        array_ultimasCompras.forEach((e) => {
          e.fechaEmision = this.datePipe.transform(
            e.fechaEmision,
            "yyyy-MM-dd"
          );
          e.total = parseFloat(e.total).toFixed(e.numDecimales);
          e.precioUnit = parseFloat(e.precioUnit).toFixed(e.numDecimales);
          e.descuentoUnit = parseFloat(e.descuentoUnit).toFixed(e.numDecimales);
          e.precioTotal = parseFloat(e.precioTotal).toFixed(e.numDecimales);
        });
        this.searchBanUltimas = false;
        this.listUltimasCompras = new MatTableDataSource(array_ultimasCompras);
        this.listUltimasCompras.sort = this.MatSort;
        this.listUltimasCompras.paginator = this.paginatorU;

        datos_adicionales = data[1][0];
        if (datos_adicionales) {
          datos_adicionales.ultima_fechaCompra = this.datePipe.transform(
            datos_adicionales.ultima_fechaCompra,
            "yyyy-MM-dd"
          );
          this.controlsDatos.FechaUltimaCompra.setValue(
            datos_adicionales.ultima_fechaCompra
          );
          this.controlsDatos.MontoHistorico.setValue(
            parseFloat(datos_adicionales.montoHistorico).toFixed(2)
          );
        }
      },
      (errorServicio) => {
        console.log(errorServicio);
      }
    );
  }

  /* Funciones para agregar materiales y detalle */
  materialModel(item) {
    let newItem = {
      ...item,
      idDetalle: 0,
      idOrdenCompra: this.idOrdenCompra,
      Cantidad: 0,
      CantidadTotal: 0,
      ValorUnit: 0,
      DescuentoUnit: 0,
      PrecioUnit: 0,
      PrecioTotal: 0,
      IgvUnit: 0,
      igv: this.igv,
      incluyeIgv: this.activeIncluyeIgv,
      numDecimales: this.controlsDatos.NumeroDecimales.value,
      descTotalActive: this.activeDescuentoTotal,
      opcion: "A",
    };
    return newItem;
  }

  pushMaterial(material) {
    let regexEntMay = /^[1-9]\d*$/;
    let regexDecMay =
      /^([1-9]\d*(\.\d*[1-9][0-9])?)|(0\.\d*[1-9][0-9])|(0\.\d*[1-9])$/;
    const materialForm = this.fb.group({
      Cantidad: [
        { value: material.Cantidad, disabled: true },
        Validators.compose([
          Validators.required,
          Validators.pattern(regexEntMay),
        ]),
      ],
      CantidadTotal: [{ value: material.CantidadTotal, disabled: true }],
      ValorUnit: [
        {
          value: parseFloat(material.ValorUnit).toFixed(
            this.controlsDatos.NumeroDecimales.value
          ),
          disabled: true,
        },
        Validators.compose([
          Validators.required,
          Validators.pattern(regexDecMay),
        ]),
      ],
      DescuentoUnit: [
        {
          value: parseFloat(material.DescuentoUnit).toFixed(
            this.controlsDatos.NumeroDecimales.value
          ),
          disabled: true,
        },
        Validators.compose([Validators.required]),
      ],
      IgvUnit: [
        { value: parseFloat(material.IgvUnit).toFixed(6), disabled: true },
      ],
      PrecioUnit: [
        {
          value: parseFloat(material.PrecioUnit).toFixed(
            this.controlsDatos.NumeroDecimales.value
          ),
          disabled: true,
        },
        Validators.compose([
          Validators.required,
          Validators.pattern(regexDecMay),
        ]),
      ],
      PrecioTotal: [
        {
          value: parseFloat(material.PrecioTotal).toFixed(
            this.controlsDatos.NumeroDecimales.value
          ),
          disabled: true,
        },
        Validators.compose([
          Validators.required,
          Validators.pattern(regexDecMay),
        ]),
      ],
    });
    this.materiales.push(materialForm);
    this.array_materiales.push(material);
    this.chgRef.markForCheck();
  }

  editarMaterial(idMaterial) {
    const modalRef = this.modalService.open(AgregarMaterialComponent, {
      size: "md",
    });
    let material = this.array_materiales[idMaterial];
    material.opcion = "V";
    modalRef.componentInstance.item = material;
    modalRef.componentInstance.array_materiales = this.array_materiales;
    modalRef.componentInstance.mostrar = true;
    modalRef.result.then(
      (value: any) => {
        console.log(value);
      },
      (reason: any) => {
        console.log(reason);
      }
    );
  }

  fixLabel(item) {
    let numDecimales =
      this.controlsDatos.NumeroDecimales.value == ""
        ? 0
        : this.controlsDatos.NumeroDecimales.value;
    let strElem = parseFloat(item).toFixed(numDecimales);
    return strElem;
  }

  /* Funciones para check y fecha de emision  */
  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  /* ---------------- Funciones de documento de Compra ---------------- */
  pushDocCompra(item, datoFecha) {
    let index = this.dc.controls.length;
    let fechaEmision = this.controlsDatos.FechaEmision.value;
    let regexDecMay =
      /^([1-9]\d*(\.\d*[1-9][0-9])?)|(0\.\d*[1-9][0-9])|(0\.\d*[1-9])$/;

    const docCompra = this.fb.group({
      Anticipo: [{ value: item.anticipo, disabled: true }],
      FechaEmision: [
        { value: item.fechaEmision, disabled: true },
        Validators.compose([Validators.required]),
      ],
      Serie: [
        { value: item.serie, disabled: true },
        Validators.compose([Validators.required]),
      ],
      Numero: [
        { value: item.numero, disabled: true },
        Validators.compose([Validators.required]),
      ],
      TasaCambio: [
        { value: item.tasaCambio, disabled: true },
        Validators.compose([Validators.required]),
      ],
      Descripcion: [
        { value: item.descripcion, disabled: true },
        Validators.compose([Validators.required]),
      ],
      Subtotal: [
        { value: item.subtotal, disabled: true },
        Validators.compose([Validators.required]),
      ],
      Igv: [
        { value: item.igv, disabled: true },
        Validators.compose([Validators.required]),
      ],
      Total: [
        { value: item.total, disabled: true },
        Validators.compose([
          Validators.required,
          Validators.pattern(regexDecMay),
        ]),
      ],
    });

    this.dc.push(docCompra);
    this.array_docsCompra.push(item);
    this.btnTasaCambioDc.push(true);
    this.chgRef.markForCheck();

    if (datoFecha) {
      this.dc.controls[index]["controls"].FechaEmision.setValue(datoFecha);
    } else {
      this.dc.controls[index]["controls"].FechaEmision.setValue(fechaEmision);
      // this.changeTipoCambio(2, index);
    }
  }

  copiarOrden() {
    this.router.navigate(["Logistica/process/OrdenCompra/copy"], {
      queryParams: {
        id: this.idOrdenCompra,
      },
    });
  }

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
