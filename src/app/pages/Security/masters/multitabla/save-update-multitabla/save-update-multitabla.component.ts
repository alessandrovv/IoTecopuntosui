import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { MultitablaService } from 'src/app/pages/_core/services/multitabla.service';
import { PermissionViewActionService } from 'src/app/Shared/services/permission-view-action.service';
import { TableResponseModel } from 'src/app/_metronic/shared/crud-table';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';

@Component({
  selector: 'app-save-update-multitabla',
  templateUrl: './save-update-multitabla.component.html',
  styleUrls: ['./save-update-multitabla.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class SaveUpdateMultitablaComponent implements OnInit {
  formGroup: FormGroup;
	detalleFormGroup: FormGroup;
  load_data: boolean = true;
  no_data: boolean = false;
  searchBan: boolean = false;
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Valor', 'Nombre', 'Descripcion', 'Valor1', 'Valor2', 'Valor3', 'Valor4', 'Estado', 'actions'];
  @ViewChild(MatSort) MatSort: MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];
  array_data: any = [];
	array_data_eliminado: any = [];
	deta_multitabla: FormControl[] = []
  deta_formTipoDato: FormControl[] = [];
  hide_save: Boolean = false;
  hide_load: Boolean = true;
  idTabla: number = 0;
	banEliminado: boolean = false;
	editando: boolean = false;
	posDetalle: number = 0;
	titulo: String;

  constructor(
    private fb: FormBuilder,
    public multitabla_s: MultitablaService,
    public pvas: PermissionViewActionService,
    public toastr: ToastrManager,
    private chgRef: ChangeDetectorRef, 
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.listData = new MatTableDataSource([]);
    this.viewsActions = this.pvas.get();    
    this.multitablaForm();
		this.detalleMultitablaForm()
    this.idTabla = this.route.snapshot.queryParams['id'] || 0;

    if (this.idTabla > 0) {
			this.titulo = "Editar Multitabla";
      this.getDataConfiguracion(this.idTabla);
    } else {
			this.titulo = "Nueva Multitabla"
    }    
  }

  getDataConfiguracion(Tabla) {
    this.multitabla_s.GetTablaById(Tabla).subscribe(
      (data:any) => {
        console.log(data);
				let dataCab = data[0][0]
				let dataValores = data[1];
				const controlsCab = this.formGroup.controls;
				console.log(dataCab)
				controlsCab['Tabla'].setValue(dataCab.valor);
				controlsCab['Nombre'].setValue(dataCab.nombre);
				controlsCab['Descripcion'].setValue(dataCab.descripcion);

				this.array_data = dataValores;
				this.listData = new MatTableDataSource(this.array_data);
        // let dataCab = data[0];
        // this.array_datos_contrato = data[1];
        // this.array_expediente = data[2];

        // console.log(this.array_expediente);

        // this.array_datos_contrato.forEach(e => {
        //   this.deta_formTipoDato.push(new FormControl(e.TipoDato, [Validators.required]));
        // });
        // this.chgRef.markForCheck();

        // this.getEmpresas(dataCab[0].Empresa);
        // this.getModalidadContratacion(dataCab[0].Modalidad);       
        // this.getPuestoTrabajo(dataCab[0].PuestoTrabajo);       
      }, ( errorServicio ) => {           
        console.log(errorServicio);
      }
    );
  }

  multitablaForm() {
    this.formGroup = this.fb.group({
      Tabla: [null],
      Nombre: [null, Validators.compose([Validators.required])],
      Descripcion: [null],
    });    
  }

	detalleMultitablaForm(){
		this.detalleFormGroup = this.fb.group({
			Valor: [null],
			NombreD: [null,Validators.required],
			DescripcionD: [null],
			Valor1: [null],
			Valor2: [null],
			Valor3: [null],
			Valor4: [null],
		})
	}

	agregarValor(){
		const controls = this.detalleFormGroup.controls;
		if(controls['Valor'].status === 'INVALID' || controls['NombreD'].status === 'INVALID'){
			console.log(controls);
			controls['Valor'].markAsTouched();
			controls['NombreD'].markAsTouched();
			this.toastr.warningToastr('Ingrese los campos obligatorios.', 'Advertencia!', {
				toastTimeout: 2000,
				showCloseButton: true,
				animate: 'fade',
				progressBar: true
			});
			return;
		}
		if(this.editando){
			let elemento = this.array_data[this.posDetalle];
			elemento.valor = controls['Valor'].value;
			elemento.nombre = controls['NombreD'].value;
			elemento.descripcion = controls['DescripcionD'].value;
			elemento.valor1 = controls['Valor1'].value;
			elemento.valor2 = controls['Valor2'].value;
			elemento.valor3 = controls['Valor3'].value;
			elemento.valor4 = controls['Valor4'].value;
			elemento.activo = true;
		}else{
			let correlativo:any = 0;
			let valor = "";
			correlativo = (parseInt(this.array_data[this.array_data.length -1].valor)+1).toString()
			for(let i = 0; i<4-(correlativo.toString().length);i++){
				valor+="0";
			}
			valor+=correlativo;
			this.array_data.push({
				idMultitabla: 0,
        valor: valor,
        idTabla: this.formGroup.controls["Tabla"].value,
        nombre: controls["NombreD"].value,
        descripcion: controls["DescripcionD"].value,
        valor1: controls["Valor1"].value,
        valor2: controls["Valor2"].value,
        valor3: controls["Valor3"].value,
        valor4: controls["Valor4"].value,     
				activo: true
			})
		}

		this.editando = false;
		this.listData = new MatTableDataSource(this.array_data);
		this.detalleFormGroup.reset();
	}

	editarValor(item){
		this.posDetalle = this.array_data.indexOf(item);
		this.editando = true; 
    this.detalleFormGroup.controls['Valor'].setValue(item.valor);
    this.detalleFormGroup.controls['NombreD'].setValue(item.nombre);
    this.detalleFormGroup.controls['DescripcionD'].setValue(item.descripcion);
    this.detalleFormGroup.controls['Valor1'].setValue(item.valor1);
    this.detalleFormGroup.controls['Valor2'].setValue(item.valor2);
    this.detalleFormGroup.controls['Valor3'].setValue(item.valor3);
    this.detalleFormGroup.controls['Valor4'].setValue(item.valor4);
	}

	eliminarValor(item){
		let index = this.array_data.indexOf(item);
		if(item.idMultitabla>0){
			this.array_data_eliminado.push(item);
		}

		this.array_data.splice(index, 1);
		this.listData = new MatTableDataSource(this.array_data);
	}

	toggleActivo(item){
		item.activo= !item.activo
	}

  saveUpdateMultitabla() {
		const controls = this.formGroup.controls;
		let arrayDatosMultitabla = []
		let arrayDatosValores = []

		if(controls['Nombre'].status === 'INVALID'){
			controls['Nombre'].markAllAsTouched();
			this.toastr.warningToastr('Ingrese los campos obligatorios.', 'Advertencia!', {
				toastTimeout: 2000,
				showCloseButton: true,
				animate: 'fade',
				progressBar: true
			});
			return;
		}

		if(this.array_data.length > 0){
			for(let item of this.array_data){
				arrayDatosValores.push({
          idMultitabla: item.idMultitabla,
          valor: item.valor,
          idTabla: item.idTabla,
          nombre: item.nombre,
          descripcion: item.descripcion,
          valor1: item.valor1,
          valor2: item.valor2,
          valor3: item.valor3,
          valor4: item.valor4,
          activo: item.activo,
          eliminado: false
				});
			}
		}

		if(this.array_data_eliminado.length > 0){
			for(let item of this.array_data_eliminado){
				arrayDatosValores.push({
          idMultitabla: item.idMultitabla,
          valor: item.valor,
          idTabla: item.idTabla,
          nombre: item.nombre,
          descripcion: item.descripcion,
          valor1: item.valor1,
          valor2: item.valor2,
          valor3: item.valor3,
          valor4: item.valor4,
          activo: item.activo,
          eliminado: true
				});
			}
		}

		arrayDatosMultitabla.push({
      idMultitabla: this.idTabla,
      valor: controls["Tabla"].value,
      nombre: controls["Nombre"].value,
      descripcion: controls["Descripcion"].value,
      DetalleMultitabla: arrayDatosValores
		})

		this.hide_save = true;
		this.hide_load = false;

		// console.log(arrayDatosMultitabla);

		this.multitabla_s.SaveUpdateMultitabla(arrayDatosMultitabla[0]).subscribe(
      (data:any) => {
        if (data.Success > 0) {
          this.toastr.successToastr(data.Message, 'Correcto!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
          this.router.navigate(['Security/masters/Multitabla']);
        } else {
          this.hide_save = false;
          this.hide_load = true;
          this.toastr.errorToastr(data.Message, 'Error!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
        }
               
      }, ( errorServicio ) => { 
        this.hide_save = false;
        this.hide_load = true;
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
    const control = this.formGroup.controls[controlName] || this.detalleFormGroup.controls[controlName] ;
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName] || this.detalleFormGroup.controls[controlName] ;
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName] || this.detalleFormGroup.controls[controlName] ;
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName] || this.detalleFormGroup.controls[controlName] ;
    return control.dirty || control.touched;
  }


}

