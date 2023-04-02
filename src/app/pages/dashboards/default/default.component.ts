import { EmpService } from "./../../../_services/emp.service";
import { Router } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";
import { emailSentBarChart, monthlyEarningChart } from "./data";
import { ChartType } from "./dashboard.model";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { EventService } from "../../../core/services/event.service";

import { ConfigService } from "../../../core/services/config.service";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-default",
  templateUrl: "./default.component.html",
  styleUrls: ["./default.component.scss"],
})
export class DefaultComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  pageSize = 7;
  page = 1;

  constructor(private router: Router, private empService: EmpService) {}

  addEmp() {
    this.router.navigate(["/addProfile"]);
  }

  emps: any[];
  public searchCtrl: FormControl = new FormControl();
  private _onDestroy = new Subject<void>();

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Employees" },
      { label: "Employee List", active: true },
    ];

    this.getAllEmps();

    this.searchCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.search();
      });
  }

  public filteredEmps: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  search() {
    console.log("Search invoked");
    let search = this.searchCtrl.value;
    console.log("Search term is:", search);
    if (!search) {
      console.log("Search is empty");
      console.log("Filtered media is:", this.filteredEmps);
      this.filteredEmps.next(this.emps.slice());
      return;
    } else {
      console.log("Filtered media is:", this.filteredEmps);
      console.log("Search is:", search);
      search = search.toLowerCase();
    }

    this.filteredEmps.next(
      this.emps.filter((user) => {
        console.log(
          "🚀 ~ file: default.component.ts:77 ~ DefaultComponent ~ search ~ user:",
          user
        );
        return (
          user.firstName?.toLowerCase().indexOf(search) > -1 ||
          user.lastName?.toLowerCase().indexOf(search) > -1
        );
      })
    );
  }

  getAllEmps() {
    this.empService.getAllEmp().subscribe({
      next: (res) => {
        console.log("Received users:", res);
        this.emps = res;
        this.filteredEmps.next(this.emps);
      },
      error: (error) => {
        console.log("Received error downloading users:", error);
      },
    });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
