import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../../services/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const authDetails = this.authService.getAuthStatus();

    if (authDetails) {
      this.router.navigate(["/home"]);
    }

    return !authDetails;
  }
}
