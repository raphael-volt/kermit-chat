import { Directive, ElementRef, Input, HostListener, HostBinding } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Directive({
  selector: '[avatarItem]',
  host: {
    class: "avatar-item-directive"
  }
})
export class AvatarItemDirective {

  @Input()
  set avatarItemSelected(value: boolean) {
    this.setSelected(coerceBooleanProperty(value))
  }
  @HostListener('mouseenter') onMouseEnter() {
    this.setOvered(true)
  }
  
  @HostListener('mouseleave') onMouseLeave() {
    this.setOvered(false)
  }
  
  @HostListener('blur') onBlur() {
    this._focused = false
  }
  
  @HostListener('blur') onFocus() {
    this._focused = true
  }


  private _focused = false
  private _selected = false
  private _hovered = false

  @HostBinding('class.toggle-checked') get selected() { return this._selected; }
  @HostBinding('class.toggle-hovered') get hovered() { return this._hovered; }
  @HostBinding('class.focus-overlay') get focused() { return this._focused; }
  @HostBinding('class.elevation') get elevation() { return this._selected; }
  
  constructor(private ref: ElementRef) { }

  private setOvered(value: boolean) {
    this._hovered = value
  }

  private setSelected(value) {
    this._selected = value
  }
}
