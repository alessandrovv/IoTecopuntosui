import { Injectable } from '@angular/core';
import { JwtDataModel } from '../models/jwt-data.model';
import * as jwtDecode from 'jwt-decode';
import { JwtUserModel } from '../models/jwt-user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  private data: JwtDataModel = null;
  private user: JwtUserModel = null;

  constructor() { }

  clear(): void {
    this.data = null;
    this.user = null;
  }

  load(jwt: string): void {
    try {
      this.data = jwtDecode(jwt) as JwtDataModel;
      this.user = JSON.parse(this.data.userData);
    } catch (e) {
    }
  }

  isValid(): any {
    return !this.isExpired() && this.isValidAudience() && this.isValidIssuer();
  }

  getUser(): JwtUserModel {
    return this.user;
  }
  
  private isExpired(): boolean {
    if (this.data == null) {
      return true;
    }

    const date = this.getExpirationDate();
    if (date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

  private getExpirationDate(): Date {
    if (this.data.exp === undefined) return null;

    const date = new Date(0); 
    date.setUTCSeconds(this.data.exp);
    return date;
  }

  private isValidAudience() {
    if (this.data.aud === undefined) return false;
    return this.data.aud === environment.jwt.audience;
  }

  private isValidIssuer() {
    if (this.data.iss === undefined) return false;
    return this.data.iss === environment.jwt.issuer;
  }
}
