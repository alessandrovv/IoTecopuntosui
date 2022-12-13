import { Component, OnInit } from '@angular/core';
import { PermissionNavigationService } from '../../Shared/services/permission-navigation.service';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {

	viewsActions: Array<Navigation> = [];
	opciones: Array<Navigation> = [];
  constructor(
		public pvas: PermissionNavigationService,
		public router: Router
		) { }

  ngOnInit(): void {

		//this.opciones=((this.pvas.get()).SubNavegacion).map(e=>e.SubNavegacion).reduce((acc, cuV)=> acc.concat(cuV));
		//let rutas = this.opciones.map(e=>e.Url)
		//console.log(rutas)
		console.log('hola');
		//this.router.navigate([rutas[0]]);
	
  }


}
