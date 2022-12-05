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
import { CRUDTableModule } from '../../../_metronic/shared/crud-table/crud-table.module';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { NgSelectModule } from '@ng-select/ng-select';
import { MultitablaComponent } from './multitabla/multitabla.component';
import { SaveUpdateMultitablaComponent } from './multitabla/save-update-multitabla/save-update-multitabla.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { SaveUpdateUsuarioComponent } from './usuario/save-update-usuario/save-update-usuario.component';
import { ResetPasswordComponent } from './usuario/reset-password/reset-password.component';
import { RolComponent } from './rol/rol.component';
import { SaveUpdateRolModalComponent } from './rol/save-update-rol-modal/save-update-rol-modal.component';
import { AsignarRolEmpresaComponent } from './usuario/asignar-rol-empresa/asignar-rol-empresa.component';
import { DatosPersonalesComponent } from './datos-personales/datos-personales.component';
import { InformacionPersonalComponent } from './datos-personales/informacion-personal/informacion-personal.component';
import { PerfilOpcionesComponent } from './datos-personales/perfil-opciones/perfil-opciones.component';
import { CambiarPasswordComponent } from './datos-personales/cambiar-password/cambiar-password.component';
import { DistritoComponent } from './distrito/distrito.component';
import { SaveUpdateDistritoModalComponent } from './distrito/update-distrito-modal/update-distrito-modal.component';
import { NewDistritoModalComponent } from './distrito/new-distrito-modal/new-distrito-modal.component';
import { ProvinciaComponent } from './provincia/provincia.component';
import { SaveUpdateProvinciaComponent } from './provincia/save-update-provincia/save-update-provincia.component';
import { DepartamentoComponent } from './departamento/departamento.component';
import { SaveUpdateDepartamentoComponent } from './departamento/save-update-departamento/save-update-departamento.component';

@NgModule({
  declarations: [
    // CustomersComponent,
    // ProductsComponent,
    MastersComponent,
		MultitablaComponent,
		SaveUpdateMultitablaComponent,
		UsuarioComponent,
		SaveUpdateUsuarioComponent,
		ResetPasswordComponent,
		RolComponent,
		SaveUpdateRolModalComponent,
		AsignarRolEmpresaComponent,
    DatosPersonalesComponent,
		InformacionPersonalComponent,
		PerfilOpcionesComponent,
		CambiarPasswordComponent,
		DistritoComponent,
		SaveUpdateDistritoModalComponent,
		NewDistritoModalComponent,
		ProvinciaComponent,
		SaveUpdateProvinciaComponent,
		DepartamentoComponent,
		SaveUpdateDepartamentoComponent,
    // DeleteCustomerModalComponent,
    // DeleteCustomersModalComponent,
    // FetchCustomersModalComponent,
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
