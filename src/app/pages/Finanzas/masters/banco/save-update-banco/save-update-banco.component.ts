import { Component, OnInit, ViewChild, ChangeDetectorRef,Input } from '@angular/core';
// import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { forkJoin, Subscription } from 'rxjs';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal,NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { MultitablaService } from 'src/app/pages/_core/services/multitabla.service';
import { DeleteModalComponent } from 'src/app/pages/_shared/delete-customer-modal/delete-modal.component';
import { PermissionViewActionService } from 'src/app/Shared/services/permission-view-action.service';
import { DatePipe } from '@angular/common';
import { DataSource } from '@angular/cdk/table';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { BancoServiceService } from '../../../_core/services/banco-service.service';
import { element } from 'protractor';

@Component({
  selector: 'app-save-update-banco',
  templateUrl: './save-update-banco.component.html',
  styleUrls: ['./save-update-banco.component.scss']
})
export class SaveUpdateBancoComponent implements OnInit {

	@Input() item: any;
    formDataBanco: FormGroup;
	load_data: boolean = true;
	no_data: boolean = false;
	searchBan: boolean = false;
	listData: MatTableDataSource<any>;
	displayedColumns:string[] = ['Nro', 'TipoCuenta', 'Moneda','NroCuenta','NroCuentaInterbancaria','Activo','Operaciones'];

	@ViewChild(MatSort) MatSort: MatSort;
	@ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

    private subscriptions: Subscription[] = [];
	validViewAction = this.pvas.validViewAction;
	viewsActions: Array<Navigation> = [];

	array_cuenta: any = [];
	array_moneda: any = [];

	Banco:number = 0;

    constructor(
        private fb: FormBuilder,
		public multitabla_s: MultitablaService,
		public banco_s: BancoServiceService,
		public pvas: PermissionViewActionService,
		public toastr: ToastrManager,
		private modalService: NgbModal,
        public modal: NgbActiveModal

    ) { }

    ngOnInit(): void {
		this.loadBancoData();
		this.getTipoCuenta();
		this.getMoneda();
		this.getCuentasBancarias();
		// this.prepareData();
    }

	loadBancoData(){
		// console.log(this.item)
		if(this.item!=null){
			this.Banco=this.item.idBanco;
			this.loadForm()
			this.formDataBanco.controls.Codigo.setValue(this.item.codigo);
			this.formDataBanco.controls.Nombre.setValue(this.item.nombre);
			this.formDataBanco.controls.Activo.setValue(this.item.activo);

		}else{
			this.Banco = 0;
			this.loadForm();
		}
	}

	loadForm() {
		this.formDataBanco = this.fb.group({
		  Codigo: [null, Validators.compose([Validators.required])],
		  Nombre: [null, Validators.compose([Validators.required])],
		  Activo: [true],      
		});
		// this
	}

	getCuentasBancarias(){
		var idBanco=this.Banco;
		// console.log(idBanco)

		this.listData = new MatTableDataSource([]);
		this.searchBan = false;
		this.load_data = false;
		this.no_data = true;

		this.banco_s.GetCuentasBancarias(idBanco).subscribe(
			(data:any) => {
				this.load_data = true;
				this.searchBan = false;
				this.listData = new MatTableDataSource(data);
				if(data.length >0){
					this.no_data = true;
				}else{
					this.no_data = false;
				}
				// console.log(data)
				this.listData.sort = this.MatSort;
        		this.listData.paginator = this.paginator;
			}, (error)=>{
				this.load_data = true;
				this.no_data = false;
				this.searchBan = false
				console.log('Error en cuentas: ',error);      
			}
		)
	}

	agregarFila(){
		// console.log('add')
		this.listData.data.push({
			idCuentaBancaria:0,
			idMoneda:null,
			idTipoCuenta:null,
			nroCCI:"",
			nroCuenta:"",
			activo:true
		})
		this.listData.data = this.listData.data;
	}

	eliminarFila(idx:number){
		// console.log(idx)
		var data_2=this.listData.data.filter((element,index)=>{
			return index !==idx;
		})
		// console.log(data_2)
		this.listData.data=data_2
	}

