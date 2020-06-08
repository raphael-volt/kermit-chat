import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RteDialogComponent } from './rte-dialog.component';

describe('RteDialogComponent', () => {
  let component: RteDialogComponent;
  let fixture: ComponentFixture<RteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
