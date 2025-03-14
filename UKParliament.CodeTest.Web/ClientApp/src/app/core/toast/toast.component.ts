import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ToastMessage} from "../../models/toast-message";
import {GlobalToastService} from "../../services/global-toast.service";
import {CommonModule, NgClass} from "@angular/common";

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [
    NgClass,
    CommonModule
  ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ToastComponent {
  toasts: ToastMessage[] = [];

  constructor(private toastService: GlobalToastService) {
    this.toastService.getToast$().subscribe((toast) => {
      debugger
      this.toasts.push(toast);
      setTimeout(() => this.removeToast(toast), 5000);
    });
  }

  removeToast(toast: ToastMessage) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }
}
