import { HttpClient, HttpHeaders } from "@angular/common/http";
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

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  getCompanyDetailsByGST(gst_data: any) {
    // const body = {
    //   gstin: gstin,
    // };
    return this.http.post(this.BaseUrl + "entity/search-gst", gst_data);
  }

  saveCompanyDetails(id: string, company_details: any) {
    return this.http.post(this.BaseUrl + `entity/add-entity`, company_details);
  }

  generateCaptcha() {
    return this.http.get(
      `https://services.gst.gov.in/services/captcha?rnd=0.0000001`
    );
  }
}
