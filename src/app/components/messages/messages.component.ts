import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { DialogService } from 'src/app/dialog/dialog.service';
import { first, map } from 'rxjs/operators';
import { ApiService } from 'src/app/api/api.service';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/api/user.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  host: {
    class: "v-box fit gap16 flex-fill message-component"
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSidenav)
  sideNav: MatSidenav

  threadOpen: boolean = false
  navOpen: boolean = true

  constructor(
    private dialog: DialogService,
    public api: ApiService,
    public userService: UserService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute) { }
  getThreadList() {
    if (!this.api.threadList.getValue())
      return this.api.getThreadCollection().pipe(first()).subscribe(this.checkNavOpened)
    this.checkNavOpened()
  }

  private showNavOnIntit: boolean = false
  private checkNavOpened = () => {

    if (!this.threadOpen) {
      this.showNavOnIntit = true
      if (this.sideNav) {
        this.ngAfterViewInit()
      }
    }
  }
  ngAfterViewInit(): void {
    if (this.showNavOnIntit) {
      this.showNavOnIntit = false
      this.sideNav.open()
    }
  }
  ngOnInit(): void {
    const service = this.userService
    if (service.busy) {
      service.getUsers().pipe(first()).subscribe(users => {
        this.getThreadList()
      })
      return
    }
    this.getThreadList()
  }
  @ViewChild("navList")
  private _navList: ElementRef

  openThread(id) {
    this.sideNav.close().then(v => {
      this.router.navigate([id], { relativeTo: this.route })
    })
  }
  showList() {
    //this.sideNav.open()
    this.router.navigate([".."], { relativeTo: this.route, skipLocationChange: false })
  }
  onDeactivate($event) {
    this.sideNav.open()
    this.threadOpen = false
    this.cdr.detectChanges()
  }

  onActivate($event) {
    this.threadOpen = true
    this.navOpen = false
    if (this.sideNav && this.sideNav.opened) {
      this.sideNav.close()
    }
    this.cdr.detectChanges()
  }

  createThread() {
    this.dialog.openThreadEditor().pipe(first()).subscribe(tree => {
      if (tree) {
        console.log(tree.thread.subject)
        console.log(tree.parts[0].content)
      }
    })
  }
  getUserName(id) {
    const user = this.userService.findById(id)
    return user ? user.name : ''
  }

}
