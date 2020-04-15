import { Component, OnInit, ElementRef, ViewContainerRef, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { EmojiService} from '../emoji-service';
import { FocusMonitor } from '@angular/cdk/a11y';
import { OverlayRef, Overlay, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { matSelectAnimations } from '@angular/material/select';
import { Subject, Subscription } from 'rxjs';
import { EmojiListComponent } from '../emoji-list/emoji-list.component';
import { EmojiCategory, EmojiList } from '../emoji';

@Component({
  selector: 'emoji-selector',
  templateUrl: './emoji-selector.component.html',
  styleUrls: ['./emoji-selector.component.scss'],
  animations: [
    matSelectAnimations.transformPanel
  ]
})
export class EmojiSelectorComponent implements OnInit, OnDestroy {

  @ViewChild("trigger")
  triggerRef: ElementRef

  @ViewChild(TemplateRef)
  content: TemplateRef<any>

  _panelDoneAnimatingStream = new Subject<string>()
  focused = false
  stateChanges = new Subject<void>()

  private focusSub: Subscription
  private _overlayRef: OverlayRef
  private _portal: ComponentPortal<EmojiListComponent>


  categories: EmojiCategory[]


  constructor(
    public emojiService: EmojiService,
    private readonly sso: ScrollStrategyOptions,
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>) {

    this.categories = emojiService.getCategories()

    this.focusSub = fm.monitor(elRef, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    })
  }


  showCategory(category: EmojiCategory) {
    this.showSelector(category.items)
  }

  showSelector(items: EmojiList) {
    if (!this._overlayRef) {
      const trigger = this.triggerRef.nativeElement
      const positionStrategy = this._overlay
        .position()
        .connectedTo(trigger,
          { originX: 'start', originY: 'top' },
          { overlayX: 'start', overlayY: 'bottom' })

      this._overlayRef = this._overlay.create({
        hasBackdrop: true,
        backdropClass: "overlay-backdrop",
        scrollStrategy: this.sso.reposition(),
        positionStrategy,
      });

      this.backdropSub = this._overlayRef.backdropClick().subscribe(() => {
        this.close()
      })
      this._portal = new ComponentPortal(EmojiListComponent, this._viewContainerRef);
    }
    const ref = this._overlayRef.attach(this._portal)
    ref.instance.collection = items
  }

  private backdropSub: Subscription

  close() {
    this._overlayRef.detach()
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.focusSub)
      this.focusSub.unsubscribe()
    if (this.backdropSub)
      this.backdropSub.unsubscribe()
    this.stateChanges.complete()
    this.fm.stopMonitoring(this.elRef)
  }
}
