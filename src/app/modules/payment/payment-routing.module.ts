import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PaymenthistoryComponent } from "./pages/paymenthistory/paymenthistory.component";

const routes: Routes = [
  { path: "", component: PaymenthistoryComponent },
  // { path: 'paymentstatus', component: PaymentStatus },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentRoutingModule {}
