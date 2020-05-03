import { DeltaOperation } from 'quill';

export interface IVO {
    id?:number
}

export interface Thread extends IVO
{
    subject?:number
    user_id?:number   
}
export interface ThreadPartDeltaOperation {
    
}
export interface ThreadPart extends IVO
{
    thread_id?:number
    user_id?:number
    content?:string | DeltaOperation
}

const isUser = (user: any): user is User => {
    if("email" in user && "name" in user && "picto" in user && "id" in user)
        return true

    return false
}
export interface User extends IVO
{
    email?: string
    name?: string
    picto?
}

export interface ThreadTree {
    thread: Thread

    inserts: DeltaOperation[]
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

  export {isUser}