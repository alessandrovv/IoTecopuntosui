import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
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
import { CertificadosService } from '../../../Talento/_core/services/certificados.service';
import { DeleteModalGeneralComponent } from '../../../_shared/delete-modal/delete-modal.component';
import { Router } from '@angular/router';
import { MetaComercialService } from '../../_core/meta-comercial.service';
import { EmpresaService } from '../../../Security/_core/services/empresa.service';

@Component({
  selector: 'app-metas-comerciales',
  templateUrl: './metas-comerciales.component.html',
  styleUrls: ['./metas-comerciales.component.scss']
})
export class MetasComercialesComponent implements OnInit {

  load_data: boolean = true;
  no_data: boolean = false;
  searchBan: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Nro', 'Empresa', 'Año', 'Mes','actions'];
  
  @ViewChild(MatSort) MatSort: MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;
  
  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];
  array_data: TableResponseModel<any>;
  
  array_dataList: any;
  
  array_empresas: any;
  array_anios: any;
  array_meses: any;
  
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public certificado_s: CertificadosService,
    public metaComercial_s: MetaComercialService,
    public pvas: PermissionViewActionService,
    public empresa_s:EmpresaService,
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
    this.getAnios();
    this.getMeses();
    this.getMetasComerciales('0', '0', '0');
  }

  filterForm() {
    this.filterGroup  = this.fb.group({
      Empresa: [0],
      Anio: [0],
      Mes: [0],
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
  getAnios(){
    this.metaComercial_s.GetListarAnios().subscribe(
      (data:any) => {
        this.array_anios = data;
        this.array_anios.unshift({
          ValorAnio: 0, NombreAnio: 'Todos'
        });
        console.log(this.array_anios);         
      }, ( errorServicio ) => {           
        console.log(errorServicio);
      }
    );
  }
  getMeses(){
    this.metaComercial_s.GetListarMeses().subscribe(
      (data:any) => {
        this.array_meses = data;
        this.array_meses.unshift({
          ValorMes: 0, NombreMes: 'Todos'
        });
        console.log(this.array_meses);         
      }, ( errorServicio ) => {           
        console.log(errorServicio);
      }
    );   
  }
  getMetasComerciales(Empresa , Anio, Mes) {
    this.listData = new MatTableDataSource([]);
    this.searchBan = false;
    this.load_data = false;
    this.no_data = true;

    this.metaComercial_s.GetMetasComerciales(Empresa, Anio, Mes).subscribe(
      (data:any) => {
        console.log(data);
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

  addMetaComercial() {    
    this.router.navigate(['Comercial/masters/MetasComerciales/add']);
  }
  
  editMetaComercial(MetaComercial) {
    this.router.navigate(['Comercial/masters/MetasComerciales/edit'], {
      queryParams: {
        id: MetaComercial
      }
    });
  }
  
  
  delete(idMetaComercial: number) {
    const modalRef = this.modalService.open(DeleteModalGeneralComponent);
    modalRef.componentInstance.id = idMetaComercial;
    modalRef.componentInstance.titulo = 'Eliminar Meta Comercial';
    modalRef.componentInstance.descripcion = 'Esta seguro de eliminar la Meta Comercial seleccionada?';
    modalRef.componentInstance.msgloading = 'Eliminando Meta Comercial...';
		modalRef.componentInstance.service = ()=>{
			return this.metaComercial_s.DeleteMetaComercial(idMetaComercial);
		};
    modalRef.result.then((result) => {
      this.getMetasComerciales(this.filterGroup.controls.Empresa.value, this.filterGroup.controls.Anio.value, this.filterGroup.controls.Mes.value);
    }, (reason) => {
     console.log(reason);
    });  
   }

}
