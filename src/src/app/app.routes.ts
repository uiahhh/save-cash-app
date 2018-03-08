import { Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { WalletsComponent } from './components/wallets/wallets.component';

export const demoAppRoutes: Routes = [ 
  { path: 'wallets', component: WalletsComponent },  
  { path: 'categories', component: CategoriesComponent },  
  { path: 'expenses/:collection/:categoryType', component: ExpensesComponent },
  { path: 'dashboard/:categoryType', component: DashboardComponent, pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard/month' }
];