import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuardService } from 'src/app/Security/guards/logged-in-guard.service';
import { MastersComponent } from './masters.component';
import { ClienteComponent } from './cliente/cliente.component';
import { SaveUpdateClienteComponent } from './cliente/save-update-cliente/save-update-cliente.component';
import { ProyectosComponent } from './proyectos/proyectos.component';


const routes: Routes = [
  {
    path: '',
    component: MastersComponent,
    children: [
      {
				path: 'Cliente',     
        canActivate: [LoggedInGuardService],        
				component: ClienteComponent,   
        
			},
      {
        path: 'Cliente/add',
        canActivate: [LoggedInGuardService],
        component:SaveUpdateClienteComponent,        
      },
      {
        path: 'Cliente/edit',
        canActivate: [LoggedInGuardService],
        component: SaveUpdateClienteComponent,
      },
      {
				path: 'Proyectos',     
        canActivate: [LoggedInGuardService],        
				component: ProyectosComponent,   
        
			},
          
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
