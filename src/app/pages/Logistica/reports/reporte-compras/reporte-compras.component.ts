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
  selector: 'app-reporte-compras',
  templateUrl: './reporte-compras.component.html',
  styleUrls: ['./reporte-compras.component.scss']
})
export class ReporteComprasComponent implements OnInit {

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
  displayedColumns:string[] = ['Nro', 'CODIGO', 'FECHA EMISION', 'FECHA ENTREGA', 'PROVEEDOR','CATEGORIA PROVEEDOR',
      'DOC. IDENTIDAD', 'PAIS','DEPARTAMENTO','#COTIZACION PROVEEDOR','TIPO DOCUMENTO','MONEDA','FORMA PAGO','LUGAR ATENCION',
      'SUBTOTAL','DESCUENTO','IGV','TOTAL','CATEGORIA','SUB CATEGORIA','CLASE','MATERIAL','CODIGO MATERIAL','MARCA',
      'MODELO','COLOR','UNIDAD DE MEDIDA','TIPO EXISTENCIA','CANTIDAD','PRECIO UNITARIO','DSCTO.TOTAL','PRECIO TOTAL','COSTO UNITARIO',
      'COSTO TOTAL','ESTADO','USUARIO REGISTRO','FECHA REGISTRO'];
  @ViewChild(MatSort) MatSort:MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;
  blobType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  cols = ['CODIGO', 'FECHA EMISION', 'FECHA ENTREGA', 'PROVEEDOR','CATEGORIA PROVEEDOR',
  'DOC. IDENTIDAD', 'PAIS','DEPARTAMENTO','#COTIZACION PROVEEDOR','TIPO DOCUMENTO','MONEDA','FORMA PAGO','LUGAR ATENCION',
  'SUBTOTAL','DESCUENTO','IGV','TOTAL','CATEGORIA','SUB CATEGORIA','CLASE','MATERIAL','CODIGO MATERIAL','MARCA',
  'MODELO','COLOR','UNIDAD DE MEDIDA','TIPO EXISTENCIA','CANTIDAD','PRECIO UNITARIO','DSCTO.TOTAL','PRECIO TOTAL','COSTO UNITARIO',
  'COSTO TOTAL','ESTADO','USUARIO REGISTRO','FECHA REGISTRO'];

	sName: string; excelFileName: string;

