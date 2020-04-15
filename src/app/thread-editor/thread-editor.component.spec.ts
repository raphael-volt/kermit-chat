import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadEditorComponent } from './thread-editor.component';

describe('ThreadEditorComponent', () => {
  let component: ThreadEditorComponent;
  let fixture: ComponentFixture<ThreadEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreadEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
