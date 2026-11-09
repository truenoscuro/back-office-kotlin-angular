import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Anonymous } from './anonymous';

describe('Anonymous', () => {
  let component: Anonymous;
  let fixture: ComponentFixture<Anonymous>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Anonymous],
    }).compileComponents();

    fixture = TestBed.createComponent(Anonymous);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
