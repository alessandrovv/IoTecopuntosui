import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './_layout/layout.component';
import { LoggedInGuardService } from '../Security/guards/logged-in-guard.service';
import { NoLoggedInGuardService } from '../Security/guards/no-logged-in-guard.service';
import { RootComponent } from './root/root.component';
import { DashboardComprasComponent } from './dashboard/dashboard-compras/dashboard-compras.component';



const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NoLoggedInGuardService],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },

      {
        path: 'Talento',
        children: [
          {
            path: "masters",
            loadChildren: () =>
              import("./Talento/masters/masters.module").then(m => m.MastersModule)
          },
          // {
          //   path: "process",
          //   loadChildren: () =>
          //     import("././LogisticModuleApp/process/process.module").then(m => m.ProcessModule)
          // },
          // {
          //   path: "reports",
          //   loadChildren: () =>
          //     import("././LogisticModuleApp/reports/reports.module").then(m => m.ReportsModule)
          // }
        ]
      }, 
      {
        path: 'Comercial',
        children: [
          {
            path: 'masters',
            loadChildren: () =>
              import('./Comercial/masters/masters.module').then(m => m.MastersModule)
          }
        ]
      },
      {
        path: 'Finanzas',
        children: [
          {
            path: "masters",
            loadChildren: () =>
              import('./Finanzas/masters/masters.module').then(m => m.MastersModule)
          },
          // {
          // 	path: "process",
          // 	loadChildren: ()=>
          // 		import('./Finanzas/process/process.module').then(m => m.ProcessModule)
          // }
        ]
      },
      {
        path: 'Security',
        children: [
          {
            path: "masters",
            loadChildren: () =>
              import('./Security/masters/masters.module').then(m => m.MastersModule)
          },
          {
            path: "process",
            loadChildren: () =>
              import('./Security/process/process.module').then(m => m.ProcessModule)
          }
        ]
      },
      {
        path: 'Comercial',
        children: [
          {
            path: "process",
            loadChildren: () =>
              import('./Comercial/proccess/proccess.module').then(m => m.ProccessModule)
          }
        ]
      },
      {
        path: 'Sales',
        children: [
          {
            path: "process",
            loadChildren: () =>
              import('./Sales/process/process.module').then(m => m.ProcessModule)
          }
        ]
      },
      {
				path: 'Sales',
				children: [
					{
						path: "masters",
						loadChildren: ()=>
							import('./Sales/masters/masters.module').then(m => m.MastersModule)
					}
				]
			},
      {
				path: 'Sales',
				children: [
					{
						path: "report",
						loadChildren: ()=>
							import('./Sales/report/report.module').then(m => m.ReportModule)
					}
				]
			},
      {
        path:'estudiantes',
        loadChildren:()=> import('./estudiantes/estudiantes.module').then(m=>m.EstudiantesModule)
      },
      {
        path:'recompensas',
        loadChildren:()=>import('./recompensas/recompensas.module').then(m=>m.RecompensasModule)
      },
      {
        path:'basureros',
        loadChildren:()=>import('./basureros/basureros.module').then(m=>m.BasurerosModule)
      },	
			{
				path: 'Finanzas',
				children: [
					{
						path: "process",
						loadChildren: ()=>
							import('./Finanzas/process/process.module').then(m => m.ProcessModule)
					}
				]
			},
      {
        path: 'Finanzas',
        children: [
          {
            path: "process",
            loadChildren: () =>
              import('./Finanzas/process/process.module').then(m => m.ProcessModule)
          }
        ]
      },
      {
        path: 'Produccion',
        children: [
          {
            path: "masters",
            loadChildren: () =>
              import('./Production/masters/masters.module').then(m => m.MastersModule)
          }
        ]
      },
      {
        path: 'Logistica',
        children: [
          {
            path: "masters",
            loadChildren: () =>
              import("./Logistica/masters/masters.module").then(m => m.MastersModule)
          },
          {
            path: "process",
            loadChildren: () =>
              import("./Logistica/process/process.module").then(m => m.ProcessModule)
          },
          {
            path:"reports",
            loadChildren: () =>
              import("./Logistica/reports/reports.module").then(m => m.ReportsModule)
          }
        ]
      },
      {
				path: 'Operations',
				children: [
					{
						path: "masters",
						loadChildren: ()=>
							import('./Operations/masters/masters.module').then(m => m.MastersModule)
					},
          {
						path: "process",
						loadChildren: ()=>
							import('./Operations/process/process.module').then(m => m.ProcessModule)
					},
          {
						path: "report",
						loadChildren: ()=>
            import('./Operations/report/report.module').then(m => m.ReportModule)
					}
				]
			},
      // {
      //   path: 'Logistica',
      //   children: [
      //     {
      //       path: "process",
      //       loadChildren: () =>
      //         import("./Logistica/process/process.module").then(m => m.ProcessModule)
      //     },
      //   ]      
      // },
      {
        path: 'builder',
        loadChildren: () =>
          import('./builder/builder.module').then((m) => m.BuilderModule),
      },
      {
        path: 'ecommerce',
        loadChildren: () =>
          import('../modules/e-commerce/e-commerce.module').then(
            (m) => m.ECommerceModule
          ),
      },
      {
        path: 'user-management',
        loadChildren: () =>
          import('../modules/user-management/user-management.module').then(
            (m) => m.UserManagementModule
          ),
      },
      {
        path: 'user-profile',
        loadChildren: () =>
          import('../modules/user-profile/user-profile.module').then(
            (m) => m.UserProfileModule
          ),
      },
      {
        path: 'ngbootstrap',
        loadChildren: () =>
          import('../modules/ngbootstrap/ngbootstrap.module').then(
            (m) => m.NgbootstrapModule
          ),
      },
      {
        path: 'wizards',
        loadChildren: () =>
          import('../modules/wizards/wizards.module').then(
            (m) => m.WizardsModule
          ),
      },
      {
        path: 'material',
        loadChildren: () =>
          import('../modules/material/material.module').then(
            (m) => m.MaterialModule
          ),
      },
      {
        path: '',
        //canActivate: [LoggedInGuardService],
        component: RootComponent
      },
      {
        path: '**',
        redirectTo: 'error/404',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
