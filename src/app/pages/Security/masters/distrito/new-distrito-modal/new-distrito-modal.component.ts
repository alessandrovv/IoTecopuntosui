import { ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CustomersService } from 'src/app/modules/e-commerce/_services';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DistritoServiceService } from '../../../_core/services/distrito-service.service';
import { MultitablaService } from 'src/app/pages/_core/services/multitabla.service';


@Component({
  selector: 'app-new-distrito-modal',
  templateUrl: './new-distrito-modal.component.html',
  styleUrls: ['./new-distrito-modal.component.scss']
})
export class NewDistritoModalComponent implements OnInit {

    @Input() item: any;
    isLoading$;
    Distrito: number = 0;
  
    filterGroup:FormGroup;
    formGroup: FormGroup;
    
    arrayPais:any;
    arrayDepartamento:any;
    arrayProvincia:any;
  
    private subscriptions: Subscription[] = [];
  
    constructor(
      private customersService: CustomersService,
      private fb: FormBuilder, 
      public modal: NgbActiveModal,
      public multitabla_s: MultitablaService,
      public distrito_s: DistritoServiceService,
      private chgRef: ChangeDetectorRef,
      public toastr: ToastrManager,
      ) { }
  
    ngOnInit(): void {
      this.filterForm();     
      this.loadClaseServicio();
      this.getPaises();
      
      this.isLoading$ = this.customersService.isLoading$;
  
    }
  
    ngOnDestroy(): void {
      this.subscriptions.forEach(sb => sb.unsubscribe());
    }
    loadClaseServicio() {
      
      if (this.item !== null) {
        this.Distrito = this.item.idDistrito;
        this.loadForm();
        this.formGroup.controls.Nombre.setValue(this.item.distrito);    
        this.formGroup.controls.Activo.setValue(this.item.activo);      
        this.getDepartamento(this.item.idPais);
        this.getProvincia(this.item.idDepartamento);
        this.filterGroup.controls.Pais.setValue(this.item.pais);
        this.filterGroup.controls.Departamento.setValue(this.item.idDepartamento);  
        this.filterGroup.controls.Provincia.setValue(this.item.idProvincia);
        console.log(this.item);          
      } else {       
        this.Distrito = 0;
        this.loadForm();
        
      }
    }
  
    loadForm() {
      this.formGroup = this.fb.group({
        Nombre: [null, Validators.compose([Validators.required])],    
        Activo: [true],
      });
      this.filterGroup = this.fb.group({
        Pais: [null, Validators.compose([Validators.required])],
        Departamento: [null, Validators.compose([Validators.required])],
        Provincia: [null, Validators.compose([Validators.required])],      
      });
    }
  

    getProvincia(idDepartamento){
      if(idDepartamento == undefined){
        idDepartamento = 0;
      }
      this.filterGroup.controls.Provincia.setValue(null);
      // this.filterGroup.controls.Provincia.reset();
      if (idDepartamento != null) {
        this.distrito_s.GetobtenerDataProvincia(idDepartamento).pipe(
          finalize(() => {             
          })
          ).subscribe(
        (data: any) => {
          this.arrayProvincia = data;
          console.log(this.arrayProvincia);

      }, (errorServicio) => {

        console.log(errorServicio);
      }
      );
    }else {
        this.arrayProvincia = [];
      }
    }
    
  
    getDepartamento(Pais){
      console.log("Pais: " + Pais);

      this.filterGroup.controls.Departamento.setValue(null);
    if (Pais != null) {
      this.multitabla_s.GetListarDepartamentos(Pais).pipe(
        finalize(() => {          
        })
      ).subscribe(
        (data:any) => {
          console.log(data);          
          this.arrayDepartamento = data;
          console.log(this.arrayDepartamento)   
          this.arrayProvincia = [];       
        }, ( errorServicio ) => {           
          console.log(errorServicio);
        }
      );
    }
    }
  
    getPaises(){     
      this.filterGroup.controls.Pais.reset();
      this.multitabla_s.GetListarPaises().pipe(
      ).subscribe(
    (data: any) => {
      this.arrayPais = data;
      console.log(this.arrayPais);
    }, (errorServicio) => {
      console.log(errorServicio);
    }
  );
    }

    setPais(dept: number){
      var idpas;
      this.arrayProvincia.forEach(x=>{
        if(x.Pais == dept){
          idpas = x.Pais
        }
      })
      this.arrayDepartamento.forEach(x=>{
        if(x.Pais == dept){
          idpas = x.Pais
        }
      })
      this.arrayPais.forEach(x=>{
        if(x.Pais == idpas){
          this.filterGroup.controls.Pais.setValue(x.pais)
        }
      })
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
    
  
    filterForm(){
      this.filterGroup = this.fb.group({
        Pais:['0'],
        Departamento:['0'],
        Provincia:['0'],
      });
    }
  
  
    validoGuardar(){
      if(this.filterGroup.controls.Pais.value == undefined){
        return true
      }
      if(this.filterGroup.controls.Departamento.value == undefined){
        return true
      }if(this.filterGroup.controls.Provincia.value == undefined){
        return true
      }return this.formGroup.invalid;
    }

    private prepareData() {
      const formData = this.formGroup.value;
      const idPais = this.filterGroup.controls.Pais.value;
      const idDepartamento = this.filterGroup.controls.Departamento.value;
      const idProvincia = this.filterGroup.controls.Provincia.value;
      return {
        Distrito: this.Distrito,
        Pais: idPais,
        Departamento: idDepartamento,
        idProvincia:idProvincia,
        NombreDistrito: formData.Nombre,
        Activo: formData.Activo,
      }    
    }

    save() {
      let data = this.prepareData();
  
  
      this.distrito_s.insertUpdateDistrito(data).subscribe(
  
  
        (data:any) => {
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
            // this.modal.close(true);  
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
  
