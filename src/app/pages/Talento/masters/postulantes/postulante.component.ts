import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionViewActionService } from '../../../../Shared/services/permission-view-action.service';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { CertificadosService } from '../../_core/services/certificados.service';
import { TableResponseModel } from '../../../../_metronic/shared/crud-table/models/table.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MultitablaService } from '../../../_core/services/multitabla.service';
import { Router } from '@angular/router';
import { PostulanteService } from '../../_core/services/postulante.service';
import { DeleteModalGeneralComponent } from 'src/app/pages/_shared/delete-modal/delete-modal.component';
import { AnyAaaaRecord } from 'dns';
import { EmpresaService } from '../../../Security/_core/services/empresa.service';
import { AreaService } from '../../_core/services/area.service';
import { puestoTrabajoService } from '../../_core/services/puestoTrabajo.service';
import { Area } from '../../_core/models/area.model';
import {finalize} from 'rxjs/operators';
@Component({
  selector: 'app-postulantes',
  templateUrl: './postulante.component.html',
  styleUrls: ['./postulante.component.scss'],
})
export class PostulanteComponent implements OnInit {

  // paginator: PaginatorState;
  load_data: boolean = true;
  no_data: boolean = false;
  searchBan: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;

  @ViewChild(MatSort) MatSort: MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Nro', 'actions', 'Activo', 'Empresa', 'Codigo', 'Nombre', 'ApePaterno', 'ApeMaterno', 'DocIdentidad', 'Direccion', 'Area', 'PuestoTrabajo', 'ModalidadContratacion', 'Edad', 'Sexo'];


	array_estado: any = [
    { value: -1, descripcion: 'Todos' },
    { value: 1, descripcion: 'Activo' },
    { value: 0, descripcion: 'Inactivo' }
  ];

	array_test: any = [
		{
			NombreEmpresa:'DAS',
			Codigo:'P-2021-0001',
			Nombre:'Fabio',
			ApePaterno:'Peralta',
			ApeMaterno:'Medina',
			DocIdentidad:'74658829',
			Direccion:'Calle 9 de octubre',
			Area:'Comercial',
			PuestoTrabajo:'Asesor Comercial',
			ModalidadContratacion:'Cuarta Categoria',
			Edad:26,
			Sexo:'M',
			Activo:1,
		}
	]

  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];
  array_data: TableResponseModel<any>;
  array_dataList: any;
  array_empresas: any;
  array_puestos: any;
  array_areas: any;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public certificado_s: CertificadosService,
    public multitabla_s: MultitablaService,
		public postulante_s: PostulanteService,
    public empresa_s:EmpresaService,
    public area_s:AreaService,
    public puestoTrabajo_s:puestoTrabajoService,
    public pvas: PermissionViewActionService,
    public toastr: ToastrManager,
    private chgRef: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();
    this.filterForm();
    this.searchForm();
    this.getEmpresas();
		this.getArea(0);
    this.getPuestoTrabajo(0,0);
    // this.getConfiguracionDocumentoList(0, '0', '0');    
  }

  
  filterForm() {
    this.filterGroup = this.fb.group({      
      Empresa: [0],
      Area: [0],
      PuestoTrabajo: [0],
			Estado: [-1],
    });    
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
    this.puestoTrabajo_s.GetPuestoTrabajoByUsuario(Empresa, ((Area == null) ? 0 : Area)).pipe(finalize(()=>{this.getPostulante(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Area.value, this.filterGroup.controls.PuestoTrabajo.value, this.filterGroup.controls.Estado.value); })).subscribe(
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

  getPostulante(empresa, area, ptoTrabajo, estado) {		
		this.listData = new MatTableDataSource([])
    this.searchBan = false;
    this.load_data = false;
    this.no_data = true;
    this.postulante_s.GetPostulantesList(empresa, ((area == null) ? 0 : area), ((ptoTrabajo == null) ? 0 : ptoTrabajo), estado).subscribe(
      (data:any) => {
        
        console.log(empresa, area, ptoTrabajo, estado);
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






  edit(item) {
		this.router.navigate(['Talento/masters/Postulante/add'], {
      queryParams: {
        id: item.idPostulante
      }
    });
  }

	send(item){
		console.log('enviar',item);
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

	delete(id: number) {
    const modalRef = this.modalService.open(DeleteModalGeneralComponent);
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.titulo = 'Eliminar Postulante';
    modalRef.componentInstance.descripcion = 'Esta seguro de eliminar el Postulante seleccionado?';
    modalRef.componentInstance.msgloading = 'Eliminando Postulante...';
		modalRef.componentInstance.service = ()=>{ // funcion que se va a llamar al presionar el boton de eliminar
			return this.postulante_s.DeletePostulante(id);  // es necesario usar el return para que el servicio retorne 
		};																								// el observable, para la logica necesaria en el modal
    modalRef.result.then((result) => {
      this.getPostulante(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Area.value, this.filterGroup.controls.PuestoTrabajo.value,this.filterGroup.controls.Estado.value);
    }, (reason) => {
     console.log(reason);
    }); 
  }


  disabledPostulante(item) {
		item.activo = !item.activo
    this.postulante_s.EnableDisablePostulante(item.idPostulante, !item.Activo).subscribe(
      (data:any) => {
        if (data[0].Success > 0) {
          // this.getCetificados(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Modalidad.value, this.filterGroup.controls.PuestoTrabajo.value);
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