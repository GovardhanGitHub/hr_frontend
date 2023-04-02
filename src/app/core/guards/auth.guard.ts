import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

import { AuthenticationService } from "../services/auth.service";
import { AuthfakeauthenticationService } from "../services/authfake.service";

import { environment } from "../../../environments/environment";
import { StorageService } from "src/app/_services/storage.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    private storageService: StorageService
  ) {}
  isLoggedIn = false;
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // if (environment.defaultauth === 'firebase') {
    //     const currentUser = this.authenticationService.currentUser();
    //     if (currentUser) {
    //         // logged in so return true
    //         return true;
    //     }
    // } else {
    //     const currentUser = this.authFackservice.currentUserValue;
    //     if (currentUser) {
    //         // logged in so return true
    //         return true;
    //     }
    // }
    // not logged in so redirect to login page with the return url
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      // this.router.navigate(["/dashboard"]);
      return true;
    }

    this.router.navigate(["/account/login"], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
