import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Subscription } from 'rxjs';
import { SubcategoriaService } from '../../../_core/services/subcategoria.service';
import { CustomersService } from 'src/app/modules/e-commerce/_services';
import { MaterialService } from '../../../_core/services/material.service';

@Component({
  selector: 'app-save-update-subcategoria-modal',
  templateUrl: './save-update-subcategoria-modal.component.html',
  styleUrls: ['./save-update-subcategoria-modal.component.scss']
})
export class SaveUpdateSubcategoriaModalComponent implements OnInit {

  @Input() item: any;
  isLoading$;
  idSubcategoria: number = 0;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
	array_categorias: any;
  constructor(
    private customersService: CustomersService,
    private fb: FormBuilder, 
    public modal: NgbActiveModal,
    public material_s: MaterialService,
		public subcategoria_s: SubcategoriaService,
    public toastr: ToastrManager,
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.customersService.isLoading$;
    this.loadSubcategoria();
  }

	getCategorias(dataCabecera){
		this.material_s.GetCategorias().subscribe(
			(data:any)=>{
        if (dataCabecera != null) {
					if (data.find( categoria => categoria.Categoria === dataCabecera.idCategoria ) === undefined){
						data.push(
							{
								Categoria : dataCabecera.idCategoria,
								NombreCategoria: dataCabecera.categoria
							}
						);
					}
					this.array_categorias = data.sort((a,b) => a.NombreCategoria > b.NombreCategoria? 1 : -1);
					this.formGroup.controls.Categoria.setValue(dataCabecera.idCategoria);
				}
				else{
					this.array_categorias = data.sort((a,b) => a.NombreCategoria > b.NombreCategoria? 1 : -1);
				}
			}, (errorServicio)=>{
				console.log(errorServicio);
			}
		);
	}

  loadSubcategoria() {
    if (this.item !== null) {
      console.log('subcategoria:',this.item);
      this.idSubcategoria = this.item.idSubcategoria;
      this.loadForm();    
			this.getCategorias(this.item);
      this.formGroup.controls.Nombre.setValue(this.item.nombreSubcategoria);  
      this.formGroup.controls.Descripcion.setValue(this.item.descripcion);    
      this.formGroup.controls.Activo.setValue(this.item.estado);      
    } else {
      this.idSubcategoria = 0;
      this.loadForm();
			this.getCategorias(null);
    }
  }  

  loadForm() {
    this.formGroup = this.fb.group({
      Categoria: [null, Validators.compose([Validators.required])],
			Nombre: [null, Validators.compose([Validators.required])],
			Descripcion: [null, Validators.compose([Validators.required])],
      Activo: [true],      
    });
  }


  save() {
    let data = this.prepareSubcategoria();

		this.subcategoria_s.SaveUpdateSubcategoria(data).subscribe(
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

  private prepareSubcategoria() {
    
    const formData = this.formGroup.value;
    return {
      idSubcategoriaMaterial: this.idSubcategoria,
			idCategoriaMaterial: formData.Categoria,
			nombre: formData.Nombre,
			descripcion: formData.Descripcion,
      activo: formData.Activo,      
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
