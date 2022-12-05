import { ActivatedRoute, Router } from '@angular/router';
import { element } from 'protractor';
import { MatTableDataSource } from '@angular/material/table';
import { GetCaracteristicaVehiculo } from './../../../../Operations/_core/models/tipoVehiculo.interface';
import { TableResponseModel } from 'src/app/_metronic/shared/crud-table';
import { ToastrManager } from 'ng6-toastr-notifications';
import { TipoVehiculoService } from './../../../../Operations/_core/services/tipo-vehiculo.service';
import { CustomersService } from './../../../../../modules/e-commerce/_services/customers.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../_metronic/core';
import { NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ClaseMaterialService } from '../../../_core/services/clase-material.service';
import { MaterialService } from '../../../_core/services/material.service';

@Component({
  selector: 'app-save-update-clase-material',
  templateUrl: './save-update-clase-material.component.html',
  styleUrls: ['./save-update-clase-material.component.scss']
})
export class SaveUpdateClaseMaterialComponent implements OnInit {
  @Input() item: any;
  isLoading$;
  idClaseMaterial: number = 0;
  formGroup: FormGroup;

  arrayCategorias:any;
  arraySubcategorias:any;

  // formDatos:FormGroup;
  fromDetalles: FormGroup;
  array_data: TableResponseModel<GetCaracteristicaVehiculo>;
  array_tipoDato : any;
  listData: MatTableDataSource<any>;
  load_data: boolean = true;
  no_data: boolean = false;
  searchBan: boolean = false;
  displayedColumns: string[] = ['Nro', 'Hablitado', 'Obligatoria', 'Tipo de Dato'];

  



  constructor(
    private customersService: CustomersService,
    private fb: FormBuilder,
    public tipoVehiculo_s : TipoVehiculoService,
    public toastr: ToastrManager,
    private route: ActivatedRoute,
    private chgRef: ChangeDetectorRef, 
    private router: Router, 
    public material_s:MaterialService, 
    private claseMaterialService: ClaseMaterialService,
    
  ) { }
  ngOnInit(): void {
   this.getTipoDatos();
   this.getCategorias();
   this.getSubcategorias(0);
   this.idClaseMaterial = this.route.snapshot.queryParams["id"] || 0;
  if(this.idClaseMaterial > 0){
     this.getClaseMaterialDetalle(this.idClaseMaterial);
     this.chgRef.markForCheck(); 
  }else{
    this.getCaractersiticasClaseMaterialesNuevo();
  }
   
  }
  array_CaracteristicasClaseMaterial: any =[];
  

  formDatos:FormGroup = this.fb.group({
      Categoria : [null, Validators.compose([Validators.required])],
      SubCategoria: [null, Validators.compose([Validators.required])],
      Nombre: [null, Validators.compose([Validators.required])],
      Descripcion: [null, Validators.compose([Validators.required])],
      Codigo: [null, Validators.compose([Validators.required])],
      Activo: [true],
      TodoHabilitado:[true],
      TodoObligatorio:[true],
      TodoTipoDato:[null] ,   
      caracteristicas : this.fb.array([]),   
    })

  
    getSubcategorias(categoria){

      if(categoria == undefined){
        categoria = 0;
      }
  
      this.formDatos.controls.SubCategoria.reset();
  
      this.material_s.GetSubcategorias(categoria).subscribe(
        (data:any)=>{
          // console.log(data);
          this.arraySubcategorias = data;
        },(error)=>{
          console.log('Error en subcategorias: ',error);
        }
      );
    }
  
