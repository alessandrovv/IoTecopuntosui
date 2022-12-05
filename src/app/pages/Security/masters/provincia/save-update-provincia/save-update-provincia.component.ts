import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup , Validators} from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CustomersService } from 'src/app/modules/e-commerce/_services';
import { Subscription } from 'rxjs';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter} from '../../../../../_metronic/core';
import { ProvinciaServiceService } from '../../../_core/services/provincia-service.service';
import { MultitablaService } from 'src/app/pages/_core/services/multitabla.service';
import { DepartamentoServiceService } from '../../../_core/services/departamento-service.service';

@Component({
  selector: 'app-save-update-provincia',
  templateUrl: './save-update-provincia.component.html',
  styleUrls: ['./save-update-provincia.component.scss']
})
export class SaveUpdateProvinciaComponent implements OnInit {

    @Input() item: any;
    isLoading$;
    Provincia: number = 0;
    formGroup_2:FormGroup;
    formGroup: FormGroup;
    array_paises: any;
    array_departamentos: any;

    private subscriptions: Subscription[] = [];

    constructor(
        private customersService: CustomersService,
        private fb: FormBuilder, 
        public modal: NgbActiveModal,
        public toastr: ToastrManager,
        public provincia_s: ProvinciaServiceService,
        public multitabla_s: MultitablaService,
        public departamento_s:DepartamentoServiceService

    ) { }

    ngOnInit(): void {
        this.filterForm();
        this.getPaises();
        this.getDepartamentos(0);
        this.loadProvinciaServicio();
        this.isLoading$ = this.customersService.isLoading$;
    }
    
    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    loadProvinciaServicio() {
        if (this.item !== null) {
          this.Provincia = this.item.idProvincia;
          this.loadForm();  
          this.formGroup.controls.Nombre.setValue(this.item.nombreProvincia)
          this.formGroup.controls.Activo.setValue(this.item.activo)   
          // console.log(this.item)
          this.formGroup_2.controls.Pais.setValue(this.item.nombrePais)
          this.formGroup_2.controls.Departamento.setValue(this.item.idDepartamento)
        } else {
          this.Provincia = 0;
          this.loadForm();
        }
    }

    loadForm() {
        this.formGroup = this.fb.group({
          Nombre: [null, Validators.compose([Validators.required])],
          Activo: [true],      
        });

        this.formGroup_2 = this.fb.group({
            Pais: [null, Validators.compose([Validators.required])],
            Departamento: [null, Validators.compose([Validators.required])],      
          });

    }

    getPaises(){
        this.formGroup_2.controls.Pais.reset();
        this.multitabla_s.GetListarPaises().subscribe(
          (data:any)=>{
            this.array_paises = data;
            // console.log(data);
          },(error)=>{
            console.log('Error en subcategorias: ',error);
          }
        );
    }

    getDepartamentos(idPais){

        if(idPais == undefined){
            idPais = 0;
        }
          console.log(idPais)
          this.formGroup_2.controls.Departamento.reset();
          this.departamento_s.GetListarDepartamentos(idPais).subscribe(
            (data:any)=>{
              this.array_departamentos = data;
            },(error)=>{
              console.log('Error en subcategorias: ',error);
            }
        );

    }


    setPais(dpto: string){
        console.log(dpto)
        var idPais;
        this.array_departamentos.forEach(x=>{
            if(x.nombreDepartamento == dpto){
                idPais = x.idPais
            }
        })
    
        this.array_paises.forEach(x=>{
            if(x.Pais == idPais){
                this.formGroup_2.controls.Pais.setValue(x.idPais)
                console.log(x.NombrePais)
            }
        })
    }


    private prepareData() {
        const formData = this.formGroup.value;
        const idDpto = this.formGroup_2.controls.Departamento.value;
        return {
            Provincia: this.Provincia,      
            idDepartamento: idDpto,
            NombreProvincia: formData.Nombre,
            Activo: formData.Activo,
        }    
    }

    filterForm(){
        this.formGroup_2 = this.fb.group({
          Pais:['0'],
          Departamento:['0'],
        });
    }

    save() {
        let data = this.prepareData();
        console.log(data);
    
        this.provincia_s.SaveUpdateProvincia(data).subscribe(
    
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
        if(this.formGroup_2.controls.Departamento.value == undefined){
          return true
        }
        return this.formGroup.invalid;
    }

}
