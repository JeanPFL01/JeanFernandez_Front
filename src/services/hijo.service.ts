import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Response } from '../models/response';
import { Hijo, GetListHijo } from '../models/hijo';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class HijoService {
  private apiUrl = environment.apiUrl + '/Hijo';

  constructor(private http: HttpClient) {}

  GetHijosByIdPersonal(IdPersonal: number): Observable<Response<GetListHijo[]>> {
    return this.http.get<Response<GetListHijo[]>>(`${this.apiUrl}/GetHijosByIdPersonal?IdPersonal=` + IdPersonal)
      .pipe(
        catchError(this.handleError)
      );
  }

  GetHijoById(IdHijo: number): Observable<Response<Hijo>> {
    return this.http.get<Response<Hijo>>(`${this.apiUrl}/GetHijoById?IdHijo=` + IdHijo)
      .pipe(
        catchError(this.handleError)
      );
  }

  AddOrUpdateHijo(obj: Hijo): Observable<Response<boolean>> {
    return this.http.post<Response<boolean>>(`${this.apiUrl}/AddOrUpdateHijo`, obj)
      .pipe(
        catchError(this.handleError)
      );
  }

  DeleteHijo(IdHijo: number): Observable<Response<boolean>> {
    return this.http.delete<Response<boolean>>(`${this.apiUrl}/DeleteHijo?IdHijo=` + IdHijo)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
