import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleguardGuard implements CanActivate {
  durationInSeconds = 2;
  constructor(public snackBar: MatSnackBar,){
  }
  canActivate(){
    let Role = localStorage.getItem("Role");
    if (Role == 'Admin') {
       return true;
    }
    this.snackBar.open("You are not allowed to accsess this page.", "Close", {
      duration: this.durationInSeconds * 3000,
      panelClass: ["error-dialog"],
    });
    return false;
  }
  
}
