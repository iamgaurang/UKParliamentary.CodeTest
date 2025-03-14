import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonListComponent } from './person-list.component';
import {PersonService} from "../../services/person.service";
import {of} from "rxjs";
import {PersonViewModel} from "../../models/person-view-model";
import {RouterTestingModule} from "@angular/router/testing";

describe('PersonListComponent', () => {
  let component: PersonListComponent;
  let fixture: ComponentFixture<PersonListComponent>;
  let personService: jasmine.SpyObj<PersonService>;

  beforeEach(async () => {
    (window as any).bootstrap = {
      Modal: jasmine.createSpy('Modal').and.callFake(() => ({
        show: jasmine.createSpy('show'),
        hide: jasmine.createSpy('hide'),
      })),
    };

    (window as any).bootstrap.Modal.getInstance = jasmine.createSpy('getInstance').and.callFake(() => ({
      hide: jasmine.createSpy('hide'),
    }));

    const persons: PersonViewModel[] = [
      { id: 1, firstName: 'John', lastName: 'Doe', departmentName: 'Finance', dateOfBirth: '01/01/1992',  departmentId: "1" },
      { id: 2, firstName: 'Jane', lastName: 'Smith', departmentName: 'Sales', dateOfBirth: '01/01/1994', departmentId: "2" },
    ]

    const personServiceMock = jasmine.createSpyObj('PersonService', {
      'getPersons': of(persons),
      'deletePerson': of({})
    });

    await TestBed.configureTestingModule({
      imports: [PersonListComponent, RouterTestingModule],
      providers: [
        { provide: PersonService, useValue: personServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonListComponent);
    component = fixture.componentInstance;
    personService = TestBed.inject(PersonService) as jasmine.SpyObj<PersonService>;

    fixture.detectChanges();
  });

  afterEach(() => {
    personService.getPersons.calls.reset();

    (window as any).bootstrap.Modal.calls.reset();
    personService.deletePerson.calls.reset();
    if ((window as any).bootstrap.Modal.getInstance) {
      (window as any).bootstrap.Modal.getInstance.calls.reset();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load persons on initialization', () => {
    component.loadPersons();
    expect(personService.getPersons).toHaveBeenCalled();
    expect(component.persons.length).toBe(2);
    expect(component.persons[0].firstName).toBe('John');
  });

  it('should call deletePerson and hide modal on confirmDelete', () => {
    const mockElement = document.createElement('div');
    spyOn(document, 'getElementById').and.returnValue(mockElement);

    const mockModalInstance = {
      hide: jasmine.createSpy('hide'),
    };
    (window as any).bootstrap.Modal.getInstance.and.returnValue(mockModalInstance);

    personService.deletePerson.and.returnValue(of({}));

    component.personIdToDelte = 1;
    component.confirmDelete();

    expect(personService.deletePerson).toHaveBeenCalledWith(1);
    expect((window as any).bootstrap.Modal.getInstance).toHaveBeenCalledWith(mockElement);
    expect(mockModalInstance.hide).toHaveBeenCalled();
    expect(component.personIdToDelte).toBeUndefined();
  });

  it('should call deletePerson when confirmDelete is executed', () => {

    personService.deletePerson.and.returnValue(of({}));

    component.personIdToDelte = 1;
    component.confirmDelete();

    expect(personService.deletePerson).toHaveBeenCalledWith(1);
    expect(personService.getPersons).toHaveBeenCalled();
  });

  it('should reset personIdToDelte after deletion', () => {

    personService.deletePerson.and.returnValue(of({}));

    component.personIdToDelte = 1;
    component.confirmDelete();

    expect(component.personIdToDelte).toBeUndefined();
  });
});
