import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../../modules/auth/_services/auth.service';
import { StorageKeyEnum } from 'src/app/Shared/enums/storage-key.enum';
import { StorageService } from 'src/app/Shared/services/storage.service';
import { GlobalProperties } from 'src/app/Shared/util/global-properties';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

    constructor(private storageService: StorageService,
                private authService: AuthService) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const jwt: string = this.storageService.get(StorageKeyEnum.JWT_AUTHORIZATION);
        if (jwt) {
            request = request.clone({ headers: request.headers.set(GlobalProperties.headers.authorization.name, 
                                                                `${GlobalProperties.headers.authorization.prefix}${jwt}`) })
        }

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error instanceof HttpErrorResponse) {
                    // if (error.status === 401 ||
                    //     error.status === 403 ||
                    //     error.status === 0) {
                    //     this.authService.logoff();
                    //     this.authService.redirectToLogin();
                    // }
                }
                return throwError(error);
            })
        );
    }
}
