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
import { HttpClient } from '@angular/common/http';
import { DocumentoCompraService } from '../../../_core/services/documento-compra.service';
import { OrdenCompraService } from '../../../_core/services/orden-compra.service';
import { AgregarMaterialComponent } from "../../_shared/agregar-material/agregar-material.component";

@Component({
  selector: "app-ver-documento-compra",
  templateUrl: "./ver-documento-compra.component.html",
  styleUrls: ["./ver-documento-compra.component.scss"],
  providers: [
    DatePipe,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class VerDocumentoCompraComponent implements OnInit {
  /* Datos Generales */
  idDocumentoCompra: number = 0;
  idOrdenCompra: number = 0;
  formDatosGenerales: FormGroup;
  fechaActual: any = new Date();
  igv: number;
  datos_generales_oc: any;
  datos_detalle_oc: any = [];
  array_anticipos: any = [];
  estadoDC: any;
  activeIncluyeIgv: any = 0;
  activeAnticipo: any = 0;

  /* Combos de datos generales */
  array_proveedores: any = [];
  array_ordenes_compra: any = [];
  array_oc_proveedor: any = [];
  array_tipoDocumentos: any = [];
  array_formasPago: any = [];
  array_tiposMoneda: any = [];
  array_establecimientos: any = [];

  /* Tabla de materiales */
  array_materiales: any = [];
  array_materiales_eliminados: any = [];
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
  @ViewChild(MatSort) MatSort: MatSort;
  @ViewChild("matPaginator", { static: true }) paginator: MatPaginator;
  filterGroupMat: FormGroup;
  formGroupDetalle: FormGroup;

  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];

  /* Datos Detalle */
  subtotalAnticipos: any = 0;
  totalAnticipos: any = 0;
  subtotal: any = 0;
  igvTotal: any = 0;
  total: any = 0;
  descuentoTotal: any = 0;
  descuentoTotalFix: any = 0.0;
  activeDescuentoTotal: any = 0;

  /* Tabla Ultimas Compras */
  array_ultimas_compras: any = [];
  filterGroupUltimas: FormGroup;
  searchBanUltimas: boolean = false;
  listUltimasCompras: MatTableDataSource<any>;
  displayedColumnsUlt: string[] = [
    "Nro",
    "Correlativo",
    "TipoDocumento",
    "Documento",
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
  @ViewChild("matPaginatorUC", { static: true }) paginatorUC: MatPaginator;

  /* NAVEGACIÓN */
  tabs = {
    DATOS_DOC: 0,
    DETALLE: 1,
    ULTIMAS_COMPRAS: 2,
  };
  activeTabId = this.tabs.DATOS_DOC;

  /* Combos de Detalle */
  array_categorias: any = [];
  array_subcategorias: any = [];
  array_clases: any = [];

  /* Disabled botones */
  disableBtnTasaCambio: any = true;
  hide_load_guardar: any = true;
  hide_load_cerrar: any = true;

  constructor(
    private fb: FormBuilder,
    public pvas: PermissionViewActionService,
    public toastr: ToastrManager,
    private chgRef: ChangeDetectorRef,
    private proveedor_s: ProveedorService,
    private multitabla_s: MultitablaService,
    private materiales_s: MaterialService,
    private orden_compra_s: OrdenCompraService,
    private documento_compra_s: DocumentoCompraService,
    public modalService: NgbModal,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.viewsActions = this.pvas.get();
    this.fechaActual = new Date().toLocaleDateString("EN-CA");
    this.formularioDatosGenerales();
    this.formDetalleDocumento();
    this.filterUltimasCompras();
    this.getIgv();
    this.idDocumentoCompra = this.route.snapshot.queryParams["id"] || 0;
    if (this.idDocumentoCompra > 0) {
      this.getDatosDocumentoCompra(this.idDocumentoCompra);
    }
  }

  /* Navegación */
  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  /* Formulario Datos Generales */
  formularioDatosGenerales() {
    this.formDatosGenerales = this.fb.group({
      Codigo: [{ value: null, disabled: true }],
      Proveedor: [
        { value: null, disabled: true },
        Validators.compose([Validators.required]),
      ],
      OrdenCompra: [{ value: null, disabled: true }],
      FechaUltimaCompra: [{ value: null, disabled: true }],
      MontoHistorico: [{ value: null, disabled: true }],
      TipoDocumento: [
        { value: null, disabled: true },
        Validators.compose([Validators.required]),
      ],
      FormaPago: [
        { value: null, disabled: true },
        Validators.compose([Validators.required]),
      ],
      FechaEmision: [
        { value: null, disabled: true },
        Validators.compose([Validators.required]),
      ],
      FechaEntrega: [
        { value: null, disabled: true },
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
      SerieDocumento: [
        { value: null, disabled: true },
        Validators.compose([Validators.required]),
      ],
      NumeroDocumento: [
        { value: null, disabled: true },
        Validators.compose([Validators.required]),
      ],
      IncluyeIgv: [{ value: 0, disabled: true }],
      Anticipo: [{ value: 0, disabled: true }],
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
    return this.formDatosGenerales.controls;
  }

  /* IGV */
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

  activarIncluyeIgv() {
    if (this.activeIncluyeIgv === 0) {
      this.activeIncluyeIgv = 1;
      if (this.array_materiales.length > 0) {
        for (let i = 0; i < this.array_materiales.length; i++) {
          this.materiales.controls[i]["controls"]["PrecioUnit"].enable();
          this.materiales.controls[i]["controls"]["ValorUnit"].disable();
        }
      }
    } else {
      this.activeIncluyeIgv = 0;
      if (this.array_materiales.length > 0) {
        for (let i = 0; i < this.array_materiales.length; i++) {
          this.materiales.controls[i]["controls"]["PrecioUnit"].disable();
          this.materiales.controls[i]["controls"]["ValorUnit"].enable();
        }
      }
    }
    this.sumarMontos();
  }

  /* Anticipo */
  activarAnticipo() {
    if (this.activeAnticipo === 0) {
      this.activeAnticipo = 1;
    } else {
      this.activeAnticipo = 0;
    }
  }

  formDetalleDocumento() {
    this.formGroupDetalle = this.fb.group({
      Materiales: this.fb.array([]),
    });
  }

  get materiales() {
    return this.formGroupDetalle.controls["Materiales"] as FormArray;
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
      Descripcion: [{ value: material.NombreMaterial, disabled: true }],
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
      IgvUnit: [parseFloat(material.IgvUnit).toFixed(6)],
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
    this.sumarMontos();
    this.chgRef.markForCheck();
  }

  editarMaterial(idMaterial) {
    const modalRef = this.modalService.open(AgregarMaterialComponent, {
      size: "md",
    });
    let material = this.array_materiales[idMaterial];
    material.opcion = "V";
    material.incluyeIgv = this.activeIncluyeIgv;
    material.descTotalActive = this.activeDescuentoTotal;
    material.numDecimales = this.controlsDatos.NumeroDecimales.value;
    modalRef.componentInstance.item = material;
    modalRef.componentInstance.array_materiales = this.array_materiales;
    modalRef.result.then(
      (value: any) => {
        const controlsMat = this.materiales.controls[idMaterial]["controls"];
        controlsMat.Descripcion.setValue(value.NombreMaterial);
        controlsMat.Cantidad.setValue(value.Cantidad);
        controlsMat.CantidadTotal.setValue(value.CantidadTotal);
        controlsMat.IgvUnit.setValue(value.IgvUnit);
        controlsMat.ValorUnit.setValue(
          parseFloat(value.ValorUnit).toFixed(value.numDecimales)
        );
        controlsMat.DescuentoUnit.setValue(
          parseFloat(value.DescuentoUnit).toFixed(value.numDecimales)
        );
        controlsMat.PrecioUnit.setValue(
          parseFloat(value.PrecioUnit).toFixed(value.numDecimales)
        );
        controlsMat.PrecioTotal.setValue(
          parseFloat(value.PrecioTotal).toFixed(value.numDecimales)
        );
        this.array_materiales[idMaterial] = value;
        this.sumarMontos();
        this.chgRef.markForCheck();
      },
      (reason: any) => {
        console.log(reason);
      }
    );
  }

  fixearDecimales() {
    let nDecimales = this.controlsDatos.NumeroDecimales.value;
    if (nDecimales > 0) {
      for (let i = 0; i < this.array_materiales.length; i++) {
        const material = this.array_materiales[i];
        const crtlMat = this.materiales.controls[i]["controls"];
        crtlMat["ValorUnit"].setValue(
          parseFloat(material.ValorUnit).toFixed(nDecimales)
        );
        crtlMat["DescuentoUnit"].setValue(
          parseFloat(material.DescuentoUnit).toFixed(nDecimales)
        );
        crtlMat["PrecioUnit"].setValue(
          parseFloat(material.PrecioUnit).toFixed(nDecimales)
        );
        crtlMat["PrecioTotal"].setValue(
          parseFloat(material.PrecioTotal).toFixed(nDecimales)
        );
      }
      this.descuentoTotalFix = parseFloat(this.descuentoTotal).toFixed(
        nDecimales
      );
      this.sumarMontos();
    }
  }

  fixLabel(item) {
    let numDecimales =
      this.controlsDatos.NumeroDecimales.value == ""
        ? 0
        : this.controlsDatos.NumeroDecimales.value;
    let strElem = parseFloat(item).toFixed(numDecimales);
    return strElem;
  }

  /* Detalle Documento Compra */
  calcularTotales(tipoOp, index) {
    let material = this.array_materiales[index];
    const controlsMat = this.materiales.controls[index]["controls"];
    if (tipoOp == 4) {
      tipoOp = this.activeIncluyeIgv === 1 ? tipoOp : 5;
    }

    let numDecimales =
      this.controlsDatos.NumeroDecimales.value == ""
        ? 0
        : this.controlsDatos.NumeroDecimales.value;
    let cantidad = parseFloat(
      controlsMat["Cantidad"].value == null ? 0 : controlsMat["Cantidad"].value
    );

    if (tipoOp == 1 || tipoOp == 5) {
      var valorUnit = parseFloat(controlsMat["ValorUnit"].value);
      var descUnit = parseFloat(
        controlsMat["DescuentoUnit"].value == null
          ? 0
          : controlsMat["DescuentoUnit"].value
      );
      var igvUnit = (valorUnit - descUnit) * (this.igv / 100);
      var precioUnit = valorUnit + igvUnit - descUnit;
      material.IgvUnit = igvUnit.toFixed(6);
      controlsMat["IgvUnit"].setValue(igvUnit ? igvUnit.toFixed(6) : 0);
      material.PrecioUnit = precioUnit.toFixed(6);
      controlsMat["PrecioUnit"].setValue(
        precioUnit
          ? precioUnit.toFixed(numDecimales)
          : (0.0).toFixed(numDecimales)
      );
    }
    if (tipoOp == 2 || tipoOp == 4) {
      var precioUnit = parseFloat(controlsMat["PrecioUnit"].value);
      var descUnit = parseFloat(
        controlsMat["DescuentoUnit"].value == null
          ? 0
          : controlsMat["DescuentoUnit"].value
      );
      var valorUnit = precioUnit / (1 + this.igv / 100) + descUnit;
      var igvUnit = precioUnit - valorUnit + descUnit;
      material.IgvUnit = igvUnit.toFixed(6);
      controlsMat["IgvUnit"].setValue(igvUnit ? igvUnit.toFixed(6) : 0);
      material.ValorUnit = valorUnit.toFixed(6);
      controlsMat["ValorUnit"].setValue(
        valorUnit
          ? valorUnit.toFixed(numDecimales)
          : (0.0).toFixed(numDecimales)
      );
    }
    if (tipoOp == 3) {
      if (material.PrecioUnit !== "" || material.PrecioUnit == null) {
        var precioTotal = parseFloat(material.PrecioUnit) * cantidad;
      }
    } else {
      var precioTotal = cantidad * (valorUnit - descUnit + igvUnit);
    }
    if (precioTotal != undefined) {
      material.PrecioTotal = precioTotal.toFixed(6);
      controlsMat["PrecioTotal"].setValue(
        precioTotal
          ? precioTotal.toFixed(numDecimales)
          : (0.0).toFixed(numDecimales)
      );
    }
    if (tipoOp == 3) {
      if (cantidad > 0) {
        var cantidadTotal =
          cantidad * parseFloat(material.equivalenciaPresentacion);
        material.CantidadTotal = cantidadTotal.toFixed(6);
        controlsMat["CantidadTotal"].setValue(cantidadTotal.toFixed(6));
        material.Cantidad = cantidad;
        material.PrecioTotal = precioTotal.toFixed(6);
        material.valorTotal = (precioUnit * cantidad).toFixed(6);
        material.descuentoTotal = (descUnit * cantidad).toFixed(6);
      }
    } else {
      material.DescuentoUnit = descUnit.toFixed(6);
      material.ValorUnit = valorUnit.toFixed(6);
      material.IgvUnit = igvUnit.toFixed(6);
      controlsMat["IgvUnit"].setValue(igvUnit ? igvUnit.toFixed(6) : 0);
      material.PrecioUnit = precioUnit.toFixed(6);
      material.PrecioTotal = precioTotal.toFixed(6);
      material.valorTotal = (precioUnit * cantidad).toFixed(6);
      material.descuentoTotal = (descUnit * cantidad).toFixed(6);
    }
    this.chgRef.markForCheck();
    this.sumarMontos();
  }

  sumarMontos() {
    let sumaSubTotal = 0;
    let sumaTotal = 0;
    let sumaDescuento = 0;

    this.array_materiales.forEach((item, i) => {
      if (this.activeIncluyeIgv === 1) {
        item.Cantidad == null || item.ValorUnit == null
          ? (sumaSubTotal = sumaSubTotal)
          : (sumaSubTotal +=
              parseFloat(item.Cantidad) * parseFloat(item.ValorUnit));
        item.Cantidad == null || item.PrecioUnit == null
          ? (sumaTotal = sumaTotal)
          : (sumaTotal +=
              parseFloat(item.Cantidad) * parseFloat(item.PrecioUnit));
        item.Cantidad == null || item.DescuentoUnit == null
          ? (sumaDescuento = sumaDescuento)
          : (sumaDescuento +=
              parseFloat(item.Cantidad) * parseFloat(item.DescuentoUnit));
      } else {
        item.Cantidad == null || item.ValorUnit == null
          ? (sumaSubTotal = sumaSubTotal)
          : (sumaSubTotal +=
              parseFloat(item.Cantidad) * parseFloat(item.ValorUnit));
        item.PrecioTotal == null
          ? (sumaTotal = sumaTotal)
          : (sumaTotal +=
              parseFloat(item.Cantidad) * parseFloat(item.ValorUnit));
        item.Cantidad == null || item.DescuentoUnit == null
          ? (sumaDescuento = sumaDescuento)
          : (sumaDescuento +=
              parseFloat(item.Cantidad) * parseFloat(item.DescuentoUnit));
      }
    });

    if (this.activeDescuentoTotal === 1) {
      sumaDescuento =
        parseFloat(this.descuentoTotalFix) > 0
          ? parseFloat(this.descuentoTotalFix)
          : 0;
      this.descuentoTotal = parseFloat(this.descuentoTotalFix).toFixed(6);
    }
    if (this.activeIncluyeIgv === 1) {
      this.activeAnticipo == 0
        ? (sumaTotal = sumaTotal - parseFloat(this.totalAnticipos))
        : (sumaTotal = sumaTotal);
      var subT = sumaTotal / (1 + this.igv / 100) + sumaDescuento;
      subT != undefined
        ? (this.subtotal = subT.toFixed(6))
        : (this.subtotal = 0);
      if (this.activeDescuentoTotal === 0) {
        this.descuentoTotal = sumaDescuento.toFixed(6);
        this.descuentoTotalFix = this.fixLabel(this.descuentoTotal);
      }
      sumaTotal != undefined
        ? (this.total = sumaTotal.toFixed(6))
        : (this.total = 0);
      var igvT = sumaTotal + sumaDescuento - subT;
      igvT != undefined
        ? (this.igvTotal = igvT.toFixed(6))
        : (this.igvTotal = 0);
    } else {
      this.activeAnticipo == 0
        ? (sumaSubTotal = sumaSubTotal - parseFloat(this.subtotalAnticipos))
        : (sumaSubTotal = sumaSubTotal);
      var igvTot = (sumaSubTotal - sumaDescuento) * (this.igv / 100);
      sumaSubTotal != undefined
        ? (this.subtotal = sumaSubTotal.toFixed(6))
        : (this.subtotal = 0);
      if (this.activeDescuentoTotal === 0) {
        this.descuentoTotal = sumaDescuento.toFixed(6);
        this.descuentoTotalFix = this.fixLabel(this.descuentoTotal);
      }
      igvTot != undefined
        ? (this.igvTotal = igvTot.toFixed(6))
        : (this.igvTotal = 0);
      var totalDet = sumaSubTotal - sumaDescuento + igvTot;
      totalDet != undefined
        ? (this.total = totalDet.toFixed(6))
        : (this.total = 0);
    }
  }

  /* Tabla de Ultimas Compras */
  filterUltimasCompras() {
    this.filterGroupUltimas = this.fb.group({
      searchUltimas: [""],
    });
  }

  get controlsUltimas() {
    return this.filterGroupUltimas.controls;
  }

  searchUltimasCompras() {
    if (this.controlsUltimas.searchUltimas.value == null) {
      this.controlsUltimas.searchUltimas.setValue("");
    }
    this.listUltimasCompras.filter = this.controlsUltimas.searchUltimas.value
      .trim()
      .toLowerCase();
    if (this.listUltimasCompras.paginator) {
      this.listUltimasCompras.paginator.firstPage();
    }
  }

  getUltimasCompras(idProveedor, idDocumentoCompra) {
    this.listUltimasCompras = new MatTableDataSource([]);
    this.searchBanUltimas = false;
    idProveedor == null ? (idProveedor = 0) : idProveedor;
    idDocumentoCompra == null ? (idDocumentoCompra = 0) : idDocumentoCompra;
    this.documento_compra_s
      .GetUltimasComprasDC(idProveedor, idDocumentoCompra)
      .subscribe(
        (data: any) => {
          this.array_ultimas_compras = data[0];
          this.searchBanUltimas = false;
          this.listUltimasCompras = new MatTableDataSource(
            this.array_ultimas_compras
          );
          this.listUltimasCompras.sort = this.MatSort;
          this.listUltimasCompras.paginator = this.paginatorUC;
          let datos_adicionales = data[1][0];
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
          let totalesAnticipos = 0;
          let subtotalesAnticipos = 0;
          this.array_ultimas_compras.forEach((element) => {
            if (
              element.anticipo == 1 &&
              (element.idOrdenCompra == this.controlsDatos.OrdenCompra.value ||
                element.idOrdenCompra == this.idOrdenCompra)
            ) {
              if (!this.controlsDatos.Anticipo.value) {
                this.array_anticipos.push(element);
                element.total == ""
                  ? (totalesAnticipos = totalesAnticipos)
                  : (totalesAnticipos += parseFloat(element.total));
                element.subtotal == ""
                  ? (subtotalesAnticipos = subtotalesAnticipos)
                  : (subtotalesAnticipos += parseFloat(element.subtotal));
              }
            }
          });
          this.subtotalAnticipos = subtotalesAnticipos.toFixed(6);
          this.totalAnticipos = totalesAnticipos.toFixed(6);
          this.sumarMontos();
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getDatosDocumentoCompra(idDocumentoCompra) {
    this.documento_compra_s
      .GetDatosDocumentoCompra(idDocumentoCompra)
      .subscribe(
        (data: any) => {
          let generales = data[0][0];
          this.estadoDC = generales.idEstado;
          this.idOrdenCompra = generales.idOrdenCompra;
          this.controlsDatos.Codigo.setValue(generales.codigo);
          this.controlsDatos.Proveedor.setValue(generales.ruc + ' | ' + generales.proveedor);
          // this.getProveedores(generales.idProveedor);
          this.getUltimasCompras(
            generales.idProveedor,
            generales.idDocumentoCompra
          );
          this.controlsDatos.OrdenCompra.setValue(generales.codigoOC + ' | ' + generales.totalOC + ' | ' + generales.fechaEmisionOC);
          this.controlsDatos.TipoDocumento.setValue(generales.moneda);
          this.controlsDatos.FormaPago.setValue(generales.formaPago);
          this.controlsDatos.TipoMoneda.setValue(generales.moneda);
          this.controlsDatos.TasaCambio.setValue(parseFloat(generales.tasaCambio).toFixed(3));
          this.controlsDatos.FechaEmision.setValue(
            this.datePipe.transform(generales.fechaEmision, "yyyy-MM-dd")
          );
          this.controlsDatos.FechaEntrega.setValue(
            this.datePipe.transform(generales.fechaEntrega, "yyyy-MM-dd")
          );
          this.controlsDatos.Establecimiento.setValue(generales.direccionEst);
          this.controlsDatos.SerieDocumento.setValue(generales.serie);
          this.controlsDatos.NumeroDocumento.setValue(generales.numero);
          this.controlsDatos.IncluyeIgv.setValue(generales.incluyeIgv);
          this.controlsDatos.Anticipo.setValue(generales.anticipo);
          this.controlsDatos.NumeroDecimales.setValue(generales.numDecimales);
          this.activeDescuentoTotal = generales.descuentoTotalActivo ? 1 : 0;
          if (generales.incluyeIgv) {
            this.activarIncluyeIgv();
          }
          if (generales.anticipo) {
            this.activarAnticipo();
          }
          this.subtotal = generales.subtotal;
          this.igvTotal = generales.igv;
          this.descuentoTotal = generales.descuento;
          this.descuentoTotalFix = parseFloat(generales.descuento).toFixed(
            generales.numDecimales
          );
          this.total = generales.total;
          this.igv = generales.igvPorcentaje;

          let detalle = data[1];
          if (detalle.length > 0) {
            detalle.forEach((element) => {
              this.pushMaterial(element);
            });
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  copiarDocumento() {
    this.router.navigate(["Logistica/process/DocumentoCompra/copy"], {
      queryParams: {
        id: this.idDocumentoCompra,
      },
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
