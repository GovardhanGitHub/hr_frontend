import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AuthenticationService } from "../../../core/services/auth.service";
import { AuthfakeauthenticationService } from "../../../core/services/authfake.service";

import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";

import { environment } from "../../../../environments/environment";
import { AuthService } from "src/app/_services/auth.service";
import { StorageService } from "src/app/_services/storage.service";
import Swal from "sweetalert2";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  error = "";
  returnUrl: string;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    private authService: AuthService,
    private tokenStorage: StorageService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });

    // reset login status
    // this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
    console.log(
      "🚀 ~ file: login.component.ts:53 ~ LoginComponent ~ ngOnInit ~ this.returnUrl:",
      this.returnUrl
    );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = "";
  roles: string[] = [];

  /**
   * Form submit
   */

  position(msg, icon) {
    Swal.fire({
      position: "top-end",
      icon: icon,
      title: msg,
      showConfirmButton: false,
      timer: 1000,
    });
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.getRawValue();
    console.log(
      "🚀 ~ file: login.component.ts:77 ~ LoginComponent ~ onSubmit ~ username, password:",
      username,
      password
    );

    this.authService.login(username, password).subscribe({
      next: (data) => {
        console.log(
          "🚀 ~ file: login.component.ts:81 ~ LoginComponent ~ this.authService.login ~ data:",
          data
        );
        this.position("login successfully!", "success");
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        // this.reloadPage();
        this.router.navigate(["/dashboard"]);
        return;
      },
      error: (err) => {
        this.position("login failed! try Again.", "warning");
        this.loginForm.reset();
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      },
    });

    // else {
    //   if (environment.defaultauth === 'firebase') {
    //     this.authenticationService.login(this.f.email.value, this.f.password.value).then((res: any) => {
    //       this.router.navigate(['/dashboard']);
    //     })
    //       .catch(error => {
    //         this.error = error ? error : '';
    //       });
    //   } else {
    //     this.authFackservice.login(this.f.email.value, this.f.password.value)
    //       .pipe(first())
    //       .subscribe(
    //         data => {
    //           this.router.navigate(['/dashboard']);
    //         },
    //         error => {
    //           this.error = error ? error : '';
    //         });
    //   }
    // }
  }

  reloadPage(): void {
    window.location.reload();
  }
}
