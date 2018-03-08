import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { demoAppRoutes } from './app.routes';

import { ToolbarComponent } from './navigation/toolbar/toolbar.component';
import { FooterComponent } from './navigation/footer/footer.component';

import { SelectControl } from './shared/controls/select/select.control';
import { CrudComponent } from './shared/crud/crud.component';
import { CardItemDirective } from './shared/crud/card-item.directive';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { WalletsComponent } from './components/wallets/wallets.component';
import { AngularFireDatabase } from 'angularfire2/database';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    FooterComponent,
    SelectControl,
    CrudComponent,
    CardItemDirective,
    DashboardComponent,
    ExpensesComponent,
    CategoriesComponent,
    WalletsComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    RouterModule.forRoot(demoAppRoutes, { useHash: true, enableTracing: false }),
  ],
  providers: [AngularFireDatabase],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
