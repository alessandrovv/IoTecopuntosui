import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuardService } from 'src/app/Security/guards/logged-in-guard.service';
import { CambiarPasswordComponent } from '../../Security/masters/datos-personales/cambiar-password/cambiar-password.component';
import { DatosPersonalesComponent } from '../../Security/masters/datos-personales/datos-personales.component';
import { InformacionPersonalComponent } from '../../Security/masters/datos-personales/informacion-personal/informacion-personal.component';
import { MultitablaComponent } from '../../Security/masters/multitabla/multitabla.component';
import { SaveUpdateMultitablaComponent } from '../../Security/masters/multitabla/save-update-multitabla/save-update-multitabla.component';
import { RolComponent } from '../../Security/masters/rol/rol.component';
import { UsuarioComponent } from '../../Security/masters/usuario/usuario.component';
import { MastersComponent } from './masters.component';


const routes: Routes = [
  {
    path: '',
    component: MastersComponent,
    children: [
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
  exports: [RouterModule]
})
export class MastersRoutingModule { }
