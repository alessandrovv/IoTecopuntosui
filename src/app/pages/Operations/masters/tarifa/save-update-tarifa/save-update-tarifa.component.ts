import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup , Validators} from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CustomersService } from 'src/app/modules/e-commerce/_services';
import { Subscription } from 'rxjs';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter} from '../../../../../_metronic/core';
import { PuntosTransporteServiceService } from '../../../_core/services/puntos-transporte-service.service';
import { ClientesService } from 'src/app/pages/Sales/_core/clientes.service';
import { RutaServiceService } from '../../../_core/services/ruta-service.service';
import { TarifaService } from '../../../_core/services/tarifa.service';
import { UtilService } from 'src/app/pages/_shared/util.service';
import { C } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-save-update-tarifa',
  templateUrl: './save-update-tarifa.component.html',
  styleUrls: ['./save-update-tarifa.component.scss']
})
export class SaveUpdateTarifaComponent implements OnInit {

  @Input() item: any;
  tipoTarifa = "Nueva"
  isLoading$;
  idTarifa: number = 0;
  formDataTarifa:FormGroup;
  arrayClientes:any;
  arrayMonedas:any;
  estaGuardando = false;
  fechaActual = new Date().toISOString().split("T",1)[0];

  private subscriptions: Subscription[] = [];
  arrayRutas: any;

  constructor(
    private customersService: CustomersService,
    private fb: FormBuilder, 
    private cliente_S : ClientesService,
    private ruta_s : RutaServiceService,
    private tarifa_s : TarifaService,
    public modal: NgbActiveModal,
    private toastr: ToastrManager,
    private util_S : UtilService,
    ) { }

  ngOnInit(): void {
    this.loadFormTarifa();
    this.getClientes();
    this.isLoading$ = this.customersService.isLoading$;
    this.loadTarifa();
    this.getRutas();
    this.getMonedas();

    
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  loadFormTarifa(){
    this.formDataTarifa = this.fb.group({
      Ruta : [null, Validators.compose([Validators.required])],
      Cliente : [null],
      Moneda : [null, Validators.compose([Validators.required])],
      Costo : [null, Validators.compose([Validators.required])],
      fechaInicio : [this.fechaActual, Validators.compose([Validators.required])],
      fechaFin : [null],
      Activo : [true], 
    });
  }

  loadTarifa() {
    if (this.item !== null) {
      this.idTarifa = this.item.idTarifa;

      this.formDataTarifa.controls.Ruta.setValue(this.item.idRuta)
      this.formDataTarifa.controls.Cliente.setValue(this.item.idCliente)
      this.formDataTarifa.controls.Moneda.setValue(this.item.idMoneda)

      this.formDataTarifa.controls.Costo.setValue(this.item.costo)
      this.formDataTarifa.controls.fechaInicio.setValue(this.item.fechaInicio.split("T",1)[0])
      this.formDataTarifa.controls.fechaFin.setValue(this.item.fechaFin.split("T",1)[0])
      this.formDataTarifa.controls.Activo.setValue(this.item.activo)

    } else {
      this.idTarifa = 0;
    }
  }

  private prepareData() {
    const formData = this.formDataTarifa.value;
    return {      
      idTarifa: this.idTarifa,      
      idRuta: formData.Ruta,
      idCliente: formData.Cliente,    
      idMoneda: formData.Moneda,    
      costo: formData.Costo,    
      fechaInicio : formData.fechaInicio,
      fechaFin: formData.fechaFin,
      activo: formData.Activo,
    }    
  }

  getRutas(){
    this.ruta_s.getRutas().subscribe(
      (data:any)=>{
        this.arrayRutas = data;
      },(error)=>{
        console.log('Error en subcategorias: ',error);
      }
    );
  }

  getMonedas(){
    this.tarifa_s.getMonedas().subscribe(
      (data:any)=>{
        this.arrayMonedas = data;
      },(error)=>{
        console.log('Error en subcategorias: ',error);
      }
    );
  }

  getClientes(){
    this.cliente_S.GetClientes(0,0,1).subscribe(
      (data:any)=>{
        this.arrayClientes= data;
      },(error)=>{
        console.log('Error en subcategorias: ',error);
      }
    );
  }
  
  save() {

    

    let data = this.prepareData();
    console.log(data)
    this.estaGuardando = true;
    this.tarifa_s.insertUpdateTarifa(data).subscribe(
      (data:any) => {
        this.estaGuardando = false;
        this.util_S.viewModalExito(data[0].Ok, data[0].Message, this.modal);               
      }, ( errorServicio ) => { 
        this.estaGuardando = false;
        this.util_S.viewError(errorServicio);
      }
    );
  }
  
  isControlValid(controlName: string): boolean {
    const control = this.formDataTarifa.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formDataTarifa.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
  controlHasError(validation, controlName): boolean {
    const control = this.formDataTarifa.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formDataTarifa.controls[controlName];
    return control.dirty || control.touched;
  }

  validoGuardar(){
    return this.formDataTarifa.invalid || this.estaGuardando;
  }
}
