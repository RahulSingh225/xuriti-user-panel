import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Observable, of } from "rxjs";
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

  getInvoicesByCompanyId(body: any) {
    return this.http.get(
      this.BaseUrl + `invoice/search-invoice/${body.id}/${body.type}`
    );
  }

  changeInvoiceStatus(invoiceStatus: any) {
    return this.http.patch(this.BaseUrl + `invoice/status`, invoiceStatus);
  }

  companynameAutoSuggestion(): Observable<any> {
    return this.http.get<any>(
      this.BaseUrl+`entity/entities?companyName=`
    );
  }

  suggestionresult(id: string): Observable<any> {
    return this.http.get<any>(this.BaseUrl + `invoice?seller=${id}`);
  }
}
