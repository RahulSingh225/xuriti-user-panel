import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { BankAccount } from "src/app/shared/interfaces/results/bankaccount.interface";
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

  fetchCompanyByUserid(userid: string) {
    return this.http.get(this.BaseUrl + `/entity/entities/${userid}`);
  }

  // checkCompaniesAccess
  checkCompaniesAccess(companyid: string, userid: any) {
    return this.http.get(this.BaseUrl + `entity/${companyid}/user/${userid}`);
  }

  evaluateCompany(data: any) {
    console.log("making api request");
    return this.http.post(this.BaseUrl + "/entity/evaluate", data);
  }

  // User management service

  getUserByUserid(userid: string, companyid: string) {
    // <===== Not req now
    return this.http.get(
      this.BaseUrl + `user/getuser/${userid}/company/${companyid}`
    );
  }

  getUsersByCompanyId(companyid: string) {
    return this.http.get(this.BaseUrl + `user/user/${companyid}`);
  }

  resendInvite(data: any) {
    return this.http.post(
      this.BaseUrl + `user/adduser/${data.companyid}`,
      data
    );
  }

  addUser(companyid: string, userData: any) {
    return this.http.post(this.BaseUrl + `user/adduser/${companyid}`, userData);
  }

  editUser(userid: string, companyid: string, userData: any) {
    return this.http.put(
      this.BaseUrl + `/user/user/${userid}/company/${companyid}`,
      userData
    );
  }

  deleteUser(userid: string, companyid: string) {
    return this.http.delete(
      this.BaseUrl + `user/user/${userid}/company/${companyid}`
    );
  }

  // Bank management services

  deleteBankAccount(id: string) {
    return this.http.delete(this.BaseUrl + `payment/bankaccount/${id}`);
  }

  defaultBankAccount(companyid: string, id: string) {
    return this.http.patch(
      this.BaseUrl + `payment/bankaccount/${companyid}/${id}`,
      ""
    );
  }

  fetchBankAccountsByCompanyId(companyid: string) {
    return this.http.get<BankAccount>(
      this.BaseUrl + `payment/bankaccount/${companyid}`
    );
  }

  addBankAccount(companyid: string, accountData: any) {
    return this.http.post(
      this.BaseUrl + `payment/bankaccount/${companyid}`,
      accountData
    );
  }
}
