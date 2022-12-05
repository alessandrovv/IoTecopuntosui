import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { EstablecimientoService } from 'src/app/pages/Logistica/_core/services/establecimiento.service';
import { MaterialService } from 'src/app/pages/Logistica/_core/services/material.service';
import { PermissionViewActionService } from 'src/app/Shared/services/permission-view-action.service';
import { PedidoVentaService } from '../../../_core/pedido-venta.service';
import { StockEcommerceService } from '../../../_core/stock-ecommerce.service';


@Component({
	selector: 'app-save-update-stock',
	templateUrl: './save-update-stock.component.html',
	styleUrls: ['./save-update-stock.component.scss']
})
export class SaveUpdateStockComponent implements OnInit {

	filterGroup: FormGroup;

	constructor(
		private modalService: NgbModal,
		private fb: FormBuilder,
		public toastr: ToastrManager,
		private chgRef: ChangeDetectorRef,
		private router: Router,
		public pvas: PermissionViewActionService,
		private route: ActivatedRoute,
		private datePipe: DatePipe,
		public stock_ecommerce_s: StockEcommerceService,
		public pedido_venta_s: PedidoVentaService,
		public material_s: MaterialService,
		public establecimiento_s: EstablecimientoService,
		private formBuilder: FormBuilder,
	) { }

	array_establecimiento: any = [];

	idEstablecimiento_actual: any;
	idStockEcommerce: any;
	flag: any;
	igv: any;
	array_unidadesMedida: any = [];


	hide_save: Boolean = false;
	hide_load: Boolean = true;

	array_material: any = [];


	array_stockDetalle: any = [];
	array_stockDetalle_Eliminado: any = [];

	public date: Date;
	deta_formMaterial: FormControl[] = [];
	deta_formStock: FormControl[] = [];
	deta_formVendido: FormControl[] = [];
	deta_formStockActual: FormControl[] = [];


	formEstablecimiento: FormControl;


	private subscriptions: Subscription[] = [];
	validViewAction = this.pvas.validViewAction;
	viewsActions: Array<Navigation> = [];


	ngOnInit(): void {
		this.date = new Date();
		this.getIgv();
		this.getComboMaterial();
		this.getComboEstablecimiento();
		this.getListarUnidadesMedida();

		this.formEstablecimiento = new FormControl(null, Validators.compose([
			Validators.required
		]),)

		this.idStockEcommerce = this.route.snapshot.queryParams
		['id'] || 0;

		if (this.idStockEcommerce > 0) {
			this.flag = this.route.snapshot.queryParams
			['copy'];
			this.getDatosStockEcommerce(this.idStockEcommerce, this.flag);
		}
	}



	getIgv() {
		let date = new Date();
		let anio = date.getFullYear();
		this.pedido_venta_s.GetIgv(anio).subscribe(
			(data: any) => {
				if (data.length > 0) {
					this.igv = data[0].porcentaje;
				} else {
					this.toastr.warningToastr(
						"No se ha ingresado el IGV del periodo actual",
						"Advertencia!",
						{
							toastTimeout: 2000,
							showCloseButton: true,
							animate: "fade",
							progressBar: true,
						}
					);
				}
			},
			(error) => {
				console.log(error);
			}
		);
	}

	getComboEstablecimiento() {
		let defaultIndex = 0
		this.stock_ecommerce_s.GetComboEstablecimientos().subscribe(
			(data: any) => {
				this.array_establecimiento = data;
				// this.array_establecimiento.unshift({
				// 	idEstablecimiento: 0, nombreEstablecimiento: 'Todos'
				// });
				this.chgRef.markForCheck();
			}
		)
	}

	getListarUnidadesMedida() {
		this.material_s.GetUnidadesMedida().subscribe(
			(data: any) => {

				this.array_unidadesMedida = data;
				this.chgRef.markForCheck();
			}
		)
	}




