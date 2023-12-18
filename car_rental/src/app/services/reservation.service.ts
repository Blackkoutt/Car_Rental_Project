import { Injectable } from '@angular/core';
import {Reservation} from '../models/reservation';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private url = "reserve";
  constructor(private http:HttpClient) { }

  calculateTotalCost(startDate: Date, endDate: Date, dailyCost: number): Promise<number> {
    return new Promise((resolve, reject) => {
      // Simulacja operacji asynchronicznej, na przykład zapytania HTTP
      setTimeout(() => {
        try {
          const timeDifference = endDate.getTime() - startDate.getTime();
          const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
          const totalCost = daysDifference * dailyCost;

          resolve(totalCost);
        } catch (error) {
          reject(error);
        }
      }, 0);
    });
  }
  public getReservations():Observable<Reservation[]>{
    return this.http.get<Reservation[]>(`${environment.apiUrl}/${this.url}`);
  }
  public getNextId(): Observable<number> {
    let id = this.getReservations().pipe(
      map(reservations => {
        const lastReservation:Reservation = reservations[reservations.length - 1];
        let reservation = lastReservation? +lastReservation["reservation_id"] + 1 : 1;
        console.log("reservation",reservation);
        return reservation;
      })
    );
    console.log("id", id);
    return id;
  }
  public getOneReservation(reservation_id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${environment.apiUrl}/${this.url}/${reservation_id}`);
  }
  
  public updateReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${environment.apiUrl}/${this.url}/${reservation.ReservationId}`, reservation);
  }
  
  public createReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(`${environment.apiUrl}/${this.url}`, reservation);
  }
  
  public deleteReservation(reservation: Reservation): Observable<Reservation[]> {
    return this.http.delete<Reservation[]>(`${environment.apiUrl}/${this.url}/${reservation.ReservationId}`);
  }
}
