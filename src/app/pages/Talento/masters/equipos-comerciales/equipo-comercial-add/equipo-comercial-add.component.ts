import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap, filter } from 'rxjs/operators';
// import { Product } from '../../_models/product.model';
// import { ProductsService } from '../../_services';
import { CertificadosService } from '../../../_core/services/certificados.service';
import { equipoComercialService } from '../../../_core/services/equipoComercial.service';
import { SaveUpdateCertificadoModalComponent } from '../../certificados/save-update-certificado-modal/save-update-certificado-modal.component';
import { SearchAsesorComercialComponent } from '../../_shared/search-asesor-comercial/search-asesor-comercial.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { EliminarAsesorComercialComponent } from '../../_shared/eliminar-asesor-comercial/eliminar-asesor-comercial.component';
import { EmpresaService } from '../../../../Security/_core/services/empresa.service';

// const EMPTY_PRODUCT: Product = {
//   id: undefined,
//   model: '',
//   manufacture: 'Pontiac',
//   modelYear: 2020,
//   mileage: 0,
//   description: '',
//   color: 'Red',
//   price: 0,
//   condition: 1,
//   status: 1,
//   VINCode: '',
// };

@Component({
  selector: 'app-equipo-comercial-add',
  templateUrl: './equipo-comercial-add.component.html',
  styleUrls: ['./equipo-comercial-add.component.scss']
})
export class EquipoComercialAddComponent implements OnInit {
  idEquipoComercial: number = 0;
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
  array_asesores: any = [];
  array_asesores_eliminado: any = [];
  idEmpresa: number = 0;
  idCertificado: number = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public certificado_s: CertificadosService,
    public empresa_s:EmpresaService,
    public equipo_s: equipoComercialService,
    private modalService: NgbModal,
    private chgRef: ChangeDetectorRef, 
    public toastr: ToastrManager,
  ) { }

  ngOnInit(): void {
    this.idEquipoComercial = this.route.snapshot.queryParams['id'] || 0;
    if (this.idEquipoComercial > 0) {
      this.getDataEquiposComerciales(this.idEquipoComercial);
    } else {      
      this.getEmpresas(null);  
    }    
    
    this.filterForm();
  }

    getDataEquiposComerciales(EquipoComercial) {
    this.equipo_s.GetDataEquipoComercial(EquipoComercial).subscribe(
      (data:any) => {
        let datoLider = data[0];
        this.array_lider = data[0];
        this.NombresLider = datoLider[0].NombresTrabajador;
        this.idEmpresa = datoLider[0].Empresa;
        this.idCertificado = datoLider[0].Certificado;

        


        this.CelularLider = datoLider[0].Celular;
        this.EmailLider = datoLider[0].Email;
        this.EdadLider = datoLider[0].Edad;
        this.VentasLider = datoLider[0].Ventas;
        this.EsquemaComisionLider = datoLider[0].EsquemaComision;
        this.DescEmpresa = datoLider[0].DesEmpresa;
        this.vigenteLider = datoLider[0].Vigente;
        this.DescCertificado = datoLider[0].DescCertificado;
        this.array_asesores = data[1];   
        this.chgRef.markForCheck();         
      }, ( errorServicio ) => {           
        console.log(errorServicio);
      }
    );
  }

  getCetificados(empresa, cliente, estado) {
    this.filterGroup.controls.Certificado.reset();
    this.certificado_s.GetCertificadosList(empresa, cliente, estado).subscribe(
      (data:any) => {
        this.array_certificado = data;
      }, ( errorServicio ) => {            
      }
    );
  }

  getListarAsociadosComercial(certificado) {
    this.equipo_s.GetListarAsociadosComercial(certificado).subscribe(
      (data:any) => {
        this.array_asociado = data;
      }, ( errorServicio ) => {            
      }
    );
  }

  changeAsociado(Asociado) {
    let result = this.array_asociado.find(item=> item.Trabajador === Asociado);
    this.array_lider.push(result);
    this.NombresLider = result.NombresTrabajador;
    this.CelularLider = result.Celular;
    this.EmailLider = result.Email;
    this.EdadLider = result.Edad;
    this.VentasLider = result.Ventas;
    this.EsquemaComisionLider = result.EsquemaComision;
    this.vigenteLider = result.Vigente;
  }

  filterForm() {
    this.filterGroup = this.fb.group({      
      Empresa: [null],
      Certificado: [null],
      Asociado: [null],
    });    
  }

  getEmpresas(PosibleValor) {
    this.empresa_s.GetEmpresaByUsuario().subscribe(
      (data:any) => {
        this.array_empresas = data;
        if (PosibleValor !== null) {
          this.filterGroup.controls.Empresa.setValue(PosibleValor);
        }        
      }, ( errorServicio ) => {           
        console.log(errorServicio);
      }
    );
  } 
    
  addAsesorComercial() {
    console.log('object');
    let empresa = (this.idEquipoComercial > 0) ? this.idEmpresa : this.filterGroup.controls.Empresa.value;
    let asociado = this.filterGroup.controls.Asociado.value;
    // if (empresa === null) {
    //   this.toastr.infoToastr('Seleccione una empresa.', 'Información!', {
    //     toastTimeout: 2000,
    //     showCloseButton: true,
    //     animate: 'fade',
    //     progressBar: true
    //   });
    //   return;
    // }

    // if (asociado === null) {
    //   this.toastr.infoToastr('Seleccione un asociado comercial.', 'Información!', {
    //     toastTimeout: 2000,
    //     showCloseButton: true,
    //     animate: 'fade',
    //     progressBar: true
    //   });
    //   return;
    // }

    const modalRef = this.modalService.open(SearchAsesorComercialComponent, { size: 'xl' });
    modalRef.componentInstance.Empresa = empresa;
    modalRef.result.then((result) => {

      for (let i = 0; i <= result.length - 1; i++) {
        let ban = this.array_asesores.filter(item=> item.Trabajador === result[i].Trabajador)
        if (ban.length > 0) {
          this.toastr.infoToastr('El asesor '+ result[i].NombresTrabajador + ' ya se encuentra agregado.', 'Información!', {
            toastTimeout: 3000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
        } else {
          this.array_asesores.push(result[i]);
        }
      }
      this.chgRef.markForCheck();  
      
    }, (reason) => {
     console.log(reason);
    }); 
  }

  
  addAsesorComercialEdicion() {
    const modalRef = this.modalService.open(SearchAsesorComercialComponent, { size: 'xl' });
    modalRef.componentInstance.Empresa = this.idEmpresa;
    modalRef.result.then((result) => {

      for (let i = 0; i <= result.length - 1; i++) {
        let ban = this.array_asesores.filter(item=> item.Trabajador === result[i].Trabajador)
        if (ban.length > 0) {
          this.toastr.infoToastr('El asesor '+ result[i].NombresTrabajador + ' ya se encuentra agregado.', 'Información!', {
            toastTimeout: 3000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
        } else {
          this.array_asesores.push(result[i]);
        }
      }
      this.chgRef.markForCheck();  
      
    }, (reason) => {
     console.log(reason);
    }); 
  }

  saveUpdateEquipoComercial() {    
    let model = this.prepare_model();
    this.equipo_s.SaveUpdateEquipoComercial(model).subscribe(
      (data:any) => {
        if (data[0].Respuesta > 0) {
          this.hide_save = false;
          this.hide_load = true;
          this.toastr.successToastr(data[0].Mensaje, 'Correcto!', {
            toastTimeout: 3000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
          this.router.navigate(['Talento/masters/EquipoComercial']);
        } else {
          this.hide_save = false;
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

    if (this.idEquipoComercial > 0) {
      let datoAsesor = [];

      for(let i = 0; i <= this.array_asesores.length - 1; i++) {
        datoAsesor.push(this.array_asesores[i]);
      }

      for(let i = 0; i <= this.array_asesores_eliminado.length - 1; i++) {
        datoAsesor.push({
          Celular: this.array_asesores_eliminado[i].Celular,
          Codigo: null,
          Direccion: null,
          DocIdentidad: null,
          Edad: this.array_asesores_eliminado[i].Edad,
          Eliminado: 1,
          Email: null,
          EquipoDetalle: this.array_asesores_eliminado[i].EquipoDetalle,
          EsquemaComision: this.array_asesores_eliminado[i].EsquemaComision,
          FechaIngreso: this.array_asesores_eliminado[i].FechaIngreso,
          FechaSalida: this.array_asesores_eliminado[i].FechaSalida,
          NombresTrabajador: this.array_asesores_eliminado[i].NombresTrabajador,
          Selected: true,
          Sexo: null,
          Trabajador: this.array_asesores_eliminado[i].Trabajador,
          Ventas: 0
        });
      }

      return {
        EquipoComercial: this.idEquipoComercial,
        Empresa: this.array_lider[0].Empresa,
        Certificado: this.array_lider[0].Certificado,
        Trabajador: this.array_lider[0].Trabajador,      
        Asesores: datoAsesor 
      }
    } else {
      return {
        EquipoComercial: this.idEquipoComercial,
        Empresa: formData.Empresa,
        Certificado: formData.Certificado,
        Trabajador: formData.Asociado,      
        Asesores: this.array_asesores 
      }
    }
    
    
  }

  deleteAsesorComercial(item) {
    if (item.EquipoDetalle > 0) {
      const modalRef = this.modalService.open(EliminarAsesorComercialComponent);
      modalRef.componentInstance.id = item.EquipoDetalle;
      modalRef.componentInstance.titulo = 'Eliminar Asesor Comercial';
      modalRef.componentInstance.descripcion = '¿Estas seguro que desea eliminar del equipo a este asesor comercial?';
      modalRef.componentInstance.msgloading = 'Eliminando asesor...';
      modalRef.result.then((result) => {
        let index = this.array_asesores.indexOf(item);
        item.FechaSalida = result.FechaSalida;
        if (item.EquipoDetalle > 0) {
          this.array_asesores_eliminado.push(item);
        }
        this.array_asesores.splice(index, 1);
        this.chgRef.markForCheck();
  
      }, (reason) => {
       console.log(reason);
      }); 
    } else {
      let index = this.array_asesores.indexOf(item);      
      this.array_asesores.splice(index, 1);
      this.chgRef.markForCheck();
    }
    

    
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
