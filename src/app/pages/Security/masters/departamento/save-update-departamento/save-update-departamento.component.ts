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
  selector: 'app-save-update-departamento',
  templateUrl: './save-update-departamento.component.html',
  styleUrls: ['./save-update-departamento.component.scss']
})
export class SaveUpdateDepartamentoComponent implements OnInit {

    @Input() item: any;
    isLoading$;
    Departamento: number = 0;
    formGroup_2:FormGroup;
    formGroup: FormGroup;
    array_paises: any;

    private subscriptions: Subscription[] = [];

    constructor(
        private customersService: CustomersService,
        private fb: FormBuilder, 
        public modal: NgbActiveModal,
        public toastr: ToastrManager,
        public departamento_s: DepartamentoServiceService,
        public multitabla_s: MultitablaService,

    ) { }

    ngOnInit(): void {
        this.loadDepartamentoServicio();
        this.getPaises();
        this.isLoading$ = this.customersService.isLoading$;
    }
    
    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    loadDepartamentoServicio() {
        if (this.item !== null) {
            // console.log(this.item);
            this.Departamento = this.item.idDepartamento;
            this.loadForm();  
            this.formGroup.controls.Nombre.setValue(this.item.nombreDepartamento)
            this.formGroup.controls.Pais.setValue(this.item.idPais)
            this.formGroup.controls.Activo.setValue(this.item.activo)   

        } else {
            this.Departamento = 0;
            this.loadForm();
        }
    }

    loadForm() {
      this.formGroup = this.fb.group({
        Pais: [null, Validators.compose([Validators.required])],
        Nombre: [null, Validators.compose([Validators.required])],
        Activo: [true],      
      });
    }

    getPaises(){
    // this.filterGroup.controls.Pais.reset();
        this.multitabla_s.GetListarPaises().subscribe(
            (data: any) => {
                // console.log(data);
                this.array_paises = data;
                if(this.array_paises.length > 1){
                    this.array_paises.unshift({
                    Pais: 0, NombrePais: 'Todos'
                });               
            }  
        }, (errorServicio) => {
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
        if(this.formGroup.controls.Pais.value == undefined){
            return true
        }
        return this.formGroup.invalid;
    }

    private prepareUsuario() {
        const formData = this.formGroup.value;
        const idPais = this.formGroup.controls.Pais.value;
        return {
            Departamento: this.Departamento,
            NombreDepartamento:formData.Nombre,
            Pais: idPais,
            activo: formData.Activo,      
        } 
    }

    save() {
        let data = this.prepareUsuario();
        // console.log(data);
        this.departamento_s.SaveUpdateDepartamento(data).subscribe(
        (data:any) => {
            console.log(data);
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
