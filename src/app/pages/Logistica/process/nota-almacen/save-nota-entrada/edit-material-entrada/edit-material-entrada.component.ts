import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Subscription } from 'rxjs';
import { CustomersService } from '../../../../../../modules/e-commerce/_services/fake/customers.service';
import { MaterialService } from '../../../../_core/services/material.service';

@Component({
  selector: "app-edit-material-entrada",
  templateUrl: "./edit-material-entrada.component.html",
  styleUrls: ["./edit-material-entrada.component.scss"],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class EditMaterialEntradaComponent implements OnInit {
  @Input() item: any;
  idMaterial: number = 0;
  formGroup: FormGroup;
  cantidad: number;
  valorUnit: number;
  descuentoUnit: number;
  precioUnit: number;
  precioTotal: number;
  igvUnit: number;
  igv: number;
  array_presentaciones: any;
  datos_material: any;

  private subscriptions: Subscription[] = [];

  constructor(
    private customersService: CustomersService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private material_s: MaterialService,
    public toastr: ToastrManager
  ) {}

  ngOnInit(): void {
    this.igv = this.item.igv;
    this.loadForm();
    this.cantidad = 0;
    this.valorUnit = 0;
    this.descuentoUnit = 0;
    this.precioUnit = 0;
    this.precioTotal = 0;
    this.igvUnit = 0;
  }

  loadForm() {
    let regexEntMay = /^[1-9]\d*$/;
    let regexDecMay =
      /^([1-9]\d*(\.\d*[1-9][0-9])?)|(0\.\d*[1-9][0-9])|(0\.\d*[1-9])$/;
    let numDecimales = this.item.nDecimales;
    this.formGroup = this.fb.group({
      Material: [
        { value: this.item.nombreMaterial, disabled: true },
        Validators.compose([Validators.required]),
      ],
      Presentacion: [
        { value: this.item.nombrePresentacion, disabled: true },
        Validators.compose([Validators.required]),
      ],
      Cantidad: [
        this.item.cantidad,
        Validators.compose([
          Validators.required,
          Validators.pattern(regexEntMay),
        ]),
      ],
      ValorUnitario: [
        parseFloat(this.item.valorUnit).toFixed(numDecimales),
        Validators.compose([
          Validators.required,
          Validators.pattern(regexDecMay),
        ]),
      ],
      DescuentoUnitario: [
        parseFloat(this.item.descuentoUnit).toFixed(numDecimales),
        Validators.compose([Validators.required]),
      ],
      PrecioUnitario: [
        parseFloat(this.item.precioUnit).toFixed(numDecimales),
        Validators.compose([
          Validators.required,
          Validators.pattern(regexDecMay),
        ]),
      ],
      PrecioTotal: [
        {
          value: parseFloat(this.item.precioTotal).toFixed(numDecimales),
          disabled: true,
        },
        Validators.compose([
          Validators.required,
          Validators.pattern(regexDecMay),
        ]),
      ],
    });
  }

  keyUpCantidad() {
    let numDecimales = this.item.nDecimales;
    this.cantidad = parseFloat(this.formGroup.controls.Cantidad.value);
    this.precioUnit = parseFloat(this.formGroup.controls.PrecioUnitario.value);
    this.precioTotal = this.cantidad * this.precioUnit;
    if (this.precioTotal > 0) {
      this.formGroup.controls.PrecioTotal.setValue(
        this.precioTotal.toFixed(numDecimales)
      );
      this.item.precioTotal = this.precioTotal.toFixed(6);
    }
    this.item.cantidad = this.cantidad;
  }

  keyUpValorUnit() {
    let numDecimales = this.item.nDecimales;
    this.valorUnit = parseFloat(this.formGroup.controls.ValorUnitario.value);
    this.cantidad = parseFloat(this.formGroup.controls.Cantidad.value);
    this.descuentoUnit = parseFloat(
      this.formGroup.controls.DescuentoUnitario.value
    );
    this.igvUnit = (this.valorUnit - this.descuentoUnit) * (this.igv / 100);
    this.precioUnit = this.valorUnit + this.igvUnit - this.descuentoUnit;

    if (this.precioUnit >= 0.0) {
      this.formGroup.controls.PrecioUnitario.setValue(
        this.precioUnit.toFixed(numDecimales)
      );
      this.precioTotal =
        this.cantidad * (this.valorUnit - this.descuentoUnit + this.igvUnit);
      this.formGroup.controls.PrecioTotal.setValue(
        this.precioTotal.toFixed(numDecimales)
      );
      this.item.precioUnit = this.precioUnit.toFixed(6);
      this.item.precioTotal = this.precioTotal.toFixed(6);
    } else {
      this.formGroup.controls.PrecioUnitario.setValue(
        (0.0).toFixed(numDecimales)
      );
      this.formGroup.controls.PrecioTotal.setValue((0.0).toFixed(numDecimales));
      this.item.precioUnit = (0.0).toFixed(6);
      this.item.precioTotal = (0.0).toFixed(6);
    }
    this.item.valorUnit = this.valorUnit.toFixed(6);
  }

  keyUpDescUnit() {
    let numDecimales = this.item.nDecimales;
    let txtDesc = this.formGroup.controls.DescuentoUnitario.value;
    this.descuentoUnit = parseFloat(txtDesc ? txtDesc : 0);
    this.valorUnit = parseFloat(this.item.valorUnit);
    this.igvUnit = (this.valorUnit - this.descuentoUnit) * (this.igv / 100);
    this.precioUnit = this.valorUnit + this.igvUnit - this.descuentoUnit;
    if (this.precioUnit >= 0.0) {
      this.formGroup.controls.PrecioUnitario.setValue(
        this.precioUnit.toFixed(numDecimales)
      );
      this.item.precioUnit = this.precioUnit.toFixed(6);
    } else {
      this.formGroup.controls.PrecioUnitario.setValue(
        (0.0).toFixed(numDecimales)
      );
      this.item.precioUnit = (0.0).toFixed(6);
    }
    this.cantidad = parseFloat(this.formGroup.controls.Cantidad.value);
    this.precioTotal =
      this.cantidad * (this.valorUnit - this.descuentoUnit + this.igvUnit);
    if (this.precioTotal >= 0.0) {
      this.formGroup.controls.PrecioTotal.setValue(
        this.precioTotal.toFixed(numDecimales)
      );
      this.item.precioTotal = this.precioTotal.toFixed(6);
    } else {
      this.formGroup.controls.PrecioTotal.setValue((0.0).toFixed(numDecimales));
      this.item.precioTotal = (0.0).toFixed(6);
    }
    this.item.descuentoUnit = this.descuentoUnit.toFixed(6);
  }

  keyUpPrecioUnitario() {
    let numDecimales = this.item.nDecimales;
    this.precioUnit = parseFloat(this.formGroup.controls.PrecioUnitario.value);
    this.descuentoUnit = parseFloat(this.item.descuentoUnit);
    this.valorUnit =
      this.precioUnit / (1 + this.igv / 100) + this.descuentoUnit;
    this.cantidad = parseFloat(this.formGroup.controls.Cantidad.value);
    if (this.valorUnit >= 0.0) {
      this.formGroup.controls.ValorUnitario.setValue(
        this.valorUnit.toFixed(numDecimales)
      );
      this.item.valorUnit = this.valorUnit.toFixed(6);
    } else {
      this.formGroup.controls.ValorUnitario.setValue(
        (0.0).toFixed(numDecimales)
      );
      this.item.valorUnit = (0.0).toFixed(6);
    }
    this.precioTotal = this.precioUnit * this.cantidad;
    this.formGroup.controls.PrecioTotal.setValue(
      this.precioTotal.toFixed(numDecimales)
    );
    this.item.precioTotal = this.precioTotal.toFixed(6);
    this.item.precioUnit = this.precioUnit.toFixed(6);
    this.item.descuentoUnit = this.descuentoUnit.toFixed(6);
  }

  prepared_model() {
    this.precioUnit = parseFloat(this.item.precioUnit);
    this.valorUnit = parseFloat(this.item.valorUnit);
    this.descuentoUnit = parseFloat(this.item.descuentoUnit);
    this.cantidad = parseFloat(this.item.cantidad);
    this.item.cantidadTotal = (
      this.cantidad * parseFloat(this.item.equivalencia)
    ).toFixed(6);
    this.item.valorTotal = (this.cantidad * this.valorUnit).toFixed(6);
    this.item.descuentoTotal = (this.cantidad * this.descuentoUnit).toFixed(6);

    return this.item;
  }

  save() {
    let datos = this.prepared_model();
    this.toastr.successToastr("Material editado correctamente", "Correcto!", {
      toastTimeout: 1500,
      showCloseButton: true,
      animate: "fade",
      progressBar: true,
    });

    this.modal.close(datos);
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
