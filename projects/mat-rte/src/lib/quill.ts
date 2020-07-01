import { ValidatorFn } from '@angular/forms';
import { DeltaOperation } from 'quill';
import { InjectionToken, Injector } from '@angular/core';
import { Overlay, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { DownloadService } from './quill-download/download.service';
import { MatDialog } from '@angular/material/dialog';
export interface DownloadConfig {
    editable?: boolean
    overlay: Overlay
    download: DownloadService
    injector: Injector
    scrollable?: HTMLElement
    dialog: MatDialog
    sso: ScrollStrategyOptions
}
export const DOWNLOAD: string = "download"
export const IMAGE: string = "image"
export type DOBase<T> = {
    insert: T
}
export type ImgData = { image: string }
export type DownloadData = {
    url?: string
    label?: string
    file?: {
        id?: number
        name?: string
        size?: number
        mime?: string
        ext?: string
        data?:any
    }
}
export type QLCaretPosition = number | "left" | "right"
export type DownloadTooltipData = {
    data: DownloadData
    position: QLCaretPosition
    mapId:number
}
export const DOWNLOAD_TOOLTIP_DATA = new InjectionToken<DownloadTooltipData>('DOWNLOAD_TOOLTIP_DATA');
export type DOImage = DOBase<ImgData>
export type DODownload = DOBase<DownloadData>
export const isDOImage = (op: DeltaOperation): op is DOImage => {
    return op.insert == "object" && IMAGE in op.insert
}
export const isDODownload = (op: DeltaOperation): op is DODownload => {
    return op.insert == "object" && DOWNLOAD in op.insert
}

export const findImages = (operations: DeltaOperation[]): DOImage[] => {
    return operations.filter(isDOImage)
}
export const findDownloads = (operations: DeltaOperation[]): DODownload[] => {
    return operations.filter(isDODownload)
}

export const rteValidatorFn = (minLength: number): ValidatorFn => {

    return (control) => {
        const delta = control.value
        let n = 0
        if (delta) {
            let ops: any[]
            if ("ops" in delta) {
                ops = delta.ops
            }
            else {
                if (Array.isArray(delta))
                    ops = delta
            }
            if (ops) {
                for (const i of ops) {
                    if (typeof i.insert == "string") {
                        n += i.insert.replace(/\s+/g, '').length
                        continue
                    }
                    n++ // image, emoji, ...
                }
            }
        }
        let error = null
        if (n == 0) {
            error = { required: { required: true } }
        }
        else {
            if (n < minLength) {
                error = { minLength: { min: minLength, value: n } }
            }
        }
        return error
    }
}
