import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestColumnComponent } from './test-column.component';
import { TestModel } from '../../../TestOverview/models/testModel';

describe('TestColumnComponent', () => {
  let component: TestColumnComponent;
  let fixture: ComponentFixture<TestColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestColumnComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestColumnComponent);
    component = fixture.componentInstance;
    component.test = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
