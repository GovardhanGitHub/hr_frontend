import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { DefaultComponent } from "./dashboards/default/default.component";
import { ProfileComponent } from "./profile/profile.component";
import { AddProfileComponent } from "./add-profile/add-profile.component";

const routes: Routes = [
  { path: "", redirectTo: "dashboard" },
  { path: "dashboard", component: DefaultComponent },
  {
    path: "dashboards",
    loadChildren: () =>
      import("./dashboards/dashboards.module").then((m) => m.DashboardsModule),
  },
  {
    path: "addProfile",
    component: AddProfileComponent,
  },
  {
    path: "updateProfile/:id",
    component: AddProfileComponent,
  },
  {
    path: "showProfile/:id",
    component: ProfileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
