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
import { MaterialService } from '../../../../Logistica/_core/services/material.service';
import { DatePipe } from '@angular/common';
import { PedidoVentaService } from '../../../_core/pedido-venta.service';
import { SaveUpdateSucursalComponent } from '../../../masters/cliente/save-update-cliente/save-update-sucursal/save-update-sucursal.component';
import { ClienteModalComponent } from '../cliente-modal/cliente-modal.component';
import { TasaCambioModalComponent } from '../tasa-cambio-modal/tasa-cambio-modal.component';

@Component({
  selector: "app-update-pedido-venta",
  templateUrl: "./update-pedido-venta.component.html",
  styleUrls: ["./update-pedido-venta.component.scss"],
  providers: [
    DatePipe,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class UpdatePedidoVentaComponent implements OnInit {
  /* Datos Generales */
  idPedidoVenta: number = 0;
  idOrdenCompra: number = 0;
  formDatosGenerales: FormGroup;
  fechaActual: any = new Date();
  igv: number;
  estadoPV: any;
  activeIncluyeIgv: any = 0;
  visitaComercial: any;
  urlArchivo:any;


  /* Combos de datos generales */
  array_clientes: any = [];
  array_cotizacion_venta: any = [];
  array_cv_cliente: any = [];
  array_tipoPrecios: any = [];
  array_sucursales: any = [];
  array_cliente_sucursal: any = [];
  array_tipoDocumentos: any = [];
  array_formasPago: any = [];
  array_tiposMoneda: any = [];
  array_establecimientos: any = [];

  /* Tabla de materiales */
  array_materiales: any = [];
  array_materiales_eliminados: any = [];
  array_materiales_pendientes: any = [];
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
  subtotal: any = 0;
  igvTotal: any = 0;
  total: any = 0;
  descuentoTotal: any = 0;

  /* Tabla Ultimas Compras */
  array_ultimas_ventas: any = [];
  filterGroupUltimas: FormGroup;
  searchBanUltimas: boolean = false;
  listUltimasVentas: MatTableDataSource<any>;
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
  @ViewChild("matPaginatorUV", { static: true }) paginatorUV: MatPaginator;

  /* NAVEGACIÓN */
  tabs = {
    DATOS_DOC: 0,
    DETALLE: 1,
    PENDIENTES: 2,
    ULTIMAS_VENTAS: 3,
  };
  activeTabId = this.tabs.DATOS_DOC;

  /* Combos de Detalle */
  array_categorias: any = [];
  array_subcategorias: any = [];
  array_clases: any = [];

  /* Disabled botones */
  disableBtnTasaCambio: any = true;
  hide_load_guardar: any = true;
  hide_load_liberar: any = true;

  constructor(
    private fb: FormBuilder,
    public pvas: PermissionViewActionService,
    public toastr: ToastrManager,
    private chgRef: ChangeDetectorRef,
    private multitabla_s: MultitablaService,
    private materiales_s: MaterialService,
    private pedido_venta_s: PedidoVentaService,
    public modalService: NgbModal,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.viewsActions = this.pvas.get();
    this.fechaActual = new Date().toLocaleDateString("EN-CA");
    this.formularioDatosGenerales();
    this.filterGroupMateriales();
    this.formDetalleDocumento();
    this.filterUltimasVentas();
    this.getIgv();
    this.getSucursales(-1);
    this.getCategorias();
    this.getSubCategoria(0);
    this.getClase(0);
    this.getMateriales(0, 0, 0);
    this.getUltimasVentas(0);
    this.idPedidoVenta = this.route.snapshot.queryParams["id"] || 0;
    if (this.idPedidoVenta > 0) {
      this.getPedidoVenta(this.idPedidoVenta);
    } else {
      this.getClientes(0);
      this.getTiposPrecios(0);
      this.getTipoDocumentos(0);
      this.getFormaPago(0);
      this.getTipoMoneda(0);
      this.getEstablecimientos(0);
    }
  }

  /* Navegación */
  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  /* Formulario Datos Generales */
  formularioDatosGenerales() {
    this.formDatosGenerales = this.fb.group({
      Codigo: [null],
      Visita: [null],
      Vendedor: [null],
      Cliente: [null, Validators.compose([Validators.required])],
      //OrdenCompra: [null],
      FechaUltimaVenta: [null],
      MontoHistorico: [null],
      TipoPrecio: [null, Validators.compose([Validators.required])],
      ClienteSucursal: [null],
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
    return this.formDatosGenerales.controls;
  }

  /* OBTENER PEDIDO DE VENTA */
  getPedidoVenta(id) {
    this.pedido_venta_s.GetPedidoVentaById(id).subscribe(
      (data: any) => {
        // DATOS GENERALES
        let datosg = data[0][0];
        console.log(datosg);
        this.getClientes(datosg.idCliente);
        this.getClienteSucursal(datosg.idCliente, datosg.idClienteSucursal);
        this.getTiposPrecios(datosg.idTipoPrecio);
        this.getTipoDocumentos(datosg.tipoDocumento);
        this.getFormaPago(datosg.formaPago);
        this.getTipoMoneda(datosg.moneda);
        this.getEstablecimientos(datosg.idEstablecimiento);
        this.controlsDatos.Codigo.setValue(datosg.codigo);
        this.controlsDatos.Visita.setValue(datosg.codigoVisitaComercial);
        this.controlsDatos.Vendedor.setValue(datosg.trabajador);
        this.controlsDatos.FechaEmision.setValue(
          this.datePipe.transform(datosg.fechaEmision, "yyyy-MM-dd")
        );
        this.controlsDatos.FechaEntrega.setValue(
          this.datePipe.transform(datosg.fechaEntrega, "yyyy-MM-dd")
        );
        this.controlsDatos.TasaCambio.setValue(datosg.tasaCambio);
        this.controlsDatos.NumeroDecimales.setValue(datosg.numDecimales);
        if (datosg.incluyeIgv) {
          this.controlsDatos.IncluyeIgv.setValue(datosg.incluyeIgv);
          this.activarIncluyeIgv();
        }
        this.subtotal = datosg.subtotal;
        this.descuentoTotal = datosg.descuento;
        this.igv = datosg.igvPorcentaje;
        this.igvTotal = datosg.igvTotal;
        this.total = datosg.total;
        this.estadoPV = datosg.idEstado;
        this.visitaComercial = datosg.codigoVisitaComercial;
        this.urlArchivo = datosg.urlArchivo;

        // DATOS DEL DETALLE
        let datosd = data[1];
        datosd.forEach((e) => {
          this.pushMaterial(e);
        });

        // DATOS PENDIENTES
        let datosp = data[2];
        datosp.forEach((e) => {
          this.array_materiales_pendientes.push({ ...e });
        });
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  /* CLIENTE */
  nuevoCliente() {
    const modalRef = this.modalService.open(ClienteModalComponent, {
      size: "xl",
    });
    modalRef.result.then(
      (result: any) => {
        this.getClientes(0);
      },
      (reason: any) => {
        console.log(reason);
      }
    );
  }

  nuevaSucursal() {
    if (this.controlsDatos.Cliente.invalid) {
      this.toastr.warningToastr(
        "No has seleccionado un cliente.",
        "Advertencia!",
        {
          toastTimeout: 2000,
          showCloseButton: true,
          animate: "fade",
          progressBar: true,
        }
      );
      this.controlsDatos.Cliente.markAsTouched();
      this.chgRef.markForCheck();
    } else {
      const modalRef = this.modalService.open(SaveUpdateSucursalComponent, {
        size: "md",
      });
      modalRef.componentInstance.item = null;
      modalRef.componentInstance.idCliente = this.controlsDatos.Cliente.value;
      modalRef.componentInstance.tipo = "PV";
      modalRef.result.then(
        (result: any) => {
          this.getSucursales(-1);
          this.getClienteSucursal(this.controlsDatos.Cliente.value, 0);
        },
        (reason: any) => {
          console.log(reason);
        }
      );
    }
  }

  getClientes(valor) {
    this.pedido_venta_s.GetClientes().subscribe(
      (data: any) => {
        this.array_clientes = data;
        if (valor > 0 || valor != null) {
          this.controlsDatos.Cliente.setValue(valor);
          this.getUltimasVentas(valor);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  /* COMBOS DATOS GENERALES */
  getTiposPrecios(valor) {
    this.pedido_venta_s.GetTipoPrecios().subscribe(
      (data: any) => {
        this.array_tipoPrecios = data;
        this.controlsDatos.TipoPrecio.setValue(valor);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getSucursales(cliente) {
    this.pedido_venta_s.GetSucursales(cliente).subscribe(
      (data: any) => {
        this.array_cliente_sucursal = data;
        this.array_sucursales = data;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getClienteSucursal(cliente, valor) {
    this.controlsDatos.ClienteSucursal.reset();
    if (cliente > 0) {
      this.array_cliente_sucursal = [
        ...this.array_sucursales.filter((e) => e.idCliente == cliente),
      ];
      if (valor > 0 || valor != null) {
        this.controlsDatos.ClienteSucursal.setValue(valor);
      }
      this.chgRef.markForCheck();
    } else {
      this.array_cliente_sucursal = [...this.array_sucursales];
    }
  }

  buscarCliente(sucursal) {
    if (sucursal > 0) {
      const cliente_sucursal = this.array_sucursales.find(
        (e) => e.idClienteSucursal == sucursal
      );
      this.array_cliente_sucursal = this.array_sucursales.filter(
        (e) => e.idCliente == cliente_sucursal.idCliente
      );
      if (cliente_sucursal.idCliente != this.controlsDatos.Cliente.value) {
        this.controlsDatos.Cliente.setValue(cliente_sucursal.idCliente);
      }
    }
  }

  getTipoDocumentos(valor) {
    this.pedido_venta_s.GetTipoDocumentos().subscribe(
      (data: any) => {
        this.array_tipoDocumentos = data;
        if (valor > 0 || valor != null) {
          this.controlsDatos.TipoDocumento.setValue(valor);
        }
      },
      (errorService) => {
        console.log(errorService);
      }
    );
  }

  getFormaPago(valor) {
    this.pedido_venta_s.GetFormasPago().subscribe(
      (data: any) => {
        this.array_formasPago = data;
        if (valor > 0 || valor != null) {
          this.controlsDatos.FormaPago.setValue(valor);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getTipoMoneda(valor) {
    this.multitabla_s.GetListarMoneda().subscribe(
      (data: any) => {
        this.array_tiposMoneda = data;
        if (valor > 0 || valor != null) {
          this.controlsDatos.TipoMoneda.setValue(valor);
        }
        this.changeTipoCambio();
      },
      (errorServicio) => {
        console.log(errorServicio);
      }
    );
  }

  getEstablecimientos(valor) {
    this.pedido_venta_s.GetEstablecimientos().subscribe(
      (data: any) => {
        this.array_establecimientos = data;
        if (valor>0 || valor!=null) {
          this.controlsDatos.Establecimiento.setValue(valor);
        }
      },
      (error) => {
        console.log(error);
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
          parseFloat(material.valorUnit).toFixed(nDecimales)
        );
        crtlMat["DescuentoUnit"].setValue(
          parseFloat(material.descuentoUnit).toFixed(nDecimales)
        );
        crtlMat["PrecioUnit"].setValue(
          parseFloat(material.precioUnit).toFixed(nDecimales)
        );
        crtlMat["PrecioTotal"].setValue(
          parseFloat(material.precioTotal).toFixed(nDecimales)
        );
      }
      this.sumarMontos();
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
    this.pedido_venta_s.GetTasaCambio(tipoMoneda, fecha).subscribe(
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

  agregarTasaCambio(fechaEmision) {
    const modalRef = this.modalService.open(TasaCambioModalComponent, {
      size: "md",
    });
    modalRef.componentInstance.fecha = fechaEmision;
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

  /* IGV */
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

  /* MATERIALES */
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

  formDetalleDocumento() {
    this.formGroupDetalle = this.fb.group({
      Materiales: this.fb.array([]),
    });
  }

  get materiales() {
    return this.formGroupDetalle.controls["Materiales"] as FormArray;
  }

  buscarSubcategoria(val) {
    this.array_clases.forEach((item) => {
      if (item.Clase == val) {
        this.controlsFilter.SubCategoria.setValue(item.Subcategoria);
      }
    });
  }

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
    this.pedido_venta_s
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

  pushMaterial(material) {
    let regexEntMay = /^[1-9]\d*$/;
    let regexDecMay =
      /^([1-9]\d*(\.\d*[1-9][0-9])?)|(0\.\d*[1-9][0-9])|(0\.\d*[1-9])$/;
    const materialForm = this.fb.group({
      Cantidad: [
        material.cantidad,
        Validators.compose([
          Validators.required,
          Validators.pattern(regexEntMay),
        ]),
      ],
      Descripcion: [material.nombreMaterial],
      CantidadTotal: [material.CantidadTotal],
      ValorUnit: [
        {
          value: parseFloat(material.valorUnit).toFixed(
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
        parseFloat(material.descuentoUnit).toFixed(
          this.controlsDatos.NumeroDecimales.value
        ),
        Validators.compose([Validators.required]),
      ],
      IgvUnit: [parseFloat(material.igvUnit).toFixed(6)],
      PrecioUnit: [
        {
          value: parseFloat(material.precioUnit).toFixed(
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
          value: parseFloat(material.precioTotal).toFixed(
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

  agregarMaterial(material) {
    let existe: boolean = false;
    this.array_materiales.forEach((e) => {
      if (e.idMaterial == material.idMaterial) {
        existe = true;
      }
    });
    if (!existe) {
      let newMaterial = {
        ...material,
        cantidad: null,
        catidadTotal: 0,
        valorUnit: 0,
        descuentoUnit: 0,
        igvUnit: 0,
        precioUnit: 0,
        precioTotal: 0,
      };
      this.pushMaterial(newMaterial);
    } else {
      this.toastr.errorToastr(
        "El material ya ha sido seleccionado. ",
        "Error!",
        {
          toastTimeout: 2000,
          showCloseButton: true,
          animate: "fade",
          progressBar: true,
        }
      );
    }
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

  fixLabel(item) {
    let numDecimales =
      this.controlsDatos.NumeroDecimales.value == ""
        ? 0
        : this.controlsDatos.NumeroDecimales.value;
    let strElem = parseFloat(item).toFixed(numDecimales);
    return strElem;
  }

  /* DETALLE DE VENTA */
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

      material.igvUnit = igvUnit.toFixed(6);
      controlsMat["IgvUnit"].setValue(igvUnit ? igvUnit.toFixed(6) : 0);
      material.precioUnit = precioUnit.toFixed(6);
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

      material.igvUnit = igvUnit.toFixed(6);
      controlsMat["IgvUnit"].setValue(igvUnit ? igvUnit.toFixed(6) : 0);
      material.valorUnit = valorUnit.toFixed(6);
      controlsMat["ValorUnit"].setValue(
        valorUnit
          ? valorUnit.toFixed(numDecimales)
          : (0.0).toFixed(numDecimales)
      );
    }

    if (tipoOp == 3) {
      if (material.precioUnit !== "" || material.precioUnit == null) {
        var precioTotal = parseFloat(material.precioUnit) * cantidad;
      }
    } else {
      var precioTotal = cantidad * (valorUnit - descUnit + igvUnit);
    }

    if (precioTotal != undefined) {
      material.precioTotal = precioTotal.toFixed(6);
      controlsMat["PrecioTotal"].setValue(
        precioTotal
          ? precioTotal.toFixed(numDecimales)
          : (0.0).toFixed(numDecimales)
      );
    }

    if (tipoOp == 3) {
      if (cantidad > 0) {
        material.cantidad = cantidad;
        material.precioTotal = precioTotal.toFixed(6);
        material.valorTotal = (precioUnit * cantidad).toFixed(6);
        material.descuentoTotal = (descUnit * cantidad).toFixed(6);
      }
    } else {
      material.descuentoUnit = descUnit.toFixed(6);
      material.valorUnit = valorUnit.toFixed(6);
      material.igvUnit = igvUnit.toFixed(6);
      controlsMat["IgvUnit"].setValue(igvUnit ? igvUnit.toFixed(6) : 0);
      material.precioUnit = precioUnit.toFixed(6);
      material.precioTotal = precioTotal.toFixed(6);
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
        item.cantidad == null || item.valorUnit == null
          ? (sumaSubTotal = sumaSubTotal)
          : (sumaSubTotal +=
              parseFloat(item.cantidad) * parseFloat(item.valorUnit));
        item.cantidad == null || item.precioUnit == null
          ? (sumaTotal = sumaTotal)
          : (sumaTotal +=
              parseFloat(item.cantidad) * parseFloat(item.precioUnit));
        item.cantidad == null || item.descuentoUnit == null
          ? (sumaDescuento = sumaDescuento)
          : (sumaDescuento +=
              parseFloat(item.cantidad) * parseFloat(item.descuentoUnit));
      } else {
        item.cantidad == null || item.valorUnit == null
          ? (sumaSubTotal = sumaSubTotal)
          : (sumaSubTotal +=
              parseFloat(item.cantidad) * parseFloat(item.valorUnit));
        item.precioTotal == null
          ? (sumaTotal = sumaTotal)
          : (sumaTotal +=
              parseFloat(item.cantidad) * parseFloat(item.valorUnit));
        item.cantidad == null || item.descuentoUnit == null
          ? (sumaDescuento = sumaDescuento)
          : (sumaDescuento +=
              parseFloat(item.cantidad) * parseFloat(item.descuentoUnit));
      }
    });

    if (this.activeIncluyeIgv === 1) {
      var subT = sumaTotal / (1 + this.igv / 100) + sumaDescuento;
      subT != undefined
        ? (this.subtotal = subT.toFixed(6))
        : (this.subtotal = 0);
      this.descuentoTotal = sumaDescuento.toFixed(6);
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
        ? (this.subtotal = sumaSubTotal.toFixed(6))
        : (this.subtotal = 0);
      this.descuentoTotal = sumaDescuento.toFixed(6);
      igvTot != undefined
        ? (this.igvTotal = igvTot.toFixed(6))
        : (this.igvTotal = 0);
      var totalDet = sumaSubTotal - sumaDescuento + igvTot;
      totalDet != undefined
        ? (this.total = totalDet.toFixed(6))
        : (this.total = 0);
    }
  }

  /* ULTIMAS VENTAS */
  filterUltimasVentas() {
    this.filterGroupUltimas = this.fb.group({
      searchUltimas: [""],
    });
  }

  get controlsUltimas() {
    return this.filterGroupUltimas.controls;
  }

  searchUltimasVentas() {
    if (this.controlsUltimas.searchUltimas.value == null) {
      this.controlsUltimas.searchUltimas.setValue("");
    }
    this.listUltimasVentas.filter = this.controlsUltimas.searchUltimas.value
      .trim()
      .toLowerCase();
    if (this.listUltimasVentas.paginator) {
      this.listUltimasVentas.paginator.firstPage();
    }
  }

  getUltimasVentas(cliente) {
    this.listUltimasVentas = new MatTableDataSource([]);
    if (cliente != null) {
      this.pedido_venta_s.GetDataCliente(cliente).subscribe(
        (data: any) => {
          this.array_ultimas_ventas = data[3];
          this.searchBan = false;
          this.listUltimasVentas = new MatTableDataSource(
            this.array_ultimas_ventas
          );
          this.listUltimasVentas.sort = this.MatSort;
          this.listUltimasVentas.paginator = this.paginator;

          let datag = data[2];
          datag.forEach((e) => {
            this.controlsDatos.FechaUltimaVenta.setValue(
              this.datePipe.transform(e.fechaUltimaVenta, "yyyy-MM-dd")
            );
            this.controlsDatos.MontoHistorico.setValue(e.montoHistorico);
          });
          this.chgRef.markForCheck();
        },
        (error: any) => {
          console.log(error);
        }
      );
    } else {
      this.controlsDatos.FechaUltimaVenta.reset();
      this.controlsDatos.MontoHistorico.reset();
    }
  }

  /* GUARDAR DATOS */
  guardarPedidoVenta() {
    this.estadoPV = "0001";
    this.saveUpdatePedidoVenta();
  }

  liberarPedidoVenta() {
    this.estadoPV = "0002";
    this.saveUpdatePedidoVenta();
  }

  saveUpdatePedidoVenta() {
    if (this.estadoPV == "0001") {
      this.hide_load_guardar = false;
    } else {
      this.hide_load_liberar = false;
    }
    if (this.formDatosGenerales.invalid) {
      this.hide_load_guardar = true;
      this.hide_load_liberar = true;
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
      this.hide_load_liberar = true;
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
      this.hide_load_liberar = true;
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

    let datos = this.prepareModel();
    console.log(datos);
    this.pedido_venta_s.SaveUpdatePedidoVenta(datos).subscribe(
      (data: any) => {
        if (data[0].Ok > 0) {
          this.toastr.successToastr(data[0].Message, "Correcto!", {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: "fade",
            progressBar: true,
          });
          this.router.navigate(["Sales/process/PedidoVenta"]);
        } else {
          this.toastr.errorToastr(data[0].Message, "Error de Ok!", {
            toastTimeout: 1500,
            showCloseButton: true,
            animate: "fade",
            progressBar: true,
          });
          this.hide_load_guardar = true;
          this.hide_load_liberar = true;
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  prepareModel() {
    let datos_generales = [];
    let datos_detalle = [];

    datos_generales.push({
      idPedidoVenta: this.idPedidoVenta,
      idCliente: this.controlsDatos.Cliente.value,
      idClienteSucursal: this.controlsDatos.ClienteSucursal.value,
      tipoPrecio: this.controlsDatos.TipoPrecio.value,
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
      idMoneda: this.controlsDatos.TipoMoneda.value,
      tasaCambio: parseFloat(this.controlsDatos.TasaCambio.value).toFixed(3),
      establecimiento: this.controlsDatos.Establecimiento.value,
      incluyeIgv: this.controlsDatos.IncluyeIgv.value,
      numDecimales: this.controlsDatos.NumeroDecimales.value,
      subtotal: this.subtotal,
      descuento: this.descuentoTotal,
      igvPorcentaje: this.igv,
      igv: this.igvTotal,
      total: this.total,
      idEstado: this.estadoPV,
      activo: 1,
      eliminado: 0,
    });

    for (let i = 0; i < this.array_materiales.length; i++) {
      let material = this.array_materiales[i];
      datos_detalle.push({
        idDetalle: material.idDetalle,
        idPedidoVenta: this.idPedidoVenta,
        idMaterial: material.idMaterial,
        nombreMaterial: material.nombreMaterial,
        cantidad: material.cantidad,
        valorUnit: material.valorUnit,
        descuentoUnit: material.descuentoUnit,
        precioUnit: material.precioUnit,
        valorTotal: material.valorTotal,
        descuentoTotal: material.descuentoTotal,
        precioTotal: material.precioTotal,
        idUnidadMedida: material.idUnidadMedida,
        unidadMedida: material.unidadMedida,
        activo: 1,
        eliminado: 0,
      });
    }

    for (let i = 0; i < this.array_materiales_eliminados.length; i++) {
      let material = this.array_materiales_eliminados[i];
      datos_detalle.push({
        idDetalle: material.idDetalle,
        idPedidoVenta: this.idPedidoVenta,
        idMaterial: material.idMaterial,
        nombreMaterial: material.nombreMaterial,
        cantidad: material.cantidad,
        valorUnit: material.valorUnit,
        descuentoUnit: material.descuentoUnit,
        precioUnit: material.precioUnit,
        valorTotal: material.valorTotal,
        descuentoTotal: material.descuentoTotal,
        precioTotal: material.precioTotal,
        idUnidadMedida: material.idUnidadMedida,
        unidadMedida: material.unidadMedida,
        activo: 0,
        eliminado: 1,
      });
    }

    return {
      datos_generales: datos_generales,
      datos_detalle: datos_detalle,
    };
  }

  openLightbox(ligthbox){
    const modalRef = this.modalService.open(ligthbox,{size:'md', centered:true});
    modalRef.result.then(
      (result)=>{
        console.log(result);
      },(reason)=>{
        console.log(reason);
      }
    )
  }

  loadImg(){
    document.getElementById('imgPago').classList.toggle('d-none');
    document.getElementById('spinner').classList.toggle('d-flex');
    document.getElementById('spinner').classList.toggle('d-none');
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
