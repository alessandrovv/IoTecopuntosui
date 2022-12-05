//import { UpdateTipovehiculoComponent } from './tipo-vehiculo/update-tipovehiculo/update-tipovehiculo.component';
import { SaveUpdateTipovehiculoComponent } from '../masters/tipo-vehiculo/save-update-tipovehiculo/save-update-tipovehiculo.component';
import { TipoVehiculoComponent } from './tipo-vehiculo/tipo-vehiculo.component';
import { NgModule } from '@angular/core';
import { tick } from '@angular/core/testing';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuardService } from 'src/app/Security/guards/logged-in-guard.service';
import { RolComponent } from '../../Security/masters/rol/rol.component';
import { UsuarioComponent } from '../../Security/masters/usuario/usuario.component';
import { CaracteristicasVehiculoComponent } from './caracteristicas-vehiculo/caracteristicas-vehiculo.component';
import { SaveUpdateCaracteristicasVehiculoComponent } from './caracteristicas-vehiculo/save-update-caracteristicas-vehiculo/save-update-caracteristicas-vehiculo.component';
import { MastersComponent } from './masters.component';
import { PuntosTransporteComponent } from './puntos-transporte/puntos-transporte.component';
import { RutaComponent } from './ruta/ruta.component';
import { SaveUpdateVehiculoComponent } from './vehiculos/save-update-vehiculo/save-update-vehiculo.component';
import { VehiculosComponent } from './vehiculos/vehiculos.component';
import { TarifaComponent } from './tarifa/tarifa.component';

const routes: Routes = [
	{
		path: '',
		component: MastersComponent,
		children: [
			{
				path: 'caracteristicaVehiculos',
				canActivate: [LoggedInGuardService],
				component: CaracteristicasVehiculoComponent
			},
			{
				path: 'caracteristicaVehiculos/add',
				canActivate: [LoggedInGuardService],
				component: SaveUpdateCaracteristicasVehiculoComponent
			},
			{
				path: 'caracteristicaVehiculos/edit',
				canActivate: [LoggedInGuardService],
				component: SaveUpdateCaracteristicasVehiculoComponent
			},
			{
				path: 'puntosTransporte',
				canActivate: [LoggedInGuardService],
				component: PuntosTransporteComponent
			},
			{
				path: 'ruta',
				canActivate: [LoggedInGuardService],
				component: RutaComponent
			},
			{
			  path: 'tarifa',
			  canActivate: [LoggedInGuardService],
			  component: TarifaComponent
			}, 
			{
				path: 'tipoVehiculo',
				canActivate: [LoggedInGuardService],
				component: TipoVehiculoComponent,
			},
			{
				path: 'tipoVehiculo/add',
				canActivate: [LoggedInGuardService],
				component: SaveUpdateTipovehiculoComponent
			},
			{
				path: 'tipoVehiculo/edit',
				canActivate: [LoggedInGuardService],
				component: SaveUpdateTipovehiculoComponent
			},
			{
				path: 'vehiculos',
				component: VehiculosComponent
			},
			{
				path: 'vehiculos/add',
				component: SaveUpdateVehiculoComponent
			},
			{
				path: 'vehiculos/edit',
				component: SaveUpdateVehiculoComponent
			},
			{ path: '', redirectTo: 'customers', pathMatch: 'full' },
			{ path: '**', redirectTo: 'customers', pathMatch: 'full' },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class MastersRoutingModule { }
