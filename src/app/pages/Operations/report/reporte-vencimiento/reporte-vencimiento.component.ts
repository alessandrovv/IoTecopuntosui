import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PermissionViewActionService } from '../../../../Shared/services/permission-view-action.service';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MultitablaService } from '../../../_core/services/multitabla.service';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import * as Excel from 'exceljs/dist/exceljs';
import { ReporteVencimientoService } from '../../_core/services/reporte-vencimiento.service';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-reporte-vencimiento',
  templateUrl: './reporte-vencimiento.component.html',
  styleUrls: ['./reporte-vencimiento.component.scss']
})
export class ReporteVencimientoComponent implements OnInit {

  altoRiesgo: number = null;
  bajoRiesgo: number = null;
  numAltoRiesgo:  number = null;
  numBajoRiesgo: number = null;
  load_data:boolean = true;
  no_data:boolean = false;
  formGroup: FormGroup;
  searchBan:boolean = false;
  filterGroup:FormGroup;
  searchGroup:FormGroup;
  listData:MatTableDataSource<any>;
  displayedColumns:string[] = ['Nro', 'PLACA', 'PROCEDENCIA', 'PROVEEDOR', 'TIPOVEHICULO','TIPODOCUMENTO',
      'NUMDOCUMENTO', 'FECHAPAGO','IMPORTEPAGADO','INICIOVIGENCIA','FINVIGENCIA','DIASVENCIMIENTO'];
  @ViewChild(MatSort) MatSort:MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;
  blobType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  cols = ['PLACA', 'PROCEDENCIA', 'PROVEEDOR', 'TIPO DE VEHICULO','TIPO DE DOCUMENTO',
  'NÚMERO DE DOCUMENTO', 'FECHA DE PAGO','IMPORTE PAGADO','INICIO DE VIGENCIA','FIN DE VIGENCIA','DIAS PARA VENCIMIENTO'];

	sName: string; excelFileName: string;

