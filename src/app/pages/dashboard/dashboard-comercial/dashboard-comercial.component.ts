import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChartConfiguration, ChartEvent, ChartType} from 'chart.js';
import { Console } from 'console';
import { Subject } from 'rxjs';
import { GraficoComponent } from '../grafico/grafico.component';
import { DashboardComercialService } from '../_core/dashboard-comercial.service';
import { MultitablaService } from '../../_core/services/multitabla.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdatePasswordComponent } from '../_shared/update-password/update-password.component';

@Component({
  selector: 'app-dashboard-comercial',
  templateUrl: './dashboard-comercial.component.html',
  styleUrls: ['./dashboard-comercial.component.scss']
})
export class DashboardComercialComponent implements OnInit {

	
	// eventsSubject: Subject<void> = new Subject<void>();
	
	// emitEventToChild() {
		// 	this.eventsSubject.next();
		// }
		// 
	@ViewChild('grafico1') graf1: any;
	actualizarGraf1: Subject<void> = new Subject<void>();

	@ViewChild('grafico2') graf2: any;
	actualizarGraf2: Subject<void> = new Subject<void>();

	@ViewChild('grafico3') graf3: any;
	actualizarGraf3: Subject<void> = new Subject<void>();
	
	@ViewChild('grafico4') graf4: any;
	actualizarGraf4: Subject<void> = new Subject<void>();
	
	@ViewChild('grafico5') graf5: any;
	actualizarGraf5: Subject<void> = new Subject<void>();
	
	@ViewChild('grafico6') graf6: any;
	actualizarGraf6: Subject<void> = new Subject<void>();
	
	formReporteVentasDepartamento: FormGroup;

	formReporteVentasEstadoDAS: FormGroup;

	formReporteVentasEstadoWIN: FormGroup;

	formReporteVentasAsociado: FormGroup;

	formReporteVentasGeneral: FormGroup;

	formReporteObservacionesVentas: FormGroup;

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

	arrayColores = [
		"#F6F740",
		"#EB8258",
		"#995D81",
		"#BE92A2",
		"#DBBADD",
		"#d8e1ff",
		"#96cdff",
		"#69DDFF"
	]

	arrayAnios = [2022];

	array_pais: any;
	array_departamento: any;
	array_asociados: any;

  constructor(
		public dashboard_s: DashboardComercialService,
		public multitabla_s: MultitablaService,
		private modalService: NgbModal,
		public s_dashboard: DashboardComercialService,
    	private fb: FormBuilder,
	) { }

	ventasDepartamento: any ={};
	
	filterFormVentasDepartamento(){
		this.formReporteVentasDepartamento = this.fb.group({
			Tipo: [1],
      Anio: [(new Date).getFullYear()],
      Mes: [(new Date).getMonth() + 1],
			Semana: [this.getCurrentWeekNumber()],
    	FechaDesde: [new Date().toLocaleDateString('en-CA')],
      FechaHasta: [new Date().toLocaleDateString('en-CA')],
    });   
	}

	filterFormVentasEstadoDAS(){
		this.formReporteVentasEstadoDAS = this.fb.group({
			Pais: [1],
			Departamento: [0],
      Tipo: [1],
      Anio: [(new Date).getFullYear()],
      Mes: [(new Date).getMonth() + 1],
			Semana: [this.getCurrentWeekNumber()],
    	FechaDesde: [new Date().toLocaleDateString('en-CA')],
      FechaHasta: [new Date().toLocaleDateString('en-CA')],
    });   
	}

	filterFormVentasEstadoWIN(){
		this.formReporteVentasEstadoWIN = this.fb.group({
			Pais: [1],
			Departamento: [0],
      Tipo: [1],
      Anio: [(new Date).getFullYear()],
      Mes: [(new Date).getMonth() + 1],
			Semana: [this.getCurrentWeekNumber()],
    	FechaDesde: [new Date().toLocaleDateString('en-CA')],
      FechaHasta: [new Date().toLocaleDateString('en-CA')],
    });   
	}

	filterFormVentasAsociado(){
		this.formReporteVentasAsociado = this.fb.group({
			Pais: [1],
			Departamento: [0],
      Tipo: [1],
      Anio: [(new Date).getFullYear()],
      Mes: [(new Date).getMonth() + 1],
			Semana: [this.getCurrentWeekNumber()],
    	FechaDesde: [new Date().toLocaleDateString('en-CA')],
      FechaHasta: [new Date().toLocaleDateString('en-CA')],
    });   
	}

