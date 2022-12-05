import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProcessComponent } from './process.component';
import { LoggedInGuardService } from '../../../Security/guards/logged-in-guard.service';
import { PermisosComponent } from './permisos/permisos.component';
import { UsuariosConectadosComponent } from './usuarios-conectados/usuarios-conectados.component';

const routes: Routes = [
  {
    path: '',
    component: ProcessComponent,
    children: [
      {
        path: 'Permisos',
        // canActivate: [LoggedInGuardService],
        component: PermisosComponent
      },
      {
        path: 'UsuariosConectados',
        canActivate: [LoggedInGuardService],
        component: UsuariosConectadosComponent
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
export class ProcessRoutingModule {}
