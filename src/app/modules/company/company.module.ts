import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PasswordStrengthMeterModule } from "angular-password-strength-meter";
import { CompanyRoutingModule } from "./company-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { CoreModule } from "src/app/core/core.module";
import { ApiService } from "./services/api/api.service";
import { CompanyErrorComponent } from "./pages/components/company-error/company-error.component";
import { UsersComponent, AddUsersDialog } from "./pages/users/users.component";
import { CompanylistComponent } from "./pages/companylist/companylist.component";
import {
  BankaccountComponent,
  AddBankaccountDialog,
} from "./pages/bankaccount/bankaccount.component";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatRadioModule } from "@angular/material/radio";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ConformDailogComponent } from "./pages/components/conform-dailog/conform-dailog.component";
import { CreditComponent } from "./pages/credit/credit.component";
@NgModule({
  declarations: [
    UsersComponent,
    BankaccountComponent,
    CompanylistComponent,
    CompanyErrorComponent,
    AddUsersDialog,
    AddBankaccountDialog,
    ConformDailogComponent,
    CreditComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    PasswordStrengthMeterModule,
    SharedModule,
    CompanyRoutingModule,
    MatSnackBarModule,
    MatGridListModule,
    MatRadioModule,
  ],
  providers: [
    ApiService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
  ],
})
export class CompanyModule {}
