import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ICreateAction, IEditAction, IDeleteAction, IDeleteSelectedAction, IFetchSelectedAction, IUpdateStatusForSelectedAction, ISortView, IFilterView, IGroupingView, ISearchView, PaginatorState, SortState, GroupingState } from 'src/app/_metronic/shared/crud-table';
import { PermissionViewActionService } from '../../../../Shared/services/permission-view-action.service';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { ITableState, TableResponseModel } from '../../../../_metronic/shared/crud-table/models/table.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrManager } from 'ng6-toastr-notifications';
// import { EvaluacionCrediticiaService } from '../../_core/evaluacion-crediticia.service';
import { CertificadosService } from 'src/app/pages/Talento/_core/services/certificados.service';
import { EvaluacionCrediticiaService } from 'src/app/pages/Comercial/_core/evaluacion-crediticia.service';
import { ComisionVentaService } from '../../_core/services/comision-venta.service';
import { EmpresaService } from '../../../Security/_core/services/empresa.service';

@Component({
  selector: 'app-comision-ventas',
  templateUrl: './comision-ventas.component.html',
  styleUrls: ['./comision-ventas.component.scss']
})
export class ComisionVentasComponent implements OnInit {
  // paginator: PaginatorState;
  load_data: boolean = true;
  no_data: boolean = false;
  searchBan: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Nro', 'Codigo', 'NContrato', 'Asesor', 'Asociado', 'TipoServicio', 'TipoInmueble', 'Distrito', 'Direccion', 'Cliente', 'CargoFijo', 'PlanContratado', 'TipoDocIdentidad', 'DocIdentidad', 'FechaCargaConecta', 'EstadoVentaWin', 'EstadoInstalacion', 'FechaInstalacion', 'ComisionAsesor', 'ComisionLider', 'Estado','actions'];

  @ViewChild(MatSort) MatSort: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

  array_estado: any;

  
  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];
  array_dataList: any;
	array_empresas: any;
	fechaActual: any;
  constructor(
    private fb: FormBuilder,
		public evaluacion_s: EvaluacionCrediticiaService,
		public comision_s: ComisionVentaService,
    public pvas: PermissionViewActionService,
    public empresa_s:EmpresaService,
     public toastr: ToastrManager,
  ) { }

  ngOnInit(): void {
    console.log(this.array_estado);
    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();
		this.fechaActual = (new Date()).toLocaleDateString('EN-CA');
    
		console.log(this.viewsActions);
    
		this.filterForm();
    this.searchForm();

		this.getEmpresas();
		this.getEstados();
		
		this.GetComisionesVentas(0,this.fechaActual,this.fechaActual,'0');
  }

	getEmpresas() {
    this.empresa_s.GetEmpresaByUsuario().subscribe(
      (data:any) => {        
        this.array_empresas = data;
        if(this.array_empresas.length > 1){
          this.array_empresas.unshift({
            idEmpresa: 0, razonSocial: 'Todos'
          });
        }
        this.filterGroup.controls.Empresa.setValue(this.array_empresas[0].idEmpresa)
      }, ( errorServicio ) => {           
        console.log(errorServicio);
      }
    );
  }

	getEstados(){
		this.evaluacion_s.GetEstadoEvaluacionCrediticia().subscribe(
			(data:any)=>{
				this.array_estado = data;
				this.array_estado.unshift({
					Valor: '0', Nombre: 'Todos'
				})
				console.log(data);
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}

	GetComisionesVentas(empresa, fechaInicio, fechaFin, Estado){
		console.log(empresa, fechaInicio, fechaFin, Estado)
		this.listData = new MatTableDataSource([]);
		this.searchBan = false;
		this.load_data = false;
		this.no_data = true;
		console.log('suscripcion')
		this.comision_s.GetComisionesVentas(empresa, fechaInicio, fechaFin, Estado).subscribe(
			// this.evaluacion_s.GetEvaluacionesCrediticias2().subscribe(
      (data:any) => {
				console.log("listado: ",data)
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
      }, ( errorServicio ) => {
        this.load_data = true;
        this.no_data = false;
        this.searchBan = false;        
      }
    );
	}

  filterForm() {
    this.filterGroup = this.fb.group({
			Empresa: [0],
      Desde: [this.fechaActual],
      Hasta: [this.fechaActual],
      Estado: ['0'],
    });    
  }


  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
    });    
  }

  search() {
    if(this.searchGroup.controls.searchTerm.value == null) {
      this.searchGroup.controls.searchTerm.setValue('');
    }
    this.listData.filter = this.searchGroup.controls.searchTerm.value.trim().toLowerCase();
    if (this.listData.paginator) {
      this.listData.paginator.firstPage();
    }
  }
}
