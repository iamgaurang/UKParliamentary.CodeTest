import { TestBed } from '@angular/core/testing';

import { GlobalToastService } from './global-toast.service';
import {ToastMessage} from "../models/toast-message";

describe('GlobalToastService', () => {
  let service: GlobalToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an observable for toast messages from getToast$', (done) => {
    const testToast: ToastMessage = {
      message: 'Test Message',
      title: 'Test Title',
      delay: 5000,
      type: 'success',
    };

    service.getToast$().subscribe((toast) => {
      expect(toast).toEqual(testToast);
      done();
    });

    service.showToast(testToast.message, testToast.title, testToast.delay, testToast.type);
  });

  it('should push a new toast into the subject when showToast is called', () => {
    const testToast: ToastMessage = {
      message: 'New Toast Message',
      title: 'New Toast Title',
      delay: 3000,
      type: 'info',
    };

    const spy = spyOn((service as any).toastSubject, 'next').and.callThrough();

    service.showToast(testToast.message, testToast.title, testToast.delay, testToast.type);

    expect(spy).toHaveBeenCalledWith(testToast);
  });
});
