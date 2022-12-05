import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup , Validators} from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CustomersService } from 'src/app/modules/e-commerce/_services';
import { Subscription } from 'rxjs';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter} from '../../../../../_metronic/core';
import { CategoriaMaterialService } from '../../../_core/services/categoria-material.service';

@Component({
  selector: 'app-save-update-categoriamaterial',
  templateUrl: './save-update-categoriamaterial.component.html',
  styleUrls: ['./save-update-categoriamaterial.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class SaveUpdateCategoriamaterialComponent implements OnInit {

  @Input() item: any;
  isLoading$;
  idCategoriaMaterial: number = 0;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private customersService: CustomersService,
    private fb: FormBuilder, 
    public modal: NgbActiveModal,
    public categoria_s: CategoriaMaterialService,
    public toastr: ToastrManager,) { }

  ngOnInit(): void {
    this.isLoading$ = this.customersService.isLoading$;
    this.loadCategoria();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }


  loadCategoria() {
    console.log(this.item);
    if (this.item !== null) {
      this.idCategoriaMaterial = this.item.idCategoriaMaterial;
      this.loadForm();  
      this.formGroup.controls.Nombre.setValue(this.item.nombre)
      this.formGroup.controls.Descripcion.setValue(this.item.descripcion);      
      this.formGroup.controls.Activo.setValue(this.item.activo);      
    } else {
      console.log(this.item);
      this.idCategoriaMaterial = 0;
      console.log(this.idCategoriaMaterial);
      this.loadForm();
    }
  }
  loadForm() {
    this.formGroup = this.fb.group({
      Nombre: [null, Validators.compose([Validators.required])],
      Descripcion: [null, Validators.compose([Validators.required])],
      Activo: [true],      
    });
  }
  private prepareCategoria() {
    const formData = this.formGroup.value;
    return {
      idCategoriaMaterial: this.idCategoriaMaterial,      
      Nombre: formData.Nombre,
      Descripcion: formData.Descripcion,    
      Activo: formData.Activo
    }
    
  }
  
  save() {
    let data = this.prepareCategoria();
    this.categoria_s.SaveUpdateCategoriaMaterial(data).subscribe(
      (data:any) => {
        if (data[0].Success> 0) {
          this.toastr.successToastr(data[0].Message, 'Correcto!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });

          this.modal.close(true);  
        } else {
          this.toastr.errorToastr(data[0].Message,'REGISTRO FALLIDO', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
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

}
