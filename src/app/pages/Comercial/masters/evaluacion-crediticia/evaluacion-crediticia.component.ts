import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
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
import { EvaluacionCrediticiaService } from '../../_core/evaluacion-crediticia.service';
import { CertificadosService } from 'src/app/pages/Talento/_core/services/certificados.service';
import { EmpresaService } from '../../../Security/_core/services/empresa.service';
import { RevisionEvaluacionCrediticiaComponent } from '../_shared/revision-evaluacion-crediticia/revision-evaluacion-crediticia.component';

@Component({
  selector: 'app-evaluacion-crediticia',
  templateUrl: './evaluacion-crediticia.component.html',
  styleUrls: ['./evaluacion-crediticia.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluacionCrediticiaComponent implements OnInit {
  // paginator: PaginatorState;
  load_data: boolean = true;
  no_data: boolean = false;
  searchBan: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  totalInicial: any = 0;
  totalActual: any = 0;
  listData: MatTableDataSource<any>;
  // displayedColumns: string[] = ['Nro', 'Acctions', 'Estado', 'Empresa', 'NombreAsesor', 'Fecha', 'TipoDocIdentidad', 'documentoIdentidad',];
  displayedColumns: string[] = ['Nro', 'Acctions', 'Estado', 'Fecha','NombreSupervisor','NombreAsesor', 'documentoIdentidad', 'BackOffice',];
  @ViewChild(MatSort) MatSort: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

  array_estado: any;
  array_asesores: any;
  
  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];
  array_dataList: any;
	array_empresas: any;
	fechaActual: any;
  constructor(
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
		public evaluacion_s: EvaluacionCrediticiaService,
		public certificado_s: CertificadosService,
    public pvas: PermissionViewActionService,
    public empresa_s:EmpresaService,
     public toastr: ToastrManager,
     private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    console.log(this.array_estado);
    this.listData = new MatTableDataSource([]);

    this.viewsActions = this.pvas.get();
		this.fechaActual = (new Date()).toLocaleDateString('EN-CA');  
		this.filterForm();
    this.searchForm();
		this.getEmpresas();
		this.getEstados();
		this.getAsesoresByEmpresa(0);
		this.GetEvaluacionesCrediticias(0,this.fechaActual,this.fechaActual,'0', '0');
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

  getAsesoresByEmpresa(Empresa) {
    this.evaluacion_s.GetAsesoresByEmpresa(Empresa).subscribe(
      (data:any) => {
        this.array_asesores = data;
        this.array_asesores.unshift({
          Asesor: '0', NombreAsesor: 'Todos'
        });
        this.filterGroup.controls.Asesor.setValue('0') 
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

	GetEvaluacionesCrediticias(empresa, fechaInicio, fechaFin, Estado, Asesor){
    this.totalActual = 0;
		console.log(empresa, fechaInicio, fechaFin, Estado, Asesor)
		this.listData = new MatTableDataSource([]);
		this.searchBan = false;
		this.load_data = false;
		this.no_data = true;
		console.log('suscripcion')
		this.evaluacion_s.GetEvaluacionesCrediticias(empresa, fechaInicio, fechaFin, Estado, Asesor).subscribe(
			// this.evaluacion_s.GetEvaluacionesCrediticias2().subscribe(
      (data:any) => {
        this.cd.markForCheck();
				console.log("listado: ",data);
        this.totalInicial = data.length;
        this.load_data = true;
        this.searchBan = false;
        this.listData = new MatTableDataSource(data);
        
        if(data.length > 0){
          this.no_data = true;
        }else{
          this.no_data = false;
        }
        this.listData.sort = this.MatSort;
        const secondsCounter = interval(20000);
        secondsCounter.subscribe(n =>
          this.GetEvaluacionesCrediticiasBusqueda(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Desde.value, 
            this.filterGroup.controls.Hasta.value, this.filterGroup.controls.Estado.value, this.filterGroup.controls.Asesor.value)); 
        // this.listData.paginator = this.paginator;       
      }, ( errorServicio ) => {
        this.load_data = true;
        this.no_data = false;
        this.searchBan = false;        
      }
    );
	}

  GetEvaluacionesCrediticiasBusqueda(empresa, fechaInicio, fechaFin, Estado, Asesor) {	
    this.listData = new MatTableDataSource([]);
		this.searchBan = false;
		this.load_data = false;
		this.no_data = true;
		this.evaluacion_s.GetEvaluacionesCrediticias(empresa, fechaInicio, fechaFin, Estado, Asesor).subscribe(
			// this.evaluacion_s.GetEvaluacionesCrediticias2().subscribe(
      (data:any) => {
        this.load_data = true;
        this.searchBan = false;
        this.listData = new MatTableDataSource(data);
        
        if(data.length > 0){
          this.no_data = true;
        }else{
          this.no_data = false;
        }
        this.listData.sort = this.MatSort;
        this.totalActual = data.length;        
        if (this.totalInicial < this.totalActual) {
          const audio = new Audio('../../../../../assets/media/alerts/ALERTA_SERVICIO.mp3');
          audio.play();
          this.totalInicial = data.length;
          this.cd.markForCheck();
          this.toastr.infoToastr('Se encontro un nuevo seguimiento para el dia de hoy. Por favor revisar', 'Información!', {
            toastTimeout: 3000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });          
        }
       
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
      Asesor: ['0'],
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
    // if (this.listData.paginator) {
    //   this.listData.paginator.firstPage();
    // }
  }

  revisionEvaluacionCrediticio(id: number, item) {
    const modalRef = this.modalService.open(RevisionEvaluacionCrediticiaComponent, { size: 'xl', keyboard : false, backdrop: 'static' });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.item = item;
    modalRef.componentInstance.titulo = 'Revisar Evaluación Crediticia';
    
    modalRef.result.then((result) => {
      this.GetEvaluacionesCrediticias(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Desde.value, this.filterGroup.controls.Hasta.value, this.filterGroup.controls.Estado.value, this.filterGroup.controls.Asesor.value);
    }, (reason) => {
     console.log(reason);
    }); 
  }

}