	getComboMaterial() {
		this.stock_ecommerce_s.GetComboMaterialesAplicaVenta().subscribe(
			(data: any) => {
				this.array_material = data;
				this.chgRef.markForCheck();
			}
		)
	}

	validateIfExits(idMaterial, currentIndex) {
		let contador = 0;
		for (let i = 0; i < this.deta_formMaterial.length; i++) {
			if (this.deta_formMaterial[i].value == idMaterial) {
				contador++;
			}
		}



		if (contador > 1) {

			this.toastr.warningToastr('Ya existe el tipo de material.', 'Advertencia!', {
				toastTimeout: 2000,
				showCloseButton: true,
				animate: 'fade',
				progressBar: true
			});
			this.deta_formMaterial[currentIndex].setValue(null);
			return;
		}

	}

	addDetalle() {

		// this.validateIfChange(this.idEstablecimiento_actual);

		let element: HTMLElement = document.getElementById('btn-cerrar') as HTMLElement;
		if (element) {
			element.setAttribute('disabled', 'disabled');
		}
		this.array_stockDetalle.push({
			idStockEcommerceDetalle: 0,
			idMaterial: 0,
			stockInicial: 0.0,

		})
		this.deta_formMaterial.push(new FormControl(null, [Validators.required]));
		this.deta_formStock.push(new FormControl(0, Validators.compose([
			Validators.required,
			Validators.pattern(/^[0-9]\d*$/),
		])));
		this.deta_formVendido.push(new FormControl(0, [Validators.required]));
		this.deta_formStockActual.push(new FormControl(0, [Validators.required]));


		this.chgRef.markForCheck();
	}

	calcularStockActual(stockInicial, stockVendido, index) {
		if (stockInicial != '') {
			if (stockInicial >= stockVendido) {
				this.deta_formStock[index].setErrors(null);
				this.deta_formStockActual[index].setValue(stockInicial - stockVendido);
				return;
			}
			this.deta_formStock[index].setErrors({ 'incorrect': true, 'required': false })
		}
	}

	// current: any = ''
	// validarStockInicial(event): boolean {
	// 	if (this.current.length < 2) {
	// 		this.current = this.current + event.key; // '1' '12'
	// 	}
	// 	if (event.keyCode == 8) {
	// 		this.current = '';
	// 	}
	// 	console.log(this.current);
	// 	return false;
	// }

	//#region Decrease e increase stock Adicional
	decrease(item) {

		let index = this.array_stockDetalle.indexOf(item);
		let current = this.deta_formStock[index].value * 1;
		if (current > 0 && current > this.deta_formVendido[index].value * 1) {
			current = current - 1
			this.deta_formStock[index].setValue(current);
			this.calcularStockActual(current, this.deta_formVendido[index].value, index);
		}
	}


	increase(item) {

		let index = this.array_stockDetalle.indexOf(item);
		let current = this.deta_formStock[index].value * 1;
		current = current + 1
		this.deta_formStock[index].setValue(current);
		this.calcularStockActual(current, this.deta_formVendido[index].value, index);
	}
	//#endregion

	disableBtnCerrarIf(element, idEstablecimiento = null) {

		for (let i = 0; i < this.array_stockDetalle.length; i++) {
			if (this.deta_formStock[i].value == 0 || this.array_stockDetalle_Eliminado.length > 0) {
				element.setAttribute('disabled', 'disabled');
				return;
			}
		}
		element.removeAttribute('disabled');

	}

	validateIfChange(idEstablecimiento) {


		if (this.idEstablecimiento_actual != idEstablecimiento) {


			let element: HTMLElement = document.getElementById('btn-cerrar') as HTMLElement;
			if (element) {
				element.setAttribute('disabled', 'disabled');
				return;
			}
		} else {
			let element: HTMLElement = document.getElementById('btn-cerrar') as HTMLElement;
			// element.removeAttribute('disabled');
			this.disableBtnCerrarIf(element);
		}
	}


