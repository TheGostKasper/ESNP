import { Component, OnInit } from '@angular/core';

declare const $: any;

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: 'section', title: 'المحاور', icon: 'graphic_eq', class: '' },
  { path: 'solider', title: 'الجنود', icon: 'assignment_ind', class: '' },
  { path: 'rank', title: 'الخدمات', icon: 'store', class: '' },
  { path: 'soliderTypes', title: 'الرتب', icon: 'weekend', class: '' },
  { path: 'vacation', title: 'الاجازات', icon: 'weekend', class: '' },
  { path: 'salary', title: 'المرتبات', icon: 'attach_money', class: '' },
  { path: 'request', title: 'طلبات أخري', icon: 'weekend', class: 'active-pro' },
  { path: 'attendance', title: 'الحضور', icon: 'weekend', class: 'active-pro' },
  // { path: 'search', title: 'بحث', icon: 'search', class: 'fa fa-search' },
  { path: 'distribute', title: 'توزيع الخدمات', icon: 'search', class: 'fa fa-search' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  current_user = {}
  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.current_user = JSON.parse(localStorage.getItem('current_user'));
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('current_user');
    window.location.href = '';
  }
  isMobileMenu() {

    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };
}
