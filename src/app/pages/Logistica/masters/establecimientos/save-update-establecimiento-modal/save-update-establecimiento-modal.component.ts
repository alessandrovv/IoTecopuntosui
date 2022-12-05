import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Subscription } from 'rxjs';
import { SubcategoriaService } from '../../../_core/services/subcategoria.service';
import { CustomersService } from 'src/app/modules/e-commerce/_services';
import { EstablecimientoService } from '../../../_core/services/establecimiento.service';
import { MultitablaService } from 'src/app/pages/_core/services/multitabla.service';
import { finalize } from 'rxjs/operators';

@Component({
	selector: 'app-save-update-establecimiento-modal',
	templateUrl: './save-update-establecimiento-modal.component.html',
	styleUrls: ['./save-update-establecimiento-modal.component.scss']
})
export class SaveUpdateEstablecimientoModalComponent implements OnInit {

	@Input() item: any;
	isLoading$;
	idEstablecimiento: number = 0;
	formGroup: FormGroup;
	// filterGroup: FormGroup;
	private subscriptions: Subscription[] = [];


	array_paises: any = [];
	array_departamentos: any = [];
	array_provincias: any = [];
	array_distritos: any = [];

	array_tiposEstablecimiento: any = [];


	constructor(
		private customersService: CustomersService,
		private fb: FormBuilder,
		public modal: NgbActiveModal,
		public establecimiento_s: EstablecimientoService,
		public multitabla_s: MultitablaService,
		public toastr: ToastrManager,
	) { }

	ngOnInit(): void {
		this.isLoading$ = this.customersService.isLoading$;
		this.loadEstablecimiento();
	}

