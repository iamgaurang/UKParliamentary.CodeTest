import { TestBed } from '@angular/core/testing';

import { DepartmentService } from './department.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {DepartmentViewModel} from "../models/department-view-model";

describe('DepartmentService', () => {
  let service: DepartmentService;
  let httpMock: HttpTestingController;
  const mockBaseUrl = 'http://localhost/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DepartmentService,
        {provide: 'BASE_URL', useValue: mockBaseUrl},
      ]
    });
    service = TestBed.inject(DepartmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the correct API endpoint when getDepartments is called', () => {
    const mockResponse: DepartmentViewModel[] = [
      { id: '1', name: 'HR' },
      { id: '2', name: 'IT' }
    ];

    service.getDepartments().subscribe((departments) => {
      expect(departments).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${mockBaseUrl}api/department`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle errors and return an empty array when the API request fails', () => {
    service.getDepartments().subscribe((departments) => {
      expect(departments).toEqual([]);
    });

    const req = httpMock.expectOne(`${mockBaseUrl}api/department`);
    expect(req.request.method).toBe('GET');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });


});
