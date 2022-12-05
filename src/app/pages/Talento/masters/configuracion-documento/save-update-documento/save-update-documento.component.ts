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
import { CertificadosService } from '../../../_core/services/certificados.service';
import { DocumentoService } from '../../../_core/services/documento.service';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { EmpresaService } from '../../../../Security/_core/services/empresa.service';
import { puestoTrabajoService } from '../../../_core/services/puestoTrabajo.service';

@Component({
  selector: 'app-save-update-documento',
  templateUrl: './save-update-documento.component.html',
  styleUrls: ['./save-update-documento.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class SaveUpdateDocumentoComponent implements OnInit {
  formGroup: FormGroup;
  load_data: boolean = true;
  no_data: boolean = false;
  searchBan: boolean = false;
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Nro', 'Empresa', 'DesModalidad', 'DesPuestoTrabajo', 'Activo', 'actions'];
  @ViewChild(MatSort) MatSort: MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

  private subscriptions: Subscription[] = [];
  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];
  array_dataList: any;
  array_empresas: any;
  array_puestos: any;
  array_modalidad: any;
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
  idConfigDocumento: number = 0;

  constructor(
    private fb: FormBuilder,
    public certificado_s: CertificadosService,
    public documento_s: DocumentoService,
    public empresa_s:EmpresaService,
    public puestoTrabajo_s:puestoTrabajoService,
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
    this.documentoForm();
    this.idConfigDocumento = this.route.snapshot.queryParams['id'] || 0;
    this.getTipoDatoslList();

    if (this.idConfigDocumento > 0) {
      this.getDataConfiguracion(this.idConfigDocumento);
    } else {
      this.getEmpresas(null);
      this.getModalidadContratacion(null);
      this.getPuestoTrabajo(null,null);
      // this.getTipoDatoslList();
      this.getDatosContratosDocumentoList();
      this.getDocumentoExpedienteList();  
    }    
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  getDataConfiguracion(Documento) {
    this.documento_s.GetDatosConfiguracionDocumento(Documento).subscribe(
      (data:any) => {
        console.log(data);
        let dataCab = data[0];
        this.array_datos_contrato = data[1];
        this.array_expediente = data[2];

        console.log(this.array_expediente);

        this.array_datos_contrato.forEach(e => {
          this.deta_formTipoDato.push(new FormControl(e.TipoDato, [Validators.required]));
        });
        this.chgRef.markForCheck();

        this.getEmpresas(dataCab[0].Empresa);
        this.getModalidadContratacion(dataCab[0].Modalidad);       
        this.getPuestoTrabajo(dataCab[0].Empresa,dataCab[0].PuestoTrabajo);       
      }, ( errorServicio ) => {           
        console.log(errorServicio);
      }
    );
  }

  documentoForm() {
    this.formGroup = this.fb.group({
      Modalidad: [null, Validators.compose([Validators.required])],
      Empresa: [null, Validators.compose([Validators.required])],
      PuestoTrabajo: [null, Validators.compose([Validators.required])],
    });    
  }

  getEmpresas(PosibleValor) {
    this.empresa_s.GetEmpresaByUsuario().subscribe(
      (data:any) => {        
        this.array_empresas = data;
        if (PosibleValor !== null) {
          this.formGroup.controls.Empresa.setValue(PosibleValor);
        }              
      }, ( errorServicio ) => {           
        console.log(errorServicio);
      }
    );
  }

  getModalidadContratacion(PosibleValor) {
    this.multitabla_s.GetModalidadContratacion().subscribe(
      (data:any) => {
        this.array_modalidad = data;
        if (PosibleValor !== null) {
          this.formGroup.controls.Modalidad.setValue(PosibleValor)
        }                      
      }, ( errorServicio ) => {            
        console.log(errorServicio);
      }
    );
  }

  getPuestoTrabajo(Empresa,PosibleValor) {
    this.formGroup.controls.PuestoTrabajo.reset();
    this.array_puestos = [];
    if (Empresa !== null && Empresa!==undefined) {  
      this.puestoTrabajo_s.GetPuestoTrabajoByUsuario(Empresa,0).subscribe(
        (data:any) => {
          this.array_puestos = data;
          if (PosibleValor !== null) {
            this.formGroup.controls.PuestoTrabajo.setValue(PosibleValor)
          }                    
        }, ( errorServicio ) => {
              
          console.log(errorServicio);
        }
      );
    }
  }
  getTipoDatoslList() {
    this.documento_s.GetTipoDatoslList().subscribe(
      (data:any) => {
        this.array_tipo_dato = data;     
      }, ( errorServicio ) => {           
        console.log(errorServicio);
      }
    );
  }

  getDatosContratosDocumentoList() {
    this.documento_s.GetDatosContratosDocumentoList().subscribe(
      (data:any) => {
        this.array_datos_contrato = data;
        this.array_datos_contrato.forEach(e => {
          this.deta_formTipoDato.push(new FormControl(e.TipoDato, [Validators.required]));
        });
        this.chgRef.markForCheck();
        console.log(data);         
      }, ( errorServicio ) => {           
        console.log(errorServicio);
      }
    );
  }
  
  getDocumentoExpedienteList() {
    this.documento_s.GetDocumentoExpediente().subscribe(
      (data:any) => {
        this.array_expediente = data;  
        this.chgRef.markForCheck();             
      }, ( errorServicio ) => {           
        console.log(errorServicio);
      }
    );
  }

  

  saveUpdateConfiguracion() {
    this.hide_save = true;
    this.hide_load = false;
    const controls = this.formGroup.controls;
    if (controls['Modalidad'].status === 'INVALID' || controls['Empresa'].status === 'INVALID' || controls['PuestoTrabajo'].status === 'INVALID') {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      this.hide_save = false;
      this.hide_load = true;
      this.toastr.warningToastr('Ingrese los campos obligatorios.', 'Advertencia!', {
        toastTimeout: 2000,
        showCloseButton: true,
        animate: 'fade',
        progressBar: true
      });
      return;
    }

    for (let i = 0; i < this.array_datos_contrato.length; i++) {
      if (this.array_datos_contrato[i].DatoContratoHabilitado) {
        if (this.deta_formTipoDato[i].status  === 'INVALID') {
          this.hide_save = false;
          this.hide_load = true;
          this.toastr.warningToastr('Seleccione un tipo de dato para los obligatorios.', 'Advertencia!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
          return;
        }       
      }			
		}


    let datos = this.prepare_model();
    this.documento_s.SaveUpdateConfiguracionDocumento(datos).subscribe(
      (data:any) => {
        if (data[0].Ok > 0) {
          this.toastr.successToastr(data[0].Message, 'Correcto!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
          this.router.navigate(['Talento/masters/ConfiguracionDocumento']);
        } else {
          this.hide_save = false;
          this.hide_load = true;
          this.toastr.errorToastr(data[0].Message, 'Error!', {
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

  prepare_model() {
    const controls = this.formGroup.controls;
    let datoContrato = [];
    let datoExpediente = [];
    console.log('object');
    for (let i = 0; i < this.array_datos_contrato.length; i++) {
      if (this.array_datos_contrato[i].DatoContratoHabilitado) {        
        datoContrato.push({
          ConfigDatoContrato: this.array_datos_contrato[i].ConfigDatoContrato,
          Dato: this.array_datos_contrato[i].ValorDato,
          TipoDato: this.deta_formTipoDato[i].value,
          Habilitado: this.array_datos_contrato[i].DatoContratoHabilitado,
          Obligatorio: this.array_datos_contrato[i].DatoContratoObligatorio,				
        });
      }			
		}

    for (let i = 0; i < this.array_expediente.length; i++) {
      if (this.array_expediente[i].Aplica) {        
        datoExpediente.push({
          DocumentoExpediente: this.array_expediente[i].DocumentoExpediente,
          ValorExpediente: this.array_expediente[i].ValorExpediente,
          Nombre: this.array_expediente[i].Nombre,
          Aplica: this.array_expediente[i].Aplica,				
        });
      }			
		}


    return {
      IdConfiguracion: this.idConfigDocumento,
      Empresa: controls['Empresa'].value,
      Modalidad: controls['Modalidad'].value,
      PuestoTrabajo: controls['PuestoTrabajo'].value,      
      DocumentoExpediente: datoExpediente,
      DatoContrato: datoContrato
    }
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


