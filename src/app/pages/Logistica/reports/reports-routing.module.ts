import { ReporteVentasComponent } from './reporte-ventas/reporte-ventas.component';
import { ReporteStockComponent } from './reporte-stock/reporte-stock.component';
import { ReporteMovimientosComponent } from './reporte-movimientos/reporte-movimientos.component';
import { ReportsComponent } from './reports.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuardService } from 'src/app/Security/guards/logged-in-guard.service';


import { ReporteComprasComponent } from './reporte-compras/reporte-compras.component';
import * as path from 'path';


const routes: Routes = [
{
    path: '',
    component: ReportsComponent,
    children: [{
        path : 'reporteCompras',
        canActivate: [LoggedInGuardService],
        component: ReporteComprasComponent
    },{
        path : 'reporteMovimientos',
        canActivate: [LoggedInGuardService],
        component: ReporteMovimientosComponent
    },
    {
        path : 'reporteStock',
        canActivate: [LoggedInGuardService],
        component: ReporteStockComponent
    },
    {
        path : 'reporteVentas',
        canActivate: [LoggedInGuardService],
        component: ReporteVentasComponent
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
  export class ReportsRoutingModule {}