	deleteCuenta(idCuentaBancaria:number , index :number){
		// this.listData.
		// console.log(idCuentaBancaria);
		// console.log(index);
		if(idCuentaBancaria ==0){
			this.eliminarFila(index)
		}else{
			const modalRef = this.modalService.open(DeleteModalComponent);
			modalRef.componentInstance.id = idCuentaBancaria;
			modalRef.componentInstance.tipo = 19;
			modalRef.componentInstance.titulo = 'Eliminar Cuenta Bancaria';
			modalRef.componentInstance.descripcion = '¿Esta seguro de eliminar la Cuenta Bancaria seleccionado?';
			modalRef.componentInstance.msgloading = 'Eliminando Cuenta Bancaria...';
			modalRef.result.then((result)=>{
		
			console.log('Eliminacion:',result);
			this.eliminarFila(index)
		
			// this.getCuentasBancarias();
			},(reason)=>{
				console.log(reason);
			});
		}

	}

	prepareData(idBanco:number,codigo:string,nombre:string,activo:boolean,dataXml){
		return {
			idBanco:idBanco,
			Codigo:codigo,
			Nombre:nombre,
			Activo:activo,
			dataXml
		}
	}

	saveUpdate(){

		var da=this.listData.data.filter((element) => {
			if(element.nroCuenta=='' || element.idTipoCuenta== null || element.nroCCI=='' || element.idMoneda==null ){
				return element;
			}
		})

		if(da.length > 0){
			this.toastr.warningToastr('Datos vacios', 'Error!', {
				toastTimeout: 2000,
				showCloseButton: true,
				animate: 'fade',
				progressBar: true
			});

		}else{
			var dataCuentaB=this.listData.data.filter((element) => {
				if(element.nroCuenta!='' && element.idTipoCuenta!= null && element.nroCCI!='' && element.idMoneda!=null ){
					return element;
				}
			})
			var dataCuenta=this.prepareData(
				this.Banco,
				this.formDataBanco.controls.Codigo.value.trim(),
				this.formDataBanco.controls.Nombre.value.trim(),
				this.formDataBanco.controls.Activo.value,
				dataCuentaB
			)
			// // console.log(dataCuenta)
			// console.log(this.Banco)

	
			this.banco_s.insertUpdateBanco(dataCuenta).subscribe(
				(data:any) => {
					// console.log(data)
				
				  if (data[0].Ok> 0) {
					this.toastr.successToastr(data[0].Message, 'Correcto!', {
					  toastTimeout: 2000,
					  showCloseButton: true,
					  animate: 'fade',
					  progressBar: true
					});
					this.modal.close();
					// this.regresar();
	
				  } else {
					this.toastr.errorToastr(data[0].Message,' FALLIDO', {
					  toastTimeout: 2000,
					  showCloseButton: true,
					  animate: 'fade',
					  progressBar: true
					});
					// console.log(data)
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


	// }

	getTipoCuenta(){
		this.banco_s.GetTipoCuenta().subscribe(
			(data:any)=>{
				this.array_cuenta = data;
				// console.log(this.array_cuenta)
			},(error)=>{
				console.log('Error en subcategorias: ',error);
			}
		)
	}

	getMoneda(){
		this.banco_s.GetMoneda().subscribe(
			(data:any)=>{
				this.array_moneda = data;
				// console.log(this.array_moneda)
			},(error)=>{
				console.log('Error en subcategorias: ',error);
			}
		)
	}

	validoGuardar(){
        if(this.formDataBanco.controls.Codigo.value == undefined){
          return true
        }
        if(this.formDataBanco.controls.Nombre.value == undefined){
          return true
        }
        return this.formDataBanco.invalid;
    }

	isControlValid(controlName: string): boolean {
        const control = this.formDataBanco.controls[controlName];
        return control.valid && (control.dirty || control.touched);
    }

    isControlInvalid(controlName: string): boolean {
        const control = this.formDataBanco.controls[controlName];
        return control.invalid && (control.dirty || control.touched);
    }

    controlHasError(validation, controlName): boolean {
        const control = this.formDataBanco.controls[controlName];
        return control.hasError(validation) && (control.dirty || control.touched);
    }
    
    isControlTouched(controlName): boolean {
        const control = this.formDataBanco.controls[controlName];
        return control.dirty || control.touched;
    }



}
