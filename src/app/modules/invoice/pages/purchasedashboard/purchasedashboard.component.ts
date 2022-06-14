import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { ApiService } from "../../services/api/api.service";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { InvoiceErrorComponent } from "../components/invoice-error/invoice-error.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortable, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { ExtendCreditComponent } from "src/app/modules/payment/pages/components/extend-credit/extend-credit.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PaynowDialogComponent } from "src/app/modules/payment/pages/components/pay-now/paynow.component";
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
} from "src/app/shared/constants/constants";

@Component({
  selector: "app-purchasedashboard",
  templateUrl: "./purchasedashboard.component.html",
  styleUrls: ["./purchasedashboard.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class PurchasedashboardComponent implements AfterViewInit {  

  Date_Format = DATE_FORMAT;

  currency_Format = CURRENCY_FORMAT;

  displayedColumns: string[] = [
    "invoice_no",
    "company_name",
    "invoice_amount",
    "invoice_due_date",
    "extended_due_date",
    "outstanding_amount",
    "invoice_status",
    "createdAt",
    "actions",
  ];

  dataSource = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  redirect!: string;

  private token!: string;

  private durationInSeconds = 2;

  changeText: boolean = false;

  extendCreditFlag: boolean = false;

  companyid!: string;

  keyword = "name";

  data = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<InvoiceErrorComponent>
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["redirect"]) {
        this.redirect = queryParams["redirect"];
      }
    });
    const cid = localStorage.getItem("companyid");
    if (cid && cid != undefined && cid != null) {
      this.companyid = cid;
    }
    this.getInvoiceByCompanyId();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openDialog1() {
    const dialogRef = this.dialog.open(PurchasedashboardDialog);
  }

  checkExtendCredit(element: any){
    var today = new Date();
    var due_date = new Date(element.invoice_due_date); //Due date
    var extended_date = new Date(element.extended_due_date);
    var today = new Date(today); //Today's/current date
    var Time1 = today.getTime() - due_date.getTime(); //today - due date
    var Days1 = Math.round(Time1 / (1000 * 3600 * 24) > 0 ? Time1 / (1000 * 3600 * 24) : 0); //Diference in todays  and due date

    var Time2 = extended_date.getTime() - due_date.getTime(); //ectend - due date
    var Days2 = Math.round(Time2 / (1000 * 3600 * 24) > 0 ? Time2 / (1000 * 3600 * 24) : 0);   

    if (Days1 < 4 && Days2 <= 60) {
      return true
    } else {
      return false
    }
  }

  openInvoicePage(mode: string) {
    if (mode == "sales") {
      this.router.navigate([`/companies/${this.companyid}/invoices/sales`]);
    } else {
      this.router.navigate([`/companies/${this.companyid}/invoices/purchases`]);
    }
  }

  selectEvent(item: any) {
    this.apiService.suggestionresult(item._id).subscribe((res: any) => {
      if (res.status == false) {
        this.dataSource = new MatTableDataSource([]);
      }
      if (res.status == true) {
        this.dataSource = new MatTableDataSource(res.invoice);
        this.dataSource.paginator = this.paginator;

        // this.sort.sort({ id: "createdAt", start: "desc" } as MatSortable);
        // this.dataSource.sort = this.sort;
        this.dataSource.sort = this.sort;
        const sortState: Sort = { active: "createdAt", direction: "desc" };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    });
  }

  onChangeSearch(val: string) {
    this.apiService.companynameAutoSuggestion().subscribe((response: any) => {
      if (response) {
        const result = response.companies;
        for (const cmp of result) {
          cmp["name"] = cmp.company_name;
        }
        this.data = result;
      }
    });
  }

  showInvoiceDetails(invoiceDetail: any) {    
  }

  invoicesByDueDate(event: Event) {
    console.log("invoicesByDueDate : ", event);
  }

  invoicesByStatus(event: string) {
    //filter by status
    const filterValue = event;
    this.dataSource.filter = filterValue;
  }

  getInvoiceByCompanyId() {
    const body = {
      type: "buyer",
      id: this.companyid,
    };
    this.apiService.getInvoicesByCompanyId(body).subscribe((response: any) => {
      if (response.status == true) {
        this.dataSource = new MatTableDataSource(response.invoice);
        this.dataSource.paginator = this.paginator;

        // this.sort.sort({ id: "createdAt", start: "desc" } as MatSortable);
        // this.dataSource.sort = this.sort;
        this.dataSource.sort = this.sort;
        const sortState: Sort = { active: "createdAt", direction: "desc" };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    });
  }

  uploadInvoices() {
    this.router.navigate([
      `/companies/${this.companyid}/invoices/invoiceupload`,
    ]);
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

  openDialog(invoiceid: string, status: string) { //change invoice status
    this.dialogRef = this.dialog.open(InvoiceErrorComponent);

    this.dialogRef.afterClosed().subscribe((invoicemsg) => {
      const invoiceStatus: any = {
        invoiceID: invoiceid,
        status: status, //'Rejected',
        reason: invoicemsg.invoice_comment,
      };
      this.apiService
        .changeInvoiceStatus(invoiceStatus)
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
            this.getInvoiceByCompanyId();
          } else {
            this.snackBar.open(
              "Unable to change the Invoice Status, Please try again after sometime",
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
            this.getInvoiceByCompanyId();
          }
        });
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  confirmInvoice(invoiceid: any) {
    const status = "Confirmed";
    this.openDialog(invoiceid, status);
  }

  rejectInvoice(invoiceid: any) {
    const status = "Rejected";
    this.openDialog(invoiceid, status);
  }

  extendCreditInvoice(invoiceData: any) {
    if (invoiceData.outstanding_amount < 0) {
      this.snackBar.open("You cannot apply, please check details.", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    } else {
      this.dialog.open(ExtendCreditComponent, {
        data: {
          invoice_id: invoiceData._id,
          companyid: this.companyid,
          invoice_no: invoiceData.invoice_number,
          seller_name: invoiceData.seller.company_name,
          sellerid: invoiceData.seller._id,
          invoice_due_date: invoiceData.invoice_due_date,
          extended_due_date: invoiceData && invoiceData.extended_due_date ? invoiceData.extended_due_date : invoiceData.invoice_due_date,
          invoice_amount: invoiceData.invoice_amount,
          outstanding_amount: invoiceData.outstanding_amount,
        },
      });
    }
  }

  payInvoice(invoiceData: any) {
    this.dialog.open(PaynowDialogComponent, {
      data: {
        companyid: this.companyid,
        invoiceData: invoiceData,
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

@Component({
  selector: "purchasedashboard-dialog",
  templateUrl: "purchasedashboard-dialog.html",
  styleUrls: ["./purchasedashboard.component.scss"],
})
export class PurchasedashboardDialog {}
