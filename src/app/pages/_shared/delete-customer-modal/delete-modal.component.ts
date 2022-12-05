import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { CertificadosService } from '../../Talento/_core/services/certificados.service';
import { DocumentoService } from '../../Talento/_core/services/documento.service';
import { TrabajadorService } from '../../Talento/_core/services/trabajador.service';
import { equipoComercialService } from '../../Talento/_core/services/equipoComercial.service';
import { VentasService } from '../../Comercial/_core/ventas.service';
import { MaterialService } from '../../Logistica/_core/services/material.service';
import { ClaseMaterialService } from '../../Logistica/_core/services/clase-material.service';
import { CaracteristicaMaterialService } from '../../Logistica/_core/services/caracteristica-material.service';
import { DistritoServiceService } from '../../Security/_core/services/distrito-service.service';
import { I } from '@angular/cdk/keycodes';
import { CaracteristicasVehiculoService } from '../../Operations/_core/services/caracteristicas-vehiculo.service';
import { PuntosTransporteServiceService } from '../../Operations/_core/services/puntos-transporte-service.service';
import { RutaServiceService } from '../../Operations/_core/services/ruta-service.service';
import { ProvinciaServiceService } from '../../Security/_core/services/provincia-service.service';
import { DepartamentoServiceService } from '../../Security/_core/services/departamento-service.service';
import { TarifaService } from '../../Operations/_core/services/tarifa.service';
import { UtilService } from '../util.service';
import { BancoServiceService } from '../../Finanzas/_core/services/banco-service.service';
import { ProyectosComponent } from '../../Sales/masters/proyectos/proyectos.component';
import { ProyectosService } from '../../Sales/_core/proyectos.service';


