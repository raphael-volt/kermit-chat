
import Quill, { RangeStatic } from 'quill'
import { DownloadBlot } from './download.blot';
import { DownloadData, DOWNLOAD, DOWNLOAD_TOOLTIP_DATA, QLCaretPosition, DownloadTooltipData, DownloadConfig, findDownloads } from '../quill';
import { Subscription } from 'rxjs';
import { OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { QLDownloadTooltip } from './tooltip/tooltip.component';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { dialogTransparentConfig } from '../dialog-transparent-config';
import { ElementRef } from '@angular/core';
import { FileMap } from './download.service';

const Module = Quill.import('core/module')

export class DownloadModule extends Module {

    private fileMap: FileMap = {}
    private selectedText: string
    private currentRange: RangeStatic

    private _portal: ComponentPortal<QLDownloadTooltip>
    private _overlayRef: OverlayRef
    private setTextFlag: boolean = false

    constructor(private quill: Quill, private options: DownloadConfig) {
        super(quill, options)
        if (options.editable === true) {
            options.scrollable = quill['container']
            const toolbar = quill.getModule('toolbar')
            toolbar.addHandler(DOWNLOAD, this.toolbarHandler)
            quill.keyboard.addBinding({
                key: 'D',
                shortKey: true,
                ctrlKey: true
            } as any, (range) => {
                this.range = range
                this.toolbarHandler(true)
                this.range = null
            })
            quill.on('selection-change', this.selectionChange)
            quill.on('text-change', (...args) => {
                if (this.setTextFlag) return
                const srv = this.options.download
                const map = this.fileMap
                const ids = srv.getFileIds(map)
                if (ids) {
                    const ops = quill.getContents().ops
                    const contents = findDownloads(ops)
                    for (const op of contents) {
                        const i = ids.indexOf(op.insert.download.file.id)
                        if (i > -1)
                            ids.splice(i, 1)
                    }
                    for (const id of ids) {
                        delete map[id]
                        srv.unregisterFile(id)
                    }
                }
            })
            quill.root.addEventListener('click', (event) => {
                const e = event.target

                if (e instanceof HTMLElement) {
                    const blot = Quill.find(e, false)
                    if (blot instanceof DownloadBlot) {
                        const index = quill.getIndex(blot)
                        this.currentRange = { index: index, length: blot.length() }
                        this.show(blot.downloadData, blot.domNode)
                        setTimeout(() => {
                            //quill.setSelection(index, this.currentRange.length, "user")
                        }, 30)
                    }
                }
            })
        }
    }

    private selectLocalFile() {
        return new Promise<File>((res) => {
            const input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.onchange = () => {
                const files = input.files
                if (!files.length) {
                    return res(null)
                }
                res(files[0])
            }
            input.click()
        })
    }

    private toolbarHandler = (value) => {
        const quill = this.quill
        const range: RangeStatic = quill.getSelection() || { index: 0, length: 0 }
        this.currentRange = range
        this.selectedText = quill.getText(range.index, range.length)

        this.selectLocalFile().then(file => {
            let label = this.selectedText
            if (!label || !label.length) {
                label = file.name
            }
            const map = this.fileMap
            const service = this.options.download
            const id = service.registerFile(file)
            map[id] = file

            const data: DownloadData = {
                label,
                file: {
                    id: id,
                    name: file.name,
                    size: file.size,
                    mime: file.type,
                    ext: file.name.split(".").pop()
                }
            }
            const quill = this.quill
            const range = this.currentRange
            this.setTextFlag = true
            if (range.length) {
                quill.deleteText(range.index, range.length, "user")
            }
            quill.insertEmbed(range.index, DOWNLOAD, data)
            quill.focus()
            quill.setSelection(range.index + 1, 0)
            setTimeout(() => this.setTextFlag = false)
        })
    }

    private selectionChange = (range: RangeStatic, oldRange: RangeStatic, source) => {
        if (range == null) return;
        if (range.length === 0 && source === "user") {
            let [blot, offset] = this.quill.scroll['descendant'](
                DownloadBlot,
                range.index
            )
            if (blot) {
                const db: DownloadBlot = blot as DownloadBlot
                this.currentRange = { index: range.index, length: blot.length() };

                let dir: QLCaretPosition = "left"
                if (oldRange) {
                    dir = oldRange.index < range.index ? "left" : "right"
                }
                this.show(DownloadBlot.value(db.domNode), blot.domNode, dir)
                return;
            }
        } else {
            this.currentRange = null
        }
    }

    private subs: Subscription[] = []
    private set sub(s: Subscription) {
        this.subs.push(s)
    }
    private unsubscribe() {
        for (const s of this.subs) {
            if (!s.closed)
                s.unsubscribe()
        }
        this.subs.length = 0
    }

    private show(data: DownloadData, element: HTMLElement, position: QLCaretPosition = "right") {
        this.options.zone.run(() => {
            const _overlayRef = this.getOverlay()
            if (_overlayRef.hasAttached())
                return
            const quill = this.quill
            const range = this.currentRange
            const index = range.index

            _overlayRef.updatePositionStrategy(this.getScrollStrategy(element))
            this._portal = new ComponentPortal(QLDownloadTooltip, null, this.createInjector({
                data: data,
                position: position
            }))
            const _ref = _overlayRef.attach(this._portal)
            const instance = _ref.instance
            const closeOverlay = () => {
                this.unsubscribe()
                _overlayRef.detach()
                quill.setSelection(range.index, 0, "api")
            }
            this.sub = instance.change.subscribe((value: DownloadData) => {
                quill.formatText(range, DOWNLOAD, value, "api")
                _overlayRef.updatePosition()
            })

            this.sub = instance.close.subscribe((value: DownloadTooltipData) => {
                if (value) {
                    if(value.file) {
                        value.data.file.id = this.options.download.registerFile(value.file)
                        this.fileMap[value.data.file.id] = value.file
                    }
                    if (value.position == "right")
                        range.index = index + 1
                }
                else {
                    quill.deleteText(range.index, range.length, "user")
                }
                closeOverlay()
            })
            this.sub = _overlayRef.backdropClick().subscribe(_ => {
                range.index = index + 1
                closeOverlay()
            })

            _overlayRef.updatePosition()
        })
    }

    createInjector(data: DownloadTooltipData): PortalInjector {
        const injectorTokens = new WeakMap()
        injectorTokens.set(DOWNLOAD_TOOLTIP_DATA, data)
        return new PortalInjector(this.options.injector, injectorTokens)
    }
    private getOverlay() {
        if (!this._overlayRef) {
            const overlay = this.options.overlay
            const cfg: OverlayConfig = {
                panelClass: dialogTransparentConfig.panelClass,
                backdropClass: dialogTransparentConfig.backdropClass,
                hasBackdrop: true,
                scrollStrategy: overlay.scrollStrategies.reposition({
                    autoClose: true
                })
            }
            this._overlayRef = this.options.overlay.create(cfg)
        }

        return this._overlayRef
    }

    private getScrollStrategy(element: HTMLElement) {
        return this.options.overlay.position().connectedTo(
            new ElementRef(element), {
            originX: "start",
            originY: "top"
        }, {
            overlayX: "start",
            overlayY: "top"
        })
    }
}