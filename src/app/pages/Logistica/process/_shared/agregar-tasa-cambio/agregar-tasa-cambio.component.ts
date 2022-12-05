import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Subscription } from 'rxjs';
import { MultitablaService } from 'src/app/pages/_core/services/multitabla.service';
import { DatePipe } from '@angular/common';
import { OrdenCompraService } from 'src/app/pages/Logistica/_core/services/orden-compra.service';

@Component({
  selector: "app-agregar-tasa-cambio",
  templateUrl: "./agregar-tasa-cambio.component.html",
  styleUrls: ["./agregar-tasa-cambio.component.scss"],
  providers: [
    DatePipe,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class AgregarTasaCambioComponent implements OnInit {
  @Input() fecha: any;
  @Input() tipoMoneda: any;

  formGroup: FormGroup;
  array_tiposMoneda: any = [];
  idTasaCambio: any = 0;

  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    public toastr: ToastrManager,
    private multitable_s: MultitablaService,
    private ordenCompra_s: OrdenCompraService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getTiposMoneda();
    this.loadTasaCambio();
  }

  getTiposMoneda() {
    this.multitable_s.GetListarMoneda().subscribe(
      (data: any) => {
        this.array_tiposMoneda = data;
      },
      (errorService) => {
        console.log(errorService);
      }
    );
  }

  loadTasaCambio() {
    this.loadForm();
    this.formGroup.controls["Fecha"].setValue(this.fecha);
    this.formGroup.controls["Fecha"].disable();
    this.formGroup.controls["MonedaOrigen"].setValue("0001");
    this.formGroup.controls["MonedaOrigen"].disable();
    this.formGroup.controls["MonedaDestino"].setValue(this.tipoMoneda);
    this.formGroup.controls["MonedaDestino"].disable();
  }

  loadForm() {
    let regexDecMay = /^((?!0)\d{1,18}|0|\.\d{1,3})($|\.$|\.\d{1,3}$)/;

    this.formGroup = this.fb.group({
      Fecha: [null, Validators.compose([Validators.required])],
      MonedaOrigen: [null, Validators.compose([Validators.required])],
      MonedaDestino: [null, Validators.compose([Validators.required])],
      Compra: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(regexDecMay),
        ]),
      ],
      Venta: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(regexDecMay),
        ]),
      ],
    });
  }

  save() {
    let datos = this.prepare_model();
    this.ordenCompra_s.SaveUpdateTasaCambio(datos).subscribe(
      (data: any) => {
        if (data[0].Ok === 1) {
          this.modal.close({
            success: true,
          });
        } else {
          this.toastr.errorToastr("Ocurrio un error.", "Error!", {
            toastTimeout: 1500,
            showCloseButton: true,
            animate: "fade",
            progressBar: true,
          });
        }
      },
      (errorService) => {
        console.log(errorService);
      }
    );
  }

  prepare_model() {
    const controls = this.formGroup.controls;
    let dataTasaCambio = [];
    dataTasaCambio.push({
      idTasacambio: this.idTasaCambio,
      fecha: this.datePipe.transform(controls["Fecha"].value, "yyyy-MM-dd"),
      idMonedaOrigen: controls["MonedaOrigen"].value,
      idMonedaDestino: controls["MonedaDestino"].value,
      valorCompra: parseFloat(controls["Compra"].value).toFixed(3),
      valorVenta: parseFloat(controls["Venta"].value).toFixed(3),
    });
    return {
      TasaCambio: dataTasaCambio,
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
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
