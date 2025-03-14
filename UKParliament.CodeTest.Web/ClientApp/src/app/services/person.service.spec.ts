import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PersonService } from './person.service';
import { PersonViewModel } from '../models/person-view-model';

describe('PersonService', () => {
  let service: PersonService;
  let httpMock: HttpTestingController;
  const mockBaseUrl = 'http://localhost/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PersonService,
        { provide: 'BASE_URL', useValue: mockBaseUrl }
      ],
    });

    service = TestBed.inject(PersonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all persons using getPersons', () => {
    const mockResponse: PersonViewModel[] = [
      { id: 1, firstName: 'John', lastName: 'Doe', dateOfBirth: new Date('11/11/1994').toString(), departmentId: "1", departmentName: "Finance" },
      { id: 1, firstName: 'Jane', lastName: 'Smith', dateOfBirth: new Date('01/02/1988').toString(), departmentId: "2", departmentName: "Sales" },
    ];

    service.getPersons().subscribe((persons) => {
      expect(persons).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${mockBaseUrl}api/person/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return an empty array on getPersons error', () => {
    service.getPersons().subscribe((persons) => {
      expect(persons).toEqual([]);
    });

    const req = httpMock.expectOne(`${mockBaseUrl}api/person/`);
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should fetch a person by ID using getById', () => {
    const mockPerson: PersonViewModel = { id: 1, firstName: 'John', lastName: 'Doe', dateOfBirth: new Date('11/11/1994').toString(), departmentId: "1", departmentName: "" };

    service.getById(1).subscribe((person) => {
      expect(person).toEqual(mockPerson);
    });

    const req = httpMock.expectOne(`${mockBaseUrl}api/person/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPerson);
  });

  it('should add a person using addPerson', () => {
    const newPerson: PersonViewModel = { id: 0, firstName: 'New', lastName: 'Person', dateOfBirth: new Date('11/11/1994').toString(), departmentId: "1", departmentName: "" };
    const mockResponse: PersonViewModel = { id: 3, firstName: 'New', lastName: 'Person', dateOfBirth: new Date('11/11/1994').toString(), departmentId: "1", departmentName: "" };

    service.addPerson(newPerson).subscribe((person: PersonViewModel) => {
      expect(person).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${mockBaseUrl}person/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPerson);
    req.flush(mockResponse);
  });

  it('should return null on addPerson error', () => {
    const newPerson: PersonViewModel = { id: 0, firstName: 'New', lastName: 'Person', dateOfBirth: new Date('11/11/1994').toString(), departmentId: "1", departmentName: "" };

    service.addPerson(newPerson).subscribe((person: PersonViewModel) => {
      expect(person).toBeNull();
    });

    const req = httpMock.expectOne(`${mockBaseUrl}person/`);
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should update a person using updatePerson', () => {
    const updatedPerson: PersonViewModel = { id: 1, firstName: 'Updated', lastName: 'Person', dateOfBirth: new Date('11/11/1994').toString(), departmentId: "1", departmentName: "" };

    service.updatePerson(updatedPerson).subscribe((person: PersonViewModel) => {
      expect(person).toEqual(updatedPerson);
    });

    const req = httpMock.expectOne(`${mockBaseUrl}persons/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedPerson);
    req.flush(updatedPerson);
  });

  it('should return null on updatePerson error', () => {
    const updatedPerson: PersonViewModel = { id: 1, firstName: 'Updated', lastName: 'Person', dateOfBirth: new Date('11/11/1994').toString(), departmentId: "1",departmentName: "" };

    service.updatePerson(updatedPerson).subscribe((person: PersonViewModel) => {
      expect(person).toBeNull();
    });

    const req = httpMock.expectOne(`${mockBaseUrl}persons/1`);
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});