	getTipoEstablecimiento(PosibleValor) {
		this.establecimiento_s.getTiposEstablecimiento().subscribe(
			(data: any) => {
				this.array_tiposEstablecimiento = data;
				if (PosibleValor !== null) {
					this.formGroup.controls.TipoEstablecimiento.setValue(PosibleValor);
				}
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}

	getPaises() {
		this.multitabla_s.GetListarPaises().pipe(
			finalize(() => {
				this.getDepartamentos(this.formGroup.controls.Pais.value);
			})
		).subscribe(
			(data: any) => {
				this.array_paises = data;
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}

	getDepartamentos(idPais) {
		this.formGroup.controls.Departamento.setValue(null);
		this.multitabla_s.GetListarDepartamentos(idPais).pipe(
			finalize(() => {
				if (this.formGroup.controls.Pais.value === 1) {
					this.getProvincias(this.formGroup.controls.Departamento.value);
				} else {
					console.log("No selecciono Perú");
					this.getProvincias(-1);
				}
			})
		).subscribe(
			(data: any) => {
				this.array_departamentos = data;
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}

	getProvincias(idDepartamento) {
		this.formGroup.controls.Provincia.setValue(null);
		if (idDepartamento != null) {
			this.multitabla_s.GetListarProvincia(idDepartamento).pipe(
				finalize(() => {
					if (this.formGroup.controls.Pais.value === 1) {
						this.getDistritos(this.formGroup.controls.Provincia.value);
					} else {
						console.log("No selecciono Perú");
						if (idDepartamento > 0) {
							this.getDistritos(this.formGroup.controls.Provincia.value);
						} else {
							console.log("No selecciono Departamento");
							this.getDistritos(-1);
						}
					}
				})
			).subscribe(
				(data: any) => {
					this.array_provincias = data;
				}, (errorServicio) => {
					console.log(errorServicio);
				}
			);
		} else {
			this.array_provincias = [];
			this.formGroup.controls.Distrito.setValue(null);
			this.getDistritos(-1);
		}
	}

	getDistritos(idProvincia) {
		this.formGroup.controls.Distrito.setValue(null);

		if (idProvincia != null) {
			this.multitabla_s.GetListarDistrito(idProvincia).pipe(
				finalize(() => {
				})
			).subscribe(
				(data: any) => {
					this.array_distritos = data;
				}, (errorServicio) => {
					console.log(errorServicio);
				}
			);
		} else {
			this.array_distritos = [];
		}

	}

	getUbigeo(idPais, idDepartamento, idProvincia, idDistrito) {
		this.multitabla_s.GetListarPaises().subscribe(
			(data: any) => {
				this.array_paises = data;
				if (idPais !== null) {
					this.formGroup.controls.Pais.setValue(idPais);
					this.multitabla_s.GetListarDepartamentos(idPais).subscribe(
						(data: any) => {
							this.array_departamentos = data;
							if (idDepartamento !== null) {
								this.formGroup.controls.Departamento.setValue(idDepartamento);
								this.multitabla_s.GetListarProvincia(idDepartamento).subscribe(
									(data: any) => {
										this.array_provincias = data;
										if (idProvincia !== null) {
											this.formGroup.controls.Provincia.setValue(idProvincia);
											this.multitabla_s.GetListarDistrito(idProvincia).subscribe(
												(data: any) => {
													this.array_distritos = data;
													if (idDistrito !== null) {
														this.formGroup.controls.Distrito.setValue(idDistrito);
													}
												}, (errorServicio) => {
													console.log(errorServicio);
												}
											);
										}
									}, (errorServicio) => {
										console.log(errorServicio);
									}
								);
							}
						}, (errorServicio) => {
							console.log(errorServicio);
						}
					);
				}
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}


	loadEstablecimiento() {
		if (this.item !== null) {
			this.idEstablecimiento = this.item.idEstablecimiento;
			this.loadForm();

			this.getUbigeo(this.item.idPais, this.item.idDepartamento, this.item.idProvincia, this.item.idDistrito);
			this.getTipoEstablecimiento(this.item.valor);

			this.formGroup.controls.Nombre.setValue(this.item.nombre);
			this.formGroup.controls.Direccion.setValue(this.item.direccion);
			this.formGroup.controls.Activo.setValue(this.item.activo);
		} else {
			this.idEstablecimiento = 0;
			this.loadForm();
			this.getUbigeo(null, null, null, null);
			this.getTipoEstablecimiento(null);
		}
	}

	loadForm() {
		this.formGroup = this.fb.group({
			Nombre: [null, Validators.compose([Validators.required])],
			Pais: [null, Validators.compose([Validators.required])],
			Departamento: [null, Validators.compose([Validators.required])],
			Provincia: [null, Validators.compose([Validators.required])],
			Distrito: [null, Validators.compose([Validators.required])],
			TipoEstablecimiento: [null, Validators.compose([Validators.required])],
			Direccion: [null, Validators.compose([Validators.required])],
			Activo: [true],
		});
	}

	save() {
		let data = this.prepareEstablecimiento();
		
		if (data.idPais > 1 || data.idPais === 0) {
			this.toastr.errorToastr('Falto seleccionar Pais,departamento,provincia o distrito', 'Error!', {
				toastTimeout: 2000,
				showCloseButton: true,
				animate: 'fade',
				progressBar: true
			});
		} else {
			this.establecimiento_s.SaveUpdateEstablecimiento(data).subscribe(
				(data: any) => {
					if (data[0].Ok > 0) {
						this.toastr.successToastr(data[0].Message, 'Correcto!', {
							toastTimeout: 2000,
							showCloseButton: true,
							animate: 'fade',
							progressBar: true
						});

						this.modal.close(true);
					} else {
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
	}

	private prepareEstablecimiento() {


		const formData = this.formGroup.value;

		return {
			idEstablecimiento: this.idEstablecimiento,
			nombre: formData.Nombre,
			idTipoEstablecimiento: formData.TipoEstablecimiento,
			idPais: formData.Pais,
			idDepartamento: formData.Departamento,
			idProvincia: formData.Provincia,
			idDistrito: formData.Distrito,
			direccion: formData.Direccion,
			activo: formData.Activo,
		}
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	// helpers for View
	isControlValid(controlName: string): boolean {
		const control = this.formGroup.controls[controlName];
		return control.valid && (control.dirty || control.touched);
	}

	isControlInvalid(controlName: string): boolean {
		const control = this.formGroup.controls[controlName];
		return control.invalid && (control.dirty || control.touched);
	}

	controlHasError(validation, controlName): boolean {
		const control = this.formGroup.controls[controlName];
		return control.hasError(validation) && (control.dirty || control.touched);
	}

	isControlTouched(controlName): boolean {
		const control = this.formGroup.controls[controlName];
		return control.dirty || control.touched;
	}


}
