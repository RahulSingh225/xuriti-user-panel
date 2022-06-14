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

  validateUser(uid: string, type: string) {
    return this.http.get(
      this.BaseUrl + `invoice/whatsapp?token=${uid}&type=${type}`
    );
  }

  getInvoicesByCompanyId(uid: string, status: string) {
    return this.http.get(
      this.BaseUrl + `invoice/invoices/whatsapp?status=${status}&token=${uid}`
    );
  }

  calculatedInterest(companyid: string, invoiceData: any) {
    return this.http.post(
      this.BaseUrl +
        `invoice/interest?buyer=${companyid}&token=${invoiceData.uid}`,
      invoiceData
    );
  }

  changeInvoiceStatus(uid: string, invoiceStatus: any) {
    return this.http.patch(
      this.BaseUrl + `invoice/whatsapp/status?token=${uid}`,
      invoiceStatus
    );
  }

  paynow(uid: string, paymentDetails: any) {
    return this.http.post(
      this.BaseUrl + `payment/send-payment`,
      paymentDetails
    );
  }

  invoicePaymentstatus(token: any) {
    return this.http.post(this.BaseUrl + `payment/webhooks`, token);
  }
}
