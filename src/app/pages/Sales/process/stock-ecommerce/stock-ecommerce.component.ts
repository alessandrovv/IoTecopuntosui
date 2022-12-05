import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { Subscription } from 'rxjs';
import { ToastrManager } from 'ng6-toastr-notifications';
import { PermissionViewActionService } from 'src/app/Shared/services/permission-view-action.service';
import { Router } from '@angular/router';
import { StockEcommerceService } from '../../_core/stock-ecommerce.service';
import { EstablecimientoService } from 'src/app/pages/Logistica/_core/services/establecimiento.service';


@Component({
	selector: 'app-stock-ecommerce',
	templateUrl: './stock-ecommerce.component.html',
	styleUrls: ['./stock-ecommerce.component.scss']
})
export class StockEcommerceComponent implements OnInit {

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


	array_establecimiento: any = [];


	listData: MatTableDataSource<any>;
	displayedColumns: string[] = ['Nro', 'actions', 'Fecha', 'Establecimiento', 'Estado'];

	@ViewChild(MatSort) MatSort: MatSort;
	@ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

	private subscriptions: Subscription[] = [];
	validViewAction = this.pvas.validViewAction;
	viewsActions: Array<Navigation> = [];

	constructor(
		private modalService: NgbModal,
		private fb: FormBuilder,
		public toastr: ToastrManager,
		private chgRef: ChangeDetectorRef,
		private router: Router,
		private stock_ecommerce_s: StockEcommerceService,
		public establecimiento_s: EstablecimientoService,
		public pvas: PermissionViewActionService,) {
	}

	ngOnInit(): void {
		this.listData = new MatTableDataSource([]);
		this.viewsActions = this.pvas.get()
		this.searchForm();
		this.filterForm();
		this.getComboEstablecimiento();
		this.getListarStockEcommerce(0);
	}

	filterForm() {
		this.filterGroup = this.fb.group({
			Establecimiento: [null],
		});
	}

	searchForm() {
		this.searchGroup = this.fb.group({
			searchTerm: [''],
		});
	}

	getComboEstablecimiento() {
		let defaultIndex = 0
		this.stock_ecommerce_s.GetComboEstablecimientos().subscribe(
			(data: any) => {
				this.array_establecimiento = data;
				this.array_establecimiento.unshift({
					idEstablecimiento: 0, nombre: 'Todos'
				});
				defaultIndex = this.array_establecimiento[0].nombre
				this.filterGroup.controls.Establecimiento.setValue(
					defaultIndex
				);
				this.chgRef.markForCheck();
			}
		)
	}

	getListarStockEcommerce(idEstablecimiento) {
		this.listData = new MatTableDataSource([]);
		this.searchBan = false;
		this.load_data = false;
		this.no_data = true;

		this.stock_ecommerce_s.GetListarStockEcommerce(idEstablecimiento).subscribe(
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

	create() {
		this.router.navigate(['Sales/process/stockEcommerce/add']);
	}

	edit(idStockEcommerce, flag = 0) {
		this.router.navigate(['Sales/process/stockEcommerce/edit'], {
			queryParams: {
				id: idStockEcommerce,
				copy: flag
			}
		}
		);
	}

	delete(item) {

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


}