@Component({
	selector: 'app-delete-modal',
	templateUrl: './delete-modal.component.html',
	styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {
	@Input() id: number;
	@Input() tipo: number;
	@Input() titulo: string;
	@Input() msgloading: string;
	@Input() descripcion: string;
	isLoading = false;
	subscriptions: Subscription[] = [];

	constructor(
		private certificado_s: CertificadosService,
		private documento_s: DocumentoService,
		private trabajador_s: TrabajadorService,
		private equipo_s: equipoComercialService,
		private venta_s: VentasService,
		private material_s: MaterialService,
		private claseMaterialService: ClaseMaterialService,
		public modal: NgbActiveModal,
		public toastr: ToastrManager,
		private caracteristicaVehicuslo_S: CaracteristicasVehiculoService,
		private puntoTransporte_s: PuntosTransporteServiceService,
		private ruta_s: RutaServiceService,
		private claseDistritoService: DistritoServiceService,
		private provincia_s: ProvinciaServiceService,
		private departamento_s: DepartamentoServiceService,
		private tarifa_s: TarifaService,
		private util_s: UtilService,
		private banco_s: BancoServiceService,
		private proyecto_s: ProyectosService,

	) { }

	ngOnInit(): void {
	}

	deleteCertificado() {
		this.isLoading = true;

		if (this.tipo === 1) {
			this.deleteCertificado_()
		}
		else if (this.tipo === 2) {
			this.deleteDocumento();
		}
		else if (this.tipo === 3) {
			this.deleteTrabajador();
		}
		else if (this.tipo === 4) {
			this.deleteEquipo();
		}
		else if (this.tipo === 5) {
			this.deleteSeguimientoVenta();
		}
		else if (this.tipo === 6) {
			this.deleteMaterial();
		}
		else if (this.tipo === 7) {
			this.deleteClaseMaterial();
		}
		else if (this.tipo == 13) {
			this.deleteCaracteristicaVehiculo()
		}
		else if (this.tipo == 14) {
			this.deleteCaracteristicaVehiculoValor()
		}
		else if (this.tipo == 15) {
			this.deletePuntoTransporte()
		}
		else if (this.tipo == 16) {
			this.deleteRuta()
		}
		else if (this.tipo == 17) {
			this.deleteTarifa()
		}
		else if (this.tipo == 18){
			this.deleteBanco()
		}else if(this.tipo == 19){
			this.deleteCuentaBancaria()
		}
		else if(this.tipo == 20){
			this.deleteProyecto()
		}
	}

	private deleteCertificado_() {
		this.certificado_s.DeleteCertificado(this.id, 2, null).subscribe(
			(data: any) => {
				if (data[0].Ok > 0) {
					this.isLoading = false;
					this.toastr.successToastr(data[0].Message, 'Correcto!', {
						toastTimeout: 2000,
						showCloseButton: true,
						animate: 'fade',
						progressBar: true
					});

					this.modal.close(true);
				} else {
					this.isLoading = false;
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

	private deleteDocumento() {
		this.documento_s.DeleteDisableConfDocumento(this.id, 2, null).subscribe(
			(data: any) => {
				if (data[0].Ok > 0) {
					this.isLoading = false;
					this.toastr.successToastr(data[0].Message, 'Correcto!', {
						toastTimeout: 2000,
						showCloseButton: true,
						animate: 'fade',
						progressBar: true
					});

					this.modal.close(true);
				} else {
					this.isLoading = false;
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

	private deleteTrabajador() {
		this.trabajador_s.DeleteDisableTrabajador(this.id, 2, null).subscribe(
			(data: any) => {
				if (data[0].Ok > 0) {
					this.isLoading = false;
					this.toastr.successToastr(data[0].Message, 'Correcto!', {
						toastTimeout: 2000,
						showCloseButton: true,
						animate: 'fade',
						progressBar: true
					});

					this.modal.close(true);
				} else {
					this.isLoading = false;
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

	private deleteEquipo() {
		this.equipo_s.DeleteDisableEquipo(this.id, 2, null).subscribe(
			(data: any) => {
				if (data[0].Ok > 0) {
					this.isLoading = false;
					this.toastr.successToastr(data[0].Message, 'Correcto!', {
						toastTimeout: 2000,
						showCloseButton: true,
						animate: 'fade',
						progressBar: true
					});

					this.modal.close(true);
				} else {
					this.isLoading = false;
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

	private deleteSeguimientoVenta() {
		this.venta_s.DeleteSeguimientoVenta(this.id).subscribe(
			(data: any) => {
				if (data[0].Ok > 0) {
					this.isLoading = false;
					this.toastr.successToastr(data[0].Message, 'Correcto!', {
						toastTimeout: 2000,
						showCloseButton: true,
						animate: 'fade',
						progressBar: true
					});

					this.modal.close(true);
				} else {
					this.isLoading = false;
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

	private deleteMaterial() {
		this.material_s.DeleteDisabledMaterial(this.id, 2, null).subscribe(
			(data: any) => {
				if (data[0].Ok > 0) {
					this.isLoading = false;
					this.toastr.successToastr(data[0].Message, 'Correcto!', {
						toastTimeout: 2000,
						showCloseButton: true,
						animate: 'fade',
						progressBar: true
					});

					this.modal.close(true);
				} else {
					this.isLoading = false;
					this.toastr.errorToastr(data[0].Message, 'Error!', {
						toastTimeout: 2000,
						showCloseButton: true,
						animate: 'fade',
						progressBar: true
					});
				}
			}, (error) => {
				this.toastr.errorToastr('Ocurrio un error.', 'Error!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				console.log(error);
			}
		);
	}

	private deleteClaseMaterial() {
		this.claseMaterialService.deleteClaseMaterial(this.id).subscribe(
			(data: any) => {
				this.isLoading = false;
				this.toastr.successToastr(data[0].Message, 'Correcto!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				this.modal.close(true);
			}, (error) => {
				this.toastr.errorToastr('Ocurrio un error.', 'Error!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				console.log(error);
			}
		);
	}

	private deleteCaracteristicaVehiculo() {
		this.caracteristicaVehicuslo_S.deleteCaracteristicaeMaterial(this.id).subscribe(
			(data: any) => {
				if (data[0].Success > 0) {
					this.isLoading = false;
					this.toastr.successToastr(data[0].Message, 'Correcto!', {
						toastTimeout: 2000,
						showCloseButton: true,
						animate: 'fade',
						progressBar: true
					});

					this.modal.close(true);
				} else {
					this.isLoading = false;
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

	private deleteCaracteristicaVehiculoValor() {
		this.caracteristicaVehicuslo_S.deleteCaracteristicaVehiculoValor(this.id).subscribe(
			(data: any) => {
				if (data[0].Success > 0) {
					this.isLoading = false;
					this.toastr.successToastr(data[0].Message, 'Correcto!', {
						toastTimeout: 2000,
						showCloseButton: true,
						animate: 'fade',
						progressBar: true
					});

					this.modal.close(true);
				} else {
					this.isLoading = false;
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

	private deletePuntoTransporte() {
		console.log("si entramos")
		this.puntoTransporte_s.deletePuntosTransporte(this.id).subscribe(
			(data: any) => {
				if (data[0].Success > 0) {
					console.log(data)
					this.isLoading = false;
					this.toastr.successToastr(data[0].Message, 'Correcto!', {
						toastTimeout: 2000,
						showCloseButton: true,
						animate: 'fade',
						progressBar: true
					});

					this.modal.close(true);
				} else {
					console.log(data)
					this.isLoading = false;
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
			}
		);
	}

	/* private deleteCaracteristicaMaterialValor() {
		console.log('auxilio' + this.id)
		this.caracteristica_s.deleteCaracteristicaMaterialValor(this.id).subscribe(
			(data: any) => {
				this.isLoading = false;
				this.toastr.successToastr(data[0].Message, 'Correcto!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				this.modal.close(true);
			}, (error) => {
				console.log("asssssssaaaaaaaaaafa")
				this.toastr.errorToastr('Ocurrio un error.', 'Error!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				console.log(error);
			}
		);
	} */

	private deleteRuta() {
		this.ruta_s.deleteRuta(this.id).subscribe(
			(data: any) => {
				if (data[0].Success > 0) {
					console.log(data)
					this.isLoading = false;
					this.toastr.successToastr(data[0].Message, 'Correcto!', {
						toastTimeout: 2000,
						showCloseButton: true,
						animate: 'fade',
						progressBar: true
					});

					this.modal.close(true);
				} else {
					console.log(data)
					this.isLoading = false;
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
			}
		)
	}

	deleteDistritos() {
		console.log(this.id)
		this.claseDistritoService.deleteDistrito(this.id).subscribe(
			(data: any) => {
				this.isLoading = false;
				this.toastr.successToastr(data[0].Message, 'Correcto!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				this.modal.close(true);
			}, (error) => {
				this.toastr.errorToastr('Ocurrio un error.', 'Error!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				console.log(error);
			}
		);
	}

	deleteProvincia() {
		console.log(this.id);
		this.provincia_s.DeleteProvincia(this.id).subscribe(
			(data: any) => {
				this.isLoading = false;
				this.toastr.successToastr(data[0].Message, 'Correcto!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				this.modal.close(true);
			}, (error) => {
				this.toastr.errorToastr('Ocurrio un error.', 'Error!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				console.log(error);
			}
		);
	}

	deleteDepartamento() {
		console.log(this.id);
		this.departamento_s.DeleteDepartamento(this.id).subscribe(
			(data: any) => {
				this.isLoading = false;
				this.toastr.successToastr(data[0].Message, 'Correcto!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				this.modal.close(true);
			}, (error) => {
				this.toastr.errorToastr('Ocurrio un error.', 'Error!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				console.log(error);
			}
		);
	}

	private deleteTarifa() {
		this.tarifa_s.deleteTarifa(this.id).subscribe(
			(data: any) => {
				console.log(data)
				this.util_s.viewModalExito(data[0].Ok, data[0].Message, this.modal);
			}, (errorServicio) => {
				this.util_s.viewError(errorServicio);
			}
		);
	}

	private deleteBanco() {
		// console.log(this.id);
		this.banco_s.DeleteBanco(this.id).subscribe(
			(data: any) => {
				this.isLoading = false;
				this.toastr.successToastr(data[0].Message, 'Correcto!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				this.modal.close(true);
			}, (error) => {
				this.toastr.errorToastr('Ocurrio un error.', 'Error!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				console.log(error);
			}
		);
	}

	private deleteCuentaBancaria() {
		// console.log(this.id);
		this.banco_s.DeleteCuentaBancaria(this.id).subscribe(
			(data: any) => {
				this.isLoading = false;
				this.toastr.successToastr(data[0].Message, 'Correcto!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				this.modal.close(true);
			}, (error) => {
				this.toastr.errorToastr('Ocurrio un error.', 'Error!', {
					toastTimeout: 2000,
					showCloseButton: true,
					animate: 'fade',
					progressBar: true
				});
				console.log(error);
			}
		);
	}

	private deleteProyecto() {
		this.proyecto_s.deleteProyecto(this.id).subscribe(
			(data: any) => {
				if (data[0].Success > 0) {
					this.isLoading = false;
					this.toastr.successToastr(data[0].Message, 'Correcto!', {
						toastTimeout: 2000,
						showCloseButton: true,
						animate: 'fade',
						progressBar: true
					});

					this.modal.close(true);
				} else {
					this.isLoading = false;
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
			}
		);
	}
}