	deleteDetalle(item) {
		let index = this.array_stockDetalle.indexOf(item);

		if (this.array_stockDetalle[index].idStockEcommerceDetalle > 0) {
			this.array_stockDetalle_Eliminado.push(item);
		}
		this.array_stockDetalle.splice(index, 1);

		//Limpiar tambien los controles
		this.deta_formMaterial.splice(index, 1);
		this.deta_formStock.splice(index, 1);
		this.deta_formVendido.splice(index, 1);
		this.deta_formStockActual.splice(index, 1);



		let element: HTMLElement = document.getElementById('btn-cerrar') as HTMLElement;
		if (element) {
			this.disableBtnCerrarIf(element);
		}


		this.validateIfChange(this.formEstablecimiento.value);
	}

	getDatosStockEcommerce(idStockEcommerce, flag = 0) {

		if (flag == 1) { //Copiar
			this.stock_ecommerce_s.GetDetalleStockEcommerce(idStockEcommerce)
				.subscribe(
					(data: any) => {
						let dataCabecera = data[0]
						this.array_stockDetalle = data[1];
						//Se mantiene la fecha actual
						//Mapeamos cada elemento del arreglo array_stockDetalle para poblar con idDetalleStockEcommerce = 0
						this.idStockEcommerce = 0;

						this.array_stockDetalle = this.array_stockDetalle.map(
							e => {
								e.idStockEcommerceDetalle = 0;
								// e.idMaterial = e.idMaterial;
								e.vendido = 0;
								e.stockActual = 0;
								return e;
							}
						)
						this.formEstablecimiento.setValue(dataCabecera[0].idEstablecimiento)
						this.llenarDetalleStockEcommerce(this.array_stockDetalle);
						this.chgRef.markForCheck();
					}
				)
		} else {
			this.stock_ecommerce_s.GetDetalleStockEcommerce(idStockEcommerce)
				.subscribe(
					(data: any) => {
						let dataCabecera = data[0]
						//Se actualiza la fecha a la fecha registrada
						this.date = dataCabecera[0].fecha
						this.array_stockDetalle = data[1];

						this.idEstablecimiento_actual = dataCabecera[0].idEstablecimiento
						this.formEstablecimiento.setValue(this.idEstablecimiento_actual)


						this.llenarDetalleStockEcommerce(this.array_stockDetalle);
						this.chgRef.markForCheck();
					}
				)
		}
	}

	llenarDetalleStockEcommerce(Detalle) {
		for (let i = 0; i < Detalle.length; i++) {
			this.deta_formMaterial.push(
				new FormControl(Detalle[i].idMaterial
					, [Validators.required]));
			this.deta_formStock.push(
				new FormControl(Detalle[i].stockInicial
					, Validators.compose([
						Validators.required,
						Validators.pattern(/^[0-9]\d*$/),
					])));
			this.deta_formVendido.push(
				new FormControl(Detalle[i].vendido || 0
					, [Validators.required]));
			this.deta_formStockActual.push(
				new FormControl(Detalle[i].stockActual || 0
					, [Validators.required]));
		}
	}


