import { ChangeDetectorRef, Component, OnInit,Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CustomersService } from 'src/app/modules/e-commerce/_services';
import { Subscription } from 'rxjs';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DistritoServiceService } from '../../../_core/services/distrito-service.service';
import { MultitablaService } from 'src/app/pages/_core/services/multitabla.service';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';


@Component({
  selector: 'app-save-update-distrito-modal',
  templateUrl: './save-update-distrito-modal.component.html',
  styleUrls: ['./save-update-distrito-modal.component.scss']
})
export class SaveUpdateDistritoModalComponent implements OnInit {

  @Input() item: any;
  isLoading$;
  Distrito: number = 0;

  formGroup_2:FormGroup;
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
    this.getPaises();
    this.loadClaseServicio();
    
    
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
      this.formGroup_2.controls.Pais.setValue(this.item.pais);
      this.formGroup_2.controls.Departamento.setValue(this.item.idDepartamento);  
      this.formGroup_2.controls.Provincia.setValue(this.item.idProvincia);
      console.log(this.item);     
    } else {    
      this.Distrito = 0;
      this.loadForm();
      this.getDepartamento(0);
      this.getProvincia(0);    
    }
  }

  private prepareData() {
    const formData = this.formGroup.value;
    const idPais = this.formGroup_2.controls.Pais.value;
    const idDepartamento = this.formGroup_2.controls.Departamento.value;
    const idProvincia = this.formGroup_2.controls.Provincia.value;
    return {
      Distrito: this.Distrito,
      Pais: idPais,
      Departamento: idDepartamento,
      idProvincia:idProvincia,
      NombreDistrito: formData.Nombre,
      Activo: formData.Activo,
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
		  Provincia: [null, Validators.compose([Validators.required])],      
    });
  }

  getProvincia(idDepartamento){
    if(idDepartamento == undefined){
      idDepartamento = 0;
    }
    this.formGroup_2.controls.Provincia.reset();
    this.distrito_s.GetobtenerDataProvincia(idDepartamento).subscribe(
      (data: any) => {
				this.arrayProvincia = data;
        console.log(this.arrayProvincia);			
			}, (errorServicio) => {

				console.log(errorServicio);
			}
    );
  }
  

  getDepartamento(idPais){
    if (idPais !== 1) {
			this.formGroup_2.removeControl('Departamento');
			this.formGroup_2.removeControl('Provincia');
			this.formGroup_2.addControl("Departamento", new FormControl(null));
			this.formGroup_2.addControl("Provincia", new FormControl(null));
		}
    else if(idPais == undefined){
    idPais = 0;}
    this.formGroup_2.controls.Departamento.reset();
		this.distrito_s.GetobtenerDataDepartamentos(idPais).subscribe(
			(data: any) => {
				this.arrayDepartamento = data;
        console.log(this.arrayDepartamento);
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
  }

  getPaises(){
    this.multitabla_s.GetListarPaises().subscribe(
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
        this.formGroup_2.controls.Pais.setValue(x.pais)
      }
    })
  }

  setDepartamento(prov: number){
    var idprov;
    this.arrayProvincia.forEach(x=>{
      if(x.Departamento == prov){
        idprov = x.Departamento
      }
    })

    this.arrayDepartamento.forEach(x=>{
      if(x.Departamento == idprov){
        this.formGroup_2.controls.Departamento.setValue(x.departamento)
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
    this.formGroup_2 = this.fb.group({
      Pais:['0'],
      Departamento:['0'],
      Provincia:['0'],
    });
  }


  validoGuardar(){
    if(this.formGroup_2.controls.Pais.value == undefined){
      return true
    }
    if(this.formGroup_2.controls.Departamento.value == undefined){
      return true
    }if(this.formGroup_2.controls.Provincia.value == undefined){
      return true
    }return this.formGroup.invalid;
  }

  save() {
    let data = this.prepareData();
    console.log(data)


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

  

}
