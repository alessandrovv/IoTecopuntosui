import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ApiEnum } from '../enums/api.enum';
import { environment } from '../../../environments/environment';
import { GlobalProperties } from '../util/global-properties';

@Injectable({
  providedIn: 'root'
})
export class HeaderBasicAuthorizationService {

  constructor() { }

  get(apiEnum: ApiEnum) {
    let headers = new HttpHeaders();
    let valueOfApiEnum: string = this.toBtoa(environment.api[ApiEnum[apiEnum]].basicAuthorization.username,
                                            environment.api[ApiEnum[apiEnum]].basicAuthorization.password);
    headers = headers.set(GlobalProperties.headers.basicAuthorization.name,
                        `${GlobalProperties.headers.basicAuthorization.prefix}${valueOfApiEnum}`)
    return headers;
  }

  private toBtoa(username: string, password: string): string {
    return btoa(username + ':' + password);
  }

}
