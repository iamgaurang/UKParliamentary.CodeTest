import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { ToastComponent } from './toast.component';
import {Subject} from "rxjs";
import {ToastMessage} from "../../models/toast-message";
import {GlobalToastService} from "../../services/global-toast.service";
import {By} from "@angular/platform-browser";

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let mockGlobalToastService: jasmine.SpyObj<GlobalToastService>;
  let toastSubject: Subject<ToastMessage>;

  beforeEach(async () => {
    toastSubject = new Subject<ToastMessage>();
    mockGlobalToastService = jasmine.createSpyObj('GlobalToastService', ['getToast$']);
    mockGlobalToastService.getToast$.and.returnValue(toastSubject.asObservable());

    await TestBed.configureTestingModule({
      imports: [ToastComponent],
      providers: [{ provide: GlobalToastService, useValue: mockGlobalToastService }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should subscribe to toast messages and add them to the toasts array', () => {
    const toast: ToastMessage = {
      message: 'Test Toast Message',
      title: 'Test Title',
      type: 'success',
    };

    toastSubject.next(toast);

    fixture.detectChanges();

    expect(component.toasts.length).toBe(1);
    expect(component.toasts[0]).toEqual(toast);

    const toastElement = fixture.debugElement.query(By.css('.toast.success'));
    expect(toastElement).toBeTruthy();
    expect(toastElement.nativeElement.querySelector('.toast-body').textContent.trim()).toBe(toast.message);
  });

  it('should remove the toast after the specified delay', fakeAsync(() => {
    const toast: ToastMessage = {
      message: 'Auto-dismiss Toast',
      title: 'Dismiss Test',
      type: 'info',
    };

    toastSubject.next(toast);

    fixture.detectChanges();

    expect(component.toasts.length).toBe(1);

    tick(5000);

    fixture.detectChanges();

    expect(component.toasts.length).toBe(0);
  }));

  it('should remove a toast when the removeToast method is called', () => {
    const toast: ToastMessage = {
      message: 'Manual Remove Toast',
      title: 'Manual Test',
      type: 'warning',
    };

    component.toasts.push(toast);

    component.removeToast(toast);

    expect(component.toasts.length).toBe(0);
  });
});
