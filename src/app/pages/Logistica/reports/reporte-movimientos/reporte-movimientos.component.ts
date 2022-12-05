import { ReporteMovimientosService } from './../../_core/services/reporte-movimientos.service';
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
  selector: 'app-reporte-movimientos',
  templateUrl: './reporte-movimientos.component.html',
  styleUrls: ['./reporte-movimientos.component.scss']
})
export class ReporteMovimientosComponent implements OnInit {
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
  displayedColumns:string[] = ['Nro', 'CATEGORIA', 'SUBCATEGORIA', 'CLASE', 'CODIGO','MATERIAL','MARCA',
      'MODELO', 'ESTABLECIMIENTO','NOTA ALMACEN','FECHA CONTABLE','TIPO OPERACION','TIPO DOC','DOCUMENTO','TIPO MOV',
      'CANTIDAD ENTRADA','COSTO UNID ENTRADA','COSTO TOTAL ENTRADA','CANTIDAD SALIDA','COSTO UNID SALIDA',
      'COSTO DE SALIDA','CANTIDAD SALDO','COSTO UNID SALDO','COSTO TOTAL SALDO','UNIDAD MEDIDA','FECHA REGISTRO','USUARIO REGISTRO'];
  @ViewChild(MatSort) MatSort:MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;
  blobType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  cols = ['CATEGORIA', 'SUBCATEGORIA', 'CLASE', 'CODIGO','PRODUCTO','MARCA',
  'MODELO', 'ESTABLECIMIENTO','NOTA ALMACEN','FECHA CONTABLE','TIPO OPERACION','TIPO DOC','DOCUMENTO','TIPO MOV',
  'CANTIDAD ENTRADA','COSTO UNID ENTRADA','COSTO TOTAL ENTRADA','CANTIDAD SALIDA','COSTO UNID SALIDA',
  'COSTO DE SALIDA','CANTIDAD SALDO','COSTO UNID SALDO','COSTO TOTAl SALDO','UNIDAD MEDIDA','FECHA REGISTRO','USUARIO REGISTRO'];

	sName: string; excelFileName: string;

