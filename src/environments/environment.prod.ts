export const environment = {
	production: true,
	appVersion: 'v726demo1',
	USERDATA_KEY: 'authf649fc9a5f55',
	isMockEnabled: true,
	apiUrl: 'api',
	timeToRefreshToken: 8000,
	// apiUrl: 'mysite.com/api'
	timeToIdle: 30000, // cantidad de milisegundos para que el sistema reconozca a un usuario como inactivo
	timeToLogOut: 5000, // cantidad de milisegundos para cerrar la sesion del usuario una vez notificado


	jwt: {
		audience: 'DefaultAudience',
		issuer: 'DefaultIssuer'
	},

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
			url: 'https://localhost:44395/api',
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
	// 		  username: 'GextionaLogisticApi',
	// 		  password: '102603039504'
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

		// apiKey: "AIzaSyC_v_VUKZf9aNR789fnsWe0hsvjBtFpU20",
		// authDomain: "enjambre-bd236.firebaseapp.com",
		// projectId: "enjambre-bd236",
		// storageBucket: "enjambre-bd236.appspot.com",
		// messagingSenderId: "100883396275",
		// appId: "1:100883396275:web:6a09ae4869f4ee1d9ca2c6",
		// measurementId: "G-7BQ84WJQXP"
		
		apiKey: "AIzaSyDNn_QaF7RLFY98pcfjptQg-UOH2mK9sOk",
		authDomain: "gextiona-5b65b.firebaseapp.com",
		projectId: "gextiona-5b65b",
		storageBucket: "gextiona-5b65b.appspot.com",
		messagingSenderId: "748954548644",
		appId: "1:748954548644:web:11424d442c7df01e832931",
		measurementId: "G-M95F5GQE8K"
	}
};
