import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable, of} from 'rxjs';
import { PersonViewModel } from '../models/person-view-model';
@Injectable({
  providedIn: 'root'
})
export class PersonService {
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  // // Below is some sample code to help get you started calling the API

  getPersons() {
    const apiUrl = `${this.baseUrl}api/person/`;
    return this.http.get<PersonViewModel[]>(apiUrl);
  }

  getById(id: number): Observable<PersonViewModel> {
    const apiUrl = `${this.baseUrl}api/person/${id}`;
    return this.http.get<PersonViewModel>(apiUrl)
  }

  // Add a new person to the API
  addPerson(person: PersonViewModel): any {
    const apiUrl = this.baseUrl + 'api/person/create';
    return this.http.post<PersonViewModel>(apiUrl, person);
  }

  // Update a person's information via the API
  updatePerson(updatedPerson: PersonViewModel): any {
    const apiUrl = `${this.baseUrl}api/person/update`;
    return this.http.put<PersonViewModel>(apiUrl, updatedPerson);
  }

  deletePerson(personId: number): any {
    const apiUrl = `${this.baseUrl}api/person/${personId}`;
    return this.http.delete<PersonViewModel>(apiUrl);
  }



}
