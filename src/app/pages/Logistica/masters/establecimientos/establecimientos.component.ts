import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TableResponseModel } from 'src/app/_metronic/shared/crud-table';
import { EstablecimientoService } from '../../_core/services/establecimiento.service';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionViewActionService } from 'src/app/Shared/services/permission-view-action.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { MultitablaService } from 'src/app/pages/_core/services/multitabla.service';
import { finalize } from 'rxjs/operators';
import { SaveUpdateEstablecimientoModalComponent } from './save-update-establecimiento-modal/save-update-establecimiento-modal.component';
import { DeleteEstablecimientoModalComponent } from 'src/app/pages/_shared/delete-establecimiento-modal/delete-establecimiento-modal.component';

@Component({
	selector: 'app-establecimientos',
	templateUrl: './establecimientos.component.html',
	styleUrls: ['./establecimientos.component.scss']
})
export class EstablecimientosComponent implements OnInit {

	load_data: boolean = true;
	no_data: boolean = false;
	searchBan: boolean = false;
	filterGroup: FormGroup;
	searchGroup: FormGroup;
	listData: MatTableDataSource<any>;

	displayedColumns: string[] = ['Nro', 'Actions', 'Activo', 'Nombre', 'TipoEstablecimiento', 'Ubicacion', 'Direccion' ];

	@ViewChild(MatSort) MatSort: MatSort;
	@ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

	private subscriptions: Subscription[] = [];
	validViewAction = this.pvas.validViewAction;
	viewsActions: Array<any> = [];
	array_data: TableResponseModel<any>;
	array_dataList: any;


	array_paises: any = [];
	array_departamentos: any = [];
	array_provincias: any = [];
	array_distritos: any = [];

	array_tiposEstablecimiento: any = [];

	constructor(
		private fb: FormBuilder,
		private modalService: NgbModal,
		private multitabla_s: MultitablaService,
		public establecimiento_s: EstablecimientoService,
		public pvas: PermissionViewActionService,
		public toastr: ToastrManager,
		private router: Router,
	) { }

	ngOnInit(): void {
		this.listData = new MatTableDataSource([]);
		this.viewsActions = this.pvas.get();
		this.filterForm();
		this.searchForm();
		this.getPaises();
		this.getEstablecimientos('0000', 0, 0, 0, 0);
		this.getTiposEstablecimiento();
	}

