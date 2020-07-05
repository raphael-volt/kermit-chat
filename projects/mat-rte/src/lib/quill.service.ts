import { Injectable, Inject, Injector, NgZone } from '@angular/core';
import { MatImageResizeModule } from './mat-image/mat-image-resize';
import { MatDialog } from '@angular/material/dialog';
import { QuillEmojiMartToolbar } from './quill-emoji-mart/quill/emoji-toolbar';
import { QuillEmojiMartBlot } from './quill-emoji-mart/quill/emoji-blot';
import { EmojiService } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Overlay, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { EMOJI_OPTIONS } from "./quill-emoji-mart/quill/emoji.module";
import { MAT_RTE_CONFIG_TOKEN, MatRteConfig, DEFAULT_MAT_RTE_CONFIG } from './mart-emoji.config';
import { DomSanitizer } from '@angular/platform-browser';
import Quill from 'quill';

import { DOWNLOAD } from './quill';
import { DownloadBlot } from "./quill-download/download.blot";
import { DownloadModule } from "./quill-download/download.module";
import { DownloadService } from './quill-download/download.service';
const Link = Quill.import("formats/link")
/*
 Type 
 'import("/home/raphael/projects/kermit/kermit-chat/dist/mat-rte/lib/quill-download/download.service").DownloadService' 
 is not assignable to type 
 'import("/home/raphael/projects/kermit/kermit-chat/projects/mat-rte/src/lib/quill-download/download.service").DownloadService'.
 */
const checkConfig = (config) => {
  if (config) {
    let cfg = DEFAULT_MAT_RTE_CONFIG
    if (!config.emoji) {
      config.emoji = cfg.emoji
    }
    else {
      if (!config.emoji.backgroundImageFn) {
        config.emoji.backgroundImageFn = cfg.emoji.backgroundImageFn
      }
    }
    if (!config.quill)
      config.quill = cfg.quill
  }
  return config
}

@Injectable({
  providedIn: 'root'
})
export class QuillService {
  get downloadFileMapId() {
    return this._downloadFileMapId
  }
  private _downloadFileMapId: number = NaN
  constructor(
    @Inject(MAT_RTE_CONFIG_TOKEN) public rteConfig: MatRteConfig,
    public dialog: MatDialog,
    public emoji: EmojiService,
    public download: DownloadService,
    public overlay: Overlay,
    public injector: Injector,
    public zone: NgZone,
    private sanitizer: DomSanitizer) {
    EMOJI_OPTIONS.emoji = emoji
    EMOJI_OPTIONS.overlay = overlay
    this.initQuill()
    checkConfig(rteConfig)
  }

  private _quillInstance

  deltaToHTML(ops, sanitize: boolean = false) {
    let quill = this._quillInstance
    if (!quill) {
      quill = this.getViewInstance(document.createElement("div"))
      this._quillInstance = quill
    }
    quill.setContents(ops)
    const html = quill.root.innerHTML
    return sanitize ? this.sanitizer.bypassSecurityTrustHtml(html) : html
  }

  downloadUrlFn: (id: number) => string

  private initQuill() {
    Quill.debug("error")
    const Block = Quill.import('blots/block')
    Block.tagName = 'div'
    Quill.register(Block)
    Quill.register(`modules/${DOWNLOAD}`, DownloadModule)
    Quill.register(`formats/${DOWNLOAD}`, DownloadBlot)
    Quill.register('formats/rteemoji', QuillEmojiMartBlot)
    Quill.register('modules/rteemoji', QuillEmojiMartToolbar)
    Quill.register('modules/matImageResize', MatImageResizeModule)
    const Size = Quill.import('attributors/style/size')
    Size.whitelist = this.rteConfig.quill.toolbarSizes.map(s => s.size)
    Quill.register(Size, true)
  }

  getViewInstance(element: HTMLElement) {
    return new Quill(element, {
      theme: 'snow',
      readOnly: true,
      modules: {
        toolbar: false,
        rteemoji: {
          emoji: this.emoji
        },
        download: {}
      }
    })
  }
  getEditorInstance(toolbar: HTMLElement, editor: HTMLElement, placeHolder: string = "message"): any {
    const dialog = this.dialog
    const overlay = this.overlay
    const download = this.download
    const injector = this.injector
    const quill = new Quill(editor, {
      theme: 'snow',
      placeholder: placeHolder,
      modules: {
        download: {
          editable: true,
          overlay,
          download,
          injector,
          zone: this.zone
        },
        rteemoji: {
          emoji: this.emoji,
          overlay,
          editor
        },
        matImageResize: {
          dialog: dialog
        },
        toolbar: {
          container: toolbar,
          handlers: {
            link(value) {
              if (value) {
                const range = this.quill.getSelection();
                if (range == null || range.length === 0) return;
                let preview = this.quill.getText(range);
                const { tooltip } = this.quill.theme;
                tooltip.boundsContainer = this.quill.root
                tooltip.edit('link', preview);
                setTimeout(() => tooltip.textbox.setAttribute('placeholder', "...url"))
              } else {
                this.quill.format('link', false);
              }
            }

          }
        }
      }
    })
    return quill
  }
}

