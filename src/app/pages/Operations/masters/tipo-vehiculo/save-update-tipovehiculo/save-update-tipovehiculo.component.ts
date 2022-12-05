import { ActivatedRoute, Router } from '@angular/router';
import { element } from 'protractor';
import { MatTableDataSource } from '@angular/material/table';
import { GetCaracteristicaVehiculo } from './../../../_core/models/tipoVehiculo.interface';
import { TableResponseModel } from 'src/app/_metronic/shared/crud-table';
import { ToastrManager } from 'ng6-toastr-notifications';
import { TipoVehiculoService } from './../../../_core/services/tipo-vehiculo.service';
import { CustomersService } from './../../../../../modules/e-commerce/_services/customers.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../_metronic/core';
import { NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-save-update-tipovehiculo',
  templateUrl: './save-update-tipovehiculo.component.html',
  styleUrls: ['./save-update-tipovehiculo.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class SaveUpdateTipovehiculoComponent implements OnInit {
  @Input() item: any;
  isLoading$;
  idTipoVehiculo: number = 0;
  formGroup: FormGroup;
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
    
  ) { }
  ngOnInit(): void {
   this.getTipoDatos();
   this.idTipoVehiculo = this.route.snapshot.queryParams["id"] || 0;
   if(this.idTipoVehiculo > 0){
    this.getTipoVehiculoDetalle (this.idTipoVehiculo);
   }else{
    this.getCaractersiticasVehiculoNuevo();
   }
   
  }
  array_CaracteristicasVehiculo: any =[];
  

  formDatos:FormGroup = this.fb.group({
      Nombre: [null, Validators.compose([Validators.required])],
      Descripcion: [null, Validators.compose([Validators.required])],
      Activo: [true],
      TodoHabilitado:[true],
      TodoObligatorio:[true],
      TodoTipoDato:[null] ,   
      caracteristicas : this.fb.array([]),   
    })

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


  getCaractersiticasVehiculoNuevo(){
    // let array = data;
    this.tipoVehiculo_s.GetCaracteristicaVehiculo().subscribe(
     (data:any) => {
      //  console.log(data);
        this.array_CaracteristicasVehiculo = data;
        console.log(this.array_CaracteristicasVehiculo)
        for (let i = 0; i < this.array_CaracteristicasVehiculo.length; i++) {
        this.arrayCaracteriticas.push(new FormGroup({
          idCaracteristicaVehiculo: new FormControl(this.array_CaracteristicasVehiculo[i].idCaracteristicaVehiculo),
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
 getCaractersiticasVehiculDetalle(dataEx){
  console.log(dataEx);
  let array = dataEx;
  this.array_CaracteristicasVehiculo = dataEx;
    for (let i = 0; i < array.length; i++) {
    this.arrayCaracteriticas.push(new FormGroup({
      idCaracteristicaVehiculo: new FormControl(array[i].idCaracteristicaVehiculo),
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
    if (element['controls']['tipoDato'].value == this.controlsDatos.TodoObligatorio.value){
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
    // this.chgRef.markForCheck();
  }else{
    this.controlsDatos.TodoHabilitado.setValue(false);
    // this.chgRef.markForCheck();
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
      console.log(data)
      this.array_tipoDato = data
    },(error)=>{
            console.log('Error en tipo de dato: ',error);
      }
  ) ;   
  }

  private prepareTipoVehiculo() {
    const formData = this.formDatos.value;
    let dataCaracteristicas =[];

    this.arrayCaracteriticas.controls.forEach(element=>{
      dataCaracteristicas.push({
        idCaracteristicaVehiculo: element['controls']['idCaracteristicaVehiculo'].value,
        Obligatorio: element['controls']['Obligatorio'].value,
        Habilitado: element['controls']['Habilitado'].value,
        TipoDato: element['controls']['tipoDato'].value   
      })
    })
    console.log(dataCaracteristicas)
    return {
      idTipoVehiculo: this.idTipoVehiculo,      
      nombre: formData.Nombre,
      descripcion: formData.Descripcion,    
      activo: formData.Activo,
      datos : dataCaracteristicas
    }
    
  }

  save(){
    let data = this.prepareTipoVehiculo();
    console.log(data)
    this.tipoVehiculo_s.SaveUpdateTipoVehiculo(data).subscribe(
      (data:any) => {
        if (data[0].Success> 0) {
          this.toastr.successToastr(data[0].Message, 'Correcto!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
          this.router.navigate(["Operations/masters/tipoVehiculo"]);
 
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
    this.router.navigate(["Operations/masters/tipoVehiculo"]);
  }

    /* OBTENER EL TIPO VEHICULO CON DETALLE */
    get controlsDatos() {
      return this.formDatos.controls;
    }
    getTipoVehiculoDetalle(idTipoVehiculo){
      this.tipoVehiculo_s.GetTipoVehiculoDetalleById(idTipoVehiculo).subscribe(
        (data : any)=>{
          console.log(data);
          let datosg = data[0][0];
          console.log(datosg);
          this.controlsDatos.Nombre.setValue(datosg.nombre);
          this.controlsDatos.Descripcion.setValue(datosg.descriocion);
          this.controlsDatos.Activo.setValue(datosg.activo);
          this.getCaractersiticasVehiculDetalle(data[1]);
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

