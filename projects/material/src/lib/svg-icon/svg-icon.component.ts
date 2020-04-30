import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';

@Component({
  selector: 'svg-icon',
  templateUrl: './svg-icon.component.svg',
  styleUrls: ['./svg-icon.component.scss'],
  host: {
    class:"svg-icon"
  }
})
export class SvgIconComponent implements OnInit {

  @Input()
  iconName
  constructor() { }

  ngOnInit(): void {
  }

}
