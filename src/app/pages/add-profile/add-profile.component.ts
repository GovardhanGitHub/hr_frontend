import { EmpService } from "./../../_services/emp.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-add-profile",
  templateUrl: "./add-profile.component.html",
  styleUrls: ["./add-profile.component.scss"],
})
export class AddProfileComponent implements OnInit {
  employeeForm: FormGroup;
  id: string;
  show: boolean;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private empService: EmpService
  ) {
    this.employeeForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", Validators.required],

      address: this.fb.group({
        streetAddress: ["", Validators.required],
        city: ["", Validators.required],
        state: ["", Validators.required],
        zipCode: ["", Validators.required],
      }),

      educationList: this.fb.array([]),
      certificationList: this.fb.array([]),
      employmentList: this.fb.array([]),

      employeeDetails: this.fb.group({
        currentSalary: ["", Validators.required],
        designation: ["", Validators.required],
        dateOfJoining: ["", Validators.required],
        projectDetails: this.fb.group({
          projectTitle: ["", Validators.required],
          projectDescription: ["", Validators.required],
          startDate: ["", Validators.required],
          endDate: [""],
        }),
      }),
    });
  }

  breadCrumbItems: Array<{}>;
  isreadonly = false;
  isUpdate = false;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");

    if (this.id) {
      this.isUpdate = true;
      this.updateForm(this.id);
    }

    this.breadCrumbItems = [
      { label: "Employees" },
      {
        label: this.isUpdate
          ? "Update Employee Details"
          : "Add Employee Details",
        active: true,
      },
    ];
  }

  updateForm(id: string) {
    this.empService.getEmp(id).subscribe((res) => {
      this.employeeForm.patchValue(res);
      this.setEducationList(res?.educationList);
      this.setCertificationList(res?.certificationList);
      this.setEmploymentList(res?.employmentList);
      return;
    });
  }

  // this.setAddresses(this.hero.addresses);

  setEducationList(educationList: any[]) {
    const eFGs = educationList.map((e) => this.fb.group(e));
    const eFormArray = this.fb.array(eFGs);
    this.employeeForm.setControl("educationList", eFormArray);
  }

  setCertificationList(certificationList: any[]) {
    const eFGs = certificationList.map((e) => this.fb.group(e));
    const eFormArray = this.fb.array(eFGs);
    this.employeeForm.setControl("certificationList", eFormArray);
  }

  setEmploymentList(employmentList: any[]) {
    const eFGs = employmentList.map((e) => this.fb.group(e));
    const eFormArray = this.fb.array(eFGs);
    this.employeeForm.setControl("employmentList", eFormArray);
  }

  successMessage = "";

  close() {
    setTimeout(() => (this.show = false), 3000);
  }
  position(msg) {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: msg,
      showConfirmButton: false,
      timer: 1500,
    });
  }
  onSubmit() {
    console.log(this.employeeForm.value);
    if (this.isUpdate) {
      this.empService
        .updateEmp(this.employeeForm.value, this.id)
        .subscribe((res) => {
          this.successMessage = "Updated Successfully!";
          this.position(this.successMessage);
          console.log(
            "🚀 ~ file: add-profile.component.ts:108 ~ AddProfileComponent ~ onSubmit ~ res:",
            res
          );
          this.router.navigate(["/dashboard"]);

          return;
        });
    } else {
      this.empService.addEmp(this.employeeForm.value).subscribe((res) => {
        this.successMessage = "Added Successfully!";
        this.position(this.successMessage);
        console.log(
          "🚀 ~ file: add-profile.component.ts:108 ~ AddProfileComponent ~ onSubmit ~ res:",
          res
        );
        this.router.navigate(["/dashboard"]);
        return;
      });
    }
  }

  addEducation() {
    const education = this.fb.group({
      degree: ["", Validators.required],
      institution: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
    });
    this.educationList.push(education);
  }

  removeEducation(index: number) {
    this.educationList.removeAt(index);
  }

  addCertification() {
    const certification = this.fb.group({
      certificationName: ["", Validators.required],
      certificationAuthority: ["", Validators.required],
      dateEarned: ["", Validators.required],
      certificationNumber: ["", Validators.required],
    });
    this.certificationList.push(certification);
  }

  removeCertification(index: number) {
    this.certificationList.removeAt(index);
  }

  addEmployment() {
    const employment = this.fb.group({
      employer: ["", Validators.required],
      title: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: [""],
    });
    this.employmentList.push(employment);
  }

  removeEmployment(index: number) {
    this.employmentList.removeAt(index);
  }

  get educationList() {
    return this.employeeForm.get("educationList") as FormArray;
  }

  get certificationList() {
    return this.employeeForm.get("certificationList") as FormArray;
  }

  get employmentList() {
    return this.employeeForm.get("employmentList") as FormArray;
  }
}
