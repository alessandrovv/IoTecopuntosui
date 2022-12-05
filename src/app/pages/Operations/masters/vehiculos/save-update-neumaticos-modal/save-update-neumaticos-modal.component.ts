import { E } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Subscription } from 'rxjs';
import { CustomersService } from 'src/app/modules/e-commerce/_services';
import { NeumaticoService } from '../../../_core/services/neumatico.service';

@Component({
  selector: 'app-save-update-neumaticos-modal',
  templateUrl: './save-update-neumaticos-modal.component.html',
  styleUrls: ['./save-update-neumaticos-modal.component.scss']
})
export class SaveUpdateNeumaticosModalComponent implements OnInit {

  @Input() item: any = null;
  isLoading$;
  formGroup: FormGroup;
  uniqueValue = `c_${(new Date()).getTime()}_`;

  private subscriptions: Subscription[] = [];


  array_neumaticoMarcas: any;
  array_neumaticoTipos: any;
  array_neumaticoPosiciones: any;

  array_vehiculoNeumaticos: any = [];
  @Output() vehiculoNeumaticoEvent = new EventEmitter<any>();
  constructor(
    private customersService: CustomersService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    public toastr: ToastrManager,
    public neumatico_s: NeumaticoService,
    private chgRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.customersService.isLoading$;
    this.loadForm();
    this.getMarcaNeumatico();
    this.getTipoNeumatico();
    this.getPosicionNeumatico();
    if (this.item !== null) {
      this.loadNeumatico();
    }
  }
  
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
 
  getMarcaNeumatico() {
    let defaultIndex
    this.neumatico_s.GetMarcasNeumatico().subscribe(
      (data: any) => {
        this.array_neumaticoMarcas = data;
      }
    )
  }

  
  getTipoNeumatico() {
    let defaultIndex
    this.neumatico_s.GetTiposNeumatico().subscribe(
      (data: any) => {
        this.array_neumaticoTipos = data;
      }
    )
  }

  getPosicionNeumatico() {
    let defaultIndex
    this.neumatico_s.GetPosicionNeumatico().subscribe(
      (data: any) => {
        this.array_neumaticoPosiciones = data;
      }
    )
  }

  loadNeumatico(){
    console.log("ITEM EN NEUMATICO MODAL", this.item);

    this.formGroup.controls.Codigo.setValue(this.item.codigo);
    this.formGroup.controls.Nombre.setValue(this.item.nombre);
    this.formGroup.controls.Tamanio.setValue(this.item.tamanio);
    this.formGroup.controls.Traccion.setValue(this.item.traccion);
    this.formGroup.controls.SurcoInicial.setValue(this.item.surcoInicial);
    this.formGroup.controls.Marca.setValue(this.item.idMarca);
    this.formGroup.controls.Tipo.setValue(this.item.idTipo);
    this.formGroup.controls.Posicion.setValue(this.item.idPosicion);
    this.formGroup.controls.CostoUnitario.setValue(this.item.costoUnitario);
    this.formGroup.controls.Activo.setValue(this.item.activo);


  }

  loadForm(){
    this.formGroup = this.fb.group({
      Codigo: [null, Validators.compose([Validators.required])],
      Nombre: [null, Validators.compose([Validators.required])],
      Tamanio: [null, Validators.compose([Validators.required])],
      Traccion: [null, Validators.compose([Validators.required])],
      SurcoInicial: [null, Validators.compose([Validators.required])],
      Marca: [null, Validators.compose([Validators.required])],
      Tipo: [null, Validators.compose([Validators.required])],
      Posicion: [null, Validators.compose([Validators.required])],
      CostoUnitario: [null, Validators.compose([Validators.required])],
      Activo: [true, Validators.compose([Validators.required])],
    });
  }

  addNeumatico(){

    if (this.item != null) {//Editar
      this.item = {
        codigoUnique: this.item.codigoUnique,
        idVehiculoNeumatico: this.item.idVehiculoNeumatico,
        codigo: this.formGroup.controls.Codigo.value,
        nombre: this.formGroup.controls.Nombre.value,
        tamanio: this.formGroup.controls.Tamanio.value,
        traccion: this.formGroup.controls.Traccion.value,
        surcoInicial: this.formGroup.controls.SurcoInicial.value,
        idMarca:this.formGroup.controls.Marca.value,
        nombreMarca:this.array_neumaticoMarcas.find(e=> e.valor == this.formGroup.controls.Marca.value).nombre,
        idTipo: this.formGroup.controls.Tipo.value,
        nombreTipo:this.array_neumaticoTipos.find(e=> e.valor == this.formGroup.controls.Tipo.value).nombre,
        idPosicion: this.formGroup.controls.Posicion.value,
        nombrePosicion:this.array_neumaticoPosiciones.find(e=> e.valor == this.formGroup.controls.Posicion.value).nombre,
        costoUnitario: this.formGroup.controls.CostoUnitario.value,
        activo: this.formGroup.controls.Activo.value,
      }
      this.vehiculoNeumaticoEvent.emit(this.item);
    } else { //Crear
      let vehiculoNeumatico = {
        codigoUnique: this.uniqueValue,
        idVehiculoNeumatico: 0,
        codigo: this.formGroup.controls.Codigo.value,
        nombre: this.formGroup.controls.Nombre.value,
        tamanio: this.formGroup.controls.Tamanio.value,
        traccion: this.formGroup.controls.Traccion.value,
        surcoInicial: this.formGroup.controls.SurcoInicial.value,
        idMarca:this.formGroup.controls.Marca.value,
        nombreMarca:this.array_neumaticoMarcas.find(e=> e.valor == this.formGroup.controls.Marca.value).nombre,
        idTipo: this.formGroup.controls.Tipo.value,
        nombreTipo:this.array_neumaticoTipos.find(e=> e.valor == this.formGroup.controls.Tipo.value).nombre,
        idPosicion: this.formGroup.controls.Posicion.value,
        nombrePosicion:this.array_neumaticoPosiciones.find(e=> e.valor == this.formGroup.controls.Posicion.value).nombre,
        costoUnitario: this.formGroup.controls.CostoUnitario.value,
        activo: this.formGroup.controls.Activo.value,
      }
      this.vehiculoNeumaticoEvent.emit(vehiculoNeumatico);
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
