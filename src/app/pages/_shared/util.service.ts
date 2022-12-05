import { Injectable } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';

@Injectable({
	providedIn: 'root'
})
export class UtilService {

	constructor(
		public toastr: ToastrManager,
	) { }

	public viewModalExito(num: number, mensaje: string, modal: NgbActiveModal) {
		if (num > 0) {
			this.toastr.successToastr(mensaje, 'Correcto!', {
				toastTimeout: 2000,
				showCloseButton: true,
				animate: 'fade',
				progressBar: true
			});
			modal.close();
		} else {
			this.toastr.errorToastr(mensaje, 'Error!', {
				toastTimeout: 2000,
				showCloseButton: true,
				animate: 'fade',
				progressBar: true
			});
		}
	}

	public viewExito(num: number, mensaje: string) {
		if (num > 0) {
			this.toastr.successToastr(mensaje, 'Correcto!', {
				toastTimeout: 2000,
				showCloseButton: true,
				animate: 'fade',
				progressBar: true
			});
		} 
		else {
			this.toastr.errorToastr(mensaje, 'Error!', {
				toastTimeout: 2000,
				showCloseButton: true,
				animate: 'fade',
				progressBar: true
			});
		}
	}

	public viewError(errorServicio: any) {
		this.toastr.errorToastr(errorServicio.error.Message, "¡Algo no salió bien!", {
			toastTimeout: 4000,
			showCloseButton: true,
			animate: 'fade',
			progressBar: true
		});
	}
}
