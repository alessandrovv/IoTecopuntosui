import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProccessComponent } from './proccess.component';
import { LoggedInGuardService } from '../../../Security/guards/logged-in-guard.service';
import { SeguimientoVentasComponent } from './seguimiento-ventas/seguimiento-ventas.component';
import { SaveUpdateSeguimientoVentaComponent } from './seguimiento-ventas/save-update-seguimiento-venta/save-update-seguimiento-venta.component';



const routes: Routes = [
  {
    path: '',
    component: ProccessComponent,
    children: [
      {
        path: 'SeguimientoVentas',
        canActivate: [LoggedInGuardService],
        component: SeguimientoVentasComponent
      },
      {
				path: 'SeguimientoVentas/edit',
				canActivate: [LoggedInGuardService],
				component: SaveUpdateSeguimientoVentaComponent,
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
export class ProccessRoutingModule {}
