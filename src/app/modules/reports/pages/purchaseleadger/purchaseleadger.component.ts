import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ApiService } from "../../services/api/api.service";
import { CURRENCY_FORMAT } from "src/app/shared/constants/constants";
import { MatTableDataSource } from "@angular/material/table";

export interface PeriodicElement {
  date: string;
  parti: string;
  drcr: string;
  innumber: string;
  dbamt: string;
  cramt: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    date: "11/02/23",
    parti: "Purchase",
    drcr: "DR",
    innumber: "1234",
    dbamt: "1000",
    cramt: "500",
  },
  {
    date: " ",
    parti: "Accounts Payable",
    drcr: "CR",
    innumber: "1234",
    dbamt: " ",
    cramt: "1000",
  },
  {
    date: "2/4/2022",
    parti: "Accounts Payable",
    drcr: "DR",
    innumber: "12345",
    dbamt: "1000",
    cramt: " ",
  },
  {
    date: " ",
    parti: "Cash/Bank",
    drcr: "CR",
    innumber: " ",
    dbamt: " ",
    cramt: "1000",
  },
  {
    date: " ",
    parti: "Discount",
    drcr: "CR",
    innumber: " ",
    dbamt: " ",
    cramt: "1000",
  },
  {
    date: " ",
    parti: "Interest",
    drcr: "DR",
    innumber: " ",
    dbamt: "567",
    cramt: "",
  },
];

@Component({
  selector: "purchaseleadger",
  templateUrl: "./purchaseleadger.component.html",
  styleUrls: ["./purchaseleadger.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class PurchaseleadgerComponent implements OnInit {
  displayedColumns: string[] = [
    "date",
    "parti",
    "drcr",
    "innumber",
    "dbamt",
    "cramt",
  ];

  dataSource = new MatTableDataSource(ELEMENT_DATA);

  companyid!: string;

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private apiservice: ApiService) {}

  ngOnInit(): void {}
  ngAfterViewInit() {
    // this.dataSource.sort = this.sort;
    const cid = localStorage.getItem("companyid");
    if (cid && cid != undefined && cid != null) {
      this.companyid = cid;
      this.getPurchaseLedgerReport();
    }
  }

  getPurchaseLedgerReport() {
    this.apiservice
      .getPurchaseLedgerReport(this.companyid)
      .subscribe((response: any) => {
        // if(response.status == true){
        //   // this.dataSource = response;
        // }
      });
  }
}
