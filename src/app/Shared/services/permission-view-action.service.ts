import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { HeaderBasicAuthorizationService } from "./header-basic-authorization.service";
import { environment } from "../../../environments/environment";
import { ApiEnum } from "../enums/api.enum";
import { map } from "rxjs/operators";
import { Navigation } from '../../modules/auth/_core/interfaces/navigation';

@Injectable({
    providedIn: 'root'
  })
export class PermissionViewActionService {
    private data: Array<Navigation> = null;

    constructor(private headerBasicAuthorization: HeaderBasicAuthorizationService,
                private httpClient: HttpClient) {

    }

    set(data) {
        this.data = data;
    }

    get() {
        return this.data;
    }

    private guardarLogAccesos(Opcion: number, Vista: number, Accion: number) {
        return this.httpClient.post(`${environment.api.WS_IT.url}/LogAccesos/Guardar`, {
            Opcion: Opcion,
            Vista: Vista,
            Accion: Accion
          },
            { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) })
            .pipe(map(response => response[0]));
    }

    validViewAction(viewCode: string, actionCode: string) {
        let viewActions = this.get();
        let views = viewActions.filter(viewAction => viewAction.Codigo === viewCode);
        if(views.length == 0) {
            return false;
        } else {
            if(actionCode != null) {
            let actions = views[0].SubNavegacion.filter(viewAction => viewAction.Codigo === actionCode);
            if(actions.length == 0) {
                return false;
            } else {
                return true;
            }
            }
            return true;
        }
    }

    clickViewAction(viewCode: string, actionCode: string) {
        let viewActions = this.get();
        let views = viewActions.filter(viewAction => viewAction.Codigo === viewCode);
        if(views.length == 1) {
            let actions = views[0].SubNavegacion.filter(viewAction => viewAction.Codigo === actionCode);
            if(actions.length == 1) {
                const action: Navigation = actions[0];
                this.guardarLogAccesos(action.Opcion, action.Vista, action.Accion)
                    .subscribe((response) => {});
            }
        }
    }
}
