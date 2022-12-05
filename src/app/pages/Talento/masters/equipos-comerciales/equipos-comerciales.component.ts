import { Component, OnInit, ViewChild } from '@angular/core';
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
import { equipoComercialService } from '../../_core/services/equipoComercial.service';

@Component({
  selector: 'app-equipos-comerciales',
  templateUrl: './equipos-comerciales.component.html',
  styleUrls: ['./equipos-comerciales.component.scss']
})
export class EquiposComercialesComponent implements OnInit {

  // paginator: PaginatorState;
  load_data: boolean = true;
  no_data: boolean = false;
  searchBan: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Numero', 'actions', 'Activo', 'Certificado', 'Asociado', 'Celular', 'Email', 'CantidadAsesores', 
                              'Ventas'];
  @ViewChild(MatSort) MatSort: MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];
  array_data: TableResponseModel<Certificado>;
  array_dataList: any;
  array_modalidad: any;
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
    public equipo_s: equipoComercialService,
    public pvas: PermissionViewActionService,
    public toastr: ToastrManager,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();
    this.filterForm();
    this.getEquiposComercialesList(-1);    
  }

  getEquiposComercialesList(activo) {
    this.listData = new MatTableDataSource([]);
    this.searchBan = false;
    this.load_data = false;
    this.no_data = true;

    this.equipo_s.GetListarEquiposComerciales(activo).subscribe(
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

  filterForm() {
    this.filterGroup = this.fb.group({
      Estado: [-1],
      searchTerm: [''],
    });    
  }

  addEquipoComercial() {
    this.router.navigate(['Talento/masters/EquipoComercial/add']);
  }

  disabledEquipoComercial(item) {
    this.equipo_s.DeleteDisableEquipo(item.EquipoComercial, 1, !item.Activo).subscribe(
      (data:any) => {
        if (data[0].Ok > 0) {
          this.getEquiposComercialesList(this.filterGroup.controls.Estado.value);
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

  search() {
    if(this.filterGroup.controls.searchTerm.value == null) {
      this.filterGroup.controls.searchTerm.setValue('');
    }
    this.listData.filter = this.filterGroup.controls.searchTerm.value.trim().toLowerCase();
    if (this.listData.paginator) {
      this.listData.paginator.firstPage();
    }
  }

  editEquipoComercial(EquipoComercial) {
    this.router.navigate(['Talento/masters/EquipoComercial/edit'], {
      queryParams: {
        id: EquipoComercial
      }
    });
  }
  delete(id: number) {
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.tipo = 4;
    modalRef.componentInstance.titulo = 'Eliminar Equipo Comercial';
    modalRef.componentInstance.descripcion = 'Esta seguro de eliminar el equipo comercial seleccionado?';
    modalRef.componentInstance.msgloading = 'Eliminando equipo...';
    modalRef.result.then((result) => {
      this.getEquiposComercialesList(this.filterGroup.controls.Estado.value);
    }, (reason) => {
     console.log(reason);
    }); 
  }

  disabledCertificado(item) {
    this.certificado_s.DeleteCertificado(item.idCertificado, 1, !item.Activo).subscribe(
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