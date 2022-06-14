import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
  LOCAL_STORAGE_AUTH_DETAILS_KEY,
} from "src/app/shared/constants/constants";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ApiService } from "../../../services/api/api.service";

// =================  Pament dia =======================

@Component({
  selector: "app-paynow-dialog",
  templateUrl: "paynow-dialog.html",
  styleUrls: ["paynow.component.scss"],
})
export class PaynowDialogComponent implements OnInit {
  
  Date_Format = DATE_FORMAT;

  currency_format = CURRENCY_FORMAT;

  interestAmount!: number;

  discountAmount!: number;

  discount_percent!: number;

  paynow_form!: FormGroup;

  companyid!: string;

  invoicedata!: any;

  credit_plan_name!: string;

  userDetails!: any;

  durationInSeconds = 2;

  fullAmountPayflag = true;

  amountErrorflag = false;

  discountflag!: boolean;

  errorflag = false;

  paymenttype!: any;

  partpay_discount: number = 0;

  payableAmt = 0;

  days: number =0;

  payableAmount: number = 0;

  total_amount: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const detailsStr = localStorage.getItem(LOCAL_STORAGE_AUTH_DETAILS_KEY);
    if (detailsStr) {
      const details = JSON.parse(detailsStr);
      this.userDetails = details.user;
    }
    // ======================================

    this.paynow_form = this.fb.group({
      partPay: "",
    });
    this.companyid = this.data.companyid;
    this.invoicedata = this.data.invoiceData;
    const due_date = this.invoicedata.extended_due_date
      ? this.invoicedata.extended_due_date
      : this.invoicedata.invoice_due_date;
    var today = new Date();
    var date1 = new Date(due_date); //Due date
    var date2 = new Date(today); //Today's/current date
    var Time = date2.getTime() - date1.getTime(); //today - due date
    var Days = Time / (1000 * 3600 * 24) > 0 ? Time / (1000 * 3600 * 24) : 0; //Diference in Days
    this.days = Math.round(Days)
    console.log("No of days : ", this.days);
    if (this.days <= 0) {
      this.calculateDiscount();
    } else {
      this.calculatedInterest(this.invoicedata.outstanding_amount, this.days);
    }
  }

  onSelectCompleteAmount(flag: boolean) {
    this.fullAmountPayflag = flag;
    if (this.fullAmountPayflag == true) { //full pay selected
      this.errorflag = false;
      if(this.days <= 0){ //with discount
        const amount = (+this.data.invoiceData.outstanding_amount) - (+this.discountAmount);
        this.payableAmount = (amount*100)/100;
        this.partpay_discount = 0;        
      }else{ //with interest
        this.payableAmount = this.total_amount;
      }
      this.paynow_form.patchValue({
        partPay: "",
      });
    }else{ //partpay selected
      this.payableAmount = 0;
    }
  }

  calculatedInterest(amount: string, Days: number) {
    const invoiceData = {
      amount: (+amount) > 0 ? (+amount) : 0,
      days: Days,
    };
    this.apiService
      .calculatedInterest(this.companyid, invoiceData)
      .subscribe((resp: any) => {
        this.discountflag = false;
        // if(resp.success == true){
        this.interestAmount = Math.round(resp.Interest * 100) / 100;
        this.payableAmount = Math.round(+resp.Total_Amount * 100) / 100;
        this.total_amount =  Math.round(+resp.Total_Amount * 100) / 100;
        // }
      });
  }

  calculateDiscount() {
    const invoiceid = this.data.invoiceData._id;
    this.apiService
      .calculateDiscount(this.companyid, invoiceid)
      .subscribe((respon: any) => {
        if (respon.status == true) {
          this.credit_plan_name = respon.Credit_plan_name
          this.discount_percent = respon.Discount_percent;
          this.discountAmount = Math.round(+respon.Discount_Amount * 100) / 100;
          const amt = (+this.data.invoiceData.outstanding_amount) -
            Math.round(+respon.Discount_Amount * 100) / 100;
          this.payableAmount = amt > 0 ? amt : 0;
          this.discountflag = true;
        } else {
          this.discountflag = false;
        }
      });
  }

  onEnterAmount(event: any) {
    console.log(event.target.value);
    let amt = (+event.target.value);
    if(amt > (+this.data.invoiceData.outstanding_amount) || amt < 0){
      this.errorflag = true;
      this.partpay_discount = 0;
      this.payableAmount = 0;
    }else{
      if(this.days <= 0){
        this.errorflag = false;
        this.partpay_discount =Math.round(amt*(this.discount_percent/100)*100)/100;
        this.payableAmount = ((amt - this.partpay_discount)*100)/100;
      }else{
        this.errorflag = false;
        this.payableAmount = (amt*100)/100;
      }      
    }
  }

  paynow() {
    if (this.fullAmountPayflag == true) {
      this.errorflag = false;
      this.payableAmt = this.payableAmount;
      this.payPayableAmount();
    } else {
      if (
        this.paynow_form.valid &&
        this.paynow_form.value.partPay > 0 &&
        this.paynow_form.value.partPay <= this.data.invoiceData.outstanding_amount
      ) {
        this.errorflag = false;
        this.payableAmt = this.payableAmount;
        this.payPayableAmount();
      } else {
        this.errorflag = true;
      }
    }
  }

  payPayableAmount() {
    if (this.payableAmt < 0 || this.payableAmt == 0) {
      this.errorflag = true;
    } else {
      this.errorflag = false;
      const body: any = {
        customer_details: { //required field by cashfree
          customer_id: this.data.invoiceData.buyer._id,
          customer_name: this.data.invoiceData.buyer.companyName,
          customer_email: this.userDetails.email,
          customer_phone: this.userDetails.mobile_number,
        },
        discountPlan: {
          Credit_plan_name: this.credit_plan_name,
          Discount_percent: this.discount_percent,
          Discount_Amount: this.fullAmountPayflag == true ? this.discountAmount : this.partpay_discount,
        },
        invoiceid: this.data.invoiceData._id,
        order_amount: Math.round(this.payableAmt * 100) / 100, //req
        order_currency: "INR", //req
        invoiceNumber: this.data.invoiceData.invoice_no,
        invoiceAmount: this.data.invoiceData.invoice_amount,
        // invoiceDate: this.data.invoiceData.invoice_date,
        invoiceDueDt: this.data.invoiceData.invoice_duedate,
        outstanding_amount: (+this.data.invoiceData.outstanding_amount),
        buyerid: this.companyid,
        interest: this.interestAmount,
        discount: this.fullAmountPayflag == true ? this.discountAmount : this.partpay_discount,
      };
      this.apiService.paynow(body).subscribe((response: any) => {
        if (response.status == true) {
          if (
            response.payment_link &&
            response.payment_link != '' &&
            response.payment_link != undefined &&
            response.payment_link != null
          ) {
            // setTimeout(() => {
            window.location.href = response.payment_link;
            // }, 5000);
          } else {
            this.snackBar.open(
              "Unable to process at this moment, please contact to support team.",
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
          }
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
    }
  }
}
