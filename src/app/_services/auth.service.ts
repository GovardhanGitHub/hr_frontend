import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

const AUTH_API = "http://localhost:8080/api/auth/";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    // "Access-Control-Allow-Origin": "*",
    // "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE,PUT",
  }),
};

@Injectable({
  providedIn: "root",
})
export class AuthService {
  headers;
  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders();
    this.headers = this.headers
      .set("Access-Control-Allow-Origin", "*")
      .set("Content-Type", "application/json")
      .set("Access-Control-Expose-Headers", "Content-Length");
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + "signin",
      {
        username,
        password,
      },
      this.headers
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + "signup",
      {
        username,
        email,
        password,
      },
      this.headers
    );
  }
}
