import { ReporteStockService } from './../../_core/services/reporte-stock.service';
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
  selector: 'app-reporte-stock',
  templateUrl: './reporte-stock.component.html',
  styleUrls: ['./reporte-stock.component.scss']
})
export class ReporteStockComponent implements OnInit {

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
  displayedColumns:string[] = ['Nro', 'CODIGO', 'MATERIAL', 'ESTABLECIMIENTO', 'UNIDAD DE MEDIDA','STOCK MINIMO',
      'STOCK ACTUAL', 'STOCK DISPONIBLE','INDICADOR','RESERVADO VENTAS','STOCK POR RECIBIR',
      'CATEGORIA','SUBCATEGORIA','CLASE'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;
  blobType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  cols = ['CODIGO', 'MATERIAL', 'ESTABLECIMIENTO', 'UNIDAD DE MEDIDA','STOCK MINIMO',
  'STOCK ACTUAL', 'STOCK DISPONIBLE','INDICADOR','RESERVADO VENTAS','STOCK POR RECIBIR',
  'CATEGORIA','SUBCATEGORIA','CLASE'];

	sName: string; excelFileName: string;

  constructor(  
    private fb:FormBuilder,
    private modalService: NgbModal,
    private claseMaterialService: ClaseMaterialService,
    public material_s:MaterialService,
    public multitabla_s: MultitablaService,
    public reporte_s: ReporteComprasService,
    public reporteStock_s : ReporteStockService,
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
  arrayEstablecimientos:any;
  fechaActual: any;
  mesActual: any;
  dtFechaActual: any;
  fechaMesAnterior: any;

  array_indicadores: any = [
    { value:  0, descripcion: 'Todos' },
    { value: 1, descripcion: 'BAJO' },
    { value: 2, descripcion: 'MEDIO' },
    { value: 3 , descripcion: 'ALTO'}
  ];
  array_stock: any = [
    { value: 0, descripcion: 'Todos' },
    { value: 1, descripcion: 'MAYOR A CERO' },
    { value: 2 , descripcion: 'IGUAL A CERO'}
  ];


  ngOnInit(): void {
    this.listData = new MatTableDataSource([]);
    this.listData.sort = this.sort;
    this.viewsActions = this.pvas.get();

    this.filterForm();
    this.searchForm();
    this.getCategorias();
    this.getClasesMateriales();
    this.getEstablecimientos();
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
  getEstablecimientos(){
    this.reporteStock_s.GetEstablecimientos().subscribe(
      (data:any) => {
        // console.log(data);
        this.arrayEstablecimientos =data;
        this.arrayEstablecimientos.unshift({
          idEstablecimiento:0,
          nombre:'Todos'
        });
        this.filterGroup.controls.Establecimiento.setValue(0)
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
      Categoria:0,
      Subcategoria:0,
      ClaseMaterial:0,
      Establecimiento:0,
      Indicador: 0,
      Stock: 0,
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
    if(formData.Establecimiento==0){
      formData.Establecimiento= null;
    } 
    if(formData.Indicador==0){
      formData.Indicador= null;
    }
    if(formData.Stock==0){
      formData.Stock= 0;
    } 
    
    return{
      idCategoriaMaterial : formData.Categoria,
      idSubCategoriaMaterial : formData.Subcategoria,
      idClaseMaterial: formData.ClaseMaterial,
      idEstablecimiento: formData.Establecimiento,
      indicador : formData.Indicador,
      stock : formData.Stock
    }
  }
  generarReporte(){
    let data = this.prepareData();
    console.log(data);
    this.listData= new MatTableDataSource();
    this.load_data = false;
    this.no_data = false;
    this.searchBan = false;
    
    this.reporteStock_s.GenerarReporteStock(data).subscribe(
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
        this.listData.sort = this.sort;
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
    this.reporteStock_s.GenerarReporteStock(data).subscribe(
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
			this.sName = 'Reporte de Stock';
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
				{ key: 'codigo', width: 25 },
				{ key: 'material', width: 20 },
        { key: 'establecimiento', width: 20 },
				{ key: 'nombreUM', width: 20 },
				{ key: 'stockMinimo', width: 30 },
				{ key: 'stockActual', width: 20 },
				{ key: 'stockDisponible', width: 20 },
				{ key: 'indicador', width: 15},
				{ key: 'stockReservadoPV', width: 20 },
				{ key: 'stockPorRecibir', width: 20 },
				{ key: 'categoriaMaterial', width: 30 },
				{ key: 'subMaterial', width: 30 },
        { key: 'claseMaterial', width: 30 }
			];

			['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1', 'K1', 'L1', 'M1'].map(key => {
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
          codigo: item.codigoMaterial,
          material: item.material,
          establecimiento: item.establecimiento,
          nombreUM: item.unidadMedida,
          stockMinimo: item.stockMinimo,
          stockActual: item.stockActual,
          stockDisponible : item.stockDisponible,
          indicador: item.indicador,
          stockReservadoPV: item.stockReservadoPV,
          stockPorRecibir: item.stockPorRecibir,
          categoriaMaterial: item.categoriaMaterial,
          subMaterial: item.subcategoriaMaterial,
          claseMaterial: item.claseMaterial,	
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
