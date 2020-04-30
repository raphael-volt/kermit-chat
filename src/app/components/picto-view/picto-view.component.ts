import { EventEmitter, Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input, Output, ChangeDetectorRef } from '@angular/core';
import { DialogService } from 'src/app/dialog/dialog.service';
import { first } from 'rxjs/operators';
import { User, isUser } from 'src/app/vo/vo';
import { ApiService } from 'src/app/api/api.service';
import { PictoEditorComponent } from '../picto-editor/picto-editor.component';

@Component({
  selector: 'picto-view',
  templateUrl: './picto-view.component.html',
  styleUrls: ['./picto-view.component.scss'],
  host: {
    class: "mat-border picto-view"
  },

  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PictoViewComponent implements OnInit {

  @Output()
  imgChange: EventEmitter<string> = new EventEmitter<string>()

  constructor(
    private dialog: DialogService,
    private api: ApiService,
    private cdr: ChangeDetectorRef) {
    this.user = api.user
    this.checkImgSrc(this.user)
  }

  @Input()
  user: User

  _imgSrc: boolean = false
  get imgSrc(): boolean {
    return this._imgSrc
  }
  set imgSrc(value: boolean) {
    this._imgSrc = value
  }

  imgData: string

  private checkImgSrc(user: User) {
    if (!user || !isUser(user))
      this.imgSrc = false
    else
      if (!user.picto || isNaN(user.picto)) {
        this.imgSrc = false
      }
      else {
        this.imgSrc = true
      }

  }
  ngOnInit(): void {

  }

  setImgData = (data: string) => {
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
