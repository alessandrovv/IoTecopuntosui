import { E } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Subscription } from 'rxjs';
import { CustomersService } from 'src/app/modules/e-commerce/_services';
import { DocumentoService } from '../../../_core/services/documento.service';


@Component({
  selector: 'app-save-update-documentos-modal',
  templateUrl: './save-update-documentos-modal.component.html',
  styleUrls: ['./save-update-documentos-modal.component.scss']
})
export class SaveUpdateDocumentosModalComponent implements OnInit {

  @Input() item: any = null;
  isLoading$;
  formGroup: FormGroup;
  prefixName = `c_${(new Date()).getTime()}_`;
  todayState: Date

  private subscriptions: Subscription[] = [];
  array_tiposDocumentoVehiculo: any;
  array_vehiculoDocumento: any = [];
  @Output() vehiculoDocumentoEvent = new EventEmitter<any>();
  constructor(
    private customersService: CustomersService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    public toastr: ToastrManager,
    public documento_s: DocumentoService,
    private chgRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.customersService.isLoading$;
    this.loadForm();
    this.todayState = new Date();
    this.getTiposDocumentoVehiculo();
    if (this.item !== null) {
      this.loadDocumento();
    }

    // this.formGroup.get('NumeroDocumento').valueChanges
    // .subscribe(e=>{
    //  
    // })
  }


  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

 



  //#region Validacion de fechas de un control sobre otro
  validarFecha(control1, control2) {
    if (this.item !== null) {
      this.validarFechaAlEditar(control1, control2);
    } else {
      this.validarFechaAlCrear(control1, control2);
    }
  }

  validarFechaAlEditar(control1, control2) {
    if (this.formGroup.controls[control2].value >= this.formGroup.controls[control1].value) {
      console.log("Fechas correctas");
      this.formGroup.controls[control2].enable();
    } else {
      this.formGroup.controls[control2].disable();
    }
  }

  validarFechaAlCrear(control1, control2) {
    if (this.formGroup.controls[control1].valid) {
      this.formGroup.controls[control2].enable();
    } else {
      this.formGroup.controls[control2].disable();
    }
  }
  //#endregion

  getTiposDocumentoVehiculo() {
    let defaultIndex
    this.documento_s.GetTiposDocumentoVehiculo().subscribe(
      (data: any) => {
        this.array_tiposDocumentoVehiculo = data;
      }
    )
  }

  loadDocumento() {
    console.log("ITEM EN DOCUMENTO MODAL", this.item);

    this.formGroup.controls.TipoDocumento.setValue(this.item.idTipoDocumento);
    this.formGroup.controls.NumeroDocumento.setValue(this.item.numeroDocumento);
    this.formGroup.controls.FechaPago.setValue(this.item.fechaPago);
    this.formGroup.controls.ImportePago.setValue(this.item.importePago);
    this.formGroup.controls.FechaInicioVigencia.setValue(this.item.fechaInicioVigencia);
    this.formGroup.controls.FechaFinVigencia.setValue(this.item.fechaFinVigencia);
  }

  loadForm() {
    this.formGroup = this.fb.group({
      TipoDocumento: [null, Validators.compose([Validators.required])],
      NumeroDocumento: [null, Validators.compose([Validators.required])],
      FechaPago: [null, Validators.compose([Validators.required])],
      ImportePago: [null, Validators.compose([Validators.required])],
      FechaInicioVigencia: [null, Validators.compose([Validators.required])],
      FechaFinVigencia: [null, Validators.compose([Validators.required])],
    });
    this.formGroup.controls.FechaInicioVigencia.disable();
    this.formGroup.controls.FechaFinVigencia.disable();

  }


  addDocumento() {

    if (this.item != null) {//Editar
      this.item = {
        codigo: this.item.codigo,
        idVehiculoDocumento: this.item.idVehiculoDocumento,
        idTipoDocumento: this.formGroup.controls.TipoDocumento.value,
        nombreTipoDocumento: this.array_tiposDocumentoVehiculo.find(e => e.valor === this.formGroup.controls.TipoDocumento.value).nombre,
        numeroDocumento: this.formGroup.controls.NumeroDocumento.value,
        fechaPago: this.formGroup.controls.FechaPago.value,
        importePago: this.formGroup.controls.ImportePago.value,
        fechaInicioVigencia: this.formGroup.controls.FechaInicioVigencia.value,
        fechaFinVigencia: this.formGroup.controls.FechaFinVigencia.value,
        proximoPago: new Date(this.formGroup.controls.FechaFinVigencia.value).getDay() - new Date(this.formGroup.controls.FechaInicioVigencia.value).getDay()
      }
      this.vehiculoDocumentoEvent.emit(this.item);
    } else { //Crear
      let vehiculoDocumento = {
        codigo: this.prefixName,
        idVehiculoDocumento: 0,
        idTipoDocumento: this.formGroup.controls.TipoDocumento.value,
        nombreTipoDocumento: this.array_tiposDocumentoVehiculo.find(e => e.valor === this.formGroup.controls.TipoDocumento.value).nombre,
        numeroDocumento: this.formGroup.controls.NumeroDocumento.value,
        fechaPago: this.formGroup.controls.FechaPago.value,
        importePago: this.formGroup.controls.ImportePago.value,
        fechaInicioVigencia: this.formGroup.controls.FechaInicioVigencia.value,
        fechaFinVigencia: this.formGroup.controls.FechaFinVigencia.value,
        proximoPago: new Date(this.formGroup.controls.FechaFinVigencia.value).getDay() - new Date(this.formGroup.controls.FechaInicioVigencia.value).getDay()
      }
      // console.log("hijo", this.array_vehiculoDocumento);
      this.vehiculoDocumentoEvent.emit(vehiculoDocumento);
    }
    this.modal.close(true);
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
