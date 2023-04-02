import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EmpService } from "src/app/_services/emp.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  id: string;
  emp: any;
  constructor(private route: ActivatedRoute, private empService: EmpService) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    this.updateForm(this.id);
  }

  updateForm(id: string) {
    this.empService.getEmp(id).subscribe((res) => {
      this.emp = res;
    });
  }
}