	saveUpdateStock() {
		this.hide_save = true;
		this.hide_load = false;

		for (let i = 0; i < this.array_stockDetalle.length; i++) {
			if (this.deta_formMaterial[i].status === 'INVALID') {
				this.hide_save = false;
				this.hide_load = true;
				this.toastr.warningToastr('Seleccione un Tipo - Material, es obligatorio.', 'Advertencia!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				return;
			}

			if (this.deta_formStock[i].status === 'INVALID') {
				this.hide_save = false;
				this.hide_load = true;
				this.toastr.warningToastr('Stock incial, es obligatorio.', 'Advertencia!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				return;
			}

			if (this.deta_formVendido[i].status === 'INVALID') {
				this.hide_save = false;
				this.hide_load = true;
				this.toastr.warningToastr('Stock vendido, es obligatorio.', 'Advertencia!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				return;
			}



			if (this.deta_formStockActual[i].status === 'INVALID') {
				this.hide_save = false;
				this.hide_load = true;
				this.toastr.warningToastr('Stock actual - mantenimiento, es obligatorio.', 'Advertencia!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				return;
			}

			if (this.deta_formStock[i].value < this.deta_formVendido[i].value) {
				this.hide_save = false;
				this.hide_load = true;
				this.toastr.warningToastr('El Stock inicial no debe ser inferior al stock vendido.', 'Advertencia!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				return;
			}
		}

		let datos = this.prepare_model();

		console.log("datos prepare_model", datos);
		this.hide_save = false;
		this.hide_load = true;

		this.stock_ecommerce_s.SaveUpdateDetalleStockEcommerce(datos)
			.subscribe(
				(data: any) => {
					if (data[0].Ok > 0) {
						this.hide_save = false;
						this.hide_load = true;
						this.chgRef.markForCheck();
						this.toastr.successToastr(data[0].Message, 'Correcto!', {
							toastTimeout: 2000,
							showCloseButton: true,
							animate: 'fade',
							progressBar: true
						});
						this.router.navigate(['Sales/process/stockEcommerce']);
					} else {


						this.hide_save = false;
						this.hide_load = true;
						// this.chgRef.markForCheck();
						this.toastr.errorToastr(data[0].Message, 'Error!', {
							toastTimeout: 2000,
							showCloseButton: true,
							animate: 'fade',
							progressBar: true
						});
					}

				}, (errorServicio) => {
					this.hide_save = false;
					this.hide_load = true;
					this.toastr.errorToastr('Ocurrio un error.', 'Error!', {
						toastTimeout: 2000,
						showCloseButton: true,
						animate: 'fade',
						progressBar: true
					});
					console.log(errorServicio);
				}
			)


	}

	prepare_model() {

		let datoStockEcommerceDetalle = [];

		for (let i = 0; i < this.array_stockDetalle.length; i++) {
			datoStockEcommerceDetalle.push({
				idStockEcommerceDetalle: this.array_stockDetalle[i].idStockEcommerceDetalle,
				idMaterial: this.deta_formMaterial[i].value,
				stockInicial: this.deta_formStock[i].value * 1,
				eliminado: 0
			})
		}

		for (let i = 0; i < this.array_stockDetalle_Eliminado.length; i++) {
			datoStockEcommerceDetalle.push({
				idStockEcommerceDetalle: this.array_stockDetalle_Eliminado[i].idStockEcommerceDetalle,
				idMaterial: this.deta_formMaterial[i].value,
				stockInicial: this.deta_formStock[i].value,
				eliminado: 1
			})
		}

		return {
			idStockEcommerce: this.idStockEcommerce,
			idEstado: '0001',
			idEstablecimiento: this.formEstablecimiento.value,
			stockDetalleEcommerce: datoStockEcommerceDetalle
		}

	}

	saveUpdateNotaEntrada() {
		let datos = this.prepare_model_nota_entrada();



		this.stock_ecommerce_s.SaveUpdateNotaAlmacen(datos).subscribe(
			(data: any) => {
				if (data[0].Ok > 0) {
					this.hide_save = false;
					this.hide_load = true;
					this.chgRef.markForCheck();
					this.toastr.infoToastr(data[0].Message, 'Correcto!', {
						toastTimeout: 3500,
						showCloseButton: true,
						animate: 'fade',
						progressBar: true
					});
					this.router.navigate(['Sales/process/stockEcommerce']);
				} else {


					this.hide_save = false;
					this.hide_load = true;
					this.chgRef.markForCheck();
					this.toastr.errorToastr(data[0].Message, 'Error!', {
						toastTimeout: 2000,
						showCloseButton: true,
						animate: 'fade',
						progressBar: true
					});
				}

			}, (errorServicio) => {
				this.hide_save = false;
				this.hide_load = true;
				this.toastr.errorToastr('Ocurrio un error.', 'Error!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				console.log(errorServicio);
			}
		)
	}

	prepare_model_nota_entrada() {
		let datos_generales = [];
		let datos_detalle = [];

		datos_generales.push({
			idNotaAlmacen: 0,
			fechaEmision: this.datePipe.transform(
				this.date,
				"yyyy-MM-dd"
			),
			fechaContable: this.datePipe.transform(
				this.date,
				"yyyy-MM-dd"
			),
			idTipoNota: 'E',
			idTipoOperacion: '19',
			igvPorcentaje: this.igv,
		});




		for (let i = 0; i < this.array_stockDetalle.length; i++) {

			if (this.deta_formVendido[i].value != 0) {
				datos_detalle.push({
					idNotaAlmacen: 0,
					idMaterial: this.deta_formMaterial[i].value,
					nombreMaterial: this.array_material.find(
						e => e.idMaterial == this.array_material[i].idMaterial
					).nombre,
					idPresentacion: null,
					nombrePresentacion: null,
					cantidad: this.deta_formVendido[i].value,
					idUnidadMedida: this.array_stockDetalle[i].idUnidadMedida,
					unidadMedida: this.array_unidadesMedida.find(
						e => e.UnidadMedida == this.array_stockDetalle[i].idUnidadMedida
					).NombreUnidadMedida,
					observacion: '',
					activo: 1,
					eliminado: 0
				})
			}
		}

		return {
			stockEcommerceDatos: datos_generales,
			stockEcommerceDetalle: datos_detalle,
		}
	}


	saveUpdateNotaSalida() {
		let datos = this.prepare_model_nota_salida();



		this.stock_ecommerce_s.SaveUpdateNotaAlmacen(datos).subscribe(
			(data: any) => {
				if (data[0].Ok > 0) {
					this.hide_save = false;
					this.hide_load = true;
					this.chgRef.markForCheck();
					this.toastr.infoToastr(data[0].Message, 'Correcto!', {
						toastTimeout: 4000,
						showCloseButton: true,
						animate: 'fade',
						progressBar: true
					});
					this.router.navigate(['Sales/process/stockEcommerce']);
				} else {


					this.hide_save = false;
					this.hide_load = true;
					this.chgRef.markForCheck();
					this.toastr.errorToastr(data[0].Message, 'Error!', {
						toastTimeout: 2000,
						showCloseButton: true,
						animate: 'fade',
						progressBar: true
					});
				}

			}, (errorServicio) => {
				this.hide_save = false;
				this.hide_load = true;
				this.toastr.errorToastr('Ocurrio un error.', 'Error!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				console.log(errorServicio);
			}
		)
	}

	prepare_model_nota_salida() {
		let datos_generales = [];
		let datos_detalle = [];

		datos_generales.push({
			idNotaAlmacen: 0,
			fechaEmision: this.datePipe.transform(
				this.date,
				"yyyy-MM-dd"
			),
			fechaContable: this.datePipe.transform(
				this.date,
				"yyyy-MM-dd"
			),
			idTipoNota: 'S',
			idTipoOperacion: '04',
			igvPorcentaje: this.igv,
		});

		for (let i = 0; i < this.array_stockDetalle.length; i++) {
			if (this.deta_formVendido[i].value != 0) {
				datos_detalle.push({
					idNotaAlmacen: 0,
					idMaterial: this.deta_formMaterial[i].value,
					nombreMaterial: this.array_material.find(
						e => e.idMaterial == this.array_material[i].idMaterial
					).nombre,
					idPresentacion: null,
					nombrePresentacion: null,
					cantidad: this.deta_formVendido[i].value,
					idUnidadMedida: this.array_stockDetalle[i].idUnidadMedida,
					unidadMedida: this.array_unidadesMedida.find(
						e => e.UnidadMedida == this.array_stockDetalle[i].idUnidadMedida
					).NombreUnidadMedida,
					observacion: '',
					activo: 1,
					eliminado: 0
				})
			}
		}

		return {
			stockEcommerceDatos: datos_generales,
			stockEcommerceDetalle: datos_detalle,
		}
	}


	cerrarStock() {


		for (let i = 0; i < this.array_stockDetalle.length; i++) {
			if (this.deta_formMaterial[i].status === 'INVALID') {
				this.hide_save = false;
				this.hide_load = true;
				this.toastr.warningToastr('Seleccione un Tipo - Material, es obligatorio.', 'Advertencia!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				return;
			}

			if (this.deta_formStock[i].status === 'INVALID') {
				this.hide_save = false;
				this.hide_load = true;
				this.toastr.warningToastr('Stock incial, es obligatorio.', 'Advertencia!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				return;
			}

			if (this.deta_formVendido[i].status === 'INVALID') {
				this.hide_save = false;
				this.hide_load = true;
				this.toastr.warningToastr('Stock vendido, es obligatorio.', 'Advertencia!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				return;
			}



			if (this.deta_formStockActual[i].status === 'INVALID') {
				this.hide_save = false;
				this.hide_load = true;
				this.toastr.warningToastr('Stock actual - mantenimiento, es obligatorio.', 'Advertencia!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				return;
			}

			if (this.deta_formStock[i].value < this.deta_formVendido[i].value) {
				this.hide_save = false;
				this.hide_load = true;
				this.toastr.warningToastr('El Stock inicial no debe ser inferior al stock vendido.', 'Advertencia!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				return;
			}
		}

		this.stock_ecommerce_s.UpdateStockEcommerce(this.idStockEcommerce)
			.pipe(
				finalize(
					//crear nota de entrada y nota de salida
					() => {
						this.saveUpdateNotaEntrada();
						this.saveUpdateNotaSalida();
					}

				)
			)
			.subscribe(
				(data: any) => {
					if (data[0].Ok > 0) {
						this.hide_save = false;
						this.hide_load = true;
						this.chgRef.markForCheck();
						this.toastr.successToastr(data[0].Message, 'Correcto!', {
							toastTimeout: 3000,
							showCloseButton: true,
							animate: 'fade',
							progressBar: true
						});
						this.router.navigate(['Sales/process/stockEcommerce']);
					} else {


						this.hide_save = false;
						this.hide_load = true;
						this.chgRef.markForCheck();
						this.toastr.errorToastr(data[0].Message, 'Error!', {
							toastTimeout: 2000,
							showCloseButton: true,
							animate: 'fade',
							progressBar: true
						});
					}

				}, (errorServicio) => {
					this.hide_save = false;
					this.hide_load = true;
					this.toastr.errorToastr('Ocurrio un error.', 'Error!', {
						toastTimeout: 2000,
						showCloseButton: true,
						animate: 'fade',
						progressBar: true
					});
					console.log(errorServicio);
				}
			)
	}

	// validarStock(item): number {
	// 	let index = this.array_stockDetalle.indexOf(item);
	// 	return this.deta_formStock[index].value - this.deta_formVendido[index].value;
	// }

	numberOnly(event): boolean {
		const charCode = (event.which) ? event.which : event.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
		}
		return true;
	}

	isFormControlValid(formControl: FormControl): boolean {
		return formControl.valid && (formControl.dirty || formControl.touched);
	}

	isFormControlInvalid(formControl: FormControl): boolean {
		return (
			formControl.invalid &&
			(formControl.dirty || formControl.touched)
		);
	}

	FormControlHasError(validation, formControl: FormControl): boolean {
		return (
			formControl.hasError(validation) &&
			(formControl.dirty || formControl.touched)
		);
	}


}

