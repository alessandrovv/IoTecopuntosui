import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
// import { CustomersComponent } from './customers/customers.component';
// import { ProductsComponent } from './products/products.component';
// import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';


import { MastersRoutingModule } from './masters-routing.module';
import { MastersComponent } from './masters.component';
import { CertificadosComponent } from './certificados/certificados.component';
import { SaveUpdateCertificadoModalComponent } from './certificados/save-update-certificado-modal/save-update-certificado-modal.component';
import { CRUDTableModule } from '../../../_metronic/shared/crud-table/crud-table.module';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfiguracionDocumentoComponent } from './configuracion-documento/configuracion-documento.component';
import { SaveUpdateDocumentoComponent } from './configuracion-documento/save-update-documento/save-update-documento.component';
import { TrabajadoresComponent } from './trabajadores/trabajadores.component';
import { SaveUpdateTrabajadoresComponent } from './trabajadores/save-update-trabajadores/save-update-trabajadores.component';
import { DynamicFormComponent } from './_shared/dynamic-form/dynamic-form.component';
import { PostulanteComponent } from './postulantes/postulante.component';
import { PostulanteEditComponent } from './postulantes/postulante-edit/postulante-edit.component';
import { EquiposComercialesComponent } from './equipos-comerciales/equipos-comerciales.component';
import { EquipoComercialAddComponent } from './equipos-comerciales/equipo-comercial-add/equipo-comercial-add.component';
import { SearchAsesorComercialComponent } from './_shared/search-asesor-comercial/search-asesor-comercial.component';
import { EliminarAsesorComercialComponent } from './_shared/eliminar-asesor-comercial/eliminar-asesor-comercial.component';
import { AreaComponent } from './area/area.component';
import { SaveUpdateAreaComponent } from './area/save-update-area/save-update-area.component';

import { PuestoTrabajoComponent } from './puesto-trabajo/puesto-trabajo.component';
import { SaveUpdatePuestoTrabajoComponent } from './puesto-trabajo/save-update-puesto-trabajo/save-update-puesto-trabajo.component';
import { VacanteComponent } from './vacante/vacante.component';
import { SaveUpdateVacanteComponent } from './vacante/save-update-vacante/save-update-vacante.component';

@NgModule({
  declarations: [
    // CustomersComponent,
    // ProductsComponent,
    MastersComponent,
    CertificadosComponent,
    SaveUpdateCertificadoModalComponent,
    ConfiguracionDocumentoComponent,
    SaveUpdateDocumentoComponent,
    TrabajadoresComponent,
    SaveUpdateTrabajadoresComponent,
    DynamicFormComponent,
		PostulanteComponent,
		PostulanteEditComponent,
    EquiposComercialesComponent,
    EquipoComercialAddComponent,
    SearchAsesorComercialComponent,
    EliminarAsesorComercialComponent,
    AreaComponent,
    SaveUpdateAreaComponent,
    PuestoTrabajoComponent,
    SaveUpdatePuestoTrabajoComponent,
    VacanteComponent,
    SaveUpdateVacanteComponent,
    // DeleteCustomerModalComponent,
    // DeleteCustomersModalComponent,
    // UpdateCustomersStatusModalComponent,
    // EditCustomerModalComponent,
    // DeleteProductModalComponent,
    // DeleteProductsModalComponent,
    // UpdateProductsStatusModalComponent,
    // FetchProductsModalComponent,
    // ProductEditComponent,
    // RemarksComponent,
    // SpecificationsComponent,
    // DeleteRemarkModalComponent,
    // DeleteRemarksModalComponent,
    // FetchRemarksModalComponent,
    // DeleteSpecModalComponent,
    // DeleteSpecsModalComponent,
    // FetchSpecsModalComponent,
    // EditRemarkModalComponent,
    // EditSpecModalComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MastersRoutingModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  entryComponents: [
    SaveUpdateCertificadoModalComponent,
    SearchAsesorComercialComponent,
    EliminarAsesorComercialComponent
    // DeleteCustomersModalComponent,
    // UpdateCustomersStatusModalComponent,
    // FetchCustomersModalComponent,
    // EditCustomerModalComponent,
    // DeleteProductModalComponent,
    // DeleteProductsModalComponent,
    // UpdateProductsStatusModalComponent,
    // FetchProductsModalComponent,
    // DeleteRemarkModalComponent,
    // DeleteRemarksModalComponent,
    // FetchRemarksModalComponent,
    // DeleteSpecModalComponent,
    // DeleteSpecsModalComponent,
    // FetchSpecsModalComponent,
    // EditRemarkModalComponent,
    // EditSpecModalComponent
  ]
})
export class MastersModule {}
