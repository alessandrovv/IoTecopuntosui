import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EstudiantesComponent } from './estudiantes.component';
import { EstudiantesListComponent } from './estudiantes-list/estudiantes-list.component';
import { EstudiantesViewComponent } from './estudiantes-view/estudiantes-view.component';

const routes: Routes = [
  {
    path:'',
    component: EstudiantesComponent,
    children:[
      {
        path:'',
        component:EstudiantesListComponent
      },
      {
        path:'view',
        component:EstudiantesViewComponent
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
export class EstudiantesRoutingModule { }
