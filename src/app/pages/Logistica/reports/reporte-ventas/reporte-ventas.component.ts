import { ReporteVentasService } from './../../_core/services/reporte-ventas.service';
import { DatePipe } from '@angular/common';
import { MaterialService } from '../../_core/services/material.service';
import { ClaseMaterialService } from '../../_core/services/clase-material.service';
import { ReporteComprasService } from '../../_core/services/reporte-compras.service';
import { SubcategoriaService } from './../../_core/services/subcategoria.service';
import { CategoriaMaterialService } from './../../_core/services/categoria-material.service';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionViewActionService } from '../../../../Shared/services/permission-view-action.service';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { TableResponseModel } from '../../../../_metronic/shared/crud-table/models/table.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DeleteModalComponent } from '../../../_shared/delete-customer-modal/delete-modal.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MultitablaService } from '../../../_core/services/multitabla.service';
import { Router } from '@angular/router';
import { viewClassName } from '@angular/compiler';
import * as moment from 'moment';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import * as Excel from 'exceljs/dist/exceljs';
import * as XLSX from 'ts-xlsx';

@Component({
  selector: 'app-reporte-ventas',
  templateUrl: './reporte-ventas.component.html',
  styleUrls: ['./reporte-ventas.component.scss']
})
export class ReporteVentasComponent implements OnInit {

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  
  load_data:boolean = true;
  no_data:boolean = false;
  formGroup: FormGroup;
  searchBan:boolean = false;
  filterGroup:FormGroup;
  searchGroup:FormGroup;
  listData:MatTableDataSource<any>;
  displayedColumns:string[] = ['Nro', 'CORRELATIVO', 'FECHA EMISION', 'TIPO DOCUMENTO', 'COMPROBANTE','MONEDA',
      'FORMA DE PAGO', 'MEDIO DE PAGO','CANAL','SUBTOTAL','DESCUENTO','IGV','TOTAL','INTERES',
      'TOTAL INTERES','COD CLIENTE','RAZON SOCIAL','NOMBRE COMERCIAL','NOMBRES','AP PATERNO','AP MATERNO','CAT CLIENTE','TIPO CLIENTE','PAIS',
      'CIUDAD','TIPO DOC IDENT','DOC IDENTIDAD','DIRECCION','F NACIMIENTO','SEXO','TELEFONO 1','TELEFONO 2','EMAIL',
      'REFERENCIA','CUENTA FACEBOOK','CUENTA INSTAGRAM','OCUPACION', 'LUGAR OCUPACION', 'CATEGORIA', 'SUBCATEGORIA','CLASE', 'COD PRODUCTO','COD CONTABLE','MATERIAL',
      'MARCA','TALLA', 'COLOR','LINEA NEGOCIO', 'ESTAMPADO','UNID MEDIDA','TIPO EXISTENCIA','CANTIDAD', 'PRECIO UNITARIO', 'DSCTO','PRECIO TOTAL',
      'USUARIO REGISTRO', 'FECHA REGISTRO'];
  @ViewChild(MatSort) MatSort:MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;
  blobType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  cols = ['CORRELATIVO', 'FECHA EMISION', 'TIPO DOCUMENTO', 'COMPROBANTE','MONEDA',
  'FORMA DE PAGO', 'MEDIO DE PAGO','CANAL','SUBTOTAL','DESCUENTO','IGV','TOTAL','INTERES',
  'TOTAL INTERES','COD CLIENTE','RAZON SOCIAL','NOMBRE COMERCIAL','NOMBRES','AP PATERNO','AP MATERNO','CAT CLIENTE','TIPO CLIENTE','PAIS',
  'CIUDAD','TIPO DOC IDENT','DOC IDENTIDAD','DIRECCION','F NACIMIENTO','SEXO','TELEFONO 1','TELEFONO 2','EMAIL',
  'REFERENCIA','CUENTA FACEBOOK','CUENTA INSTAGRAM','OCUPACION', 'LUGAR OCUPACION', 'CATEGORIA', 'SUBCATEGORIA','CLASE', 'COD PRODUCTO','COD CONTABLE','MATERIAL',
  'MARCA','TALLA', 'COLOR','LINEA NEGOCIO', 'ESTAMPADO','UNID MEDIDA','TIPO EXISTENCIA','CANTIDAD', 'PRECIO UNITARIO', 'DSCTO','PRECIO TOTAL',
  'USUARIO REGISTRO', 'FECHA REGISTRO'];

	sName: string; excelFileName: string;

