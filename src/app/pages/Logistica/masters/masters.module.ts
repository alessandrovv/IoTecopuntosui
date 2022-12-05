import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
// import { CustomersComponent } from './customers/customers.component';
// import { ProductsComponent } from './products/products.component';
// import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';


import { MastersRoutingModule } from './masters-routing.module';
import { MastersComponent } from './masters.component';
import { CRUDTableModule } from '../../../_metronic/shared/crud-table/crud-table.module';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { SaveUpdateProveedoresComponent } from './proveedores/save-update-proveedores/save-update-proveedores.component';
import { MaterialesComponent } from './materiales/materiales.component';
import { SaveUpdateMaterialesComponent } from './materiales/save-update-materiales/save-update-materiales.component';
import { SubcategoriamaterialComponent } from './subcategoriamaterial/subcategoriamaterial.component';
import { SaveUpdateSubcategoriaModalComponent } from './subcategoriamaterial/save-update-subcategoria-modal/save-update-subcategoria-modal.component';

import { EstablecimientosComponent } from './establecimientos/establecimientos.component';
import { SaveUpdateEstablecimientoModalComponent } from './establecimientos/save-update-establecimiento-modal/save-update-establecimiento-modal.component';

import { ClaseMaterialComponent } from './clase-material/clase-material.component';
import { SaveUpdateClaseMaterialModalComponent } from './clase-material/save-update-clase-material-modal/save-update-clase-material-modal.component';
import { CategoriasMaterialComponent } from './categorias-material/categorias-material.component';
import { SaveUpdateCategoriamaterialComponent } from './categorias-material/save-update-categoriamaterial/save-update-categoriamaterial.component';
import { EliminarCategoriaMaterialComponent } from './_shared/eliminar-categoria-material/eliminar-categoria-material.component';
import { CaracteristicaMaterialComponent } from './caracteristica-material/caracteristica-material.component';
import { SaveUpdateCaracteristicaMaterialComponent } from './caracteristica-material/save-update-caracteristica-material/save-update-caracteristica-material.component';
import { SaveUpdateClaseMaterialComponent } from './clase-material/save-update-clase-material/save-update-clase-material.component';

@NgModule({
  declarations: [
    MastersComponent,
    ProveedoresComponent,
    SaveUpdateProveedoresComponent,
    MaterialesComponent,
    SaveUpdateMaterialesComponent,
    SubcategoriamaterialComponent,
    SaveUpdateSubcategoriaModalComponent,

    EstablecimientosComponent,
    SaveUpdateEstablecimientoModalComponent,

    ClaseMaterialComponent,
    SaveUpdateClaseMaterialModalComponent,
    CategoriasMaterialComponent,
    SaveUpdateCategoriamaterialComponent,
    EliminarCategoriaMaterialComponent,
    CaracteristicaMaterialComponent,
    SaveUpdateCaracteristicaMaterialComponent,
    SaveUpdateClaseMaterialComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MastersRoutingModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  entryComponents: [
  ]
})
export class MastersModule {}
