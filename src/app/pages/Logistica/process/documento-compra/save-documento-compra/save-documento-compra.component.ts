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
import { SaveUpdateProveedoresModalComponent } from '../../_shared/save-update-proveedores-modal/save-update-proveedores-modal.component';
import { AgregarTasaCambioComponent } from '../../_shared/agregar-tasa-cambio/agregar-tasa-cambio.component';
import { AgregarMaterialComponent } from '../../_shared/agregar-material/agregar-material.component';

@Component({
  selector: "app-save-documento-compra",
  templateUrl: "./save-documento-compra.component.html",
  styleUrls: ["./save-documento-compra.component.scss"],
  providers: [
    DatePipe,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class SaveDocumentoCompraComponent implements OnInit {
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
    "Acciones",
    "Codigo",
    "Material",
    "Categoria",
    "Subcategoria",
    "Clase",
    "Marca",
    "Modelo",
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.viewsActions = this.pvas.get();
    this.fechaActual = new Date().toLocaleDateString("EN-CA");
    this.formularioDatosGenerales();
    this.filterGroupMateriales();
    this.formDetalleDocumento();
    this.filterUltimasCompras();
    this.getIgv();
    this.getCategorias();
    this.getSubCategoria(0);
    this.getClase(0);
    this.getMateriales(0, 0, 0);
    this.getProveedores(0);
    this.getListaOrdenCompra();
    this.getFormaPago(0);
    this.getEstablecimientos(0);
    this.getTipoMoneda();
    this.getTipoDocumentos();
    this.getUltimasCompras(0, 0);
    this.estadoDC = "0001";
  }

  /* Navegación */
  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  /* Formulario Datos Generales */
  formularioDatosGenerales() {
    this.formDatosGenerales = this.fb.group({
      Codigo: [null],
      Proveedor: [null, Validators.compose([Validators.required])],
      OrdenCompra: [null],
      FechaUltimaCompra: [null],
      MontoHistorico: [null],
      TipoDocumento: [null, Validators.compose([Validators.required])],
      FormaPago: [null, Validators.compose([Validators.required])],
      FechaEmision: [
        this.fechaActual,
        Validators.compose([Validators.required]),
      ],
      FechaEntrega: [
        this.fechaActual,
        Validators.compose([Validators.required]),
      ],
      TipoMoneda: [null, Validators.compose([Validators.required])],
      TasaCambio: [null, Validators.compose([Validators.required])],
      Establecimiento: [null, Validators.compose([Validators.required])],
      SerieDocumento: [null, Validators.compose([Validators.required])],
      NumeroDocumento: [null, Validators.compose([Validators.required])],
      IncluyeIgv: [0],
      Anticipo: [0],
      NumeroDecimales: [
        2,
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

  /* Materiales */
  filterGroupMateriales() {
    this.filterGroupMat = this.fb.group({
      searchMaterial: [""],
      Categoria: [null],
      SubCategoria: [null],
      Clase: [null],
    });
  }

  get controlsFilter() {
    return this.filterGroupMat.controls;
  }

  searchMaterial() {
    if (this.filterGroupMat.controls.searchTerm.value == null) {
      this.filterGroupMat.controls.searchTerm.setValue("");
    }
    this.listMateriales.filter = this.filterGroupMat.controls.searchTerm.value
      .trim()
      .toLowerCase();
    if (this.listMateriales.paginator) {
      this.listMateriales.paginator.firstPage();
    }
  }

  /* Detalle del documento */
  formDetalleDocumento() {
    this.formGroupDetalle = this.fb.group({
      Materiales: this.fb.array([]),
    });
  }

  get materiales() {
    return this.formGroupDetalle.controls["Materiales"] as FormArray;
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
          this.getAnticipos();
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getAnticipos() {
    let totalesAnticipos = 0;
    let subtotalesAnticipos = 0;
    this.array_anticipos = [];
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
  }

  /* Anticipo */
  activarAnticipo() {
    if (this.activeAnticipo === 0) {
      this.activeAnticipo = 1;
      this.getAnticipos();
    } else {
      this.activeAnticipo = 0;
      this.getAnticipos();
    }
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

  /* Filtro para tabla de materiales */
  buscarCategoria(val) {
    this.array_subcategorias.forEach((item) => {
      if (item.Subcategoria == val) {
        this.controlsFilter.Categoria.setValue(item.Categoria);
      }
    });
  }

  getCategorias() {
    this.controlsFilter.Categoria.reset();
    this.materiales_s.GetCategorias().subscribe(
      (data: any) => {
        this.array_categorias = data;
        this.array_categorias.unshift({
          Categoria: 0,
          NombreCategoria: "Todos",
        });
        this.controlsFilter.Categoria.setValue(0);
      },
      (error) => {
        console.log("Error en categorias: ", error);
      }
    );
  }

  buscarSubcategoria(val) {
    this.array_clases.forEach((item) => {
      if (item.Clase == val) {
        this.controlsFilter.SubCategoria.setValue(item.Subcategoria);
      }
    });
  }

  getSubCategoria(categoria) {
    this.controlsFilter.SubCategoria.reset();
    this.materiales_s.GetSubcategorias(categoria).subscribe(
      (data: any) => {
        this.array_subcategorias = data;
        this.array_subcategorias.unshift({
          Subcategoria: 0,
          Categoria: 0,
          NombreSubcategoria: "Todos",
        });
        this.controlsFilter.SubCategoria.setValue(0);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getClase(subcategoria) {
    this.controlsFilter.Clase.reset();
    subcategoria = subcategoria ? subcategoria : 0;
    this.materiales_s.GetClases(subcategoria).subscribe(
      (data: any) => {
        this.array_clases = data;
        this.array_clases.unshift({
          Clase: 0,
          Subcategoria: 0,
          Categoria: 0,
          NombreClase: "Todos",
        });
        this.controlsFilter.Clase.setValue(0);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getMateriales(categoria, subcategoria, clase) {
    this.listMateriales = new MatTableDataSource([]);
    this.searchBan = false;
    categoria = categoria ? categoria : 0;
    subcategoria = subcategoria ? subcategoria : 0;
    clase = clase ? clase : 0;
    this.documento_compra_s
      .GetMateriales(categoria, subcategoria, clase, 0)
      .subscribe(
        (data: any) => {
          data = data.filter((e) => e.Activo == true);
          this.searchBan = false;
          this.listMateriales = new MatTableDataSource(data);
          this.listMateriales.sort = this.MatSort;
          this.listMateriales.paginator = this.paginator;
          this.chgRef.markForCheck();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  /* Combos de datos generales */
  getFormaPago(value) {
    this.orden_compra_s.GetFormasPago().subscribe(
      (data: any) => {
        this.array_formasPago = data;
        if (value > 0) {
          this.controlsDatos.FormaPago.setValue(value);
        }
      },
      (error) => {
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

  getTipoMoneda() {
    this.multitabla_s.GetListarMoneda().subscribe(
      (data: any) => {
        this.array_tiposMoneda = data;
        this.controlsDatos.TipoMoneda.setValue("0001");
        this.changeTipoCambio();
      },
      (errorServicio) => {
        console.log(errorServicio);
      }
    );
  }

  getTipoDocumentos() {
    this.orden_compra_s.GetTipoDocumentos().subscribe(
      (data: any) => {
        this.array_tipoDocumentos = data;
      },
      (errorService) => {
        console.log(errorService);
      }
    );
  }

  /* Proveedor */
  nuevoProveedor() {
    const modalRef = this.modalService.open(
      SaveUpdateProveedoresModalComponent,
      { size: "xl" }
    );
    modalRef.result.then(
      (result) => {
        if (result[0].success == true) {
          this.getProveedores(result[0].idProveedor);
        }
      },
      (reason) => {
        console.log(reason);
      }
    );
  }

  getProveedores(valor) {
    this.proveedor_s.GetProveedores(0, 0, 0, 0, 0).subscribe(
      (data: any) => {
        this.array_proveedores = data.filter((e) => e.activo == true);
        if (valor > 0) {
          this.formDatosGenerales.controls.Proveedor.setValue(valor);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getListaOrdenCompra() {
    this.documento_compra_s.OrdenCompraToDocumentoCompra().subscribe(
      (data: any) => {
        this.array_ordenes_compra = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getOrdenCompra(proveedor, valor) {
    this.controlsDatos.OrdenCompra.reset();
    this.array_oc_proveedor = this.array_ordenes_compra.filter(
      (e) => e.idProveedor == proveedor
    );
    if (valor > 0) {
      this.controlsDatos.OrdenCompra.setValue(valor);
    }
    this.chgRef.markForCheck();
  }

  getDatosOrdenCompra(OrdenCompra) {
    if (OrdenCompra) {
      this.documento_compra_s.GetOCenDC(OrdenCompra).subscribe(
        (data: any) => {
          this.datos_generales_oc = data[0][0];
          this.controlsDatos.TipoDocumento.setValue(
            this.datos_generales_oc.IdTipoDocumento
          );
          this.controlsDatos.FormaPago.setValue(
            this.datos_generales_oc.IdFormaPago
          );
          this.controlsDatos.FechaEmision.setValue(
            this.datePipe.transform(
              this.datos_generales_oc.FechaEmision,
              "yyyy-MM-dd"
            )
          );
          this.controlsDatos.FechaEntrega.setValue(
            this.datePipe.transform(
              this.datos_generales_oc.FechaEntrega,
              "yyyy-MM-dd"
            )
          );
          this.controlsDatos.TipoMoneda.setValue(
            this.datos_generales_oc.idMoneda
          );
          this.controlsDatos.TasaCambio.setValue(
            parseFloat(this.datos_generales_oc.TasaCambio).toFixed(3)
          );
          this.controlsDatos.Establecimiento.setValue(
            this.datos_generales_oc.IdEstablecimiento
          );
          this.controlsDatos.IncluyeIgv.setValue(
            this.datos_generales_oc.IncluyeIgv
          );
          this.datos_generales_oc.IncluyeIgv
            ? this.activarIncluyeIgv()
            : (this.activeIncluyeIgv = 0);
          this.controlsDatos.NumeroDecimales.setValue(
            this.datos_generales_oc.NumDecimales
          );
          this.activeDescuentoTotal = this.datos_generales_oc
            .DescuentoTotalActivo
            ? 1
            : 0;
          this.datos_detalle_oc = data[1];
          console.log(data);
          if (this.datos_detalle_oc.length > 0) {
            this.subtotal = this.datos_generales_oc.Subtotal;
            this.total = this.datos_generales_oc.Total;
            this.descuentoTotal = this.datos_generales_oc.Descuento;
            this.descuentoTotalFix = parseFloat(this.descuentoTotal).toFixed(
              this.datos_generales_oc.NumDecimales
            );
            this.igvTotal = this.datos_generales_oc.Igv;
            this.datos_detalle_oc.forEach((element, index) => {
              element.anticipo = 0;
              this.pushMaterial(element);
              this.fixearDecimales();
            });
          } else {
            this.toastr.infoToastr(
              "Todos los materiales ya han sido generados en un documento de compra",
              "Información!",
              {
                toastTimeout: 2000,
                showCloseButton: true,
                animate: "fade",
                progressBar: true,
              }
            );
          }
          this.chgRef.markForCheck();
        },
        (error: any) => {
          console.log(error);
        }
      );
    } else {
      this.controlsDatos.TipoDocumento.reset();
      this.controlsDatos.FormaPago.reset();
      this.controlsDatos.FechaEmision.reset();
      this.controlsDatos.FechaEntrega.reset();
      this.controlsDatos.TipoMoneda.reset();
      this.getTipoMoneda();
      this.controlsDatos.Establecimiento.reset();
      this.controlsDatos.SerieDocumento.reset();
      this.controlsDatos.NumeroDocumento.reset();
      this.controlsDatos.IncluyeIgv.reset();
      this.activeIncluyeIgv == 1 ? this.activarIncluyeIgv() : 0;
      this.controlsDatos.NumeroDecimales.reset();
      this.array_anticipos = [];
      this.array_materiales = [];
      this.materiales.clear();
      this.subtotal = 0;
      this.total = 0;
      this.descuentoTotal = 0;
      this.descuentoTotalFix = "0.00";
      this.igvTotal = 0;
    }
  }

  /* Tasa de cambio */
  changeFechaEmision() {
    let fechaEmision = new Date(this.controlsDatos.FechaEmision.value);
    let fechaEntrega = new Date(this.controlsDatos.FechaEntrega.value);
    if (fechaEntrega < fechaEmision) {
      this.controlsDatos.FechaEntrega.setValue(
        this.controlsDatos.FechaEmision.value
      );
    }
    this.changeTipoCambio();
  }

  changeTipoCambio() {
    let tipoMoneda = this.controlsDatos.TipoMoneda.value;
    if (tipoMoneda === "0001") {
      this.controlsDatos.TasaCambio.setValue("1.000");
      this.controlsDatos.TasaCambio.disable();
      this.disableBtnTasaCambio = true;
    } else {
      if (tipoMoneda) {
        this.getTasaCambio();
      } else {
        this.controlsDatos.TasaCambio.setValue("");
        this.controlsDatos.TasaCambio.disable();
        this.disableBtnTasaCambio = true;
        this.chgRef.markForCheck();
      }
    }
  }

  getTasaCambio() {
    let tipoMoneda = this.controlsDatos.TipoMoneda.value;
    let tasaCambio;
    let fecha = this.controlsDatos.FechaEmision.value;
    this.orden_compra_s.GetTasaCambio(tipoMoneda, fecha).subscribe(
      (data: any) => {
        tasaCambio = data[0];
        if (tasaCambio.Respuesta === 1) {
          this.controlsDatos.TasaCambio.setValue(tasaCambio.valorVenta);
          this.controlsDatos.TasaCambio.disable();
          this.disableBtnTasaCambio = true;
          this.chgRef.markForCheck();
        } else {
          this.toastr.warningToastr(tasaCambio.Mensaje, "Advertencia!", {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: "fade",
            progressBar: true,
          });
          this.controlsDatos.TasaCambio.setValue("");
          this.controlsDatos.TasaCambio.disable();
          this.disableBtnTasaCambio = false;
          this.chgRef.markForCheck();
        }
      },
      (errorServicio) => {
        console.log(errorServicio);
      }
    );
  }

  agregarTasaCambio(fecha) {
    const modalRef = this.modalService.open(AgregarTasaCambioComponent, {
      size: "md",
    });
    modalRef.componentInstance.fecha = fecha;
    modalRef.componentInstance.tipoMoneda = this.controlsDatos.TipoMoneda.value;
    modalRef.result.then(
      (result) => {
        if (result.success) {
          this.changeTipoCambio();
        }
      },
      (reason) => {
        console.log(reason);
      }
    );
  }

  /* Detalle del documento de compra */
  prepareMaterial(item, tipo) {
    let newItem = {
      ...item,
      idDetalle: 0,
      idDocumentoCompra: 0,
      idOrdenCompra: 0,
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
      anticipo: tipo,
      opcion: "A",
    };
    return newItem;
  }

  agregarMaterial(material) {
    const modalRef = this.modalService.open(AgregarMaterialComponent, {
      size: "md",
    });
    modalRef.componentInstance.item = this.prepareMaterial(material, 0);
    modalRef.componentInstance.array_materiales = this.array_materiales;
    modalRef.componentInstance.mostrar = false;
    modalRef.result.then(
      (result: any) => {
        this.pushMaterial(result);
      },
      (reason) => {
        console.log(reason);
      }
    );
  }

  pushMaterial(material) {
    let regexEntMay = /^[1-9]\d*$/;
    let regexDecMay =
      /^([1-9]\d*(\.\d*[1-9][0-9])?)|(0\.\d*[1-9][0-9])|(0\.\d*[1-9])$/;
    const materialForm = this.fb.group({
      Cantidad: [
        material.Cantidad,
        Validators.compose([
          Validators.required,
          Validators.pattern(regexEntMay),
        ]),
      ],
      Descripcion: [material.NombreMaterial],
      CantidadTotal: [material.CantidadTotal],
      ValorUnit: [
        {
          value: parseFloat(material.ValorUnit).toFixed(
            this.controlsDatos.NumeroDecimales.value
          ),
          disabled: this.activeIncluyeIgv == 1 ? true : false,
        },
        Validators.compose([
          Validators.required,
          Validators.pattern(regexDecMay),
        ]),
      ],
      DescuentoUnit: [
        parseFloat(material.DescuentoUnit).toFixed(
          this.controlsDatos.NumeroDecimales.value
        ),
        Validators.compose([Validators.required]),
      ],
      IgvUnit: [parseFloat(material.IgvUnit).toFixed(6)],
      PrecioUnit: [
        {
          value: parseFloat(material.PrecioUnit).toFixed(
            this.controlsDatos.NumeroDecimales.value
          ),
          disabled: this.activeIncluyeIgv == 1 ? false : true,
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
    material.nombreMaterial = this.materiales.controls[idMaterial]["controls"].Descripcion.value;
    material.opcion = "E";
    material.incluyeIgv = this.activeIncluyeIgv;
    material.descTotalActive = this.activeDescuentoTotal;
    material.numDecimales = this.controlsDatos.NumeroDecimales.value;
    modalRef.componentInstance.item = material;
    modalRef.componentInstance.array_materiales = this.array_materiales;
    modalRef.componentInstance.mostrar = false;
    modalRef.result.then(
      (value: any) => {
        const controlsMat = this.materiales.controls[idMaterial]["controls"];
        controlsMat.Descripcion.setValue(value.nombreMaterial);
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

  eliminarMaterial(idMaterial) {
    if (this.array_materiales[idMaterial].idDetalle > 0) {
      this.array_materiales_eliminados.push(this.array_materiales[idMaterial]);
    }
    this.materiales.removeAt(idMaterial);
    this.array_materiales.splice(idMaterial, 1);
    this.sumarMontos();
    this.chgRef.markForCheck();
  }

  agregarMaterialDefault() {
    let materialDefault = this.prepareMaterial(
      {
        codigo: "-",
        nombreMaterial: "",
        descuentoTotal: 0,
        equivalenciaPresentacion: 1.0,
        idMaterial: 0,
        idPresentacion: 0,
        idUnidadMedida: 61,
        nombrePresentacion: "-",
        unidadMedida: "UNIDAD (SERVICIOS)",
        valorTotal: 0,
      },
      1
    );
    this.pushMaterial(materialDefault);
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

  activarDescuentoTotal() {
    let numDecimales = this.controlsDatos.NumeroDecimales.value;
    if (this.activeDescuentoTotal === 0) {
      this.activeDescuentoTotal = 1;
      this.descuentoTotal = 0;
      this.descuentoTotalFix = (0).toFixed(numDecimales);
      if (this.array_materiales.length > 0) {
        for (let i = 0; i < this.materiales.controls.length; i++) {
          this.materiales.controls[i]["controls"]["DescuentoUnit"].setValue(
            (0).toFixed(numDecimales)
          );
          this.calcularTotales(4, i);
          this.materiales.controls[i]["controls"]["DescuentoUnit"].disable();
        }
      }
    } else {
      this.activeDescuentoTotal = 0;
      this.descuentoTotal = 0;
      this.descuentoTotalFix = (0).toFixed(numDecimales);
      if (this.array_materiales.length > 0) {
        for (let i = 0; i < this.array_materiales.length; i++) {
          this.materiales.controls[i]["controls"]["DescuentoUnit"].setValue(
            (0).toFixed(numDecimales)
          );
          this.calcularTotales(4, i);
          this.materiales.controls[i]["controls"]["DescuentoUnit"].enable();
        }
      }
    }
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

  /* Guardar el documento de compra */
  saveUpdateDocumentoCompra(tipoOp) {
    if (tipoOp == "A") {
      this.hide_load_guardar = false;
    } else {
      this.hide_load_cerrar = false;
    }
    if (this.formDatosGenerales.invalid) {
      this.hide_load_guardar = true;
      this.hide_load_cerrar = true;
      this.activeTabId = this.tabs.DATOS_DOC;
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
    if (
      this.array_materiales.length <= 0 ||
      this.materiales.controls.length <= 0
    ) {
      this.hide_load_guardar = true;
      this.hide_load_cerrar = true;
      this.activeTabId = this.tabs.DETALLE;
      this.toastr.warningToastr(
        "Debe registrar por lo menos un material. ",
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
    if (this.materiales.invalid) {
      this.hide_load_guardar = true;
      this.hide_load_cerrar = true;
      this.activeTabId = this.tabs.DETALLE;
      this.materiales.controls.forEach((e) => {
        Object.keys(e["controls"]).forEach((controlName) => {
          e["controls"][controlName].markAsTouched();
        });
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
    this.estadoDC = tipoOp;

    let datos = this.prepareModel();

    this.documento_compra_s.SaveUpdateDocumentoCompra(datos).subscribe(
      (data: any) => {
        console.log(data);
        if (data[0].Ok > 0) {
          this.toastr.successToastr(data[0].Message, "Correcto!", {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: "fade",
            progressBar: true,
          });
          this.router.navigate(["Logistica/process/DocumentoCompra"]);
        } else {
          this.hide_load_guardar = true;
          this.hide_load_cerrar = true;
          this.toastr.errorToastr(data[0].Message, "Error de Ok!", {
            toastTimeout: 1500,
            showCloseButton: true,
            animate: "fade",
            progressBar: true,
          });
        }
        this.chgRef.markForCheck();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  prepareModel() {
    let datosGenerales = [];
    let datosDetalle = [];

    datosGenerales.push({
      idDocumentoCompra: this.idDocumentoCompra,
      idOrdenCompra: this.controlsDatos.OrdenCompra.value,
      idProveedor: this.controlsDatos.Proveedor.value,
      serie: this.controlsDatos.SerieDocumento.value,
      numero: this.controlsDatos.NumeroDocumento.value,
      fechaEmision: this.datePipe.transform(
        this.controlsDatos.FechaEmision.value,
        "yyyy-MM-dd"
      ),
      fechaEntrega: this.datePipe.transform(
        this.controlsDatos.FechaEntrega.value,
        "yyyy-MM-dd"
      ),
      tipoDocumento: this.controlsDatos.TipoDocumento.value,
      formaPago: this.controlsDatos.FormaPago.value,
      idEstablecimiento: this.controlsDatos.Establecimiento.value,
      idMoneda: this.controlsDatos.TipoMoneda.value,
      tasaCambio: parseFloat(this.controlsDatos.TasaCambio.value).toFixed(3),
      incluyeIgv: this.controlsDatos.IncluyeIgv.value,
      anticipo: this.controlsDatos.Anticipo.value,
      descuentoTotalActivo: this.activeDescuentoTotal,
      numDecimales: this.controlsDatos.NumeroDecimales.value,
      subtotal: this.subtotal,
      descuento: this.descuentoTotal,
      igvPorcentaje: this.igv,
      igv: this.igvTotal,
      total: this.total,
      idEstado: this.estadoDC,
      activo: 1,
      eliminado: 0,
    });

    for (let i = 0; i < this.array_materiales.length; i++) {
      let material = this.array_materiales[i];
      datosDetalle.push({
        idDetalle: material.idDetalle,
        idDocumentoCompra: this.idDocumentoCompra,
        idMaterial: material.idMaterial,
        nombreMaterial:
          this.materiales.controls[i]["controls"]["Descripcion"].value,
        idPresentacion: material.idPresentacion,
        presentacion: material.nombrePresentacion,
        equivalencia: material.equivalenciaPresentacion,
        idUnidadMedida: material.idUnidadMedida,
        unidadMedida: material.unidadMedida,
        cantidad: material.Cantidad,
        cantidadTotal: material.CantidadTotal,
        valorUnit: material.ValorUnit,
        descuentoUnit: material.DescuentoUnit,
        precioUnit: material.PrecioUnit,
        igvUnit: material.IgvUnit,
        igvPorcentaje: this.igv,
        precioTotal: material.PrecioTotal,
        valorTotal: material.valorTotal,
        descuentoTotal: material.descuentoTotal,
        activo: 1,
        eliminado: 0,
      });
    }

    for (let i = 0; i < this.array_materiales_eliminados.length; i++) {
      let material = this.array_materiales_eliminados[i];
      datosDetalle.push({
        idDetalle: material.idDetalle,
        idDocumentoCompra: this.idDocumentoCompra,
        idMaterial: material.idMaterial,
        nombreMaterial: material.NombreMaterial,
        idPresentacion: material.idPresentacion,
        presentacion: material.nombrePresentacion,
        equivalencia: material.equivalenciaPresentacion,
        idUnidadMedida: material.idUnidadMedida,
        unidadMedida: material.unidadMedida,
        cantidad: material.Cantidad,
        cantidadTotal: material.CantidadTotal,
        valorUnit: material.ValorUnit,
        descuentoUnit: material.DescuentoUnit,
        precioUnit: material.PrecioUnit,
        igvUnit: material.IgvUnit,
        igvPorcentaje: this.igv,
        precioTotal: material.PrecioTotal,
        valorTotal: material.valorTotal,
        descuentoTotal: material.descuentoTotal,
        activo: 0,
        eliminado: 1,
      });
    }

    console.log(this.array_materiales);
    return {
      datosGenerales: datosGenerales,
      datosDetalle: datosDetalle,
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
