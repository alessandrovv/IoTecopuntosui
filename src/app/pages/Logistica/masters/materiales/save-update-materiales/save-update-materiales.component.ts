import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BehaviorSubject, forkJoin, Subscription } from 'rxjs';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { MultitablaService } from 'src/app/pages/_core/services/multitabla.service';
import { DeleteModalComponent } from 'src/app/pages/_shared/delete-customer-modal/delete-modal.component';
import { PermissionViewActionService } from 'src/app/Shared/services/permission-view-action.service';
import { TableResponseModel } from 'src/app/_metronic/shared/crud-table';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { DatePipe } from '@angular/common';
import { DataSource } from '@angular/cdk/table';

import { HttpClient } from '@angular/common/http';
import { finalize, first } from 'rxjs/operators';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import * as JSZip from 'jszip';
import * as FileSaver from "file-saver";
import { MaterialService } from '../../../_core/services/material.service';
import { animate } from '@angular/animations';
import { ThrowStmt } from '@angular/compiler';
import { PedidoVentaService } from 'src/app/pages/Sales/_core/pedido-venta.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-save-update-materiales',
  templateUrl: './save-update-materiales.component.html',
  styleUrls: ['./save-update-materiales.component.scss'],
  providers: [DatePipe,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class SaveUpdateMaterialesComponent implements OnInit, AfterViewInit {

  //IDMATERIAL
  idMaterial: number = 0;

  //NAVEGACION
  tabs = {
    DATOS_TAB: 0,
    PRESENTACIONES_TAB: 1,
    PRECIOS_TAB: 2
  }
  activeTabId = this.tabs.DATOS_TAB;

  //DATOS GENERALES
  load_data: boolean = true;
  no_data: boolean = false;
  searchBan: boolean = false;

  formDatosGenerales: FormGroup;
  array_categorias: any;
  array_subcategorias: any;
  array_clases: any;
  array_tipoExistencias: any;
  array_unidadesMedida: any;

  downloadURL_2: any = null;
  nombreArchivo: string = null;
  FileImagen = new FormControl(null);


  //PRESENTACIONES
  idUmMaterial: any = null;
  umMaterial: string = '';
  estadosPresentacion: boolean[] = [];
  estadoPresentacion: boolean = false;
  valoresRepetidosPresentacion: string[] = [];
  deta_Presentacion: FormControl[] = [];
  deta_UMPresentacion: FormControl[] = [];
  deta_Equivalencia: FormControl[] = [];
  array_UMPresentacion: any = [];
  array_presentaciones: any = [];
  array_presentaciones_eliminado: any = [];


  //formPresentaciones:FormGroup;

  //PRECIOS
  estadosPrecio: boolean[] = [];
  deta_Precio: FormControl[] = [];
  deta_TipoPrecio: FormControl[] = [];
  deta_Moneda: FormControl[] = [];
  deta_VUPrecio: FormControl[] = [];
  deta_IGV: FormControl[] = [];
  deta_PUPrecio: FormControl[] = [];
  array_precio: any = [];
  array_precio_eliminado: any = [];
  array_TipoPrecio: any = [];
  array_Moneda: any = [];

  // IGV: BehaviorSubject<Number>;
  IGV: number;

  //SAVE UPDATE
  hide_save: Boolean = false;
  hide_load: Boolean = true;

  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];
  array_dataList: any;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;


  constructor(
    private fb: FormBuilder,
    public pvas: PermissionViewActionService,
    public toastr: ToastrManager,
    private chgRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private httpClient: HttpClient,
    private storageFirebase: AngularFireStorage,
    private formBuilder: FormBuilder,
    public material_s: MaterialService,
    public pedido_venta_s: PedidoVentaService
  ) { }
  ngAfterViewInit(): void {
    this.getTipoPrecio();
    this.getMoneda();
    this.getIGV();
  }

  ngOnInit(): void {
    //this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();
    this.datosForm();
    this.idMaterial = this.route.snapshot.queryParams['id'] || 0;

    if (this.idMaterial > 0) {
      this.getDataMaterial(this.idMaterial);
    } else {
      this.getCategorias(null);
      this.addPresentacion();
      this.getSubcategorias('0', null);
      this.getClases('0', null);
      this.getTiposExistencias(null);
      this.getUnidadesMedida(null);

    }
  }

  chargeFile2() {
    let element: HTMLElement = document.getElementById('file2') as HTMLElement;
    element.click();
  }

  getFileDATA(event) {
    console.log(event);
    if (event.target.files && event.target.files.length) {
      let waitToastr = this.toastr.infoToastr('Cargando Imagen...', 'Cargando...', {
        dismiss: 'controlled',
        animate: 'fade',
        progressBar: true
      });
      const file = event.target.files[0];
      let nombreArchivo = file.name;
      let datoArchivo = nombreArchivo.split(".");
      // let tipoDocumento = datoArchivo[datoArchivo.length-1];
      let filePath = '';

      filePath = 'Material/' + nombreArchivo + Date.now() + '.' + datoArchivo[datoArchivo.length - 1];

      this.ref = this.storageFirebase.ref(filePath);
      this.task = this.ref.put(file);
      this.task.snapshotChanges().pipe(
        finalize(() => {
          this.ref.getDownloadURL().subscribe(url => {
            this.nombreArchivo = nombreArchivo;
            this.downloadURL_2 = url;
            waitToastr.dismiss();
            this.chgRef.markForCheck();
          });
        })
      ).subscribe();

    }
  }

  limpiarArchivo() {


    this.downloadURL_2 = null;
    this.FileImagen.reset();
    this.FileImagen = null;
    this.chgRef.markForCheck();
  }

  getDataMaterial(idMaterial) {
    this.material_s.GetDataMaterial(idMaterial).subscribe(
      (data: any) => {
        console.log(data);
        let dataCabecera = data[0][0];
        this.formDatosGenerales.controls.Codigo.setValue(dataCabecera.Codigo);
        this.formDatosGenerales.controls.Nombre.setValue(dataCabecera.NombreMaterial);
        this.formDatosGenerales.controls.Marca.setValue(dataCabecera.Marca);
        this.formDatosGenerales.controls.Modelo.setValue(dataCabecera.Modelo);
        this.formDatosGenerales.controls.Color.setValue(dataCabecera.Color);
        this.formDatosGenerales.controls.StockMinimo.setValue(dataCabecera.StockMinimo);
        this.formDatosGenerales.controls.AplicaVenta.setValue(dataCabecera.AplicaVenta)
        this.formDatosGenerales.controls.Activo.setValue(dataCabecera.Activo);
        this.downloadURL_2 = dataCabecera.UrlArchivo;
        this.getCategorias(dataCabecera);
        this.getSubcategorias(dataCabecera.Categoria, dataCabecera);
        this.getClases(dataCabecera.Subcategoria, dataCabecera);
        this.getTiposExistencias(dataCabecera);
        this.getUnidadesMedida(dataCabecera);
        this.llenarPresentaciones(data[1]);

        this.llenarPrecios(data[2]);
        console.log('cabecera', dataCabecera);
        console.log('detalle', data[1]);
        console.log('Precios', data[2]);
        this.chgRef.markForCheck();
      }, (error) => {
        console.log(error);
      }
    )
  }

  addPresentacion() {
    this.array_presentaciones.push({
      IdPresentacion: 0,
      Presentacion: null,
      UMPresentacion: null,
      UMMaterial: null,
      Equivalencia: null,
      Activo: true
    });

    this.deta_Presentacion.push(new FormControl({ value: (this.array_presentaciones.length == 1 ? '-' : null), disabled: (this.array_presentaciones.length == 1 ? true : false) }, [Validators.required]));
    this.deta_UMPresentacion.push(new FormControl({ value: null, disabled: (this.array_presentaciones.length == 1 ? true : false) }, [Validators.required]));
    this.deta_Equivalencia.push(new FormControl({ value: (this.array_presentaciones.length == 1 ? 1 : null), disabled: (this.array_presentaciones.length == 1 ? true : false) }, [Validators.required]));

    this.chgRef.markForCheck();

    this.estadosPresentacion.push(false);

    console.log(this.deta_Presentacion);
    console.log(this.deta_UMPresentacion);
  }

  llenarPresentaciones(Presentaciones) {
    for (let i = 0; i <= Presentaciones.length - 1; i++) {
      this.array_presentaciones.push(Presentaciones[i]);
      this.deta_Presentacion.push(new FormControl({ value: Presentaciones[i].Presentacion, disabled: i == 0 ? true : false }, [Validators.required]));
      this.deta_UMPresentacion.push(new FormControl({ value: Presentaciones[i].UMPresentacion, disabled: i == 0 ? true : false }, [Validators.required]));
      this.deta_Equivalencia.push(new FormControl({ value: Presentaciones[i].Equivalencia, disabled: i == 0 ? true : false }, [Validators.required]));
      this.estadosPresentacion.push(false);
    }
  }

  deletePresentacion(item) {
    let index = this.array_presentaciones.indexOf(item);
    console.log(index);
    if (item.IdPresentacion > 0) {
      this.array_presentaciones_eliminado.push(item);
    }
    this.buscarPresentacionEliminada(item);
    this.array_presentaciones.splice(index, 1);
    this.deta_Presentacion.splice(index, 1);
    this.deta_UMPresentacion.splice(index, 1);
    this.deta_Equivalencia.splice(index, 1);
    this.chgRef.markForCheck();
    this.estadosPresentacion.splice(index, 1);
    console.log(this.array_presentaciones);
  }

  getTipoPrecio() {


    this.pedido_venta_s.GetTipoPrecios().subscribe(
      (data: any) => {
        this.array_TipoPrecio = data;


      }
    )
  }

  getMoneda() {

    this.material_s.GetMoneda().subscribe(
      (data: any) => {
        this.array_Moneda = data;
      }
    )
  }

  getIGV() {
    const year = new Date().getFullYear();

    this.pedido_venta_s.GetIgv(year).subscribe(
      (data: any) => {

        this.IGV = data[0].porcentaje;
        console.log("IGV",this.IGV);
        
        this.chgRef.markForCheck();
      }
    )
  }

  calcularPrecioConIgv(item) {
    let pos = this.array_precio.indexOf(item);
    this.deta_IGV[pos].setValue(this.deta_VUPrecio[pos].value * this.IGV / 100)
    this.deta_PUPrecio[pos].setValue(
      this.deta_VUPrecio[pos].value + this.deta_IGV[pos].value
    )
  }

  calcularValorConIgv(item) {
    let pos = this.array_precio.indexOf(item);
    this.deta_IGV[pos].setValue(this.deta_PUPrecio[pos].value * this.IGV / (100 + this.IGV))
    this.deta_VUPrecio[pos].setValue(
      this.deta_PUPrecio[pos].value - this.deta_IGV[pos].value
    )
  }

  array_auxPrecio: any = []

  validarTipoPrecio(tipoPrecio, moneda) {
    let contador = 0;
    this.array_auxPrecio = [];

    for (let i = 0; i < this.array_precio.length; i++) {
      let object = {
        tipoPrecio: this.deta_TipoPrecio[i].value,
        moneda: this.deta_Moneda[i].value
      }

      this.array_auxPrecio.push(object);
    }

    let prev = tipoPrecio + moneda;

    // }
    for (let i = 0; i < this.array_auxPrecio.length; i++) {
      if (!prev.includes(null) && prev == this.array_auxPrecio[i].tipoPrecio +
        this.array_auxPrecio[i].moneda) {
        contador++;
        if (contador >= 2) {
          this.deta_TipoPrecio[i].reset()
          this.toastr.warningToastr('No puede escoger dos tipos de precios iguales o con la misma moneda.', 'Advertencia!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
        }
      }
    }

  }

  validarMoneda(tipoPrecio, moneda) {
    let contador = 0;
    this.array_auxPrecio = [];

    for (let i = 0; i < this.array_precio.length; i++) {
      let object = {
        tipoPrecio: this.deta_TipoPrecio[i].value,
        moneda: this.deta_Moneda[i].value
      }

      this.array_auxPrecio.push(object);
    }

    let prev = tipoPrecio + moneda;


    // }
    for (let i = 0; i < this.array_auxPrecio.length; i++) {
      if (!prev.includes(null) && prev == this.array_auxPrecio[i].tipoPrecio +
        this.array_auxPrecio[i].moneda) {
        contador++;
        if (contador >= 2) {
          this.deta_Moneda[i].reset()
          this.toastr.warningToastr('No puede escoger dos tipos de precios iguales o con la misma moneda.', 'Advertencia!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
        }
      }
    }

  }

  addPrecio() {

    if (this.array_precio.length < 4) {
      this.array_precio.push({
        IdPrecio: 0,
        TipoPrecio: null,
        Moneda: null,
        ValorUnitario: 0,
        PrecioUnitario: 0,
        Activo: true
      })


      this.deta_TipoPrecio.push(new FormControl(null, [Validators.required]));
      this.deta_Moneda.push(new FormControl(null, [Validators.required]));
      this.deta_VUPrecio.push(new FormControl(null, [Validators.required]));
      this.deta_PUPrecio.push(new FormControl(null, [Validators.required]));
      this.deta_IGV.push(new FormControl(null, Validators.required));

      this.chgRef.markForCheck();
      this.estadosPrecio.push(false);


    } else {

    }

  }

  llenarPrecios(Precios) {


    for (let i = 0; i < Precios.length; i++) {
      this.array_precio.push(Precios[i])
      // this.deta_Precio.push(new FormControl(Precios[i].IdPrecio, Validators.required));
      this.deta_TipoPrecio.push(new FormControl(Precios[i].TipoPrecio, Validators.required));
      this.deta_Moneda.push(new FormControl(Precios[i].Moneda, Validators.required));
      this.deta_VUPrecio.push(new FormControl(Precios[i].ValorUnitario, Validators.required));
      this.deta_IGV.push(new FormControl(Precios[i].IGV
        , Validators.required));
      this.deta_PUPrecio.push(new FormControl(Precios[i].PrecioUnitario))
    }


  }

  deletePrecio(item) {
    let index = this.array_precio.indexOf(item);

    if (item.IdPrecio > 0) {
      this.array_precio_eliminado.push(item);
    }
    // this.buscarPresentacionEliminada(item);


    this.array_precio.splice(index, 1);
    this.deta_TipoPrecio.splice(index, 1);
    this.deta_Moneda.splice(index, 1);
    this.deta_VUPrecio.splice(index, 1);
    this.deta_IGV.splice(index, 1);
    this.deta_PUPrecio.splice(index, 1);
    this.chgRef.markForCheck();
    this.estadosPrecio.splice(index, 1);

  }

  buscarSubcategoria(val) {
    console.log('Valor: ', val);
    this.array_clases.forEach(item => {
      if (item.Clase == val) {
        this.formDatosGenerales.controls.Subcategoria.setValue(item.Subcategoria);
        this.formDatosGenerales.controls.Categoria.setValue(item.Categoria);
      }
    });
  }

  buscarCategoria(val) {
    console.log('Valor: ', val);
    this.array_subcategorias.forEach(item => {
      if (item.Subcategoria == val) {
        this.formDatosGenerales.controls.Categoria.setValue(item.Categoria);
      }
    });
  }

  buscarUnidadMedida(val): string {
    let resp: string = '';
    this.array_UMPresentacion.forEach(item => {
      if (item.UnidadMedida == val) {
        resp = item.NombreUnidadMedida;
      }
    });

    return resp;
  }

  buscarPresentacion(item) {
    let aux = false;
    let pos = this.array_presentaciones.indexOf(item);
    let valor = this.deta_Presentacion[pos].value;
    for (let i = 0; i < this.deta_Presentacion.length; i++) {
      if (i != pos) {
        if (this.deta_Presentacion[i].value == valor) {
          if (valor != '') {
            aux = true;
          }
        }
      }
    }
    this.estadosPresentacion[pos] = aux;
    console.log(this.estadosPresentacion);
  }

  buscarPresentacionEliminada(item) {
    let aux = [];
    let pos = this.array_presentaciones.indexOf(item);
    let valor = this.deta_Presentacion[pos].value;
    for (let i = 0; i < this.deta_Presentacion.length; i++) {
      if (i != pos) {
        if (this.deta_Presentacion[i].value == valor) {
          if (valor != '') {
            aux.push(i);
          }
        }
      }
    }
    this.estadosPresentacion[aux[0]] = false;
  }

  getCategorias(dataCabecera) {
    this.formDatosGenerales.controls.Categoria.reset();
    this.material_s.GetCategorias().subscribe(
      (data: any) => {
        if (dataCabecera != null) {
          if (data.find(categoria => categoria.Categoria === dataCabecera.Categoria) === undefined) {
            data.push(
              {
                Categoria: dataCabecera.Categoria,
                NombreCategoria: dataCabecera.NombreCategoria
              }
            );
          }
          this.array_categorias = data.sort((a, b) => a.NombreCategoria > b.NombreCategoria ? 1 : -1);
          this.formDatosGenerales.controls.Categoria.setValue(dataCabecera.Categoria);
        }
        else {
          this.array_categorias = data.sort((a, b) => a.NombreCategoria > b.NombreCategoria ? 1 : -1);
        }
      },
      (error) => {
        console.log('Error en categorias: ', error);
      }
    )
  }

  getSubcategorias(categoria, dataCabecera) {
    this.formDatosGenerales.controls.Subcategoria.reset();
    this.material_s.GetSubcategorias(categoria === undefined ? '0' : categoria).subscribe(
      (data: any) => {
        console.log('Subcategorias: ', data);
        //this.array_subcategorias = data;
        if (dataCabecera != null) {
          if (data.find(subcategoria => subcategoria.Subcategoria === dataCabecera.Subcategoria) === undefined) {
            data.push(
              {
                Subcategoria: dataCabecera.Subcategoria,
                NombreSubcategoria: dataCabecera.NombreSubcategoria
              }
            );
          }
          this.array_subcategorias = data.sort((a, b) => a.NombreSubcategoria > b.NombreSubcategoria ? 1 : -1);
          this.formDatosGenerales.controls.Subcategoria.setValue(dataCabecera.Subcategoria);
        }
        else {
          this.array_subcategorias = data.sort((a, b) => a.NombreSubcategoria > b.NombreSubcategoria ? 1 : -1);
        }
      }, (error) => {
        console.log('Error en subcategorias: ', error);
      }
    );
  }

  getClases(subcategoria, dataCabecera) {
    this.formDatosGenerales.controls.Clase.reset();
    this.material_s.GetClases(subcategoria === undefined ? '0' : subcategoria).subscribe(
      (data: any) => {
        console.log('Clases: ', data);
        //this.array_clases =data;
        if (dataCabecera != null) {
          if (data.find(clase => clase.Clase === dataCabecera.Clase) === undefined) {
            data.push(
              {
                Clase: dataCabecera.Clase,
                NombreClase: dataCabecera.NombreClase
              }
            );
          }
          this.array_clases = data.sort((a, b) => a.NombreClase > b.NombreClase ? 1 : -1);
          this.formDatosGenerales.controls.Clase.setValue(dataCabecera.Clase);
        }
        else {
          this.array_clases = data.sort((a, b) => a.NombreClase > b.NombreClase ? 1 : -1);
        }
      }, (error) => {
        console.log('Error en clases: ', error);
      }
    );
  }

  getTiposExistencias(dataCabecera) {
    this.formDatosGenerales.controls.TipoExistencia.reset();
    this.material_s.GetTiposExistencias().subscribe(
      (data: any) => {
        console.log('TipoExistencias: ', data);
        //this.array_tipoExistencias = data;
        if (dataCabecera != null) {
          if (data.find(tipoExistencia => tipoExistencia.TipoExistencia === dataCabecera.TipoExistencia) === undefined) {
            data.push(
              {
                TipoExistencia: dataCabecera.TipoExistencia,
                NombreTipoExistencia: dataCabecera.NombreTipoExistencia
              }
            );
          }
          this.array_tipoExistencias = data.sort((a, b) => a.NombreTipoExistencia > b.NombreTipoExistencia ? 1 : -1);
          this.formDatosGenerales.controls.TipoExistencia.setValue(dataCabecera.TipoExistencia);
        }
        else {
          this.array_tipoExistencias = data.sort((a, b) => a.NombreTipoExistencia > b.NombreTipoExistencia ? 1 : -1);
        }
      }, (error) => {
        console.log('Error en tipos de existencias: ', error);
      }
    );
  }

  getUnidadesMedida(dataCabecera) {
    this.formDatosGenerales.controls.UnidadMedida.reset();
    this.material_s.GetUnidadesMedida().subscribe(
      (data: any) => {
        console.log('UnidadMedida: ', data);
        //this.array_unidadesMedida = data;
        //this.array_UMPresentacion = data;
        if (dataCabecera != null) {
          if (data.find(unidadMedida => unidadMedida.UnidadMedida === dataCabecera.UnidadMedida) === undefined) {
            data.push(
              {
                UnidadMedida: dataCabecera.UnidadMedida,
                NombreUnidadMedida: dataCabecera.NombreUnidadMedida
              }
            );
          }
          this.array_unidadesMedida = data.sort((a, b) => a.NombreUnidadMedida > b.NombreUnidadMedida ? 1 : -1);
          this.array_UMPresentacion = data.sort((a, b) => a.NombreUnidadMedida > b.NombreUnidadMedida ? 1 : -1);
          this.formDatosGenerales.controls.UnidadMedida.setValue(dataCabecera.UnidadMedida);
        }
        else {
          this.array_unidadesMedida = data.sort((a, b) => a.NombreUnidadMedida > b.NombreUnidadMedida ? 1 : -1);
          this.array_UMPresentacion = data.sort((a, b) => a.NombreUnidadMedida > b.NombreUnidadMedida ? 1 : -1);
        }
      }, (error) => {
        console.log('Error en unidades de medida: ', error);
      }
    );
  }

  saveUpdateMaterial() {
    this.hide_save = true;
    this.hide_load = false;
    const controls = this.formDatosGenerales.controls;

    controls.Clase.setValidators(null);
    controls.UnidadMedida.setValidators(null);
    controls.TipoExistencia.setValidators(null);

    if (this.array_clases && this.array_clases.length > 0) {
      controls.Clase.setValidators([Validators.required]);
      if (this.array_unidadesMedida && this.array_unidadesMedida.length > 0) {
        controls.UnidadMedida.setValidators([Validators.required]);
        if (this.array_tipoExistencias && this.array_tipoExistencias.length > 0) {
          controls.TipoExistencia.setValidators([Validators.required]);
        }
      }
    }

    controls.Clase.updateValueAndValidity();
    controls.UnidadMedida.updateValueAndValidity();
    controls.TipoExistencia.updateValueAndValidity();

    if (this.formDatosGenerales.invalid) {
      this.hide_save = false;
      this.hide_load = true;
      this.activeTabId = 0;
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      this.toastr.warningToastr('Ingrese los campos obligatorios.', 'Advertencia!', {
        toastTimeout: 2000,
        showCloseButton: true,
        animate: 'fade',
        progressBar: true
      });
      return;
    }


    for (let i = 0; i < this.array_presentaciones.length; i++) {

      if (this.deta_Presentacion[i].status == 'INVALID' || this.deta_UMPresentacion[i].status == 'INVALID' || this.deta_Equivalencia[i].status == 'INVALID') {
        this.activeTabId = 1;
        this.hide_save = false;
        this.hide_load = true;
        this.toastr.warningToastr('Ingrese los campos obligatorios.', 'Advertencia!', {
          toastTimeout: 2000,
          showCloseButton: true,
          animate: 'fade',
          progressBar: true
        });
        this.deta_Presentacion.forEach(item => { if (item.invalid) item.markAsTouched() });
        this.deta_UMPresentacion.forEach(item => { if (item.invalid) item.markAsTouched() });
        this.deta_Equivalencia.forEach(item => { if (item.invalid) item.markAsTouched() });
        return;
      }

    }

    for (let i = 0; i < this.array_precio.length; i++) {
      if (this.deta_TipoPrecio[i].status == 'INVALID'
        || this.deta_Moneda[i].status == 'INVALID'
        || this.deta_VUPrecio[i].status == 'INVALID'
        || this.deta_PUPrecio[i].status == 'INVALID'
        || this.deta_IGV[i].status == 'INVALID'
      ) {
        this.activeTabId = 2;
        this.hide_save = false;
        this.hide_load = true;
        this.toastr.warningToastr('Ingrese los campos obligatorios.', 'Advertencia!', {
          toastTimeout: 2000,
          showCloseButton: true,
          animate: 'fade',
          progressBar: true
        });

        this.deta_TipoPrecio.forEach(item => { if (item.invalid) item.markAllAsTouched() });
        this.deta_Moneda.forEach(item => { if (item.invalid) item.markAllAsTouched() });
        this.deta_VUPrecio.forEach(item => { if (item.invalid) item.markAllAsTouched() });
        this.deta_PUPrecio.forEach(item => { if (item.invalid) item.markAllAsTouched() });
        this.deta_IGV.forEach(item => { if (item.invalid) item.markAllAsTouched() });
        return;
      }
    }

    if (this.estadosPresentacion.includes(true)) {
      this.activeTabId = 1;
      this.hide_save = false;
      this.hide_load = true;
      this.toastr.warningToastr('Cambie los campos repetidos', 'Advertencia!', {
        toastTimeout: 2000,
        showCloseButton: true,
        animate: 'fade',
        progressBar: true
      });
      return;
    }

    let datos = this.prepare_model();
    console.log("Prepare_model", datos);

    this.material_s.SaveUpdateMaterial(datos).subscribe(
      (data: any) => {
        if (data[0].Ok > 0) {
          this.hide_save = false;
          this.hide_load = true;
          this.toastr.successToastr(data[0].Message, 'Correcto!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
          this.router.navigate(['Logistica/masters/Materiales']);
        } else {
          this.hide_save = false;
          this.hide_load = true;
          this.chgRef.markForCheck();
          this.toastr.errorToastr(data[0].Message, 'Error!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
          console.log(data[0].Message);
        }
      }, (error) => {
        this.hide_save = false;
        this.hide_load = true;
        this.toastr.errorToastr('Ocurrio un error.', 'Error!', {
          toastTimeout: 2000,
          showCloseButton: true,
          animate: 'fade',
          progressBar: true
        });
        console.log('SaveUpdateMaterialError:', error);
      }
    )
  }

  prepare_model() {
    const controls = this.formDatosGenerales.controls;
    let datoPresentacion = [];
    let datoPrecio = [];

    for (let i = 0; i < this.array_presentaciones.length; i++) {
      datoPresentacion.push({
        IdPresentacion: this.array_presentaciones[i].IdPresentacion,
        Presentacion: this.deta_Presentacion[i].value,
        UMPresentacion: this.deta_UMPresentacion[i].value,
        UMMaterial: this.formDatosGenerales.controls.UnidadMedida.value,
        Equivalencia: String(this.deta_Equivalencia[i].value),
        Activo: this.array_presentaciones[i].Activo,
        Eliminado: 0
      });
    }
    for (let i = 0; i < this.array_presentaciones_eliminado.length; i++) {
      datoPresentacion.push({
        IdPresentacion: this.array_presentaciones_eliminado[i].IdPresentacion,
        Presentacion: this.array_presentaciones_eliminado[i].Presentacion,
        UMPresentacion: this.array_presentaciones_eliminado[i].UMPresentacion,
        UMMaterial: this.array_presentaciones_eliminado[i].UMMaterial,
        Equivalencia: String(this.array_presentaciones_eliminado[i].Equivalencia),
        Activo: this.array_presentaciones_eliminado[i].Activo,
        Eliminado: 1
      });
    }

    for (let i = 0; i < this.array_precio.length; i++) {
      datoPrecio.push({
        idMaterialPrecio: this.array_precio[i].IdPrecio,
        idMaterial: this.idMaterial,
        idTipoPrecio: this.deta_TipoPrecio[i].value,
        idMoneda: this.deta_Moneda[i].value,
        valorUnitario: this.deta_VUPrecio[i].value,
        precioUnitario: this.deta_PUPrecio[i].value,
        activo: this.array_precio[i].Activo,
        eliminado: 0
      })
    }

    for (let i = 0; i < this.array_precio_eliminado.length; i++) {
      datoPrecio.push({
        idMaterialPrecio: this.array_precio_eliminado[i].IdPrecio,
        idMaterial: this.idMaterial,
        idTipoPrecio: this.array_precio_eliminado[i].TipoPrecio,
        idMoneda: this.array_precio_eliminado[i].Moneda,
        valorUnitario: this.array_precio_eliminado[i].ValorUnitario,
        precioUnitario: this.array_precio_eliminado[i].PrecioUnitario,
        activo: this.array_precio_eliminado[i].Activo,
        eliminado: 1
      })
    }




    return {
      idMaterial: this.idMaterial,
      Clase: controls['Clase'].value,
      Nombre: controls['Nombre'].value,
      Marca: controls['Marca'].value,
      Modelo: controls['Modelo'].value,
      Color: controls['Color'].value,
      UnidadMedida: controls['UnidadMedida'].value,
      TipoExistencia: controls['TipoExistencia'].value,
      StockMinimo: controls['StockMinimo'].value,
      nombreArchivo: this.nombreArchivo,
      urlArchivo: this.downloadURL_2,
      AplicaVenta: controls['AplicaVenta'].value,
      Activo: controls['Activo'].value,
      Presentaciones: datoPresentacion,
      Precios: datoPrecio
    }
  }

  datosForm() {
    this.formDatosGenerales = this.fb.group({
      Categoria: [null, Validators.compose([Validators.required])],
      Subcategoria: [null, Validators.compose([Validators.required])],
      Clase: [null, Validators.compose([Validators.required])],
      Codigo: [null],
      Nombre: [null, Validators.compose([Validators.required])],
      Marca: [null],
      Modelo: [null],
      Color: [null],
      TipoExistencia: [null, Validators.compose([Validators.required])],
      UnidadMedida: [null, Validators.compose([Validators.required])],
      StockMinimo: [null],
      AplicaVenta: [true],
      Activo: [true],
    });
  }

  changeUnidadMedida() {
    this.deta_UMPresentacion[0].setValue(this.formDatosGenerales.controls.UnidadMedida.value);
    //this.idUmMaterial = this.formDatosGenerales.controls.UnidadMedida.value;
    this.umMaterial = this.formDatosGenerales.controls.UnidadMedida.value == null ? '' : this.buscarUnidadMedida(this.formDatosGenerales.controls.UnidadMedida.value);
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;

    //if(tabId ===1){
    //  this.deta_UMPresentacion[0].setValue(this.formDatosGenerales.controls.UnidadMedida.value);
    //  //this.idUmMaterial = this.formDatosGenerales.controls.UnidadMedida.value;
    //  this.umMaterial = this.formDatosGenerales.controls.UnidadMedida.value ==null?'':this.buscarUnidadMedida(this.formDatosGenerales.controls.UnidadMedida.value);
    //}
  }

  isControlValid(controlName: string): boolean {
    const control = this.formDatosGenerales.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formDatosGenerales.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formDatosGenerales.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formDatosGenerales.controls[controlName];
    return control.dirty || control.touched;
  }

  //Presentaciones
  isFormControlValid(controlName): boolean {
    return controlName.valid && (controlName.dirty || controlName.touched);
  }

  isFormControlInvalid(controlName): boolean {
    return controlName.invalid && (controlName.dirty || controlName.touched);
  }

  FormControlHasError(validation, controlName): boolean {
    return controlName.hasError(validation) && (controlName.dirty || controlName.touched);
  }

  FormControlPresentacion(estado, item): boolean {
    let pos = this.array_presentaciones.indexOf(item);
    let controlName = this.deta_Presentacion[pos];
    return (controlName.dirty || controlName.touched) && this.estadosPresentacion[pos] == true;
  }



}
