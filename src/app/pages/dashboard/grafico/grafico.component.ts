import { Component, ViewChild, OnInit, AfterViewInit, Input, ElementRef, } from '@angular/core';
import { Chart, registerables} from 'chart.js';
import * as Highcharts from 'highcharts';
import { lang } from 'moment';
// import * as highchartsTreemap from 'highcharts/modules/treemap';
import { Observable, Subscription } from 'rxjs';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');
let highchartsTreemap = require('highcharts/modules/treemap');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
highchartsTreemap(Highcharts);
@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.component.html',
  styleUrls: ['./grafico.component.scss']
})
export class GraficoComponent implements OnInit{

	@Input() updateEvent: Observable<void>;
	@Input() container: String = 'grafico1';
	@Input() tipo: String = 'bar';
	@Input() titulo: String = '...';

	private eventsSubscription: Subscription;
	private hasLoaded: boolean = false;

  constructor() { 
	}
	opcionesGrafico: any = {
		chart: {
			type: this.tipo,
			renderTo: this.container,
		},
		plotOptions:{},
		title: {
			text: this.titulo
		},
		xAxis: {
			categories: []
		},
		yAxis:{
			labels:{}
		},
		series: [],
		credits:{
			enabled: false
		},
		lang:{
			noData: ''
		}
	};

	chart: Highcharts.Chart;

	@Input() events: Observable<void>;

	

  ngOnInit(){
		this.eventsSubscription = this.updateEvent.subscribe(() => this.refreshGraph());
	}

	ngAfterViewInit(){
		this.opcionesGrafico.chart.type = this.tipo;
		this.opcionesGrafico.chart.renderTo = this.container;
		this.opcionesGrafico.title.text = this.titulo;
		this.chart = Highcharts.chart( this.opcionesGrafico);
		this.chart.showLoading();
	}

	refreshGraph(){
		this.opcionesGrafico.lang.noData = 'No hay datos';
    this.chart = Highcharts.chart( this.opcionesGrafico);
		this.chart.hideLoading();
	}

	ngOnDestroy() {
		this.eventsSubscription.unsubscribe();
	}
}
