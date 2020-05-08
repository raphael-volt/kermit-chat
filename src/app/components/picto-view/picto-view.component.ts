import { EventEmitter, Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input, Output, ChangeDetectorRef } from '@angular/core';
import { DialogService } from 'src/app/dialog/dialog.service';
import { first } from 'rxjs/operators';
import { User, isUser } from 'src/app/vo/vo';
import { PictoEditorComponent } from '../picto-editor/picto-editor.component';
import { UserService } from 'src/app/api/user.service';

@Component({
  selector: 'picto-view',
  templateUrl: './picto-view.component.html',
  styleUrls: ['./picto-view.component.scss'],
  host: {
    class: "picto-view"
  },

  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PictoViewComponent implements OnInit {

  @Output()
  imgChange: EventEmitter<string> = new EventEmitter<string>()

  constructor(
    private dialog: DialogService,
    userService: UserService,
    private cdr: ChangeDetectorRef) {
    this._user = userService.user
    this.checkImgSrc(this._user, false)
  }

  private _user: User
  @Input()
  set user(value: User) {
    this._user = value
    this.checkImgSrc(value)
  }
  get user(): User {
    return this._user
  }

  _imgSrc: boolean = false
  get imgSrc(): boolean {
    return this._imgSrc
  }
  set imgSrc(value: boolean) {
    this._imgSrc = value
  }

  imgData: string

  checkImgSrc(user: User, detectChange = true) {
    if (!user || !isUser(user))
      this.imgSrc = false
    else
      if (!user.picto || isNaN(user.picto)) {
        this.imgSrc = false
      }
      else {
        this.imgSrc = true
      }
    this.imgData = null
    if(detectChange)
      this.cdr.detectChanges()
  }
  ngOnInit(): void {

  }

  setImgData = (data: string) => {
    if (!data)
      return
    this.imgSrc = false
    this.imgData = data
    this.imgChange.emit(data)
    this.cdr.detectChanges()
  }

  selectAvatar() {
    this.dialog.openAvatarSelector()
      .pipe(first())
      .subscribe(data => {
        this.setImgData(data)
      })
  }

  selectFile(event: Event) {
    const elm: HTMLInputElement = event.target as HTMLInputElement
    this.checkPictoFile(elm.files[0])
      .then(this.openEditor)
      .catch(this.notifyError)
    elm.value = ''
  }

  private openEditor = (data) => {
    const ref = this.dialog.open(PictoEditorComponent)
    const instance: PictoEditorComponent = ref.componentInstance as PictoEditorComponent
    instance.picto = data
    ref.afterClosed().pipe(first())
      .subscribe(this.setImgData)
  }

  notifyError = (...messages) => {
    this.dialog.error(...messages)
  }

  private checkPictoFile(file: File): Promise<string> {
    return new Promise<string>((res, rej) => {
      const fr = new FileReader()
      fr.onload = () => {
        let result: string = fr.result as any
        const im = new Image()
        im.onload = () => {
          if (im.naturalWidth < 200 || im.naturalHeight < 200) {
            return rej("Image trop petite, largeur et hauteur minimum de  200px.")
          }
          res(result)
        }
        im.onerror = () => {
          rej("Le chargement a échoué")
        }
        im.src = result
      }
      fr.onabort = () => {
        rej("Chargement abandonné")
      }
      fr.onerror = () => {
        rej("Erreur de chargement")
      }
      fr.readAsDataURL(file)

    })
  }

}
