import { EventManager } from '@angular/platform-browser';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class ResizeService {

  public onResize$ = new EventEmitter<{ width: number; height: number; }>();

  constructor(eventManager: EventManager) {
    eventManager.addGlobalEventListener('window', 'resize',
      e => this.onResize$.emit({
        width: e.target.innerWidth,
        height: e.target.innerHeight
      }));
  }
}