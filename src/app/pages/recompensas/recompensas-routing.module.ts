import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecompensasComponent } from './recompensas.component';
import { RecompensasListComponent } from './recompensas-list/recompensas-list.component';

const routes: Routes = [
  {
    path:'',
    component:RecompensasComponent,
    children:[
      {
        path:'',
        component:RecompensasListComponent
      },
      {
        path:'', redirectTo:'',pathMatch:'full'
      },
      {
        path:'**', redirectTo:'', pathMatch:'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecompensasRoutingModule { }
