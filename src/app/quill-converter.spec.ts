import { TestBed } from "@angular/core/testing";
import { MatRteModule } from 'mat-rte';
import { EmojiService } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import Quill from "quill";


describe('Quill converter', () => {
  let service: EmojiService
  let editor
  let quill
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EmojiService
      ],
      imports: [
        MatRteModule,
        PickerModule
      ]
    });

    service = TestBed.inject(EmojiService);
    const e = document.createElement('div')
    quill = new Quill(e, {
      theme: 'snow',
      readOnly: true,
      modules: {
        toolbar: false
      }
    })
    editor = quill.editor
  });


  it('should create EmojiService', () => {
    expect(service).toBeTruthy()
  })

  it('should create Quill', () => {

    expect(quill).toBeTruthy()
  })
  it('should convert Delta to html', () => {

    quill.setContents({
      ops: [
        {
          insert: '0123'
        },
        {
          insert: '\n'
        }
      ]
    })
    
    expect(quill.getText()).toEqual('0123\n')
    expect(quill.root.innerHTML).toEqual('<p>0123</p>')
    quill.setContents({
      ops: [
        {
          insert: '4567'
        },
        {
          insert: '\n'
        }
      ]
    })
    expect(quill.root.innerHTML).toEqual('<p>4567</p>')
  })
  
  
})