import { of } from 'rxjs';
import { Class } from '../../class/models/Class';
import {ClassService} from "./class.service";
import {TestBed} from "@angular/core/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {Student} from "../../class/models/Student";

describe('ClassService', () => {
  let service: ClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClassService]
    });
    service = TestBed.inject(ClassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of classes', (done) => {
    const mockClasses: Class[] = [
      new Class('2A', 2, 1, [
        new Student('johndoe@email.com', 'john', 'doe'),
        new Student('janedoe@email.com', 'jane', 'doe')
      ], 1),
      new Class('2C', 2, 1, [
        new Student('johndoe@email.com', 'john', 'doe'),
        new Student('janedoe@email.com', 'jane', 'doe')
      ], 2)
    ];
    spyOn(service, 'getClasses').and.returnValue(of(mockClasses));
    service.getClasses().subscribe((classes: Class[]) => {
      expect(classes.length).toBe(2);
      expect(classes[0].name).toBe('2A');
      expect(classes[1].name).toBe('2C');
      done();
    });
  });

  it('should return an empty list if no classes are available', (done) => {
    spyOn(service, 'getClasses').and.returnValue(of([]));
    service.getClasses().subscribe((classes: Class[]) => {
      expect(classes.length).toBe(0);
      done();
    });
  });

  it('should return classes with students', (done) => {
    const mockClasses: Class[] = [
      new Class('2A', 2, 1, [
        new Student('johndoe@email.com', 'John', 'Doe'),
        new Student('janedoe@email.com', 'Jane', 'Doe')
      ], 1),
      new Class('2C', 2, 1, [
        new Student('gerarddoe@email.com', 'Gerard', 'Doe'),
        new Student('janedoe@email.com', 'Jane', 'Doe')
      ], 2)
    ];
    spyOn(service, 'getClasses').and.returnValue(of(mockClasses));
    service.getClasses().subscribe((classes: Class[]) => {
      expect(classes[0].students.length).toBe(2);
      expect(classes[0].students[0].firstName).toBe('John');
      expect(classes[1].students.length).toBe(2);
      expect(classes[1].students[0].firstName).toBe('Gerard');
      done();
    });
  });
});
