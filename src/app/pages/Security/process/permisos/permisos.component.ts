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
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { UsuarioService } from '../../_core/services/usuario.service';
import { PermisoService } from '../../_core/services/permiso.service';

@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.scss']
})
export class PermisosComponent implements OnInit {

  load_data: boolean = true;
  no_data: boolean = false;
  searchBan: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  array_roles: any = [];
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Nro', 'Empresa', 'Codigo', 'NombresApellidos', 'DocumentoIdentidad', 'Direccion', 
                              'Area', 'PuestoTrabajo', 'FechaInicioContrato', 'FechaFinContrato', 
                              'Edad', 'Sexo', 'Activo', 'actions'];
  @ViewChild(MatSort) MatSort: MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];
  navegacion: Array<Navigation> = [];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public multitabla_s: MultitablaService,
    public pvas: PermissionViewActionService,
    public toastr: ToastrManager,
    private router: Router,
    private usuario_s: UsuarioService,
    private permiso_s: PermisoService,
    private chgRef: ChangeDetectorRef, 
  ) { }

  ngOnInit(): void {
    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();     
    this.filterForm(); 
    this.getMainList();
  }

  filterForm() {
    this.filterGroup = this.fb.group({
      Rol: [null]
    });    
  }

  getMainList(){
    this.usuario_s.GetListarRoles()
      .subscribe((response: Array<any>) => {
        console.log(response);
        this.array_roles = response;
      });
  }

  changeRol(Rol) {
    this.searchBan = true;
    this.dataSource.data = [];
    this.permiso_s.obtenerNavegacionPorRol(Rol)
      .subscribe((response: any) => {
        console.log(response);
        this.searchBan = false;
        this.navegacion = response.Data.SubNavegacion as Array<Navigation>;
        this.dataSource.data = this.navegacion;
        this.treeControl.expandAll();
        this.chgRef.markForCheck();   
      });
  }

  changeChecked($event, navegacion: Navigation) {
    const id = navegacion.Permiso == null ? -1 : navegacion.Permiso;
    console.log(navegacion);
    this.permiso_s.guardarPermiso(id, navegacion.Opcion, navegacion.Vista, navegacion.Accion, this.filterGroup.controls.Rol.value)
    .subscribe((response: any) => {
        if (response.Ok) {
          this.toastr.successToastr(response.Message, 'Éxito!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
        } else {
          this.toastr.errorToastr(response.Message, 'Error!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
        }
      }, (error) => {
        this.toastr.errorToastr(error.error.Message, 'Error!', {
          toastTimeout: 2000,
          showCloseButton: true,
          animate: 'fade',
          progressBar: true
        });
      });
  }

  private _transformer = (node: Navigation, level: number) => {
    return {
      expandable: (node.TipoSubNavegacion == 2 || node.TipoSubNavegacion == 3) && node.SubNavegacion.length > 0,
      level: level,
      indent: 10,
      data: node
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.SubNavegacion);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  level: number;
  indent: number,
  data: Navigation;
}
