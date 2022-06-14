import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PasswordStrengthMeterModule } from "angular-password-strength-meter";
import { PaymentRoutingModule } from "./payment-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { CoreModule } from "src/app/core/core.module";
import { ApiService } from "./services/api/api.service";
import { PaymentErrorComponent } from "./pages/components/payment-error/payment-error.component";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFileUploadModule } from "angular-material-fileupload";
import { MatTableExporterModule } from "mat-table-exporter";
import { MatRadioModule } from "@angular/material/radio";
import { ExtendCreditComponent } from "./pages/components/extend-credit/extend-credit.component";
import { MatInputModule } from "@angular/material/input";
import { PaynowDialogComponent } from "./pages/components/pay-now/paynow.component";
import { PaymenthistoryComponent } from "./pages/paymenthistory/paymenthistory.component";
import { AutocompleteLibModule } from "angular-ng-autocomplete";
// import { FilterPipe } from './pages/paymenthistory/filter.pipe';
import { MatNativeDateModule } from "@angular/material/core";
@NgModule({
  declarations: [
    PaymentErrorComponent,
    PaymenthistoryComponent,
    ExtendCreditComponent,
    PaynowDialogComponent,
  ],
  imports: [
    CommonModule,
    MatFileUploadModule,
    CoreModule,
    FormsModule,
    MatFormFieldModule,
    MatRadioModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    PasswordStrengthMeterModule,
    SharedModule,
    PaymentRoutingModule,
    MatGridListModule,
    MatTableExporterModule,
    MatInputModule,
    AutocompleteLibModule,
    MatNativeDateModule,
  ],
  providers: [ApiService],
})
export class PaymentModule {}
