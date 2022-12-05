import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Subscription } from 'rxjs';
import { EmpresaService } from 'src/app/pages/Security/_core/services/empresa.service';
import { CertificadosService } from 'src/app/pages/Talento/_core/services/certificados.service';
import { TrabajadorService } from 'src/app/pages/Talento/_core/services/trabajador.service';
import { DeleteModalGeneralComponent } from 'src/app/pages/_shared/delete-modal/delete-modal.component';
import { PermissionViewActionService } from 'src/app/Shared/services/permission-view-action.service';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { TableResponseModel } from 'src/app/_metronic/shared/crud-table';
import { ClientesService } from '../../_core/clientes.service';
import { MultitablaService } from '../../../_core/services/multitabla.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss'],
  providers: [DatePipe,
		{ provide: NgbDateAdapter, useClass: CustomAdapter },
		{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
	]
})
export class ClienteComponent implements OnInit {

  
  load_data: boolean = true;
  no_data: boolean = false;
  searchBan: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Nro','actions', 'Activo','Codigo','RazonSocial', 'NombreComercial', 'DocumentoIdentidad','Pais','Departamento'];
  
  @ViewChild(MatSort) MatSort: MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;
  
  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<any> = [];
  array_data: TableResponseModel<any>;
  array_dataList: any;
  

  array_paises: any =[];
  array_departamentos: any=[];
  array_estado: any = [
    { value: -1, descripcion: 'Todos' },
    { value: 1, descripcion: 'Activo' },
    { value: 0, descripcion: 'Inactivo' }
  ];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public certificado_s: CertificadosService,
    public cliente_s: ClientesService,
    public multitabla_s: MultitablaService,
    public pvas: PermissionViewActionService,
    public empresa_s:EmpresaService,
    public toastr: ToastrManager,
    private router: Router,
		public trabajador_s: TrabajadorService,    
    private datePipe: DatePipe,
  ) { }
  
  ngOnInit(): void {
    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();
    this.filterForm();
    this.searchForm();    
    this.getListarPaises();
  }
  getListarPaises() { 
		this.multitabla_s.GetListarPaises().pipe(
      finalize( () => {
        this.getListarDepartamentos(this.filterGroup.controls.Pais.value); 
      })
      ).subscribe(
		(data: any) => {
			this.array_paises = data;
			console.log(this.array_paises);
			if(this.array_paises.length > 1){
        this.array_paises.unshift({
          Pais: 0, NombrePais: 'Todos'
        });            
        this.filterGroup.controls.Pais.setValue(0);     
      }else{
        this.filterGroup.controls.Pais.setValue(this.array_paises[0].Pais);  
      }    
		}, (errorServicio) => {

			console.log(errorServicio);
		}
	);
	}

	getListarDepartamentos(Pais) {
    
    this.filterGroup.controls.Departamento.setValue(null);
		this.multitabla_s.GetListarDepartamentos(Pais).pipe(
      finalize( () => {
        this.getClientes(this.filterGroup.controls.Pais.value,this.filterGroup.controls.Departamento.value,this.filterGroup.controls.Estado.value);
      })
      ).subscribe(
        (data:any) => {
          console.log(data);          
          this.array_departamentos = data;          
          if(this.array_departamentos.length > 1){
            this.array_departamentos.unshift({
              Departamento: 0, NombreDepartamento: 'Todos'
            });            
            this.filterGroup.controls.Departamento.setValue(0);     
          }   
        }, ( errorServicio ) => {           
          console.log(errorServicio);
        }
      );
	}
  filterForm() {
    this.filterGroup  = this.fb.group({
      Pais: [null],
      Departamento: [null],
      Estado: [-1]
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
  
  getClientes(Pais,Departamento,Activo) {
    this.listData = new MatTableDataSource([]);
    this.searchBan = false;
    this.load_data = false;
    this.no_data = true;
    /* this.filterGroup.controls.FechaInicio.value, this.filterGroup.controls.FechaFin.value */
    this.cliente_s.GetClientes(Pais,(Departamento == null) ? 0 :Departamento,Activo).subscribe(
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
  addRuta() {    
    this.router.navigate(['Sales/masters/Cliente/add']);
  }
  
  editRuta(Cliente) {
    this.router.navigate(['Sales/masters/Cliente/edit'], {
      queryParams: {
        id: Cliente
      }
    });
  }
  
  
  delete(idCliente: number) {
    const modalRef = this.modalService.open(DeleteModalGeneralComponent);
    modalRef.componentInstance.id = idCliente;
    modalRef.componentInstance.titulo = 'Eliminar Cliente';
    modalRef.componentInstance.descripcion = 'Esta seguro de eliminar el Cliente seleccionado?';
    modalRef.componentInstance.msgloading = 'Eliminando Cliente...';
		modalRef.componentInstance.service = ()=>{
			return this.cliente_s.DeleteCliente(idCliente);
		};
    modalRef.result.then((result) => {
      this.getClientes(this.filterGroup.controls.Pais.value,this.filterGroup.controls.Departamento.value,this.filterGroup.controls.Estado.value);
    }, (reason) => {
     console.log(reason);
    });  
   }
   enableDisableCliente(item){
    this.cliente_s.EnableDisableCliente(item.idCliente,!item.activo).subscribe(
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
