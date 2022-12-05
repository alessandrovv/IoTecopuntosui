import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Subscription } from 'rxjs';
import { CustomersService } from 'src/app/modules/e-commerce/_services';
import { ProyectosService } from '../../../_core/proyectos.service';

@Component({
  selector: 'app-save-proyecto-modal',
  templateUrl: './save-proyecto-modal.component.html',
  styleUrls: ['./save-proyecto-modal.component.scss']
})
export class SaveProyectoModalComponent implements OnInit {

  @Input() item: any;
  isLoading$;
  Proyecto: number = 0;  

  formGroup_2:FormGroup;
  formGroup:FormGroup;

  arrayCliente:any;
  private subscriptions: Subscription[] = [];
  constructor(
    private customersService: CustomersService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    public modal: NgbActiveModal,
    public toastr: ToastrManager,
    public proyecto_s: ProyectosService,
  ) { }

  ngOnInit(): void {
    this.filterForm();
      
    this.loadProyectoServicio();
    this.getCliente(); 
    
    this.isLoading$ = this.customersService.isLoading$;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }


  filterForm(){
    this.formGroup_2 = this.fb.group({
      Cliente:['0'],
      
    });

  }

  loadProyectoServicio() {
    if (this.item !== null) {
      this.Proyecto = this.item.idProyecto;
      this.loadForm();  
      this.formGroup.controls.Nombre.setValue(this.item.proyectos)
      this.formGroup.controls.FechaInicio.setValue(this.item.FechaInicio.split('T',1)[0])
      this.formGroup.controls.FechaFin.setValue(this.item.FechaFin == null? null : this.item.FechaFin.split('T', 1)[0])
      this.formGroup.controls.Activo.setValue(this.item.activo)    
      this.formGroup_2.controls.Cliente.setValue(this.item.idCliente) 
      console.log(this.item)
     } else {
      this.Proyecto = 0;
      this.loadForm();
     }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      Nombre: [null, Validators.compose([Validators.required])],
      FechaInicio: [null, Validators.compose([Validators.required])],
      FechaFin: [null] ,
      Activo: [true],      
    });

    this.formGroup_2 = this.fb.group({
      Cliente: [null, Validators.compose([Validators.required])],   
    });

  }

  getCliente(){
    this.proyecto_s.GetCliProyecto().pipe(    
    ).subscribe(
      (data: any) => {
        this.arrayCliente = data;
        console.log(this.arrayCliente);              
      }, (errorServicio) => { 
        console.log(errorServicio);
      }
    );
  }

  validoGuardar(){
    if(this.formGroup_2.controls.Cliente.value == undefined){
      return true
    }return this.formGroup.invalid;
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

  private prepareData() {
    const formData = this.formGroup.value;
    const idCliente = this.formGroup_2.controls.Cliente.value;
    return {
      Proyecto: this.Proyecto,
      Cliente: idCliente,
      NombreProyecto: formData.Nombre,
      FechaInicio: formData.FechaInicio,
      FechaFin: formData.FechaFin,
      Activo: formData.Activo,
    }   
  }

  save() {
    let data = this.prepareData();
    console.log(data)

    this.proyecto_s.insertUpdateProyecto(data).subscribe(

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
          //this.modal.close(true);   
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



}
