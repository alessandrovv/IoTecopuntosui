import { ConfigModel } from '../interfaces/config';
// tslint:disable-next-line:no-shadowed-variable


// tslint:disable-next-line:no-shadowed-variable
export class MenuConfig implements ConfigModel {
	public config: any = {};

	constructor() {
		this.config = {
			header: {
				self: {},
				items: [
					{
						title: 'Actions',
						root: true,
						icon: 'flaticon-add',
						toggle: 'click',
						translate: 'MENU.ACTIONS',
						submenu: {
							type: 'classic',
							alignment: 'left',
							items: [
								{
									title: 'Create New Post',
									page: '/header/actions',
									icon: 'flaticon-file',
									translate: 'MENU.CREATE_POST',
									aside: {
										self: {
											bullet: 'dot'
										},
										items: [
											{
												section: 'Departments'
											},
											{
												title: 'Resources',
												desc: '',
												icon: 'flaticon-layers',
												bullet: 'dot',
												root: true,
												submenu: [
													{
														title: 'Create New Post',
														page: '/header/actions',
													},
													{
														title: 'Timesheet',
														tooltip: 'Non functional dummy link',
													},
													{
														title: 'Payroll',
														tooltip: 'Non functional dummy link',
													},
													{
														title: 'Contacts',
														tooltip: 'Non functional dummy link',
													}
												]
											}
										]
									}
								},
								{
									title: 'Generate Reports',
									tooltip: 'Non functional dummy link',
									icon: 'flaticon-diagram',
									badge: {
										type: 'm-badge--success',
										value: '2'
									},
								},
								{
									title: 'Manage Orders',
									icon: 'flaticon-business',
									submenu: {
										type: 'classic',
										alignment: 'right',
										bullet: 'line',
										items: [
											{
												title: 'Latest Orders',
												tooltip: 'Non functional dummy link',
												icon: '',
											},
											{
												title: 'Pending Orders',
												tooltip: 'Non functional dummy link',
												icon: '',
											},
											{
												title: 'Processed Orders',
												tooltip: 'Non functional dummy link',
												icon: '',
											},
											{
												title: 'Delivery Reports',
												tooltip: 'Non functional dummy link',
												icon: '',
											},
											{
												title: 'Payments',
												tooltip: 'Non functional dummy link',
												icon: '',
											},
											{
												title: 'Customers',
												tooltip: 'Non functional dummy link',
												icon: '',
											}
										]
									}
								},
								{
									title: 'Customer Feedbacks',
									page: '/#',
									icon: 'flaticon-chat-1',
									submenu: {
										type: 'classic',
										alignment: 'right',
										bullet: 'dot',
										items: [
											{
												title: 'Customer Feedbacks',
												tooltip: 'Non functional dummy link',
												icon: '',
											},
											{
												title: 'Supplier Feedbacks',
												tooltip: 'Non functional dummy link',
												icon: '',
											},
											{
												title: 'Reviewed Feedbacks',
												tooltip: 'Non functional dummy link',
												icon: '',
											},
											{
												title: 'Resolved Feedbacks',
												tooltip: 'Non functional dummy link',
												icon: '',
											},
											{
												title: 'Feedback Reports',
												tooltip: 'Non functional dummy link',
												icon: '',
											}
										]
									}
								},
								{
									title: 'Register Member',
									tooltip: 'Non functional dummy link',
									icon: 'flaticon-users',
								}
							]
						}
					},
					{
						title: 'Reports',
						root: true,
						icon: 'flaticon-line-graph',
						toggle: 'click',
						translate: 'MENU.REPORTS',
						submenu: {
							type: 'mega',
							width: '1000px',
							alignment: 'left',
							columns: [
								{
									heading: {
										heading: true,
										title: 'Finance Reports',
									},
									items: [
										{
											title: 'Annual Reports',
											tooltip: 'Non functional dummy link',
											icon: 'flaticon-map',
										},
										{
											title: 'HR Reports',
											tooltip: 'Non functional dummy link',
											icon: 'flaticon-user',
										},
										{
											title: 'IPO Reports',
											tooltip: 'Non functional dummy link',
											icon: 'flaticon-clipboard',
										},
										{
											title: 'Finance Margins',
											tooltip: 'Non functional dummy link',
											icon: 'flaticon-graphic-1',
										},
										{
											title: 'Revenue Reports',
											tooltip: 'Non functional dummy link',
											icon: 'flaticon-graphic-2',
										}
									]
								},
								{
									bullet: 'line',
									heading: {
										heading: true,
										title: 'Project Reports',
									},
									items: [
										{
											title: 'Coca Cola CRM',
											tooltip: 'Non functional dummy link',
											icon: '',
										},
										{
											title:
												'Delta Airlines Booking Site',
											tooltip: 'Non functional dummy link',
											icon: '',
										},
										{
											title: 'Malibu Accounting',
											tooltip: 'Non functional dummy link',
											icon: '',
										},
										{
											title: 'Vineseed Website Rewamp',
											tooltip: 'Non functional dummy link',
											icon: '',
										},
										{
											title: 'Zircon Mobile App',
											tooltip: 'Non functional dummy link',
											icon: '',
										},
										{
											title: 'Mercury CMS',
											tooltip: 'Non functional dummy link',
											icon: '',
										}
									]
								},
								{
									bullet: 'dot',
									heading: {
										heading: true,
										title: 'HR Reports',
									},
									items: [
										{
											title: 'Staff Directory',
											tooltip: 'Non functional dummy link',
											icon: '',
										},
										{
											title: 'Client Directory',
											tooltip: 'Non functional dummy link',
											icon: '',
										},
										{
											title: 'Salary Reports',
											tooltip: 'Non functional dummy link',
											icon: '',
										},
										{
											title: 'Staff Payslips',
											tooltip: 'Non functional dummy link',
											icon: '',
										},
										{
											title: 'Corporate Expenses',
											tooltip: 'Non functional dummy link',
											icon: '',
										},
										{
											title: 'Project Expenses',
											tooltip: 'Non functional dummy link',
											icon: '',
										}
									]
								},
								{
									heading: {
										heading: true,
										title: 'Reporting Apps',
										icon: '',
									},
									items: [
										{
											title: 'Report Adjusments',
											tooltip: 'Non functional dummy link',
											icon: '',
										},
										{
											title: 'Sources & Mediums',
											tooltip: 'Non functional dummy link',
											icon: '',
										},
										{
											title: 'Reporting Settings',
											tooltip: 'Non functional dummy link',
											icon: '',
										},
										{
											title: 'Conversions',
											tooltip: 'Non functional dummy link',
											icon: '',
										},
										{
											title: 'Report Flows',
											tooltip: 'Non functional dummy link',
											icon: '',
										},
										{
											title: 'Audit & Logs',
											tooltip: 'Non functional dummy link',
											icon: '',
										}
									]
								}
							]
						}
					},
					{
						title: 'Apps',
						root: true,
						icon: 'flaticon-paper-plane',
						toggle: 'click',
						translate: 'MENU.APPS',
						badge: {
							type: 'm-badge--brand m-badge--wide',
							value: 'new',
							translate: 'MENU.NEW',
						},
						submenu: {
							type: 'classic',
							alignment: 'left',
							items: [
								{
									title: 'eCommerce',
									tooltip: 'Non functional dummy link',
									icon: 'flaticon-business',
									submenu: {
										type: 'classic',
										alignment: 'right',
										items: [
											{
												title: 'Customers',
												page: '/ecommerce/customers',
												icon: 'flaticon-users',
											},
											{
												title: 'Orders',
												page: '/ecommerce/orders',
												icon: 'flaticon-interface-1',
											},
											{
												title: 'Products',
												page: '/ecommerce/products',
												icon: 'flaticon-list-1',
											}
										]
									}
								},
								{
									title: 'Audience',
									page: '/crud/datatable_v1',
									icon: 'flaticon-computer',
									submenu: {
										type: 'classic',
										alignment: 'right',
										items: [
											{
												title: 'Active Users',
												tooltip: 'Non functional dummy link',
												icon: 'flaticon-users',
											},
											{
												title: 'User Explorer',
												tooltip: 'Non functional dummy link',
												icon: 'flaticon-interface-1',
											},
											{
												title: 'Users Flows',
												tooltip: 'Non functional dummy link',
												icon: 'flaticon-lifebuoy',
											},
											{
												title: 'Market Segments',
												tooltip: 'Non functional dummy link',
												icon: 'flaticon-graphic-1',
											},
											{
												title: 'User Reports',
												tooltip: 'Non functional dummy link',
												icon: 'flaticon-graphic',
											}
										]
									}
								},
								{
									title: 'Marketing',
									tooltip: 'Non functional dummy link',
									icon: 'flaticon-map',
								},
								{
									title: 'Campaigns',
									tooltip: 'Non functional dummy link',
									icon: 'flaticon-graphic-2',
									badge: {
										type: 'm-badge--success',
										value: '3'
									}
								},
								{
									title: 'Cloud Manager',
									tooltip: 'Non functional dummy link',
									icon: 'flaticon-infinity',
									submenu: {
										type: 'classic',
										alignment: 'left',
										items: [
											{
												title: 'File Upload',
												tooltip: 'Non functional dummy link',
												icon: 'flaticon-add',
												badge: {
													type: 'm-badge--danger',
													value: '3'
												}
											},
											{
												title: 'File Attributes',
												tooltip: 'Non functional dummy link',
												icon: 'flaticon-signs-1',
											},
											{
												title: 'Folders',
												tooltip: 'Non functional dummy link',
												icon: 'flaticon-folder',
											},
											{
												title: 'System Settings',
												tooltip: 'Non functional dummy link',
												icon: 'flaticon-cogwheel-2',
											}
										]
									}
								}
							]
						}
					}
				]
			},
			aside: {
				self: {},
				items: [
					// ROL ETI
					{
						title: 'Dashboard',
						desc: 'Some description goes here',
						root: true,
						icon: 'flaticon-line-graph',
						page: '/',
						rol: 1,
						translate: 'MENU.DASHBOARD'
					},

					// ROL USUARIO-LEGAL
					{
						title: 'Dashboard',
						desc: 'Some description goes here',
						root: true,
						icon: 'flaticon-line-graph',
						page: '/',
						rol: 2,
						translate: 'MENU.DASHBOARD'
					},
					{
						//nivel1
						title: 'Atenciones Legales',
						root: true,
						rol: 2,
						icon: 'flaticon-layers',
						submenu: [
							{
								title: 'Configuraci??n',
								bullet: 'line',
								rol: 2,
								icon: '	flaticon-cogwheel-1',
								submenu: [
									{
										title: 'Grupo de Servicios',
										page: '/legalattention/configuration/groupservice',
										rol: 2
									},
									{
										title: 'Tipo de Servicios',
										page: '/legalattention/configuration/typeservice',
										rol: 2
									},
									{
										title: 'Servicios',
										page: '/legalattention/configuration/service',
										rol: 2
									}
								]
							},
							{
								//nivel2
								title: 'Procesos y Operaciones',
								bullet: 'line',
								//root: true,
								rol: 2,
								icon: 'flaticon-refresh',
								submenu: [
									{
										//nivel3
										title: 'Solicitud',
										bullet: 'dot',
										rol: 2,
										submenu: [
											{
												//nivel4
												title: 'Solicitud de Atenci??n',
												page: '/legalattention/proccess/request',
												rol: 2
											},
											{
												title: 'Aprobaci??n',
												page: '/legalattention/proccess/request/approve',
												rol: 2
											}
										]
									},
									{
										title: 'Atenciones',
										bullet: 'dot',
										rol: 2,
										submenu: [
											{
												title: 'Aprobaci??n',
												page: '/legalattention/proccess/attention/approve',
												rol: 2
											},
											{
												title: 'Atenci??n',
												page: '/legalattention/proccess/attention',
												rol: 2
											}
										]
									}
								]
							},
							{
								title: 'Reportes',
								bullet: 'line',
								rol: 2,
								icon: 'flaticon-graphic',
								submenu: [
									{
										title: 'Estado de Documentos',
										page: '/legalattention/reports/report1',
										rol: 2
									},
									{
										title: 'Reporte 2',
										page: '',
										rol: 2
									}
								]
							}
						]
					},
					{
						title: 'Serv. Administrativos',
						root: true,
						rol: 2,
						icon: 'flaticon-layers',
						submenu: [
							{
								title: 'Configuraci??n',
								bullet: 'line',
								rol: 2,
								icon: '	flaticon-cogwheel-1',
								submenu: []
							}, 
							{
								title: 'Procesos y Operaciones',
								bullet: 'line',
								//root: true,
								rol: 2,
								icon: 'flaticon-refresh',
								submenu: []
							},
							{
								title: 'Reportes',
								bullet: 'line',
								rol: 2,
								icon: 'flaticon-graphic',
								submenu: []
							}
						]
					},
					{
						title: 'Certificaciones',
						root: true,
						rol: 2,
						icon: 'flaticon-layers',
						submenu: [
							{
								title: 'Configuraci??n',
								bullet: 'line',
								rol: 2,
								icon: '	flaticon-cogwheel-1',
								submenu: []
							}, 
							{
								title: 'Procesos y Operaciones',
								bullet: 'line',
								//root: true,
								rol: 2,
								icon: 'flaticon-refresh',
								submenu: []
							},
							{
								title: 'Reportes',
								bullet: 'line',
								rol: 2,
								icon: 'flaticon-graphic',
								submenu: []
							}
						]
					},

					// ROL APROBADOR
					{
						title: 'Procesos',
						root: true,
						bullet: 'dot',
						rol: 3,
						icon: 'flaticon-layers',
						submenu: [
							{
								title: 'Aprobaci??n de Servicios',
								// icon: 'flaticon-layers',
								page: '/procesos/aprobacionServicios',
								rol: 3
							}
						]
					},
					{
						title: 'Reportes',
						root: true,
						bullet: 'dot',
						rol: 3,
						icon: 'flaticon-line-graph',
						submenu: [
							{
								title: 'Hist. de Aprobaciones',
								// icon: 'flaticon-layers',
								page: '/ngbootstrap/accordion',
								rol: 3
							}
						]
					}
				]
			}
		};
	}
}