  constructor(  
    private fb:FormBuilder,
    private modalService: NgbModal,
    private claseMaterialService: ClaseMaterialService,
    public material_s:MaterialService,
    public multitabla_s: MultitablaService,
    public reporte_s: ReporteComprasService,
    public reporteVentas_s: ReporteVentasService,
    public pvas: PermissionViewActionService,
    public toastr: ToastrManager,
    private router: Router,
    private calendar: NgbCalendar, 
    private cd:ChangeDetectorRef,
    public formatter: NgbDateParserFormatter,
    private datePipe: DatePipe,

  ) { 
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10); 
  }
  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];
  array_dataList:any;
  array_subcategorias:any;
  arrayCategorias:any;
  arrayClasesMateriales:any;
  
  fechaActual: any;
  mesActual: any;
  dtFechaActual: any;
  fechaMesAnterior: any;

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) &&
        date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) { return this.toDate && date.after(this.fromDate) && date.before(this.toDate); }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) ||
        this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  ngOnInit(): void {
    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();
    this.fechaActual = new Date().toLocaleDateString("EN-CA");
    this.dtFechaActual = new Date();
    this.dtFechaActual.setMonth(this.dtFechaActual.getMonth() - 1);
    this.fechaMesAnterior = this.dtFechaActual.toLocaleDateString("EN-CA");

    this.filterForm();
    this.searchForm();
    this.getCategorias();
    this.getClasesMateriales();
    this.getSubcategorias(0);
    this.generarReporte();
  }
  getCategorias(){
    this.filterGroup.controls.Categoria.reset();
    this.material_s.GetCategorias().subscribe(
      (data:any)=>{
        // console.log(data)
        this.arrayCategorias = data;
        this.arrayCategorias.unshift({
          Categoria:0,
          NombreCategoria:'Todos'
        });
        this.filterGroup.controls.Categoria.setValue(0)
      },(error)=>{
        console.log('Error en subcategorias: ',error);
      }
    );
  }


  getSubcategorias(categoria){
    if(categoria == undefined){
      categoria = 0;
    }
    this.filterGroup.controls.Subcategoria.reset();
    this.material_s.GetSubcategorias(categoria).subscribe(
      (data:any)=>{
        this.array_subcategorias = data;
        // console.log(data)
        this.array_subcategorias.unshift({
          Subcategoria:0,
          Categoria:0,
          NombreSubcategoria:'Todos'
        });
        this.filterGroup.controls.Subcategoria.setValue(0)
      },(error)=>{
        console.log('Error en subcategorias: ',error);
      }
    );
  }
  getClasesMateriales(){
    this.claseMaterialService.getClaseMaterial().subscribe(
      (data:any) => {
        // console.log(data);
        this.arrayClasesMateriales =data;
        this.arrayClasesMateriales.unshift({
          Material:0,
          NombreMaterial:'Todos'
        });
        this.filterGroup.controls.ClaseMaterial.setValue(0)
      }, (error)=>{
        console.log('Error en subcategorias: ',error);
         }
    );
  }


  search(){
    if(this.searchGroup.controls.searchTerm.value == null){
      this.searchGroup.controls.searchTerm.setValue('');
    }
    this.listData.filter = this.searchGroup.controls.searchTerm.value.trim().toLowerCase();
    if(this.listData.paginator){
      this.listData.paginator.firstPage();
    }
  }

  searchCategoria(){
    var cat =  this.filterGroup.controls.Categoria.value
    try {
      this.arrayCategorias.forEach(x=>{
        if(cat == x.Categoria){
          cat = x.NombreCategoria;
        }
      })
      if(cat.trim().toLowerCase() == 'todos' || cat == null){
        cat = '';
      }
    } catch (error) {
      cat = '';
    }
    // this.listData.filter = cat.trim().toLowerCase(); 
    // if(this.listData.paginator){
    //   this.listData.paginator.firstPage();
    // }
  }

  setCategoria(subCat: string){
    var idCat;
    this.array_subcategorias.forEach(x=>{
      if(x.NombreSubcategoria == subCat){
        idCat = x.Categoria
      }
    })

    this.arrayCategorias.forEach(x=>{
      if(x.Categoria == idCat){
        this.filterGroup.controls.Categoria.setValue(x.NombreCategoria)
      }
    })
  }


  searchSubCategoria(subCat){

    if(this.filterGroup.controls.Categoria.value != undefined){
      this.searchCategoria();
    }

    this.setCategoria(subCat);    

    console.log(this.filterGroup.controls.Subcategoria.value)

    try {
      if(subCat.trim().toLowerCase() == 'todos' || subCat == null){
        subCat = '';
      }
    } catch (error) {
      subCat = '';
    }

    // this.listData.filter = subCat.trim().toLowerCase(); 
    // if(this.listData.paginator){
    //   this.listData.paginator.firstPage();
    // }
  }

  filterForm(){
    this.filterGroup = this.fb.group({
      Categoria:0,
      Subcategoria:0,
      ClaseMaterial:0,
      fechaInicio: '2022-06-10',
      fechaFinal:'2022-09-30'
    });
  }

  searchForm(){
    this.searchGroup = this.fb.group({
      searchTerm:[''],
    });
  }
  private prepareData(){
    const formData = this.filterGroup.value;
    // console.log(formData);
    if(formData.Categoria==0){
      formData.Categoria= null;
    }
    if(formData.Subcategoria==0){
      formData.Subcategoria= null;
    } 
    if(formData.ClaseMaterial==0){
      formData.ClaseMaterial= null;
    } 
    return{
      idCategoriaMaterial : formData.Categoria,
      idSubCategoriaMaterial : formData.Subcategoria,
      idClaseMaterial: formData.ClaseMaterial,
      fechaInicio : formData.fechaInicio,
      fechaFinal : formData.fechaFinal
    }
  }
  generarReporte(){
    let data = this.prepareData();
    // console.log(data);
    this.listData= new MatTableDataSource();
    this.load_data = false;
    this.no_data = false;
    this.searchBan = false;
    
    this.reporteVentas_s.GenerarReporteVentas(data).subscribe(
      (data:any)=>{
        this.load_data=true;
        this.load_data = true;
        this.searchBan = false;
        this.listData = new MatTableDataSource(data);
        if(data.length > 0){
          this.no_data = true;
        }else{
          this.no_data = false;
        }
        this.listData.sort = this.MatSort;
        this.listData.paginator = this.paginator;
        //console.log(data); 
      },( errorServicio ) => {           
        console.log(errorServicio);
        this.load_data = true;
        this.no_data = false;
        this.searchBan = false; 
      }
    )
  }
  descargarReporte(){
    let data = this.prepareData();
    // console.log(data);
    this.reporteVentas_s.GenerarReporteVentas(data).subscribe(
      (data:any)=>{
        // console.log(data);
        this.array_dataList = data;
        console.log(this.array_dataList);
        this.exportData();
        this.cd.markForCheck();
      }, (errorServicio) => {
				this.load_data = true;
				this.no_data = false;
				this.searchBan = false;
			}
    )
  }
  
  cambioInput(){
    console.log('cambio');
  }

  exportData() {
		if (this.array_dataList.length > 0) {
			this.sName = 'Reporte de Ventas';
			this.excelFileName = `${this.sName}.xlsx`;
			const workbook = new Excel.Workbook();
			workbook.creator = 'Web';
			workbook.lastModifiedBy = 'Web';
			workbook.created = new Date();
			workbook.modified = new Date();
			workbook.addWorksheet(this.sName, { views: [{ ySplit: 0, xSplit: 20, activeCell: 'A1', showGridLines: true }] });
			const sheet = workbook.getWorksheet(1);
			sheet.getColumn(1).width = 30;
			sheet.getRow(1).values = this.cols;

			sheet.columns = [
				{ key: 'correlativo', width: 20 },
				{ key: 'fechaEmision', width: 20 },
        { key: 'tipoDocumento', width: 20 },
				{ key: 'idComprobante', width: 30 },
				{ key: 'moneda', width: 30 },
				{ key: 'formaPago', width: 20 },
				{ key: 'idMedioPago', width: 20 },
				{ key: 'canal', width: 25 },
				{ key: 'subTotal', width: 15},
				{ key: 'descuento', width: 20 },
				{ key: 'igv', width: 20 },
				{ key: 'total', width: 20 },
				{ key: 'interes', width: 30 },
				{ key: 'totalInteres', width: 30 },
        { key: 'codigoCliente', width: 30 },
        { key: 'razonSocial', width: 30 },
        { key: 'nombreComercial', width: 30 },
        { key: 'nombreCliente', width: 25 },
        { key: 'apellidoPaterno', width: 25 },
        { key: 'apellidoMaterno', width: 15 },
        { key: 'categoriaCliente', width: 30 },
        { key: 'tipoCliente', width: 25 },
        { key: 'paisCliente', width: 20 },
        { key: 'departamentoCLiente', width: 20 },
        { key: 'tipoDocIndentidad', width: 20 },
        { key: 'documentoIdentidad', width: 20 },
        { key: 'direccionCliente', width: 20 },
        { key: 'fechaNacimiento', width: 20 },
        { key: 'sexo', width: 20 },
        { key: 'telefono1', width: 20 },
        { key: 'telefono2', width: 20 },
        { key: 'email', width: 20 },
        { key: 'referencia', width: 20 },
        { key: 'facebook', width: 20 },
        { key: 'instagram', width: 20 },
        { key: 'ocupacion', width: 20 },
        { key: 'lugarOcupacion', width: 20 },
        { key: 'categoria', width: 20 },
        { key: 'subCategoria', width: 20 },
        { key: 'claseMaterial', width: 20 },
        { key: 'codigoMaterial', width: 20 },
        { key: 'codigoContable', width: 20 },
        { key: 'Material', width: 20 },
        { key: 'marca', width: 20 },
        { key: 'talla', width: 20 },
        { key: 'color', width: 20 },
        { key: 'lineaNegocio', width: 20 },
        { key: 'estampado', width: 20 },
        { key: 'unidadMedida', width: 20 },
        { key: 'tipoExistencia', width: 20 },
        { key: 'cantidadMaterial', width: 20 },
        { key: 'precioUnitarioMaterial', width: 20 },
        { key: 'dscto', width: 20 },
        { key: 'precioTotal', width: 20 },
        { key: 'usuarioRegistro', width: 20 },
        { key: 'fechaRegistro', width: 20 },
			];

			['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1', 'K1', 'L1', 'M1', 'N1', 'O1', 'P1', 'Q1', 'R1',
      'S1','T1','U1','V1','W1','X1','Y1','Z1','AA1','AB1','AC1','AD1','AE1','AF1','AG1','AH1','AI1','AJ1','AK1','AL1',
      'AM1','AM1','AN1','AO1','AP1','AQ1','AR1','AS1','AT1','AU1','AV1','AW1','AX1','AY1','AZ1','BA1','BB1','BC1',
      'BD1'].map(key => {
				sheet.getCell(key).fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: '2c0ba3' },
          
				};
        sheet.getCell(key).font = {
          color: { argb: 'FFFFFFFF' },
        }
			});


			this.array_dataList.forEach(item => {
				sheet.addRow({
          correlativo: item.correlativo,
					fechaEmision: this.datePipe.transform(item.fechaEmision, 'dd/MM/yyy'),
          tipoDocumento: item.tipoDocumento,
          idComprobante: item.idComprobante,
          moneda: item.moneda,
          formaPago: item.formaPago,
          idMedioPago: item.idMedioPago,
          canal: item.canal,
          subTotal: item.subTotal,
          descuento: item.descuento,
          igv: item.igv,
          total: item.total,
          interes: item.interes,
          totalInteres: item.totalInteres,
          codigoCliente: item.codigoCliente,
          razonSocial: item.razonSocial,
          nombreComercial: item.nombreComercial,
          nombreCliente: item.nombreCliente,
          apellidoPaterno: item.apellidoPaterno,
          apellidoMaterno: item.apellidoMaterno,
          categoriaCliente: item.categoriaCliente,
          tipoCliente: item.tipoCliente,
          paisCliente: item.paisCliente,
          departamentoCLiente: item.departamentoCLiente,
          tipoDocIndentidad: item.tipoDocIndentidad,
          documentoIdentidad: item.documentoIdentidad,
          direccionCliente: item.direccionCliente,
          fechaNacimiento: item.fechaNacimiento,
          sexo: item.sexo,
          telefono1: item.telefono1,
          telefono2: item.telefono2,
          email: item.email,
          referencia: item.referencia,
          facebook: item.facebook,
          instagram: item.instagram,
          ocupacion: item.ocupacion,
          lugarOcupacion: item.lugarOcupacion,
          categoria: item.categoria,
          subCategoria: item.subCategoria,
          claseMaterial: item.claseMaterial,
          codigoMaterial: item.codigoMaterial,
          codigoContable: item.codigoContable,
          Material: item.Material,
          marca: item.marca,
          talla: item.talla,
          color: item.color,
          lineaNegocio: item.lineaNegocio,
          estampado: item.estampado,
          unidadMedida: item.unidadMedida,
          tipoExistencia: item.tipoExistencia,
          cantidadMaterial: item.cantidadMaterial,
          precioUnitarioMaterial: item.precioUnitarioMaterial,
          dscto: item.dscto,
          precioTotal: item.precioTotal,
          usuarioRegistro: item.usuarioRegistro,
          fechaRegistro: this.datePipe.transform(item.fechaRegistro, 'dd/MM/yyy'),		
				});
			});

			const nav = (window.navigator as any);

			workbook.xlsx.writeBuffer().then(dataReporte => {
				var file = new Blob([dataReporte], { type: this.blobType });
				if (nav.msSaveOrOpenBlob) {
					nav.msSaveOrOpenBlob(file, this.excelFileName);
				} 
				else { // Others
					var a = document.createElement("a"),
						url = URL.createObjectURL(file);
					a.href = url;
					a.download = this.excelFileName;
					document.body.appendChild(a);
					a.click();
					setTimeout(function () {
						document.body.removeChild(a);
						window.URL.revokeObjectURL(url);
					}, 0);
				}
			});
		} 
		else {
			this.toastr.infoToastr('No se encontraron datos', 'Información!', {
				toastTimeout: 4000,
				showCloseButton: true,
				animate: 'fade',
				progressBar: true
			});
		}
	}
}
