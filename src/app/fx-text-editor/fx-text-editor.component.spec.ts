import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FxTextEditorComponent } from './fx-text-editor.component';

describe('FxTextEditorComponent', () => {
  let component: FxTextEditorComponent;
  let fixture: ComponentFixture<FxTextEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FxTextEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FxTextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
