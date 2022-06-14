import {
  AfterViewInit,
  Input,
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { UserResFull } from "src/app/shared/interfaces/results/user.interface";
import { onMainContentChange } from "../../animations/animations";
import { AuthService } from "../../services/auth/auth.service";
import { SidenavService } from "../../services/sidenav/sidenav.service";
import { ApiService as AuthApiService } from "src/app/modules/auth/services/api/api.service";
import { NavigationEnd, Router } from "@angular/router";
import {
  CURRENCY_FORMAT,
  LOCAL_STORAGE_AUTH_DETAILS_KEY,
} from "src/app/shared/constants/constants";
@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"],
  animations: [onMainContentChange],
})
export class LayoutComponent implements OnInit, AfterViewInit {
  @ViewChild("leftSidenav") leftSidenav!: MatSidenav;
  toggleMenu() {
    this.sidenav.toggle();
  }

  authenticated = false;
  @Input() sidenav!: MatSidenav;

  authorized = false;

  accessFlag = false;

  isLogin!: boolean;

  companySelectedflag = false;

  companyid : any;

  companyName: string = "";

  companyDetails: any;

  token!: string;

  userid!: string;

  currency_format = CURRENCY_FORMAT;

  auth!: UserResFull | null;

  routes: {
    title: string;
    path: string;
    icon: string;
  }[] = [];

  public onSideNavChange!: boolean;

  constructor(
    private router: Router,
    private authService: AuthService,
    private _sidenavService: SidenavService,
    private apiService: AuthApiService
  ) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const routePath = this.router.url.split("?")[0];
        this.accessFlag =
          routePath === "/companies" ||
          routePath === "/register/entity" ||
          routePath === "/home" ||
          routePath === "**";
        if (!this.accessFlag) {
          this.getCompanyByCompanyid();
        } else {
          this.companyName = "";
        }
      }
    });

    setTimeout(() => {
      this.authService.getAuthStatusObservable().subscribe((details) => {
        this.authenticated = !!details;
        this.authorized = this.authenticated;
        this.auth = details;
      });
    }, 3000);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const routePath = this.router.url.split("?")[0];
        this.isLogin = routePath === "/auth/login";
      }
    });
    this._sidenavService.sideNavState$.subscribe((res) => {
      this.onSideNavChange = res;
    });
    this.getLoggedInUser();
  }

  ngAfterViewInit() {}

  logout() {
    this.getLoggedInUser();
    this.apiService.logout(this.userid).subscribe(() => {
      localStorage.setItem('companyid', '');
      this.authService.setAuthStatus(null);
      this.router.navigate(["/auth/login"]);
    });
  }

  getLoggedInUser() {
    const detailsStr = localStorage.getItem(LOCAL_STORAGE_AUTH_DETAILS_KEY);
    if (detailsStr) {
      const details = JSON.parse(detailsStr);
      const userDetails = details.user;
      this.userid = userDetails._id;
    }
  }

  getCompanyByCompanyid() {
    this.companyid = localStorage.getItem("companyid");
    if (
      this.companyid &&
      this.companyid != undefined &&
      this.companyid != null
    ) {
      this.companySelectedflag = true;
      this._sidenavService
        .getCompanyByCompanyid(this.companyid)
        .subscribe((resp: any) => {
          if (resp.company && resp.company.company_name != undefined) {
            this.companyName = resp.company.company_name;
            this.companyDetails = resp.company;
          }
        });
    }
  }
}
