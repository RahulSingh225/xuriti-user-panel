import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
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

  calculatedInterest(companyid: string, invoiceData: any) {
    return this.http.post(
      this.BaseUrl + `invoice/interest?buyer=${companyid}`,
      invoiceData
    );
  }

  calculateDiscount(companyid: string, invoiceid: string) {
    return this.http.get(
      this.BaseUrl + `entity/${companyid}/invoices/${invoiceid}/discounts`
    );
  }

  paynow(paymentDetails: any) {
    return this.http.post(
      this.BaseUrl + "payment/send-payment",
      paymentDetails
    );
  }

  paylater(exd_data: any) {
    return this.http.post(this.BaseUrl + "payment/extendcredit", exd_data);
  }

  fetchPaymentHistory(companyid: string) {
    //paynow case
    return this.http.get(
      this.BaseUrl + `payment/transctonshistory?buyer=${companyid}`
    );
  }

  fetchEmandateHistory(companyid: string) {
    return this.http.get(
      this.BaseUrl + `payment/payhistory?buyer_id=${companyid}`
    );
  }

  fetchPaymentHistoryByInvoiceNumber(invoice: string) {
    return this.http.get<any>(
      this.BaseUrl + `payment?invoiceNumber=${invoice}`
    );
  }

  fetchpaymentByInvoiceDate(invoicedate: any): Observable<any> {
    return this.http.get<any>(
      this.BaseUrl + `payment?invoiceDate=${invoicedate}`
    );
  }
}
