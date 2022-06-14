import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

//import { PaynowComponent } from './pages/paynow/paynow.component';

import { SalesleadgerComponent } from "./pages/salesleadger/salesleadger.component";
import { PurchaseleadgerComponent } from "./pages/purchaseleadger/purchaseleadger.component";
import { TransactionalstatementComponent } from "./pages/transactionalstatement/transactionalstatement.component";
const routes: Routes = [
  // { path: "", redirectTo: "/salesleadger", pathMatch: "full" },
  { path: "salesledger", component: SalesleadgerComponent },
  { path: "purchaseledger", component: PurchaseleadgerComponent },
  {
    path: "transactionalstatement",
    component: TransactionalstatementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
