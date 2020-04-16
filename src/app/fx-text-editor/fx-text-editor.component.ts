import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core'
import { FormControl } from '@angular/forms'
import { EditorChangeContent, EditorChangeSelection, QuillModules } from 'ngx-quill'
import 'quill-emoji/dist/quill-emoji.js'
import ImageResize from 'quill-image-resize-module'
import Quill from 'quill'

Quill.register('modules/imageResize', ImageResize)

@Component({
  selector: 'fx-editor',
  templateUrl: './fx-text-editor.component.html',
  styleUrls: ['./fx-text-editor.component.scss'],
  host: {
    class: "flex11 fx-coll"
  }
})
export class FxTextEditorComponent {
  blured = false
  focused = false

  @Input() content: any;
  @Output() contentChange: EventEmitter<any> = new EventEmitter();
  
  @Input() formControl: FormControl;
  @Output() formControlChange: EventEmitter<FormControl> = new EventEmitter();
  
  modules: QuillModules = {
    imageResize: {},
    'emoji-shortname': true,
    'emoji-textarea': false,
    'emoji-toolbar': true,
    
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      [{ 'header': 1 }, { 'header': 2 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent

      [{ 'size': ['small', false, 'large', 'huge'] }, { 'align': [] }, { 'color': [] }, 'clean'],  // custom dropdown

      ['link', 'image', 'emoji']                         // link and image, video
    ]
  }

  changeHandler(event) {
    console.log(event)
  }

  elmtRef;
  constructor(ref: ElementRef) {
    this.elmtRef = ref.nativeElement
    this.content = "Hello world"
  }
  created(event) {
    // tslint:disable-next-line:no-console
    // console.log('editor-created', event)
  }

  changedEditor(event: EditorChangeContent | EditorChangeSelection) {
    // tslint:disable-next-line:no-console
    // console.log('editor-change', event)
  }

  focus($event) {
    // tslint:disable-next-line:no-console
    // console.log('focus', $event)
    this.focused = true
    this.blured = false
  }

  blur($event) {
    // tslint:disable-next-line:no-console
    // console.log('blur', $event)
    this.focused = false
    this.blured = true
  }
}