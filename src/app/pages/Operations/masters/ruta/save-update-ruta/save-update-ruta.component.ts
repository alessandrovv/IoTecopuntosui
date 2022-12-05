import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup , Validators} from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CustomersService } from 'src/app/modules/e-commerce/_services';
import { Subscription } from 'rxjs';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter} from '../../../../../_metronic/core';
import { PuntosTransporteServiceService } from '../../../_core/services/puntos-transporte-service.service';
import { RutaServiceService } from '../../../_core/services/ruta-service.service';
@Component({
  selector: 'app-save-update-ruta',
  templateUrl: './save-update-ruta.component.html',
  styleUrls: ['./save-update-ruta.component.scss']
})
export class SaveUpdateRutaComponent implements OnInit {

  @Input() item: any;
  isLoading$;
  idRuta: number = 0;
  formGroup_2:FormGroup;
  formGroup: FormGroup;
  arrayPaises:any;
  arrayPuntosTransportes:any;
  arrarIds: any;
  idOrigen: number;
  idDestino: number;


  private subscriptions: Subscription[] = [];

  constructor(
    private customersService: CustomersService,
    private fb: FormBuilder, 
    public modal: NgbActiveModal,
    private ruta_s : RutaServiceService,
    private puntoTransporte_s: PuntosTransporteServiceService,
    private toastr: ToastrManager,
    ) { }

  ngOnInit(): void {
    this.getGroupPuntosTransporte();
    this.getPuntosTransporte();
    this.isLoading$ = this.customersService.isLoading$;
    this.loadClaseServicio();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }


  getGroupPuntosTransporte(){
    this.formGroup_2 = this.fb.group({
      Origen:[''],
      Destino:[''],
    });
  }

  loadClaseServicio() {
    console.log(this.item);
    if (this.item !== null) {
      this.idRuta = this.item.idRuta;
      this.loadForm();  
      this.formGroup_2.controls.Origen.setValue(this.item.nombreOrigen)
      this.idOrigen = this.item.idOrigen;
      this.idDestino = this.item.idDestino;
      this.formGroup_2.controls.Destino.setValue(this.item.nombreDestino)
      this.formGroup.controls.Distancia.setValue(this.item.distancia)
      this.formGroup.controls.Combustible.setValue(this.item.combustible)
      this.formGroup.controls.Activo.setValue(this.item.Activo);   
    } else {
      this.idRuta = 0;
      this.loadForm();
    }
  }
  loadForm() {
    this.formGroup = this.fb.group({
      Distancia: [null, Validators.compose([Validators.required])],
      Combustible: [null, Validators.compose([Validators.required])],
      Activo: [true],      
    });
  }

  setOrigen(idOrigen: any){
    this.idOrigen = idOrigen;
  }
  setDestino(idDestino: any){
    this.idDestino = idDestino;
  }

  private prepareData() {
    const formData = this.formGroup.value;
    return {      
      idRuta: this.idRuta,      
      idOrigen: this.idOrigen,
      idDestino: this.idDestino,    
      distancia: formData.Distancia,    
      combustible: formData.Combustible,    
      activo: formData.Activo,
    }    
  }

  getPuntosTransporte(){

    this.puntoTransporte_s.getPuntosTransporte().subscribe(
      (data:any)=>{
        this.arrayPuntosTransportes = data;
      },(error)=>{
        console.log('Error en subcategorias: ',error);
      }
    );
  }


  
  save() {
    let data = this.prepareData();


    console.log(data);
    
    this.ruta_s.insertUpdateRuta(data).subscribe(
      (data:any) => {
        console.log(data)
        if (data[0].Ok > 0) {
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
          this.modal.close(true);  
        }
               
      }, ( errorServicio ) => { 
        this.toastr.errorToastr('Ocurrio un error.', 'Error!', {
          toastTimeout: 2000,
          showCloseButton: true,
          animate: 'fade',
          progressBar: true
        });       
        console.log(errorServicio);
      }
    );
  }
  
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
  validoGuardar(){
    if(this.formGroup_2.controls.Origen.value == undefined){
      return true
    }
    if(this.formGroup_2.controls.Destino.value == undefined){
      return true
    }
    return this.formGroup.invalid;
  }

}
