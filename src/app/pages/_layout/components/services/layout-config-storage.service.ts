import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { LayoutConfig } from '../model/layout';

@Injectable()
export class LayoutConfigStorageService {
	constructor() {}

	saveConfig(layoutConfig: LayoutConfig): void {
		if (layoutConfig != null) {
			// config storage
			localStorage.setItem('layoutConfig', JSON.stringify(layoutConfig));
		}
	}

	getSavedConfig(): Observable<LayoutConfig> {
		const config: any = localStorage.getItem('layoutConfig');
		try {
			return of(JSON.parse(config));
		} catch (e) {}
	}

	loadConfig(): Observable<LayoutConfig> {
		return this.getSavedConfig().pipe(
			map(config => {
				return Object.assign({}, new LayoutConfig(), config);
			})
		);
	}

	resetConfig(): void {
		localStorage.removeItem('layoutConfig');
	}
}
