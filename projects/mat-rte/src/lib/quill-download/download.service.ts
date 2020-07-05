import { Injectable } from "@angular/core";
import { DeltaOperation } from 'quill';
import { Observable } from 'rxjs';
import { DownloadData, DOWNLOAD, findDownloads } from "../quill";
export type FileMap = { [id: number]: File }

@Injectable({
    providedIn: 'root'
})
export class DownloadService {

    private fileId: number = 0
    private fileMap: FileMap = {}

    registerFile(file: File) {
        const map = this.fileMap
        const id = this.fileId++
        map[id] = file
        return id
    }

    getFile(id: number) {
        return this.fileMap[id]
    }

    unregisterFile(id: number) {
        const map = this.fileMap
        if (id in map) {
            delete map[id]
        }
    }

    getFileIds(map: FileMap=null) {
        if(! map)
            map = this.fileMap
        const ids: number[] = []
        for (const key in map) {
            ids.push(+key)
        }
        return ids
    }

    getFileData(file: File): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const reader: FileReader = new FileReader()
            reader.onerror = reject
            reader.onloadend = () => resolve(reader.result as any)
            reader.readAsText(file)
        })
    }

    setFilesData(operations: DeltaOperation[]): Observable<number> {
        return new Observable<number>(obs => {
            const map = this.fileMap
            const items = findDownloads(operations)
            const next = () => {
                if (!items.length) {
                    return obs.complete()
                }
                const op: DownloadData = items.shift().insert.download
                const id = op.file.id
                const file = this.getFile(id)
                if (!file)
                    return obs.error('file not found')
                this.getFileData(file).then(data => {
                    this.unregisterFile(id)
                    op.file.data = data
                    obs.next(file.size)
                    next()
                })
            }
            next()
        })
    }
}