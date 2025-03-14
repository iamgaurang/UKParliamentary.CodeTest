import { Component } from '@angular/core';
import {PersonViewModel} from "../../models/person-view-model";
import {PersonService} from "../../services/person.service";
import { CommonModule } from '@angular/common';
import {RouterLink} from "@angular/router";
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-person-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './person-list.component.html',
  styleUrl: './person-list.component.scss'
})
export class PersonListComponent {
  persons: PersonViewModel[] = [];
  personIdToDelte?: number;
  private modalInstance?: any;

  constructor(private personService: PersonService) {
    this.loadPersons();
  }

  // Call the service to load people
  loadPersons() {
    this.personService.getPersons().subscribe((data: PersonViewModel[]) => {
      this.persons = data; // Assign the data received from API to the local variable
    });
  }

  openDeleteModal(personId: number) {
    this.personIdToDelte = personId;

    const modalElement = document.getElementById('deleteConfirmationModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement); // Create a new modal instance
      this.modalInstance.show(); // Show the modal
    }
  }

  confirmDelete() {
    if (this.personIdToDelte) {

      this.personService.deletePerson(this.personIdToDelte).subscribe({
        next: () => {
          debugger
          this.loadPersons();
        }
      })

      // Close the modal
      const modalElement = document.getElementById('deleteConfirmationModal');
      if (modalElement) {
        const bootstrapModal = window.bootstrap.Modal.getInstance(modalElement);
        if (bootstrapModal) {
          bootstrapModal.hide();
        }
      }

      this.personIdToDelte = undefined;
    }
  }
}
