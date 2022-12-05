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
import { EmpresaService } from '../../../Security/_core/services/empresa.service';
import { puestoTrabajoService } from '../../_core/services/puestoTrabajo.service';
import { AreaService } from '../../_core/services/area.service';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-trabajadores',
  templateUrl: './trabajadores.component.html',
  styleUrls: ['./trabajadores.component.scss']
})
export class TrabajadoresComponent implements OnInit {

  load_data: boolean = true;
  no_data: boolean = false;
  searchBan: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Nro', 'actions', 'Activo',  'NombresApellidos', 'PuestoTrabajo', 'FechaInicioContrato', 'FechaFinContrato'];
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
    private modalService: NgbModal,
    public certificado_s: CertificadosService,
    public documento_s: DocumentoService,
    public multitabla_s: MultitablaService,
    private chgRef: ChangeDetectorRef,
    public empresa_s:EmpresaService,
    public area_s:AreaService,
    public puestoTrabajo_s:puestoTrabajoService,
    public trabajador_s: TrabajadorService,
    public pvas: PermissionViewActionService,
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
    this.puestoTrabajo_s.GetPuestoTrabajoByUsuario(Empresa, ((Area == null) ? 0 : Area)).pipe(finalize(()=>{this.getTrabajadoresList(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Area.value, this.filterGroup.controls.PuestoTrabajo.value, this.filterGroup.controls.Estado.value); })).subscribe(
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

  getTrabajadoresList(empresa, area, puestoTrabajo, estado) {
    this.listData = new MatTableDataSource([]);
    this.searchBan = false;
    this.load_data = false;
    this.no_data = true;

    this.trabajador_s.GetTrabajadoresList(empresa, (area === null ? 0 : area) ,(puestoTrabajo === null ? 0 : puestoTrabajo), estado).subscribe(
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

  filterForm() {
    this.filterGroup = this.fb.group({
      Empresa: [0],      
      Area: [0],
      PuestoTrabajo: [0],
      Estado: [-1],
    });    
  }

  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
    });    
  }

  addTrabajador() {
    this.router.navigate(['Talento/masters/Trabajador/add']);
  }


  editTrabajador(Trabajador) {    
    this.router.navigate(['Talento/masters/Trabajador/edit'], {
      queryParams: {
        id: Trabajador
      }
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

  delete(id: number) {
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.tipo = 3;
    modalRef.componentInstance.titulo = 'Eliminar Trabajador';
    modalRef.componentInstance.descripcion = 'Esta seguro de eliminar el trabajafor seleccionado?';
    modalRef.componentInstance.msgloading = 'Eliminando trabajador...';
    modalRef.result.then((result) => {
      this.getTrabajadoresList(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Area.value, this.filterGroup.controls.PuestoTrabajo.value, this.filterGroup.controls.Estado.value);
    }, (reason) => {
     console.log(reason);
    }); 
  }

  disabledTrabajador(item) {
    this.trabajador_s.DeleteDisableTrabajador(item.idTrabajador, 1, !item.Activo).subscribe(
      (data:any) => {
        if (data[0].Ok > 0) {
          this.getTrabajadoresList(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Area.value, this.filterGroup.controls.PuestoTrabajo.value, this.filterGroup.controls.Estado.value);
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

