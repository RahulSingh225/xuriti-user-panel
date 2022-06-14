import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { ApiService } from "../../services/api/api.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  SocialAuthService,
  SocialUser,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
} from "angularx-social-login";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  verifyToken!: string;

  redirect!: string;

  form!: FormGroup;

  private token!: string;

  private email: string = "";

  private password: string = "";

  private userid!: string;

  private userRole!: string;

  private gid: string = "";

  userData: any;

  loginEmailerror = false;

  loginPwderror = false;

  pwdVisible = false;

  durationInSeconds = 2;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private socialAuthService: SocialAuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["i"]) {
        this.verifyToken = queryParams["i"];
        this.userEmailVerify();
      }
    });

    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["redirect"]) {
        this.redirect = queryParams["redirect"];
      }
    });

    this.form = this.fb.group({
      email: ["", [Validators.pattern, Validators.required]],
      password: ["", [Validators.pattern, Validators.required]],
    });
  }

  userEmailVerify() {
    this.apiService.userEmailVerify(this.verifyToken).subscribe((resp: any) => {
      if (resp.status == true) {
        this.snackBar.open(
          "Your email id is succussfully verified, you can login now",
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
      } else {
        this.snackBar.open(
          "An error occurred, Please try again or contact to xuriti support team",
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.email = this.form.value.email;
      this.password = this.form.value.password;

      this.apiService
        .loginUser(this.email, this.password)
        .subscribe((response: any) => {
          if (response.status == true) {
            this.userid = response.user._id;
            this.userRole = response.user.user_role;
            if (
              this.userRole == "xuritiAdmin" ||
              this.userRole == "XuritiStaff"
            ) {
              this.snackBar.open(
                "You are not allowed to access this panel",
                "Close",
                {
                  duration: this.durationInSeconds * 3000,
                  panelClass: ["error-dialog"],
                }
              );
            } else {
              if (this.redirect) {
                localStorage.setItem("email", response.user.email);
                localStorage.setItem("name", response.user.name);
                this.authService.setAuthStatus(response);
                this.router.navigate([this.redirect]);
              } else if (this.userid != undefined) {
                localStorage.setItem("email", response.user.email);
                localStorage.setItem("name", response.user.name);
                this.authService.setAuthStatus(response);
                this.apiService
                  .fetchCompanyByUserid(this.userid)
                  .subscribe((_resp: any) => {
                    if (
                      _resp.status == true &&
                      _resp.company != undefined &&
                      _resp.company.length > 0
                    ) {
                      this.router.navigate(["/companies"]);
                    } else {
                      this.router.navigate(["/home"]);
                    }
                  });
              }
            }
          } else {
            if (response.errorCode == 404) {
              this.snackBar.open(
                "Email Id is not registered with xuriti.",
                "Close",
                {
                  duration: this.durationInSeconds * 3000,
                  panelClass: ["error-dialog"],
                }
              );
            } else if (response.errorCode == 406) {
              this.snackBar.open("Please enter correct password.", "Close", {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              });
            } else if (response.errorCode == 403) {
              this.snackBar.open(
                "Your account status is inactive, please verify your account or contact to xuriti team.",
                "Close",
                {
                  duration: this.durationInSeconds * 3000,
                  panelClass: ["error-dialog"],
                }
              );
            } else {
              this.snackBar.open(
                "Something went wrong, please try again after sometime.",
                "Close",
                {
                  duration: this.durationInSeconds * 3000,
                  panelClass: ["error-dialog"],
                }
              );
            }
          }
        });
    }
  }

  onGoogleSignin() {
    this.socialAuthService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((response) => {
        this.userData = {
          email: response.email,
          gid: response.id,
        };
        this.apiService
          .signInWithGoogle(this.userData)
          .subscribe((res: any) => {
            // USER DOESN'T EXIST
            if (res.status == false) {
              // if(res.errorCode == 404){
              this.snackBar.open(
                "Email Id is not registered with xuriti.",
                "Close",
                {
                  duration: this.durationInSeconds * 3000,
                  panelClass: ["error-dialog"],
                }
              );
              //Mobile verification
              setTimeout(() => {
                const navigationExtras: NavigationExtras = {
                  queryParams: {
                    firstName: response.firstName,
                    lastName: response.lastName,
                    email: this.userData.email,
                    gid: this.userData.gid,
                  },
                };
                this.router.navigate(["/auth/register"], navigationExtras);
              }, 3000);
              // }
            } else {
              //user exists
              //After successfull signin, store everything in local storage for that user.
              localStorage.setItem("email", res.user.email);
              localStorage.setItem("name", res.user.name);
              localStorage.setItem("profilePic", res.user.profilePic);

              this.userid = res.user._id;
              this.authService.setAuthStatus(res);
              if (this.redirect) {
                this.router.navigate([this.redirect]);
              } else {
                this.apiService
                  .fetchCompanyByUserid(this.userid)
                  .subscribe((_resp: any) => {
                    if (_resp.status == true) {
                      this.router.navigate(["/companies"]);
                    } else {
                      this.router.navigate(["/home"]);
                    }
                  });
                this.router.navigate(["/home"]);
              }
            }
          });
      });
  }
}
