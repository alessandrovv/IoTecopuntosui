import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProcessComponent } from './process.component';
import { LoggedInGuardService } from '../../../Security/guards/logged-in-guard.service';
import { ComisionVentasComponent } from './comision-ventas/comision-ventas.component';


const routes: Routes = [
  {
    path: '',
    component: ProcessComponent,
    children: [
      {
				path: 'ComisionVentas',
				// canActivate: [LoggedInGuardService],
				component: ComisionVentasComponent
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
export class ProcessRoutingModule {}
