import { UsuarioComponent } from './usuario/usuario.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MastersComponent } from './masters.component';
import { LoggedInGuardService } from '../../../Security/guards/logged-in-guard.service';

import { MultitablaComponent } from './multitabla/multitabla.component';
import { SaveUpdateMultitablaComponent } from './multitabla/save-update-multitabla/save-update-multitabla.component';
import { RolComponent } from './rol/rol.component';
import { DatosPersonalesComponent } from './datos-personales/datos-personales.component';
import { InformacionPersonalComponent } from './datos-personales/informacion-personal/informacion-personal.component';
import { CambiarPasswordComponent } from './datos-personales/cambiar-password/cambiar-password.component';
import { DistritoComponent } from './distrito/distrito.component';
import { ProvinciaComponent } from './provincia/provincia.component';
import { DepartamentoComponent } from './departamento/departamento.component';



const routes: Routes = [
  {
    path: '',
    component: MastersComponent,
    children: [
      {
        path: 'Rol',
        canActivate: [LoggedInGuardService],
        component: RolComponent
      },
			{
				path: 'Multitabla',
				component: MultitablaComponent
			},
			{
				path: 'Multitabla/add',
				component: SaveUpdateMultitablaComponent,
			},
			{
				path: 'Multitabla/edit',
				component: SaveUpdateMultitablaComponent,
			},{
				path: 'Usuario',
				component: UsuarioComponent,
			},
      { path: 'DatosPersonales', redirectTo: 'DatosPersonales/InformacionPersonal', pathMatch: 'full'},

      {
				path: 'DatosPersonales',
				component: DatosPersonalesComponent,
        children: [
          {
            path: 'InformacionPersonal',
            component: InformacionPersonalComponent,
          },
          {
            path: 'CambiarContraseña',
            component: CambiarPasswordComponent,
          },
          
        ]
			},
      {
        path: 'distrito',
        canActivate: [LoggedInGuardService],
        component: DistritoComponent
      },
      {
        path: 'provincia',
        canActivate: [LoggedInGuardService],
        component: ProvinciaComponent
      },
      {
        path: 'departamento',
        canActivate: [LoggedInGuardService],
        component: DepartamentoComponent
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
