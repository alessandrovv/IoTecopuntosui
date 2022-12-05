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
import { EmpresaService } from '../../../Security/_core/services/empresa.service';
import { puestoTrabajoService } from '../../_core/services/puestoTrabajo.service';
import { CloseScrollStrategy } from '@angular/cdk/overlay';
import {finalize} from 'rxjs/operators';
@Component({
  selector: 'app-configuracion-documento',
  templateUrl: './configuracion-documento.component.html',
  styleUrls: ['./configuracion-documento.component.scss']
})
export class ConfiguracionDocumentoComponent implements OnInit {

  // paginator: PaginatorState;
  load_data: boolean = true;
  no_data: boolean = false;
  searchBan: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Nro', 'actions', 'Activo', 'Empresa', 'DesModalidad', 'DesPuestoTrabajo'];
  @ViewChild(MatSort) MatSort: MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];
  array_data: TableResponseModel<Certificado>;
  array_dataList: any;
  array_empresas: any;
  array_puestos: any;
  array_modalidad: any;
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public certificado_s: CertificadosService,
    public documento_s: DocumentoService,
    public multitabla_s: MultitablaService,
    public empresa_s:EmpresaService,
    public puestoTrabajo_s:puestoTrabajoService,
    public pvas: PermissionViewActionService,
    public toastr: ToastrManager,
    private router: Router,
    private chgRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();
    console.log(this.viewsActions);
    this.filterForm();
    this.searchForm();

    this.getEmpresas();    
    this.getModalidadContratacion();    
    this.getPuestoTrabajo(0); 
  }

  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
    });    
  }

  filterForm() {
    this.filterGroup = this.fb.group({      
      Empresa: [0],
      Modalidad: ['0'],
      PuestoTrabajo: [0],
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

  getModalidadContratacion() {
    this.multitabla_s.GetModalidadContratacion().subscribe(
      (data:any) => {
        this.array_modalidad = data;
        this.array_modalidad.unshift({
          Valor: '0', Nombre: 'Todos'
        });            
      }, ( errorServicio ) => {
            
        console.log(errorServicio);
      }
    );
  }

  getPuestoTrabajo(Empresa) {    
    this.filterGroup.controls.PuestoTrabajo.reset();   
    this.puestoTrabajo_s.GetPuestoTrabajoByUsuario(Empresa,0).pipe(finalize(()=>{this.getConfiguracionDocumentoList(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Modalidad.value, this.filterGroup.controls.PuestoTrabajo.value); })).subscribe(
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

  getConfiguracionDocumentoList(empresa, modalidad, puestoTrabajo) {
    this.listData = new MatTableDataSource([]);
    this.searchBan = false;
    this.load_data = false;
    this.no_data = true;
    console.log(empresa, modalidad, puestoTrabajo);
    this.documento_s.GetConfiguracionDocumentoList(empresa, modalidad, ((puestoTrabajo == null) ? 0 : puestoTrabajo)).subscribe(
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
        this.listData.paginator = this.paginator;       
      }, ( errorServicio ) => {
        this.load_data = true;
        this.no_data = false;
        this.searchBan = false;        
      }
    );

  }

  addConfiguracion() {
    this.router.navigate(['Talento/masters/ConfiguracionDocumento/add']);
  }


  editConfiguracion(Configuracion) {
    this.router.navigate(['Talento/masters/ConfiguracionDocumento/edit'], {
      queryParams: {
        id: Configuracion
      }
    });
  }

  // create(item) {
  //   const modalRef = this.modalService.open(SaveUpdateCertificadoModalComponent, { size: 'ms' });
  //   modalRef.componentInstance.item = item;
  //   modalRef.result.then((result) => {
  //     this.getCetificados(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Cliente.value, this.filterGroup.controls.Estado.value);
  //   }, (reason) => {
  //    console.log(reason);
  //   }); 
  // }

  // edit(item) {
  //   const modalRef = this.modalService.open(SaveUpdateCertificadoModalComponent, { size: 'ms' });
  //   modalRef.componentInstance.item = item;
  //   modalRef.result.then((result) => {
  //     this.getCetificados(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Cliente.value, this.filterGroup.controls.Estado.value);
  //   }, (reason) => {
  //    console.log(reason);
  //   }); 
  // }

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
    modalRef.componentInstance.tipo = 2;
    modalRef.componentInstance.titulo = 'Eliminar Configuración';
    modalRef.componentInstance.descripcion = 'Esta seguro de eliminar la configuración seleccionado?';
    modalRef.componentInstance.msgloading = 'Eliminando configuración...';
    modalRef.result.then((result) => {
      this.getConfiguracionDocumentoList(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Modalidad.value, this.filterGroup.controls.PuestoTrabajo.value);
    }, (reason) => {
     console.log(reason);
    }); 
  }

  disabledConfDocumento(item) {
    this.documento_s.DeleteDisableConfDocumento(item.IdfiguracionDocumento, 1, !item.Activo).subscribe(
      (data:any) => {
        if (data[0].Ok > 0) {
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

