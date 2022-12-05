import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SubheaderService } from '../../../../../_metronic/partials/layout/subheader/_services/subheader.service';
import { ConditionEnum } from '../../../_core/models/condition.enum.model';
import { Metadata } from '../../../_core/models/metadata.model';
import { TypeControlEnum } from '../../../_core/models/type-control.enum.model';
import { MetadataService } from '../../../_core/services/metadata.service';
import { TypeStringEnum } from '../../../_core/models/type-string-request.enum';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  providers: [DatePipe]

})
export class DynamicFormComponent implements OnInit {
  @Input() showUser: boolean = false;
  @Input() metadata: Array<Metadata> = [];
  @Input() respuestas: Array<any> = [];
  @Input() classControl: string = 'col-lg-12';
  data: any = {};
  @Output() dataLoaded = new EventEmitter();

  readyForm = false;
  form: FormGroup = null;
  prefixNameControl = `c_${(new Date()).getTime()}_`;

  filenameDefault = 'Seleccione el archivo';
  controlsEnum: typeof TypeControlEnum = TypeControlEnum;

  constructor(
    private metadataService: MetadataService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    public toastr: ToastrManager,
  ) { }

  ngOnInit() {
    console.log('object');
    console.log(this.metadata);
    this.loadData();
  }


  
  loadData() {
    this.readyForm = false;
    this.data = {};
    const controls: any = {};
    this.metadata.forEach(control => {
      this.data[control.ConfigDatoContrato] = {
        DatoContrato: control.DatoContrato,
        IdConfigDatoContrato: control.ConfigDatoContrato,
        ControlName: `${this.prefixNameControl}${control.ConfigDatoContrato}`,
        TipoDatoRespuesta: control.TipoDatoRespuesta,
        NombreDato: control.NombreDato,
        value: null
      };
      if (control.defaultValue) {
        this.data[control.ConfigDatoContrato].value = control.defaultValue;
      }

      if (control.TipoDatoRespuesta === TypeControlEnum.CHECK) {
        this.data[control.ConfigDatoContrato].value = false;
      }

      console.log(this.data[control.ConfigDatoContrato].value);
      controls[this.data[control.ConfigDatoContrato].ControlName] = [this.data[control.ConfigDatoContrato].value, []];   
    });
    this.form = this.formBuilder.group(controls);
   
    this.dataLoaded.emit(this.data);
    console.log(this.form);
    console.log(this.data);
    this.readyForm = true;
  }

  loadRespuesta(control) {
    const respuesta = this.respuestas.find(r => r.Pregunta === control.ID);
    if (respuesta) {
      this.data[control.ID].value = respuesta.Respuesta;
      this.data[control.ID].valueExtra1 = respuesta.RespuestaExtra1;

      if (control.TipoDatoRespuesta === TypeControlEnum.CHECK) {
        this.data[control.ID].value = respuesta.Respuesta === TypeStringEnum.TRUE;
      }
      if (control.TipoDatoRespuesta === TypeControlEnum.DATE &&
        control.FechaAutomaticaIgnoraEdicion) {
        this.data[control.ID].value = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      }
    }
  }

  isRequired(control) {
    return control.Obligatorio;
  }

  isInvalidForm() {
    return this.form.invalid;
  }

  detectErrors() {
    Object.keys(this.form.controls).forEach(controlName =>
      this.form.controls[controlName].markAsTouched());
  }

  isControlValid(controlName: string): boolean {
    const control = this.form.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.form.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

}
