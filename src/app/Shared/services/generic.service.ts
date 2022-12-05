import { Injectable } from '@angular/core';
import { JwtDataModel } from '../models/jwt-data.model';
import * as jwtDecode from 'jwt-decode';
import { JwtUserModel } from '../models/jwt-user.model';
import { environment } from '../../../environments/environment';
import { SimpleData } from '../models/simple-data-model';
import { ActivoEnum } from '../enums/activo.enum';

@Injectable({
  providedIn: 'root'
})
export class GenericService {

    listDataActivo(): Array<SimpleData<number>> {
		let data: Array<SimpleData<number>> = [];
		for(let key in ActivoEnum) {
			if (isNaN(Number(key))) {
				data.push({
					Value: parseInt(ActivoEnum[key]),
					Name: key
				});
			}
		}
		return data;
	}
}
