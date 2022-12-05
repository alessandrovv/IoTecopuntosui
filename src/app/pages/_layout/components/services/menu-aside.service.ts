import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import * as objectPath from 'object-path';
import { MenuConfigService } from '../../../../modules/auth/_services/menu-config.service';
import { LayoutConfigService } from './layout-config.service';
import { PermissionNavigationService } from '../../../../Shared/services/permission-navigation.service';
import { Navigation } from '../../../../modules/auth/_core/interfaces/navigation';

@Injectable()
export class MenuAsideService {
	classes: string;
	menuList$: BehaviorSubject<any[]> = new BehaviorSubject([]);

	isDropdown: number = 0;
	dropdownTimeout: number;
	isScrollable: number = 0;

	treeList: any = [];
	configTree: any = {};

	constructor(
		private menuConfigService: MenuConfigService,
		private layoutConfigService: LayoutConfigService,

		private permissionNavigationService: PermissionNavigationService
	) {
		this.menuConfigService.onMenuUpdated$.subscribe(model => {
			permissionNavigationService.data$
				.subscribe((navigation: Navigation) => {
					this.treeList = [];
					if(navigation != null) {
						this.treeList = navigation.SubNavegacion;
					}
					this.menuList$.next(this.treeList);
                    console.log(this.menuList$);
				})
		});

		this.layoutConfigService.onLayoutConfigUpdated$.subscribe(config => {
			if (objectPath.get(config, 'config.aside.left.fixed')) {
				this.isScrollable = 1;
				this.isDropdown = 0;
			}

			// tslint:disable-next-line:max-line-length
			if (!objectPath.get(config, 'config.aside.left.fixed') && !objectPath.get(config, 'config.menu.aside.desktop_and_mobile.submenu.accordion')) {
				this.isScrollable = 0;
				this.isDropdown = 1;
				this.dropdownTimeout = objectPath.get(config, 'config.menu.aside.desktop_and_mobile.submenu.dropdown.hover_timeout');
			}
		});
	}
}
