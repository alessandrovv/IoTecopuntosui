import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiEnum } from 'src/app/Shared/enums/api.enum';
import { HeaderBasicAuthorizationService } from 'src/app/Shared/services/header-basic-authorization.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class EstudiantesService {
    constructor(
        private httpClient: HttpClient,
        private headerBasicAuthorization: HeaderBasicAuthorizationService,
    ){
    }

    GetEstudiantes(){
        return this.httpClient.get(`${environment.ecoApi.estudiantes.url}/`
        ).pipe(map(data=>data));
    }

    GetTest(){
        return this.httpClient.get('http://localhost:8000/test/').pipe(map(data=>data));
    }
}