  constructor(  
    private fb:FormBuilder,

    private claseMaterialService: ClaseMaterialService,
    public material_s:MaterialService,
    public multitabla_s: MultitablaService,
    public reporte_s: ReporteComprasService,
    public reporteMov_s : ReporteMovimientosService,
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
  arrayMateriales:any;
  arrayEstablecimientos:any;
  
  fechaActual: any;
  mesActual: any;
  dtFechaActual: any;
  fechaMesAnterior: any;

  array_periodos: any = [
    { value: 0, descripcion: 'Todos' },
    { value: 2017, descripcion: '2017' },
    { value: 2018, descripcion: '2018' },
    { value: 2019, descripcion: '2019' },
    { value: 2020, descripcion: '2020' },
    { value: 2021, descripcion: '2021' },
    { value: 2022, descripcion: '2022' }
  ];
  array_meses: any = [
    { value: 0, descripcion: 'Todos' },
    { value: 1, descripcion: 'Enero' },
    { value: 2 , descripcion: 'Febrero'},
    { value: 3 , descripcion: 'Marzo'},
    { value: 4 , descripcion: 'Abril'},
    { value: 5 , descripcion: 'Mayo'},
    { value: 6 , descripcion: 'Junio'},
    { value: 7 , descripcion: 'Julio'},
    { value: 8 , descripcion: 'Agosto'},
    { value: 9 , descripcion: 'Setiembre'},
    { value: 10, descripcion: 'Octubre'},
    { value: 11 , descripcion: 'Noviembre'},
    { value: 12, descripcion:'Diciembre'}
  ];


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

  ngOnInit(): void {
    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();
    this.fechaActual = new Date().toLocaleDateString("EN-CA");
    this.dtFechaActual = new Date();
    this.dtFechaActual.setMonth(this.dtFechaActual.getMonth() - 1);
    this.fechaMesAnterior = this.dtFechaActual.toLocaleDateString("EN-CA");

    this.filterForm();
    this.searchForm();
    // this.getCategorias();
    this.getClasesMateriales();
    this.getSubcategorias(0);
    this.getDatosCombo();
    this.generarReporte();
  }

  getDatosCombo(){
    this.reporteMov_s.GetDatosCombos().subscribe(
      (data : any )=>{
        console.log(data)
        // console.log(data.Catgorias)
        this.arrayCategorias= data.Catgorias
        this.arrayCategorias.unshift({
          Categoria:0,
          NombreCategoria:'Todos'
        });
        this.filterGroup.controls.Categoria.setValue(0);

        this.arrayMateriales= data.Materiales
        this.arrayMateriales.unshift({
          idMaterial:0,
          NombreMaterial:'Todos'
        });
        this.filterGroup.controls.Material.setValue(0);

        this.arrayEstablecimientos= data.Establecimientos
        this.arrayEstablecimientos.unshift({
          idEstablecimiento:0,
          nombre:'Todos'
        });
        this.filterGroup.controls.Material.setValue(0);
      },(error)=>{
        console.log('Error en en los datos: ',error);
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

    this.listData.filter = subCat.trim().toLowerCase(); 
    if(this.listData.paginator){
      this.listData.paginator.firstPage();
    }
  }

  filterForm(){
    this.filterGroup = this.fb.group({
      Categoria:0,
      Subcategoria:0,
      ClaseMaterial:0,
      Material:0,
      Establecimiento: 0,
      Periodo:0,
      Mes:0
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
    if(formData.Material==0){
      formData.Material= null;
    } 
    if(formData.Establecimiento==0){
      formData.Establecimiento= null;
    } 
    if(formData.Periodo==0){
      formData.Periodo= null;
    } 
    if(formData.Mes==0){
      formData.Mes= null;
    } 
    return{
      idCategoriaMaterial : formData.Categoria,
      idSubCategoriaMaterial : formData.Subcategoria,
      idClaseMaterial: formData.ClaseMaterial,
      idMaterial : formData.Material,
      idEstablecimiento: formData.Establecimiento,
      Periodo: formData.Periodo,
      Mes: formData.Mes
    }
  }
  generarReporte(){
    let data = this.prepareData();
    console.log(data);
    this.listData= new MatTableDataSource();
    this.load_data = false;
    this.no_data = false;
    this.searchBan = false;
    
    this.reporteMov_s.GenerarReporteMovimientos(data).subscribe(
      (data:any)=>{
        console.log(data);
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
    this.reporteMov_s.GenerarReporteMovimientos(data).subscribe(
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
  

  exportData() {
		if (this.array_dataList.length > 0) {
			this.sName = 'Reporte de Movimientos';
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
				{ key: 'categoriaMaterial', width: 20 },
				{ key: 'subcategoriaMaterial', width: 20 },
        { key: 'claseMaterial', width: 20 },
				{ key: 'codigoMaterial', width: 30 },
				{ key: 'material', width: 30 },
				{ key: 'marca', width: 20 },
				{ key: 'modelo', width: 20 },
				{ key: 'establecimiento', width: 25 },
				{ key: 'notaAlmacen', width: 20},
				{ key: 'fechaContable', width: 20 },
        { key: 'tipoOp', width: 25 },
				{ key: 'tipoDoc', width: 25 },
				{ key: 'tipoMov', width: 30 },
        { key: 'documento', width: 30 },
				{ key: 'cantidadEntrada', width: 20 },
				{ key: 'precioUnitarioEntrada', width: 20 },
				{ key: 'precioTotalEntrada', width: 20 },
        { key: 'cantidadSalida', width: 20 },
				{ key: 'precioUnitarioSalida', width: 20 },
				{ key: 'precioTotalSalida', width: 20},
        { key: 'cantidadSaldo', width: 20 },
				{ key: 'costoUnitarioSaldo', width: 20 },
				{ key: 'costoTotalSaldo', width: 20 },
        { key: 'unidadMedida', width: 20 },
        { key: 'fechaRegistro', width: 20 },
        { key: 'usuarioRegistro', width: 20 }
			];

			['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1', 'K1', 'L1', 'M1', 'N1', 'O1', 'P1', 'Q1', 'R1',
      'S1','T1','U1','V1','W1','X1','Y1','Z1'].map(key => {
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
          categoriaMaterial: item.categoriaMaterial,
          subcategoriaMaterial: item.subcategoriaMaterial,
          claseMaterial: item.claseMaterial,
          codigoMaterial: item.codigoMaterial,
          material: item.material,
          marca: item.marca,
          modelo: item.modelo,
          establecimiento: item.establecimiento,
          notaAlmacen : item.notaAlmacen,
					fechaContable: this.datePipe.transform(item.fechaContable, 'dd/MM/yyy'),
          tipoOp: item.tipoOp,
          tipoDoc: item.tipoDoc,
          documento: item.codigoCompra,
          tipoMov: item.tipoNota,
          cantidadEntrada: item.cantidadEntrada,
          precioUnitarioEntrada: item.precioUnitarioEntrada,
          precioTotalEntrada: item.precioTotalEntrada,
          cantidadSalida: item.cantidadSalida,
          precioUnitarioSalida: item.precioUnitarioSalida,
          precioTotalSalida: item.precioTotalSalida,
          cantidadSaldo: item.cantidadSaldo,
          costoUnitarioSaldo: item.costoUnitarioSaldo,
          costoTotalSaldo: item.costoSaldo,
          unidadMedida: item.unidadMedida,
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
