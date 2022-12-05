import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { of, Subscription } from 'rxjs';


@Component({
  selector: 'app-eliminar-asesor-comercial',
  templateUrl: './eliminar-asesor-comercial.component.html',
  styleUrls: ['./eliminar-asesor-comercial.component.scss']
})
export class EliminarAsesorComercialComponent implements OnInit {
  formDatos: FormGroup;
  @Input() id: number;
  @Input() tipo: number;
  @Input() titulo: string;
  @Input() msgloading: string;
  @Input() descripcion: string;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(
    public modal: NgbActiveModal,
    public toastr: ToastrManager,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.datosForm();
  }

  datosForm() {
    this.formDatos = this.fb.group({    
      FechaSalida: [null, Validators.compose([Validators.required])]
    });    
  }

  deleteAsesor() {
    this.isLoading = true;

    const controls = this.formDatos.controls;
		if (this.formDatos.invalid) {     
			Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      this.toastr.warningToastr('Ingrese los campos obligatorios.', 'Advertencia!', {
        toastTimeout: 2000,
        showCloseButton: true,
        animate: 'fade',
        progressBar: true
      });
			return;
    }

    this.modal.close({FechaSalida: this.formDatos.controls.FechaSalida.value}); 
  }

  isControlValid(controlName: string): boolean {
    const control = this.formDatos.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formDatos.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formDatos.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }
  
  isControlTouched(controlName): boolean {
    const control = this.formDatos.controls[controlName];
    return control.dirty || control.touched;
  }


}
