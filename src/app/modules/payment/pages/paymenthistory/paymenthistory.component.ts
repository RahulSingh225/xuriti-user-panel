import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortable, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { ApiService } from "../../services/api/api.service";
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
} from "src/app/shared/constants/constants";
@Component({
  selector: "app-paymenthistory",
  templateUrl: "./paymenthistory.component.html",
  styleUrls: ["./paymenthistory.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class PaymenthistoryComponent implements AfterViewInit {

  companyid!: string;

  Date_Format = DATE_FORMAT;

  currency_format = CURRENCY_FORMAT;

  maxDate!: Date;

  changeText: boolean = false;

  value = "";

  keyword = "name";

  data = [];

  keyword2 = "cname";

  data2 = [];

  displayedColumns: string[] = [
    "invoice_number",
    "company_name",
    "updatedAt",
    "invoice_amount",
    "order_amount",
    "order_status",
  ];
  dataSource = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  redirect!: string;

  constructor(
    private router: Router,
    private apiService: ApiService,
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
    this.getPaymentHistory();
    this.maxDate = new Date();
  }

  getPaymentHistory() {
    this.apiService
      .fetchPaymentHistory(this.companyid)
      .subscribe((response: any) => {
        if (response.status == true) {
          this.dataSource = new MatTableDataSource(response.tranc_detail);
          this.dataSource.paginator = this.paginator;

          // this.sort.sort({ id: "updatedAt", start: "desc" } as MatSortable);
          // this.dataSource.sort = this.sort;
          this.dataSource.sort = this.sort;
          const sortState: Sort = { active: "updatedAt", direction: "desc" };
          this.sort.active = sortState.active;
          this.sort.direction = sortState.direction;
          this.sort.sortChange.emit(sortState);
        }
      });
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

  selectEvent(item: any) {
    this.apiService
      .fetchPaymentHistoryByInvoiceNumber(item.invoiceNumber)
      .subscribe((res) => {
        this.dataSource = new MatTableDataSource(res.tranc_detail);
        this.dataSource.paginator = this.paginator;

        // this.sort.sort(({ id: 'updatedAt', start: 'desc'}) as MatSortable);
        // this.dataSource.sort = this.sort;
        this.dataSource.sort = this.sort;
        const sortState: Sort = { active: "updatedAt", direction: "desc" };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      });
  }

  selectEventBuyer(item2: any) {
    this.apiService
      .fetchPaymentHistoryByInvoiceNumber(item2.invoiceid.seller.companyName)
      .subscribe((res) => {
        this.dataSource = new MatTableDataSource(res.tranc_detail);
        this.dataSource.paginator = this.paginator;

        // this.sort.sort({ id: "updatedAt", start: "desc" } as MatSortable);
        // this.dataSource.sort = this.sort;
        this.dataSource.sort = this.sort;
        const sortState: Sort = { active: "updatedAt", direction: "desc" };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      });
  }

  onChangeSearch(val: any) {
    this.apiService
      .fetchPaymentHistory(this.companyid)
      .subscribe((response: any) => {
        if (response) {
          const result = response.tranc_detail;
          for (const cmp of result) {
            cmp["name"] = cmp.invoiceNumber;
          }
          this.data = result;
        }
      });
  }

  onChangeSearchBuyer(val: string) {
    this.apiService
      .fetchPaymentHistory(this.companyid)
      .subscribe((response: any) => {
        if (response) {
          const result = response.tranc_detail;
          for (const cmp of result) {
            cmp["cname"] = cmp.invoiceid.seller.companyName;
          }
          this.data2 = result;
        }
      });
  }

  invoiceDate = new FormControl(new Date());

  paymentDate = new FormControl(new Date());

  invoicedate() {
    console.log("datevalue:", this.invoiceDate.value);
    var date = this.invoiceDate.value;
    var dd = String(date.getDate()).padStart(2, "0");
    var mm = String(date.getMonth() + 1).padStart(1, "0"); //January is 0!
    var yyyy = date.getFullYear();

    date = `${yyyy}-${dd}-${mm}`;

    this.apiService.fetchpaymentByInvoiceDate(date).subscribe((res) => {
      this.dataSource = new MatTableDataSource(res.tranc_detail);
      this.dataSource.paginator = this.paginator;

      // this.sort.sort({ id: "updatedAt", start: "desc" } as MatSortable);
      // this.dataSource.sort = this.sort;
      this.dataSource.sort = this.sort;
      const sortState: Sort = { active: "updatedAt", direction: "desc" };
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
    });
  }

  paymentdate(event: Event) {
    console.log("datevalue:", this.paymentDate.value);
  }
}
