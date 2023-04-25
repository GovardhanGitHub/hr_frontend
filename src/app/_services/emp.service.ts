import { API_URL } from "./../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

const AUTH_API = API_URL + "/employees/";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE,PUT",
  }),
};

@Injectable({
  providedIn: "root",
})
export class EmpService {
  constructor(private http: HttpClient) {}

  addEmp(body: any): Observable<any> {
    return this.http.post(AUTH_API, body);
  }

  updateEmp(body: any, id): Observable<any> {
    return this.http.put(AUTH_API + id, body);
  }

  getAllEmp(): Observable<any> {
    return this.http.get(AUTH_API);
  }
  getEmp(id): Observable<any> {
    return this.http.get(AUTH_API + id);
  }
}
