import { Component, OnInit } from '@angular/core';
import { PersonViewModel } from '../../models/person-view-model';
import { PersonService } from '../../services/person.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '../../services/department.service';
import { DepartmentViewModel } from '../../models/department-view-model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidationMessagesComponent } from '../../core/validation-messages/validation-messages.component';

@Component({
  selector: 'app-person-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ValidationMessagesComponent],
  templateUrl: './person-edit.component.html',
  styleUrls: ['./person-edit.component.scss']
})
export class PersonEditComponent implements OnInit {
  personForm = new FormGroup({
    firstName: new FormControl("", [Validators.required]),
    lastName: new FormControl("", [Validators.required]),
    dateOfBirth: new FormControl("", [Validators.required]),
    department: new FormControl("", [Validators.required]),
  });

  person: PersonViewModel | undefined;
  departmentsDataSource: DepartmentViewModel[] = [];
  private personId: number = 0;

  constructor(
    private personService: PersonService,
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  public get firstName() {
    return this.personForm.get("firstName");
  }

  public get lastName() {
    return this.personForm.get("lastName");
  }

  public get dateOfBirth() {
    return this.personForm.get("dateOfBirth");
  }

  public get department() {
    return this.personForm.get("department");
  }

  ngOnInit() {
    this.getDepartments();
    this.personId = Number(this.route.snapshot.paramMap.get("id"));

    if (!isNaN(this.personId) && this.personId > 0) {
      this.getPersonById();
    }
  }

  savePerson() {
    if (this.personForm.valid) {
      const personEntity: PersonViewModel = {
        id: this.personId,
        firstName: this.firstName?.value,
        lastName: this.lastName?.value,
        dateOfBirth: this.dateOfBirth?.value,
        departmentId: this.department?.value,
        departmentName: null
      }
      if (this.person) {
          this.personService.updatePerson(personEntity).subscribe({
            next: (result: any) => {
              this.navigateToPersonList();
            },
          })
      } else {
        this.personService.addPerson(personEntity).subscribe({
          next: (result: any) => {
            this.navigateToPersonList();
          },
        })
      }
    }
  }

  private navigateToPersonList() {
    this.router.navigate(['/person-list']).then(r => true);
  }

  getPersonById(): void {
    this.personService.getById(this.personId).subscribe({
      next: (result) => {
        this.person = result;
        this.personForm.setValue({
          firstName: result.firstName!,
          lastName: result.lastName!,
          dateOfBirth: new Date(result.dateOfBirth!).toISOString().split('T')[0],
          department: result.departmentId!,
        });

        this.personForm.markAsPristine();
      },
    });
  }

  getDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (result) => {
        this.departmentsDataSource = result;
      },
    });
  }

}
