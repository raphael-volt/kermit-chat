import { Injectable, EventEmitter } from '@angular/core';
import { User } from './vo/vo';

@Injectable({
  providedIn: 'root'
})
export class ContextService {

  public users: User[]
  public user: User
  public threadOpened=0
  public activeThreads: {[threadId:number]: number[]} = {}

  public  activeThreadReadChange: EventEmitter<number[]> = new EventEmitter()
  constructor() { }

  findUser(id: number) {
    return this.users.find(user => user.id == id)
  }
}
