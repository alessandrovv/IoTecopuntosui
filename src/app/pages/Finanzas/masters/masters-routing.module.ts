import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MastersComponent } from './masters.component';
import { LoggedInGuardService } from '../../../Security/guards/logged-in-guard.service';
import { EsquemaComisionesComponent } from './esquema-comisiones/esquema-comisiones.component';
import { PlanContratoComponent } from './plan-contrato/plan-contrato.component';
import { TasaCambioComponent } from './tasa-cambio/tasa-cambio.component';
import { BancoComponent } from './banco/banco.component';


const routes: Routes = [
  {
    path: '',
    component: MastersComponent,
    children: [
      {
        path: 'PlanContrato',
        canActivate: [LoggedInGuardService],
        component: PlanContratoComponent
      },
      {
        path: 'EsquemaComisiones',
        canActivate: [LoggedInGuardService],
        component: EsquemaComisionesComponent
      },
      {
        path: 'TasaCambio',
        canActivate:[LoggedInGuardService],
        component: TasaCambioComponent
      },
      {
        path: 'Banco',
        canActivate: [LoggedInGuardService],
        component: BancoComponent
      },
      

      // {
      //   path: 'products',
      //   component: ProductsComponent,
      // },
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
  exports: [RouterModule],
})
export class MastersRoutingModule {}
