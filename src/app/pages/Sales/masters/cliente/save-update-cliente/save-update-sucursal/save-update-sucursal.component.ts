import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CustomersService } from 'src/app/modules/e-commerce/_services';
import { ProveedorService } from 'src/app/pages/Logistica/_core/services/proveedor.service';
import { ClientesService } from 'src/app/pages/Sales/_core/clientes.service';
import { MultitablaService } from 'src/app/pages/_core/services/multitabla.service';
import { PermissionViewActionService } from 'src/app/Shared/services/permission-view-action.service';

@Component({
  selector: 'app-save-update-sucursal',
  templateUrl: './save-update-sucursal.component.html',
  styleUrls: ['./save-update-sucursal.component.scss']
})
export class SaveUpdateSucursalComponent implements OnInit {
  @Input() item: any;  
  @Input() tipo: any;
  @Input() idCliente: any;
  sucursal:any;
  idClienteSucursal: number = 0;
	array_sucursal_pais: any;
	array_sucursal_departamento: any;
	array_sucursal_provincia: any;
	array_sucursal_distrito: any;
  
	formClienteSucursal : FormGroup;
  isLoading$;

  constructor(
    private fb: FormBuilder,
		public multitabla_s: MultitablaService,
		public proveedor_s: ProveedorService,
		public pvas: PermissionViewActionService,
		public cliente_s: ClientesService,
    
    public modal: NgbActiveModal,
    private customersService: CustomersService,
		public toastr: ToastrManager,
		private chgRef: ChangeDetectorRef,
		private router: Router,
		private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    
    this.isLoading$ = this.customersService.isLoading$;
    
    this.clienteSucursalForm();    
	
    if (this.item !== null) {
      this.idClienteSucursal = this.item.ClienteSucursal;
      this.formClienteSucursal.controls.Pais.setValue(this.item.Pais); 
      this.formClienteSucursal.controls.Departamento.setValue(this.item.Departamento);     
      this.formClienteSucursal.controls.Provincia.setValue(this.item.Provincia);
      this.formClienteSucursal.controls.Distrito.setValue(this.item.Distrito);
      this.formClienteSucursal.controls.Direccion.setValue(this.item.Direccion);
      this.formClienteSucursal.controls.Referencia.setValue(this.item.Referencia);      
      this.formClienteSucursal.controls.Activo.setValue(this.item.Activo);
	  this.getSucursalListarPaises(this.item.Pais);
		this.getSucursalListarDepartamento(this.item.Pais,this.item.Departamento);
		this.getSucursalListarProvincia(this.item.Departamento,this.item.Provincia);
		this.getSucursalListarDistrito(this.item.Provincia,this.item.Distrito);
    } else {
      this.idClienteSucursal = null;
	  this.getSucursalListarPaises(null);
		this.getSucursalListarDepartamento(0,null);
		this.getSucursalListarProvincia(0,null);
		this.getSucursalListarDistrito(0,null);
    }
  }

  clienteSucursalForm() {
		this.formClienteSucursal = this.fb.group({
			Pais: [null, Validators.compose([Validators.required])],
			Departamento: [null, Validators.compose([Validators.required])],
			Provincia: [null, Validators.compose([Validators.required])],
			Distrito: [null, Validators.compose([Validators.required])],

			Direccion: [null, Validators.compose([Validators.required])],
			Referencia: [null, Validators.compose([Validators.required])],
	
			Activo: [true],
			});
	}
	getSucursalListarPaises(PosibleValor) {
		this.multitabla_s.GetListarPaises().subscribe(
		(data: any) => {
			this.array_sucursal_pais = data;
			console.log(this.array_sucursal_pais);
			
			if (PosibleValor !== null) {
				this.formClienteSucursal.controls.Pais.setValue(PosibleValor);
			}
		}, (errorServicio) => {

			console.log(errorServicio);
		}
	);
	}

	getSucursalListarDepartamento(Pais, PosibleValor) {
		if (Pais !== 1) {
			this.formClienteSucursal.removeControl('Departamento');
			this.formClienteSucursal.removeControl('Provincia');
			this.formClienteSucursal.removeControl('Distrito');
			this.formClienteSucursal.addControl("Departamento", new FormControl(null,));
			this.formClienteSucursal.addControl("Provincia", new FormControl(null));
			this.formClienteSucursal.addControl("Distrito", new FormControl(null));
		}

		this.formClienteSucursal.controls.Departamento.reset();
		this.multitabla_s.GetListarDepartamentos(Pais).subscribe(
			(data: any) => {
				this.array_sucursal_departamento = data;
				console.log(this.array_sucursal_departamento);

				if (PosibleValor > 0) {
					this.formClienteSucursal.controls.Departamento.setValue(PosibleValor)
				}
			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

	getSucursalListarProvincia(Departamento, PosibleValor) {
		this.formClienteSucursal.controls.Provincia.reset();
		this.multitabla_s.GetListarProvincia(Departamento).subscribe(
			(data: any) => {
				this.array_sucursal_provincia = data;
				if (PosibleValor > 0) {
					this.formClienteSucursal.controls.Provincia.setValue(PosibleValor)
				}
			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

	getSucursalListarDistrito(Provincia, PosibleValor) {
		this.formClienteSucursal.controls.Distrito.reset();
		this.multitabla_s.GetListarDistrito(Provincia).subscribe(
			(data: any) => {
				this.array_sucursal_distrito = data;
				if (PosibleValor > 0) {
					this.formClienteSucursal.controls.Distrito.setValue(PosibleValor);
					this.chgRef.markForCheck();
				}
			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}
  private prepareCustomer() {
    const formData = this.formClienteSucursal.value;
    return {
      ClienteSucursal: this.idClienteSucursal,
      Pais: formData.Pais,
      Departamento: formData.Departamento,
      Provincia: formData.Provincia,
      Distrito: formData.Distrito,
      
      Direccion: formData.Direccion,
      Referencia: formData.Referencia ,  
      Activo: formData.Activo,  
      NombrePais: this.array_sucursal_pais[this.array_sucursal_pais.findIndex(c => c.Pais == formData.Pais)].NombrePais,
    
      NombreDepartamento: this.array_sucursal_departamento[this.array_sucursal_departamento.findIndex(c => c.Departamento == formData.Departamento)].NombreDepartamento,
      
      NombreProvincia: this.array_sucursal_provincia[this.array_sucursal_provincia.findIndex(c => c.Provincia == formData.Provincia)].NombreProvincia,
      
      NombreDistrito: this.array_sucursal_distrito[this.array_sucursal_distrito.findIndex(c => c.Distrito == formData.Distrito)].NombreDistrito,
    }
    
  }
  save() {
    if(this.formClienteSucursal.invalid){
      console.log('Formulario invalido');
      return
    }else{
      this.sucursal = this.prepareCustomer();
	  let datos = { sucursal: [this.sucursal], idCliente: this.idCliente };
	  if (this.tipo!=null) {
		this.cliente_s.SaveUpdateSucursal(datos).subscribe(
			(data:any) => {
				if (data[0].Ok==1) {
					this.toastr.successToastr(
						data[0].Message,
						"Operacion exitosa!",
						{
						toastTimeout: 2000,
						showCloseButton: true,
						animate: "fade",
						progressBar: true,
						}
					);
					this.modal.close(true);
				} else {
					this.toastr.errorToastr(
						data[0].Message,
						"Error de Ok!",
						{
						toastTimeout: 2000,
						showCloseButton: true,
						animate: "fade",
						progressBar: true,
						}
					);
				}
			}, (error:any) => {
				console.log(error);
			}
		);
	  } else {
		this.modal.close(this.sucursal);
	  }
    }
  }
  
  /*PESONALIZADOS */
  isControlValidS(controlName: string): boolean {
    const control = this.formClienteSucursal.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidS(controlName: string): boolean {
    const control = this.formClienteSucursal.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasErrorS(validation, controlName): boolean {
    const control = this.formClienteSucursal.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouchedS(controlName): boolean {
    const control = this.formClienteSucursal.controls[controlName];
    return control.dirty || control.touched;
  }
}
