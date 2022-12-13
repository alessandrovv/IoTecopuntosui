import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BasurerosComponent } from './basureros.component';
import { BasurerosListComponent } from './basureros-list/basureros-list.component';

const routes: Routes = [
  {
    path:'',
    component:BasurerosComponent,
    children:[
      {
        path:'',
        component:BasurerosListComponent
      },
      {path:'', redirectTo:'',pathMatch:'full'},
      {path:'**', redirectTo:'', pathMatch:'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasurerosRoutingModule { }
