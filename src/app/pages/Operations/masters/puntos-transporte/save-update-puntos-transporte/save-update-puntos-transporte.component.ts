import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup , Validators} from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CustomersService } from 'src/app/modules/e-commerce/_services';
import { Subscription } from 'rxjs';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter} from '../../../../../_metronic/core';
import { PuntosTransporteServiceService } from '../../../_core/services/puntos-transporte-service.service';

@Component({
  selector: 'app-save-update-puntos-transporte',
  templateUrl: './save-update-puntos-transporte.component.html',
  styleUrls: ['./save-update-puntos-transporte.component.scss']
})
export class SaveUpdatePuntosTransporteComponent implements OnInit {

  @Input() item: any;
  isLoading$;
  idPuntoTransporte: number = 0;
  formGroup_2:FormGroup;
  formGroup: FormGroup;
  arrayPaises:any;
  arrayUbicaciones:any;
  arrarIds: any;

  private subscriptions: Subscription[] = [];

  constructor(
    private customersService: CustomersService,
    private fb: FormBuilder, 
    public modal: NgbActiveModal,
    private puntoTransporte_s: PuntosTransporteServiceService,
    private toastr: ToastrManager,
    ) { }

  ngOnInit(): void {
    this.filterForm();
    this.getPaises();
    this.getUbicaciones(1);
    this.isLoading$ = this.customersService.isLoading$;
    this.loadClaseServicio();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }


  filterForm(){
    this.formGroup_2 = this.fb.group({
      Pais:['Peru'],
      Ubicacion:[''],
    });
  }

  loadClaseServicio() {
    if (this.item !== null) {
      this.idPuntoTransporte = this.item.idPuntoTransporte;
      this.loadForm();  
      this.formGroup_2.controls.Pais.setValue(this.item.NombrePais)
      this.formGroup_2.controls.Ubicacion.setValue(this.item.Ubicacion)
      this.formGroup.controls.Nombre.setValue(this.item.Nombre)
      this.formGroup.controls.Activo.setValue(this.item.Activo);   
    } else {
      this.idPuntoTransporte = 0;
      this.loadForm();
    }
  }
  loadForm() {
    this.formGroup = this.fb.group({
      Nombre: [null, Validators.compose([Validators.required])],
      Activo: [true],      
    });
  }

  setUbicacion(data: any){
    console.log(data); 
    this.arrarIds = data;
    console.log(this.arrarIds); 
  }

  private prepareData() {
    const formData = this.formGroup.value;
    return {      
      idPuntoTransporte: this.idPuntoTransporte,      
      idPais: this.arrarIds.idPais,
      idDepartamento: this.arrarIds.idDepartamento,    
      idProvincia: this.arrarIds.idProvincia,    
      idDistrito: this.arrarIds.idDistrito,    
      Nombre: formData.Nombre,
      Activo: formData.Activo,
    }    
  }

  getUbicaciones(idPais){

    this.formGroup_2.controls.Ubicacion.reset();

    this.puntoTransporte_s.getUbicaciones(idPais).subscribe(
      (data:any)=>{
        this.arrayUbicaciones = data;
      },(error)=>{
        console.log('Error en subcategorias: ',error);
      }
    );
  }

  getPaises(){
    this.formGroup_2.controls.Pais.reset();
    this.puntoTransporte_s.getPaises().subscribe(
      (data:any)=>{
        this.arrayPaises= data;
        this.formGroup_2.controls.Pais.setValue('Perú')
      },(error)=>{
        console.log('Error en subcategorias: ',error);
      }
    );
  }


  
  save() {
    let data = this.prepareData();
    console.log(data);
    this.puntoTransporte_s.insertUpdatePuntosTransporte(data).subscribe(
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
    if(this.formGroup_2.controls.Pais.value == undefined){
      return true
    }
    if(this.formGroup_2.controls.Ubicacion.value == undefined){
      return true
    }
    return this.formGroup.invalid;
  }

}
