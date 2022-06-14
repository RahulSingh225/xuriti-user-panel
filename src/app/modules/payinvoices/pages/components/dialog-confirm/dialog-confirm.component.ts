import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-dialog-confirm",
  templateUrl: "./dialog-confirm.component.html",
  styleUrls: ["./dialog-confirm.component.scss"],
})
export class DialogConfirmComponent implements OnInit {

  form!: FormGroup;

  fName = "";

  pwdVisible = false;

  constructor(public dialogRef: MatDialogRef<DialogConfirmComponent>) {}

  ngOnInit(): void {}

  cancel() {
    this.dialogRef.close();
  }

  confirm() {
    const changestatusFlag = true;
    this.dialogRef.close(changestatusFlag);
  }
}
