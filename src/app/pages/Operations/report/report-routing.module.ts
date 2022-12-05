import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuardService } from 'src/app/Security/guards/logged-in-guard.service';
import { ReportComponent } from './report.component';
import { ReporteVencimientoComponent } from './reporte-vencimiento/reporte-vencimiento.component';



const routes: Routes = [
  {
    path: '',
    component: ReportComponent,
    children: [
      
      {
        path: 'reporteVencimiento',
        canActivate: [LoggedInGuardService],
        component: ReporteVencimientoComponent,
      },
      // {
      //   path: 'product/add',
      //   component: ProductEditComponent
      // },
      // {
      //   path: 'product/edit',
      //   component: ProductEditComponent
      // },
      // {
      //   path: 'product/edit/:id',
      //   component: ProductEditComponent
      // },
      { path: '', redirectTo: 'customers', pathMatch: 'full' },
      { path: '**', redirectTo: 'customers', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }
