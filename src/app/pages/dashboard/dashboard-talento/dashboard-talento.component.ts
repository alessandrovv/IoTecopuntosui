import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChartConfiguration, ChartEvent, ChartType} from 'chart.js';
import { Subject } from 'rxjs';
import { GraficoComponent } from '../grafico/grafico.component';
import { UpdatePasswordComponent } from '../_shared/update-password/update-password.component';
import { DashboardComercialService } from '../_core/dashboard-comercial.service';
import { DashboardTalentoService } from '../_core/dashboard-talento.service';
import { EmpresaService } from '../../Security/_core/services/empresa.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-dashboard-talento',
  templateUrl: './dashboard-talento.component.html',
  styleUrls: ['./dashboard-talento.component.scss']
})
export class DashboardTalentoComponent implements OnInit {

	@ViewChild('grafico1') graf1: any;
	actualizarGraf1: Subject<void> = new Subject<void>();
	@ViewChild('grafico2') graf2: any;
	actualizarGraf2: Subject<void> = new Subject<void>();
	@ViewChild('grafico3') graf3: any;
	actualizarGraf3: Subject<void> = new Subject<void>();

  constructor(
	private modalService: NgbModal,
	public s_dashboard: DashboardComercialService,
	public dashboard_s: DashboardTalentoService,
	public empresa_s: EmpresaService,
	public fb: FormBuilder
  ) { }

	formFiltroGraficoRotacion: FormGroup
	formFiltroGraficoFidelizacion: FormGroup
	formFiltroGraficoDistrivucionArea: FormGroup

	arrayMeses = [
		{
			value: 1,
			name: "Enero"
		},{
			value: 2,
			name: "Febrero"
		},{
			value: 3,
			name: "Marzo"
		},{
			value: 4,
			name: "Abril"
		},{
			value: 5,
			name: "Mayo"
		},{
			value: 6,
			name: "Junio"
		},{
			value: 7,
			name: "Julio"
		},{
			value: 8,
			name: "Agosto"
		},{
			value: 9,
			name: "Setiembre"
		},{
			value: 10,
			name: "Octubre"
		},{
			value: 11,
			name: "Noviembre"
		},{
			value: 12,
			name: "Diciembre"
		},
	]

	array_empresas = [];

	ngOnInit(): void {
		this.initFormReporteRotacion();
		this.initFormReporteFidelizacion();
		this.initFormReporteDistribucionAreas();
		this.getEmpresas();
		this.validarPassword();
	}

	initFormReporteRotacion(){
		this.formFiltroGraficoRotacion = this.fb.group({
				Empresa: [1]
		});
	}
	initFormReporteFidelizacion(){
		this.formFiltroGraficoFidelizacion = this.fb.group({
				Empresa: [1]
		});
	}
	initFormReporteDistribucionAreas(){
		this.formFiltroGraficoDistrivucionArea = this.fb.group({
				Empresa: [1]
		});
	}

	getEmpresas() {
		this.empresa_s.GetEmpresaByUsuario().subscribe(
			(data: any) => {
				this.array_empresas = data;
				let selectedValue = this.array_empresas.length
				if(selectedValue===1){
					selectedValue = this.array_empresas[0].idEmpresa
				}else{
					this.array_empresas.unshift({
						idEmpresa: 0, razonSocial: 'Todos'
          });
					selectedValue = 0
				}
				this.formFiltroGraficoRotacion.controls.Empresa.setValue(selectedValue);
				this.formFiltroGraficoFidelizacion.controls.Empresa.setValue(selectedValue);
				this.formFiltroGraficoDistrivucionArea.controls.Empresa.setValue(selectedValue);
				this.elaborarGraficoRotacion(selectedValue);
				this.elaborarGraficoFidelizacion(selectedValue);
				this.elaborarGraficoDistribucionArea(selectedValue);
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}

	elaborarGraficoRotacion(Empresa){
		this.dashboard_s.GetReporteRotacion(Empresa).subscribe(
			(data: any)=>{
				let arrayDataRotaciones = data;

				this.graf1.opcionesGrafico.credits={
					enabled: false
				}
				this.graf1.opcionesGrafico.xAxis.categories = arrayDataRotaciones.map(e=>`${this.arrayMeses[e.Mes - 1].name} - ${e.Año}`);
				this.graf1.opcionesGrafico.yAxis.labels.format = '{text}%'
				this.graf1.opcionesGrafico.series = [{
					name: 'Rotacion General',
					data: arrayDataRotaciones.map(e=> e.RotacionGeneral),
				},{
					name: 'Rotacion Voluntaria',
					data: arrayDataRotaciones.map(e=> e.RotacionVoluntario),
				}];
				this.graf1.opcionesGrafico.plotOptions = {
					line: {
							dataLabels: {
									enabled: true,
									format: '{y}%'
							},
							enableMouseTracking: false
					}
				}		
				this.actualizarGraf1.next()
			}, (errorServicio)=>{
				console.log(errorServicio);				
			}
		);
	}

	elaborarGraficoFidelizacion(Empresa){
		
		this.dashboard_s.GetReporteRotacion(Empresa).subscribe(
			(data: any)=>{
				let arrayDataRotaciones = data;

				this.graf2.opcionesGrafico.credits={
					enabled: false
				}
				this.graf2.opcionesGrafico.xAxis.categories = arrayDataRotaciones.map(e=>`${this.arrayMeses[e.Mes - 1].name} - ${e.Año}`);
				this.graf2.opcionesGrafico.yAxis.max = 100
				this.graf2.opcionesGrafico.yAxis.labels.format = '{text}%'
				this.graf2.opcionesGrafico.series = [{
					name: 'Indice Fidelizacion',
					data: arrayDataRotaciones.map(e=>e.IndiceFidelizacion),
				}];
				this.graf2.opcionesGrafico.plotOptions = {
					line: {
							dataLabels: {
									enabled: true,
									format: '{y}%'
							},
							enableMouseTracking: false
					}
				}
				this.actualizarGraf2.next()
			}, (errorServicio)=>{
				console.log(errorServicio);				
			}
		);
	}

	elaborarGraficoDistribucionArea(Empresa){
		this.dashboard_s.GetReporteDistribucionArea(Empresa).subscribe(
			(data: any) => {
				// let tempSeries = [];
				// for(let item of data){
				// 	let tempObj: {name, data:Array<{name,y}> } = {
				// 		name: "",
				// 		data: []
				// 	}
				// }
				// this.graf3.opcionesGrafico.xAxis.categories = data.map(e=>e.area);
				this.graf3.opcionesGrafico.credits={
					enabled: false
				}
				this.graf3.opcionesGrafico.yAxis.labels.format = '{text}%'
				this.graf3.opcionesGrafico.series = [{
					colorByPoint: true,
					data: data.map(e=>({name: e.area, y:e.cantidad}))
				}];
				this.graf3.opcionesGrafico.tooltip = {
					pointFormat: '{point.percentage:.1f}%<br> Cantidad: {point.y}'
				}
				this.graf3.opcionesGrafico.plotOptions={
					pie : {
						dataLabels:{
							enable: true,
							format: '<b>{point.name}</b>:<br> {point.percentage:.1f}% <br> Cantidad: {point.y}'
						}
					}
				}
				// console.log(this.graf3.opcionesGrafico);				
				this.actualizarGraf3.next();

			}, ( errorServicio ) => {
				console.log(errorServicio);
			}
		);
		
	}

	validarPassword() {
		this.s_dashboard.ObtenerTipoClave().subscribe(
			(data:any) => {
				if (data[0].TIpoClave !== 'U') {
					this.mostrarModalPass();
				}
				console.log(data);               
			}, ( errorServicio ) => {             
				console.log(errorServicio);
			}
		);
	}

	mostrarModalPass() {
		const modalRef = this.modalService.open(UpdatePasswordComponent, { size: 'ms', keyboard : false, backdrop: 'static' });
		modalRef.result.then((result) => {
		  console.log('object');
		}, (reason) => {
		 console.log(reason);
		}); 
	}
}