    getCategorias(){
      this.formDatos.controls.Categoria.reset();
      this.material_s.GetCategorias().subscribe(
        (data:any)=>{
          // console.log(data);
          this.arrayCategorias = data;
        },(error)=>{
          console.log('Error en subcategorias: ',error);
        }
      );
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
          this.formDatos.controls.Categoria.setValue(null)
        }
      })
    }
  

  get arrayCaracteriticas(){
     return this.formDatos.get('caracteristicas') as FormArray; 
  }
  caracteristica : FormControl= this.fb.control('', Validators.compose([Validators.required]));

  isControlValid(controlName: string): boolean {
    const control = this.formDatos.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formDatos.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
  controlHasError(validation, controlName): boolean {
    const control = this.formDatos.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formDatos.controls[controlName];
    return control.dirty || control.touched;
  }


  getCaractersiticasClaseMaterialesNuevo(){
    // let array = data;
    this.claseMaterialService.GetCaracteristicaClaseMateriales().subscribe(
     (data:any) => {
      //  console.log(data);
        this.array_CaracteristicasClaseMaterial = data;
        console.log(this.array_CaracteristicasClaseMaterial)
        for (let i = 0; i < this.array_CaracteristicasClaseMaterial.length; i++) {
        this.arrayCaracteriticas.push(new FormGroup({
          idCaracteristicaMaterial: new FormControl(this.array_CaracteristicasClaseMaterial[i].idCaracteristicaMaterial),
          Habilitado: new FormControl(true),
          Obligatorio: new FormControl(true),
          tipoDato : new FormControl(null)
        }));
        this.chgRef.markForCheck(); 
      }
     },(error)=>{
      console.log('Error en Caracteristicas Vehiculo: ',error);
     }
    );
 }
 getCaractersiticasClaseMaterialDetalle(dataEx){
  // console.log(dataEx);
  let array = dataEx;
  this.array_CaracteristicasClaseMaterial = dataEx;
    for (let i = 0; i < array.length; i++) {
    this.arrayCaracteriticas.push(new FormGroup({
      idCaracteristicaMaterial: new FormControl(array[i].idCaracteristicaMaterial),
      Habilitado: new FormControl(array[i].habilitado),
      Obligatorio: new FormControl(array[i].obligatorio),
      tipoDato : new FormControl(array[i].idTipoDato),
    })); 
      this.chgRef.markForCheck(); 
      this.verificarTodoObligatorio();
      this.verificarTodoHabilitado();
  }
}

verificarTodoObligatorio(){
  let conta : number=0;
  this.arrayCaracteriticas.controls.forEach(element=>{
    if (element['controls']['Obligatorio'].value== true){
      conta = conta+1;
    }  
  })
  
  if(conta == this.arrayCaracteriticas.length){
    this.controlsDatos.TodoObligatorio.setValue(true);
    // this.chgRef.markForCheck();
  }else{
    this.controlsDatos.TodoObligatorio.setValue(false);
    // this.chgRef.markForCheck();
  }
}

verificarTodoHabilitado(){
  let conta : number=0;
  this.arrayCaracteriticas.controls.forEach(element=>{
    if (element['controls']['Habilitado'].value == true){
      conta = conta+1;
    }  
  })
  
  if(conta == this.arrayCaracteriticas.length){
    this.controlsDatos.TodoHabilitado.setValue(true);
     this.chgRef.markForCheck();
  }else{
    this.controlsDatos.TodoHabilitado.setValue(false);
    this.chgRef.markForCheck();
  }
}
verificarTodoTipo(){
  let conta : number=0;
  let td : any;
  this.arrayCaracteriticas.controls.forEach(element=>{
    if (element['controls']['tipoDato'].value == this.controlsDatos.TodoTipoDato.value ){
      conta = conta+1;
      td=element['controls']['tipoDato'].value
    }  
  })
  
  if(conta == this.arrayCaracteriticas.length){
    this.controlsDatos.TodoTipoDato.setValue(td);
    // this.chgRef.markForCheck();
  }else{
    this.controlsDatos.TodoTipoDato.setValue(null);
    // this.chgRef.markForCheck();
  }
}


//  chgRef---- VER LUEGO!!!!!
 getTipoDatos(){
  this.tipoVehiculo_s.GetTipoDato().subscribe(
    (data:any)=>{
      // console.log(data)
      this.array_tipoDato = data
    },(error)=>{
            console.log('Error en tipo de dato: ',error);
      }
  ) ;   
  }

  private prepareClaseMaterialDetalle() {
    const formData = this.formDatos.value;
    let dataCaracteristicas =[];

    this.arrayCaracteriticas.controls.forEach(element=>{
      dataCaracteristicas.push({
        idCaracteristicaMaterial: element['controls']['idCaracteristicaMaterial'].value,
        // idSubcategoriaMaterial: element['controls']['SubCategoria'].value,
        Obligatorio: element['controls']['Obligatorio'].value,
        Habilitado: element['controls']['Habilitado'].value,
        TipoDato: element['controls']['tipoDato'].value   
      })
    })
    // console.log(dataCaracteristicas)
    return {
      idClaseMaterial: this.idClaseMaterial,
      idSubcategoriaMaterial: formData.SubCategoria,      
      nombre: formData.Nombre,
      descripcion: formData.Descripcion,
      codigo: formData.Codigo,     
      activo: formData.Activo,
      datos : dataCaracteristicas
    }
    
  }

  save(){
    let data = this.prepareClaseMaterialDetalle();
    // console.log(data)
    this.claseMaterialService.newSaveUpdateClaseMaterialDetalle(data).subscribe(
      (data:any) => {
        if (data[0].Success> 0) {
          this.toastr.successToastr(data[0].Message, 'Correcto!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
          this.router.navigate(["Logistica/masters/claseMaterial"]);
 
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
  cancelar(){
    this.router.navigate(["Logistica/masters/claseMaterial"]);
  }

    /* OBTENER EL TIPO VEHICULO CON DETALLE */
    get controlsDatos() {
      return this.formDatos.controls;
    }

    getClaseMaterialDetalle(idClaseMaterial){
      this.claseMaterialService .GetClaseMaterialDetalleById(idClaseMaterial).subscribe(
        (data : any)=>{
          // console.log(data);
          let datosg = data[0][0];
          // console.log(datosg);
          this.controlsDatos.SubCategoria.setValue(datosg.idSubcategoriaMaterial);
          this.controlsDatos.Nombre.setValue(datosg.nombre);
          this.controlsDatos.Descripcion.setValue(datosg.descripcion);
          this.controlsDatos.Codigo.setValue(datosg.codigo);
          this.controlsDatos.Activo.setValue(datosg.activo);
          this.getCaractersiticasClaseMaterialDetalle(data[1]);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }
  cambioHabilitado(){
    this.arrayCaracteriticas.controls.forEach(element=>{
       element['controls']['Habilitado'].setValue(this.controlsDatos.TodoHabilitado.value)  
    })
  }
  cambioObligatorio(){
    this.arrayCaracteriticas.controls.forEach(element=>{
       element['controls']['Obligatorio'].setValue(this.controlsDatos.TodoObligatorio.value)  
    })
  }
  cambioTipoDato(){
    this.arrayCaracteriticas.controls.forEach(element=>{
       element['controls']['tipoDato'].setValue(this.controlsDatos.TodoTipoDato.value)  
    })
  }
}
