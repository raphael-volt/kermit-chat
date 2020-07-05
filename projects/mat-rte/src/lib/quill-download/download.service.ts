import { Injectable } from "@angular/core";
import { DeltaOperation } from 'quill';
import { Observable } from 'rxjs';
<<<<<<< HEAD
import { DownloadData, DOWNLOAD } from "../quill";
type FileMap = { [id: number]: File }
type FileMapCollection = { [id: number]: FileMap }
=======
import { DownloadData, DOWNLOAD, findDownloads } from "../quill";
export type FileMap = { [id: number]: File }

>>>>>>> develop
@Injectable({
    providedIn: 'root'
})
export class DownloadService {

<<<<<<< HEAD
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
=======
    private fileId: number = 0
    private fileMap: FileMap = {}

    registerFile(file: File) {
        const map = this.fileMap
>>>>>>> develop
        const id = this.fileId++
        map[id] = file
        return id
    }

<<<<<<< HEAD
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
=======
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
>>>>>>> develop
    }

    getFileData(file: File): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const reader: FileReader = new FileReader()
            reader.onerror = reject
            reader.onloadend = () => resolve(reader.result as any)
            reader.readAsText(file)
        })
    }

<<<<<<< HEAD
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
=======
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
>>>>>>> develop
                    op.file.data = data
                    obs.next(file.size)
                    next()
                })
            }
            next()
        })
    }
}