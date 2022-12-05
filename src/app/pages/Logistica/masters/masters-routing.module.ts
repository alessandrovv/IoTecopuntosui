import { SaveUpdateClaseMaterialComponent } from './clase-material/save-update-clase-material/save-update-clase-material.component';
import { SaveUpdateCategoriamaterialComponent } from './categorias-material/save-update-categoriamaterial/save-update-categoriamaterial.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MastersComponent } from './masters.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { LoggedInGuardService } from 'src/app/Security/guards/logged-in-guard.service';
import { SaveUpdateProveedoresComponent } from './proveedores/save-update-proveedores/save-update-proveedores.component';
import { MaterialesComponent } from './materiales/materiales.component';
import { SaveUpdateMaterialesComponent } from './materiales/save-update-materiales/save-update-materiales.component';
import { SubcategoriamaterialComponent } from './subcategoriamaterial/subcategoriamaterial.component';

import { EstablecimientosComponent } from './establecimientos/establecimientos.component';
import { ClaseMaterialComponent } from './clase-material/clase-material.component';
import { CategoriasMaterialComponent } from './categorias-material/categorias-material.component';
import { CaracteristicaMaterialComponent } from './caracteristica-material/caracteristica-material.component';
import { SaveUpdateCaracteristicaMaterialComponent } from './caracteristica-material/save-update-caracteristica-material/save-update-caracteristica-material.component';


const routes: Routes = [
  {
    path: '',
    component: MastersComponent,
    children: [
      {
        path: 'Proveedores',
        canActivate: [LoggedInGuardService],
        component: ProveedoresComponent
      },
      {
        path: 'Proveedores/add',
        canActivate: [LoggedInGuardService],
        component: SaveUpdateProveedoresComponent
      },
      {
        path: 'Proveedores/edit',
        canActivate: [LoggedInGuardService],
        component: SaveUpdateProveedoresComponent
      },
      {
        path: 'Materiales',
        canActivate: [LoggedInGuardService],
        component: MaterialesComponent
      },
      {
        path: 'Materiales/add',
        canActivate: [LoggedInGuardService],
        component: SaveUpdateMaterialesComponent
      },
      {
        path: 'Materiales/edit',
        canActivate: [LoggedInGuardService],
        component: SaveUpdateMaterialesComponent
      },
      {
        path: 'subcategoriamaterial',
        canActivate: [LoggedInGuardService],
        component: SubcategoriamaterialComponent
      },
      {

        path: 'establecimientos',
        canActivate: [LoggedInGuardService],
        component: EstablecimientosComponent
      },

      {
        path: 'claseMaterial',
        canActivate: [LoggedInGuardService],
        component: ClaseMaterialComponent
      },
      {
        path: 'claseMaterial/add',
        canActivate: [LoggedInGuardService],
        component: SaveUpdateClaseMaterialComponent
      },
      {
        path: 'claseMaterial/edit',
        canActivate: [LoggedInGuardService],
        component: SaveUpdateClaseMaterialComponent
      },
      {
        path: 'categoriaMaterial',
        canActivate: [LoggedInGuardService],
        component: CategoriasMaterialComponent
      },
      {

        path: 'categoriaMaterial/add',
        canActivate: [LoggedInGuardService],
        component: SaveUpdateCategoriamaterialComponent
      },
      {
        path: 'caracteristicaMateriales',
        canActivate: [LoggedInGuardService],
        component: CaracteristicaMaterialComponent
      }, 
      {
        path: 'caracteristicaMateriales/add',
        canActivate: [LoggedInGuardService],
        component: SaveUpdateCaracteristicaMaterialComponent
      },
      {
        path: 'caracteristicaMateriales/edit',
        canActivate: [LoggedInGuardService],
        component: SaveUpdateCaracteristicaMaterialComponent
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
export class MastersRoutingModule { }
