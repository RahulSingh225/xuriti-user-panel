import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../services/api/api.service";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { RegisterErrorComponent } from "../components/register-error/register-error.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { LOCAL_STORAGE_AUTH_DETAILS_KEY } from "src/app/shared/constants/constants";
import { MatSnackBar } from "@angular/material/snack-bar";
import { VerifyCaptchaComponent } from "../components/verify-captcha/verify-captcha.component";
@Component({
  selector: "app-entity",
  templateUrl: "./entity.component.html",
  styleUrls: ["./entity.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class EntityComponent implements OnInit {
  redirect!: string;

  userid!: string;

  title!: string;

  msg!: string;

  admin_email!: string;

  admin_mobile!: number;

  gstin!: string;

  gst_form!: FormGroup;

  companyDetail_form!: FormGroup;

  private token!: string;

  durationInSeconds = 2;

  companyname!: string;

  address!: string;

  district = "";

  state = "";

  pinCode = "";

  pan = "";

  industry_type: any;

  companyflag = false;

  captcha_img!: string;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<VerifyCaptchaComponent>
  ) {}

  ngOnInit(): void {
    this.getCaptcha();

    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["redirect"]) {
        this.redirect = queryParams["redirect"];
      }
    });
    const detailsStr = localStorage.getItem(LOCAL_STORAGE_AUTH_DETAILS_KEY);
    if (detailsStr) {
      const details = JSON.parse(detailsStr);
      const userDetails = details.user;
      if (userDetails && userDetails != undefined && userDetails != null) {
        this.admin_email = userDetails.email;
        this.admin_mobile = userDetails.mobile_number;
        this.userid = userDetails._id;
      }
    }
    this.gst_form = this.fb.group({
      gstin: ["", [Validators.pattern, Validators.required]],
      captcha: ["", [Validators.required]],
      // username: ['', [Validators.required]],
    });

    this.companyDetail_form = this.fb.group({
      // gstin: ['', [Validators.pattern, Validators.required]],
      // dealerName: ['', [Validators.required]],
      // companyName: ['', [Validators.required]],
      // companyMobileNumber: ['', [Validators.required]],
      // companyEmail: ['', [Validators.required]],
      // address: ['', [Validators.required]],
      // district: ['', [Validators.required]],
      // state: ['', [Validators.required]],
      // pinCode: ['', [Validators.required]],
      // industry_type: ['', [Validators.required]],
      cin: [""],
      tan: [""],
      // pan: ['', [Validators.required]],
      // annual_Turnover: ['', [Validators.required]],
      // admin_mobile: ['', [Validators.required]],
      // admin_email: ['', [Validators.required]],
      admin_email: ["", [Validators.required]],
      admin_mobile: ["", [Validators.required]],
    });
  }

  getCaptcha() {
    this.captcha_img =
      "https://services.gst.gov.in/services/captcha?rnd=0.0000001";
    // console.log("get captcha called ", this.captcha);
    return this.captcha_img;
  }

  getCompanyDetailsByGST() {
    if (this.gst_form.valid) {
      this.gstin = this.gst_form.value.gstin;
      const gstin_data = {
        gstin: this.gstin,
        captcha: this.gst_form.value.captcha,
      };
      this.apiService
        .getCompanyDetailsByGST(gstin_data)
        .subscribe((resp: any) => {
          if (resp && resp.status == true) {
            this.companyflag = true;
            const cdata = resp.company;
            this.pan = this.gstin.substring(2, 12);
            this.companyname = cdata.companyName;
            this.address = cdata.address;
            this.district = cdata.district;
            this.industry_type = cdata.industry_type;
            this.pinCode = cdata.pinCode;
            this.state = cdata.state;

            this.companyDetail_form.patchValue({
              // dealerName: cdata.dealerName,
              // companyName: cdata.companyName,
              // companyMobileNumber: cdata.companyMobileNumber,
              // companyEmail: cdata.companyEmail,
              // address: cdata.address,
              // district: cdata.district,
              // state: cdata.state,
              // pinCode: cdata.pinCode,
              // industry_type: cdata.industry_type,
              cin: cdata.cin,
              tan: cdata.tan,
              // pan: cdata.pan,
              // annual_Turnover: cdata.annual_Turnover,
            });
            if (this.admin_email && this.admin_mobile) {
              this.companyDetail_form.patchValue({
                admin_email: this.admin_email,
                admin_mobile: this.admin_mobile,
              });
            }
          } else {
            this.companyflag = false;
            this.title = "Invalid GST no";
            this.msg =
              "No company details found against this GST number, Please enter the valid GST number.";
            this.companyDetail_form.patchValue({
              // dealerName: '',
              // companyName: '',
              // address: '',
              // district: '',
              // state: '',
              // pinCode: '',
              // pan: '',
              cin: "",
              tan: "",
              // industry_type: '',
              // annual_Turnover: '',
              companyMobileNumber: "",
              companyEmail: "",
            });
            this.openDialog(this.title, this.msg);
          }
        });
    } else {
      this.companyflag = false;
      this.pan = "";
      this.companyname = "";
      this.address = "";
      this.district = "";
      this.industry_type = "";
      this.pinCode = "";
      this.state = "";

      this.companyDetail_form.patchValue({
        cin: "",
        tan: "",
      });
    }
  }

  openDialog(title: string, msg: string) {
    this.dialog.open(RegisterErrorComponent, {
      data: {
        title: title,
        msg: msg,
      },
    });
  }

  onSubmit() {
    if (this.gst_form.valid && this.companyDetail_form.valid) {
      // if(this.companyDetail_form.valid){ //To be removed
      const company_details = {
        userID: this.userid,
        gstin: this.gstin,
        // gstin: this.companyDetail_form.value.gstin,
        // dealerName: this.companyDetail_form.value.dealerName,

        companyName: this.companyname,
        address: this.address,
        district: this.district,
        state: this.state,
        pinCode: this.pinCode,
        pan: this.pan,
        cin: this.companyDetail_form.value.cin,
        tan: this.companyDetail_form.value.tan,
        industry_type: this.industry_type,
        // annual_Turnover: this.companyDetail_form.value.annual_Turnover,
        // companyMobileNumber: this.companyDetail_form.value.companyMobileNumber,
        // companyEmail: this.companyDetail_form.value.companyEmail,
        admin_email: this.admin_email,
        admin_mobile: this.admin_mobile,
      };
      this.apiService
        .saveCompanyDetails(this.userid, company_details)
        .subscribe((resp: any) => {
          if (resp.status) {
            this.snackBar.open(
              "Thank you for registering with Xuriti. Our team will verify the details and confirm your registration",
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
            setTimeout(() => {
              this.router.navigate(["/companies"]);
            }, 3000);
          } else {
            this.companyflag = false;
            this.pan = "";
            this.companyname = "";
            this.address = "";
            this.district = "";
            this.industry_type = "";
            this.pinCode = "";
            this.state = "";

            this.gst_form.patchValue({
              gstin: "",
            });

            this.companyDetail_form.patchValue({
              cin: "",
              tan: "",
            });
            this.snackBar.open("Company is already registered", "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
          }
        });
    } else {
      this.companyflag = false;
      this.pan = "";
      this.companyname = "";
      this.address = "";
      this.district = "";
      this.industry_type = "";
      this.pinCode = "";
      this.state = "";

      this.gst_form.patchValue({
        gstin: "",
      });

      this.companyDetail_form.patchValue({
        cin: "",
        tan: "",
      });
      this.title = "Incomplete details";
      this.msg =
        "Please complete the registration detail to move to further steps.";
      this.openDialog(this.title, this.msg);
    }
  }
}
