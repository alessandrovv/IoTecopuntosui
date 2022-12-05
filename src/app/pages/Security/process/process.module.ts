import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
// import { CustomersComponent } from './customers/customers.component';
// import { ProductsComponent } from './products/products.component';
// import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';


import { CRUDTableModule } from '../../../_metronic/shared/crud-table/crud-table.module';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { NgSelectModule } from '@ng-select/ng-select';
import { PermisosComponent } from './permisos/permisos.component';
import { ProcessComponent } from './process.component';
import { ProcessRoutingModule } from './process-routing.module';
import { MatTreeModule } from '@angular/material/tree';
import { UsuariosConectadosComponent } from './usuarios-conectados/usuarios-conectados.component';
import { LogUsuarioComponent } from './usuarios-conectados/log-usuario/log-usuario.component';

@NgModule({
  declarations: [
    ProcessComponent,
    PermisosComponent,
    UsuariosConectadosComponent,
    LogUsuarioComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ProcessRoutingModule,
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
    MatTreeModule
  ],
  entryComponents: [
  ]
})
export class ProcessModule {}
