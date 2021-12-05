import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDirectorsComponent } from './create-directors.component';

describe('CreateDirectorsComponent', () => {
  let component: CreateDirectorsComponent;
  let fixture: ComponentFixture<CreateDirectorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDirectorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDirectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
