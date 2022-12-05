import {
	Component,
	OnInit,
	Output,
	Input,
	ViewChild,
	EventEmitter,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Console } from "console";
import { Subject } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";


@Component({
	selector: 'app-filtros-temporales',
	templateUrl: './filtros-temporales.component.html',
	styleUrls: ['./filtros-temporales.component.scss']
})
export class FiltrosTemporalesComponent implements OnInit {

	@Output() filterChangeEvent = new EventEmitter<{
		Tipo: number;
		Anio: number;
		Mes: number;
		Semana: number;
		Inicio: Date;
		Fin: Date;
	}>();

	@Input() b_showTipo: boolean = true;
	@Input() tipoFiltro: number = 1;

	filterGroupTiempo: FormGroup;

	filtros: any = {};

	arraySemanas = [];

	arrayMeses = [
		{
			value: 1,
			name: "Enero",
		},
		{
			value: 2,
			name: "Febrero",
		},
		{
			value: 3,
			name: "Marzo",
		},
		{
			value: 4,
			name: "Abril",
		},
		{
			value: 5,
			name: "Mayo",
		},
		{
			value: 6,
			name: "Junio",
		},
		{
			value: 7,
			name: "Julio",
		},
		{
			value: 8,
			name: "Agosto",
		},
		{
			value: 9,
			name: "Setiembre",
		},
		{
			value: 10,
			name: "Octubre",
		},
		{
			value: 11,
			name: "Noviembre",
		},
		{
			value: 12,
			name: "Diciembre",
		},
	];

	arrayAnios = [2022];

	constructor(private modalService: NgbModal, private fb: FormBuilder) { }

	ngOnInit(): void {
		const FECHA_ACTUAL = new Date();
		this.obtenerListaAnios();
		this.obtenerListaSemanas();
		this.initFilterGroupTiempo();
		this.sendFilters();
	}

	initFilterGroupTiempo() {
		this.filterGroupTiempo = this.fb.group({
			Tipo: [this.tipoFiltro],
			Anio: [new Date().getFullYear()],
			Mes: [new Date().getMonth() + 1],
			Semana: [this.getCurrentWeekNumber()],
			FechaDesde: [new Date().toLocaleDateString("en-CA")],
			FechaHasta: [new Date().toLocaleDateString("en-CA")],
		});
	}

	getCurrentWeekNumber(): number {
		const currentdate: any = new Date();
		var oneJan: any = this.getStartFirstWeek();
		var numberOfDays = Math.floor(
			(currentdate - oneJan) / (24 * 60 * 60 * 1000)
		);
		var result = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7);
		return result;
	}

	getStartFirstWeek(anio = new Date().getFullYear()): Date {
		let tempDay: number = 0; // empezamos en 0 para realizar la iteracion
		let tempDate: Date;
		do {
			tempDate = new Date(anio, 0, ++tempDay); // iteramos los dias hasta encontrar el primer lunes
		} while (tempDate.getDay() !== 1); // los valores son 0 domingo, 1 lunes, 2 martes... y asi
		return tempDate;
	}

	getStartCurrentWeek(
		week: number = this.getCurrentWeekNumber(),
		year = new Date().getFullYear()
	) {
		const ms_WEEK = 1000 * 60 * 60 * 24 * 7; // constante de la cantidad de milisegundos en una semana
		return new Date(
			this.getStartFirstWeek(year).getTime() + (week - 1) * ms_WEEK
		);
		// para obtener el inicio de la semana deseada creamos una fecha obteniendo el primer dia de semana calendarios del año
		// y luego a le sumamos la cantidad de milisegundos segun el numero de semana deseada. obteniendose asi
		// el lunes del numero de semana desado
	}

	obtenerListaSemanas() {
		for (let i = 1; i <= 54; i++) {
			this.arraySemanas.push({ value: i, name: `Semana ${i}` });
		}
	}

	obtenerListaAnios() {
		let tempY = this.arrayAnios[0];
		const ANIO_ACTUAL = new Date().getFullYear();

		for (tempY; tempY < ANIO_ACTUAL; tempY++) {
			this.arrayAnios.push(tempY + 1);
		}
	}

	sendFilters() {
		this.tipoFiltro = this.filterGroupTiempo.controls.Tipo.value;
		const controls = this.filterGroupTiempo.controls;

		this.filtros = {
			Tipo: controls.Tipo.value,
			Anio: controls.Anio.value,
			Mes: controls.Mes.value,
			Semana: controls.Semana.value,
			Inicio: controls.FechaDesde.value,
			Fin: controls.FechaHasta.value,
		};

		this.filterChangeEvent.emit(this.filtros);
	}

}
