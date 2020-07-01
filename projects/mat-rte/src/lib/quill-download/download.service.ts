import { Injectable } from "@angular/core";
import { DeltaOperation } from 'quill';
import { Observable } from 'rxjs';
import { DownloadData, DOWNLOAD } from "../quill";
type FileMap = { [id: number]: File }
type FileMapCollection = { [id: number]: FileMap }
@Injectable({
    providedIn: 'root'
})
export class DownloadService {

    private mapId: number = 0
    private fileId: number = 0
    private fileMapCollection: FileMapCollection = {}


    createMap() {
        const id = this.mapId++
        this.fileMapCollection[id] = {}
        return id
    }
    clearMap(mapId: number) {
        const collection = this.fileMapCollection
        for (const mapId in collection)
            delete collection[mapId]
    }
    registerFile(file: File, mapId: number) {
        const map = this.fileMapCollection[mapId]
        if (!map)
            return undefined
        const id = this.fileId++
        map[id] = file
        return id
    }

    getFile(id: number, mapId: number) {
        const map = this.fileMapCollection[mapId]
        if (!map)
            return undefined
        return map[id]
    }

    unregisterFile(id: number, mapId: number) {
        const map = this.fileMapCollection[mapId]
        if (!map)
            return undefined
        if (id in map)
            delete map[id]
    }

    getFileData(file: File): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const reader: FileReader = new FileReader()
            reader.onerror = reject
            reader.onloadend = () => resolve(reader.result as any)
            reader.readAsText(file)
        })
    }

    findFile(id: number): File {
        const collection = this.fileMapCollection
        for (const mapId in collection) {
            const file = this.getFile(id, +mapId)
            if (file)
                return file
        }
        return undefined
    }

    setFilesData(operations: DeltaOperation[], mapId: number): Observable<number> {
        return new Observable<number>(obs => {
            const collection = this.fileMapCollection
            if (mapId in collection == false)
                return obs.error('file map not found')

            const items = operations.filter(op => (typeof op == "object" && DOWNLOAD in op)) as DownloadData[]
            const next = () => {
                if (!items.length) {
                    this.clearMap(mapId)
                    return obs.complete()
                }
                const op: DownloadData = items.shift()
                const id = op.file.id
                const file = this.getFile(id, mapId)
                if (!file)
                    return obs.error('file not found')
                this.getFileData(file).then(data => {
                    this.unregisterFile(id, mapId)
                    op.file.data = data
                    obs.next(file.size)
                    next()
                })
            }
            next()
        })
    }
}