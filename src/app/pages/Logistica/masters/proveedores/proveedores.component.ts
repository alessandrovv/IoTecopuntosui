import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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
import { ProveedorService } from '../../_core/services/proveedor.service';
import { DeleteModalGeneralComponent } from '../../../_shared/delete-modal/delete-modal.component';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss']
})
export class ProveedoresComponent implements OnInit {
  formDatosPersonales: FormGroup;
  load_data: boolean = true;
  no_data: boolean = false;
  searchBan: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = [ 'Nro', 'actions', 'Activo', 'RazonSocial', 'TipoDocumentoIdentidad', 'DocumentoIdentidad', 
                              'Categoria', 'Ubicacion',  'Telefono', 'Email'];

  @ViewChild(MatSort) MatSort: MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];
  array_dataList: any;
  array_categorias: any;
  array_pais: any;
	array_departamento: any;
	array_provincia: any;
	array_distrito: any;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public proveedor_s: ProveedorService,
    public multitabla_s: MultitablaService,
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
    this.getCategoria();
    this.getPaises(null);
    this.getListarDepartamento(0);
    this.getListarProvincia(0, null);
    this.getListarDistrito(0, null);
    this.getProveedores( 0 , 0 , 0 , 0 , 0);
    console.log(this.listData);
  }

  filterForm() {
    this.filterGroup = this.fb.group({
      Categoria: ['0'],
      Pais: ['0'],
      Departamento: ['0'],
      Provincia: ['0'],
      Distrito: ['0']
    });    
  }
  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
    });    
  }
  getCategoria() {
    this.proveedor_s.GetListarCategoriaProveedores().subscribe(
      (data:any) => {
        this.array_categorias = data;
        this.array_categorias.unshift({
          idCategoriaProveedor: '0', nombre: 'Todos'
        });
        console.log(data);         
      }, ( errorServicio ) => {           
        console.log(errorServicio);
      }
    );
  } 

  getPaises(PosibleValor) {
		this.multitabla_s.GetListarPaises().subscribe(
		(data: any) => {
			this.array_pais = data;
      this.array_pais.unshift({
        Pais: '0', NombrePais: 'Todos'
      });
			if (PosibleValor !== null) {
				this.formDatosPersonales.controls.Pais.setValue(PosibleValor)
			}
		}, (errorServicio) => {

			console.log(errorServicio);
		}
	);
	}

	getListarDepartamento(Pais) {
		this.multitabla_s.GetListarDepartamentos(Pais).subscribe(
			(data: any) => {
				this.array_departamento = data;
        this.array_departamento.unshift({
          Departamento: '0', NombreDepartamento: 'Todos'
        });

			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

	getListarProvincia(Departamento, PosibleValor) {
		this.multitabla_s.GetListarProvincia(Departamento).subscribe(
			(data: any) => {
				this.array_provincia = data;
				this.array_provincia.unshift({
          Provincia: '0', NombreProvincia: 'Todos'
        });
			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

	getListarDistrito(Provincia, PosibleValor) {
		this.multitabla_s.GetListarDistrito(Provincia).subscribe(
			(data: any) => {
				this.array_distrito = data;
        this.array_distrito.unshift({
          Distrito: '0', NombreDistrito: 'Todos'
        });
			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

  getProveedores(categoria, Pais, Departamento , Provincia, Distrito) {
    this.listData = new MatTableDataSource([]);
    this.searchBan = false;
    this.load_data = false;
    this.no_data = true;

    this.proveedor_s.GetProveedores(categoria, Pais, Departamento , Provincia, Distrito).subscribe(
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

  search() {
    if(this.searchGroup.controls.searchTerm.value == null) {
      this.searchGroup.controls.searchTerm.setValue('');
    }
    this.listData.filter = this.searchGroup.controls.searchTerm.value.trim().toLowerCase();
    if (this.listData.paginator) {
      this.listData.paginator.firstPage();
    }
  }

  disabledProveedor(item) {
    this.proveedor_s.EnableDisableProveedor(item.idProveedor,!item.activo).subscribe(
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
  
  delete(idProveedor: number) {
    const modalRef = this.modalService.open(DeleteModalGeneralComponent);
    modalRef.componentInstance.id = idProveedor;
    modalRef.componentInstance.titulo = 'Eliminar Proveedor';
    modalRef.componentInstance.descripcion = 'Esta seguro de eliminar el Proveedor seleccionado?';
    modalRef.componentInstance.msgloading = 'Eliminando Proveedor...';
		modalRef.componentInstance.service = ()=>{
			return this.proveedor_s.DeleteProveedor(idProveedor);
		};
    modalRef.result.then((result) => {
      this.getProveedores(this.filterGroup.controls.Categoria.value, this.filterGroup.controls.Pais.value, this.filterGroup.controls.Departamento.value, this.filterGroup.controls.Provincia.value, this.filterGroup.controls.Distrito.value);
    }, (reason) => {
     console.log(reason);
    });  
   }
   
  addProveedor() {
    this.router.navigate(['Logistica/masters/Proveedores/add']);
  }

  editProveedor(Proveedor) {
    this.router.navigate(['Logistica/masters/Proveedores/edit'], {
      queryParams: {
        id: Proveedor
      }
    });
  }
}
