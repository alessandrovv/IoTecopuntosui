import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProcessComponent } from './process.component';
import { LoggedInGuardService } from "src/app/Security/guards/logged-in-guard.service";
import { OrdenCompraComponent } from './orden-compra/orden-compra.component';
import { SaveOrdenCompraComponent } from './orden-compra/save-orden-compra/save-orden-compra.component';
import { EditOrdenCompraComponent } from './orden-compra/edit-orden-compra/edit-orden-compra.component';
import { CopyOrdenCompraComponent } from './orden-compra/copy-orden-compra/copy-orden-compra.component';
import { VerOrdenCompraComponent } from './orden-compra/ver-orden-compra/ver-orden-compra.component';
import { DocumentoCompraComponent } from './documento-compra/documento-compra.component';
import { SaveDocumentoCompraComponent } from './documento-compra/save-documento-compra/save-documento-compra.component';
import { EditDocumentoCompraComponent } from './documento-compra/edit-documento-compra/edit-documento-compra.component';
import { CopyDocumentoCompraComponent } from './documento-compra/copy-documento-compra/copy-documento-compra.component';
import { VerDocumentoCompraComponent } from './documento-compra/ver-documento-compra/ver-documento-compra.component';
import { NotaAlmacenComponent } from './nota-almacen/nota-almacen.component';
import { SaveNotaEntradaComponent } from './nota-almacen/save-nota-entrada/save-nota-entrada.component';
import { VerNotaEntradaComponent } from './nota-almacen/ver-nota-entrada/ver-nota-entrada.component';
import { SaveNotaSalidaComponent } from './nota-almacen/save-nota-salida/save-nota-salida.component';
import { VerNotaSalidaComponent } from './nota-almacen/ver-nota-salida/ver-nota-salida.component';

const routes: Routes = [
  {
    path: "",
    component: ProcessComponent,
    children: [
      {
        path: "OrdenCompra",
        canActivate: [LoggedInGuardService],
        component: OrdenCompraComponent,
      },
      {
        path: "OrdenCompra/add",
        canActivate: [LoggedInGuardService],
        component: SaveOrdenCompraComponent,
      },
      {
        path: "OrdenCompra/edit",
        canActivate: [LoggedInGuardService],
        component: EditOrdenCompraComponent,
      },
      {
        path: "OrdenCompra/copy",
        canActivate: [LoggedInGuardService],
        component: CopyOrdenCompraComponent,
      },
      {
        path: "OrdenCompra/ver",
        canActivate: [LoggedInGuardService],
        component: VerOrdenCompraComponent,
      },
      {
        path: "DocumentoCompra",
        canActivate: [LoggedInGuardService],
        component: DocumentoCompraComponent,
      },
      {
        path: "DocumentoCompra/add",
        canActivate: [LoggedInGuardService],
        component: SaveDocumentoCompraComponent,
      },
      {
        path: "DocumentoCompra/edit",
        canActivate: [LoggedInGuardService],
        component: EditDocumentoCompraComponent,
      },
      {
        path: "DocumentoCompra/copy",
        canActivate: [LoggedInGuardService],
        component: CopyDocumentoCompraComponent,
      },
      {
        path: "DocumentoCompra/ver",
        canActivate: [LoggedInGuardService],
        component: VerDocumentoCompraComponent,
      },
      {
        path: "NotaAlmacen",
        canActivate: [LoggedInGuardService],
        component: NotaAlmacenComponent,
      },
      {
        path: "NotaAlmacen/Entrada/add",
        canActivate: [LoggedInGuardService],
        component: SaveNotaEntradaComponent,
      },
      {
        path: "NotaAlmacen/Entrada/ver",
        canActivate: [LoggedInGuardService],
        component: VerNotaEntradaComponent,
      },
      {
        path: "NotaAlmacen/Salida/add",
        canActivate: [LoggedInGuardService],
        component: SaveNotaSalidaComponent,
      },
      {
        path: "NotaAlmacen/Salida/ver",
        canActivate: [LoggedInGuardService],
        component: VerNotaSalidaComponent,
      },
      { path: "", redirectTo: "customers", pathMatch: "full" },
      { path: "**", redirectTo: "customers", pathMatch: "full" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessRoutingModule { }
