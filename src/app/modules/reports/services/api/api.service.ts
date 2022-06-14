import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  BaseUrl = environment.baseUrl;
  private token!: string;

  response: any;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  getPurchaseLedgerReport(companyid: string) {
    return this.http.get(this.BaseUrl + `ledger/${companyid}/buyer`);
  }

  getTransactionStatement(companyid: string) {
    return this.http.get(this.BaseUrl + `ledger/${companyid}/buyer`);
  }
}
