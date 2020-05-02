import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, AfterContentInit, Optional } from '@angular/core';
import { AvatarService, AvatarType } from '../avatar.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatButtonToggleGroup, MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatDialogRef } from '@angular/material/dialog';
import { first } from 'rxjs/operators';

type AvatarOption = { type: AvatarType, name: string }
type AvatarOptions = AvatarOption[]

const AVATAR_SIZE: number = 140
const AVATAR_MARGIN: number = 10


@Component({
  selector: 'avatar-list',
  templateUrl: './avatar-list.component.html',
  styleUrls: ['./avatar-list.component.scss']
})
export class AvatarListComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentInit {

  @ViewChild("listRef")
  listRef: ElementRef<HTMLElement>

  @ViewChild('drawer')
  drawerRef: ElementRef<HTMLCanvasElement>

  toolbarOptions: AvatarOptions = [
    { type: "avataaars", name: "Humain" },
    { type: "female", name: "Féminin" },
    { type: "male", name: "Masculin" },
    { type: "bottts", name: "Robot" },
    { type: "gridy", name: "Forme" }
  ]

  @ViewChild(MatButtonToggleGroup)
  toolBarGroup: MatButtonToggleGroup

  selectedAvatar: number = -1
  avatars: BehaviorSubject<string[]> = new BehaviorSubject(null)

  selectedType: AvatarType

  numAvatar = 0;

  private changeSub: Subscription

  constructor(private avatar: AvatarService, private dialogRef: MatDialogRef<AvatarListComponent> = null) { }

  cancel() {
    this.dialogRef.close(null)
  }
  close() {
    const svg = this.avatars.getValue()[this.selectedAvatar]
    const cnv = this.drawerRef.nativeElement
    this.avatar.encode(cnv, svg, 400).pipe(first()).subscribe(value => {
      this.dialogRef.close(value)
    }, err => {
      this.cancel()
    })
  }
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeHandler)
    if (this.changeSub)
      this.changeSub.unsubscribe()
  }
  ngAfterContentInit(): void {
    this.resizeHandler()
  }

  ngAfterViewInit(): void {
    this.changeSub = this.toolBarGroup.change.subscribe((change: MatButtonToggleChange) => {
      this.setupAvatars(change.value)
    })
    window.addEventListener('resize', this.resizeHandler)
    setTimeout(() => {
      this.resizeHandler()
      this.toolBarGroup.value = this.toolbarOptions[0].type
      this.setupAvatars(this.toolBarGroup.value)
    }, 200)
  }

  private resizeHandler = (event: Event = null) => {
    if(! this.listRef)
      return
    const current = this.numAvatar
    const list = this.listRef.nativeElement
    const bounds = list.getBoundingClientRect()
    const w = bounds.width
    const h = bounds.height
    const size = AVATAR_SIZE

    let n = 0
    let d = 0
    while (d + size <= w) {
      n++
      d += size
    }
    const nw = n
    n = 0
    d = 0
    while (d + size <= h) {
      n++
      d += size
    }
    const na = n * nw
    if (current != na) {
      this.numAvatar = na
      if (this.selectedType) {
        this.setupAvatars(this.selectedType)
      }
    }
  }

  selectAvatar(i: number, svg: string) {
    if (i == this.selectedAvatar) {
      i = -1
    }
    this.selectedAvatar = i
  }

  refreshAvatars() {
    this.setupAvatars(this.selectedType)
  }

  setupAvatars(value: AvatarType) {
    this.selectedAvatar = -1
    this.selectedType = value
    this.avatars.next(this.avatar.list(value, this.numAvatar, AVATAR_SIZE, AVATAR_MARGIN))
  }

  ngOnInit(): void {
  }

}
