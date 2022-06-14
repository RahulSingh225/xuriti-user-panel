import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../services/api/api.service";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { MatPaginator } from "@angular/material/paginator";
import { LOCAL_STORAGE_AUTH_DETAILS_KEY } from "src/app/shared/constants/constants";
import { MatSnackBar } from "@angular/material/snack-bar";
@Component({
  selector: "app-companylist",
  templateUrl: "./companylist.component.html",
  styleUrls: ["./companylist.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class CompanylistComponent implements OnInit {
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  companyDetails: any = [];

  redirect!: string;

  private token!: string;

  userid!: string;

  durationInSeconds = 2;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["redirect"]) {
        this.redirect = queryParams["redirect"];
      }
    });
    const detailsStr = localStorage.getItem(LOCAL_STORAGE_AUTH_DETAILS_KEY);
    if (detailsStr) {
      const details = JSON.parse(detailsStr);
      const userDetails = details.user;
      this.userid = userDetails._id;
    }
    this.fetchCompanyByUserid();
  }

  fetchCompanyByUserid() {
    this.apiService.fetchCompanyByUserid(this.userid).subscribe((res: any) => {
      if (res.status == true) {
        const companies: any = res.company;
        this.companyDetails = companies;
      }
    });
  }

  selectCompany(company: any) {
    this.apiService.checkCompaniesAccess(company._id,this.userid).subscribe((resp: any) => {      
        if (resp.status == true && resp.company.company.status == 'Approved') {
        localStorage.setItem("Role",resp.company.userRole);
        localStorage.setItem("companyid", resp.company.company._id);
        // localStorage.setItem("companyid", company._id);
        this.router.navigate([`/companies/${company._id}/invoices/sales`]);
      } else {
        localStorage.setItem("companyid", '');
        this.snackBar.open(
          `You are not allowed to perform any operation, ${company.companyName} status is ${company.status}. Please contact to Xuriti team`,
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
      }
    });
  }
}
