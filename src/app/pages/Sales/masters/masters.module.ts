import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MastersRoutingModule } from './masters-routing.module';
import { MastersComponent } from './masters.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { ClienteComponent } from './cliente/cliente.component';
import { SaveUpdateClienteComponent } from './cliente/save-update-cliente/save-update-cliente.component';
import { MatTreeModule } from '@angular/material/tree';
import { SaveUpdateSucursalComponent } from './cliente/save-update-cliente/save-update-sucursal/save-update-sucursal.component';
import { ProyectosComponent } from './proyectos/proyectos.component';
import { UpdateProyectoModalComponent } from './proyectos/update-proyecto-modal/update-proyecto-modal.component';
import { SaveProyectoModalComponent } from './proyectos/save-proyecto-modal/save-proyecto-modal.component';



@NgModule({
  declarations: [
    MastersComponent,
    ClienteComponent,
    SaveUpdateClienteComponent,
    SaveUpdateSucursalComponent,
    ProyectosComponent,
    UpdateProyectoModalComponent,
    SaveProyectoModalComponent,
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
    MatTreeModule
  ],
  entryComponents: [
  ]
})
export class MastersModule { }
