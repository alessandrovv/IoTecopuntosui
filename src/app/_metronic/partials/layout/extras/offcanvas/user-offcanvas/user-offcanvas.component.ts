import { Component, OnInit, Input } from '@angular/core';
import { LayoutService } from '../../../../../core';
import { Observable } from 'rxjs';
import { UserModel } from '../../../../../../modules/auth/_models/user.model';
import { AuthService } from '../../../../../../modules/auth/_services/auth.service';
import { JwtUserModel } from 'src/app/Shared/models/jwt-user.model';
import { JwtService } from 'src/app/Shared/services/jwt.service';

@Component({
  selector: 'app-user-offcanvas',
  templateUrl: './user-offcanvas.component.html',
  styleUrls: ['./user-offcanvas.component.scss'],
})
export class UserOffcanvasComponent implements OnInit {
  extrasUserOffcanvasDirection = 'offcanvas-right';
  user$: Observable<UserModel>;
  jwtUser: JwtUserModel = null;

	@Input() id: string;
	@Input() close: string;

  constructor(
    private layout: LayoutService, 
    private auth: AuthService,
    private jwtService: JwtService
  ) {}

  ngOnInit(): void {
    this.jwtUser = this.jwtService.getUser();
    this.extrasUserOffcanvasDirection = `offcanvas-${this.layout.getProp(
      'extras.user.offcanvas.direction'
    )}`;
    this.user$ = this.auth.currentUserSubject.asObservable();
  }

  logout() {
    this.auth.logout();
    document.location.reload();
  }
}
