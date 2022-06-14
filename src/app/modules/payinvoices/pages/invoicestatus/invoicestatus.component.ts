import { LiveAnnouncer } from "@angular/cdk/a11y";
import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../services/api/api.service";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
} from "src/app/shared/constants/constants";
import { DialogConfirmComponent } from "../components/dialog-confirm/dialog-confirm.component";

@Component({
  selector: "app-invoicestatus",
  templateUrl: "./invoicestatus.component.html",
  styleUrls: ["./invoicestatus.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class InvoicestatusComponent implements AfterViewInit {

  Date_Format = DATE_FORMAT;

  currency_format = CURRENCY_FORMAT;

  uid!: string;

  type!: string;

  invoice_status!: string;

  displayedColumns: string[] = [
    "invoice_number",
    "company_name",
    "invoice_amount",
    "invoice_due_date",
    "invoice_status",
    "actionsstatic",
  ];
  dataSource = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  redirect!: string;

  changeText: boolean = false;

  companyid!: string;

  durationInSeconds = 2;

  interestAmount: any;

  payableAmount: number = 0;

  private token!: string;

  pwdVisible = false;

  keyword = "name";

  data = [];

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogConfirmComponent>
  ) {
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["uid"] && queryParams["type"]) {
        this.uid = queryParams["uid"];
        this.type = queryParams["type"];

        //To check the type of invoice we are going to show
        if (this.type == "payment") {
          this.invoice_status = "Confirmed";
        } else if (this.type == "invoice") {
          this.invoice_status = "Pending";
        }
        this.validateUser();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  validateUser() {
    //Validating the link
    this.apiService
      .validateUser(this.uid, this.type)
      .subscribe((response: any) => {
        if (response.status == true) {
          this.getInvoiceById();
        } else {
          this.snackBar.open("Link is expired, please try again", "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
          setTimeout(() => {
            this.router.navigate([`auth/login`]);
          }, 3000);
        }
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  getInvoiceById() {
    this.apiService
      .getInvoicesByCompanyId(this.uid, this.invoice_status)
      .subscribe((response: any) => {
        if (response.status == true) {
          if (!response.invoice && response.invoice == []) {
            this.snackBar.open(
              "No invoice found against selected company.",
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
          } else {
            this.dataSource = new MatTableDataSource(response.invoice);
            // Sorting
            this.dataSource.sort = this.sort;
            const sortState: Sort = { active: "createdAt", direction: "desc" };
            this.sort.active = sortState.active;
            this.sort.direction = sortState.direction;
            this.sort.sortChange.emit(sortState);
          }
        }
      });
  }

  viewInvoice(invoicelink: any) {
    if (invoicelink && invoicelink != "" && invoicelink != undefined) {
      window.location.href = invoicelink;
    } else {
      this.snackBar.open("Unable to download the invoice file.", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    }
  }

  rejectInvoice(invoiceid: string) {
    const status = "Rejected";
    this.openDialog(invoiceid, status);
  }

  confirmInvoice(invoiceid: string) {
    const status = "Confirmed";
    this.openDialog(invoiceid, status);
  }

  openDialog(invoiceid: string, status: string) {
    this.dialogRef = this.dialog.open(DialogConfirmComponent);

    this.dialogRef.afterClosed().subscribe((flag) => {
      if (flag == true) {
        const invoiceStatus: any = {
          invoiceID: invoiceid,
          status: status, //Invoice status
          reason: "No Reason",
        };
        this.apiService
          .changeInvoiceStatus(this.uid, invoiceStatus)
          .subscribe((resp: any) => {
            if (resp.status == true) {
              this.snackBar.open(
                "Invoice Status is changed successfully",
                "Close",
                {
                  duration: this.durationInSeconds * 3000,
                  panelClass: ["error-dialog"],
                }
              );
              this.getInvoiceById();
            } else {
              this.snackBar.open(
                "Unable to change the Invoice Status, Please try again after sometime",
                "Close",
                {
                  duration: this.durationInSeconds * 3000,
                  panelClass: ["error-dialog"],
                }
              );
              this.getInvoiceById();
            }
          });
      }
    });
  }

  payInvoice(invoiceData: any) {
    const due_date = invoiceData.extended_due_date
      ? invoiceData.extended_due_date
      : invoiceData.invoice_due_date;
    var today = new Date();
    var date1 = new Date(due_date); //mmddyyyy
    var date2 = new Date(today);
    var Time = date2.getTime() - date1.getTime();
    var Days = Time / (1000 * 3600 * 24) > 0 ? Time / (1000 * 3600 * 24) : 0; //Diference in Days

    const data = {
      amount: invoiceData.outstanding_amount,
      days: Days,
      uid: this.uid,
    };
    this.apiService
      .calculatedInterest(invoiceData.buyer._id, data)
      .subscribe((resp: any) => {
        if (resp.status == true) {
          this.interestAmount = resp.Interest;
          this.payableAmount = resp.Total_Amount;
        }

        // ===================================================================================
        const body: any = {
          customer_details: {
            //req
            customer_id: invoiceData.buyer._id,
            customer_name: invoiceData.buyer.company_name,
            customer_emai: invoiceData.buyer.company_email
              ? invoiceData.buyer.company_email
              : "",
            customer_phone: invoiceData.buyer.company_mobile
              ? invoiceData.buyer.company_mobile
              : "",
          },
          invoiceid: invoiceData._id,
          order_amount: Math.round(this.payableAmount * 100) / 100, //req
          order_currency: "INR", //req
          invoiceNumber: invoiceData.invoice_number,
          invoiceAmount: invoiceData.invoice_amount,
          invoiceDate: invoiceData.invoice_date,
          invoiceDueDt: invoiceData.invoice_due_date,
          outstanding_amount: invoiceData.outstanding_amount,
          buyerid: invoiceData.buyer._id,
          interest: this.interestAmount,
          returnurl: `https://dev.xuriti.app/#/invoices/status`,
        };

        this.apiService.paynow(this.uid, body).subscribe((response: any) => {
          if (response.status == true) {
            window.location.href = response.payment_link;
          } else {
            this.snackBar.open(
              "An error occurred, please try again later or contact to support team.",
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
          }
        });
      });
  }
}

@Component({
  selector: "invoicestatus-dialog",
  templateUrl: "invoicestatus-dialog.html",
  styleUrls: ["./invoicestatus.component.scss"],
})
export class InvoicestatusDialog {}
