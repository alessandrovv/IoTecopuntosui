import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ICreateAction, IEditAction, IDeleteAction, IDeleteSelectedAction, IFetchSelectedAction, IUpdateStatusForSelectedAction, ISortView, IFilterView, IGroupingView, ISearchView, PaginatorState, SortState, GroupingState } from 'src/app/_metronic/shared/crud-table';
import { PermissionViewActionService } from '../../../../Shared/services/permission-view-action.service';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { MultitablaService } from 'src/app/pages/_core/services/multitabla.service';
import { ITableState, TableResponseModel } from '../../../../_metronic/shared/crud-table/models/table.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SaveUpdateEsquemaComisionesModalComponent } from '../../../Finanzas/masters/esquema-comisiones/save-update-esquema-comisiones-modal/save-update-esquema-comisiones-modal.component';
import { DeleteEsquemaComisionComponent } from './../../../_shared/delete-esquema-comision/delete-esquema-comision.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';

@Component({
  selector: 'app-multitabla',
  templateUrl: './multitabla.component.html',
  styleUrls: ['./multitabla.component.scss']
})
export class MultitablaComponent implements OnInit {

	// paginator: PaginatorState;
	load_data: boolean = true;
	no_data: boolean = false;
	searchBan: boolean = false;
	searchGroup: FormGroup;

	listData: MatTableDataSource<any>;
	displayedColumns: string[] = ['Nro', 'Tabla', 'Nombre', 'Descripcion', 'actions'];

	@ViewChild(MatSort) MatSort: MatSort;
	// @ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

	private subscriptions: Subscription[] = [];
	validViewAction = this.pvas.validViewAction;
	viewsActions: Array<Navigation> = [];
	array_data: TableResponseModel<any>;
	array_dataList: any;
	constructor(
		private fb: FormBuilder,
		private modalService: NgbModal,
		public multitabla_s : MultitablaService,
		public pvas: PermissionViewActionService,
		public toastr: ToastrManager,
		private router: Router
	) { }

	ngOnInit(): void {
		this.listData = new MatTableDataSource([]);
		this.viewsActions = this.pvas.get();
		console.log(this.viewsActions);
		this.searchForm();
		this.getMultitabla();
	}

	getMultitabla(){
		this.listData = new MatTableDataSource([]);
		this.searchBan = false;
		this.load_data = false;
		this.no_data = true;
		console.log('suscripcion')
		this.multitabla_s.GetMultitablas().subscribe(
			(data:any) => {
				console.log("listado: ",data)
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

	searchForm() {
		this.searchGroup = this.fb.group({
			searchTerm: [''],
		});    
	}

	create(item) {
		this.router.navigate(['Security/masters/Multitabla/add']);
	}

	edit(item) {
		this.router.navigate(['Security/masters/Multitabla/edit'], {
      queryParams: {
        id: item
      }
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
		const modalRef = this.modalService.open(DeleteEsquemaComisionComponent);
		modalRef.componentInstance.id = id;
		modalRef.result.then((result) => {
			console.log(result)
		}, (reason) => {
		console.log(reason);
		}); 
	}
}
