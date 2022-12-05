import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Subscription } from 'rxjs';
import { CustomersService } from '../../../../../modules/e-commerce/_services/fake/customers.service';
import { MaterialService } from '../../../_core/services/material.service';

@Component({
  selector: "app-agregar-material",
  templateUrl: "./agregar-material.component.html",
  styleUrls: ["./agregar-material.component.scss"],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class AgregarMaterialComponent implements OnInit {
  @Input() item: any;
  @Input() array_materiales: any;
  @Input() mostrar:any;
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
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private material_s: MaterialService,
    public toastr: ToastrManager
  ) {}

  ngOnInit(): void {
    this.loadMaterial();
    this.getPresentaciones(this.item.idMaterial);
    this.cantidad = 0;
    this.valorUnit = 0;
    this.descuentoUnit = 0;
    this.precioUnit = 0;
    this.precioTotal = 0;
    this.igvUnit = 0;
  }

  getPresentaciones(idMaterial) {
    if (idMaterial) {
      this.material_s.GetDataMaterial(idMaterial).subscribe(
        (data: any) => {
          this.datos_material = data[0];
          this.array_presentaciones = data[1];
          if (this.item.opcion === "A") {
            let index = this.array_presentaciones.findIndex(
              (e) => e.Presentacion == "-"
            );
            if (index !== -1) {
              this.formGroup.controls.Presentacion.setValue(
                this.array_presentaciones[index].IdPresentacion
              );
            }
          } else {
            this.formGroup.controls.Presentacion.setValue(
              this.item.anticipo == 0
                ? this.item.idPresentacion
                : this.item.nombrePresentacion
            );
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.formGroup.controls.Presentacion.setValue("-");
    }
  }

  loadMaterial() {
    this.loadForm();
    let numDecimales = this.item.numDecimales;
    this.igv = this.item.igv;
    if (this.item.opcion !== "A") {
      this.formGroup.controls.Cantidad.setValue(this.item.Cantidad);
      this.formGroup.controls.ValorUnitario.setValue(
        parseFloat(this.item.ValorUnit).toFixed(numDecimales)
      );
      this.formGroup.controls.DescuentoUnitario.setValue(
        parseFloat(this.item.DescuentoUnit).toFixed(numDecimales)
      );
      this.formGroup.controls.PrecioUnitario.setValue(
        parseFloat(this.item.PrecioUnit).toFixed(numDecimales)
      );
      this.formGroup.controls.PrecioTotal.setValue(
        parseFloat(this.item.PrecioTotal).toFixed(numDecimales)
      );
      if (this.mostrar) {
        this.formGroup.controls.CodigoProdProveedor.setValue(
          this.item.codigoProdProveedor
        );
        this.formGroup.controls.DescripcionProdProveedor.setValue(
          this.item.descripcionProdProveedor
        );        
      }
    }
    this.formGroup.controls.Material.setValue(this.item.nombreMaterial);
  }

  loadForm() {
    let regexEntMay = /^[1-9]\d*$/;
    let regexDecMay =
      /^([1-9]\d*(\.\d*[1-9][0-9])?)|(0\.\d*[1-9][0-9])|(0\.\d*[1-9])$/;

    this.formGroup = this.fb.group({
      Material: [
        { value: null, disabled: true },
        Validators.compose([Validators.required]),
      ],
      Presentacion: [null, Validators.compose([Validators.required])],
      Cantidad: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(regexEntMay),
        ]),
      ],
      ValorUnitario: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(regexDecMay),
        ]),
      ],
      DescuentoUnitario: [0, Validators.compose([Validators.required])],
      PrecioUnitario: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(regexDecMay),
        ]),
      ],
      PrecioTotal: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(regexDecMay),
        ]),
      ],
      CodigoProdProveedor: [null],
      DescripcionProdProveedor: [null],
    });

    const controls = this.formGroup.controls;

    if (this.item.opcion === "E") {
      controls.Presentacion.disable();
    }

    if (this.item.descTotalActive === 1) {
      controls.DescuentoUnitario.disable();
    } else {
      controls.DescuentoUnitario.enable();
    }

    if (this.item.incluyeIgv === 1) {
      controls.PrecioUnitario.enable();
      controls.ValorUnitario.disable();
    } else {
      controls.PrecioUnitario.disable();
      controls.ValorUnitario.enable();
    }

    if (this.item.opcion === "V") {
      controls.Material.disable();
      controls.Presentacion.disable();
      controls.Cantidad.disable();
      controls.ValorUnitario.disable();
      controls.DescuentoUnitario.disable();
      controls.PrecioUnitario.disable();
      controls.PrecioTotal.disable();
      if (this.mostrar) {
        controls.CodigoProdProveedor.disable();
        controls.DescripcionProdProveedor.disable();
      }
    }
    this.formGroup.controls.PrecioTotal.disable();
  }

  multiplicar() {
    let numDecimales =
      this.item.numDecimales == "" ? 2 : this.item.numDecimales;
    this.cantidad = parseFloat(this.formGroup.controls.Cantidad.value);
    this.precioUnit = parseFloat(this.formGroup.controls.PrecioUnitario.value);
    this.precioTotal = this.cantidad * this.precioUnit;
    if (this.precioTotal > 0) {
      this.formGroup.controls.PrecioTotal.setValue(
        this.precioTotal.toFixed(numDecimales)
      );
      this.item.PrecioTotal = this.precioTotal.toFixed(6);
    }
    this.item.Cantidad = this.cantidad;
  }

  keyUpValorUnit() {
    let numDecimales =
      this.item.numDecimales == "" ? 2 : this.item.numDecimales;
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
      this.item.PrecioUnit = this.precioUnit.toFixed(6);
      this.item.PrecioTotal = this.precioTotal.toFixed(6);
    } else {
      this.formGroup.controls.PrecioUnitario.setValue(
        (0.0).toFixed(numDecimales)
      );
      this.formGroup.controls.PrecioTotal.setValue((0.0).toFixed(numDecimales));
      this.item.PrecioUnit = (0.0).toFixed(6);
      this.item.PrecioTotal = (0.0).toFixed(6);
    }
    this.item.ValorUnit = this.valorUnit.toFixed(6);
  }

  keyUpDescUnit() {
    let numDecimales =
      this.item.numDecimales == "" ? 2 : this.item.numDecimales;
    let txtDesc = this.formGroup.controls.DescuentoUnitario.value;
    this.descuentoUnit = parseFloat(txtDesc ? txtDesc : 0);
    if (this.item.incluyeIgv === 1) {
      this.precioUnit = parseFloat(this.item.PrecioUnit);
      this.valorUnit =
        this.precioUnit / (1 + this.igv / 100) + this.descuentoUnit;
      this.igvUnit = this.precioUnit - this.valorUnit + this.descuentoUnit;
      if (this.valorUnit >= 0.0) {
        this.formGroup.controls.ValorUnitario.setValue(
          this.valorUnit.toFixed(numDecimales)
        );
        this.item.ValorUnit = this.valorUnit.toFixed(6);
      } else {
        this.formGroup.controls.ValorUnitario.setValue(
          (0.0).toFixed(numDecimales)
        );
        this.item.ValorUnit = (0.0).toFixed(6);
      }
    } else {
      this.valorUnit = parseFloat(this.item.ValorUnit);
      this.igvUnit = (this.valorUnit - this.descuentoUnit) * (this.igv / 100);
      this.precioUnit = this.valorUnit + this.igvUnit - this.descuentoUnit;
      if (this.precioUnit >= 0.0) {
        this.formGroup.controls.PrecioUnitario.setValue(
          this.precioUnit.toFixed(numDecimales)
        );
        this.item.PrecioUnit = this.precioUnit.toFixed(6);
      } else {
        this.formGroup.controls.PrecioUnitario.setValue(
          (0.0).toFixed(numDecimales)
        );
        this.item.PrecioUnit = (0.0).toFixed(6);
      }
    }
    this.cantidad = parseFloat(this.formGroup.controls.Cantidad.value);
    this.precioTotal =
      this.cantidad * (this.valorUnit - this.descuentoUnit + this.igvUnit);
    if (this.precioTotal >= 0.0) {
      this.formGroup.controls.PrecioTotal.setValue(
        this.precioTotal.toFixed(numDecimales)
      );
      this.item.PrecioTotal = this.precioTotal.toFixed(6);
    } else {
      this.formGroup.controls.PrecioTotal.setValue((0.0).toFixed(numDecimales));
      this.item.PrecioTotal = (0.0).toFixed(6);
    }
    this.item.DescuentoUnit = this.descuentoUnit.toFixed(6);
  }

  keyUpPrecioUnitario() {
    let numDecimales =
      this.item.numDecimales == "" ? 2 : this.item.numDecimales;
    this.precioUnit = parseFloat(this.formGroup.controls.PrecioUnitario.value);
    this.descuentoUnit = parseFloat(this.item.DescuentoUnit);
    this.valorUnit =
      this.precioUnit / (1 + this.igv / 100) + this.descuentoUnit;
    this.cantidad = parseFloat(this.formGroup.controls.Cantidad.value);

    if (this.valorUnit >= 0.0) {
      this.formGroup.controls.ValorUnitario.setValue(
        this.valorUnit.toFixed(numDecimales)
      );
      this.item.ValorUnit = this.valorUnit.toFixed(6);
    } else {
      this.formGroup.controls.ValorUnitario.setValue(
        (0.0).toFixed(numDecimales)
      );
      this.item.ValorUnit = (0.0).toFixed(6);
    }

    this.precioTotal = this.precioUnit * this.cantidad;
    this.formGroup.controls.PrecioTotal.setValue(
      this.precioTotal.toFixed(numDecimales)
    );
    this.item.PrecioTotal = this.precioTotal.toFixed(6);
    this.item.PrecioUnit = this.precioUnit.toFixed(6);
    this.item.DescuentoUnit = this.descuentoUnit.toFixed(6);
  }

  preparedMaterial() {
    const controls = this.formGroup.controls;
    this.precioUnit = parseFloat(this.item.PrecioUnit);
    this.valorUnit = parseFloat(this.item.ValorUnit);
    this.descuentoUnit = parseFloat(this.item.DescuentoUnit);
    this.cantidad = parseFloat(this.item.Cantidad);
    if (this.item.incluyIgv === 1) {
      this.igvUnit = (this.valorUnit - this.descuentoUnit) * (this.igv / 100);
      this.item.IgvUnit = this.igvUnit.toFixed(6);
    } else {
      this.igvUnit = this.precioUnit - this.valorUnit + this.descuentoUnit;
      this.item.IgvUnit = this.igvUnit.toFixed(6);
    }
    if (this.item.anticipo==undefined || this.item.anticipo==0) {
      this.item.idPresentacion = this.formGroup.controls.Presentacion.value;
      let elem = this.array_presentaciones.find(
        (e) => e.IdPresentacion === this.item.idPresentacion
      );
      let nombrePresentacion = elem.Presentacion;
      this.item.nombrePresentacion = nombrePresentacion;
      this.item.CantidadTotal = (
        this.cantidad * parseFloat(elem.Equivalencia)
      ).toFixed(6);
      this.item.equivalenciaPresentacion = parseFloat(
        elem.Equivalencia
      ).toFixed(6);
      this.item.idUnidadMedida = this.datos_material[0].UnidadMedida;
      this.item.unidadMedida = this.datos_material[0].NombreUnidadMedida;
      this.item.codigoProdProveedor = controls.CodigoProdProveedor.value
        ? controls.CodigoProdProveedor.value
        : "";
      this.item.descripcionProdProveedor = controls.DescripcionProdProveedor
        .value
        ? controls.DescripcionProdProveedor.value
        : "";
    }
    this.item.valorTotal = (this.cantidad * this.valorUnit).toFixed(6);
    this.item.descuentoTotal = (this.cantidad * this.descuentoUnit).toFixed(6);

    return this.item;
  }

  save() {
    let datos = this.preparedMaterial();
    let repetido = this.array_materiales.find(
      (e) => e.idPresentacion === datos.idPresentacion
    );
    if (repetido && this.item.opcion == "A") {
      this.toastr.errorToastr(
        "El material con la misma presentación, ya ha sido seleccionado.",
        "Error!",
        {
          toastTimeout: 1500,
          showCloseButton: true,
          animate: "fade",
          progressBar: true,
        }
      );
    } else {
      if (this.item.opcion == "A") {
        this.toastr.successToastr(
          "Material agregado correctamente",
          "Correcto!",
          {
            toastTimeout: 1500,
            showCloseButton: true,
            animate: "fade",
            progressBar: true,
          }
        );
      } else {
        this.toastr.successToastr(
          "Material editado correctamente",
          "Correcto!",
          {
            toastTimeout: 1500,
            showCloseButton: true,
            animate: "fade",
            progressBar: true,
          }
        );
      }
      this.modal.close(datos);
    }
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