	getPaises() {
		this.multitabla_s.GetListarPaises().pipe(
			finalize(() => {
				this.getDepartamentos(this.filterGroup.controls.Pais.value);
			})
		).subscribe(
			(data: any) => {
				this.array_paises = data;
				this.array_paises.forEach(element => {
					if (element.NombrePais == "Perú") {
						this.filterGroup.controls.Pais.setValue(
							element.Pais
						);
						return;
					}
				})
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}

	getDepartamentos(idPais) {

		this.filterGroup.controls.Departamento.setValue(null);
		this.multitabla_s.GetListarDepartamentos(idPais).pipe(
			finalize(() => {
				if (this.filterGroup.controls.Pais.value === 1) {
					this.getProvincias(this.filterGroup.controls.Departamento.value);
				} else {
					console.log("No selecciono Perú");
					this.getProvincias(-1);
				}
			})
		).subscribe(
			(data: any) => {
				this.array_departamentos = data;
				this.array_departamentos.unshift({
					Departamento: 0, NombreDepartamento: 'Todos'
				});
				this.filterGroup.controls.Departamento.setValue(
					this.array_departamentos[0].Departamento
				);
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}

	getProvincias(idDepartamento) {
		this.filterGroup.controls.Provincia.setValue(null);
		if (idDepartamento != null) {
			this.multitabla_s.GetListarProvincia(idDepartamento).pipe(
				finalize(() => {
					if (this.filterGroup.controls.Pais.value === 1) {
						this.getDistritos(this.filterGroup.controls.Provincia.value);
					} else {
						console.log("No selecciono Perú");
						if (idDepartamento > 0) {
							this.getDistritos(this.filterGroup.controls.Provincia.value);
						} else {
							console.log("No selecciono Departamento");
							this.getDistritos(-1);
						}
					}
				})
			).subscribe(
				(data: any) => {
					this.array_provincias = data;
					this.array_provincias.unshift({
						Provincia: 0, NombreProvincia: 'Todos'
					});
					this.filterGroup.controls.Provincia.setValue(
						this.array_provincias[0].Provincia
					);
				}, (errorServicio) => {
					console.log(errorServicio);
				}
			);
		} else {
			this.array_provincias = [];
			this.filterGroup.controls.Distrito.setValue(null);
			this.getDistritos(null);
		}
	}

	getDistritos(idProvincia) {
		this.filterGroup.controls.Distrito.setValue(null);

		if (idProvincia != null) {
			this.multitabla_s.GetListarDistrito(idProvincia).pipe(
				finalize(() => {
				})
			).subscribe(
				(data: any) => {
					this.array_distritos = data;
					this.array_distritos.unshift({
						Distrito: 0, NombreDistrito: 'Todos'
					});
					this.filterGroup.controls.Distrito.setValue(
						this.array_distritos[0].Distrito
					);
				}, (errorServicio) => {
					console.log(errorServicio);
				}
			);
		} else {
			this.array_distritos = [];
		}

	}

	getEstablecimientos(idTipoEstablecimiento, idPais, idDepartamento, idProvincia, idDistrito) {
		this.listData = new MatTableDataSource([]);
		this.searchBan = false;
		this.load_data = false;
		this.no_data = true;
		this.establecimiento_s.getEstablecimientos(idTipoEstablecimiento, idPais
			, idDepartamento, idProvincia, idDistrito).subscribe(
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
					this.load_data = true;
					this.no_data = false;
					this.searchBan = false;
				}
			);
	}

	getTiposEstablecimiento() {
		this.establecimiento_s.getTiposEstablecimiento().subscribe(
			(data: any) => {
				this.array_tiposEstablecimiento = data;
				if (this.array_tiposEstablecimiento.length > 1) {
					this.array_tiposEstablecimiento.unshift({
						valorEstablecimiento: '0000', nombreTipoEstablecimiento: 'Todos'
					});
				}
				this.filterGroup.controls.TipoEstablecimiento.setValue(this.array_tiposEstablecimiento[0].valorEstablecimiento)
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}

	create(item) {
		const modalRef = this.modalService.open(SaveUpdateEstablecimientoModalComponent, { size: 'ms' });
		modalRef.componentInstance.item = item;
		modalRef.result.then((result) => {
			this.getEstablecimientos(
				this.filterGroup.controls.TipoEstablecimiento.value, this.filterGroup.controls.Pais.value, this.filterGroup.controls.Departamento.value, this.filterGroup.controls.Provincia.value, this.filterGroup.controls.Distrito.value);
		}, (reason) => {
			console.log(reason);
		});
	}

	edit(item) {
		const modalRef = this.modalService.open(SaveUpdateEstablecimientoModalComponent, { size: 'ms' });
		console.log(item);
		modalRef.componentInstance.item = item;
		modalRef.result.then((result) => {
			this.getEstablecimientos(
				this.filterGroup.controls.TipoEstablecimiento.value, this.filterGroup.controls.Pais.value, this.filterGroup.controls.Departamento.value, this.filterGroup.controls.Provincia.value, this.filterGroup.controls.Distrito.value);
		}, (reason) => {
			console.log(reason);
		});
	}

	delete(idEstablecimiento: number) {
		const modalRef = this.modalService.open(DeleteEstablecimientoModalComponent);
		modalRef.componentInstance.id = idEstablecimiento;
		modalRef.componentInstance.titulo = 'Eliminar Establecimiento';
		modalRef.componentInstance.descripcion = 'Esta seguro de eliminar el Establecimiento seleccionado?';
		modalRef.componentInstance.msgloading = 'Eliminando Establecimiento...';
		modalRef.componentInstance.service = () => {
			// return this.establecimiento_s.DeleteCliente(idCliente);
		};
		modalRef.result.then((result) => {
			this.getEstablecimientos(
				this.filterGroup.controls.TipoEstablecimiento.value, this.filterGroup.controls.Pais.value, this.filterGroup.controls.Departamento.value, this.filterGroup.controls.Provincia.value, this.filterGroup.controls.Distrito.value);
		}, (reason) => {
			console.log(reason);
		});
	}

	enableDisableEstablecimiento(item) {
		this.establecimiento_s.EnableDisableEstablecimiento(item.idEstablecimiento, !item.activo).subscribe(
			(data: any) => {
				if (data[0].Ok > 0) {
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

	filterForm() {
		this.filterGroup = this.fb.group({
			TipoEstablecimiento: [null],
			Pais: [null],
			Departamento: [null],
			Provincia: [null],
			Distrito: [null],
		});
	}
	searchForm() {
		this.searchGroup = this.fb.group({
			searchTerm: [''],
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

}
