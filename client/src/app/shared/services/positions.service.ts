import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Position} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class PositionsService {
  constructor(private http: HttpClient) {
  }
  fetch(category_id: string): Observable<Position[]> {
    return this.http.get<Position[]>(`/api/position/${category_id}`)
  }
  create(position: Position): Observable<Position> {
    return this.http.post<Position>('/api/position', position)
  }
}
