import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionViewActionService } from '../../../../Shared/services/permission-view-action.service';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { CertificadosService } from '../../_core/services/certificados.service';
import { TableResponseModel } from '../../../../_metronic/shared/crud-table/models/table.model';
import { Certificado } from '../../_core/models/certificado.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DeleteModalComponent } from '../../../_shared/delete-customer-modal/delete-modal.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MultitablaService } from '../../../_core/services/multitabla.service';
import { DocumentoService } from '../../_core/services/documento.service';
import { Router } from '@angular/router';
import { TrabajadorService } from '../../_core/services/trabajador.service';
import { VacanteService } from '../../_core/services/vacante.service';
import { puestoTrabajoService } from '../../_core/services/puestoTrabajo.service';
import {finalize} from 'rxjs/operators';
import { DeleteModalGeneralComponent } from '../../../_shared/delete-modal/delete-modal.component';
import { AreaService } from '../../_core/services/area.service';
import { EmpresaService } from '../../../Security/_core/services/empresa.service';
@Component({
  selector: 'app-vacante',
  templateUrl: './vacante.component.html',
  styleUrls: ['./vacante.component.scss']
})
export class VacanteComponent implements OnInit {

  load_data: boolean = true;
  no_data: boolean = false;
  searchBan: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Nro', 'actions', 'Activo', 'Empresa', 'Codigo','Area', 'PuestoTrabajo','Nombre','Descripcion','InicioVigencia', 'FinVigencia'];
  @ViewChild(MatSort) MatSort: MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];
  array_data: TableResponseModel<Certificado>;
  array_dataList: any;
  array_empresas: any;
  array_puestos: any;
  array_areas: any;
  array_estado: any = [
    { value: -1, descripcion: 'Todos' },
    { value: 1, descripcion: 'Activo' },
    { value: 0, descripcion: 'Inactivo' }
  ];

  constructor(
    private fb: FormBuilder,    
    public puestoTrabajo_s: puestoTrabajoService, 
    private modalService: NgbModal,
    public vacante_s: VacanteService,     
    public trabajador_s: TrabajadorService,
    public documento_s: DocumentoService,
    public multitabla_s: MultitablaService,
    public pvas: PermissionViewActionService,
    public empresa_s:EmpresaService,
    public area_s:AreaService,
    private chgRef: ChangeDetectorRef,
    public toastr: ToastrManager,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();
    console.log(this.viewsActions);
    this.filterForm();
    this.searchForm();

    this.getEmpresas();
    this.getArea(0);
    this.getPuestoTrabajo(0,0);
        
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

	getArea(Empresa){
      this.filterGroup.controls.Area.reset(); 
      this.filterGroup.controls.PuestoTrabajo.reset();    
      this.area_s.GetAreaByUsuario(Empresa).subscribe(
        (data:any) => {                   
          this.array_areas = data;
          if(this.array_areas.length > 1){        
            this.array_areas.unshift({
              Area: 0, NombreArea: 'Todos'
            });
            this.filterGroup.controls.Area.setValue(this.array_areas[0].Area);
          }else{
            if(this.array_areas.length == 0){       
            }else{            
              this.filterGroup.controls.Area.setValue(this.array_areas[0].Area);  
            }         
          }      
          this.filterGroup.controls.PuestoTrabajo.setValue(0);
          this.chgRef.markForCheck();
        }, ( errorServicio ) => {
              
          console.log(errorServicio);
        }
      );    
	}

  getPuestoTrabajo(Empresa,Area) {
    this.filterGroup.controls.PuestoTrabajo.reset();   
    this.puestoTrabajo_s.GetPuestoTrabajoByUsuario(Empresa, ((Area == null) ? 0 : Area)).pipe(finalize(()=>{this.getVacantes(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Area.value, this.filterGroup.controls.PuestoTrabajo.value, this.filterGroup.controls.Estado.value); })).subscribe(
      (data:any) => {                   
        this.array_puestos = data;
        if(this.array_puestos.length > 1){        
          this.array_puestos.unshift({
            PuestoTrabajo: 0, NombrePuestoTrabajo: 'Todos'
          });
          this.filterGroup.controls.PuestoTrabajo.setValue(this.array_puestos[0].PuestoTrabajo);
        }else{
          if(this.array_puestos.length == 0){       
          }else{            
            this.filterGroup.controls.PuestoTrabajo.setValue(this.array_puestos[0].PuestoTrabajo);
          }  
        }
      }, ( errorServicio ) => {
            
        console.log(errorServicio);
      }
    );
  }
  
  getVacantes(empresa, area, puestoTrabajo, estado) {
    this.listData = new MatTableDataSource([]);
    this.searchBan = false;
    this.load_data = false;
    this.no_data = true;

    this.vacante_s.GetVacantes(empresa, (area === null ? 0 : area) ,(puestoTrabajo === null ? 0 : puestoTrabajo), estado).subscribe(
      (data:any) => {
        console.log(empresa, area, puestoTrabajo, estado);
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

  addVacante() {
    this.router.navigate(['Talento/masters/Vacante/add']);
  }

  editVacante(Vacante) {
    this.router.navigate(['Talento/masters/Vacante/edit'], {
      queryParams: {
        id: Vacante
      }
    });
  }

  filterForm() {
    this.filterGroup = this.fb.group({
      Area: [0],
      Empresa: [0],
      PuestoTrabajo: [0],
      Estado: [-1],
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

  delete(idVacante: number) {
    const modalRef = this.modalService.open(DeleteModalGeneralComponent);
    modalRef.componentInstance.id = idVacante;
    modalRef.componentInstance.titulo = 'Eliminar Vacante';
    modalRef.componentInstance.descripcion = 'Esta seguro de eliminar la Vacante seleccionada?';
    modalRef.componentInstance.msgloading = 'Eliminando Vacante...';
		modalRef.componentInstance.service = ()=>{
			return this.vacante_s.DeleteVacante(idVacante);
		};
    modalRef.result.then((result) => {
      this.getVacantes(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Area.value, this.filterGroup.controls.PuestoTrabajo.value, this.filterGroup.controls.Estado.value);
    }, (reason) => {
     console.log(reason);
    });  
   }
 
   disabledVacante(item) {
    this.vacante_s.EnableDisableVacante(item.idVacante,!item.activo).subscribe(
      (data:any) => {
        if (data[0].Success > 0) {
          this.toastr.successToastr(data[0].Message, 'Correcto!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
        } else {
          item.Activo = item.Activo;
          this.toastr.errorToastr(data[0].Message, 'Error!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
        }
               
      }, ( errorServicio ) => { 
        this.toastr.errorToastr('Ocurrio un error.', 'Error!', {
          toastTimeout: 2000,
          showCloseButton: true,
          animate: 'fade',
          progressBar: true
        });       
        console.log(errorServicio);
      }
    ); 
  }

}