	filterFormVentasGeneral(){
		this.formReporteVentasGeneral = this.fb.group({
			Pais: [1],
			Departamento: [0],
			Asociado: [0],
      Tipo: [1],
      Anio: [(new Date).getFullYear()],
      Mes: [(new Date).getMonth() + 1],
			Semana: [this.getCurrentWeekNumber()],
    	FechaDesde: [new Date().toLocaleDateString('en-CA')],
      FechaHasta: [new Date().toLocaleDateString('en-CA')],
    });   
	}

	filterFormObservacionesVentas(){
		this.formReporteObservacionesVentas = this.fb.group({
			Pais: [1],
			Departamento: [0],
			Asociado: [0],
      Tipo: [1],
      Anio: [(new Date).getFullYear()],
      Mes: [(new Date).getMonth() + 1],
			Semana: [this.getCurrentWeekNumber()],
    	FechaDesde: [new Date().toLocaleDateString('en-CA')],
      FechaHasta: [new Date().toLocaleDateString('en-CA')],
    });   
	}

	getCurrentWeekNumber(): number{
		const currentdate: any = new Date();
		var oneJan: any = this.getStartFirstWeek();
		var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
		var result = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);
		return result
	}

	getStartFirstWeek(anio=new Date().getFullYear()): Date{ 
    let tempDay:number = 0; // empezamos en 0 para realizar la iteracion
    let tempDate: Date;
    do{
        tempDate = new Date(anio,0,++tempDay); // iteramos los dias hasta encontrar el primer lunes
    }while(tempDate.getDay()!==1) // los valores son 0 domingo, 1 lunes, 2 martes... y asi 
    return tempDate;
	}

	getStartCurrentWeek(week: number=this.getCurrentWeekNumber(), year=new Date().getFullYear()){ 
		const ms_WEEK = 1000*60*60*24*7; // constante de la cantidad de milisegundos en una semana
    return new Date(this.getStartFirstWeek(year).getTime()+(week-1)*ms_WEEK); 
		// para obtener el inicio de la semana deseada creamos una fecha obteniendo el primer dia de semana calendarios del año
		// y luego a le sumamos la cantidad de milisegundos segun el numero de semana deseada. obteniendose asi 
		// el lunes del numero de semana desado
}

	obtenerListaAnios(){
		let tempY = this.arrayAnios[0];
		const ANIO_ACTUAL = (new Date()).getFullYear();

		for(tempY; tempY<ANIO_ACTUAL; tempY++){
			this.arrayAnios.push(tempY+1);
		}
	}

	getPaises(PosibleValor, form) {
		// if(!PosibleValor){
		// 	if(form=='DAS')
		// 		this.formReporteVentasEstadoDAS.controls.Pais.reset()	
		// 	else
		// 		this.formReporteVentasEstadoWIN.controls.Pais.reset()	
		// 	return 0
		// }
		this.multitabla_s.GetListarPaises().subscribe(
			(data: any) => {
				this.array_pais = data;
				if (PosibleValor !== null) {					
					switch(form){
						case 'DAS':
							this.formReporteVentasEstadoDAS.controls.Pais.setValue(PosibleValor)
							break;
						case 'WIN':
							this.formReporteVentasEstadoWIN.controls.Pais.setValue(PosibleValor)
							break;
						case 'ASOCIADO':
							this.formReporteVentasAsociado.controls.Pais.setValue(PosibleValor)
							break;
						case 'GENERAL':
							this.formReporteVentasGeneral.controls.Pais.setValue(PosibleValor)
							break;
					}
				}
			}, (errorServicio) => {

				console.log(errorServicio);
			}
		);
	}

	getListarDepartamento(Pais, PosibleValor, form) {
		this.multitabla_s.GetListarDepartamentos(Pais).subscribe(
			(data: any) => {
				this.array_departamento = data;
        if(this.array_departamento.length > 1){
          this.array_departamento.unshift({
            Departamento: 0, NombreDepartamento: 'Todos'
          });
        }
				if (PosibleValor >= 0) {
					switch(form){
						case 'DAS':
							this.formReporteVentasEstadoDAS.controls.Departamento.setValue(PosibleValor)
							break;
						case 'WIN':
							this.formReporteVentasEstadoWIN.controls.Departamento.setValue(PosibleValor)
							break;
						case 'ASOCIADO':
							this.formReporteVentasAsociado.controls.Departamento.setValue(PosibleValor)
							break;
						case 'GENERAL':
							this.formReporteVentasGeneral.controls.Departamento.setValue(PosibleValor)
							break;
					}
				}
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
	}

	getListaAsociados(){
		this.dashboard_s.GetListaAsociados().subscribe(
			(data:any)=>{
				this.array_asociados = data;
        if(this.array_asociados.length > 0){
          this.array_asociados.unshift({
            idTrabajador: 0, NombreCompleto: 'Todos', NombreApellido: "Todos"
          });
        }
			}, (errorServicio)=>{console.log(errorServicio)}
		);
	}

	getDataReporteVentasByDepartamento(tipo, anio, mes, semana, desde, hasta){
		this.dashboard_s.GetReporteVentasByDepartamento(tipo,anio,mes,semana,desde,hasta).subscribe(
      (data:any) => {
				let tempData:any = {};
				tempData.categorias = data.map(e=>e.departamento);
				tempData.series = [
					{
						name: 'Ingresadas',
						data: data.map(e=>e.montoIngresadas)
					},{
						name: 'Registradas',
						data: data.map(e=>e.montoRegistradas)
					},{
						name: 'Instaladas',
						data: data.map(e=>e.montoInstaladas)
					}
				];
				this.ventasDepartamento = tempData;
				this.graf1.opcionesGrafico.xAxis.categories = tempData.categorias;
				this.graf1.opcionesGrafico.yAxis.labels.format = 'S/.{text}'
				this.graf1.opcionesGrafico.series = tempData.series;
				this.graf1.opcionesGrafico.plotOptions = {
					column: {
							dataLabels: {
									enabled: true,
									format: 'S/.{y}'
							},
							enableMouseTracking: false
					}
				}
				// this.emitEventToChild() 
  			this.actualizarGraf1.next();
      }, ( errorServicio ) => {           
        console.log(errorServicio);
      }
    );
	}

	getDataReporteVentasByEstadoDAS(pais,departamento,tipo, anio, mes, semana, desde, hasta){
		this.dashboard_s.GetReporteVentasByEstadoDAS(pais,departamento,tipo,anio,mes,semana,desde,hasta).subscribe(
			( data:any ) => {
				let tempData: any = {}
				this.graf2.opcionesGrafico.xAxis.categories = data.map(e=>e.NombreEstado);
				this.graf2.opcionesGrafico.series = [{
					name: 'Estado DAS',
					data: data.map(e=>({name: e.NombreEstado, y: e.Cantidad}))
				}] 
				this.graf2.opcionesGrafico.plotOptions = {
					column: {
							dataLabels: {
									enabled: true
							},
							enableMouseTracking: false
					},
					series:{
						showInLegend: false,
					}
				}
  			this.actualizarGraf2.next();
			}, ( errorServicio ) => {
				console.log(errorServicio)
			}
		)
	}

	
	getDataReporteVentasByEstadoWIN(pais,departamento,tipo, anio, mes, semana, desde, hasta){
		this.dashboard_s.GetReporteVentasByEstadoWIN(pais,departamento,tipo,anio,mes,semana,desde,hasta).subscribe(
			( data:any ) => {
				let tempData: any = {}
				this.graf3.opcionesGrafico.xAxis.categories = data.map(e=>e.NombreEstado);
				this.graf3.opcionesGrafico.series = [{
					name: 'Estado WIN',
					data: data.map(e=>({name: e.NombreEstado, y: e.Cantidad}))
				}] 
  			this.actualizarGraf3.next();
			}, ( errorServicio ) => {
				console.log(errorServicio)
			}
		)
	}

	getDataReporteVentasByAsociado(pais,departamento=0,tipo, anio, mes, semana, desde, hasta){
		this.dashboard_s.GetReporteVentasByAsociado(pais,departamento,tipo,anio,mes,semana,desde,hasta).subscribe(
			(data:any) => {
				let tempData:any = {};
				tempData.categorias = data.map(e=>e.Asociado);
				tempData.series = [
					{
						name: 'Ingresadas',
						data: data.map(e=>e.montoIngresadas)
					},{
						name: 'Registradas',
						data: data.map(e=>e.montoRegistradas)
					},{
						name: 'Instaladas',
						data: data.map(e=>e.montoInstaladas)
					}
				];
				this.ventasDepartamento = tempData;
				this.graf4.opcionesGrafico.xAxis.categories = tempData.categorias;
				this.graf4.opcionesGrafico.yAxis.labels.format = 'S/.{text}'
				this.graf4.opcionesGrafico.series = tempData.series;
				this.graf4.opcionesGrafico.plotOptions = {
					column: {
							dataLabels: {
									enabled: true,
									format: 'S/.{y}'
							},
							enableMouseTracking: false
					}
				}
				// this.emitEventToChild() 
  			this.actualizarGraf4.next();
      }, ( errorServicio ) => {           
        console.log(errorServicio);
      }
		);
	}

	getDataReporteVentasGeneral(pais,departamento=0,asociado,tipo, anio, mes, semana, desde, hasta){
		// let arrayFechas: Array<Array<Date | number>> = [];
		let arrayFechas: Array<{fecha: Date, montoIngresado: number, montoRegistrado: number, montoInstalado: number}> = [];
		let startIteration: Date;
		let endIteration: Date;
		let traveler: Date;
		const ms_DAY = 1000*60*60*24; // constante de la cantidad de milisegundos en un dia

		switch(parseInt(tipo)){
			case 1: // anual
				startIteration = new Date(anio, 0, 1);
				endIteration = new Date(anio + 1, 0, 1);
				break;
			case 2: // mensual
				startIteration = new Date(anio, mes-1, 1); // el servicio lee enero como 1, pero el constructor de Date lee enero como 0, asi que para iniciar restamos 1
				endIteration = new Date(anio, mes%12, 1); // el uso del modulo es para ahorrar en logica, puesto que meses van de 0 a 11, y 12%12 es 0 regresando a enero
				break;
			case 3: // semanal
				startIteration = this.getStartCurrentWeek(semana, anio);
				endIteration = this.getStartCurrentWeek(parseInt(semana)+1, anio); // necesario el parseInt, porque al usar los combos, se envia como string, concatenandose
				break;
			case 4: // diarios
				startIteration = new Date(desde+".");
				endIteration = new Date(hasta+".");
				endIteration = new Date(endIteration.getTime()+ms_DAY); // la logica en la iteracion agrega fechas hasta un dia antes de la fecha de fin				
				break;
		}
		this.dashboard_s.GetReporteVentasByEstatusGeneral(pais, departamento, asociado, tipo, anio, mes, semana, desde, hasta).subscribe(
			(data: Array<any>)=>{
				traveler = new Date(startIteration);
				while(traveler<endIteration){
					let montoIngresado = 0;
					let montoRegistrado = 0;
					let montoInstalado = 0;
					// como tendremos dos arrays, las fechas, y la data mientras vamos creando el array de fecha
					// revisamos la data, si hay data que coincida asignamos los valores correspondientes
					if(data.findIndex(e=>e.fecha.split('T')[0] == traveler.toLocaleDateString('en-CA'))!=-1){
						let temp_obj = data.find(e=>e.fecha.split('T')[0] === traveler.toLocaleDateString('en-CA'));
						montoIngresado = temp_obj.montoIngresadas;
						montoRegistrado = temp_obj.montoRegistradas;
						montoInstalado = temp_obj.montoInstaladas;
					}
					// logica posiblemente no necesaria en caso la database tenga informacion por cada dia (si no, no se mostraria),
					// y podria reducir ligeramente(*) el tiempo que toma en ejecutar este codigo
					arrayFechas.push({fecha: traveler, montoIngresado: montoIngresado, montoRegistrado: montoRegistrado, montoInstalado:montoInstalado});
					traveler = new Date(traveler.getTime()+ms_DAY);
				}
				// --------------------------
																																				// el Intl.DateTimeFormat, es para retornar un string con el formato deseado
				this.graf5.opcionesGrafico.xAxis.categories = arrayFechas.map(e=>new Intl.DateTimeFormat('es', {month:'short', day:'2-digit'}).format(e.fecha).replace(' ','-'));
																																				// en este caso es el mes abreviado, y el dia mostrando 2 digitos.
				this.graf5.opcionesGrafico.yAxis.labels.format = 'S/.{text}'
				this.graf5.opcionesGrafico.series = [
					{
						name: 'Ingresadas',
						data: arrayFechas.map(e=>e.montoIngresado)
					},{
						name: 'Registradas',
						data: arrayFechas.map(e=>e.montoRegistrado)
					},{
						name: 'Instaladas',
						data: arrayFechas.map(e=>e.montoInstalado)
					}
				];
				this.graf5.opcionesGrafico.plotOptions = {
					line: {
							dataLabels: {
									enabled: true,
									format: 'S/.{y}'
							},
							enableMouseTracking: false
					}
				}
				// this.emitEventToChild() 
  			this.actualizarGraf5.next();
			}, ( errorServicio )=>{ console.log(errorServicio) }
		);
	}

	getDataReporteObservacionesVentas(pais,departamento=0,asociado = 0,tipo, anio, mes, semana, desde, hasta){
		this.dashboard_s.GetReporteObservacionesVentas(pais, departamento, asociado, tipo, anio, mes, semana, desde, hasta).subscribe(
			(data:Array<any>)=>{
				let tempOption: any = {}
				tempOption.series = [{
					type: "treemap",
					layoutAlgorithm: 'squarified',
					alternateStartingDirection: true,
					levels: [{
						level: 1,
						layoutAlgorithm: 'sliceAndDice',
						dataLabels: {
							enabled: true,
							align: 'left',
							verticalAlign: 'top',
							style: {
								fontSize: '15px',
								fontWeight: 'bold'
							}
						}
					}],
					data: [],
				}];
				let Padres: Array<any> = data.map(e=>({id:e.TipoEstado, name: e.TextoPadre, color: ""})).filter((element,index,arr)=>arr.findIndex(e=>e.id == element.id)==index).map((e,i)=>{e.color = this.arrayColores[i%this.arrayColores.length]; return e});
				let Hijos: Array<any> = data.map(e=>({name: e.NombreEstado, parent: e.TipoEstado, value: e.Cantidad}))
				tempOption.series[0].data = Padres.concat(Hijos);
				this.graf6.opcionesGrafico.series = tempOption.series;
				this.actualizarGraf6.next();
			}, (errorServicio)=>{console.log(errorServicio)}
		);
	}

  ngOnInit(): void {
	this.validarPassword();
		const FECHA_ACTUAL = new Date()
		this.obtenerListaAnios();
    this.filterFormVentasDepartamento();
		this.filterFormVentasEstadoDAS();
		this.filterFormVentasEstadoWIN();
		this.filterFormVentasAsociado();
		this.filterFormVentasGeneral();
		this.filterFormObservacionesVentas();
		this.getListaAsociados();
		this.getPaises(1,'DAS');
		this.getPaises(1,'WIN');
		this.getListarDepartamento(1,0,'DAS');
		this.getListarDepartamento(1,0,'WIN');
		this.getListarDepartamento(1,0,'WIN');
		this.getDataReporteVentasByDepartamento(1,FECHA_ACTUAL.getFullYear(),FECHA_ACTUAL.getMonth()+1,this.getCurrentWeekNumber(),FECHA_ACTUAL.toLocaleDateString('en-CA'),FECHA_ACTUAL.toLocaleDateString('en-CA'));
		this.getDataReporteVentasByEstadoDAS(1,0,1,FECHA_ACTUAL.getFullYear(),FECHA_ACTUAL.getMonth()+1,this.getCurrentWeekNumber(),FECHA_ACTUAL.toLocaleDateString('en-CA'),FECHA_ACTUAL.toLocaleDateString('en-CA'))
		this.getDataReporteVentasByEstadoWIN(1,0,1,FECHA_ACTUAL.getFullYear(),FECHA_ACTUAL.getMonth()+1,this.getCurrentWeekNumber(),FECHA_ACTUAL.toLocaleDateString('en-CA'),FECHA_ACTUAL.toLocaleDateString('en-CA'))
		this.getDataReporteVentasByAsociado(1,0,1,FECHA_ACTUAL.getFullYear(),FECHA_ACTUAL.getMonth()+1,this.getCurrentWeekNumber(),FECHA_ACTUAL.toLocaleDateString('en-CA'),FECHA_ACTUAL.toLocaleDateString('en-CA'));
		this.getDataReporteVentasGeneral(1,0,0,1,FECHA_ACTUAL.getFullYear(),FECHA_ACTUAL.getMonth()+1,this.getCurrentWeekNumber(),FECHA_ACTUAL.toLocaleDateString('en-CA'),FECHA_ACTUAL.toLocaleDateString('en-CA'));
		this.getDataReporteObservacionesVentas(1,0,0,1,FECHA_ACTUAL.getFullYear(),FECHA_ACTUAL.getMonth()+1,this.getCurrentWeekNumber(),FECHA_ACTUAL.toLocaleDateString('en-CA'),FECHA_ACTUAL.toLocaleDateString('en-CA'));
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
	ngAfterViewInit(): void {
	}

}
