import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MastersComponent } from './masters.component';
import { LoggedInGuardService } from '../../../Security/guards/logged-in-guard.service';
import { EvaluacionCrediticiaComponent } from './evaluacion-crediticia/evaluacion-crediticia.component';
import { MetasComercialesComponent } from './metas-comerciales/metas-comerciales.component';
import { SaveUpdateMetasComercialesComponent } from './metas-comerciales/save-update-metas-comerciales/save-update-metas-comerciales.component';



const routes: Routes = [
  {
    path: '',
    component: MastersComponent,
    children: [
      {
        path: 'EvaluacionCrediticia',
        canActivate: [LoggedInGuardService],
        component: EvaluacionCrediticiaComponent
      },
      {
        path: 'MetasComerciales',
        canActivate: [LoggedInGuardService],
        component: MetasComercialesComponent
      },
      {
        path: 'MetasComerciales/add',
        canActivate: [LoggedInGuardService],
        component: SaveUpdateMetasComercialesComponent
      },
      {
        path: 'MetasComerciales/edit',
        canActivate: [LoggedInGuardService],
        component: SaveUpdateMetasComercialesComponent
      },
      // {
      //   path: 'Certificado',
      //   canActivate: [LoggedInGuardService],
      //   component: CertificadosComponent
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
