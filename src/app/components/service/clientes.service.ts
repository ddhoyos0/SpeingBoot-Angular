import { Clientes } from './../models/clientes';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { formatDate, DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private httpHeader = new HttpHeaders({'Content-Type': 'application/json'});

  private url = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient, private router: Router) { }

  formatearFecha(createAt: any){
    const datePipe = new DatePipe('es-CO');
    return  datePipe.transform(createAt, 'EEEE dd, MMMM yyyy'); /*formatDate(client.createAt, 'dd/MM/yyyy', 'en_US');*/
  }

  getClientes(page: number): Observable<any> {
    return this.http.get(this.url + '/page/' + page).pipe(
      map((response: any) => {
        (response.content as Clientes[]).map(client => {
          client.nombre = client.nombre.toUpperCase();
          /*client.createAt = this.formatearFecha( client.createAt);*/
          return client;
        });
        return response;
      })
    );
  }

  getClienteId(id: number): Observable<Clientes>{
    return this.http.get<Clientes>(`${this.url}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  addCliente(cliente: Clientes): Observable<any> {
    return this.http.post<any>(this.url, cliente, {headers: this.httpHeader}).pipe(
      catchError(e => {
        if (e.status === 400){
          return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  update(cliente: Clientes): Observable<any>{
    return this.http.put<any>(`${this.url}/${cliente.id}`, cliente, {headers: this.httpHeader}).pipe(
      catchError(e => {
        if (e.status === 400){
          return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Clientes>{
    return this.http.delete<Clientes>(`${this.url}/${id}`, {headers: this.httpHeader}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        Swal(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  uploadImg(archivo: File, id): Observable<HttpEvent<{}>> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);

    const req = new HttpRequest('POST', `${this.url}/upload`, formData, {
      reportProgress: true
    });
    return this.http.request(req);
  }
}
