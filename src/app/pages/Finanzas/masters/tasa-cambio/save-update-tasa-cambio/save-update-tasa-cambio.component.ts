import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Subscription } from 'rxjs';
import { CustomersService } from 'src/app/modules/e-commerce/_services';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../_metronic/core';
import { DatePipe } from '@angular/common';
import { MultitablaService } from 'src/app/pages/_core/services/multitabla.service';
import { TasaCambioService } from '../../../_core/services/tasa-cambio.service';

@Component({
  selector: 'app-save-update-tasa-cambio',
  templateUrl: './save-update-tasa-cambio.component.html',
  styleUrls: ['./save-update-tasa-cambio.component.scss'],
  providers:[DatePipe,
		{ provide: NgbDateAdapter, useClass: CustomAdapter },
		{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }]
})
export class SaveUpdateTasaCambioComponent implements OnInit {

  @Input() item: any;
  isLoading$;
  idTasaCambio: number = 0;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  array_monedas: any;
  constructor(
    private customersService: CustomersService,
    private fb: FormBuilder, 
    public modal: NgbActiveModal,
    public toastr: ToastrManager,
    private datePipe:DatePipe,
    private multitabla_s:MultitablaService,
    private tasaCambio_s:TasaCambioService
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.customersService.isLoading$;
    this.loadForm();
    this.loadCustomer();
  }

  loadCustomer(){
    if(this.item!=null){
      this.idTasaCambio = this.item.idTasaCambio;
      this.getMonedas(this.item);
      this.formGroup.controls.Fecha.setValue(this.datePipe.transform(this.item.fecha, 'yyyy-MM-dd'));
      this.formGroup.controls.ValorCompra.setValue(this.item.valorCompra);
      this.formGroup.controls.ValorVenta.setValue(this.item.valorVenta);
      this.formGroup.controls.Activo.setValue(this.item.activo);
    }else{
      this.idTasaCambio=0;
      this.getMonedas(null);
      this.formGroup.controls.Fecha.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
    }
  }

  loadForm(){
    this.formGroup = this.fb.group({
      Fecha:[null, Validators.compose([Validators.required])],
      IdMonedaOrigen:[null, Validators.compose([Validators.required])],
      IdMonedaDestino:[null, Validators.compose([Validators.required])],
      ValorCompra:[null, Validators.compose([Validators.required])],
      ValorVenta:[null, Validators.compose([Validators.required])],
      Activo:[true],
    });
  }

  getMonedas(item){
    this.multitabla_s.GetListarMoneda().subscribe(
      (data:any)=>{
        if(item!==null){
          if(data.find(e=>e.ValorMoneda===item.idMonedaOrigen)===undefined){
            data.push({
              ValorMoneda:item.idMonedaOrigen,
              NombreMoneda:item.NombreMonedaOrigen
            });
          }
          if(data.find(e=>e.ValorMoneda===item.idMonedaDestino)===undefined){
            data.push({
              ValorMoneda:item.idMonedaDestino,
              NombreMoneda:item.NombreMonedaDestino
            });
          }

          this.array_monedas = data;
          this.formGroup.controls.IdMonedaOrigen.setValue(item.idMonedaOrigen);
          this.formGroup.controls.IdMonedaDestino.setValue(item.idMonedaDestino);
        }else{
          this.array_monedas = data;
        }
      },(error)=>{
        console.log(error);
      }
    );
  }

  changeMoneda(item,tipo){
    if(tipo==1){
      if(this.formGroup.controls.IdMonedaDestino.value == item){
        this.formGroup.controls.IdMonedaOrigen.setErrors({repeat:true})
      }else{
        this.formGroup.controls.IdMonedaOrigen.setErrors(null)
      }
    }else{
      if(this.formGroup.controls.IdMonedaOrigen.value == item){
        this.formGroup.controls.IdMonedaDestino.setErrors({repeat:true});
      }else{
        this.formGroup.controls.IdMonedaDestino.setErrors(null);
      } 
    }
  }

  save(){
    let data = this.prepareCustomer();
    this.tasaCambio_s.SaveUpdateTasaCambio(data).subscribe(
      (data:any)=>{
        if (data[0].Success > 0) {
          this.toastr.successToastr(data[0].Message, 'Correcto!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });

          this.modal.close(true);  
        } else {
          this.toastr.errorToastr(data[0].Message, 'Error!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
      }
    },(error)=>{
      this.toastr.errorToastr('Ocurrio un error.', 'Error!', {
        toastTimeout: 2000,
        showCloseButton: true,
        animate: 'fade',
        progressBar: true
      });       
      console.log(error);
    });
  }

  private prepareCustomer(){
    const formData = this.formGroup.value;
    return {
      IdTasaCambio:this.idTasaCambio,
      Fecha:this.datePipe.transform(formData.Fecha, 'yyyy-MM-dd'),
      IdMonedaOrigen: formData.IdMonedaOrigen,
      IdMonedaDestino: formData.IdMonedaDestino,
      ValorCompra:formData.ValorCompra,
      ValorVenta:formData.ValorVenta,
      Activo:formData.Activo
    }
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
