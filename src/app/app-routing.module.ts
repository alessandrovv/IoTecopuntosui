import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './modules/auth/_services/auth.guard';
import { LoggedInGuardService } from './Security/guards/logged-in-guard.service';
import { NoLoggedInGuardService } from './Security/guards/no-logged-in-guard.service';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [NoLoggedInGuardService],
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'error',
    canActivate: [NoLoggedInGuardService],
    loadChildren: () =>
      import('./modules/errors/errors.module').then((m) => m.ErrorsModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./pages/layout.module').then((m) => m.LayoutModule),
  },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
})
export class AppRoutingModule { }
