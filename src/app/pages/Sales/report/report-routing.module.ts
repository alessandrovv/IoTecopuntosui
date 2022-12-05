import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportComponent } from './report.component';
import { SeguimientoVisitaComercialComponent } from '../report/seguimiento-visita-comercial/seguimiento-visita-comercial.component';


const routes: Routes = [
  {
    path: '',
    component: ReportComponent,
    children: [
      {
        path: 'SeguimientoVisitaComercial',
        component: SeguimientoVisitaComercialComponent
      },
      { path: '', redirectTo: 'customers', pathMatch: 'full' },
      { path: '**', redirectTo: 'customers', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
