import { Component, OnInit, AfterViewInit } from '@angular/core';
import { JwtUserModel } from 'src/app/Shared/models/jwt-user.model';
import { JwtService } from 'src/app/Shared/services/jwt.service';

@Component({
  selector: 'app-perfil-opciones',
  templateUrl: './perfil-opciones.component.html',
  styleUrls: ['./perfil-opciones.component.scss']
})
export class PerfilOpcionesComponent implements OnInit {
  jwtUser: JwtUserModel = null;

  constructor(
    private jwtService: JwtService
  ) { }

  ngOnInit(): void {
    this.jwtUser = this.jwtService.getUser();
    
  }

}
