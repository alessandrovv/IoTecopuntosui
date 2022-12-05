import { Injectable } from "@angular/core";
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { Navigation } from "src/app/modules/auth/_core/interfaces/navigation";
import { PermissionViewActionService } from './permission-view-action.service';


@Injectable({
    providedIn: 'root'
  })
export class PermissionNavigationService {
    private data: Navigation = null;
    private urls: Array<string> = [];

    public data$ = new BehaviorSubject<Navigation>(this.data);

    constructor(private permissionViewActionService: PermissionViewActionService) {

    }

    private loadUrls(navigation: Navigation) {
        let urls: Array<string> = [];

        if(navigation.Url != null && navigation.Url != '') {
            urls.push(navigation.Url);
        }
        navigation.SubNavegacion.forEach(subNavegacion => {
            urls = urls.concat(this.loadUrls(subNavegacion));
        });

        return urls;
    }

    set(data, urlsRoot: Array<string>) {
        this.data = data;
        this.urls = this.loadUrls(this.data);
        this.urls = this.urls.concat(urlsRoot);
        this.data$.next(this.data);
    }

    get() {
        return this.data;
    }

    reset() {
        this.data = null;
        this.urls = [];
        this.data$.next(this.data);
    }

    getUrls() {
        return this.urls;
    }

    private loadViewActionPrivate(navigation: Navigation, url: string) {
        let permissions: any = {};

        if (navigation.Url != null && url.indexOf(navigation.Url) >= 0){
            permissions[navigation.Url] = navigation.SubNavegacion;
        } 
        navigation.SubNavegacion.forEach(subNavegacion => {
            let permissionsSubNavegacion = this.loadViewActionPrivate(subNavegacion, url);
            for(let key in permissionsSubNavegacion) {
                permissions[key] = permissionsSubNavegacion[key];
            }
        });

        return permissions;
    }

    loadViewAction(url: string) {
        let stateUrl = url.split('?')[0];
        let permissions: any = this.loadViewActionPrivate(this.data, stateUrl);

        let viewActions = [];
        let keyMayor = '';
        for(let key in permissions) {
            if(key.length > keyMayor.length) {
                keyMayor = key;
                viewActions = permissions[key];
            }
        }
        this.permissionViewActionService.set(viewActions);
    }
}
