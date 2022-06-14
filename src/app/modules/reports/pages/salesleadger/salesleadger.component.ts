import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../services/api/api.service";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { ReportsErrorComponent } from "../components/reports-error/reports-error.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
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
  selector: "app-salesleadger",
  templateUrl: "./salesleadger.component.html",
  styleUrls: ["./salesleadger.component.scss"],
  providers: [],
})
export class SalesleadgerComponent implements AfterViewInit {
  displayedColumns: string[] = [
    "date",
    "parti",
    "drcr",
    "innumber",
    "dbamt",
    "cramt",
  ];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(private _liveAnnouncer: LiveAnnouncer) {}

  @ViewChild(MatSort)
  sort!: MatSort;

  ngOnInit(): void {}
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}

@Component({
  selector: "salesleadger-dialog",
  templateUrl: "salesleadger-dialog.html",
  styleUrls: ["./salesleadger.component.scss"],
})
export class SalesleadgerDialog {}