  constructor(  
    private fb:FormBuilder,
    private modalService: NgbModal,
    private claseMaterialService: ClaseMaterialService,
    public material_s:MaterialService,
    public multitabla_s: MultitablaService,
    public reporte_s: ReporteComprasService,
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
  arrayPaises:any;
  arrayDepartamentos:any;
  arrayCategoriaProveedores:any;
  
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
    this.getPaises(1);
    this.getDepartamentos(1);
    this.getCategoriaProveedores(1);
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

  getPaises(activo){
    this.reporte_s.GetPaises(activo).subscribe(
      (data:any )=>{
        // console.log(data);
        this.arrayPaises = data;
        // this.arrayPaises.unshift({
        //   idPais: 1,
        //   nombre:'Peru'
        // });
        this.filterGroup.controls.Pais.setValue(1)
      },(error)=>{
        console.log('Error en paises: ',error);
      }

    );
  }
  
  getDepartamentos(idpais){
    if(idpais == undefined){
      idpais = 0;
    }
    this.filterGroup.controls.Departamento.reset();
    this.reporte_s.GetDepartamentos(idpais).subscribe(
      (data:any )=>{
        // console.log(data);
        this.arrayDepartamentos = data;
        this.arrayDepartamentos.unshift({
         idDepartamento:0,
        nombre:'Todos'
        });
      this.filterGroup.controls.Departamento.setValue(0)
      },(error)=>{
        console.log('Error en departamentos: ',error);
      }
    );
  }
  getCategoriaProveedores(activo){
    this.reporte_s.GetCategoriaProveedores(activo).subscribe(
      (data:any )=>{
        // console.log(data);
        this.arrayCategoriaProveedores= data;
        this.arrayCategoriaProveedores.unshift({
          idCategoriaProveedor:0,
          nombre:'Todos'
        });
      this.filterGroup.controls.CategoriaProveedores.setValue(0)
      },(error)=>{
        console.log('Error en paises: ',error);
      }

    );
  }

 
  searchPais(){
    var pa=  this.filterGroup.controls.Pais.value
    try {
      this.arrayPaises.forEach(x=>{
        if(pa == x.Pais){
          pa = x.nombre;
        }
      })
      if(pa.trim().toLowerCase() == 'todos' || pa == null){
        pa = '';
      }
    } catch (error) {
      pa = '';
    }
    this.listData.filter = pa.trim().toLowerCase(); 
    if(this.listData.paginator){
      this.listData.paginator.firstPage();
    }
  }
  setPais(depa: string){
    var idDepa;
    this.arrayDepartamentos.forEach(x=>{
      if(x.nombre == depa){
        idDepa = x.Pais
      }
    })

    this.arrayCategorias.forEach(x=>{
      if(x.Categoria == idDepa){
        this.filterGroup.controls.Categoria.setValue(x.NombreCategoria)
      }
    })
  }
  searchDepartamento(depa){

    if(this.filterGroup.controls.Pais.value != undefined){
      this.searchPais();
    }

    this.setPais(depa);    

    console.log(this.filterGroup.controls.Departamento.value)

    try {
      if(depa.trim().toLowerCase() == 'todos' || depa == null){
        depa = '';
      }
    } catch (error) {
      depa = '';
    }

    this.listData.filter = depa.trim().toLowerCase(); 
    if(this.listData.paginator){
      this.listData.paginator.firstPage();
    }
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
    this.listData.filter = cat.trim().toLowerCase(); 
    if(this.listData.paginator){
      this.listData.paginator.firstPage();
    }
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

    this.listData.filter = subCat.trim().toLowerCase(); 
    if(this.listData.paginator){
      this.listData.paginator.firstPage();
    }
  }

  filterForm(){
    this.filterGroup = this.fb.group({
      Pais:1,
      Departamento:0,
      CategoriaProveedores:0,
      Categoria:0,
      Subcategoria:0,
      ClaseMaterial:0,
      fechaInicio: '2022-04-15',
      fechaFinal:'2022-04-21'
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
    if(formData.Pais=='todos'){
      formData.Pais= null;
    }
    if(formData.Departamento==0){
      formData.Departamento= null;
    }
    if(formData.CategoriaProveedores==0){
      formData.CategoriaProveedores= null;
    }
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
      idPais : formData.Pais,
      idDepartamento : formData.Departamento,
      idProveedor : formData.CategoriaProveedores,
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
    
    this.reporte_s.GenerarReporteCompra(data).subscribe(
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
        // console.log(data); 
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
    this.reporte_s.GenerarReporteCompra(data).subscribe(
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
			this.sName = 'Reporte de Compras';
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
				{ key: 'codigo', width: 20 },
				{ key: 'fechaEmision', width: 20 },
        { key: 'fechaEntrega', width: 20 },
				{ key: 'nombreComercial', width: 30 },
				{ key: 'nombreProveedor', width: 30 },
				{ key: 'docProveedor', width: 20 },
				{ key: 'pais', width: 20 },
				{ key: 'departamento', width: 25 },
				{ key: 'codCotizacionProveedor', width: 15},
				{ key: 'TipoDocumento', width: 20 },
				{ key: 'idMoneda', width: 20 },
				{ key: 'formaPago', width: 25 },
				{ key: 'lugarAtencion', width: 25 },
				{ key: 'subTotal', width: 30 },
				{ key: 'descuento', width: 20 },
				{ key: 'igv', width: 10 },
				{ key: 'total', width: 20 },
				{ key: 'categoria', width: 30 },
				{ key: 'subcategoria', width: 30 },
        { key: 'clase', width: 30 },
        { key: 'material', width: 30 },
        { key: 'codMaterial', width: 20 },
        { key: 'marca', width: 25 },
        { key: 'modelo', width: 25 },
        { key: 'color', width: 15 },
        { key: 'unidadMedida', width: 30 },
        { key: 'tipoExistencia', width: 25 },
        { key: 'cantidadTotal', width: 20 },
        { key: 'precioUnitario', width: 20 },
        { key: 'descuentoTotal', width: 20 },
        { key: 'precioTotal', width: 20 },
        { key: 'costoUnitario', width: 20 },
        { key: 'costoTotal', width: 20 },
        { key: 'estado', width: 20 },
        { key: 'usuarioRegistro', width: 20 },
        { key: 'fechaRegistro', width: 20 },
			];

			['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1', 'K1', 'L1', 'M1', 'N1', 'O1', 'P1', 'Q1', 'R1',
      'S1','T1','U1','V1','W1','X1','Y1','Z1','AA1','AB1','AC1','AD1','AE1','AF1','AG1','AH1','AI1','AJ1','AK1'].map(key => {
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
          codigo: item.codigo,
					fechaEmision: this.datePipe.transform(item.fechaEmision, 'dd/MM/yyy'),
          fechaEntrega: this.datePipe.transform(item.fechaEntrega, 'dd/MM/yyy'),
          nombreComercial: item.nombreComercial,
          nombreProveedor: item.nombreProveedor,
          docProveedor: item.docProveedor,
          pais: item.pais,
          departamento: item.departamento,
          codCotizacionProveedor: item.codCotizacionProveedor,
          TipoDocumento: item.TipoDocumento,
          idMoneda: item.idMoneda,
          formaPago: item.formaPago,
          lugarAtencion: item.lugarAtencion,
          subTotal: item.subTotal,
          descuento: item.descuento,
          igv: item.igv,
          total: item.total,
          categoria: item.categoria,
          subcategoria: item.subcategoria,
          clase: item.clase,
          material: item.material,
          codMaterial: item.codMaterial,
          marca: item.marca,
          modelo: item.modelo,
          color: item.color,
          unidadMedida: item.unidadMedida,
          tipoExistencia: item.tipoExistencia,
          cantidadTotal: item.cantidadTotal,
          precioUnitario: item.precioUnitario,
          descuentoTotal: item.descuentoTotal,
          precioTotal: item.precioTotal,
          costoUnitario: item.costoUnitario,
          costoTotal: item.costoTotal,
          estado: item.estado,
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
