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

@Component({
  selector: "app-ver-pedido-venta",
  templateUrl: "./ver-pedido-venta.component.html",
  styleUrls: ["./ver-pedido-venta.component.scss"],
  providers: [
    DatePipe,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class VerPedidoVentaComponent implements OnInit {
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

  /* Tabla de materiales */
  array_materiales: any = [];
  array_materiales_eliminados: any = [];
  array_materiales_pendientes: any = [];
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

  /* Disabled botones */
  disableBtnTasaCambio: any = true;

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
    this.idPedidoVenta = this.route.snapshot.queryParams["id"] || 0;
    if (this.idPedidoVenta > 0) {
      this.getPedidoVenta(this.idPedidoVenta);
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
      Visita: [{ value: null, disabled: true }],
      Vendedor: [{ value: null, disabled: true }],
      Cliente: [{ value: null, disabled: true }],
      //OrdenCompra: [null],
      FechaUltimaVenta: [{ value: null, disabled: true }],
      MontoHistorico: [{ value: null, disabled: true }],
      TipoPrecio: [{ value: null, disabled: true }],
      ClienteSucursal: [{ value: null, disabled: true }],
      TipoDocumento: [{ value: null, disabled: true }],
      FormaPago: [{ value: null, disabled: true }],
      Establecimiento: [{ value: null, disabled: true }],
      FechaEmision: [{ value: this.fechaActual, disabled: true }],
      FechaEntrega: [{ value: this.fechaActual, disabled: true }],
      TipoMoneda: [{ value: null, disabled: true }],
      TasaCambio: [{ value: null, disabled: true }],
      IncluyeIgv: [{ value: 0, disabled: true }],
      NumeroDecimales: [{ value: null, disabled: true }],
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
        this.getUltimasVentas(datosg.idCliente);
        this.controlsDatos.Codigo.setValue(datosg.codigo);
        this.controlsDatos.Visita.setValue(datosg.codigoVisitaComercial);
        this.controlsDatos.Vendedor.setValue(datosg.trabajador);
        this.controlsDatos.Cliente.setValue(datosg.documentoIdentidad + '  |  ' + datosg.razonSocial);
        this.controlsDatos.ClienteSucursal.setValue(datosg.sucursal);
        this.controlsDatos.TipoPrecio.setValue(datosg.tipoPrecio);
        this.controlsDatos.TipoDocumento.setValue(datosg.nombreTipoDocumento);
        this.controlsDatos.FormaPago.setValue(datosg.nombreFormaPago);
        this.controlsDatos.TipoMoneda.setValue(datosg.nombreMoneda);
        this.controlsDatos.Establecimiento.setValue(datosg.establecimiento);
        this.controlsDatos.FechaEmision.setValue(
          this.datePipe.transform(datosg.fechaEmision, "yyyy-MM-dd")
        );
        this.controlsDatos.FechaEntrega.setValue(
          this.datePipe.transform(datosg.fechaEntrega, "yyyy-MM-dd")
        );
        this.controlsDatos.TasaCambio.setValue(parseFloat(datosg.tasaCambio).toFixed(datosg.numDecimales));
        this.controlsDatos.NumeroDecimales.setValue(datosg.numDecimales);
        if (datosg.incluyeIgv) {
          this.controlsDatos.IncluyeIgv.setValue(datosg.incluyeIgv);
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

  fixLabel(item) {
    let numDecimales =
      this.controlsDatos.NumeroDecimales.value == ""
        ? 0
        : this.controlsDatos.NumeroDecimales.value;
    let strElem = parseFloat(item).toFixed(numDecimales);
    return strElem;
  }

  /* DETALLE DE VENTA */
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
