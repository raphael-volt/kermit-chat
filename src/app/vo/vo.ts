import { DeltaOperation } from 'quill';
export type WatchStatus = 'on' | 'off' | ''
export type UserStatus = {
    status: WatchStatus
    id: number
}
export type WatchDiff = {
    user_id?: number,
    thread_opened?: number,
    active_threads?: {[threadId:number]: number[]},
    status: WatchStatus
    thread_user?: number
    thread: number
    thread_part: number
    users: number[]
}
export interface IVO {
    id?: number
}

export interface Thread extends IVO {
    read_by?: { [id: number]: number[] }
    subject?: string
    user_id?: number
    last_part?: number
}
export interface ThreadPartDeltaOperation {

}
export interface ThreadPart extends IVO {
    thread_id?: number
    user_id?: number
    content?: string | DeltaOperation[]
}

const isUser = (user: any): user is User => {
    if ("email" in user && "name" in user && "picto" in user && "id" in user)
        return true

    return false
}
export interface User extends IVO {
    email?: string
    name?: string
    picto?
    status?: WatchStatus
}

export interface ThreadTree {
    thread: Thread

    inserts: DeltaOperation[]
}

export interface ThreadDataItem extends IVO {
    user_id: number
    user?: User
    inserts: DeltaOperation[]
}
export interface ThreadData extends ThreadDataItem {
    thread: Thread
    contents: ThreadDataItem[]
}

export { isUser }