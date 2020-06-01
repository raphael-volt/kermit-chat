import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugEmojiComponent } from './debug-emoji.component';

describe('DebugEmojiComponent', () => {
  let component: DebugEmojiComponent;
  let fixture: ComponentFixture<DebugEmojiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebugEmojiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugEmojiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
