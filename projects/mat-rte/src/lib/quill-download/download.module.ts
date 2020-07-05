
import Quill, { RangeStatic } from 'quill'
import { DownloadBlot } from './download.blot';
<<<<<<< HEAD
import { DownloadData, DOWNLOAD, DOWNLOAD_TOOLTIP_DATA, QLCaretPosition, DownloadTooltipData, DownloadConfig } from '../quill';
=======
import { DownloadData, DOWNLOAD, DOWNLOAD_TOOLTIP_DATA, QLCaretPosition, DownloadTooltipData, DownloadConfig, findDownloads } from '../quill';
>>>>>>> develop
import { Subscription } from 'rxjs';
import { OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { QLDownloadTooltip } from './tooltip/tooltip.component';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { dialogTransparentConfig } from '../dialog-transparent-config';
import { ElementRef } from '@angular/core';
<<<<<<< HEAD
import { DialogPosition } from '@angular/material/dialog';
=======
import { FileMap } from './download.service';
>>>>>>> develop

const Module = Quill.import('core/module')

export class DownloadModule extends Module {

<<<<<<< HEAD
    private fileMapId: number
=======
    private fileMap: FileMap = {}
>>>>>>> develop
    private selectedText: string
    private currentRange: RangeStatic

    private _portal: ComponentPortal<QLDownloadTooltip>
    private _overlayRef: OverlayRef
<<<<<<< HEAD
=======
    private setTextFlag: boolean = false
>>>>>>> develop

    constructor(private quill: Quill, private options: DownloadConfig) {
        super(quill, options)
        if (options.editable === true) {
            options.scrollable = quill['container']
<<<<<<< HEAD
            this.fileMapId = options.download.createMap()
=======
>>>>>>> develop
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
<<<<<<< HEAD
=======
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
>>>>>>> develop
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
<<<<<<< HEAD

            const service = this.options.download
            const data: DownloadData = {
                label,
                file: {
                    name: file.name,
                    id: service.registerFile(file, this.fileMapId),
=======
            const map = this.fileMap
            const service = this.options.download
            const id = service.registerFile(file)
            map[id] = file

            const data: DownloadData = {
                label,
                file: {
                    id: id,
                    name: file.name,
>>>>>>> develop
                    size: file.size,
                    mime: file.type,
                    ext: file.name.split(".").pop()
                }
            }
            const quill = this.quill
            const range = this.currentRange
<<<<<<< HEAD
=======
            this.setTextFlag = true
>>>>>>> develop
            if (range.length) {
                quill.deleteText(range.index, range.length, "user")
            }
            quill.insertEmbed(range.index, DOWNLOAD, data)
            quill.focus()
            quill.setSelection(range.index + 1, 0)
<<<<<<< HEAD
=======
            setTimeout(() => this.setTextFlag = false)
>>>>>>> develop
        })
    }

    private selectionChange = (range: RangeStatic, oldRange: RangeStatic, source) => {
        if (range == null) return;
        if (range.length === 0 && source === "user") {
<<<<<<< HEAD
            const [blot, offset] = this.quill.scroll['descendant'](
                DownloadBlot,
                range.index
            )
            if (blot != null) {
                const db: DownloadBlot = blot as DownloadBlot
                this.currentRange = { index: range.index, length: blot.length() };
                console.log('selectionChange offset', offset, 'index', range.index, blot.length())

                let dir: QLCaretPosition
                if (oldRange)
                    dir = oldRange.index < range.index ? "left" : "right"
=======
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
>>>>>>> develop
                this.show(DownloadBlot.value(db.domNode), blot.domNode, dir)
                return;
            }
        } else {
            this.currentRange = null
        }
<<<<<<< HEAD
        this.hide()
    }

    private hide() {

=======
>>>>>>> develop
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
<<<<<<< HEAD
    private show(data: DownloadData, element: HTMLElement, position: QLCaretPosition = "right") {
        const index = this.currentRange.index
        const length = this.currentRange.length
        //const strategy = this.getScrollStrategy(element)
        const ref = this.options.dialog.open(QLDownloadTooltip, {
            panelClass: dialogTransparentConfig.panelClass,
            backdropClass: dialogTransparentConfig.backdropClass,
            hasBackdrop: true,
            autoFocus: true,
            restoreFocus: false,
            data: {
                data: data,
                position: position,
                mapId: this.fileMapId
            },
            scrollStrategy: this.options.sso.reposition()
        })

        const getElementPosition = (): DialogPosition => {
            const b = element.getBoundingClientRect()
            const p: DialogPosition = {
                left: `${b.left}px`,
                top: `${b.top}px`
            }
            return p
        }
        let label: DownloadData = { ...data }
        label.file = { ...label.file }
        const instance = ref.componentInstance
        this.sub = instance.change.subscribe((value: DownloadData) => {
            label = value
            this.quill.formatText(this.currentRange, DOWNLOAD, value, "user")
            ref.updatePosition(getElementPosition())
        })
        /*
        this.sub = instance.selectOut.subscribe(dir => {
            let newIndex = dir == "left" ? index: index + length
            if (newIndex > 0) {
                ref.close(label)
                this.close(label)
                this.quill.setSelection({ index: newIndex, length: 0 }, "silent")
            }
        })
        */
        this.sub = ref.afterClosed().subscribe((value: DownloadTooltipData) => {
            const quill = this.quill
            const range = this.currentRange
            this.unsubscribe()
            console.log('close', value)
            console.log('range', range)
            quill.focus()
            if (!value.data) {
                quill.deleteText(range.index, range.length)
            }
            else {
                if (value.position == "left") {
                    quill.setSelection(range.index-1, 0, "user")
                }
                else {
                    quill.setSelection(range.index + 1, 0, "user")
                }
                
            }
            /*
            if(value) {
                Object.assign(data, value)
                value = data
            }
            this.close(value)
            */
        })
        
        this.sub = ref.backdropClick().subscribe(_ => {
            this.unsubscribe()
            const range = this.currentRange
            this.quill.focus()
            this.quill.setSelection(range.index+1, 0, "user")

        })
        ref.updatePosition(getElementPosition())
    }
    private _show(data: DownloadData, element: HTMLElement, position: QLCaretPosition = "right") {
        const _overlayRef = this.getOverlay()
        if (_overlayRef.hasAttached())
            return
        console.log('DownloadModule show')
        const index = this.currentRange.index
        const length = this.currentRange.length
        _overlayRef.updatePositionStrategy(this.getScrollStrategy(element))
        this._portal = new ComponentPortal(QLDownloadTooltip, null, this.createInjector({
            data: data,
            position: position,
            mapId: this.fileMapId
        }))
        const _ref = _overlayRef.attach(this._portal)
        //const wrapper = get
        let label: DownloadData = { ...data }
        label.file = { ...label.file }
        const instance = _ref.instance
        this.sub = instance.change.subscribe((value: DownloadData) => {
            label = value
            this.quill.formatText(this.currentRange, DOWNLOAD, value, "user")
            _overlayRef.updatePosition()
        })
        this.sub = instance.selectOut.subscribe(dir => {
            let newIndex = dir == "left" ? index : index + length
            if (newIndex > 0) {
                this.close(label)
                this.quill.setSelection({ index: newIndex, length: 0 }, "silent")
            }
        })
        this.sub = instance.close.subscribe(value => {
            /*
            if(value) {
                Object.assign(data, value)
                value = data
            }
            */
            this.close(value)
        })

        this.sub = _overlayRef.backdropClick().subscribe(_ => {
            this.close(data)

        })

        _overlayRef.updatePosition()
    }
    private close = (data: DownloadData) => {
        this.unsubscribe()
        //this.quill.format(DOWNLOAD, data, "user")
        /*
        if (this._overlayRef.hasAttached())
            this._overlayRef.detach()

        if (data) {
            this.quill.setSelection(this.currentRange.index + 1, 0)
        }
        else {
            this.quill.deleteText(this.currentRange.index, this.currentRange.length)
        }
        setTimeout(() => {
            this.quill.focus()
        }, 30)
        */

    }
    private save() {

=======

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
>>>>>>> develop
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
<<<<<<< HEAD

=======
>>>>>>> develop
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