  constructor(  
    private fb:FormBuilder,
    public pvas: PermissionViewActionService,
    public toastr: ToastrManager,
    public formatter: NgbDateParserFormatter,
    private datePipe: DatePipe,
    private repoteVencimiento_s : ReporteVencimientoService,

  ) {}
  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];
  arrayPlacas:any;
  arrayTipoVehiculo:any;
  arrayTipoProcedencia:any;
  arrayProveedores:any;

  ngOnInit(): void {

    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();
    this.filterForm();

    this.getComboPlaca();
    this.getComboProveedor();
    this.getComboTipoVehiculo(); 
    this.getComboTipoProcedencia();
    this.generarReporte();
    
  }
  getComboPlaca(){
    this.repoteVencimiento_s.getComboPlacas().subscribe(
      data =>{
        this.arrayPlacas  = data;
        this.arrayPlacas.unshift({idVehiculo : 0 , placa : 'Todos'})
      }, error =>{
        console.log(error);
      }
    );
  }

  validoGenerar(){
    try{
      if(this.altoRiesgo+1 < this.bajoRiesgo){
        return false;
      }else{
        return true;
      }
    }catch(error) {
      return true;
    }
  }

  getComboTipoVehiculo(){
    this.repoteVencimiento_s.getComboTipoVehiculo().subscribe(
      data =>{
        this.arrayTipoVehiculo = data; 
        this.arrayTipoVehiculo.unshift({idTipoVehiculo : 0 , nombre : 'Todos'})
      }, error =>{
        console.log(error);
      }
    );
  }

  getComboTipoProcedencia(){
    this.repoteVencimiento_s.getComboProcedencia().subscribe(
      data =>{
        this.arrayTipoProcedencia = data;
        this.arrayTipoProcedencia.unshift({valor : '0' , nombre : 'Todos'})
      }, error =>{
        console.log(error);
      }
    );
  }

  getComboProveedor(){
    this.repoteVencimiento_s.getProveedorCombo().subscribe(
      data =>{
        this.arrayProveedores = data;
        this.arrayProveedores.unshift({idProveedor : 0 , razonSocial : 'Todos'})

      }, error =>{
        console.log(error);
      }
    );
  }

  filterForm(){
    this.filterGroup = this.fb.group({
      Placa:[0],
      TipoVehiculo:[0],
      TipoProcedencia:['0'],
      Proveedor:[0],
    });
  }

  generarReporte(){
    this.listData= new MatTableDataSource();
    this.load_data = false;
    this.no_data = false;
    this.searchBan = false;

    this.numAltoRiesgo = this.altoRiesgo;
    this.numBajoRiesgo = this.bajoRiesgo;

    console.log(this.filterGroup.value)

    var idVehiculo =  this.filterGroup.controls.Placa.value == null ? 0 : this.filterGroup.controls.Placa.value;
    var idTipoVehiculo = this.filterGroup.controls.TipoVehiculo.value == null ? 0 : this.filterGroup.controls.TipoVehiculo.value;
    var idProveedor = this.filterGroup.controls.Proveedor.value == null ? 0 : this.filterGroup.controls.Proveedor.value;
    var idTipoProcedencia = this.filterGroup.controls.TipoProcedencia.value == null ? '0' : this.filterGroup.controls.TipoProcedencia.value;

    this.repoteVencimiento_s.getReporteVencimientoVehiculo(idVehiculo, idTipoVehiculo, idTipoProcedencia, idProveedor).subscribe(
      (data:any) =>{
        this.listData = new MatTableDataSource(data);
        console.log(this.listData.data);
      }, ( errorServicio ) => {
      }
    );
    
  }

  descargarReporte() {
		if (this.listData.data.length> 0) {
			this.sName = 'Reporte de Vencimiento';
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
				{ key: 'placa', width: 20 },
				{ key: 'procedencia', width: 20 },
        { key: 'proveedor', width: 20 },
				{ key: 'tipoVehiculo', width: 30 },
				{ key: 'tipoDocumento', width: 30 },
				{ key: 'numeroDocumento', width: 20 },
				{ key: 'fechaPago', width: 20 },
				{ key: 'importePago', width: 25 },
				{ key: 'fechaInicioVigencia', width: 15},
				{ key: 'fechaFinVigencia', width: 20 },
				{ key: 'diasVencimiento', width: 20 },

			];

			['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1', 'K1'].map(key => {
				sheet.getCell(key).fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: '2c0ba3' },
          
				};
        sheet.getCell(key).font = {
          color: { argb: 'FFFFFFFF' },
        }
			});

      


			this.listData.data.forEach(item => {
				sheet.addRow({
          placa: item.placa,
					procedencia: item.procedencia == null ? null : item.procedencia,
          proveedor: item.proveedor == null ? '-' : item.proveedor,
          tipoVehiculo: item.tipoVehiculo == null ? '-' : item.tipoVehiculo,
          tipoDocumento: item.tipoDocumento == null ? '-' : item.tipoDocumento,
          numeroDocumento: item.numeroDocumento == null ? '-' : item.numeroDocumento,
          fechaPago: item.fechaPago == null ? '-' : this.datePipe.transform(item.fechaPago, 'dd/MM/yyy'),
          importePago: item.importePago == null ? '-' : item.importePago,
          fechaInicioVigencia: item.fechaInicioVigencia == null ? '-' : this.datePipe.transform(item.fechaInicioVigencia, 'dd/MM/yyy'),
          fechaFinVigencia: item.fechaFinVigencia == null ? '-' : this.datePipe.transform(item.fechaFinVigencia, 'dd/MM/yyy'),
          diasVencimiento: item.diasVencimiento,
				});
			});


      for (var i = 2; i <= this.listData.data.length+1; i++){
        if(sheet.getRow(i).getCell(11).value == null){
          sheet.getRow(i).getCell(11).value = 0
          continue;
        }        
        if(sheet.getRow(i).getCell(11).value <= this.numAltoRiesgo){
          sheet.getRow(i).getCell(11).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'f30c40' },
            
          };
        }else if(sheet.getRow(i).getCell(11).value <= this.numBajoRiesgo){
          sheet.getRow(i).getCell(11).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'f7f900' },
            
          };

        }else{
          sheet.getRow(i).getCell(11).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '02d736' },
            
          };
        }
      }


			const nav = (window.navigator as any);

			workbook.xlsx.writeBuffer().then(dataReporte => {
				var file = new Blob([dataReporte], { type: this.blobType });
				if (nav.msSaveOrOpenBlob) {
					nav.msSaveOrOpenBlob(file, this.excelFileName);
				} else { // Others
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