import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';

import { UpdatePasswordComponent } from '../_shared/update-password/update-password.component';
import { DashboardComercialService } from '../_core/dashboard-comercial.service';

import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { FiltrosTemporalesComponent } from '../_shared/filtros-temporales/filtros-temporales.component';
import { ProveedorService } from '../../Logistica/_core/services/proveedor.service';
import { finalize } from 'rxjs/operators';
import { DashboardComprasService } from '../_core/dashboard-compras.service';

import { SubcategoriaService } from '../../Logistica/_core/services/subcategoria.service';

import { MaterialService } from '../../Logistica/_core/services/material.service';
import * as Highcharts from 'highcharts';
import { CustomersService } from 'src/app/modules/e-commerce/_services';

@Component({
	selector: 'app-dashboard-compras',
	templateUrl: './dashboard-compras.component.html',
	styleUrls: ['./dashboard-compras.component.scss']
})
export class DashboardComprasComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild('graficoComprasPorFecha') graficoComprasPorFecha: any;
	actualizargraficoComprasPorFecha: Subject<void> = new Subject<void>();

	@ViewChild('graficoCompras') graficoCompras: any;
	actualizarGraficoCompras: Subject<void> = new Subject<void>();

	public tituloGrafico1: string = 'Compras por Mes';
	public tituloGrafico2: string = 'Compras';

	constructor(
		private cd: ChangeDetectorRef,
		private modalService: NgbModal,
		public s_dashboard: DashboardComercialService,
		public dashboardCompras_s: DashboardComprasService,
		public proveedor_s: ProveedorService,
		public material_s: MaterialService,
		public subcategoria_s: SubcategoriaService,
		public fb: FormBuilder,
		private customersService: CustomersService
	) { }
	ngAfterViewInit(): void {
		this.getReporteBarComprasByCategoriaBySubByClase(0, 0, 0, 1);
	}

	// public formFiltroGraficoRotacion: FormGroup
	// public formFiltroGraficoFidelizacion: FormGroup

	public formFiltroReporteComprasPorFecha: FormGroup; // Para los filtros categoria proveedor y proveedor
	@ViewChild('filtrosTiempoReporteComprasPorFecha') filtrosTiempoReporteComprasPorFecha: FiltrosTemporalesComponent;

	public formFiltroReporteComprasPorCategoriaSubClase: FormGroup; // Para los filtros por Categoria, Subcategoria y Clase de Material
	@ViewChild('filtroReporteComprasPorCategoriaSubClase') filtroReporteComprasPorCategoriaSubClase: FiltrosTemporalesComponent;

	public formFiltroReporteComprasPorProveedor: FormGroup;
	@ViewChild('filtroReporteComprasPorProveedor') filtroReporteComprasPorProveedor: FiltrosTemporalesComponent;

	public topProveedores$ = new Observable<any>();

	public isLoading = new BehaviorSubject<Boolean>(false);
	isLoading$ = this.isLoading.asObservable();
	subscriptions: Subscription[] = [];


	arrayMeses = [
		{
			value: 1,
			name: "Enero"
		}, {
			value: 2,
			name: "Febrero"
		}, {
			value: 3,
			name: "Marzo"
		}, {
			value: 4,
			name: "Abril"
		}, {
			value: 5,
			name: "Mayo"
		}, {
			value: 6,
			name: "Junio"
		}, {
			value: 7,
			name: "Julio"
		}, {
			value: 8,
			name: "Agosto"
		}, {
			value: 9,
			name: "Setiembre"
		}, {
			value: 10,
			name: "Octubre"
		}, {
			value: 11,
			name: "Noviembre"
		}, {
			value: 12,
			name: "Diciembre"
		},
	]

	array_topProveedores = [
		{
			value: 1,
			name: "Top 5 Proveedores"
		},
		{
			value: 2,
			name: "Top 10 Proveedores"
		},
		{
			value: 3,
			name: "Top 15 Proveedores"
		}
	];

	array_categoriasProveedor: any;
	array_categoriasProveedor2: any;
	array_proveedores: any;

	array_DataTopProveedores: any;

	array_categorias: any;
	array_subcategorias: any;
	array_clases: any;



	ngOnInit(): void {
		this.initFormReporteComprasPorFecha();
		this.initFormReporteComprasPorCategoriaSubClase();
		this.initFormReporteComprasPorProveedor();
		this.getCategoriasProveedor();/**Invocara tambien a getProveedores para reporte por Fechas */
		// this.validarPassword();
		this.getCategorias();
		this.isLoading$ = this.customersService.isLoading$;
	}


	initFormReporteComprasPorFecha() {
		this.formFiltroReporteComprasPorFecha = this.fb.group({
			CategoriaProveedor: [null],
			Proveedor: [null]
		});
	}

	//made reactive radio form checked

	radioCatSubClass: string = '1'


	// radioSubcategoria: FormControl = new FormControl('2');
	// radioClase: FormControl = new FormControl('3');

	initFormReporteComprasPorCategoriaSubClase() {
		this.formFiltroReporteComprasPorCategoriaSubClase = this.fb.group({
			Categoria: [0],
			Subcategoria: [0],
			Clase: [0]
		});

		this.disableRadioSubClass();
	}

	initFormReporteComprasPorProveedor() {
		this.formFiltroReporteComprasPorProveedor = this.fb.group({
			CategoriaProveedor: [null],
			Tipo: [1],
			/**Top formGroupName */
			Top: [1],

		});
	}

	disableRadioSubClass() {
		console.log('disableRadioSubClass');

		const crtlSubcategoria = this.formFiltroReporteComprasPorCategoriaSubClase.get('Subcategoria');
		const crtlClase = this.formFiltroReporteComprasPorCategoriaSubClase.get('Clase');

		if (this.radioCatSubClass == '1') {
			crtlSubcategoria.disable();
			this.formFiltroReporteComprasPorCategoriaSubClase.controls.Subcategoria.setValue(0);
		} else {
			crtlSubcategoria.enable();
		}
		if (this.radioCatSubClass == '1' || this.radioCatSubClass == '2') {
			crtlClase.disable();
			this.formFiltroReporteComprasPorCategoriaSubClase.controls.Clase.setValue(0);
		} else {
			crtlClase.enable();
		}
	}

	getCategoriasProveedor() {
		let defaultIndex = 0


		this.proveedor_s.GetListarCategoriaProveedores().pipe(
			finalize(
				() => this.getProveedores(this.formFiltroReporteComprasPorFecha.controls.CategoriaProveedor.value)
			)
		)
			.subscribe(
				(data: any) => {
					this.array_categoriasProveedor = data;
					this.array_categoriasProveedor.unshift({
						Activo: true,
						codigo: "ALL",
						desActivo: "SÍ",
						descripcion: "Todos",
						idCategoriaProveedor: 0,
						nombre: "Todos"
					});
					if (this.array_categoriasProveedor.length > 1) {
						defaultIndex = data[0].idCategoriaProveedor;
						this.formFiltroReporteComprasPorFecha.controls.CategoriaProveedor.setValue(defaultIndex);
						this.formFiltroReporteComprasPorProveedor.controls.CategoriaProveedor.setValue(defaultIndex);
						// this.getReporteLinealComprasPorFecha(defaultIndex);
						this.getReporteComprasByProveedor(1, defaultIndex);
					}
				}, (errorServicio) => { console.log(errorServicio) }
			);

	}

	getProveedores(idCategoriaProveedor) {

		let defaultIndex = 0
		this.proveedor_s.GetProveedores(idCategoriaProveedor, 0, 0, 0, 0).subscribe(
			(data: any) => {

				this.array_proveedores = data;
				this.array_proveedores.unshift({
					TelefonoContacto: null,
					activo: true,
					codigo: "PV-0000",
					desActivo: "",
					direccion: "",
					documentoIdentidad: "",
					email: "",
					idCategoriaProveedor: 0,
					idDepartamento: null,
					idDistrito: null,
					idPais: 0,
					idProveedor: 0,
					idProvincia: null,
					idTipoDocumentoIdentidad: "",
					nombreCategoriaProveedor: "",
					nombreComercial: "",
					nombreContacto: null,
					nombreDepartamento: null,
					nombreDistrito: null,
					nombrePais: "",
					nombreProvincia: null,
					nombreTipoDocumentoIdentidad: "",
					razonSocial: "Todos",
					telefono1: "",
					telefono2: ""
				});
				if (this.array_proveedores.length > 1) {
					defaultIndex = data[0].idProveedor;
					this.formFiltroReporteComprasPorFecha.controls.Proveedor.setValue(defaultIndex);
					this.getReporteLinealComprasPorFecha(idCategoriaProveedor, defaultIndex);
				}
			}
		)
	}


	getCategorias() {
		this.material_s.GetCategorias()
			.pipe(
				finalize(
					() => this.getSubcategorias(this.formFiltroReporteComprasPorCategoriaSubClase.controls.Categoria.value)
				)
			)
			.subscribe(
				(data: any) => {
					this.array_categorias = data;

					this.array_categorias.unshift({
						Categoria: 0, NombreCategoria: 'Todos'
					});

					// if (PosibleValor !== null) {
					// 	this.formFiltroReporteComprasPorCategoriaSubClase.controls.Categoria.setValue(PosibleValor);
					// }
				}, (errorServicio) => {
					console.log(errorServicio);
				}
			);
	}

	getSubcategorias(PosibleValor) {
		this.subcategoria_s.GetSubcategoria(PosibleValor)
			.pipe(
				finalize(
					() => this.getClases(this.formFiltroReporteComprasPorCategoriaSubClase.controls.Subcategoria.value)
				)
			)
			.subscribe(
				(data: any) => {
					this.array_subcategorias = data;

					this.array_subcategorias.unshift({
						idSubcategoria: 0, nombreSubcategoria: 'Todos'
					});


					if (PosibleValor !== null) {
						this.formFiltroReporteComprasPorCategoriaSubClase.controls.Subcategoria.setValue(PosibleValor);
					}
				}
			);
	}

	getClases(PosibleValor) {
		this.material_s.GetClases(PosibleValor)
			.subscribe(
				(data: any) => {
					this.array_clases = data;
					console.log("data", data);
					this.array_clases.unshift({
						Clase: 0,
						Subcategoria: 0,
						Categoria: 0,
						NombreClase: 'Todos',
					});

					if (PosibleValor !== null) {
						this.formFiltroReporteComprasPorCategoriaSubClase.controls.Clase.setValue(this.array_clases[0].Clase);
					}
				}
			);
	}

	getReporteLinealComprasPorFecha(idCategoriaProveedor, idProveedor, filtros: any = null) {
		if (!filtros) {
			filtros = this.filtrosTiempoReporteComprasPorFecha.filtros
		}
		let anio = filtros.Anio

		this.dashboardCompras_s.GetReporteComprasByFecha(idCategoriaProveedor, idProveedor
			, anio).subscribe(
				(data: any) => {
					console.log("dataReporteComprasByFECHA", data);
					
					let dataReporteCompras = {
						mes: "",
						montoTotal: 0
					};

					let arrayData = new Array<typeof dataReporteCompras>()

					this.arrayMeses.forEach(element => {
						let dataReporteCompras = {
							mes: element.name,
							montoTotal: 0
						};
						arrayData.push(dataReporteCompras)
					}
					);

					arrayData = arrayData.map(element => {
						data.forEach(dataElement => {
							if (this.arrayMeses[dataElement.mes - 1].name === element.mes) {
								element.montoTotal = dataElement.montoTotal
							}
						});
						return element;
					})
					this.graficoComprasPorFecha.opcionesGrafico.credits = {
						enabled: false
					}

					this.graficoComprasPorFecha.opcionesGrafico.xAxis.categories = arrayData.map(element => element.mes);
					this.graficoComprasPorFecha.opcionesGrafico.yAxis.labels.format = '{text}'
					this.graficoComprasPorFecha.opcionesGrafico.series = [{
						name: 'Compras',
						data: arrayData.map(e => e.montoTotal),
					}];
					this.graficoComprasPorFecha.opcionesGrafico.plotOptions = {
						line: {
							dataLabels: {
								enabled: true,
								format: 'S/.{y}'
							},
							// enableMouseTracking: false
						}
					}
					this.actualizargraficoComprasPorFecha.next()
				}, (errorServicio) => {
					console.log(errorServicio);
				}
			);
	}




	getReporteBarComprasByCategoriaBySubByClase(idCategoria, idSubcategoria, idClase, tipo, filtros: any = null) {
		if (!filtros) {
			filtros = this.filtroReporteComprasPorCategoriaSubClase.filtros
		}
		let tipoFecha = filtros.Tipo
		let anio = filtros.Anio
		let mes = filtros.Mes
		let semana = filtros.Semana
		let desde = filtros.Inicio
		let hasta = filtros.Fin
		// tipo = this.radioCatSubClass;

		// if(tipo === '1'){//categoria

		// }

		this.dashboardCompras_s.GetReporteComprasByCategoriaBySubByClase(
			tipoFecha, tipo, anio, mes, semana, desde, hasta, idCategoria, idSubcategoria, idClase
		).subscribe(
			(data: any) => {

				console.log("data", data);
				let opcionesGraficoName = ''

				if (this.radioCatSubClass == '1') {//categoria
					opcionesGraficoName = 'Categoria'
				} else if (this.radioCatSubClass == '2') {//subcategoria
					opcionesGraficoName = 'Subcategoria'
				} else if (this.radioCatSubClass == '3') {//clase
					opcionesGraficoName = 'Clase'
				}


				this.graficoCompras.opcionesGrafico.xAxis.categories = data.map(e => e[opcionesGraficoName])
				this.graficoCompras.opcionesGrafico.xAxis.labels = {
					overflow: 'justify',
				}
				// this.graficoCompras.opcionesGrafico.yAxis.labels.format = '{text}'

				var SI_SYMBOL = ["", "K", "M", "G", "T", "P", "E"]

				this.graficoCompras.opcionesGrafico.series = [{
					name: opcionesGraficoName,
					data: data.map(e => e.montoTotal),
				}];

				this.graficoCompras.opcionesGrafico.tooltip = {
					pointFormat: `<b>{point.y} ${opcionesGraficoName}</b>`
				}
				this.graficoCompras.opcionesGrafico.plotOptions = {
					bar: {
						cursor: 'pointer',
						dataLabels: {
							enabled: true,
							format: '{y}',
							// formatter: function () {
							// 	// console.log("this.y", this.y);

							// 	this.y = parseFloat(this.y)

							// 	if (this.y > 1000000) {
							// 		console.log("entro");

							// 		console.log("this.y", this.y);

							// 		return Highcharts.numberFormat(this.y / 1000000, 3) + 'M'
							// 	} else if (this.y > 1000) {
							// 		console.log("entro");

							// 		console.log("this.y", this.y);
							// 		return Highcharts.numberFormat(this.y / 1000, 3) + 'K'
							// 	} else {
							// 		return this.y;
							// 	}
							// }

						},

						// enableMouseTracking: false
					}
				}
				this.graficoCompras.opcionesGrafico.yAxis = {
					tickInterval: 10000
				}
				this.actualizarGraficoCompras.next();
				this.cd.markForCheck();

			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}

	getReporteComprasByProveedor(tipo, idCategoriaProveedor, filtros: any = null) {
		console.log("GetReporteComprasByProveedor");
		console.log("tipo", tipo);
		console.log("idCategoriaProveedor", idCategoriaProveedor);


		if (!filtros) {
			filtros = this.filtroReporteComprasPorProveedor.filtros
		}
		let tipoFecha = filtros.Tipo
		let anio = filtros.Anio
		let mes = filtros.Mes
		let semana = filtros.Semana
		let desde = filtros.Inicio
		let hasta = filtros.Fin

		this.dashboardCompras_s.GetReporteComprasByProveedor(tipo, tipoFecha, idCategoriaProveedor
			, anio, mes, semana, desde, hasta).pipe(
				finalize(() => {
					this.cd.markForCheck();
				}
				))
			.subscribe(
				(data: any) => {
					console.log("data", data);
					this.array_DataTopProveedores = data;
				}
			)

	}


	// validarPassword() {
	// 	this.s_dashboard.ObtenerTipoClave().subscribe(
	// 		(data: any) => {
	// 			if (data[0].TIpoClave !== 'U') {
	// 				this.mostrarModalPass();
	// 			}
	// 			console.log(data);
	// 		}, (errorServicio) => {
	// 			console.log(errorServicio);
	// 		}
	// 	);
	// }

	// mostrarModalPass() {
	// 	const modalRef = this.modalService.open(UpdatePasswordComponent, { size: 'ms', keyboard: false, backdrop: 'static' });
	// 	modalRef.result.then((result) => {
	// 		console.log('object');
	// 	}, (reason) => {
	// 		console.log(reason);
	// 	});
	// }

	ngOnDestroy(): void {
		// this.subscriptions.forEach(sb => sb.unsubscribe());
	}

}
