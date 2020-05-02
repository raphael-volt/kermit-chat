import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ImageService } from '../../api/image.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  host: {
    class: "main-view fx-coll"
  }
})
export class EditorComponent implements OnInit {

  constructor(imgService: ImageService) {
    
    this.control = new FormControl(null, Validators.required)
    this.control.valueChanges.subscribe(value => {
      console.log('this.control.valueChanges', value)
    })

  }

  control: FormControl

  ngOnInit(): void {
  }

  cropDone(data) {
    console.log('cropDone')
  }

}
