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
import { DeleteModalComponent } from 'src/app/pages/_shared/delete-customer-modal/delete-modal.component';
import { PermissionViewActionService } from 'src/app/Shared/services/permission-view-action.service';
import { TableResponseModel } from 'src/app/_metronic/shared/crud-table';
import { Certificado } from '../../../_core/models/certificado.model';
import { PostulanteService } from '../../../_core/services/postulante.service';
import { CertificadosService } from '../../../_core/services/certificados.service';
import { DocumentoService } from '../../../_core/services/documento.service';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { EmpresaService } from '../../../../Security/_core/services/empresa.service';
import { AreaService } from '../../../_core/services/area.service';
import { puestoTrabajoService } from '../../../_core/services/puestoTrabajo.service';
@Component({
  selector: 'app-postulante-edit',
  templateUrl: './postulante-edit.component.html',
  styleUrls: ['./postulante-edit.component.scss']
})
export class PostulanteEditComponent implements OnInit{
  formGroup: FormGroup;
  load_data: boolean = true;
  no_data: boolean = false;
  searchBan: boolean = false;

  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];
  array_dataList: any;
  tabs = {
    DATOS_TAB: 0,
    EXPEDIENTE_TAB: 1
  };
  activeTabId = this.tabs.DATOS_TAB;
  deta_formTipoDato: FormControl[] = [];
  array_datos_contrato:any = [];
	array_tipo_dato:any = [];
  array_expediente: any = [];
  hide_save: Boolean = false;
  hide_load: Boolean = true;

	array_empresas:any = [];
	array_modalidadContratacion:any = [];
	array_puestoTrabajo:any = [];
	array_pais:any = [];
	array_departamento:any = [];
	array_provincia:any = [];
	array_distrito:any = [];
	array_tipoDocIdentidad:any = [];
	array_sexo:any = [];
	array_estadoCivil:any = [];

	idPostulante: number = 0;

	postulante: any;

  constructor(
    private fb: FormBuilder,
    public certificado_s: CertificadosService,
    public documento_s: DocumentoService,
    public multitabla_s: MultitablaService,
	public postulante_s: PostulanteService,
    public pvas: PermissionViewActionService,
    public toastr: ToastrManager,
	public empresa_s:EmpresaService,
    public area_s:AreaService,
    public puestoTrabajo_s:puestoTrabajoService,
    private chgRef: ChangeDetectorRef, 
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.viewsActions = this.pvas.get();
		
    this.idPostulante = this.route.snapshot.queryParams['id'] || 0;
		this.postulanteForm();

		if(this.idPostulante>0){
			this.obtenerPostulante(this.idPostulante);

		}else{
			this.getEmpresas(null);
			this.getModalidadContratacion(null);
			this.getPuestoTrabajo(null,null);
			this.getPais(null);
			this.getDepartamento(null,0)
			this.getProvincia(null,0)
			this.getDistrito(null,0)
			this.getTipoDocIdentidad(null)
			this.getSexo(null)
			this.GetEstadoCivil(null)
		}
  }

	obtenerPostulante(id){
		const controls = this.formGroup.controls;
		this.postulante_s.GetPostulantesList(0,0,0,-1,id).subscribe(
			(data:any)=>{
				let item = data[0];
				controls.Codigo.setValue(item.codigo);
				this.getEmpresas(item.empresa);
				this.getModalidadContratacion(item.modalidadContratacion);
				this.getPuestoTrabajo(item.empresa,item.puestoTrabajo);
				this.getPais(item.pais);
				this.getDepartamento(item.departamento,item.pais);
				this.getProvincia(item.provincia,item.departamento);
				this.getDistrito(item.distrito,item.provincia);
				controls.Nombres.setValue(item.nombres);
				controls.ApePaterno.setValue(item.apePaterno);
				controls.ApeMaterno.setValue(item.apeMaterno);
				controls.Direccion.setValue(item.direccion);
				controls.Referencias.setValue(item.referencia);
				this.getTipoDocIdentidad(item.tipoDocumentoIdentidad);
				controls.DocIdentidad.setValue(item.documentoIdentidad);
				controls.FechaNacimiento.setValue( new Date(item.fechaNacimiento).toLocaleDateString('en-CA'));
				controls.Email.setValue(item.email);
				controls.Telefono.setValue(item.telefono);
				controls.Celular.setValue(item.celular);
				controls.CelularReferencial.setValue(item.celularReferencial);
				this.getSexo(item.idSexo);
				controls.Ruc.setValue(item.registroContribuyente);
				this.GetEstadoCivil(item.idEstadoCivil);
				controls.NombreConyugue.setValue(item.nombreConyugue);
				controls.TieneHijos.setValue(item.tieneHijos);
				if(item.cantidadHijos){
					controls.CantHijos.setValue(item.cantidadHijos);
				}
				this.postulante = item;
			}
		);
	}

	postulanteForm(){
		this.formGroup = this.fb.group({
			Codigo: [null, Validators.required],
      		Empresa: [null, Validators.required],
			ModalidadContratacion: [null, Validators.required],
			PuestoTrabajo: [null, Validators.required],
			Pais: [null, Validators.required],
			Departamento: [null, Validators.required],
			Provincia: [null, Validators.required],
			Distrito: [null, Validators.required],
			Nombres: [null, Validators.required],
			ApePaterno: [null, Validators.required],
			ApeMaterno: [null, Validators.required],
			Direccion: [null, Validators.required],
			Referencias: [null, Validators.required],
			TipoDocIdentidad: [null, Validators.required],
			DocIdentidad: [null, Validators.required],
			FechaNacimiento: [null, Validators.required],
			Email: [null, Validators.required],
			Telefono: [null, Validators.required],
			Celular: [null, Validators.required],
			CelularReferencial: [null, Validators.required],
			Sexo: [null, Validators.required],
			Ruc: [null],
			EstadoCivil: [null, Validators.required],
			NombreConyugue: [null],
			TieneHijos: [null, Validators.required],
			CantHijos: [null],
    });
				
		this.formGroup.controls.TieneHijos.valueChanges.subscribe(checked=>{
			if(checked) {
				this.formGroup.controls.CantHijos.enable()
			}else{
				this.formGroup.controls.CantHijos.disable()
				this.formGroup.controls.CantHijos.setValue("");
			}
		});

		this.formGroup.controls.EstadoCivil.valueChanges.subscribe(value=>{
			if(value === '0001') {
				this.formGroup.controls.NombreConyugue.enable()
			}else{
				this.formGroup.controls.NombreConyugue.disable()
				this.formGroup.controls.NombreConyugue.setValue("");
			}
		});

	}

	getEmpresas(PosibleValor: number){
		this.empresa_s.GetEmpresaByUsuario().subscribe(
			(data:any)=>{
				this.array_empresas = data;
				if(PosibleValor!== null){
					this.formGroup.controls.Empresa.setValue(PosibleValor)
				}
			}, (errorServicio)=>{
				console.log(errorServicio)
			}
		);
	}
	getModalidadContratacion(PosibleValor){
		this.multitabla_s.GetModalidadContratacion().subscribe(
			(data:any)=>{
				this.array_modalidadContratacion = data;
				if(PosibleValor!== null){
					this.formGroup.controls.ModalidadContratacion.setValue(PosibleValor)
				}
			}, (errorServicio)=>{
				console.log(errorServicio)
			}
		)
	}
	getPuestoTrabajo(Empresa,PosibleValor){
		this.formGroup.controls.PuestoTrabajo.reset();
		console.log(Empresa);
		
		this.array_puestoTrabajo = [];  
		if (Empresa !== null && Empresa !== undefined) { 
		this.puestoTrabajo_s.GetPuestoTrabajoByUsuario(Empresa,0).subscribe(
			(data:any)=>{
				this.array_puestoTrabajo = data;
				if(PosibleValor!== null){
					this.formGroup.controls.PuestoTrabajo.setValue(PosibleValor)
				}
			}, (errorServicio)=>{
				console.log(errorServicio)
			}
		);
		}
	}
	getPais(PosibleValor){
		this.formGroup.controls.Pais.reset();
		this.multitabla_s.GetListarPaises().subscribe(
			(data:any)=>{
				this.array_pais = data;
				if(PosibleValor!== null){
					this.formGroup.controls.Pais.setValue(PosibleValor)
				}
			}, (errorServicio)=>{
				console.log(errorServicio)
			}
		)
	}
	getDepartamento(PosibleValor, pais){
		this.formGroup.controls.Departamento.reset();
		this.multitabla_s.GetListarDepartamentos(pais).subscribe(
			(data:any)=>{
				this.array_departamento = data;
				if(PosibleValor!== null){
					this.formGroup.controls.Departamento.setValue(PosibleValor)
				}
			}, (errorServicio)=>{
				console.log(errorServicio)
			}
		)
	}
	getProvincia(PosibleValor, departamento){
		this.formGroup.controls.Provincia.reset();
		this.multitabla_s.GetListarProvincia(departamento).subscribe(
			(data:any)=>{
				this.array_provincia = data;
				if(PosibleValor!== null){
					this.formGroup.controls.Provincia.setValue(PosibleValor)
				}
			}, (errorServicio)=>{
				console.log(errorServicio)
			}
		)
	}
	getDistrito(PosibleValor, provincia){
		this.formGroup.controls.Distrito.reset();
		this.multitabla_s.GetListarDistrito(provincia).subscribe(
			(data:any)=>{
				this.array_distrito = data;
				if(PosibleValor!== null){
					this.formGroup.controls.Distrito.setValue(PosibleValor)
				}
			}, (errorServicio)=>{
				console.log(errorServicio)
			}
		)
	}
	getTipoDocIdentidad(PosibleValor){
		this.multitabla_s.GetTipoDocumentoIdentidad().subscribe(
			(data:any)=>{
				this.array_tipoDocIdentidad = data;
				if(PosibleValor!== null){
					this.formGroup.controls.TipoDocIdentidad.setValue(PosibleValor)
				}
			}, (errorServicio)=>{
				console.log(errorServicio)
			}
		)
	}
	getSexo(PosibleValor){
		this.multitabla_s.GetListarSexos().subscribe(
			(data:any)=>{
				this.array_sexo = data;
				if(PosibleValor!== null){
					this.formGroup.controls.Sexo.setValue(PosibleValor)
				}
			}, (errorServicio)=>{
				console.log(errorServicio)
			}
		)
	}
	GetEstadoCivil(PosibleValor){
		this.multitabla_s.GetListarEstadoCivil().subscribe(
			(data:any)=>{
				this.array_estadoCivil = data;
				if(PosibleValor!== null){
					this.formGroup.controls.EstadoCivil.setValue(PosibleValor)
				}
			}, (errorServicio)=>{
				console.log(errorServicio)
			}
		)
	}

	preparePostulante(){
		const formData = this.formGroup.value;
		return {
			idPostulante : this.idPostulante,
			idEmpresa: formData.Empresa,
			idVacante: this.postulante.idPostulante,
			idModalidadContratacion: formData.ModalidadContratacion,
			idPuestoTrabajo: formData.PuestoTrabajo,
			idPais: formData.Pais,
			idDepartamento: formData.Departamento,
			idProvincia: formData.Provincia,
			idDistrito: formData.Distrito,
			nombres: formData.Nombres,
			apePaterno: formData.ApePaterno,
			apeMaterno: formData.ApeMaterno,
			direccion: formData.Direccion,
			referencias: formData.Referencias,
			idTipoDocumentoIdentidad: formData.TipoDocIdentidad,
			documentoIdentidad: formData.DocIdentidad,
			telefono: formData.Telefono,
			celular: formData.Celular,
			celularReferencial: formData.CelularReferencial,
			idSexo: formData.Sexo,
			fechaNacimiento: formData.FechaNacimiento,
			email: formData.Email,
			ruc: formData.Ruc,
			idEstadoCivil: formData.EstadoCivil,
			nombreConyugue: formData.NombreConyugue || "",
			tieneHijos: formData.TieneHijos,
			cantHijos: formData.CantHijos || 0,
			activo: 1
		}
	}

	saveUpdatePostulante(){
		this.hide_load = false;
		this.hide_save = true;
		const controls = this.formGroup.controls;

		controls.Departamento.setValidators(null);
		controls.Provincia.setValidators(null);
		controls.Distrito.setValidators(null);

		if(this.array_departamento && this.array_departamento.length>0){
			controls.Departamento.setValidators([Validators.required]);
			if(this.array_provincia && this.array_provincia.length>0){	
				controls.Provincia.setValidators([Validators.required]);
				if(this.array_distrito && this.array_distrito.length>0){
					controls.Distrito.setValidators([Validators.required]);
				}
			}
		}

		controls.Departamento.updateValueAndValidity();
		controls.Provincia.updateValueAndValidity();
		controls.Distrito.updateValueAndValidity();

		if(this.formGroup.invalid){
			Object.keys(controls).forEach(controlName => 
				controls[controlName].markAllAsTouched()
			);
			this.hide_save = false;
			this.hide_load = true;
			this.toastr.warningToastr('Ingrese los campos obligatorios.','Advertencias!',{
				toastTimeOut: 2000,
				showCloseButton: true,
				animate: 'fade',
				progressBar: true,
			})
			return 0;
		}
		const data = this.preparePostulante()

		this.postulante_s.SaveUpdatePostulante(data).subscribe(
			(data:any) => {
        if (data[0].Success > 0) {
          this.toastr.successToastr(data[0].Message, 'Correcto!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
					this.router.navigate(['Talento/masters/Postulante']);

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
    )
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
