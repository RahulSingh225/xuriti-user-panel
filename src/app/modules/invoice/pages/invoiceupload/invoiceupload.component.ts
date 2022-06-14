import { AfterViewInit, Component, Input, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { InvoiceErrorComponent } from "../components/invoice-error/invoice-error.component";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { environment } from "src/environments/environment";
import { HttpHeaders, HttpParams } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";

// import { MatFileUploadQueue } from 'angular-material-fileupload';
@Component({
  selector: "app-invoiceupload",
  templateUrl: "./invoiceupload.component.html",
  styleUrls: ["./invoiceupload.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class InvoiceuploadComponent implements AfterViewInit {

  durationInSeconds = 2;

  @Input()
  httpRequestHeaders:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      } = new HttpHeaders()
    .set("sampleHeader", "headerValue")
    .set("sampleHeader1", "headerValue1");

  @Input()
  httpRequestParams:
    | HttpParams
    | {
        [param: string]: string | string[];
      } = new HttpParams()
    .set("sampleRequestParam", "requestValue")
    .set("sampleRequestParam1", "requestValue1");

  openDialog1() {
    const dialogRef = this.dialog.open(InvoiceuploadDialog);
  }

  ngAfterViewInit() {}

  redirect!: string;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["redirect"]) {
        this.redirect = queryParams["redirect"];
      }
    });
  }

  public uploadEvent($event: any) {
    const response = $event.event.body;
    if (response && response.status == true) {
      this.snackBar.open(
        "Invoice uploaded successfully, we are processing on it. It will reflect in your account after sometime.",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
    } else if (response && response.status == false) {
      this.snackBar.open(
        "Invoice uploaded, unable to process please check your invoice or try again after sometime.",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }
  }

  openDialog() {
    this.dialog.open(InvoiceErrorComponent);
  }
}

// ============Dialogue box ===========================================

@Component({
  selector: "invoiceupload-dialog",
  templateUrl: "invoiceupload-dialog.html",
  styleUrls: ["./invoiceupload.component.scss"],
})
export class InvoiceuploadDialog {}
