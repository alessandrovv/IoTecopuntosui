import { Component, OnInit } from '@angular/core';
import { PermissionNavigationService } from '../../Shared/services/permission-navigation.service';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { DashboardTalentoComponent } from './dashboard-talento/dashboard-talento.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	
	viewsActions: Array<Navigation> = [];
	dashboards: Array<Navigation> = [];
	opciones: Array<Navigation> = [];
	botones: Array<{nombre: string,texto: string, activo: number}> = [];
	testObj = {botones:{}};
  constructor(
		public pvas: PermissionNavigationService,
		public router: Router
		) { }

  ngOnInit(): void {

		console.log('entro aqui');
		this.opciones=( (this.pvas.get()).SubNavegacion);
		let test:any = [];


		this.dashboards=( (this.pvas.get()).SubNavegacion.find((e)=>e.Nombre=='Dashboard' && e.VisibleNavegacion).SubNavegacion).filter(e=>e);
		if(this.dashboards.length==0){
			// this.router.navigate()
		}else{
			this.botones = this.dashboards.map(e=>({nombre: e.Nombre.trim().split(' ')[1], texto: e.Nombre.trim().split(' ').slice(1).join(" ").trim().toUpperCase(), activo: 0}));
			for(let obj of this.botones){
				this.testObj.botones[obj.nombre] = obj;
			}
			this.testObj.botones[this.botones[0].nombre].activo = 1;
		}
  }


	testBoton(ev, index){
		for(const boton in this.testObj.botones){
			this.testObj.botones[boton].activo=0
		}
		this.testObj.botones[index].activo=1;
	}
}
