import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup , Validators} from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CustomersService } from 'src/app/modules/e-commerce/_services';
import { Subscription } from 'rxjs';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter} from '../../../../../_metronic/core';
import { ClaseMaterialService } from '../../../_core/services/clase-material.service';
import { MaterialService } from '../../../_core/services/material.service';

@Component({
  selector: 'app-save-update-clase-material-modal',
  templateUrl: './save-update-clase-material-modal.component.html',
  styleUrls: ['./save-update-clase-material-modal.component.scss']
})
export class SaveUpdateClaseMaterialModalComponent implements OnInit {

  @Input() item: any;
  isLoading$;
  Material: number = 0;
  formGroup_2:FormGroup;
  formGroup: FormGroup;
  arrayCategorias:any;
  arraySubcategorias:any;

  private subscriptions: Subscription[] = [];

  constructor(
    private customersService: CustomersService,
    private fb: FormBuilder, 
    public modal: NgbActiveModal,
    public claseMaterial_s: ClaseMaterialService,
    public toastr: ToastrManager,
    public material_s:MaterialService,
    ) { }

  ngOnInit(): void {    
    this.isLoading$ = this.customersService.isLoading$;
    this.loadForm(); 
    this.loadClaseServicio();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }



  loadClaseServicio() {
    if (this.item !== null) {
      console.log('clase:',this.item);
      this.Material = this.item.Material;
      this.formGroup.controls.Nombre.setValue(this.item.NombreMaterial)
      this.formGroup.controls.Descripcion.setValue(this.item.Descripcion);      
      this.formGroup.controls.Codigo.setValue(this.item.Codigo);      
      this.formGroup.controls.Activo.setValue(this.item.EsActivo);   
      this.getCategorias(this.item);
      this.getSubcategorias(this.item.idCategoria, this.item);

    } else {
      this.Material = 0;
      this.loadForm();
      this.getCategorias(null);
      this.getSubcategorias(0, null);
    }
  }
  loadForm() {
    this.formGroup = this.fb.group({
      Categoria: [null, Validators.compose([Validators.required])],
      Subcategoria: [null, Validators.compose([Validators.required])],
      Nombre: [null, Validators.compose([Validators.required])],
      Descripcion: [null, Validators.compose([Validators.required])],
      Codigo: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[\s\S]{0,5}$/),
        ]),
      ],
      Activo: [true],
    });
  }
  private prepareData() {
    const formData = this.formGroup.value;
    return {
      Material: this.Material,      
      SubCategoria: formData.Subcategoria,
      Codigo: formData.Codigo,    
      NombreMaterial: formData.Nombre,
      Descripcion: formData.Descripcion,
      EsActivo: formData.Activo,
    }    
  }

  getSubcategorias(categoria,dataCabecera){

    if(categoria == undefined){
      categoria = 0;
    }
    this.formGroup.controls.Subcategoria.reset();

    this.material_s.GetSubcategorias(categoria).subscribe(
      (data:any)=>{
        //this.arraySubcategorias = data;
        console.log(data.length);
        if(dataCabecera!=null){
          if (data.find( subcategoria => subcategoria.Subcategoria === dataCabecera.idSubcategoria) === undefined){
						data.push(
							{
								Subcategoria : dataCabecera.idSubcategoria,
								NombreSubcategoria: dataCabecera.SubCategoria
							}
						);
					}
					this.arraySubcategorias = data.sort((a,b) => a.NombreSubcategoria > b.NombreSubcategoria? 1 : -1);
					this.formGroup.controls.Subcategoria.setValue(dataCabecera.idSubcategoria);
        }
        else{
					this.arraySubcategorias = data.sort((a,b) => a.NombreSubcategoria > b.NombreSubcategoria? 1 : -1);
				}
      },(error)=>{
        console.log('Error en subcategorias: ',error);
      }
    );
  }

  getCategorias(dataCabecera){
    this.formGroup.controls.Categoria.reset();
    this.material_s.GetCategorias().subscribe(
      (data:any)=>{
        //this.arrayCategorias = data;
        if (dataCabecera != null) {
					if (data.find( categoria => categoria.Categoria === dataCabecera.idCategoria ) === undefined){
						data.push(
							{
								Categoria : dataCabecera.idCategoria,
								NombreCategoria: dataCabecera.NombreCategoria
							}
						);
					}
					this.arrayCategorias = data.sort((a,b) => a.NombreCategoria > b.NombreCategoria? 1 : -1);
					this.formGroup.controls.Categoria.setValue(dataCabecera.idCategoria);
				}
				else{
					this.arrayCategorias = data.sort((a,b) => a.NombreCategoria > b.NombreCategoria? 1 : -1);
				}
      },(error)=>{
        console.log('Error en subcategorias: ',error);
      }
    );
  }


  
  save() {
    let data = this.prepareData();


    this.claseMaterial_s.insertUpdateClaseMaterial(data).subscribe(


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

  setCategoria(subCat: number){
    var idCat;
    this.arraySubcategorias.forEach(x=>{
      if(x.Categoria == subCat){
        idCat = x.Categoria
      }
    })

    this.arrayCategorias.forEach(x=>{
      if(x.Categoria == idCat){
        this.formGroup.controls.Categoria.setValue(x.Categoria)
      }
    })
  }


}
