import { Component, Directive, ViewEncapsulation, ChangeDetectionStrategy, Output, ViewChild, AfterViewInit, OnDestroy, ContentChild, AfterContentInit } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

@Directive({
  selector: 'panel-header, [panel-header]',
  host: { 'class': 'panel-header panel-flex-row' }
})
export class PanelHeaderDirective {

}
@Directive({
  selector: 'panel-content, [panel-content]',
  host: { 'class': 'panel-content' }
})
export class PanelContentDirective {

}
@Directive({
  selector: 'panel-footer, [panel-footer]',
  host: { 'class': 'panel-footer panel-flex-row' }
})
export class PanelFooterDirective {

}

@Directive({
  selector: "footer-spacer, [footer-spacer]",
  host: { 'class': 'footer-spacer' }
})
export class FooterSpacer {

}

//panel-close-button

@Directive({
  selector: "panel-close-button, [panel-close-button]",
  host: { '(click)': 'close.emit()' }
})
export class PanelCloseButton {
  @Output()
  close: EventEmitter<void> = new EventEmitter()
}

@Component({
  selector: 'dialog-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
  host: { 'class': 'dialog-panel' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelComponent implements AfterViewInit, AfterContentInit, OnDestroy {
  @Output()
  close: EventEmitter<void> = new EventEmitter()

  @ContentChild(PanelCloseButton)
  closeButton: PanelCloseButton
  private clickSubscription: Subscription
  constructor() { }

  ngAfterContentInit() {
    console.log('ngAfterContentInit', this.closeButton)
    if (this.closeButton) {
      this.clickSubscription = this.closeButton.close.subscribe(() => {
        console.log('close internal')
        this.close.next()
      })
    }
  }
  ngAfterViewInit() {
  }
  ngOnDestroy() {
    if (this.clickSubscription)
      this.clickSubscription.unsubscribe()
  }
}