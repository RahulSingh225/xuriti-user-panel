import { Injectable, Injector } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "../../services/auth/auth.service";
import { environment } from "src/environments/environment";

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService // private injector: Injector
  ) {}
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let _token = this.authService.getToken();
    let token = request.clone({
      setHeaders: {
        authorization: `Bearer ${_token}`,
      },
    });
    return next.handle(token);
  }
}
