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
import { Router } from '@angular/router';
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
  selector: "app-save-orden-compra",
  templateUrl: "./save-orden-compra.component.html",
  styleUrls: ["./save-orden-compra.component.scss"],
  providers: [
    DatePipe,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class SaveOrdenCompraComponent implements OnInit {
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
    "Acciones",
    "Codigo",
    "Material",
    "Categoria",
    "Subcategoria",
    "Clase",
    "Marca",
    "Modelo",
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
  ) {}

  ngOnInit(): void {
    this.getIgv();
    this.listMateriales = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();
    this.fechaActual = new Date().toLocaleDateString("EN-CA");
    this.formDatosGenerales();
    this.filterFormMateriales();
    this.filterFormUltCompras();
    this.formGroupDocumentoCompra();
    this.formGroupMateriales();
    this.getProveedores(0);
    this.getTipoMoneda();
    this.getTipoDocumentos();
    this.getCategorias();
    this.getSubCategoria(0);
    this.getClase(0);
    this.getMateriales(0, 0, 0);
    this.getEstablecimientos(0);
    this.getFormaPago(0);
    this.getUltimasCompras(0, 0);
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
      Codigo: [null],
      Proveedor: [null, Validators.compose([Validators.required])],
      CodigoCotizacionProv: [null],
      FechaUltimaCompra: [null],
      MontoHistorico: [null],
      CuentaBancaria: [null],
      Contacto: [null],
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
      IncluyeIgv: [0],
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
    return this.formOrdenCompra.controls;
  }

  /* Cargar fomrulario filtro de la tabla materiales */
  filterFormMateriales() {
    this.filterGroupMat = this.fb.group({
      searchMaterial: [""],
      Categoria: [0],
      SubCategoria: [0],
      Clase: [0],
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

  /* Combo para Proveedores */
  getProveedores(value) {
    this.proveedor_s.GetProveedores(0, 0, 0, 0, 0).subscribe(
      (data: any) => {
        this.array_proveedores = data.filter((e) => e.activo == true);
        if (value>0) {
          this.controlsDatos.Proveedor.setValue(value);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

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

  getDatosProveedor(Proveedor, idCuentaBancaria, idContacto) {
    this.controlsDatos.CuentaBancaria.reset();
    this.controlsDatos.Contacto.reset();
    Proveedor = Proveedor ? Proveedor : 0;
    this.proveedor_s.GetDatosProveedor(Proveedor).subscribe((data: any) => {
      this.array_contactos = data[1];
      this.array_cuentasBancarias = data[2];
      if (idCuentaBancaria > 0) {
        this.controlsDatos.CuentaBancaria.setValue(idCuentaBancaria);
      }
      if (idContacto > 0) {
        this.controlsDatos.Contacto.setValue(idContacto);
      }
    });
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

  /* Carga de combos generales */
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
        this.changeTipoCambio(1, 0);
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
    this.orden_compra_s
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

  /* ------------------ TASA DE CAMBIO ------------------ */
  /* tipoOp === 1 : Para la fecha de Emision de los datos generales */
  /* tipoOp === 2 : Para la fecha de Emision de cada fecha de emision de un documento de compra */
  /* tipoOp === 3 : Para el combo del tipo de moneda */
  changeTipoCambio(tipoOp, index) {
    let tipoMoneda = this.controlsDatos.TipoMoneda.value;
    if (tipoMoneda === "0001") {
      this.controlsDatos.TasaCambio.setValue("1.000");
      this.controlsDatos.TasaCambio.disable();
      this.disableBtnTasaCambio = true;
      for (let i = 0; i < this.dc.controls.length; i++) {
        const dcctrl = this.dc.controls[i]["controls"];
        dcctrl.TasaCambio.setValue("1.000");
        dcctrl.TasaCambio.disable();
        this.btnTasaCambioDc[i] = true;
      }
    } else {
      if (tipoMoneda) {
        if (tipoOp === 3) {
          this.getTasaCambio(1, 0);
          for (let i = 0; i < this.array_docsCompra.length; i++) {
            this.getTasaCambio(2, i);
          }
        } else {
          this.getTasaCambio(tipoOp, index);
        }
      } else {
        this.controlsDatos.TasaCambio.setValue("");
        this.controlsDatos.TasaCambio.disable();
        this.disableBtnTasaCambio = true;
        this.chgRef.markForCheck();
      }
    }
  }

  getTasaCambio(tipoOp, index) {
    let tipoMoneda = this.controlsDatos["TipoMoneda"].value;
    let tasaCambio;
    let fecha;
    if (tipoOp === 1) {
      fecha = this.controlsDatos["FechaEmision"].value;
    } else {
      const dcctrl = this.dc.controls[index]["controls"];
      fecha = dcctrl.FechaEmision.value;
    }
    this.orden_compra_s.GetTasaCambio(tipoMoneda, fecha).subscribe(
      (data: any) => {
        tasaCambio = data[0];
        if (tasaCambio.Respuesta === 1) {
          if (tipoOp === 1) {
            this.controlsDatos.TasaCambio.setValue(tasaCambio.valorVenta);
            this.controlsDatos.TasaCambio.disable();
            this.disableBtnTasaCambio = true;
          } else {
            const dcctrl = this.dc.controls[index]["controls"];
            dcctrl.TasaCambio.setValue(tasaCambio.valorVenta);
            dcctrl.TasaCambio.disable();
            this.btnTasaCambioDc[index] = true;
          }
          this.chgRef.markForCheck();
        } else {
          this.toastr.warningToastr(tasaCambio.Mensaje, "Advertencia!", {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: "fade",
            progressBar: true,
          });
          if (tipoOp === 1) {
            this.controlsDatos.TasaCambio.setValue("");
            this.controlsDatos.TasaCambio.disable();
            this.disableBtnTasaCambio = false;
          } else {
            const dcctrl = this.dc.controls[index]["controls"];
            dcctrl.TasaCambio.setValue("");
            dcctrl.TasaCambio.disable();
            this.btnTasaCambioDc[index] = false;
          }
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
    modalRef.componentInstance.tipoMoneda =
      this.controlsDatos["TipoMoneda"].value;
    modalRef.result.then(
      (result) => {
        if (result.success) {
          this.changeTipoCambio(3, 0);
        }
      },
      (reason) => {
        console.log(reason);
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
        material.Cantidad,
        Validators.compose([
          Validators.required,
          Validators.pattern(regexEntMay),
        ]),
      ],
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

  agregarMaterial(item) {
    const modalRef = this.modalService.open(AgregarMaterialComponent, {
      size: "md",
    });
    console.log(item);
    modalRef.componentInstance.item = this.materialModel(item);
    modalRef.componentInstance.array_materiales = this.array_materiales;
    modalRef.componentInstance.mostrar = true;
    modalRef.result.then(
      (result: any) => {
        this.pushMaterial(result);
      },
      (reason: any) => {
        console.log(reason);
      }
    );
  }

  editarMaterial(idMaterial) {
    const modalRef = this.modalService.open(AgregarMaterialComponent, {
      size: "md",
    });
    let material = this.array_materiales[idMaterial];
    material.opcion = "E";
    material.incluyeIgv = this.activeIncluyeIgv;
    material.descTotalActive = this.activeDescuentoTotal;
    material.numDecimales = this.controlsDatos.NumeroDecimales.value;
    modalRef.componentInstance.item = material;
    modalRef.componentInstance.array_materiales = this.array_materiales;
    modalRef.componentInstance.mostrar = true;
    modalRef.result.then(
      (value: any) => {
        const controlsMat = this.materiales.controls[idMaterial]["controls"];
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
      var subT = sumaTotal / (1 + this.igv / 100) + sumaDescuento;
      subT != undefined
        ? (this.subTotal = subT.toFixed(6))
        : (this.subTotal = 0);
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
      var igvTot = (sumaSubTotal - sumaDescuento) * (this.igv / 100);
      sumaSubTotal != undefined
        ? (this.subTotal = sumaSubTotal.toFixed(6))
        : (this.subTotal = 0);
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

  /* Funciones para check y fecha de emision  */
  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  activarIncluyeIgv() {
    if (this.activeIncluyeIgv === 0) {
      this.activeIncluyeIgv = 1;
      if (this.array_materiales.length > 0) {
        for (let i = 0; i < this.array_materiales.length; i++) {
          const material = this.materiales.controls[i]["controls"];
          material.PrecioUnit.enable();
          material.ValurUnit.disable();
        }
      }
    } else {
      this.activeIncluyeIgv = 0;
      if (this.array_materiales.length > 0) {
        for (let i = 0; i < this.array_materiales.length; i++) {
          const material = this.materiales.controls[i]["controls"];
          material.PrecioUnit.disable();
          material.ValurUnit.enable();
        }
      }
    }
    this.sumarMontos();
  }

  changeFechaEmision() {
    let fechaEmision = new Date(this.controlsDatos["FechaEmision"].value);
    let fechaEntrega = new Date(this.controlsDatos["FechaEntrega"].value);
    if (fechaEntrega < fechaEmision) {
      this.controlsDatos["FechaEntrega"].setValue(
        this.controlsDatos["FechaEmision"].value
      );
    }
    for (let i = 0; i < this.array_docsCompra.length; i++) {
      const dcctrl = this.dc.controls[i]["controls"];
      let fechaDc = new Date(dcctrl.FechaEmision.value);
      if (fechaDc < fechaEmision) {
        dcctrl.FechaEmision.setValue(
          this.controlsDatos["FechaEmision"].value
        );
      }
    }
    this.changeTipoCambio(1, 0);
  }

  /* ---------------- Funciones de documento de Compra ---------------- */
  addDocCompra() {
    let item = {
      id: this.array_docsCompra.length + 1,
      idDocumentoCompra: 0,
      anticipo: 0,
      fechaEmision: null,
      serie: null,
      numero: null,
      tasaCambio: null,
      descripcion: null,
      subtotal: null,
      igv: null,
      total: null,
    };
    this.pushDocCompra(item, null);
  }

  pushDocCompra(item, datoFecha) {
    let index = this.dc.controls.length;
    let fechaEmision = this.controlsDatos.FechaEmision.value;
    let regexDecMay =
      /^([1-9]\d*(\.\d*[1-9][0-9])?)|(0\.\d*[1-9][0-9])|(0\.\d*[1-9])$/;

    const docCompra = this.fb.group({
      Anticipo: [item.anticipo],
      FechaEmision: [
        item.fechaEmision,
        Validators.compose([Validators.required]),
      ],
      Serie: [item.serie, Validators.compose([Validators.required])],
      Numero: [item.numero, Validators.compose([Validators.required])],
      TasaCambio: [item.tasaCambio, Validators.compose([Validators.required])],
      Descripcion: [
        item.descripcion,
        Validators.compose([Validators.required]),
      ],
      Subtotal: [item.subtotal, Validators.compose([Validators.required])],
      Igv: [item.igv, Validators.compose([Validators.required])],
      Total: [
        item.total,
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
      this.changeTipoCambio(2, index);
    }
  }

  deleteDocCompra(item) {
    let index = this.array_docsCompra.indexOf(item);

    if (item.idDocumentoCompra > 0) {
      this.array_docs_eliminados.push(item);
    }
    this.dc.removeAt(index);
    this.array_docsCompra.splice(index, 1);
    this.btnTasaCambioDc.splice(index, 1);
  }

  activarDocCompra() {
    this.activeDocCompra === 0
      ? (this.activeDocCompra = 1)
      : (this.activeDocCompra = 0);
    if (this.activeDocCompra === 0 && this.dc.controls.length > 0) {
    }
    if (this.dc.controls.length === 0) {
      this.addDocCompra();
    }
  }

  changeAnticipo(index: number) {
    const ctrldc = this.dc.controls[index]["controls"];
    if (ctrldc.Anticipo.value == true) {
      this.array_docsCompra[index].anticipo = 1;
      ctrldc.Anticipo.setValue(1);
    } else {
      this.array_docsCompra[index].anticipo = 0;
      ctrldc.Anticipo.setValue(0);
    }
  }

  activarNotaEntrada() {
    if (this.activeNotaEntrada === 0) {
      this.activeNotaEntrada = 1;
      this.deta_formFechaContable = new FormControl(null, [
        Validators.required,
      ]);
      this.deta_formFechaContable.setValue(this.fechaActual);
    } else {
      this.activeNotaEntrada = 0;
      this.deta_formFechaContable = null;
    }
  }

  calcularAnticipo(index) {
    const ctrldc = this.dc.controls[index]["controls"];
    let totalAnticipo = parseFloat(ctrldc.Total.value);
    let subtotalAnticipo = totalAnticipo / (1 + this.igv / 100);
    let igvAnticipo = subtotalAnticipo * (this.igv / 100);

    ctrldc.Subtotal.setValue(subtotalAnticipo.toFixed(6));
    this.array_docsCompra[index].subtotal = subtotalAnticipo.toFixed(6);
    ctrldc.Igv.setValue(igvAnticipo.toFixed(6));
    this.array_docsCompra[index].igv = igvAnticipo.toFixed(6);
    ctrldc.Total.setValue(totalAnticipo.toFixed(6));
    this.array_docsCompra[index].total = totalAnticipo.toFixed(6);
  }

  /* Guardar una orden de compra */
  saveUpdateOrdenCompra(tipoOp) {
    if (tipoOp == "0001") {
      this.hide_load_guardar = false;
    } else if (tipoOp == "0002") {
      this.hide_load_liberar = false;
    } else if (tipoOp == "0003") {
      this.hide_load_cerrar = false;
    }

    if (this.formOrdenCompra.invalid) {
      this.activeTabId = this.tabs.DATOS_ORDEN;
      this.hide_load_guardar = true;
      this.hide_load_liberar = true;
      this.hide_load_cerrar = true;
      Object.keys(this.controlsDatos).forEach((controlName) =>
        this.controlsDatos[controlName].markAsTouched()
      );
      this.toastr.warningToastr(
        "Ingrese los campos obligatorios.",
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

    if (this.array_materiales.length <= 0) {
      this.activeTabId = this.tabs.DETALLE;
      this.hide_load_guardar = true;
      this.hide_load_liberar = true;
      this.hide_load_cerrar = true;
      this.toastr.warningToastr(
        "Debe ingresar por lo menos un material.",
        "Advertencia!",
        {
          toastTimeout: 1500,
          showCloseButton: true,
          animate: "fade",
          progressBar: true,
        }
      );
      return;
    }

    if (this.materiales.invalid) {
      this.hide_load_guardar = true;
      this.hide_load_liberar = true;
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

    let validaDC: boolean = true;
    if (tipoOp != "0001") {
      if (this.activeDocCompra === 1) {
        this.dc.controls.forEach((e) => {
          console.log(e["controls"].Serie.invalid);
          if (e["controls"].Anticipo.value === 1) {
            if (
              e["controls"].FechaEmision.invalid ||
              e["controls"].TasaCambio.invalid ||
              e["controls"].Serie.invalid ||
              e["controls"].Numero.invalid ||
              e["controls"].Descripcion.invalid ||
              e["controls"].Total.invalid
            ) {
              this.hide_load_guardar = true;
              this.hide_load_liberar = true;
              this.hide_load_cerrar = true;
              this.activeTabId = this.tabs.DOCS_COMPRA;
              e["controls"].FechaEmision.markAsTouched();
              e["controls"].TasaCambio.markAsTouched();
              e["controls"].Serie.markAsTouched();
              e["controls"].Numero.markAsTouched();
              e["controls"].Descripcion.markAsTouched();
              e["controls"].Total.markAsTouched();
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
              validaDC = false;
              return;
            }
          } else {
            if (
              e["controls"].FechaEmision.invalid ||
              e["controls"].TasaCambio.invalid ||
              e["controls"].Serie.invalid ||
              e["controls"].Numero.invalid
            ) {
              this.hide_load_guardar = true;
              this.hide_load_liberar = true;
              this.hide_load_cerrar = true;
              this.activeTabId = this.tabs.DOCS_COMPRA;
              e["controls"].FechaEmision.markAsTouched();
              e["controls"].TasaCambio.markAsTouched();
              e["controls"].Serie.markAsTouched();
              e["controls"].Numero.markAsTouched();
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
              validaDC = false;
              return;
            }
          }
        });
        if (!validaDC) {
          return;
        }
      }
      if (this.activeNotaEntrada === 1) {
        if (this.deta_formFechaContable.invalid) {
          this.hide_load_guardar = true;
          this.hide_load_liberar = true;
          this.hide_load_cerrar = true;
          this.activeTabId = this.tabs.DOCS_COMPRA;
          this.toastr.warningToastr(
            "Ingrese la fecha contable, es obligatorio.",
            "Advertencia!",
            {
              toastTimeout: 2000,
              showCloseButton: true,
              animate: "fade",
              progressBar: true,
            }
          );
          this.deta_formFechaContable.markAsTouched();
          return;
        }
      }
    } else {
      this.dc.controls.forEach((e) => {
        if (
          e["controls"].FechaEmision.invalid ||
          e["controls"].TasaCambio.invalid ||
          e["controls"].Serie.invalid ||
          e["controls"].Numero.invalid
        ) {
          this.hide_load_guardar = true;
          this.hide_load_liberar = true;
          this.hide_load_cerrar = true;
          this.activeTabId = this.tabs.DOCS_COMPRA;
          e["controls"].FechaEmision.markAsTouched();
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
      });
    }

    let datos = this.prepare_model(tipoOp);
    this.orden_compra_s.SaveUpdateOrdenCompra(datos).subscribe(
      (data: any) => {
        if (data[0].Ok > 0) {
          this.toastr.successToastr(data[0].Message, "Correcto!", {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: "fade",
            progressBar: true,
          });
          this.router.navigate(["Logistica/process/OrdenCompra"]);
        } else {
          this.hide_load_guardar = true;
          this.hide_load_liberar = true;
          this.hide_load_cerrar = true;
          this.toastr.errorToastr(data[0].Message, "Error de Ok!", {
            toastTimeout: 1500,
            showCloseButton: true,
            animate: "fade",
            progressBar: true,
          });
        }
      },
      (errorServicio) => {
        this.hide_load_guardar = true;
        this.hide_load_liberar = true;
        this.hide_load_cerrar = true;
        console.log(errorServicio);
      }
    );
  }

  prepare_model(tipoOp) {
    let datosCabecera = [];
    let datosDetalle = [];
    let datosDoc = [];

    let fechaContable;
    if (this.activeNotaEntrada === 1) {
      fechaContable = this.datePipe.transform(
        this.deta_formFechaContable.value,
        "yyyy-MM-dd"
      );
    } else {
      fechaContable = "1900-01-01";
    }

    datosCabecera.push({
      idOrdenCompra: this.idOrdenCompra,
      codigo: this.controlsDatos.Codigo.value,
      idProveedor: this.controlsDatos.Proveedor.value,
      codigoCotizacion: this.controlsDatos.CodigoCotizacionProv.value,
      idCuentaBancaria: this.controlsDatos.CuentaBancaria.value
        ? this.controlsDatos.CuentaBancaria.value
        : 0,
      idContacto: this.controlsDatos.Contacto.value
        ? this.controlsDatos.Contacto.value
        : 0,
      tipoDocumento: this.controlsDatos.TipoDocumento.value,
      idFormaPago: this.controlsDatos.FormaPago.value,
      fechaEmision: this.datePipe.transform(
        this.controlsDatos.FechaEmision.value,
        "yyyy-MM-dd"
      ),
      fechaEntrega: this.datePipe.transform(
        this.controlsDatos.FechaEntrega.value,
        "yyyy-MM-dd"
      ),
      tipoMoneda: this.controlsDatos.TipoMoneda.value,
      tasaCambio: parseFloat(this.controlsDatos.TasaCambio.value).toFixed(3),
      idEstablecimiento: this.controlsDatos.Establecimiento.value,
      incluyeIgv: this.controlsDatos.IncluyeIgv.value,
      numeroDecimales: this.controlsDatos.NumeroDecimales.value,
      descuentoTotalActivo: this.activeDescuentoTotal,
      subtotal: this.subTotal,
      descuento: this.descuentoTotal,
      igv: this.igv.toFixed(2),
      igv2: this.igvTotal,
      total: this.total,
      estadoOrdenCompra: tipoOp,
      documentoCompraActivo: this.activeDocCompra == 1 ? true : false,
      fechaContable: fechaContable,
    });

    for (let i = 0; i < this.array_materiales.length; i++) {
      let material = this.array_materiales[i];
      datosDetalle.push({
        idOrdenCompraDetalle: material.idDetalle,
        idOrdenCompra: this.idOrdenCompra,
        idMaterial: material.idMaterial,
        nombreMaterial: material.nombreMaterial,
        idPresentacion: material.idPresentacion,
        nombrePresentacion: material.nombrePresentacion,
        valorUnitario: material.ValorUnit,
        descuentoUnitario: material.DescuentoUnit,
        precioUnitario: material.PrecioUnit,
        cantidad: material.Cantidad,
        valorTotal: material.valorTotal,
        descuentoTotal: material.descuentoTotal,
        precioTotal: material.PrecioTotal,
        cantidadTotal: material.CantidadTotal,
        idUnidadMedida: material.idUnidadMedida,
        unidadMedida: material.unidadMedida,
        codigoProdProveedor: material.codigoProdProveedor,
        descripcionProdProveedor: material.descripcionProdProveedor,
        activo: 1,
        eliminado: 0,
      });
    }

    for (let i = 0; i < this.array_materiales_eliminados.length; i++) {
      let material = this.array_materiales_eliminados[i];
      datosDetalle.push({
        idOrdenCompraDetalle: material.idDetalle,
        idOrdenCompra: this.idOrdenCompra,
        idMaterial: material.idMaterial,
        nombreMaterial: material.nombreMaterial,
        idPresentacion: material.idPresentacion,
        nombrePresentacion: material.nombrePresentacion,
        valorUnitario: material.ValorUnit,
        descuentoUnitario: material.DescuentoUnit,
        precioUnitario: material.PrecioUnit,
        cantidad: material.Cantidad,
        valorTotal: material.valorTotal,
        descuentoTotal: material.descuentoTotal,
        precioTotal: material.PrecioTotal,
        cantidadTotal: material.CantidadTotal,
        idUnidadMedida: material.idUnidadMedida,
        unidadMedida: material.unidadMedida,
        codigoProdProveedor: material.codigoProdProveedor,
        descripcionProdProveedor: material.descripcionProdProveedor,
        activo: 0,
        eliminado: 1,
      });
    }

    if (this.activeDocCompra === 1) {
      for (let i = 0; i < this.array_docsCompra.length; i++) {
        const ctrlsdc = this.dc.controls[i]["controls"];
        datosDoc.push({
          idDocumentoCompra: this.array_docsCompra[i].idDocumentoCompra,
          idOrdenCompra: this.idOrdenCompra,
          fechaEmisionDc: this.datePipe.transform(
            ctrlsdc.FechaEmision.value,
            "yyyy-MM-dd"
          ),
          serie: ctrlsdc.Serie.value,
          numero: ctrlsdc.Numero.value,
          tasaCambioDc: parseFloat(ctrlsdc.TasaCambio.value).toFixed(3),
          anticipo: ctrlsdc.Anticipo.value ? 1 : 0,
          descripcion:
            ctrlsdc.Descripcion.value && ctrlsdc.Anticipo.value == 1
              ? ctrlsdc.Descripcion.value
              : "",
          subtotal:
            ctrlsdc.Subtotal.value && ctrlsdc.Anticipo.value == 1
              ? ctrlsdc.Subtotal.value
              : "0.000000",
          igvPorcentaje: this.igv.toFixed(2),
          igv:
            ctrlsdc.Igv.value && ctrlsdc.Anticipo.value == 1
              ? ctrlsdc.Igv.value
              : "0.000000",
          total:
            ctrlsdc.Total.value && ctrlsdc.Anticipo.value == 1
              ? ctrlsdc.Total.value
              : "0.000000",
          activo: 1,
          eliminado: 0,
        });
      }

      for (let i = 0; i < this.array_docs_eliminados.length; i++) {
        datosDoc.push({
          idDocumentoCompra: this.array_docs_eliminados[i].idDocumentoCompra,
          idOrdenCompra: this.idOrdenCompra,
          fechaEmisionDc: this.array_docs_eliminados[i].fechaEmision,
          serie: this.array_docs_eliminados[i].serie,
          numero: this.array_docs_eliminados[i].numero,
          tasaCambioDc: parseFloat(
            this.array_docs_eliminados[i].tasaCambio
          ).toFixed(3),
          anticipo: this.array_docs_eliminados[i].anticipo,
          descripcion: this.array_docs_eliminados[i].descripcion,
          subtotal: this.array_docs_eliminados[i].subtotal,
          igvPorcentaje: this.array_docs_eliminados[i].igvPorcentaje,
          igv: this.array_docs_eliminados[i].igv,
          total: this.array_docs_eliminados[i].total,
          activo: 0,
          eliminado: 1,
        });
      }
    } else {
      for (let i = 0; i < this.array_docs_eliminados.length; i++) {
        datosDoc.push({
          idDocumentoCompra: this.array_docs_eliminados[i].idDocumentoCompra,
          idOrdenCompra: this.idOrdenCompra,
          fechaEmisionDc: this.array_docs_eliminados[i].fechaEmision,
          serie: this.array_docs_eliminados[i].serie,
          numero: this.array_docs_eliminados[i].numero,
          tasaCambioDc: parseFloat(
            this.array_docs_eliminados[i].tasaCambio
          ).toFixed(3),
          anticipo: this.array_docs_eliminados[i].anticipo,
          descripcion: this.array_docs_eliminados[i].descripcion,
          subtotal: this.array_docs_eliminados[i].subtotal,
          igvPorcentaje: this.array_docs_eliminados[i].igvPorcentaje,
          igv: this.array_docs_eliminados[i].igv,
          total: this.array_docs_eliminados[i].total,
          activo: 0,
          eliminado: 1,
        });
      }
    }

    return {
      OrdenCompra: datosCabecera,
      OrdenMateriales: datosDetalle,
      DocumentosCompra: datosDoc,
    };
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
