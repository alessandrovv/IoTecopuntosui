import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LayoutService } from '../../../../../core';
import { UserModel } from '../../../../../../modules/auth/_models/user.model';
import { AuthService } from '../../../../../../modules/auth/_services/auth.service';
import { JwtUserModel } from '../../../../../../Shared/models/jwt-user.model';
import { JwtService } from '../../../../../../Shared/services/jwt.service';
@Component({
  selector: 'app-user-dropdown-inner',
  templateUrl: './user-dropdown-inner.component.html',
  styleUrls: ['./user-dropdown-inner.component.scss'],
})
export class UserDropdownInnerComponent implements OnInit {
  extrasUserDropdownStyle: 'light' | 'dark' = 'light';
  user$: Observable<UserModel>;
  jwtUser: JwtUserModel = null;
  constructor(
    private layout: LayoutService, 
    private auth: AuthService,
    private jwtService: JwtService
  ) {}

  ngOnInit(): void {
    this.jwtUser = this.jwtService.getUser();
    this.extrasUserDropdownStyle = this.layout.getProp(
      'extras.user.dropdown.style'
    );
    // this.user$ = this.auth.currentUserSubject.asObservable();
  }

  logout() {
    this.auth.logout();
    document.location.reload();
  }
}
