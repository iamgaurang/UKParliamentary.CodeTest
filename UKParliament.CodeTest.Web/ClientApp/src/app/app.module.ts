import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {provideHttpClient, withInterceptors, withInterceptorsFromDi} from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ErrorInterceptor} from "./core/error-interceptor/error.interceptor";
import {ToastComponent} from "./core/toast/toast.component";

@NgModule({ declarations: [
        AppComponent,
    ],
    bootstrap: [AppComponent],
    imports: [
      BrowserModule.withServerTransition({appId: 'ng-cli-universal'}),
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot([
      {path: '', redirectTo: 'person-list', pathMatch: 'full'},
      {
        path: 'person-list',
        loadComponent: () => import('./components/person-list/person-list.component').then(m => m.PersonListComponent)
      },
      {
        path: 'home',
        loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'person-edit/:id',
        loadComponent: () => import('./components/person-edit/person-edit.component').then(m => m.PersonEditComponent),
        data: {allowNumbersOnly: true}
      },
      {path: '**', redirectTo: ''}
    ]), ToastComponent], providers: [
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClient(withInterceptors([ErrorInterceptor])),
  ] })
export class AppModule { }
