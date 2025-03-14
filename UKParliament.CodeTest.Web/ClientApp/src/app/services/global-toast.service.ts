import { Injectable } from '@angular/core';
import {ToastMessage} from "../models/toast-message";
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GlobalToastService {
  private toastSubject = new Subject<ToastMessage>();

  getToast$(): Observable<ToastMessage> {
    return this.toastSubject.asObservable();
  }

  showToast(
    message: string,
    title: string = 'Notification',
    delay: number = 5000,
    type: 'success' | 'error' | 'info' | 'warning' = 'info'
  ): void {
    const toast: ToastMessage = { message, title, delay, type };
    this.toastSubject.next(toast);
  }
}
