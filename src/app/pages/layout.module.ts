import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { PagesRoutingModule } from './pages-routing.module';
import {
  NgbDropdownModule,
  NgbProgressbarModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslationModule } from '../modules/i18n/translation.module';
import { LayoutComponent } from './_layout/layout.component';
import { ScriptsInitComponent } from './_layout/init/scipts-init/scripts-init.component';
import { HeaderMobileComponent } from './_layout/components/header-mobile/header-mobile.component';
import { AsideComponent } from './_layout/components/aside/aside.component';
import { FooterComponent } from './_layout/components/footer/footer.component';
import { HeaderComponent } from './_layout/components/header/header.component';
import { HeaderMenuComponent } from './_layout/components/header/header-menu/header-menu.component';
import { TopbarComponent } from './_layout/components/topbar/topbar.component';
import { ExtrasModule } from '../_metronic/partials/layout/extras/extras.module';
import { LanguageSelectorComponent } from './_layout/components/topbar/language-selector/language-selector.component';
import { CoreModule } from '../_metronic/core';
import { SubheaderModule } from '../_metronic/partials/layout/subheader/subheader.module';
import { AsideDynamicComponent } from './_layout/components/aside-dynamic/aside-dynamic.component';
import { HeaderMenuDynamicComponent } from './_layout/components/header/header-menu-dynamic/header-menu-dynamic.component';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { DeleteModalComponent } from './_shared/delete-customer-modal/delete-modal.component';
import { DeleteModalGeneralComponent } from './_shared/delete-modal/delete-modal.component';
import { DeleteEsquemaComisionComponent } from './_shared/delete-esquema-comision/delete-esquema-comision.component';
import { DeleteUsuarioModalComponent } from './_shared/delete-usuario-modal/delete-usuario-modal.component';
import { DeleteRolModalComponent } from './_shared/delete-rol-modal/delete-rol-modal.component';
import { RootComponent } from './root/root.component';
import { DeleteSubcategoriaModalComponent } from './_shared/delete-subcategoria-modal/delete-subcategoria-modal.component';
import { DeleteEstablecimientoModalComponent } from './_shared/delete-establecimiento-modal/delete-establecimiento-modal.component';
import { InformationModalComponent } from './_shared/information-modal/information-modal.component';
import { ReporteComprasComponent } from './Logistica/reports/reporte-compras/reporte-compras.component';
import { ReportsComponent } from './Logistica/reports/reports.component';
import { DeleteCaracteristicasVehiculoModalComponent } from './_shared/delete-caracteristicas-vehiculo-modal/delete-caracteristicas-vehiculo-modal.component';
import { DeleteVehiculoModalComponent } from './_shared/delete-vehiculo-modal/delete-vehiculo-modal.component';
import { DeletePedidoVentaDespachoModalComponent } from './_shared/delete-pedido-venta-despacho-modal/delete-pedido-venta-despacho-modal.component';

@NgModule({
  declarations: [
    LayoutComponent,
    ScriptsInitComponent,
    HeaderMobileComponent,
    AsideComponent,
    FooterComponent,
    HeaderComponent,
    HeaderMenuComponent,
    TopbarComponent,
    LanguageSelectorComponent,
    AsideDynamicComponent,
    HeaderMenuDynamicComponent,
    DeleteModalComponent,
		DeleteModalGeneralComponent,
    DeleteEsquemaComisionComponent,
    DeleteUsuarioModalComponent,
    DeleteRolModalComponent,
    RootComponent,
    DeleteSubcategoriaModalComponent,
    DeleteEstablecimientoModalComponent,
    InformationModalComponent,
    DeleteCaracteristicasVehiculoModalComponent,
    DeleteVehiculoModalComponent,
    DeletePedidoVentaDespachoModalComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    TranslationModule,
    InlineSVGModule,
    ExtrasModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    CoreModule,
    SubheaderModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  entryComponents: [
    DeleteModalComponent,
		DeleteModalGeneralComponent
  ],
})
export class LayoutModule { }
