import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { UsersComponent } from "./pages/users/users.component";
import { CompanylistComponent } from "./pages/companylist/companylist.component";
import { BankaccountComponent } from "./pages/bankaccount/bankaccount.component";
import { RoleguardGuard } from "src/app/core/guards/roleguard/roleguard.guard";
import { CreditComponent } from "./pages/credit/credit.component";

const routes: Routes = [
  // { path: '', redirectTo: '/company/users', pathMatch: 'full'},
  {
    path: ":id/users",
    component: UsersComponent,
    canActivate: [RoleguardGuard],
  },
  { path: "", component: CompanylistComponent },
  {
    path: ":id/bankaccount",
    component: BankaccountComponent,
    canActivate: [RoleguardGuard],
  },
  {
    path: ":id/credit",
    component: CreditComponent,
    canActivate: [RoleguardGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRoutingModule {}
