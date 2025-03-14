import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonEditComponent } from './person-edit.component';
import {ReactiveFormsModule, Validators} from "@angular/forms";
import { PersonService } from 'src/app/services/person.service';
import {DepartmentService} from "../../services/department.service";
import {ActivatedRoute, Router} from '@angular/router';
import {of} from "rxjs";
import {DepartmentViewModel} from "../../models/department-view-model";

describe('PersonEditComponent', () => {
  let component: PersonEditComponent;
  let fixture: ComponentFixture<PersonEditComponent>;
  let personService: any, departmentService: any, router: any, activateRoute: any;
  let mockDepartment: DepartmentViewModel[] = [
    {id: "1", name: 'Finance'},
    {id: "2", name: 'Sales'}
  ]
  let mockPerson = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    departmentId: "2",
    departmentName: 'Sales',
  };

  const personServiceSpy = jasmine.createSpyObj('PersonService', {
    'getById': of(mockPerson),
    'addPerson': of({}),
    'updatePerson': of({})
  });
  const departmentServiceSpy = jasmine.createSpyObj('DepartmentService', { getDepartments: of(mockDepartment)});
  const routerSpy = jasmine.createSpyObj('Router', {
    navigate: Promise.resolve(true)
  });

  const activatedRouteSpy = {
    snapshot: {
      paramMap: {
        get: (key: string) => key === 'id' ? '1' : null,
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, PersonEditComponent],
      providers: [
        { provide: PersonService, useValue: personServiceSpy },
        { provide: DepartmentService, useValue: departmentServiceSpy },
        { provide: Router, useValue: routerSpy},
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonEditComponent);
    component = fixture.componentInstance;
    personService = TestBed.get(PersonService);
    departmentService = TestBed.inject(DepartmentService);
    router = TestBed.inject(Router);
    activateRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  afterEach(() => {
    personService.updatePerson.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the person form with validators', () => {
    expect(component.personForm).toBeDefined();
    expect(component.firstName?.hasValidator(Validators.required)).toBeTrue();
    expect(component.lastName?.hasValidator(Validators.required)).toBeTrue();
    expect(component.dateOfBirth?.hasValidator(Validators.required)).toBeTrue();
    expect(component.department?.hasValidator(Validators.required)).toBeTrue();
  });

  it('should load departments on initialization', () => {
    component.getDepartments();
    expect(component.departmentsDataSource.length).toBeGreaterThan(0);
  });

  it('should populate the form when editing a person', () => {
    component.getPersonById();
    expect(component.firstName?.value).toBe('John');
    expect(component.lastName?.value).toBe('Doe');
    expect(component.dateOfBirth?.value).toBe('1990-01-01');
    expect(component.department?.value).toBe("2");
  });

  it('should update the person when in edit mode', () => {
    const mockPerson = { id: 1, firstName: 'John', lastName: 'Doe', dateOfBirth: '1990-01-01', departmentId: "2", departmentName: 'Sales' };
    component.person = mockPerson;
    component['personId'] = 1;
    component.personForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      department: "2"
    });
    component.savePerson();
    expect(personService.updatePerson).toHaveBeenCalled();
  });

  it('should add a new person when in add mode', () => {
    component.person = undefined;
    component.personForm.patchValue({
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: '1992-02-02',
      department: "3",
    });
    component.savePerson();
    expect(personService.addPerson).toHaveBeenCalled();
  });

  it('should navigate to the person list after saving', () => {
    const navigateSpy = router.navigate;
    component['navigateToPersonList']();
    expect(navigateSpy).toHaveBeenCalledWith(['/person-list']);
  });

  it('should not call services if the form is invalid', () => {
    component.personForm.patchValue({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      department: ''
    });

    component.savePerson();
    expect(personService.updatePerson).not.toHaveBeenCalled();
  });

});
