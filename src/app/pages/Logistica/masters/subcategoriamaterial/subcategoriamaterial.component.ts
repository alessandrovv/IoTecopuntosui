import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { Subscription } from 'rxjs';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SaveUpdateSubcategoriaModalComponent } from './save-update-subcategoria-modal/save-update-subcategoria-modal.component';
import { DeleteSubcategoriaModalComponent } from 'src/app/pages/_shared/delete-subcategoria-modal/delete-subcategoria-modal.component';
import { PermissionViewActionService } from 'src/app/Shared/services/permission-view-action.service';
import { SubcategoriaService } from '../../_core/services/subcategoria.service';
import { MaterialService } from '../../_core/services/material.service';

@Component({
	selector: 'app-subcategoriamaterial',
	templateUrl: './subcategoriamaterial.component.html',
	styleUrls: ['./subcategoriamaterial.component.scss']
})
export class SubcategoriamaterialComponent implements OnInit {

	load_data: boolean = true;
	no_data: boolean = false;
	searchBan: boolean = false;
	filterGroup: FormGroup;
	searchGroup: FormGroup;

	//Recordar usar para un siguiente filtro por estados Activo, Inactivo y Todos.
	array_estado: any = [
		{ value: -1, descripcion: 'Todos' },
		{ value: 1, descripcion: 'Activo' },
		{ value: 0, descripcion: 'Inactivo' }
	];

	array_categorias: any;

	listData: MatTableDataSource<any>;
	displayedColumns: string[] = ['Nro', 'actions', 'Activo', 'Categoria', 'NombreSubcategoria', 'Descripcion'];

	@ViewChild(MatSort) MatSort: MatSort;
	@ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

	private subscriptions: Subscription[] = [];
	validViewAction = this.pvas.validViewAction;
	viewsActions: Array<Navigation> = [];

	constructor(
		private modalService: NgbModal,
		private fb: FormBuilder,
		public toastr: ToastrManager,
		public pvas: PermissionViewActionService,
		public subcategoria_s: SubcategoriaService,
		public material_s: MaterialService) {
	}

	ngOnInit(): void {
		this.listData = new MatTableDataSource([]);
		this.viewsActions = this.pvas.get();
		console.log(this.viewsActions);//Por determinar, ¿que hace esto?
		this.filterForm();
		this.searchForm();
		this.getSubcategorias(0);
		this.getCategorias();
	}
	filterForm() {
		this.filterGroup = this.fb.group({
			Categoria: [null],
		});
	}
	searchForm() {
		this.searchGroup = this.fb.group({
			searchTerm: [''],
		});
	}

	getCategorias() {
		this.material_s.GetCategorias().subscribe(
			(data: any) => {
				this.array_categorias = data;
				if(this.array_categorias.length > 1){
				  this.array_categorias.unshift({
				    Categoria: 0, NombreCategoria: 'Todos'
				  });
				}
				this.filterGroup.controls.Categoria.setValue(this.array_categorias[0].Categoria)
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}

	getSubcategorias(idCategoria) {
		this.listData = new MatTableDataSource([]);
		this.searchBan = false;
		this.load_data = false;
		this.no_data = true;

		this.subcategoria_s.GetSubcategoria(idCategoria).subscribe(
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
			}, (errorServicio) => {
				console.log(errorServicio);
				this.load_data = true;
				this.no_data = false;
				this.searchBan = false;
			}
		);
	}

	create(item) {
		const modalRef = this.modalService.open(SaveUpdateSubcategoriaModalComponent, { size: 'ms' });
		modalRef.componentInstance.item = item;
		modalRef.result.then((result) => {
			this.getSubcategorias(this.filterGroup.controls.Categoria.value);
		}, (reason) => {
			console.log(reason);
		});
	}

	edit(item) {
		const modalRef = this.modalService.open(SaveUpdateSubcategoriaModalComponent, { size: 'ms' });
		modalRef.componentInstance.item = item;
		modalRef.result.then((result) => {
			this.getSubcategorias(this.filterGroup.controls.Categoria.value);
		}, (reason) => {
			console.log(reason);
		});
	}

	search() {
		if (this.searchGroup.controls.searchTerm.value == null) {
			this.searchGroup.controls.searchTerm.setValue('');
		}
		this.listData.filter = this.searchGroup.controls.searchTerm.value.trim().toLowerCase();
		if (this.listData.paginator) {
			this.listData.paginator.firstPage();
		}
	}

	enabledDisabledSubcategoria(item) {
		this.subcategoria_s.EnableDisableSubcategoria(item.idSubcategoria, !item.estado).subscribe(
			(data: any) => {
				if (data[0].Ok > 0) {
					this.getSubcategorias(this.filterGroup.controls.Categoria.value);
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

			}, (errorServicio) => {
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
	delete(item) {
		const modalRef = this.modalService.open(DeleteSubcategoriaModalComponent);
		modalRef.componentInstance.id = item.idSubcategoria;
		console.log(item.nombre);

		modalRef.componentInstance.nombre = item.nombreSubcategoria;
		modalRef.componentInstance.titulo = 'Eliminar Subcategoria';
		modalRef.componentInstance.descripcion = '¿Esta seguro de eliminar la siguiente Subcategoria?';
		modalRef.componentInstance.msgloading = 'Eliminando Subcategoria...';
		modalRef.result.then((result) => {
			this.getSubcategorias(this.filterGroup.controls.Categoria.value);
		}, (reason) => {
			console.log(reason);
		});
	}


}
