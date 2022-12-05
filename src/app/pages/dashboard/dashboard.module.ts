import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardsModule } from '../../_metronic/partials/content/dashboards/dashboards.module';
import { DashboardTalentoComponent } from './dashboard-talento/dashboard-talento.component';
import { GraficoComponent } from './grafico/grafico.component';
import { DashboardComercialComponent } from './dashboard-comercial/dashboard-comercial.component';
import { UpdatePasswordComponent } from './_shared/update-password/update-password.component';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { DashboardComprasComponent } from './dashboard-compras/dashboard-compras.component';
import { FiltrosTemporalesComponent } from './_shared/filtros-temporales/filtros-temporales.component';

@NgModule({
  declarations: [DashboardComponent, DashboardTalentoComponent, GraficoComponent, DashboardComercialComponent, UpdatePasswordComponent, DashboardComprasComponent, FiltrosTemporalesComponent],
  entryComponents: [
    UpdatePasswordComponent
  ],
  imports: [
    // BrowserModule,
    CommonModule,
    NgSelectModule,
    CommonModule,
    HttpClientModule,
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
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      }, {
        path: 'Talento',
        component: DashboardTalentoComponent,
      }, {
        path: 'Comercial',
        component: DashboardComercialComponent,
      },
      {
        path: 'dashboardCompras',
        component: DashboardComprasComponent
      }
    ]),
  ],
  exports: [RouterModule]
})
export class DashboardModule { }
