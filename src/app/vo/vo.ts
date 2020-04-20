import { DeltaOperation } from 'quill';

export interface IVO {
    id?:number
}

export interface Thread extends IVO
{
    subject?:number
    user_id?:number   
}

export interface ThreadPart extends IVO
{
    thread_id?:number
    user_id?:number
    content?:string
}

export interface User extends IVO
{
    email?: string
    name?: string
    picto?
}

export interface ThreadTree {
    thread: Thread,
    parts: ThreadPart[]
}

export interface ThreadDataItem {
    user_id: number
    user?: User
    inserts: DeltaOperation[]
}
export interface ThreadData extends ThreadDataItem {
    thread: Thread
    contents:ThreadDataItem[]
  }