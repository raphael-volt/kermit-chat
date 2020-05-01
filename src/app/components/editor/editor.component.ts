import { Component, OnInit } from '@angular/core';
import { FormControl, ValidatorFn, AbstractControl, Validators } from '@angular/forms';
import { RteData } from '../rte/editor/rte.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  host: {
    class: "main-view fx-coll"
  }
})
export class EditorComponent implements OnInit {

  constructor() {
    /*
    this.control = new FormControl(null, (control: AbstractControl) => {
      const data: RteData = control.value
      if (data && data.length)
        return null
      return { require: { value: true } }
    })
    */
   this.control = new FormControl(null, Validators.required)
    this.control.valueChanges.subscribe(value => {
      console.log('this.control.valueChanges', value)
    })

  }

  control: FormControl

  private _rteData
  set rteData(value) {
    console.log('rteData', value)
    this._rteData = value
  }
  get rteData() {
    return this._rteData
  }
  ngOnInit(): void {
  }

  rteChange(event) {
    console.log(event)
  }

}
