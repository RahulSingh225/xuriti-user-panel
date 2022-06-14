import { LiveAnnouncer } from "@angular/cdk/a11y";
import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../services/api/api.service";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { InvoiceErrorComponent } from "../components/invoice-error/invoice-error.component";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortable, Sort } from "@angular/material/sort";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
} from "src/app/shared/constants/constants";

@Component({
  selector: "app-salesdashboard",
  templateUrl: "./salesdashboard.component.html",
  styleUrls: ["./salesdashboard.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class SalesdashboardComponent implements AfterViewInit {
  Date_Format = DATE_FORMAT;

  currency_Format = CURRENCY_FORMAT;

  displayedColumns: string[] = [
    "invoice_number",
    "company_name",
    "invoice_amount",
    "invoice_due_date",
    "extended_due_date",
    "outstanding_amount",
    "invoice_status",
    "createdAt",
    "actions",
  ];

  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  redirect!: string;

  changeText: boolean = false;

  companyid!: string;

  durationInSeconds = 2;

  private token!: string;

  pwdVisible = false;

  keyword = "name";

  data = [];

  constructor(
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer
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
    this.dataSource.sort = this.sort;
  }

  openDialog1() {
    const dialogRef = this.dialog.open(SalesdashboardDialog);
  }

  openInvoicePage(mode: string) {
    if (mode == "sales") {
      this.router.navigate([`/companies/${this.companyid}/invoices/sales`]);
    } else {
      this.router.navigate([`/companies/${this.companyid}/invoices/purchases`]);
    }
  }

  selectEvent(item: any) {
    console.log("selected item ", item);
  }

  onChangeSearch(val: string) {
    this.apiService.companynameAutoSuggestion().subscribe((response: any) => {
      if (response.status == true) {
        const result = response.companies;
        for (const cmp of result) {
          cmp["name"] = cmp.company_name;
        }
        this.data = result;
      }
    });
  }

  invoicesByDueDate(event: Event) {
    console.log("invoicesByDueDate : ", event);
  }

  invoicesByStatus(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getInvoiceByCompanyId() {
    const body = {
      type: "seller",
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

  openDialog() {
    this.dialog.open(InvoiceErrorComponent);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

@Component({
  selector: "salesdashboard-dialog",
  templateUrl: "salesdashboard-dialog.html",
  styleUrls: ["./salesdashboard.component.scss"],
})
export class SalesdashboardDialog {}
