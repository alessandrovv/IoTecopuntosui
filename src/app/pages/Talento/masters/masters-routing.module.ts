import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MastersComponent } from './masters.component';
import { CertificadosComponent } from './certificados/certificados.component';
import { LoggedInGuardService } from '../../../Security/guards/logged-in-guard.service';
import { ConfiguracionDocumentoComponent } from './configuracion-documento/configuracion-documento.component';
import { SaveUpdateDocumentoComponent } from './configuracion-documento/save-update-documento/save-update-documento.component';
import { TrabajadoresComponent } from './trabajadores/trabajadores.component';
import { SaveUpdateTrabajadoresComponent } from './trabajadores/save-update-trabajadores/save-update-trabajadores.component';
import { PostulanteComponent } from './postulantes/postulante.component';
import { PostulanteEditComponent } from './postulantes/postulante-edit/postulante-edit.component';
import { EquiposComercialesComponent } from './equipos-comerciales/equipos-comerciales.component';
import { EquipoComercialAddComponent } from './equipos-comerciales/equipo-comercial-add/equipo-comercial-add.component';
import { AreaComponent } from './area/area.component';
import { SaveUpdateAreaComponent } from './area/save-update-area/save-update-area.component';
import { PuestoTrabajoComponent } from './puesto-trabajo/puesto-trabajo.component';
import { VacanteComponent } from './vacante/vacante.component';
import { SaveUpdateVacanteComponent } from './vacante/save-update-vacante/save-update-vacante.component';



const routes: Routes = [
  {
    path: '',
    component: MastersComponent,
    children: [
      {
        path: 'Certificado',
        canActivate: [LoggedInGuardService],
        component: CertificadosComponent
      },
      {
        path: 'ConfiguracionDocumento',
        canActivate: [LoggedInGuardService],
        component: ConfiguracionDocumentoComponent
      },
      {
        path: 'ConfiguracionDocumento/add',
        canActivate: [LoggedInGuardService],
        component: SaveUpdateDocumentoComponent
      },
      {
        path: 'ConfiguracionDocumento/edit',
        canActivate: [LoggedInGuardService],
        component: SaveUpdateDocumentoComponent
      },      
      {
        path: 'Trabajador',
        canActivate: [LoggedInGuardService],
        component: TrabajadoresComponent
      },
      {
        path: 'Trabajador/add',
        canActivate: [LoggedInGuardService],
        component: SaveUpdateTrabajadoresComponent
      },
      {
        path: 'Trabajador/edit',
        canActivate: [LoggedInGuardService],
        component: SaveUpdateTrabajadoresComponent
      },   
			{
				path: 'Postulante',
				canActivate: [LoggedInGuardService],
				component: PostulanteComponent
			},
			{
				path: 'Postulante/add',
				canActivate: [LoggedInGuardService],
				component: PostulanteEditComponent,
			},
      {
				path: 'Vacante',
				canActivate: [LoggedInGuardService],
				component: VacanteComponent,
			},
      {
				path: 'Vacante/add',
				canActivate: [LoggedInGuardService],
				component: SaveUpdateVacanteComponent,
			},
      {
				path: 'Vacante/edit',
				canActivate: [LoggedInGuardService],
				component: SaveUpdateVacanteComponent,
			},
      {
        path: 'EquipoComercial',
        canActivate: [LoggedInGuardService],
        component: EquiposComercialesComponent
      },
      {
				path: 'EquipoComercial/add',
				canActivate: [LoggedInGuardService],
				component: EquipoComercialAddComponent,
			},
      {
				path: 'EquipoComercial/edit',
				canActivate: [LoggedInGuardService],
				component: EquipoComercialAddComponent,
			},
      {
				path: 'Area',
				canActivate: [LoggedInGuardService],
				component: AreaComponent,
			},
      {
				path: 'PuestoTrabajo',
				canActivate: [LoggedInGuardService],
				component: PuestoTrabajoComponent,
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
export class MastersRoutingModule {}
