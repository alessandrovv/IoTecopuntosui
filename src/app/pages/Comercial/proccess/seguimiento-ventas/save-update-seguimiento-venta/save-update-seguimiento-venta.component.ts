import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap, filter, finalize } from 'rxjs/operators';
// import { Product } from '../../_models/product.model';
// import { ProductsService } from '../../_services';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MultitablaService } from '../../../../_core/services/multitabla.service';
import { VentasService } from '../../../_core/ventas.service';
import { DatePipe } from '@angular/common';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireStorageReference, AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import * as FileSaver from "file-saver";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-save-update-seguimiento-venta',
  templateUrl: './save-update-seguimiento-venta.component.html',
  styleUrls: ['./save-update-seguimiento-venta.component.scss'],
  providers: [DatePipe,
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class SaveUpdateSeguimientoVentaComponent implements OnInit {

  idVenta: number = 0;
  hide_save: Boolean = false;
  hide_load: Boolean = true;
  formGroup: FormGroup;
  isLoading$: Observable<boolean>;
  errorMessage = '';
  tabs = {
    BASIC_TAB: 0,
    REMARKS_TAB: 1,
    SPECIFICATIONS_TAB: 2
  };
  activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Remarks | 2 => Specifications
  private subscriptions: Subscription[] = [];
  array_empresas: any;
  array_certificado: any;
  array_asociado: any;
  array_lider: any = [];
  NombresLider: string = ''
  CelularLider: string = ''
  EmailLider: string = ''
  EdadLider: string = ''
  VentasLider: string = ''
  EsquemaComisionLider: string = ''
  DescEmpresa: string = ''
  DescCertificado: string = ''
  vigenteLider: number = 0;
  filterGroup: FormGroup;
  array_grabacion: any = [];
  array_documentacion: any = [];
  array_registro_crm: any = [];
  array_venta_interno: any = [];
  array_venta_cliente: any = [];
  array_instalacion: any = [];
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  nombreGrabacion: string = null;
  nombreDocumentacion: string = null;
	nombreDocIdentidadDel: string = null;
	nombreDocIdentidadTra: string = null;

	nombreAsesor: string = null;
	nombreSupervisor: string = null;
	nombreBackOffice: string = null;

	estadoGestion: number;
	isGestionando: boolean = false;

	array_canales_venta: Array<any> = [];
	array_cantidad_mesh: Array<any> = [];
	array_cuota_pago_instalacion_mesh: Array<any> = [];
	array_cuota_pago_instalacion: Array<any> = [];
	array_planes_contratado: Array<any> = [];
	array_relacion_predio: Array<any> = [];
	array_tipos_inmueble: Array<any> = [];
	array_tipos_servicio: Array<any> = [];
	array_tipo_doc: Array<any> = [];
	array_departamento: Array<any> = [];
	array_provincia: Array<any> = [];
	array_distrito: Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private chgRef: ChangeDetectorRef, 
    public toastr: ToastrManager,
    public multitabla_s: MultitablaService,
    public ventas_s: VentasService,
    private datePipe: DatePipe,
    private httpClient: HttpClient,
    private storage: AngularFireStorage,

  ) { }

  ngOnInit(): void {
    this.idVenta = this.route.snapshot.queryParams['id'] || 0;
		this.filterForm();
		this.getDataCombos();
		this.getGestionSeguimientoVenta();
    if (this.idVenta > 0) {
      this.getDataVenta(this.idVenta);
    } else {      
      // this.getEmpresas(null);  
    }    
    
  }

	getTipoDocumentoIdentidad(PosibleValor) {
		this.multitabla_s.GetTipoDocumentoIdentidad().subscribe(
			(data: any) => {
				this.array_tipo_doc = data;
				if (PosibleValor !== null) {
					this.filterGroup.controls.cboTipoDocumento.setValue(PosibleValor)
				}
			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

	getDataCombos(){
		this.ventas_s.GetDatosCombosVenta(2,0).subscribe(
			(data: any)=>{
				this.array_canales_venta = data.CanalesVenta;
				this.array_cantidad_mesh = data.CantidadMesh;
				this.array_cuota_pago_instalacion_mesh = data.CuotaPagoInstalacionMesh;
				this.array_cuota_pago_instalacion = data.CuotasPagoInstalacion;
				this.array_planes_contratado = data.PlanesContratado;
				this.array_relacion_predio = data.RelacionPredio;
				this.array_tipos_inmueble = data.TiposInmueble;
				this.array_tipos_servicio = data.TiposServicio;
			}, (errorServicio)=>{
        console.log(errorServicio);
			}
		)
	}
	getListarDepartamento(PosibleValor) {
		this.filterGroup.controls.cboDepartamento.reset();
		this.multitabla_s.GetListarDepartamentos(1).subscribe(
			(data: any) => {
				this.array_departamento = data;
				console.log(this.array_departamento);
				
				if (PosibleValor > 0) {
					this.filterGroup.controls.cboDepartamento.setValue(PosibleValor)
				}
			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

	getListarProvincia(Departamento, PosibleValor) {
		this.filterGroup.controls.cboProvincia.reset();
		this.multitabla_s.GetListarProvincia(Departamento).subscribe(
			(data: any) => {
				this.array_provincia = data;
				if (PosibleValor > 0) {
					this.filterGroup.controls.cboProvincia.setValue(PosibleValor)
				}
			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

	getListarDistrito(Provincia, PosibleValor) {
		this.filterGroup.controls.cboDistrito.reset();
		this.multitabla_s.GetListarDistrito(Provincia).subscribe(
			(data: any) => {
				this.array_distrito = data;
				if (PosibleValor > 0) {
					this.filterGroup.controls.cboDistrito.setValue(PosibleValor)
				}
			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

  getDataVenta(Venta) {
    this.ventas_s.GetDatosVenta(Venta).subscribe(
      (data:any) => {        
        console.log(data); 
        this.filterGroup.controls.Codigo.setValue(data[0].Codigo);
        this.filterGroup.controls.NombreCliente.setValue(data[0].NombresCliente);
				this.filterGroup.controls.ApePaternoCliente.setValue(data[0].ApePaternoCliente);
				this.filterGroup.controls.ApeMaternoCliente.setValue(data[0].ApeMaternoCliente);
        this.filterGroup.controls.TipoDocumento.setValue(data[0].TipoDocumento);
        this.filterGroup.controls.cboTipoDocumento.setValue(data[0].idTipoDocumento);
        this.filterGroup.controls.DocumentoIdentidad.setValue(data[0].documentoIdentidad);
        this.filterGroup.controls.Departamento.setValue(data[0].nombreDepartamento);
        this.filterGroup.controls.cboDepartamento.setValue(data[0].Departamento);
        this.filterGroup.controls.Provincia.setValue(data[0].nombreProvincia);
        this.filterGroup.controls.cboProvincia.setValue(data[0].Provincia);
        this.filterGroup.controls.Distrito.setValue(data[0].nombreDistrito);
        this.filterGroup.controls.cboDistrito.setValue(data[0].Distrito);
        this.filterGroup.controls.Direccion.setValue(data[0].direccion);
        this.filterGroup.controls.NroContacto1.setValue(data[0].nroContacto1);
        this.filterGroup.controls.NroContacto2.setValue(data[0].nroContacto2);
        this.filterGroup.controls.Whatsapp.setValue(data[0].whatsapp);
        this.filterGroup.controls.Email.setValue(data[0].email);
        this.filterGroup.controls.CanalVenta.setValue(data[0].canalVenta);
        this.filterGroup.controls.cboCanalVenta.setValue(data[0].idCanalVenta);
        this.filterGroup.controls.TipoServicio.setValue(data[0].tipoServicio);
        this.filterGroup.controls.cboTipoServicio.setValue(data[0].idTipoServicio);
        this.filterGroup.controls.TipoInmueble.setValue(data[0].tipoInmueble);
        this.filterGroup.controls.cboTipoInmueble.setValue(data[0].idTipoInmueble);
        this.filterGroup.controls.PlanContratado.setValue(data[0].planContrato);
        this.filterGroup.controls.cboPlanContratado.setValue(data[0].idPlanContrato);
        this.filterGroup.controls.CuotaPagoInstalacion.setValue(data[0].cuotasPagoInstalacion);
        this.filterGroup.controls.cboCuotaPagoInstalacion.setValue(data[0].idCuotasPagoInstalacion);
        this.filterGroup.controls.CantidadMesh.setValue(data[0].cantidadMesh);
        this.filterGroup.controls.cboCantidadMesh.setValue(data[0].idCantidadMesh);
				this.filterGroup.controls.TextMeshCableado.setValue(data[0].meshCableado);
        this.filterGroup.controls.MeshCableado.setValue(data[0].meshCableado=='SÍ'?'1':'0');
        this.filterGroup.controls.ObservacionesInterno.setValue(data[0].observacionEstadoVentaInterno);
        this.filterGroup.controls.ObservacionesCliente.setValue(data[0].observacionEstadoVentaExterno);
				if(data[0].fechaInstalacion != null){
					this.filterGroup.controls.FechaInstalacion.setValue(this.datePipe.transform(new Date(data[0].fechaInstalacion), 'yyyy-MM-dd'));
				}
				if(data[0].fechaRegistroCRM != null){	
					this.filterGroup.controls.FechaRegistro.setValue(this.datePipe.transform(new Date(data[0].fechaRegistroCRM), 'yyyy-MM-dd'));
				}
        this.filterGroup.controls.NumeroContrato.setValue(data[0].nroContrato);
        this.filterGroup.controls.CuotaPagoInstalacionMesh.setValue(data[0].cuotasPagoInstalacionMesh);
        this.filterGroup.controls.cboCuotaPagoInstalacionMesh.setValue(data[0].idCuotasPagoInstalacionMesh);
        this.filterGroup.controls.UrlGrabacion.setValue(data[0].urlArchivoGrabacion);
        this.filterGroup.controls.UrlDocumentacion.setValue(data[0].urlArchivoDocumentacion);
        this.filterGroup.controls.UrlDocumentoDelantero.setValue(data[0].urlDelanteraDocumentoIdentidad);
        this.filterGroup.controls.UrlDocumentoTrasero.setValue(data[0].urlTraseraDocumentoIdentidad);
        this.filterGroup.controls.Latitud.setValue(data[0].Latitud);
        this.filterGroup.controls.Longitud.setValue(data[0].Longitud);                
				this.nombreAsesor = data[0].NombreAsesor;
				this.nombreSupervisor = data[0].NombreSupervisor;
        this.nombreGrabacion = data[0].nombreArchivoGrabacion;
        this.nombreDocumentacion = data[0].nombreArchivoDocumentacion;
				this.nombreDocIdentidadDel = data[0].nombreDelanteraDocumentoIdentidad;
				this.nombreDocIdentidadTra = data[0].nombreTraseraDocumentoIdentidad;
        this.getTipoDocumentoIdentidad(data[0].idTipoDocumento);
				this.getListarDepartamento(data[0].Departamento);
				this.getListarProvincia(data[0].Departamento,data[0].Provincia);
				this.getListarDistrito(data[0].Provincia, data[0].Distrito)
        this.getEstadoEvaluacionGrabacion(data[0].EstadoGrabacion);
        this.getEstadoEvaluacionDocumentacion(data[0].EstadoDocumentacion);
        this.getEstadoRegistroCRM(data[0].EstadoRegistroCRM);
        this.getEstadoVentaInterno(data[0].EstadoVentaInterno);
        this.getEstadoVentaExterno(data[0].EstadoVentaExterno);
        // this.getEstadoInstalacion(data[0].EstadoInstalacion);

        this.chgRef.markForCheck();         
      }, ( errorServicio ) => {           
        console.log(errorServicio);
      }
    );
  }

    descargarArchivo(nombre, url) {
      console.log(nombre);
      console.log(url);
		if (url !== null) {
      let waitToastr = this.toastr.infoToastr('Descargando Archivo...', 'Descargando', {
        dismiss: 'controlled',
        animate: 'fade',
        progressBar: true
      });
			this.httpClient.get(url, { responseType: 'blob' })
				.subscribe(response => {
					FileSaver.saveAs(response, nombre);
          waitToastr.dismiss();     
				}, error => {
					this.toastr.errorToastr('Se produjo un error al descargar archivo.', 'Error!', {
						toastTimeout: 4000,
						showCloseButton: true,
						animate: 'fade',
						progressBar: true
					});
				});
		}
	}

  getEstadoVentaInterno(PosibleValor) {
    this.ventas_s.GetEstadoVentaInterna().subscribe(
      (data:any) => {
        this.array_venta_interno = data; 
        if (PosibleValor !== null && PosibleValor !== '') {
          this.filterGroup.controls.EstadoVentaInterno.setValue(PosibleValor);
        }    
      }, ( errorServicio ) => {           
        console.log(errorServicio);
      }
    );
  } 

  getEstadoEvaluacionGrabacion(PosibleValor) {
    this.multitabla_s.GetEstadoEvaluacionGrabacion().subscribe(
      (data:any) => {
        this.array_grabacion = data;
        if (PosibleValor !== null && PosibleValor.trim() !== '') {
          this.filterGroup.controls.EstadoGrabacion.setValue(PosibleValor);
        }    
      }, ( errorServicio ) => {            
      }
    );
  }

  getEstadoEvaluacionDocumentacion(PosibleValor) {
    this.multitabla_s.GetEstadoEvaluacionDocumentacion().subscribe(
      (data:any) => {
        this.array_documentacion = data;
        if (PosibleValor !== null && PosibleValor.trim() !== '') {
          this.filterGroup.controls.EstadoDocumentacion.setValue(PosibleValor);
        }  
      }, ( errorServicio ) => {            
      }
    );
  }

  getEstadoRegistroCRM(PosibleValor) {
    this.multitabla_s.GetEstadoRegistroCRM().subscribe(
      (data:any) => {
        this.array_registro_crm = data;
        if (PosibleValor !== null && PosibleValor.trim() !== '') {
          this.filterGroup.controls.EstadoRegConecta.setValue(PosibleValor);
        }  
      }, ( errorServicio ) => {            
      }
    );
  }

  getEstadoVentaExterno(PosibleValor) {
    this.multitabla_s.GetEstadoVentaExterno().subscribe(
      (data:any) => {
        this.array_venta_cliente = data;
        if (PosibleValor !== null && PosibleValor.trim() !== '') {
          this.filterGroup.controls.EstadoVentaCliente.setValue(PosibleValor);
        }  
      }, ( errorServicio ) => {            
      }
    );
  }

  getEstadoInstalacion(PosibleValor) {
    this.multitabla_s.GetEstadoInstalacion().subscribe(
      (data:any) => {
        this.array_instalacion = data;
        if (PosibleValor !== null && PosibleValor.trim() !== '') {
          this.filterGroup.controls.EstadoInstalacion.setValue(PosibleValor);
        }  
      }, ( errorServicio ) => {            
      }
    );
  }

  filterForm() {
    this.filterGroup = this.fb.group({      
      Codigo: [null],
      NombreCliente: [null, Validators.compose([Validators.required])],
      ApePaternoCliente: [null, Validators.compose([Validators.required])],
      ApeMaternoCliente: [null, Validators.compose([Validators.required])],
      TipoDocumento: [null],
			cboTipoDocumento: [null, Validators.compose([Validators.required])],
      DocumentoIdentidad: [null, Validators.compose([Validators.required])],
      Departamento: [null],
      cboDepartamento: [null, Validators.compose([Validators.required])],
      Provincia: [null],
      cboProvincia: [null, Validators.compose([Validators.required])],
      Distrito: [null],
      cboDistrito: [null, Validators.compose([Validators.required])],
      Direccion: [null, Validators.compose([Validators.required])],
      NroContacto1: [null, Validators.compose([Validators.required])],
      NroContacto2: [null, Validators.compose([Validators.required])],
      Whatsapp: [null, Validators.compose([Validators.required])],
      Email: [null, Validators.compose([Validators.required])],
      CanalVenta: [null],
      cboCanalVenta: [null, Validators.compose([Validators.required])],
      TipoServicio: [null],
      cboTipoServicio: [null, Validators.compose([Validators.required])],
      TipoInmueble: [null],
      cboTipoInmueble: [null, Validators.compose([Validators.required])],
      PlanContratado: [null],
      cboPlanContratado: [null, Validators.compose([Validators.required])],
      CuotaPagoInstalacion: [null],
      cboCuotaPagoInstalacion: [null, Validators.compose([Validators.required])],
      CantidadMesh: [null],
      cboCantidadMesh: [null, Validators.compose([Validators.required])],
      MeshCableado: [null],
			TextMeshCableado: [null],
      CuotaPagoInstalacionMesh: [null],
      cboCuotaPagoInstalacionMesh: [null, Validators.compose([Validators.required])],
			Latitud: [null, Validators.compose([Validators.required])],
			Longitud: [null, Validators.compose([Validators.required])],
      EstadoGrabacion: [null],
      FileGrabacion: [null],
      EstadoDocumentacion: [null],
      FileDocumentacion: [null],
      EstadoRegConecta: [null],
      FechaRegistro: [null],
      NumeroContrato: [null],
      EstadoVentaInterno: [null],
      ObservacionesInterno: [null],
      EstadoVentaCliente: [null],
      ObservacionesCliente: [null],
      EstadoInstalacion: [null],
      FechaInstalacion: [null],
      UrlGrabacion: [null],
      UrlDocumentacion: [null],
      UrlDocumentoDelantero: [null],
			FileDocDelantero: [null],
      UrlDocumentoTrasero: [null],
			FileDocTrasero: [null]
    });    
  }


  getFileDATAGrabacion(event) {
    if(event.target.files && event.target.files.length) {
      let waitToastr = this.toastr.infoToastr('Cargando Grabación...', 'Cargando...', {
        dismiss: 'controlled',
        animate: 'fade',
        progressBar: true
      });
      const file = event.target.files[0];
      let nombreArchivo = file.name;
      let datoArchivo = nombreArchivo.split(".");
      let tipoDocumento = datoArchivo[datoArchivo.length-1];
      let filePath = '';

      filePath = 'Grabaciones/' + Date.now() + '.' + datoArchivo[datoArchivo.length - 1];


      this.ref = this.storage.ref(filePath);
      this.task = this.ref.put(file);
      this.task.snapshotChanges().pipe(
        finalize(() => {
          this.ref.getDownloadURL().subscribe(url => {
            this.nombreGrabacion = nombreArchivo;
            console.log(url);
            this.filterGroup.controls.UrlGrabacion.setValue(url);
            waitToastr.dismiss();     
            this.chgRef.markForCheck();
          });
        })
      ).subscribe();

    }
  }
  
	getFileDATAdocDelantero(event) {
    if(event.target.files && event.target.files.length) {
      let waitToastr = this.toastr.infoToastr('Cargando Documentación...', 'Cargando...', {
        dismiss: 'controlled',
        animate: 'fade',
        progressBar: true
      });
      const file = event.target.files[0];
      let nombreArchivo = file.name;
      let datoArchivo = nombreArchivo.split(".");
      let tipoDocumento = datoArchivo[datoArchivo.length-1];
      let filePath = '';

      filePath = 'Documentacion/' + Date.now() + '.' + datoArchivo[datoArchivo.length - 1];

      this.ref = this.storage.ref(filePath);
      this.task = this.ref.put(file);
      this.task.snapshotChanges().pipe(
        finalize(() => {
          this.ref.getDownloadURL().subscribe(url => {
            this.nombreDocIdentidadDel = nombreArchivo;
            this.filterGroup.controls.UrlDocumentoDelantero.setValue(url);
            console.log(url);
            waitToastr.dismiss();     
            this.chgRef.markForCheck();
          });
        })
      ).subscribe();

    }
  }
  
	getFileDATAdocTrasero(event) {
    if(event.target.files && event.target.files.length) {
      let waitToastr = this.toastr.infoToastr('Cargando Documentación...', 'Cargando...', {
        dismiss: 'controlled',
        animate: 'fade',
        progressBar: true
      });
      const file = event.target.files[0];
      let nombreArchivo = file.name;
      let datoArchivo = nombreArchivo.split(".");
      let tipoDocumento = datoArchivo[datoArchivo.length-1];
      let filePath = '';

      filePath = 'Documentacion/' + Date.now() + '.' + datoArchivo[datoArchivo.length - 1];

      this.ref = this.storage.ref(filePath);
      this.task = this.ref.put(file);
      this.task.snapshotChanges().pipe(
        finalize(() => {
          this.ref.getDownloadURL().subscribe(url => {
            this.nombreDocIdentidadTra = nombreArchivo;
            this.filterGroup.controls.UrlDocumentoTrasero.setValue(url);
            console.log(url);
            waitToastr.dismiss();     
            this.chgRef.markForCheck();
          });
        })
      ).subscribe();

    }
  }
  
  getFileDATADocumentacion(event) {
    if(event.target.files && event.target.files.length) {
      let waitToastr = this.toastr.infoToastr('Cargando Documentación...', 'Cargando...', {
        dismiss: 'controlled',
        animate: 'fade',
        progressBar: true
      });
      const file = event.target.files[0];
      let nombreArchivo = file.name;
      let datoArchivo = nombreArchivo.split(".");
      let tipoDocumento = datoArchivo[datoArchivo.length-1];
      let filePath = '';

      filePath = 'Documentacion/' + Date.now() + '.' + datoArchivo[datoArchivo.length - 1];

      this.ref = this.storage.ref(filePath);
      this.task = this.ref.put(file);
      this.task.snapshotChanges().pipe(
        finalize(() => {
          this.ref.getDownloadURL().subscribe(url => {
            this.nombreDocumentacion = nombreArchivo;
            this.filterGroup.controls.UrlDocumentacion.setValue(url);
            console.log(url);
            waitToastr.dismiss();     
            this.chgRef.markForCheck();
          });
        })
      ).subscribe();

    }
  }

	getGestionSeguimientoVenta(){
		this.ventas_s.GetGestionSeguimientoVenta(this.idVenta).subscribe(
			(data: any)=>{
				this.estadoGestion = data[0].estadoGestion;
				this.nombreBackOffice = data[0].BackOffice;
				if(this.estadoGestion===1){
					this.isGestionando = true;
				}
				console.log(data[0]);
				console.log(this.isGestionando && this.estadoGestion==2);
			}, (errorServicio)=>{
				console.log(errorServicio);
			}
		)
	}

	gestionarSeguimientoVenta(){
		this.ventas_s.UpdateGestionSeguimientoVenta({Venta:this.idVenta}).subscribe(
			(data:any)=>{
				data = data[0];
				if (data.Respuesta > 0) {
          this.isGestionando = true;
					this.nombreBackOffice = data.BackOffice;
          this.toastr.successToastr(data.Mensaje, 'Correcto!', {
            toastTimeout: 3000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
				}else if(data.Respuesta == -1){
          this.toastr.warningToastr(data.Mensaje, 'Aviso!', {
            toastTimeout: 3000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
        } else {
          this.toastr.errorToastr(data.Mensaje, 'Error!', {
            toastTimeout: 3000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          })
				}
				this.chgRef.markForCheck();
			}, (errorServicio)=>{
				this.toastr.errorToastr('Ocurrio un error.', 'Error!', {
          toastTimeout: 3000,
          showCloseButton: true,
          animate: 'fade',
          progressBar: true
        }); 
			}
		);
	}

  saveUpdateSeguimientoVenta() {    
    const controls = this.filterGroup.controls;
		if (this.filterGroup.invalid) {
			this.hide_save = false;
			this.hide_load = true;
			this.activeTabId = 0;
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.toastr.warningToastr('Ingrese los campos obligatorios.', 'Advertencia!', {
				toastTimeout: 2000,
				showCloseButton: true,
				animate: 'fade',
				progressBar: true
			});
			return;
		}

    let model = this.prepare_model();
		
    this.hide_load = false;
    this.ventas_s.UpdateDataSeguimientoVenta(model).subscribe(
      (data:any) => {
        if (data[0].Respuesta > 0) {
          this.hide_load = true;
          this.toastr.successToastr(data[0].Mensaje, 'Correcto!', {
            toastTimeout: 3000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
          this.router.navigate(['Comercial/process/SeguimientoVentas']);
        } else {
          this.hide_load = true;
          this.toastr.errorToastr(data[0].Mensaje, 'Error!', {
            toastTimeout: 3000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
        }
      }, ( errorServicio ) => {  
        this.hide_save = false;
        this.hide_load = true;
        this.toastr.errorToastr('Ocurrio un error.', 'Error!', {
          toastTimeout: 3000,
          showCloseButton: true,
          animate: 'fade',
          progressBar: true
        });                 
      }
    );    
  }
  
  private prepare_model() {
    const formData = this.filterGroup.value;
    return {
      Venta: this.idVenta,
			NombreCliente: formData.NombreCliente,
			ApePaternoCliente: formData.ApePaternoCliente,
			ApeMaternoCliente: formData.ApeMaternoCliente,
			TipoDocumento: formData.cboTipoDocumento,
			DocIdentidad: formData.DocumentoIdentidad,
			Departamento: formData.cboDepartamento,
			Provincia: formData.cboProvincia,
			Distrito: formData.cboDistrito,
			Direccion: formData.Direccion,
			Contacto1: formData.NroContacto1,
			Contacto2: formData.NroContacto2,
			Whatsapp: formData.Whatsapp,
			Email: formData.Email,
			CanalVenta: formData.cboCanalVenta,
			TipoServicio: formData.cboTipoServicio,
			TipoInmueble: formData.cboTipoInmueble,
			PlanContrado: formData.cboPlanContratado,
			CuotasPagoInstalacion: formData.cboCuotaPagoInstalacion,
			CantidadMesh: formData.cboCantidadMesh,
			MeshCableado: formData.MeshCableado,
			CuotasPagoInstalacionMesh: formData.cboCuotaPagoInstalacionMesh,
			Latitud: formData.Latitud,
			Longitud: formData.Longitud,
      EstadoGrabacion: formData.EstadoGrabacion,
      EstadoDocumentacion: formData.EstadoDocumentacion,
      EstadoRegConecta: formData.EstadoRegConecta,      
      EstadoVentaInterno: formData.EstadoVentaInterno,
      EstadoVentaExterno: formData.EstadoVentaCliente,
      EstadoInstalacion: null,
      ObservacionesInterno: formData.ObservacionesInterno,
      ObservacionesExterno: formData.ObservacionesCliente, 
      FechaInstalacion: formData.FechaInstalacion, 
      FechaRegistro: formData.FechaRegistro,
      NumeroContrato: formData.NumeroContrato, 
      NombreGrabacion: this.nombreGrabacion, 
      UrlGrabacion: formData.UrlGrabacion, 
      NombreDocumentacion: this.nombreDocumentacion, 
      UrlDocumentacion: formData.UrlDocumentacion 
    }
   
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.filterGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.filterGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.filterGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    const control = this.filterGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
