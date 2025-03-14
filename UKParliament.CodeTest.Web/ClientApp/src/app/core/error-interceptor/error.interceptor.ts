import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { GlobalToastService } from '../../services/global-toast.service';
import { catchError, throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(GlobalToastService); // Use inject to get the service

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = "An unexpected error occurred. Please try again later.";
     if (error.status === 404) {
        errorMessage = "The resource you are looking for could not be found.";
      } else if (error.status === 500) {
       errorMessage = "The server is currently unavailable. Please try again later."
      }
      toastService.showToast(errorMessage, 'Error', 2000, 'error');
      return throwError(() => error);
    })
  );
};
