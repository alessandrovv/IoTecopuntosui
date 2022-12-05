import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionViewActionService } from '../../../../Shared/services/permission-view-action.service';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DeleteModalComponent } from '../../../_shared/delete-customer-modal/delete-modal.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { EmpresaService } from '../../../Security/_core/services/empresa.service';
import {finalize} from 'rxjs/operators';
import { UsuarioService } from '../../_core/services/usuario.service';
import { LogUsuarioComponent } from './log-usuario/log-usuario.component';
import { DeleteModalGeneralComponent } from 'src/app/pages/_shared/delete-modal/delete-modal.component';

@Component({
  selector: "app-usuarios-conectados",
  templateUrl: "./usuarios-conectados.component.html",
  styleUrls: ["./usuarios-conectados.component.scss"],
})
export class UsuariosConectadosComponent implements OnInit {
  // paginator: PaginatorState;
  load_data: boolean = true;
  no_data: boolean = false;
  searchBan: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ["Trabajador", "Estado", "Fecha", "Tiempo", "actions"];

  @ViewChild(MatSort) MatSort: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("matPaginator", { static: true }) paginator: MatPaginator;

  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];
  array_dataList: any;

  array_trabajadores: any;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public empresa_s: EmpresaService,
    public pvas: PermissionViewActionService,
    private usuario_s: UsuarioService,
    public toastr: ToastrManager,
    private chgRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();
    console.log(this.viewsActions);
    this.searchForm();
    this.getUsuariosConectados();
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


  getUsuariosConectados() {
    this.searchBan = false;
    this.load_data = false;
    this.no_data = true;

    this.usuario_s.GetUsuariosConectados().subscribe(
      (data: any) => {
        this.load_data = true;
        this.searchBan = false;
        this.listData = new MatTableDataSource(data);
        if (data.length > 0) {
          this.no_data = true;
        } else {
          this.no_data = false;
        }
        this.listData.sort = this.MatSort;
        this.listData.paginator = this.paginator;
      },
      (errorServicio) => {
        this.load_data = true;
        this.no_data = false;
        this.searchBan = false;
      }
    );
  }

  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
    });    
  }

  show(item) {

    console.log(item);
    const modalRef = this.modalService.open(LogUsuarioComponent, {size: "xl"});
    modalRef.componentInstance.item = item;
    // modalRef.componentInstance.item = item;
    // modalRef.result.then(
    //   (result) => {
    //     this.getCetificados(
    //       this.filterGroup.controls.Empresa.value,
    //       this.filterGroup.controls.Cliente.value,
    //       this.filterGroup.controls.Estado.value
    //     );
    //   },
    //   (reason) => {
    //     console.log(reason);
    //   }
    // );
  }

  logout(item) {
    console.log(item);
    
    const modalRef = this.modalService.open(DeleteModalGeneralComponent, {size: 'md'})
    modalRef.componentInstance.titulo = "Cerrar Sesion usuario"
    modalRef.componentInstance.descripcion = "¿Seguro que quiere cerrar la sesión?"
    modalRef.componentInstance.msgloading = "Cerrando sesión..."
    modalRef.componentInstance.boton = 'Cerrar Sesion'
    modalRef.componentInstance.service = ()=>{ // funcion que se va a llamar al presionar el boton de eliminar
			return this.usuario_s.ForzarCerrarSesionUsuario(item.idUsuario, item.idTrabajador)// es necesario usar el return para que el servicio retorne 
		};
    modalRef.result.then((result) => {
      this.usuario_s.GetUsuariosConectados().subscribe(
        (data: any) => {
          this.load_data = true;
          this.searchBan = false;
          this.listData = new MatTableDataSource(data);
          if (data.length > 0) {
            this.no_data = true;
          } else {
            this.no_data = false;
          }
          this.listData.sort = this.MatSort;
          this.listData.paginator = this.paginator;
        },
        (errorServicio) => {
          this.load_data = true;
          this.no_data = false;
          this.searchBan = false;
        }
      );
    }, (reason) => {
     console.log(reason);
    }); 
    
  }
}
