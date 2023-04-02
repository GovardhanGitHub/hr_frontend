import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { AuthenticationService } from "../../../core/services/auth.service";
import { environment } from "../../../../environments/environment";
import { first } from "rxjs/operators";
import { UserProfileService } from "../../../core/services/user.service";
import { AuthService } from "src/app/_services/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  submitted = false;
  error = "";
  successmsg = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserProfileService,
    private authService: AuthService
  ) {}

  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = "";

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      username: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.signupForm.controls;
  }

  position(msg, icon) {
    Swal.fire({
      position: "top-end",
      icon: icon,
      title: msg,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  /**
   * On submit form
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    }

    const { username, email, password } = this.signupForm.getRawValue();
    console.log(
      "🚀 ~ file: signup.component.ts:64 ~ SignupComponent ~ onSubmit ~ username, email, password:",
      username,
      email,
      password
    );

    this.authService.register(username, email, password).subscribe({
      next: (data) => {
        console.log(
          "🚀 ~ file: signup.component.ts:76 ~ SignupComponent ~ this.authService.register ~ data:",
          data
        );

        this.position("successfully Registerd.", "success");
        // this.router.navigate(["/dashboard"]);
        this.router.navigate(["/account/login"]);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: (err) => {
        this.position("failed Registration! try Again.", "warning");
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      },
    });

    //else {
    //   if (environment.defaultauth === 'firebase') {
    //     this.authenticationService.register(this.f.email.value, this.f.password.value).then((res: any) => {
    //       this.successmsg = true;
    //       if (this.successmsg) {
    //         this.router.navigate(['/dashboard']);
    //       }
    //     })
    //       .catch(error => {
    //         this.error = error ? error : '';
    //       });
    //   } else {
    //     this.userService.register(this.signupForm.value)
    //       .pipe(first())
    //       .subscribe(
    //         data => {
    //           this.successmsg = true;
    //           if (this.successmsg) {
    //             this.router.navigate(['/account/login']);
    //           }
    //         },
    //         error => {
    //           this.error = error ? error : '';
    //         });
    //   }
    // }
  }
}
