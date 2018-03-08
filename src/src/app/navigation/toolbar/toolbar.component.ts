import { Component, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';

import * as $ from 'jquery';
import { AngularFireAuth } from 'angularfire2/auth';

import { SharedData } from '../../shared/shared-data';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ToolbarComponent {

  version = SharedData.version;

  @ViewChild('menuicon') menuicon: ElementRef;

  navLinks = [
    { name: 'Dashboard', route: 'dashboard/month', icon: 'assessment' },  
    { name: 'Dashboard Anual', route: 'dashboard/year', icon: 'assessment' },  
    { name: 'Gastos Anuais', route: 'expenses/expenses/year', icon: 'remove_circle' },  
    { name: 'Gastos Mensais', route: 'expenses/expenses/month', icon: 'remove_circle' },  
    { name: 'Gastos', route: 'expenses/expenses/day', icon: 'remove_circle' }, 
    { name: 'Receitas Anuais', route: 'expenses/incomes/year', icon: 'add_circle' }, 
    { name: 'Receitas Mensais', route: 'expenses/incomes/month', icon: 'add_circle' }, 
    { name: 'Receitas', route: 'expenses/incomes/day', icon: 'add_circle' }, 
    { name: 'Categorias', route: 'categories', icon: 'book' },  
    { name: 'Carteiras', route: 'wallets', icon: 'style' }, 
  ];

  sideNaveConfig = { 
    menuWidth: 250,
    closeOnClick: true,
    draggable: true, 
  }

  get userName() { return SharedData.userLogged.displayName };
  get userEmail() { return SharedData.userLogged.email };
  get userPhotoUrl() { return SharedData.userLogged.photoURL };

  constructor(public afAuth: AngularFireAuth) {
  }

  ngAfterViewInit() {     
    
    let elementJquery: any = jQuery(this.menuicon.nativeElement);
    elementJquery.sideNav(this.sideNaveConfig);
  } 

  logout() {
    localStorage.removeItem('user');
    this.afAuth.auth.signOut();
  }
}