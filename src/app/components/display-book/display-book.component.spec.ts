import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayBookComponent } from './display-book.component';

describe('DisplayBookComponent', () => {
  let component: DisplayBookComponent;
  let fixture: ComponentFixture<DisplayBookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayBookComponent]
    });
    fixture = TestBed.createComponent(DisplayBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
