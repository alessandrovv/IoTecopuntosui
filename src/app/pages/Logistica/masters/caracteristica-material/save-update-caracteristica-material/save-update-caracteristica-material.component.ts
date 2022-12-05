import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbModal, NgbDateAdapter, NgbDateParserFormatter, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionViewActionService } from '../../../../../Shared/services/permission-view-action.service';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DeleteModalComponent } from '../../../../_shared/delete-customer-modal/delete-modal.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MultitablaService } from '../../../../_core/services/multitabla.service';
import { Router } from '@angular/router';
import { MaterialService } from '../../../_core/services/material.service';
import { CaracteristicaMaterialService } from '../../../_core/services/caracteristica-material.service';
import { CaracteristicaMaterialObjetoService } from '../serviciocaracteristicaMaterial/caracteristica-material-objeto.service';

@Component({
  selector: 'app-save-update-caracteristica-material',
  templateUrl: './save-update-caracteristica-material.component.html',
  styleUrls: ['./save-update-caracteristica-material.component.scss']
})
export class SaveUpdateCaracteristicaMaterialComponent implements OnInit {


  load_data:boolean = true;
  actividadControl = "Todos"
  no_data:boolean = false;
  searchBan:boolean = false;
  aparece:boolean = true;
  estaGuardando:boolean = false;
  searchGroup:FormGroup;
  tipo:string = '';
  listData:MatTableDataSource<any>;
  displayedColumns:string[] = ['Nro', 'NOMBRE', 'ACTIVO','OPCIONES'];

  
  @ViewChild(MatSort) MatSort:MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;
  
  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];
  array_dataList:any;
  array_actividad= [];
  formGroup: FormGroup;
  item: any;


  constructor(
    private fb:FormBuilder,
    private modalService: NgbModal,
    public material_s:MaterialService,
    public multitabla_s: MultitablaService,
    private caracterisitcas_s: CaracteristicaMaterialService,
    public pvas: PermissionViewActionService,
    public toastr: ToastrManager,
    private router: Router,
    private caractMat: CaracteristicaMaterialObjetoService,
  ) { }


  ngOnInit(): void {
    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();
    this.loadForm();  
    this.loadCaracteristica();    
    this.getCaracteristicaMaterialValor();
  }


  loadCaracteristica() {
    this.item = this.caractMat.getCaracteristicaMaterial();

    if (!(this.item == null || this.item == undefined)) {
      this.tipo = 'Editar';
      this.formGroup.controls.id.setValue(this.item.idCaracteristicaMaterial)
      this.formGroup.controls.Nombre.setValue(this.item.NombreCaracteristicaMaterial);
      this.formGroup.controls.Descripcion.setValue(this.item.DescripcionCaracteristicaMaterial);      
      this.formGroup.controls.Activo.setValue(this.item.Activo);      
    }else{
      this.tipo = 'Guardar';
    }
  }
  loadForm() {
    this.formGroup = this.fb.group({
      id:[0],
      Nombre: ["", Validators.compose([Validators.required])],
      Descripcion: ["", Validators.compose([Validators.required])],
      Activo: [true],      
    });
  }


  getCaracteristicaMaterialValor(){

    var idCaracteristica = this.formGroup.controls.id.value;

    if(idCaracteristica == 0){
      return
    }

    this.listData = new MatTableDataSource([]);
    this.searchBan = false;
    this.load_data =false;
    this.no_data = true;


    this.caracterisitcas_s.getCaracteristicaMaterialValor(idCaracteristica).subscribe(
      (data:any) => {
        this.load_data = true;
        this.searchBan = false;
        console.log(data)
        this.listData = new MatTableDataSource(data);
        if(data.length >0){
          this.no_data = true;
        }else{
          this.no_data = false;
        }
        this.listData.sort = this.MatSort;
        this.listData.paginator = this.paginator;
      }, (error)=>{
        this.load_data = true;
        this.no_data = false;
        this.searchBan = false
        console.log('Error en materiales: ',error);      
      }
    );
  }

  getCaracteristica(id:number,nombre : string, desc:string, activo:boolean, dataValor:any){
    return {
      idCaracteristicaMaterial: id,
      NombreCaracteristica: nombre,
      DescripcionCaracteristicaMaterial:desc,
      Activo: activo,
      xmlCaracteristicaValor: dataValor
    }
  }

  delete(idCaracteristicaMaterial:number, idx : number){
    if(idCaracteristicaMaterial == 0){
      this.eliminarFila(idx);
    }else{
      const modalRef = this.modalService.open(DeleteModalComponent);
      modalRef.componentInstance.id = idCaracteristicaMaterial;
      modalRef.componentInstance.tipo = 9;
      modalRef.componentInstance.titulo = 'Eliminar Valor de la Caracteristica';
      modalRef.componentInstance.descripcion = '¿Esta seguro de eliminar el valor de la caracteristica?';
      modalRef.componentInstance.msgloading = 'Eliminando caracteristica de material...';
      modalRef.result.then((result)=>{  
        if(result == true){
          this.eliminarFila(idx);
        }    
        console.log('Eliminacion:',result);
      },(reason)=>{
        console.log(reason);
      });
    }
  }
  
  enableDisable(id:number, activo:boolean){

    if(id == 0){
      return
    }

    const dataActivar = {
      idCaracteristicaMaterialValor : id,
      Activo : activo
    }    

    this.caracterisitcas_s.enableDisableCaracteristicaMaterialValor(dataActivar).subscribe(
      (data:any)=>{
          this.toastr.successToastr(data[0].Message, 'Correcto!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
        //this.ngOnInit();
      },(error)=>{
        this.toastr.errorToastr('Ocurrio un error.', 'Error!', {
          toastTimeout: 2000,
          showCloseButton: true,
          animate: 'fade',
          progressBar: true
        });       
        console.log(error);
      }
    )
  }
  saveUpdate(){
    this.estaGuardando = true;

    var dataFiltrada = this.listData.data.filter((elemento) => {
      return elemento.NombreCaracteristicaValor.trim() !== "";
    });

    var dataCaracteristica = this.getCaracteristica(
      this.formGroup.controls.id.value,
      this.formGroup.controls.Nombre.value,
      this.formGroup.controls.Descripcion.value,
      this.formGroup.controls.Activo.value,
      dataFiltrada
    );

    this.caracterisitcas_s.insertUpdateCaracteristicaMaterial(dataCaracteristica).subscribe(
      (data:any) => {
        if (data[0].Ok> 0) {
          this.toastr.successToastr(data[0].Message, 'Correcto!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
          this.regresar();
        } else {
          this.toastr.errorToastr(data[0].Message,' FALLIDO', {
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

  eliminarFila(idx:number){
    var data_2 = this.listData.data.filter((elemento, index) => {
      return index !== idx;
    });
    this.listData.data = data_2;
  }

  filtrarValores(){
    var data_2 = this.listData.data.filter((elemento) => {
      return elemento.NombreCaracteristicaValor.trim() !== "";
    });
    this.listData.data = data_2;
  }

  validoGuardar(){
    if(this.formGroup.controls.Nombre.value == undefined || this.formGroup.controls.Descripcion.value.trim() == ""){
      return true
    }
    if(this.formGroup.controls.Descripcion.value == undefined || this.formGroup.controls.Descripcion.value.trim() == ""){
      return true
    }
    return this.formGroup.invalid && this.estaGuardando;
  }

  agregarFila(){
    this.listData.data.push({
      idCaracteristicaMaterialValor: 0,
      NombreCaracteristicaValor: "",
      Activo: true
    })
    this.listData.data = this.listData.data;
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
  regresar(){
    this.caractMat.setCaracteristicaMaterial(null);
    this.router.navigate(['Logistica/masters/caracteristicaMateriales']);

  }
}
