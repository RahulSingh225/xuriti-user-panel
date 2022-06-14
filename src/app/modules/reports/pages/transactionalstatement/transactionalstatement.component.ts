import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ApiService } from "../../services/api/api.service";
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
} from "src/app/shared/constants/constants";
import { MatTableDataSource } from "@angular/material/table";

export interface PeriodicElement {
  invoice_number: string;
  company_name: string;
  invoice_date: string;
  transaction_type: string;
  transaction_amount: string;
  tradate: string;
  reason: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    invoice_number: "1234",
    company_name: "Abc Corp",
    invoice_date: "11/02/23",
    transaction_type: "DR",
    transaction_amount: "1000",
    tradate: "11/02/23",
    reason: "Invoice Amount",
  },
  {
    invoice_number: "2234",
    company_name: "Abc Corp",
    invoice_date: "12/02/23",
    transaction_type: "CR",
    transaction_amount: "3000",
    tradate: "21/02/23",
    reason: "Payment",
  },
  {
    invoice_number: "3234",
    company_name: "Abc Corp",
    invoice_date: "13/02/23",
    transaction_type: "DR",
    transaction_amount: "5000",
    tradate: "31/02/23",
    reason: "Discount",
  },
  {
    invoice_number: "4234",
    company_name: "Abc Corp",
    invoice_date: "14/02/23",
    transaction_type: "CR",
    transaction_amount: "7000",
    tradate: "11/01/23",
    reason: "Payment",
  },
  {
    invoice_number: "5234",
    company_name: "Abc Corp",
    invoice_date: "15/02/23",
    transaction_type: "DR",
    transaction_amount: "9000",
    tradate: "21/02/23",
    reason: "Interest",
  },
];

@Component({
  selector: "transactionalstatement",
  templateUrl: "./transactionalstatement.component.html",
  styleUrls: ["./transactionalstatement.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class TransactionalstatementComponent implements OnInit {
  Date_Format = DATE_FORMAT;

  currency_Format = CURRENCY_FORMAT;

  displayedColumns: string[] = [
    "invoice_number",
    "company_name",
    "invoice_date",
    "transaction_type",
    "transaction_amount",
    "tradate",
    "remarks",
  ];

  companyid!: string;

  durationInSeconds = 2;

  dataSource = new MatTableDataSource([]);

  constructor(private apiservice: ApiService, private snackBar: MatSnackBar) {}

  @ViewChild(MatSort)
  sort!: MatSort;

  ngOnInit(): void {
    const cid = localStorage.getItem("companyid");
    if (cid && cid != undefined && cid != null) {
      this.companyid = cid;
      this.getTransactionStatement();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.getTransactionStatement();
  }

  getTransactionStatement() {
    this.apiservice
      .getTransactionStatement(this.companyid)
      .subscribe((response: any) => {
        if (response && response.status == true) {
          this.dataSource = response.statement;
        } else {
          this.snackBar.open("No statement found", "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
        }
      });
  }
}
