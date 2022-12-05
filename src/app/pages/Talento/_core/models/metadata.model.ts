import { ConditionEnum } from "./condition.enum.model";
import { TypeControlEnum } from "./type-control.enum.model";


export class Metadata {
    DatoContrato: number = 0;
    ConfigDatoContrato: number = 0;
    TipoDatoRespuesta: TypeControlEnum = TypeControlEnum.TEXT;
    NombreDato: string = '';
    Obligatorio: boolean = false;
    value: any = null;
    // ID: string = '';
    // TipoDatoRespuesta: TypeControlEnum = TypeControlEnum.TEXT;
    // Pregunta: string = '';
    // Obligatorio: boolean = false;
    // FechaAutomatica: boolean = false;
    // FechaAutomaticaIgnoraEdicion: boolean = false;
    // VisibilidadDependiente?: boolean = true;
    // PreguntaDependiente?: string = '';
    // ValorPreguntaDependiente?: string = '';
    // Datos?: Array<any> = [];
    // NombreCodigo?: string = '';
    // NombreValor?: string = '';
    // ListaDependiente?: boolean = false;
    // PreguntaDependienteLista?: string = '';
    // NombreIDPadre?: string = '';
    // EndPoint?: string = '';

    // CheckCalculado: boolean = false;
    // CheckCalculadoPregunta1: string = '';
    // CheckCalculadoCondicion: string = ConditionEnum.EQUAL;
    // CheckCalculadoPregunta2: string = '';

    defaultValue?: string = '';
    // fixedValue?: boolean = false;

    // MaxCaracteres: number = -1;
    // NumberCalculadoEntreFechas: boolean = false;
    // NumberCalculadoEntreFechasPregunta1: string = '';
    // NumberCalculadoEntreFechasPregunta2: string = '';

    // TipoTexto: 'NORMAL' | 'ALFANUMERICO' | 'NUMERICO' = 'NORMAL';
}
