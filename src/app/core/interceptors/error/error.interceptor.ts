import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { AuthService } from "../../services/auth/auth.service";
import { Router } from "@angular/router";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.error.code) {
          case 401: {
            this.authService.setAuthStatus(null);

            this.router.navigate(["/auth/login"]);
            break;
          }
          case 403: {
            this.router.navigate(["/forbidden"]);
            break;
          }
          case 500: {
            this.router.navigate(["/error"]);
            break;
          }
          default: {
            break;
          }
        }

        return throwError(error);
      })
    );
  }
}
