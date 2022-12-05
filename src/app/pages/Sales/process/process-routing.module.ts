import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProcessComponent } from './process.component';
import { LoggedInGuardService } from '../../../Security/guards/logged-in-guard.service';
import { RutasComponent } from './rutas/rutas.component';
import { SaveUpdateRutaComponent } from './rutas/save-update-ruta/save-update-ruta.component';
import { PedidoVentaComponent } from './pedido-venta/pedido-venta.component';
import { SavePedidoVentaComponent } from './pedido-venta/save-pedido-venta/save-pedido-venta.component';
import { UpdatePedidoVentaComponent } from './pedido-venta/update-pedido-venta/update-pedido-venta.component';
import { VerPedidoVentaComponent } from './pedido-venta/ver-pedido-venta/ver-pedido-venta.component';
import { CopyPedidoVentaComponent } from './pedido-venta/copy-pedido-venta/copy-pedido-venta.component';
import { StockEcommerceComponent } from './stock-ecommerce/stock-ecommerce.component';
import { SaveUpdateStockComponent } from './stock-ecommerce/save-update-stock/save-update-stock.component';
import { PedidoVentaDespachoComponent } from './pedido-venta-despacho/pedido-venta-despacho.component';
import { VerPedidoVentaDespachoComponent } from './pedido-venta-despacho/ver-pedido-venta-despacho/ver-pedido-venta-despacho.component';

const routes: Routes = [
  {
    path: '',
    component: ProcessComponent,
    children: [
      {
        path: 'Rutas',
        canActivate: [LoggedInGuardService],
        component: RutasComponent
      },
      {
        path: 'Rutas/edit',
        canActivate: [LoggedInGuardService],
        component: SaveUpdateRutaComponent
      },
      {
        path: 'Rutas/add',
        canActivate: [LoggedInGuardService],
        component: SaveUpdateRutaComponent
      },
      {
        path: 'PedidoVenta',
        canActivate: [LoggedInGuardService],
        component: PedidoVentaComponent
      },
      {
        path: 'PedidoVenta/add',
        canActivate: [LoggedInGuardService],
        component: SavePedidoVentaComponent
      },
      {
        path: 'PedidoVenta/edit',
        canActivate: [LoggedInGuardService],
        component: UpdatePedidoVentaComponent
      },
      {
        path: 'PedidoVenta/ver',
        canActivate: [LoggedInGuardService],
        component: VerPedidoVentaComponent
      },
      {
        path: 'PedidoVenta/copy',
        canActivate: [LoggedInGuardService],
        component: CopyPedidoVentaComponent
      },
      {
        path: 'pedidoVentaDespacho',
        canActivate: [LoggedInGuardService],
        component: PedidoVentaDespachoComponent
      },
      {
        path: 'pedidoVentaDespacho/ver',
        canActivate: [LoggedInGuardService],
        component: VerPedidoVentaDespachoComponent
      },
      {
        path: 'stockEcommerce',
        canActivate: [LoggedInGuardService],
        component: StockEcommerceComponent
      },
      {
        path: 'stockEcommerce/add',
        canActivate: [LoggedInGuardService],
        component: SaveUpdateStockComponent
      },
      {
        path: 'stockEcommerce/edit',
        canActivate: [LoggedInGuardService],
        component: SaveUpdateStockComponent
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
