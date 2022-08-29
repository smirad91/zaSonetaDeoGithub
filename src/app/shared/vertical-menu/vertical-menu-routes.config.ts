import { RouteInfo } from './vertical-menu.metadata';

//Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [
  {
    path: '', title: 'Performance metric', icon: 'ft-settings', class: 'has-sub', badge: '', badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1', isExternalLink: false, submenu: [
      { path: '/page/machines', title: 'Machines', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/page/actions', title: 'Actions', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
     { path: '/page/envs', title: 'Environments', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] }
    ]
  },
  {
    path: '', title: 'Results', icon: 'ft-bar-chart-2', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
        { path: '/page/executions', title: 'All Executions', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
        { path: '/page/action-statistic/compareActions', title: 'Compare Multiple \r\n Actions', icon: 'ft-arrow-right submenu-icon', class: 'zaspace', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
        { path: '/page/action-statistic/actionStatistic', title: 'Analyse Single Action', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []},
    ]
},

{ path: '/page/team', title: 'Team', icon: 'ft-users', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] }
];
