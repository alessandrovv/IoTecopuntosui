// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	appVersion: 'v726demo1',
	USERDATA_KEY: 'authf649fc9a5f55',
	isMockEnabled: true,
	apiUrl: 'https://your-domain.com/api',
	timeToIdle: 2000000, // cantidad de milisegundos para que el sistema reconozca a un usuario como inactivo
	timeToLogOut: 5000, // cantidad de milisegundos para cerrar la sesion del usuario una vez notificado

	jwt: {
		audience: 'DefaultAudience',
		issuer: 'DefaultIssuer'
	},

	APIKEY_GOOGLE_MAPS: 'AIzaSyAb4_HzUKg80G_jl9QwJyoyOpBnxJPFKmg',

	/*WEB SERVICES*/
	//DEV
	api: {
		WS_IT: {
			url: 'https://localhost:44333/api',
			basicAuthorization: {
				username: 'GextionaSecurityApi',
				password: '102603039504'
			}
		},
		WS_OP: {
			url: 'https://localhost:44349/api',
			basicAuthorization: {
				username: 'GextionaOperationsApi',
				password: '102603039504'
			}
		},
		WS_FI: {
			url: 'https://localhost:44383/api',
			basicAuthorization: {
				username: 'GextionaFinanceApi',
				password: '102603039504'
			}
		},
		WS_HR: {
			url: 'https://localhost:44324/api',
			basicAuthorization: {
				username: 'GextionaHumanResourcesApi',
				password: '102603039504'
			}
		},
		SalesApi: {
			url: 'https://localhost:44335/api',
			basicAuthorization: {
				username: 'GextionaSalesApi',
				password: '102603039504'
			}
		},
		WS_LG: {
			url: 'http://localhost:59023/api',
			basicAuthorization: {
				username: 'GextionaLogisticApi',
				password: '102603039504'
			}
		},
		ProductionApi: {
			url: 'https://localhost:44331/api',
			basicAuthorization: {
				username: 'GextionaProductionApi',
				password: '102603039504'
			}
		},
		TwilioApi:{
			url:'https://api.twilio.com/2010-04-01/Accounts',
			basicAuthorization:{
				username: 'AC0d53d033aefd2d9843b028c749b1b9c3',
				password: 'f440ba6fd67a6b70b70178d50545877c'
			}
		},
	},

	ecoApi: {
		estudiantes:{
			url:'http://localhost:8000/api/estudiantes'
		},
		recompensas:{
			url:'http://localhost:8000/api/recompensas'
		},
		basureros:{
			url:'http://localhost:8000/api/basureros'
		}
	},

	// QAS
	// api: {
	// 	WS_IT: {
	// 		url: 'https://qasgextionaapi.azurewebsites.net/SecurityApi/api',
	// 		basicAuthorization: {
	// 			username: 'GextionaSecurityApi',
	// 			password: '102603039504'
	// 		}
	// 	},
	// 	WS_OP: {
	// 		url: 'https://qasgextionaapi.azurewebsites.net/OperationsApi/api',
	// 		basicAuthorization: {
	// 			username: 'GextionaOperationsApi',
	// 			password: '102603039504'
	// 		}
	// 	},
	// 	WS_FI: {
	// 		url: 'https://qasgextionaapi.azurewebsites.net/FinanceApi/api',
	// 		basicAuthorization: {
	// 			username: 'GextionaFinanceApi',
	// 			password: '102603039504'
	// 		}
	// 	},
	// 	WS_HR: {
	// 		url: 'https://qasgextionaapi.azurewebsites.net/HumanResourcesApi/api',
	// 		basicAuthorization: {
	// 			username: 'GextionaHumanResourcesApi',
	// 			password: '102603039504'
	// 		}
	// 	},
	// 	SalesApi: {
	// 		url: 'https://qasgextionaapi.azurewebsites.net/SalesApi/api',
	// 		basicAuthorization: {
	// 			username: 'GextionaSalesApi',
	// 			password: '102603039504'
	// 		}
	// 	},
	// 	WS_LG: {
	// 		url: 'https://qasgextionaapi.azurewebsites.net/LogisticApi/api',
	// 		basicAuthorization: {
	// 			username: 'GextionaLogisticApi',
	// 			password: '102603039504'
	// 		}
	// 	},
	// 	ProductionApi: {
	// 		url: 'https://qasgextionaapi.azurewebsites.net/ProductionApi/api',
	// 		basicAuthorization: {
	// 			username: 'GextionaProductionApi',
	// 			password: '102603039504'
	// 		}
	// 	},
	// },

	// PRD
	// api: {
	// 	WS_IT: {
	// 		url: 'https://centralcobijaapi.azurewebsites.net/SecurityApi/api',
	// 		basicAuthorization: {
	// 			username: 'WCCapitalITApi',
	// 			password: '102603039504'
	// 		}
	// 	},
	// 	WS_FI: {
	// 		url: 'https://erpenjambreapi.azurewebsites.net/WS_FI/api',
	// 		basicAuthorization: {
	// 			username: 'WCCapitalFIApi',
	// 			password: '102603039504'
	// 		}
	// 	},
	// 	WS_HR: {
	// 		url: 'https://erpenjambreapi.azurewebsites.net/WS_HR/api',
	// 		basicAuthorization: {
	// 			username: 'WCCapitalHRApi',
	// 			password: '102603039504'
	// 		}
	// 	},
	// 	SalesApi: {
	// 		url: 'https://centralcobijaapi.azurewebsites.net/SalesApi/api',
	// 		basicAuthorization: {
	// 			username: 'WCCapitalSLApi',
	// 			password: '102603039504'
	// 		}
	// 	},
	// 	WS_LG: {
	// 		url: 'https://erpenjambreapi.azurewebsites.net/WS_LG/api',
	// 		basicAuthorization: {
	// 			username: 'WCCapitalSLApi',
	// 			password: '102603039504'
	// 		}
	// 	},
	// },

	firebaseConfig: {
		// apiKey: "AIzaSyDx2Iby23iHgXapR1BqYzgwgomNIRMIKXI",
		// authDomain: "enjambre-7043d.firebaseapp.com",
		// projectId: "enjambre-7043d",
		// storageBucket: "enjambre-7043d.appspot.com",
		// messagingSenderId: "72632594027",
		// appId: "1:72632594027:web:796e8d362ab9dfc499cb2e",
		// measurementId: "G-VTJVWVVC60"

		// apiKey: "AIzaSyCj0SNGF3dxxt7MnWskEDJdk0prXj1YKWs",
		// authDomain: "vendesk-app.firebaseapp.com",
		// projectId: "vendesk-app",
		// storageBucket: "vendesk-app.appspot.com",
		// messagingSenderId: "736492400264",
		// appId: "1:736492400264:web:a925660d37531e77ccf93d",
		// measurementId: "G-JFHVNL3MNK"

		apiKey: "AIzaSyDNn_QaF7RLFY98pcfjptQg-UOH2mK9sOk",
		authDomain: "gextiona-5b65b.firebaseapp.com",
		projectId: "gextiona-5b65b",
		storageBucket: "gextiona-5b65b.appspot.com",
		messagingSenderId: "748954548644",
		appId: "1:748954548644:web:11424d442c7df01e832931",
		measurementId: "G-M95F5GQE8K"
	}
};



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
