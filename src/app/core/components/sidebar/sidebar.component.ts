import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { LOCAL_STORAGE_AUTH_DETAILS_KEY } from "src/app/shared/constants/constants";
import { animateText, onSideNavChange } from "../../animations/animations";
import { SidenavService } from "../../services/sidenav/sidenav.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
  animations: [onSideNavChange, animateText],
})
export class SidebarComponent implements OnInit {
  @Input() routes: {
    title: string;
    path: string;
    icon: string;
  }[] = [];

  username: string = "";

  dashboard: string = "";

  companyName: string = "Switch Company";

  companyid: any;

  accessFlag!: boolean;

  activeflag!: boolean;

  sideNavState = false;

  linkText = false;

  constructor(
    private _sidenavService: SidenavService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // ================= For the access flag ==============================
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const routePath = this.router.url.split("?")[0];
        this.accessFlag =
          routePath === "/companies" ||
          routePath === "/register/entity" ||
          routePath === "/home";
      }
      if (!this.accessFlag) {
        this.getLoggedInUser();
      }
    });
  }

  getLoggedInUser() {
    const detailsStr = localStorage.getItem(LOCAL_STORAGE_AUTH_DETAILS_KEY);
    if (detailsStr) {
      const details = JSON.parse(detailsStr);
      const userDetails = details.user;
      if (userDetails.first_name && userDetails.last_name) {
        this.username = userDetails.first_name + " " + userDetails.last_name;
      }
    }
  }

  onSinenavToggle() {
    this.getCompanyid();
    this.sideNavState = !this.sideNavState;
    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200);
    this._sidenavService.sideNavState$.next(this.sideNavState);
  }

  openCompaniesPage() {
    this.router.navigate([`/companies/`]);
  }

  getCompanyid() {
    this.companyid = localStorage.getItem("companyid");
  }

  openBankAccountPage() {
    this.getCompanyid();
    if (
      this.companyid &&
      this.companyid != undefined &&
      this.companyid != null
    ) {
      this.router.navigate([`/companies/${this.companyid}/bankaccount`]);
    }
  }

  openInvoicePage(mode: string) {
    this.getCompanyid();
    if (
      this.companyid &&
      this.companyid != undefined &&
      this.companyid != null
    ) {
      if (mode == "sales") {
        this.router.navigate([`/companies/${this.companyid}/invoices/sales`]);
      } else {
        this.router.navigate([
          `/companies/${this.companyid}/invoices/purchases`,
        ]);
      }
    }
  }

  openTransactionPage() {
    this.getCompanyid();
    this.router.navigate([`/companies/${this.companyid}/transactions`]);
  }
  openCreditPage() {
    this.getCompanyid();
    this.router.navigate([`/companies/${this.companyid}/credit`]);
  }

  openLedgerPage() {
    this.router.navigate([
      `/companies/${this.companyid}/reports/purchaseledger`,
    ]);
  }

  openTransactionalStatement() {
    this.router.navigate([
      `/companies/${this.companyid}/reports/transactionalstatement`,
    ]);
  }

  openUserPage() {
    this.companyid = localStorage.getItem("companyid");
    if (this.companyid != undefined && this.companyid != null) {
      this.router.navigate([`/companies/${this.companyid}/users`]);
    }
  }
}
