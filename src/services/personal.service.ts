import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';  // Import catchError for error handling
import { Personal, GetListPersonal } from '../models/personal';
import { Response } from '../models/response';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {
  private apiUrl = environment.apiUrl + '/Personal';

  constructor(private http: HttpClient) { }

  GetPersonalById(IdPersonal: number): Observable<Response<Personal>> {
    return this.http.get<Response<Personal>>(`${this.apiUrl}/GetPersonalById?IdPersonal=` + IdPersonal)
      .pipe(
        catchError(this.handleError)
      );
  }

  GetPersonal(): Observable<Response<GetListPersonal[]>> {
    return this.http.get<Response<GetListPersonal[]>>(`${this.apiUrl}/GetPersonal`)
      .pipe(
        catchError(this.handleError)
      );
  }

  AddOrUpdatePersonal(obj: Personal): Observable<Response<boolean>> {
    return this.http.post<Response<boolean>>(`${this.apiUrl}/AddOrUpdatePersonal`, obj)
      .pipe(
        catchError(this.handleError)
      );
  }

  DeletePersonal(IdPersonal: number): Observable<Response<boolean>> {
    return this.http.delete<Response<boolean>>(`${this.apiUrl}/DeletePersonal?IdPersonal=` + IdPersonal)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('Ocurrio un error:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
